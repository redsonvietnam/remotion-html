// ---------------------------------------------------------------------------
// Transition System — Unit Tests
// Run: npx tsx src/design/transition/__tests__/transition.test.ts
// ---------------------------------------------------------------------------

import { getPreset, resolveConfig, totalFrames, sceneFrames } from "../helpers";
import { PRESETS, DEFAULT_TRANSITION } from "../types";

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

// ===========================================================================
// getPreset
// ===========================================================================
console.log("\ngetPreset:");
assertEqual(getPreset("fade").type, "fade", "fade preset");
assertEqual(getPreset("fade").durationInFrames, 16, "fade duration");
assertEqual(getPreset("cut").type, "none", "cut preset = none");
assertEqual(getPreset("cut").durationInFrames, 0, "cut duration = 0");
assertEqual(getPreset("slideLeft").type, "slide", "slideLeft preset");
assertEqual(getPreset("slideLeft").slideDirection, "left", "slideLeft direction");

// ===========================================================================
// resolveConfig
// ===========================================================================
console.log("\nresolveConfig:");
const resolved = resolveConfig({});
assertEqual(resolved.type, "fade", "default type = fade");
assertEqual(resolved.durationInFrames, 16, "default duration = 16");

const custom = resolveConfig({ type: "slide", slideDirection: "right" });
assertEqual(custom.type, "slide", "custom type preserved");
assertEqual(custom.slideDirection, "right", "custom direction preserved");
assertEqual(custom.durationInFrames, 16, "default duration applied");

// ===========================================================================
// sceneFrames
// ===========================================================================
console.log("\nsceneFrames:");
assertEqual(sceneFrames(3, 30), 90, "3s @ 30fps = 90 frames");
assertEqual(sceneFrames(1, 60), 60, "1s @ 60fps = 60 frames");
assertEqual(sceneFrames(0, 30), 0, "0s = 0 frames");
assertEqual(sceneFrames(2.5, 30), 75, "2.5s @ 30fps = 75 frames");

// ===========================================================================
// totalFrames
// ===========================================================================
console.log("\ntotalFrames:");
assertEqual(totalFrames([3, 3, 3], 16, 30), 302, "3 scenes + 2 transitions");
assertEqual(totalFrames([3], 16, 30), 90, "1 scene no transitions");
assertEqual(totalFrames([1, 1], 0, 30), 60, "cut transitions = 0 frames");
assertEqual(totalFrames([], 16, 30), 0, "no scenes = 0");

// ===========================================================================
// PRESETS
// ===========================================================================
console.log("\nPRESETS:");
assert(Object.keys(PRESETS).length >= 8, "at least 8 presets");
assert(PRESETS.fade !== undefined, "fade preset exists");
assert(PRESETS.cut !== undefined, "cut preset exists");
assert(PRESETS.slideLeft !== undefined, "slideLeft preset exists");
assert(PRESETS.wipeLeft !== undefined, "wipeLeft preset exists");

// ===========================================================================
// Determinism
// ===========================================================================
console.log("\nDeterminism:");
const r1 = totalFrames([3, 3, 3], 16, 30);
const r2 = totalFrames([3, 3, 3], 16, 30);
assert(r1 === r2, "same input produces identical output");

// ===========================================================================
// Summary
// ===========================================================================
console.log("\n========================================");
console.log("Results: " + passed + " passed, " + failed + " failed");
console.log("========================================");

if (failed > 0) { process.exit(1); }
