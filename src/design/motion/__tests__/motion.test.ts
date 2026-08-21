// ---------------------------------------------------------------------------
// Motion System — Unit Tests
// Run: npx tsx src/design/motion/__tests__/motion.test.ts
// ---------------------------------------------------------------------------

import { clampProgress } from "../types";
import {
  linearProgress,
  delayedProgress,
  staggerProgress,
  secondsToFrames,
  framesToSeconds,
} from "../timing";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) { passed++; console.log("  OK: " + msg); }
  else { failed++; console.log("  FAIL: " + msg); }
}

function assertEqual<T>(actual: T, expected: T, msg: string) {
  const eq = JSON.stringify(actual) === JSON.stringify(expected);
  if (eq) { passed++; console.log("  OK: " + msg); }
  else {
    failed++;
    console.log("  FAIL: " + msg);
    console.log("    expected: " + JSON.stringify(expected));
    console.log("    actual:   " + JSON.stringify(actual));
  }
}

function approxEqual(a: number, b: number, eps = 0.01): boolean {
  return Math.abs(a - b) < eps;
}

// ===========================================================================
// clampProgress
// ===========================================================================
console.log("\nclampProgress:");
assert(clampProgress(0.5) === 0.5, "normal value");
assert(clampProgress(0) === 0, "zero");
assert(clampProgress(1) === 1, "one");
assert(clampProgress(-0.5) === 0, "negative clamps to 0");
assert(clampProgress(1.5) === 1, "above 1 clamps to 1");
assert(clampProgress(999) === 1, "large value");
assert(clampProgress(-999) === 0, "large negative");

// ===========================================================================
// linearProgress
// ===========================================================================
console.log("\nlinearProgress:");
assert(approxEqual(linearProgress({ frame: 0, startFrame: 0, endFrame: 100 }), 0), "frame 0 = 0");
assert(approxEqual(linearProgress({ frame: 50, startFrame: 0, endFrame: 100 }), 0.5), "frame 50 = 0.5");
assert(approxEqual(linearProgress({ frame: 100, startFrame: 0, endFrame: 100 }), 1), "frame 100 = 1");
assert(approxEqual(linearProgress({ frame: 150, startFrame: 0, endFrame: 100 }), 1), "frame 150 clamped to 1");
assert(approxEqual(linearProgress({ frame: -10, startFrame: 0, endFrame: 100 }), 0), "frame -10 clamped to 0");
assert(approxEqual(linearProgress({ frame: 10, startFrame: 20, endFrame: 60 }), 0), "before start = 0");
assert(approxEqual(linearProgress({ frame: 40, startFrame: 20, endFrame: 60 }), 0.5), "midpoint = 0.5");
assert(approxEqual(linearProgress({ frame: 60, startFrame: 20, endFrame: 60 }), 1), "at end = 1");

// ===========================================================================
// delayedProgress
// ===========================================================================
console.log("\ndelayedProgress:");
assert(approxEqual(delayedProgress(0, { delay: 10, duration: 20 }), 0), "before delay = 0");
assert(approxEqual(delayedProgress(10, { delay: 10, duration: 20 }), 0), "at delay = 0");
assert(approxEqual(delayedProgress(20, { delay: 10, duration: 20 }), 0.5), "midpoint = 0.5");
assert(approxEqual(delayedProgress(30, { delay: 10, duration: 20 }), 1), "at end = 1");
assert(approxEqual(delayedProgress(40, { delay: 10, duration: 20 }), 1), "after end = 1");

// ===========================================================================
// staggerProgress
// ===========================================================================
console.log("\nstaggerProgress:");
assert(approxEqual(staggerProgress(0, { index: 0, stagger: 14, duration: 10 }), 0), "item 0 frame 0 = 0");
assert(approxEqual(staggerProgress(14, { index: 0, stagger: 14, duration: 10 }), 1), "item 0 at end = 1");
assert(approxEqual(staggerProgress(14, { index: 1, stagger: 14, duration: 10 }), 0), "item 1 starts at 14");
assert(approxEqual(staggerProgress(28, { index: 1, stagger: 14, duration: 10 }), 1), "item 1 ends at 28");
assert(approxEqual(staggerProgress(21, { index: 1, stagger: 14, duration: 10 }), 0.5), "item 1 midpoint");

// ===========================================================================
// secondsToFrames / framesToSeconds
// ===========================================================================
console.log("\nsecondsToFrames / framesToSeconds:");
assertEqual(secondsToFrames(2.5, 30), 75, "2.5s @ 30fps = 75 frames");
assertEqual(secondsToFrames(1, 60), 60, "1s @ 60fps = 60 frames");
assertEqual(secondsToFrames(0, 30), 0, "0s = 0 frames");
assert(approxEqual(framesToSeconds(75, 30), 2.5), "75 frames @ 30fps = 2.5s");
assert(approxEqual(framesToSeconds(60, 60), 1), "60 frames @ 60fps = 1s");
assert(approxEqual(framesToSeconds(0, 30), 0), "0 frames = 0s");

// ===========================================================================
// Determinism
// ===========================================================================
console.log("\nDeterminism:");
const r1 = linearProgress({ frame: 42, startFrame: 10, endFrame: 80 });
const r2 = linearProgress({ frame: 42, startFrame: 10, endFrame: 80 });
assert(r1 === r2, "same input produces identical output");

// ===========================================================================
// Summary
// ===========================================================================
console.log("\n========================================");
console.log("Results: " + passed + " passed, " + failed + " failed");
console.log("========================================");

if (failed > 0) { process.exit(1); }
