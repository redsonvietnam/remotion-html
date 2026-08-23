import { describe, it, expect } from "vitest";
import {
  parseTextLines,
  countWords,
  computeWordTimings,
  getActiveWordIndex,
  getWordProgress,
  chunkCaptionText,
} from "../useWordTimings";
import type { WordTiming } from "../types";

describe("parseTextLines", () => {
  it("single line", () => {
    expect(parseTextLines("Hello World")).toEqual(["Hello World"]);
  });

  it("multi-line", () => {
    expect(parseTextLines("Line 1\nLine 2\nLine 3")).toEqual(["Line 1", "Line 2", "Line 3"]);
  });

  it("trims whitespace", () => {
    expect(parseTextLines("  Hello  \n  World  ")).toEqual(["Hello", "World"]);
  });

  it("filters empty lines", () => {
    expect(parseTextLines("\n\n\n")).toEqual([]);
  });

  it("empty string", () => {
    expect(parseTextLines("")).toEqual([]);
  });
});

describe("countWords", () => {
  it("two words", () => {
    expect(countWords("Hello World")).toBe(2);
  });

  it("single word", () => {
    expect(countWords("One")).toBe(1);
  });

  it("spaced single word", () => {
    expect(countWords("  spaced  ")).toBe(1);
  });

  it("empty string", () => {
    expect(countWords("")).toBe(0);
  });

  it("five words", () => {
    expect(countWords("a b c d e")).toBe(5);
  });
});

describe("computeWordTimings", () => {
  it("correct word count and timings length", () => {
    const result = computeWordTimings("Hello World", 100, 6, 8);
    expect(result.totalWords).toBe(2);
    expect(result.timings.length).toBe(2);
    expect(result.timings[0].word).toBe("Hello");
    expect(result.timings[1].word).toBe("World");
  });

  it("first word starts after offset", () => {
    const result = computeWordTimings("Hello World", 100, 6, 8);
    expect(result.timings[0].startFrame).toBeGreaterThanOrEqual(6);
  });

  it("words are ordered", () => {
    const result = computeWordTimings("Hello World", 100, 6, 8);
    expect(result.timings[1].startFrame).toBeGreaterThan(result.timings[0].startFrame);
  });

  it("three words are evenly spaced", () => {
    const result = computeWordTimings("One Two Three", 150, 6, 8);
    expect(result.totalWords).toBe(3);
    const gap1 = result.timings[1].startFrame - result.timings[0].startFrame;
    const gap2 = result.timings[2].startFrame - result.timings[1].startFrame;
    expect(Math.abs(gap1 - gap2)).toBeLessThanOrEqual(1);
  });

  it("empty text", () => {
    const result = computeWordTimings("", 100, 6, 8);
    expect(result.totalWords).toBe(0);
    expect(result.timings.length).toBe(0);
  });

  it("multi-line word count", () => {
    const result = computeWordTimings("A B\nC D", 200, 6, 8);
    expect(result.totalWords).toBe(4);
    expect(result.timings[2].word).toBe("C");
  });

  it("deterministic", () => {
    const r1 = computeWordTimings("Hello World", 100, 6, 8);
    const r2 = computeWordTimings("Hello World", 100, 6, 8);
    expect(r1).toEqual(r2);
  });
});

describe("getActiveWordIndex", () => {
  const timings: WordTiming[] = [
    { word: "Hello", index: 0, startFrame: 10, endFrame: 20, charOffset: 0 },
    { word: "World", index: 1, startFrame: 20, endFrame: 30, charOffset: 6 },
    { word: "Foo", index: 2, startFrame: 30, endFrame: 40, charOffset: 12 },
  ];

  it("frame 0 → first word", () => {
    expect(getActiveWordIndex(timings, 0)).toBe(0);
  });

  it("frame 10 → first word", () => {
    expect(getActiveWordIndex(timings, 10)).toBe(0);
  });

  it("frame 15 → first word", () => {
    expect(getActiveWordIndex(timings, 15)).toBe(0);
  });

  it("frame 20 → second word", () => {
    expect(getActiveWordIndex(timings, 20)).toBe(1);
  });

  it("frame 25 → second word", () => {
    expect(getActiveWordIndex(timings, 25)).toBe(1);
  });

  it("frame 30 → third word", () => {
    expect(getActiveWordIndex(timings, 30)).toBe(2);
  });

  it("frame 100 → last word", () => {
    expect(getActiveWordIndex(timings, 100)).toBe(2);
  });
});

describe("getWordProgress", () => {
  const timing: WordTiming = {
    word: "Test",
    index: 0,
    startFrame: 10,
    endFrame: 20,
    charOffset: 0,
  };

  it("before start → 0", () => {
    expect(getWordProgress(timing, 5, 30)).toBe(0);
  });

  it("at start → 0", () => {
    expect(getWordProgress(timing, 10, 30)).toBe(0);
  });

  it("at end → 1", () => {
    expect(getWordProgress(timing, 20, 30)).toBe(1);
  });

  it("after end → 1 (clamped)", () => {
    expect(getWordProgress(timing, 25, 30)).toBe(1);
  });

  it("midpoint ≈ 0.5", () => {
    const mid = getWordProgress(timing, 15, 30);
    expect(mid).toBeGreaterThan(0.4);
    expect(mid).toBeLessThan(0.6);
  });
});

describe("chunkCaptionText", () => {
  it("short text under maxWords returns unchanged", () => {
    expect(chunkCaptionText("Hello World")).toBe("Hello World");
    expect(chunkCaptionText("One two three four five six")).toBe("One two three four five six");
  });

  it("long text splits into 4-7 word chunks", () => {
    const text = "One two three four five six seven eight nine ten eleven twelve";
    const result = chunkCaptionText(text);
    console.log("Long text result:", JSON.stringify(result));
    console.log("Lines:", result.split("\n").map(l => l.split(/\s+/).filter(Boolean).length));
    const lines = result.split("\n");
    expect(lines.length).toBeGreaterThan(1);
    lines.forEach((line) => {
      const words = line.split(/\s+/).filter(Boolean);
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(7);
    });
  });

  it("preserves number + unit combinations", () => {
    const text = "Số năm đóng bảo hiểm tối thiểu là 15 năm để hưởng lương hưu";
    const result = chunkCaptionText(text);
    // "15 năm" should stay together
    expect(result).not.toContain("15\nnăm");
    // Check that "15 năm" appears intact in some chunk
    const chunks = result.split("\n");
    const has15nam = chunks.some((c) => c.includes("15 năm"));
    expect(has15nam).toBe(true);
  });

  it("preserves percentages", () => {
    const text = "Tỷ lệ đóng là 25,5% mức lương làm căn cứ";
    const result = chunkCaptionText(text);
    expect(result).not.toContain("25,5\n%");
    const chunks = result.split("\n");
    const hasPercent = chunks.some((c) => c.includes("25,5%"));
    expect(hasPercent).toBe(true);
  });

  it("preserves dates", () => {
    const text = "Luật có hiệu lực từ ngày 01/07/2025 thay thế luật cũ";
    const result = chunkCaptionText(text);
    const chunks = result.split("\n");
    // The date should appear intact in some chunk
    const hasDate = chunks.some((c) => c.includes("01/07/2025"));
    expect(hasDate).toBe(true);
    // The date should not be split across lines
    expect(result).not.toContain("01/07/2025\nthay");
  });

  it("preserves legal references", () => {
    const text = "Theo Điều 64 số năm đóng bảo hiểm giảm từ 20 xuống 15 năm";
    const result = chunkCaptionText(text);
    expect(result).not.toContain("Điều\n64");
    expect(result).not.toContain("20\nxuống");
    const chunks = result.split("\n");
    const hasDieu64 = chunks.some((c) => c.includes("Điều 64"));
    expect(hasDieu64).toBe(true);
  });

  it("splits at punctuation boundaries", () => {
    const text = "Clause one. Clause two, with comma. Clause three! Clause four? Clause five and six. Clause seven eight nine ten eleven twelve.";
    const result = chunkCaptionText(text, 4, 7);
    console.log("Punctuation test result:", JSON.stringify(result));
    console.log("Lines:", result.split("\n").map(l => l.split(/\s+/).filter(Boolean).length));
    const lines = result.split("\n");
    // Should have multiple lines
    expect(lines.length).toBeGreaterThan(1);
    lines.forEach((line) => {
      const words = line.split(/\s+/).filter(Boolean);
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(7);
    });
  });

  it("short caption returns unchanged", () => {
    expect(chunkCaptionText("Short caption")).toBe("Short caption");
    expect(chunkCaptionText("Một câu ngắn")).toBe("Một câu ngắn");
  });

  it("hard maximum respected", () => {
    const longText = "One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen";
    const result = chunkCaptionText(longText, 4, 7, 10);
    const lines = result.split("\n");
    lines.forEach((line) => {
      const words = line.split(/\s+/).filter(Boolean);
      expect(words.length).toBeLessThanOrEqual(10);
    });
  });

  it("multi-word Vietnamese terms preserved", () => {
    const text = "Luật Bảo hiểm xã hội 2024 có hiệu lực từ 01/07/2025";
    const result = chunkCaptionText(text);
    const chunks = result.split("\n");
    // "Luật Bảo hiểm xã hội" should stay together if fits
    const hasFullLaw = chunks.some((c) => c.includes("Luật Bảo hiểm xã hội"));
    expect(hasFullLaw).toBe(true);
  });

  it("exact one-line output for KaraokeReveal", () => {
    const text = "This is a very long caption that should be split into multiple lines for single row display in karaoke reveal component";
    const result = chunkCaptionText(text);
    console.log("Long caption result:", JSON.stringify(result));
    console.log("Lines:", result.split("\n").map(l => l.split(/\s+/).filter(Boolean).length));
    const lines = result.split("\n");
    // Should create multiple lines
    expect(lines.length).toBeGreaterThan(1);
    lines.forEach((line) => {
      const words = line.split(/\s+/).filter(Boolean);
      // Each line should have 4-7 words (or up to hard max 10)
      expect(words.length).toBeGreaterThanOrEqual(4);
      expect(words.length).toBeLessThanOrEqual(10);
    });
    // Total words preserved
    const totalWords = lines.join(" ").split(/\s+/).filter(Boolean).length;
    const originalWords = text.split(/\s+/).filter(Boolean).length;
    expect(totalWords).toBe(originalWords);
  });
});
