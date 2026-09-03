// ---------------------------------------------------------------------------
// SVG Engine — Unit Tests
//
// Standalone tests for deterministic logic (SVG math functions).
// Run with: npx tsx src/design/svg/__tests__/svgMath.test.ts
// ---------------------------------------------------------------------------

import { computeTickMarks, clampProgress } from "../types";

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

function approxEqual(a: number, b: number, eps = 0.01): boolean {
  return Math.abs(a - b) < eps;
}

// ===========================================================================
// clampProgress
// ===========================================================================
console.log("\nclampProgress:");

assertEqual(clampProgress(0.5), 0.5, "normal value passes through");
assertEqual(clampProgress(0), 0, "zero stays zero");
assertEqual(clampProgress(1), 1, "one stays one");
assertEqual(clampProgress(-0.5), 0, "negative clamps to 0");
assertEqual(clampProgress(1.5), 1, "above 1 clamps to 1");
assertEqual(clampProgress(999), 1, "large value clamps to 1");
assertEqual(clampProgress(-999), 0, "large negative clamps to 0");

// ===========================================================================
// computeTickMarks
// ===========================================================================
console.log("\ncomputeTickMarks:");

{
  // 8 ticks around a circle at (50,50) with inner=51, outer=55
  // This matches NQ57's RingDraw pattern
  const marks = computeTickMarks(8, 50, 50, 51, 55);
  assertEqual(marks.length, 8, "8 ticks generated");

  // First tick should be at top (-PI/2)
  // cos(-PI/2) = 0, sin(-PI/2) = -1
  // x1 = 50 + 0*51 = 50, y1 = 50 + (-1)*51 = -1
  assert(approxEqual(marks[0].x1, 50), "tick 0 x1 = 50 (top)");
  assert(approxEqual(marks[0].y1, -1), "tick 0 y1 = -1 (top)");
  assert(approxEqual(marks[0].x2, 50), "tick 0 x2 = 50 (top)");
  assert(approxEqual(marks[0].y2, -5), "tick 0 y2 = -5 (top)");
}

{
  // 4 ticks — should be at top, right, bottom, left
  const marks = computeTickMarks(4, 50, 50, 40, 45);
  assertEqual(marks.length, 4, "4 ticks generated");

  // Tick 0: top (-PI/2)
  assert(approxEqual(marks[0].x1, 50), "4-tick: tick 0 x1 = 50");
  assert(approxEqual(marks[0].y1, 10), "4-tick: tick 0 y1 = 10");

  // Tick 1: right (0)
  assert(approxEqual(marks[1].x1, 90), "4-tick: tick 1 x1 = 90");
  assert(approxEqual(marks[1].y1, 50), "4-tick: tick 1 y1 = 50");

  // Tick 2: bottom (PI/2)
  assert(approxEqual(marks[2].x1, 50), "4-tick: tick 2 x1 = 50");
  assert(approxEqual(marks[2].y1, 90), "4-tick: tick 2 y1 = 90");

  // Tick 3: left (PI)
  assert(approxEqual(marks[3].x1, 10), "4-tick: tick 3 x1 = 10");
  assert(approxEqual(marks[3].y1, 50), "4-tick: tick 3 y1 = 50");
}

{
  // 0 ticks
  const marks = computeTickMarks(0, 50, 50, 40, 45);
  assertEqual(marks.length, 0, "0 ticks returns empty array");
}

{
  // 1 tick
  const marks = computeTickMarks(1, 50, 50, 40, 45);
  assertEqual(marks.length, 1, "1 tick");
}

// ===========================================================================
// Determinism
// ===========================================================================
console.log("\nDeterminism:");

{
  const m1 = computeTickMarks(8, 50, 50, 51, 55);
  const m2 = computeTickMarks(8, 50, 50, 51, 55);
  assertEqual(m1, m2, "same input produces identical output");
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
