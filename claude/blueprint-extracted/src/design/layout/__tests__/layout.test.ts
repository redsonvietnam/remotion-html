// ---------------------------------------------------------------------------
// Layout Engine — Unit Tests
//
// Standalone tests for pure layout functions.
// Run with: npx tsx src/design/layout/__tests__/layout.test.ts
// ---------------------------------------------------------------------------

import { mapAlign, mapJustify } from "../types";

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
// mapAlign
// ===========================================================================
console.log("\nmapAlign:");

assertEqual(mapAlign("start"), "flex-start", "start → flex-start");
assertEqual(mapAlign("center"), "center", "center → center");
assertEqual(mapAlign("end"), "flex-end", "end → flex-end");
assertEqual(mapAlign("stretch"), "stretch", "stretch → stretch");

// ===========================================================================
// mapJustify
// ===========================================================================
console.log("\nmapJustify:");

assertEqual(mapJustify("start"), "flex-start", "start → flex-start");
assertEqual(mapJustify("center"), "center", "center → center");
assertEqual(mapJustify("end"), "flex-end", "end → flex-end");
assertEqual(mapJustify("between"), "space-between", "between → space-between");

// ===========================================================================
// Summary
// ===========================================================================
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${"=".repeat(40)}`);

if (failed > 0) {
  process.exit(1);
}
