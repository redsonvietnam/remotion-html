// ---------------------------------------------------------------------------
// Typography Engine — Unit Tests
//
// Standalone tests for deterministic logic (word timing calculations).
// Run with: npx tsx src/design/typography/__tests__/wordTimings.test.ts
//
// No test framework required — pure assertion-based.
// ---------------------------------------------------------------------------

import {
  parseTextLines,
  countWords,
  computeWordTimings,
  getActiveWordIndex,
  getWordProgress,
} from "../useWordTimings";
import type { WordTiming } from "../types";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.log(`  ✗ ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  const eq = JSON.stringify(actual) === JSON.stringify(expected);
  if (eq) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.log(`  ✗ ${message}`);
    console.log(`    expected: ${JSON.stringify(expected)}`);
    console.log(`    actual:   ${JSON.stringify(actual)}`);
  }
}

// ===========================================================================
// parseTextLines
// ===========================================================================
console.log("\nparseTextLines:");

assertEqual(
  parseTextLines("Hello World"),
  ["Hello World"],
  "single line"
);

assertEqual(
  parseTextLines("Line 1\nLine 2\nLine 3"),
  ["Line 1", "Line 2", "Line 3"],
  "multi-line"
);

assertEqual(
  parseTextLines("  Hello  \n  World  "),
  ["Hello", "World"],
  "trims whitespace"
);

assertEqual(
  parseTextLines("\n\n\n"),
  [],
  "empty lines filtered"
);

assertEqual(
  parseTextLines(""),
  [],
  "empty string"
);

// ===========================================================================
// countWords
// ===========================================================================
console.log("\ncountWords:");

assertEqual(countWords("Hello World"), 2, "two words");
assertEqual(countWords("One"), 1, "single word");
assertEqual(countWords("  spaced  "), 1, "spaced single word");
assertEqual(countWords(""), 0, "empty string");
assertEqual(countWords("a b c d e"), 5, "five words");

// ===========================================================================
// computeWordTimings
// ===========================================================================
console.log("\ncomputeWordTimings:");

{
  const result = computeWordTimings("Hello World", 100, 6, 8);
  assertEqual(result.totalWords, 2, "total words = 2");
  assertEqual(result.timings.length, 2, "timings array length = 2");
  assertEqual(result.timings[0].word, "Hello", "first word = Hello");
  assertEqual(result.timings[1].word, "World", "second word = World");
  assert(result.timings[0].startFrame >= 6, "first word starts after offset");
  assert(
    result.timings[1].startFrame > result.timings[0].startFrame,
    "second word starts after first"
  );
}

{
  const result = computeWordTimings("One Two Three", 150, 6, 8);
  assertEqual(result.totalWords, 3, "three words");
  assertEqual(result.timings.length, 3, "three timing entries");
  // Verify linear spacing
  const gap1 = result.timings[1].startFrame - result.timings[0].startFrame;
  const gap2 = result.timings[2].startFrame - result.timings[1].startFrame;
  assert(Math.abs(gap1 - gap2) <= 1, "words are evenly spaced");
}

{
  const result = computeWordTimings("", 100, 6, 8);
  assertEqual(result.totalWords, 0, "empty text = 0 words");
  assertEqual(result.timings.length, 0, "empty timings");
}

{
  const result = computeWordTimings("A B\nC D", 200, 6, 8);
  assertEqual(result.totalWords, 4, "multi-line word count");
  assertEqual(result.timings[2].word, "C", "third word crosses line");
}

// ===========================================================================
// getActiveWordIndex
// ===========================================================================
console.log("\ngetActiveWordIndex:");

{
  const timings: WordTiming[] = [
    { word: "Hello", index: 0, startFrame: 10, endFrame: 20, charOffset: 0 },
    { word: "World", index: 1, startFrame: 20, endFrame: 30, charOffset: 6 },
    { word: "Foo", index: 2, startFrame: 30, endFrame: 40, charOffset: 12 },
  ];

  assertEqual(getActiveWordIndex(timings, 0), 0, "frame 0 → first word");
  assertEqual(getActiveWordIndex(timings, 10), 0, "frame 10 → first word");
  assertEqual(getActiveWordIndex(timings, 15), 0, "frame 15 → first word");
  assertEqual(getActiveWordIndex(timings, 20), 1, "frame 20 → second word");
  assertEqual(getActiveWordIndex(timings, 25), 1, "frame 25 → second word");
  assertEqual(getActiveWordIndex(timings, 30), 2, "frame 30 → third word");
  assertEqual(getActiveWordIndex(timings, 100), 2, "frame 100 → last word");
}

// ===========================================================================
// getWordProgress
// ===========================================================================
console.log("\ngetWordProgress:");

{
  const timing: WordTiming = {
    word: "Test",
    index: 0,
    startFrame: 10,
    endFrame: 20,
    charOffset: 0,
  };

  assertEqual(getWordProgress(timing, 5, 30), 0, "before start → 0");
  assertEqual(getWordProgress(timing, 10, 30), 0, "at start → 0");
  assertEqual(getWordProgress(timing, 20, 30), 1, "at end → 1");
  assertEqual(getWordProgress(timing, 25, 30), 1, "after end → 1 (clamped)");

  const mid = getWordProgress(timing, 15, 30);
  assert(mid > 0.4 && mid < 0.6, "midpoint ≈ 0.5");
}

// ===========================================================================
// Determinism check
// ===========================================================================
console.log("\nDeterminism:");

{
  // Same input → same output (no randomness, no wall-clock)
  const r1 = computeWordTimings("Hello World", 100, 6, 8);
  const r2 = computeWordTimings("Hello World", 100, 6, 8);
  assertEqual(r1, r2, "same input produces identical output");
}

// ===========================================================================
// Summary
// ===========================================================================
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${"=".repeat(40)}`);

if (failed > 0) {
  process.exit(1);
}
