import { describe, it, expect } from "vitest";
import {
  parseTextLines,
  countWords,
  computeWordTimings,
  getActiveWordIndex,
  getWordProgress,
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
