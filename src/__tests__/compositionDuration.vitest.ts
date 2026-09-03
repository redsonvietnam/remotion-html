import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { sceneFrames, FPS } from "../data/contract";
import { TERMINAL_SCENES, terminalSceneFrames } from "../data/terminalDemo";
import { KINETIC_SCENES, kineticSceneFrames } from "../data/kineticStatement";
import { BENTO_GRID_SCENES, bentoGridSceneFrames } from "../data/bentoGrid";
import { FEATURE_DROP_SCENES, featureDropSceneFrames } from "../data/featureDrop";
import { EDITORIAL_FEATURE_TOTAL_FRAMES } from "../data/editorialFeature";
import { PRODUCT_TEASER_TOTAL_FRAMES } from "../data/productTeaser";
import { REAL_ESTATE_LISTING_TOTAL_FRAMES } from "../data/realEstateListing";

/**
 * Composition Duration Regression Tests
 *
 * TransitionSeries semantics: total = Σ sceneFrames - (n-1) × overlapFrames
 * Sequence semantics: total = Σ sceneFrames (no overlap)
 *
 * These tests ensure Root.tsx duration constants match actual timeline durations.
 * See: WS-N finding, WS-O fix.
 */

const TRANSITION_FRAMES = 12;

function readFile(relPath: string): string {
  const srcDir = path.resolve(__dirname, "..");
  return fs.readFileSync(path.join(srcDir, relPath), "utf-8");
}

// ─── TransitionSeries templates ─────────────────────────────────────────────

describe("Composition duration: TransitionSeries templates", () => {
  it("terminal: 6 scenes, 5 transitions → 840 frames", () => {
    const sceneTotal = TERMINAL_SCENES.reduce(
      (acc, s) => acc + terminalSceneFrames(s.dur),
      0,
    );
    const overlap = (TERMINAL_SCENES.length - 1) * TRANSITION_FRAMES;
    const expected = sceneTotal - overlap;
    expect(expected).toBe(840);
  });

  it("kineticStatement: 4 scenes, 3 transitions → 414 frames", () => {
    const sceneTotal = KINETIC_SCENES.reduce(
      (acc, s) => acc + kineticSceneFrames(s.dur),
      0,
    );
    const overlap = (KINETIC_SCENES.length - 1) * TRANSITION_FRAMES;
    const expected = sceneTotal - overlap;
    expect(expected).toBe(414);
  });

  it("bentoGrid: 3 scenes, 2 transitions → 360 frames", () => {
    const sceneTotal = BENTO_GRID_SCENES.reduce(
      (acc, s) => acc + bentoGridSceneFrames(s.dur),
      0,
    );
    const overlap = (BENTO_GRID_SCENES.length - 1) * TRANSITION_FRAMES;
    const expected = sceneTotal - overlap;
    expect(expected).toBe(360);
  });

  it("featureDrop: 3 scenes, 2 transitions → 316 frames", () => {
    const sceneTotal = FEATURE_DROP_SCENES.reduce(
      (acc, s) => acc + featureDropSceneFrames(s.dur),
      0,
    );
    const overlap = (FEATURE_DROP_SCENES.length - 1) * TRANSITION_FRAMES;
    const expected = sceneTotal - overlap;
    expect(expected).toBe(316);
  });
});

// ─── Sequence templates (no overlap) ────────────────────────────────────────

describe("Composition duration: Sequence templates (unchanged)", () => {
  it("editorialFeature: 380 frames (no overlap)", () => {
    expect(EDITORIAL_FEATURE_TOTAL_FRAMES).toBe(380);
  });

  it("productTeaser: 447 frames (no overlap)", () => {
    expect(PRODUCT_TEASER_TOTAL_FRAMES).toBe(447);
  });

  it("realEstateListing: 380 frames (no overlap)", () => {
    expect(REAL_ESTATE_LISTING_TOTAL_FRAMES).toBe(380);
  });
});

// ─── Root.tsx formula correctness ───────────────────────────────────────────

describe("Root.tsx duration formulas use subtraction for TransitionSeries", () => {
  it("Root.tsx contains subtraction operator for TransitionSeries templates", () => {
    const rootContent = readFile("Root.tsx");

    // Find the 4 TransitionSeries duration constants and verify they use -
    const terminalMatch = rootContent.match(
      /TERMINAL_DEMO_FRAMES\s*=[\s\S]*?TERMINAL_SCENES\.length\s*-\s*1\)\s*\*\s*12/,
    );
    expect(terminalMatch).not.toBeNull();

    const kineticMatch = rootContent.match(
      /KINETIC_STATEMENT_FRAMES\s*=[\s\S]*?KINETIC_SCENES\.length\s*-\s*1\)\s*\*\s*12/,
    );
    expect(kineticMatch).not.toBeNull();

    const bentoMatch = rootContent.match(
      /BENTO_GRID_FRAMES\s*=[\s\S]*?BENTO_GRID_SCENES\.length\s*-\s*1\)\s*\*\s*12/,
    );
    expect(bentoMatch).not.toBeNull();

    const featureMatch = rootContent.match(
      /FEATURE_DROP_FRAMES\s*=[\s\S]*?FEATURE_DROP_SCENES\.length\s*-\s*1\)\s*\*\s*12/,
    );
    expect(featureMatch).not.toBeNull();
  });

  it("Root.tsx does NOT use addition for TransitionSeries duration formulas", () => {
    const rootContent = readFile("Root.tsx");

    // Verify none of the 4 TransitionSeries formulas use + before the overlap term
    const lines = rootContent.split("\n");
    const tsTemplates = [
      "TERMINAL_DEMO_FRAMES",
      "KINETIC_STATEMENT_FRAMES",
      "BENTO_GRID_FRAMES",
      "FEATURE_DROP_FRAMES",
    ];

    for (const template of tsTemplates) {
      const idx = lines.findIndex((l) => l.includes(template + " ="));
      if (idx >= 0) {
        // Find the line with the overlap calculation (within 5 lines)
        for (let i = idx; i < Math.min(idx + 5, lines.length); i++) {
          if (lines[i].includes(".length - 1) * 12")) {
            // This line should NOT have a + before the reduce result
            const prevLine = lines[i - 1] || "";
            expect(prevLine).not.toMatch(/\+\s*$/);
          }
        }
      }
    }
  });
});
