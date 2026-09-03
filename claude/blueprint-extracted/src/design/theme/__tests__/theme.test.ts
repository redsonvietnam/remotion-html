// ---------------------------------------------------------------------------
// Theme System — Unit Tests
// Run: npx tsx src/design/theme/__tests__/theme.test.ts
// ---------------------------------------------------------------------------

import { createTheme, mergeTheme, getColor } from "../helpers";
import { DEFAULT_COLORS, DEFAULT_FONTS, DEFAULT_SPACING } from "../helpers";

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
// createTheme
// ===========================================================================
console.log("\ncreateTheme:");
{
  const t = createTheme({ name: "test" });
  assertEqual(t.name, "test", "name preserved");
  assertEqual(t.colors.bg, DEFAULT_COLORS.bg, "default bg");
  assertEqual(t.fonts.display, DEFAULT_FONTS.display, "default fonts");
  assertEqual(t.spacing.md, DEFAULT_SPACING.md, "default spacing");
}

// ===========================================================================
// mergeTheme
// ===========================================================================
console.log("\nmergeTheme:");
{
  const base = createTheme({ name: "base" });
  const override = mergeTheme(base, {
    name: "custom",
    colors: { bg: "#000", ink: "#fff" },
  });
  assertEqual(override.name, "custom", "name overridden");
  assertEqual(override.colors.bg, "#000", "bg overridden");
  assertEqual(override.colors.ink, "#fff", "ink overridden");
  assertEqual(override.colors.accent1, DEFAULT_COLORS.accent1, "accent1 kept from base");
  assertEqual(override.fonts.display, DEFAULT_FONTS.display, "fonts kept from base");
}

// ===========================================================================
// getColor
// ===========================================================================
console.log("\ngetColor:");
assert(getColor(DEFAULT_COLORS, "bg") === "#0a0e1a", "get bg color");
assert(getColor(DEFAULT_COLORS, "ink") === "#f7f5ef", "get ink color");
assert(getColor(DEFAULT_COLORS, "accent1") === "#e23b3b", "get accent1 color");

// ===========================================================================
// Determinism
// ===========================================================================
console.log("\nDeterminism:");
{
  const t1 = createTheme({ name: "test" });
  const t2 = createTheme({ name: "test" });
  assertEqual(t1.colors, t2.colors, "same input produces identical colors");
}

// ===========================================================================
// Summary
// ===========================================================================
console.log("\n========================================");
console.log("Results: " + passed + " passed, " + failed + " failed");
console.log("========================================");

if (failed > 0) { process.exit(1); }
