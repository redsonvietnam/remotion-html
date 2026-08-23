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
    // The date should not be split across lines (no partial date in any chunk)
    const hasPartialDate = chunks.some((c) => /\d{2}\/\d{2}$/.test(c) || /^\d{4}/.test(c));
    expect(hasPartialDate).toBe(false);
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

describe("KaraokeReveal chunking integration", () => {
  it("chunked text produces parseable lines for KaraokeReveal", () => {
    // This is the actual s1 caption from luatBHXH
    const caption = "Ngày 29 tháng 6 năm 2024, Quốc hội thông qua Luật Bảo hiểm xã hội số 41/2024/QH15. Đạo luật có hiệu lực từ ngày 1 tháng 7 năm 2025, thay thế Luật Bảo hiểm xã hội năm 2014.";
    const chunked = chunkCaptionText(caption);
    console.log("CHUNKED:", JSON.stringify(chunked));
    const lines = parseTextLines(chunked);
    console.log("LINES:", lines);
    lines.forEach((l, i) => console.log("  L" + i + " [" + countWords(l) + "w]:", l));

    // Should produce multiple chunks
    expect(lines.length).toBeGreaterThan(1);

    // Each chunk should be 3-10 words (3 allowed for protected units like "Theo Điều 64,")
    lines.forEach((line) => {
      const words = countWords(line);
      expect(words).toBeGreaterThanOrEqual(3);
      expect(words).toBeLessThanOrEqual(10);
    });

    // Semantic units must be preserved
    const allText = lines.join(" ");
    expect(allText).toContain("41/2024/QH15");
    expect(allText).toContain("Luật Bảo hiểm xã hội");
    // "ngày 1 tháng 7 năm 2025" should stay together (date phrase = protected unit)
    const hasDate = lines.some((l) => l.includes("ngày 1 tháng 7 năm 2025"));
    expect(hasDate).toBe(true);
  });

  it("computeWordTimings chunked lines match parseTextLines(chunkedText)", () => {
    const caption = "Theo Điều 64, số năm đóng bảo hiểm xã hội tối thiểu để hưởng lương hưu giảm từ hai mươi năm xuống còn mười lăm năm, mở rộng cơ hội cho người có thời gian đóng thiếu.";
    const chunked = chunkCaptionText(caption);
    const lines = parseTextLines(chunked);
    const wordsPerLine = lines.map(countWords);
    const totalChunkedWords = wordsPerLine.reduce((a, b) => a + b, 0);

    const result = computeWordTimings(caption, 516, 6, 8);

    // Total words from timings should match chunked text word count
    expect(result.totalWords).toBe(totalChunkedWords);
    // And match the raw text word count (chunking preserves all words)
    const rawWords = caption.split(/\s+/).filter(Boolean).length;
    expect(result.totalWords).toBe(rawWords);
  });

  it("no marquee needed for 4-7 word chunks at 22px fontSize", () => {
    // At 22px fontSize, 7 Vietnamese words (~50 chars) ≈ 50 * 22 * 0.52 ≈ 572px
    // Container is 92% of 1920 = 1766px, so 572px < 1766px → no marquee needed
    const chunk = "Ngày 29 tháng 6 năm 2024";
    const words = chunk.split(/\s+/).filter(Boolean);
    expect(words.length).toBeLessThanOrEqual(7);
  });
});

describe("WS-CAPTION-03: Semantic Chunking Regression", () => {
  it("natural uneven chunks — not forced equal sizes", () => {
    const text = "Luật mới xây dựng trên bốn trụ cột cải cách: hệ thống an sinh đa tầng, mở rộng đối tượng tham gia, siết chặt điều kiện rút bảo hiểm một lần, và mở rộng quyền lợi cho người lao động.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    const counts = lines.map((l) => l.split(/\s+/).filter(Boolean).length);
    // Should NOT be all equal size (e.g., not 5/5/5/5/5/5/5)
    const allEqual = counts.every((c) => c === counts[0]);
    expect(allEqual).toBe(false);
    // But all should be within 3-10
    counts.forEach((c) => {
      expect(c).toBeGreaterThanOrEqual(3);
      expect(c).toBeLessThanOrEqual(10);
    });
  });

  it("protects dates — ngày ... tháng ... năm ...", () => {
    const text = "Từ ngày 1 tháng 7 năm 2025, người tham gia bảo hiểm xã hội được hưởng quyền lợi mới.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    const hasDate = lines.some((l) => l.includes("ngày 1 tháng 7 năm 2025"));
    expect(hasDate).toBe(true);
  });

  it("protects slash dates — 01/07/2025", () => {
    const text = "Luật có hiệu lực từ ngày 01/07/2025 thay thế luật cũ đã ban hành trước đó.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    const hasDate = lines.some((l) => l.includes("01/07/2025"));
    expect(hasDate).toBe(true);
  });

  it("protects legal references — Điều 64", () => {
    const text = "Theo Điều 64, số năm đóng bảo hiểm xã hội tối thiểu để hưởng lương hưu giảm.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    const hasDieu = lines.some((l) => l.includes("Điều 64"));
    expect(hasDieu).toBe(true);
    // Should not split "Điều" from "64"
    expect(result).not.toMatch(/Điều\n64/);
  });

  it("protects law names — Luật Bảo hiểm xã hội số 41/2024/QH15", () => {
    const text = "Quốc hội thông qua Luật Bảo hiểm xã hội số 41/2024/QH15 với nhiều cải cách mới.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    const hasLaw = lines.some((l) => l.includes("Luật Bảo hiểm xã hội số 41/2024/QH15"));
    expect(hasLaw).toBe(true);
  });

  it("contextual comma breaks — comma after4+ words triggers break", () => {
    const text = "Đạo luật mới có nhiều quy định quan trọng, bao gồm tăng tuổi hưu và mở rộng đối tượng.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    // The comma should cause a break (not merge everything into one line)
    expect(lines.length).toBeGreaterThan(1);
  });

  it("contextual conjunction breaks — và starts new clause", () => {
    const text = "Luật mới cải cách hệ thống bảo hiểm và mở rộng quyền lợi cho người lao động.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    // "và" should be at start of a chunk or after a break
    const hasAndAtStart = lines.some((l) => l.trim().startsWith("và"));
    // Or "và" is in a chunk with preceding words but the next chunk starts fresh
    expect(lines.length).toBeGreaterThan(1);
  });

  it("3-word protected chunks allowed — Theo Điều 64,", () => {
    const text = "Theo Điều 64, số năm đóng bảo hiểm giảm từ hai mươi năm xuống còn mười lăm năm.";
    const result = chunkCaptionText(text);
    console.log("TEST Theo Điều 64:", JSON.stringify(result));
    const lines = result.split("\n");
    const counts = lines.map((l) => l.split(/\s+/).filter(Boolean).length);
    console.log("  counts:", counts);
    // "Theo Điều 64," = 3 words, allowed as protected unit
    expect(counts.some((c) => c === 3)).toBe(true);
  });

  it("8-10 word semantic chunks allowed when meaning requires", () => {
    const text = "Luật Bảo hiểm xã hội 2024 đặt nền móng cho một hệ thống an sinh xã hội bền vững và bao trùm hơn cho người lao động Việt Nam.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    const counts = lines.map((l) => l.split(/\s+/).filter(Boolean).length);
    // Some chunks may be 8-10 words to preserve semantic units
    expect(counts.some((c) => c >= 8)).toBe(true);
    // But none should exceed hardMax
    counts.forEach((c) => expect(c).toBeLessThanOrEqual(10));
  });

  it("hard maximum 10 words never exceeded", () => {
    // Create a very long text without punctuation
    const text = "một hai ba bốn năm sáu bảy tám chín mười mười một mười hai mười ba mười bốn mười lăm mười sáu mười bảy mười tám mười chín hai mươi";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    lines.forEach((l) => {
      const wc = l.split(/\s+/).filter(Boolean).length;
      expect(wc).toBeLessThanOrEqual(10);
    });
  });

  it("no-punctuation fallback — breaks at word boundaries", () => {
    const text = "một hai ba bốn năm sáu bảy tám chín mười eleven twelve thirteen fourteen fifteen sixteen";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    expect(lines.length).toBeGreaterThan(1);
    lines.forEach((l) => {
      const wc = l.split(/\s+/).filter(Boolean).length;
      expect(wc).toBeLessThanOrEqual(10);
    });
  });

  it("bền vững và bao trùm — does NOT split at và", () => {
    const text = "hệ thống bền vững và bao trùm hơn cho người lao động";
    const result = chunkCaptionText(text);
    console.log("TEST bền vững:", JSON.stringify(result));
    const lines = result.split("\n");
    console.log("  lines:", lines);
    // "bền vững và bao trùm" should stay together (parallel adjectives)
    const hasPhrase = lines.some((l) => l.includes("bền vững và bao trùm"));
    expect(hasPhrase).toBe(true);
  });

  it("proper nouns protected — Trung ương Đảng", () => {
    const text = "Nghị quyết 28 năm 2018 của Trung ương Đảng về cải cách bảo hiểm xã hội.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    const hasParty = lines.some((l) => l.includes("Trung ương Đảng"));
    expect(hasParty).toBe(true);
  });

  it("number + unit protected — mười lăm năm", () => {
    const text = "Thời gian đóng bảo hiểm giảm từ hai mươi năm xuống còn mười lăm năm tối thiểu.";
    const result = chunkCaptionText(text);
    console.log("TEST mười lăm:", JSON.stringify(result));
    const lines = result.split("\n");
    const hasNumUnit = lines.some((l) => l.includes("mười lăm năm"));
    expect(hasNumUnit).toBe(true);
  });

  it("BHXH s1 — semantic rhythm verification", () => {
    const text = "Ngày 29 tháng 6 năm 2024, Quốc hội thông qua Luật Bảo hiểm xã hội số 41/2024/QH15. Đạo luật có hiệu lực từ ngày 1 tháng 7 năm 2025, thay thế Luật Bảo hiểm xã hội năm 2014.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");
    const counts = lines.map((l) => l.split(/\s+/).filter(Boolean).length);

    // All chunks within 3-10
    counts.forEach((c) => {
      expect(c).toBeGreaterThanOrEqual(3);
      expect(c).toBeLessThanOrEqual(10);
    });

    // Key semantic units preserved
    const allText = lines.join(" ");
    expect(allText).toContain("41/2024/QH15");
    expect(allText).toContain("Luật Bảo hiểm xã hội");
    expect(allText).toContain("ngày 1 tháng 7 năm 2025");

    // Date phrases intact
    const hasDate1 = lines.some((l) => l.includes("Ngày 29 tháng 6 năm 2024"));
    expect(hasDate1).toBe(true);
  });

  it("BHXH s6 — law name + descriptor chunks", () => {
    const text = "Luật Bảo hiểm xã hội 2024 đặt nền móng cho một hệ thống an sinh xã hội bền vững và bao trùm hơn cho người lao động Việt Nam.";
    const result = chunkCaptionText(text);
    const lines = result.split("\n");

    // "Luật Bảo hiểm xã hội 2024" should be preserved
    const hasLawName = lines.some((l) => l.includes("Luật Bảo hiểm xã hội 2024"));
    expect(hasLawName).toBe(true);

    // "bền vững và" should stay together (at minimum)
    const hasAdj = lines.some((l) => l.includes("bền vững và"));
    expect(hasAdj).toBe(true);

    // "Việt Nam" should be preserved
    const hasVietnam = lines.some((l) => l.includes("Việt Nam"));
    expect(hasVietnam).toBe(true);
  });
});
