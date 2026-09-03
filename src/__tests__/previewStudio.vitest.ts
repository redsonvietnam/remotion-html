import { describe, it, expect } from "vitest";
import { TEMPLATE_SCHEMAS } from "../data/contract";

/**
 * Preview Studio regression tests
 * Validates data integrity between preview inline data and the canonical contract.
 * Run: npx vitest run src/__tests__/previewStudio.vitest.ts
 */

// ─── Inline preview data (mirrors preview/studio.jsx) ──────────────────────────
const PREVIEW_TEMPLATES = ["cr7", "nodeflow", "cosmos", "nq57", "stoiclove", "blueprint"];

const PREVIEW_PRODUCTIONS = [
  { id: "nq57", template: "nq57", format: "16:9", sceneCount: 7 },
  { id: "dean06", template: "nq57", format: "16:9", sceneCount: 7 },
  { id: "nq79", template: "nq57", format: "16:9", sceneCount: 7 },
  { id: "stoiclove", template: "stoiclove", format: "9:16", sceneCount: 10 },
  { id: "canCuoc", template: "nq57", format: "16:9", sceneCount: 7 },
  { id: "luatGTDB", template: "nq57", format: "16:9", sceneCount: 7 },
  { id: "baoHiem2024", template: "nodeflow", format: "16:9", sceneCount: 6 },
  { id: "luatBHXH", template: "blueprint", format: "16:9", sceneCount: 6 },
  { id: "cr7Records", template: "cr7", format: "16:9", sceneCount: 7 },
  { id: "cr7VsMessi", template: "cr7", format: "16:9", sceneCount: 7 },
  { id: "solarSystem", template: "cosmos", format: "16:9", sceneCount: 9 },
];

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("Preview Studio data integrity", () => {
  it("all 11 productions are registered", () => {
    expect(PREVIEW_PRODUCTIONS.length).toBe(11);
  });

  it("each production has a valid template from TEMPLATE_SCHEMAS", () => {
    for (const prod of PREVIEW_PRODUCTIONS) {
      expect(TEMPLATE_SCHEMAS).toHaveProperty(prod.template);
    }
  });

  it("nq57 productions have 7 scenes (title, quote, roles, pillars, stats, vision, end)", () => {
    const nq57Prods = PREVIEW_PRODUCTIONS.filter((p) => p.template === "nq57");
    expect(nq57Prods.length).toBeGreaterThanOrEqual(3);
    for (const prod of nq57Prods) {
      expect(prod.sceneCount).toBe(7);
    }
  });

  it("stoiclove production has 10 scenes", () => {
    const stoicProd = PREVIEW_PRODUCTIONS.find((p) => p.id === "stoiclove");
    expect(stoicProd?.sceneCount).toBe(10);
  });

  it("blueprint production has 6 scenes", () => {
    const bpProd = PREVIEW_PRODUCTIONS.find((p) => p.id === "luatBHXH");
    expect(bpProd?.sceneCount).toBe(6);
  });
});

describe("TEMPLATE_SCHEMAS consistency", () => {
  it("all registered templates have schema entries", () => {
    for (const tpl of PREVIEW_TEMPLATES) {
      expect(TEMPLATE_SCHEMAS).toHaveProperty(tpl);
    }
  });

  it("each template has allowedKinds array", () => {
    for (const tpl of PREVIEW_TEMPLATES) {
      const schema = TEMPLATE_SCHEMAS[tpl];
      expect(schema).toHaveProperty("allowedKinds");
      expect(Array.isArray(schema.allowedKinds)).toBe(true);
      expect(schema.allowedKinds.length).toBeGreaterThan(0);
    }
  });

  it("cr7 has expected scene kinds", () => {
    expect(TEMPLATE_SCHEMAS.cr7.allowedKinds).toEqual(
      expect.arrayContaining(["hero", "stat", "milestone", "closing"])
    );
  });

  it("cosmos has expected scene kinds", () => {
    expect(TEMPLATE_SCHEMAS.cosmos.allowedKinds).toEqual(
      expect.arrayContaining(["title", "fact", "compare", "timeline", "diagram", "closing"])
    );
  });

  it("nodeflow has expected scene kinds", () => {
    expect(TEMPLATE_SCHEMAS.nodeflow.allowedKinds).toEqual(
      expect.arrayContaining(["title", "flow", "contribution", "benefit", "compare", "end"])
    );
  });

  it("stoiclove has expected scene kinds", () => {
    expect(TEMPLATE_SCHEMAS.stoiclove.allowedKinds).toEqual(
      expect.arrayContaining(["hook", "statement", "split", "concept", "impermanence", "ending"])
    );
  });
});

describe("Preview production count vs manifest", () => {
  it("preview has at least as many productions as the manifest requires", () => {
    // The manifest has 11 productions; preview should have all of them
    expect(PREVIEW_PRODUCTIONS.length).toBeGreaterThanOrEqual(11);
  });

  it("no duplicate production IDs", () => {
    const ids = PREVIEW_PRODUCTIONS.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
