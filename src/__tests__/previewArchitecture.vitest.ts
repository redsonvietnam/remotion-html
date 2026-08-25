import { describe, it, expect } from "vitest";
import { TEMPLATE_SCHEMAS, sceneFrames, FPS, TAIL } from "../data/contract";

/**
 * WS-PREVIEW-02 — Architecture regression tests.
 * Protects: renderer boundary, frame model, format metadata, production mapping.
 * Run: npx vitest run src/__tests__/previewArchitecture.vitest.ts
 */

// ─── Preview inline data (mirrors preview/studio.jsx) ─────────────────────────
const PREVIEW_TEMPLATES = [
  "cr7",
  "nodeflow",
  "cosmos",
  "nq57",
  "stoiclove",
  "blueprint",
];

const PREVIEW_PRODUCTIONS = [
  { id: "nq57", template: "nq57", format: "16:9" },
  { id: "dean06", template: "nq57", format: "16:9" },
  { id: "nq79", template: "nq57", format: "16:9" },
  { id: "stoiclove", template: "stoiclove", format: "9:16" },
  { id: "canCuoc", template: "nq57", format: "16:9" },
  { id: "luatGTDB", template: "nq57", format: "16:9" },
  { id: "baoHiem2024", template: "nodeflow", format: "16:9" },
  { id: "luatBHXH", template: "blueprint", format: "16:9" },
  { id: "cr7Records", template: "cr7", format: "16:9" },
  { id: "cr7VsMessi", template: "cr7", format: "16:9" },
  { id: "solarSystem", template: "cosmos", format: "16:9" },
];

// ─── Expected format support (Preview-only, not in contract.ts) ────────────────
const EXPECTED_FORMATS: Record<string, string[]> = {
  cr7: ["16:9", "9:16"],
  cosmos: ["16:9", "9:16"],
  nodeflow: ["16:9"],
  nq57: ["16:9"],
  stoiclove: ["9:16"],
  blueprint: ["16:9"],
};

// ─── Templates with proper Remotion boundary ──────────────────────────────────
const BOUNDARY_TEMPLATES = ["nodeflow", "cr7", "cosmos"];

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("Frame model determinism", () => {
  it("sceneFrames uses TAIL=0.5 and FPS=30", () => {
    expect(TAIL).toBe(0.5);
    expect(FPS).toBe(30);
  });

  it("sceneFrames(dur) = Math.ceil((dur + 0.5) * 30)", () => {
    const cases = [5.0, 8.5, 10.0, 12.836, 20.232];
    for (const dur of cases) {
      const expected = Math.ceil((dur + 0.5) * 30);
      expect(sceneFrames(dur)).toBe(expected);
    }
  });

  it("sceneFrames is deterministic — same input always produces same output", () => {
    const dur = 10.5;
    const result1 = sceneFrames(dur);
    const result2 = sceneFrames(dur);
    expect(result1).toBe(result2);
  });

  it("sceneFrames always returns positive integers", () => {
    const durs = [0.1, 1.0, 5.0, 30.0, 60.0];
    for (const dur of durs) {
      const frames = sceneFrames(dur);
      expect(frames).toBeGreaterThan(0);
      expect(Number.isInteger(frames)).toBe(true);
    }
  });
});

describe("Renderer boundary — new templates", () => {
  for (const tpl of BOUNDARY_TEMPLATES) {
    it(`${tpl} has TEMPLATE_SCHEMAS entry`, () => {
      expect(TEMPLATE_SCHEMAS).toHaveProperty(tpl);
    });

    it(`${tpl} TEMPLATE_SCHEMAS has allowedKinds`, () => {
      const schema = TEMPLATE_SCHEMAS[tpl];
      expect(Array.isArray(schema.allowedKinds)).toBe(true);
      expect(schema.allowedKinds.length).toBeGreaterThan(0);
    });
  }
});

describe("Format metadata consistency", () => {
  it("all expected preview templates exist in TEMPLATE_SCHEMAS", () => {
    for (const tpl of PREVIEW_TEMPLATES) {
      expect(TEMPLATE_SCHEMAS).toHaveProperty(tpl);
    }
  });

  it("every production format matches expected format support", () => {
    for (const prod of PREVIEW_PRODUCTIONS) {
      const expected = EXPECTED_FORMATS[prod.template];
      expect(expected).toContain(prod.format);
    }
  });

  it("no template claims a format it does not support", () => {
    for (const [tpl, fmts] of Object.entries(EXPECTED_FORMATS)) {
      expect(TEMPLATE_SCHEMAS).toHaveProperty(tpl);
      for (const fmt of fmts) {
        expect(["16:9", "9:16"]).toContain(fmt);
      }
    }
  });
});

describe("Production/template mapping", () => {
  it("all 11 preview productions registered", () => {
    expect(PREVIEW_PRODUCTIONS.length).toBe(11);
  });

  it("no duplicate production IDs", () => {
    const ids = PREVIEW_PRODUCTIONS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every production template exists in TEMPLATE_SCHEMAS", () => {
    for (const prod of PREVIEW_PRODUCTIONS) {
      expect(TEMPLATE_SCHEMAS).toHaveProperty(prod.template);
    }
  });
});
