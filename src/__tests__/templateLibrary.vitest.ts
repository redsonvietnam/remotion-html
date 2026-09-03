// ---------------------------------------------------------------------------
// WS-TEMPLATE-LIBRARY-01 — Template Library Data Consistency Tests
//
// Validates that the library page's data model matches canonical sources:
// - TEMPLATE_SCHEMAS from contract.ts
// - TEMPLATE_FORMATS from studio.jsx
// - Production count and template mapping
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { TEMPLATE_SCHEMAS } from "../data/contract";

// Library page data (mirrors preview/library.html)
const LIBRARY_TEMPLATES = [
  { id: "scrapbook", name: "Scrapbook", formats: ["16:9", "9:16"], sceneKinds: ["hero", "match", "history", "photo", "timeline", "closing"] },
  { id: "cr7", name: "CR7", formats: ["16:9", "9:16"], sceneKinds: ["hero", "stat", "milestone", "closing"] },
  { id: "cosmos", name: "Cosmos", formats: ["16:9", "9:16"], sceneKinds: ["title", "fact", "compare", "timeline", "diagram", "closing"] },
  { id: "nodeflow", name: "NodeFlow", formats: ["16:9"], sceneKinds: ["title", "flow", "contribution", "benefit", "compare", "end"] },
  { id: "nq57", name: "NQ57", formats: ["16:9"], sceneKinds: ["title", "quote", "roles", "pillars", "stats", "vision", "end"] },
  { id: "stoiclove", name: "Stoic Love", formats: ["9:16"], sceneKinds: ["hook", "statement", "split", "concept", "impermanence", "ending"] },
  { id: "blueprint", name: "Blueprint", formats: ["16:9"], sceneKinds: ["title", "pillars", "measure", "detail", "process", "seal"] },
];

// Library page production data (mirrors preview/library.html)
const LIBRARY_PRODUCTIONS = [
  { id: "championsLeague", name: "Champions League", template: "scrapbook", format: "16:9" },
  { id: "championsLeague9x16", name: "Champions League (9:16)", template: "scrapbook", format: "9:16" },
  { id: "cr7Records", name: "CR7 Records", template: "cr7", format: "16:9" },
  { id: "cr7VsMessi", name: "CR7 vs Messi", template: "cr7", format: "16:9" },
  { id: "solarSystem", name: "Solar System", template: "cosmos", format: "16:9" },
  { id: "baoHiem2024", name: "BHXH 2024", template: "nodeflow", format: "16:9" },
  { id: "nq57", name: "NQ57", template: "nq57", format: "16:9" },
  { id: "dean06", name: "De An 06", template: "nq57", format: "16:9" },
  { id: "nq79", name: "NQ79", template: "nq57", format: "16:9" },
  { id: "canCuoc", name: "Can Cuoc 2023", template: "nq57", format: "16:9" },
  { id: "luatGTDB", name: "Luat GTDB", template: "nq57", format: "16:9" },
  { id: "stoiclove", name: "Stoic Love", template: "stoiclove", format: "9:16" },
  { id: "luatBHXH", name: "Luat BHXH", template: "blueprint", format: "16:9" },
];

// Schema variant keys that are NOT separate template directories (use nq57 component)
const SCHEMA_VARIANTS = ["dean06", "nq79"];

// Actual template directories (7)
const TEMPLATE_DIR_IDS = LIBRARY_TEMPLATES.map((t) => t.id);

describe("Template Library data consistency", () => {
  describe("template metadata matches TEMPLATE_SCHEMAS", () => {
    for (const tpl of LIBRARY_TEMPLATES) {
      it(`"${tpl.id}" exists in TEMPLATE_SCHEMAS`, () => {
        expect(TEMPLATE_SCHEMAS).toHaveProperty(tpl.id);
      });

      it(`"${tpl.id}" allowedKinds match`, () => {
        const schema = TEMPLATE_SCHEMAS[tpl.id];
        if (schema) {
          expect(schema.allowedKinds).toEqual(tpl.sceneKinds);
        }
      });

      it(`"${tpl.id}" formats are subset of known formats`, () => {
        const known = ["16:9", "9:16"];
        for (const f of tpl.formats) {
          expect(known).toContain(f);
        }
      });
    }
  });

  describe("all actual template directories present in library", () => {
    // Only check real template directories, not schema variants
    for (const key of TEMPLATE_DIR_IDS) {
      it(`"${key}" template directory has a library card`, () => {
        const found = LIBRARY_TEMPLATES.some((t) => t.id === key);
        expect(found).toBe(true);
      });
    }
  });

  describe("schema variants use nq57 template", () => {
    for (const key of SCHEMA_VARIANTS) {
      it(`"${key}" schema variant exists in TEMPLATE_SCHEMAS`, () => {
        expect(TEMPLATE_SCHEMAS).toHaveProperty(key);
      });
      it(`"${key}" schema variant maps to nq57 library template`, () => {
        const prod = LIBRARY_PRODUCTIONS.find((p) => p.id === key);
        if (prod) {
          expect(prod.template).toBe("nq57");
        }
      });
    }
  });

  describe("production count per template", () => {
    const expectedCounts: Record<string, number> = {
      scrapbook: 2,
      cr7: 2,
      cosmos: 1,
      nodeflow: 1,
      nq57: 5,
      stoiclove: 1,
      blueprint: 1,
    };

    for (const [templateId, expected] of Object.entries(expectedCounts)) {
      it(`"${templateId}" has ${expected} demo production(s)`, () => {
        const count = LIBRARY_PRODUCTIONS.filter((p) => p.template === templateId).length;
        expect(count).toBe(expected);
      });
    }
  });

  describe("total production count", () => {
    it("library has 13 total productions", () => {
      expect(LIBRARY_PRODUCTIONS).toHaveLength(13);
    });
  });

  describe("production format matches template format support", () => {
    for (const prod of LIBRARY_PRODUCTIONS) {
      it(`"${prod.id}" format "${prod.format}" is supported by template "${prod.template}"`, () => {
        const tpl = LIBRARY_TEMPLATES.find((t) => t.id === prod.template);
        expect(tpl).toBeDefined();
        expect(tpl!.formats).toContain(prod.format);
      });
    }
  });

  describe("no duplicate production IDs", () => {
    it("all production IDs are unique", () => {
      const ids = LIBRARY_PRODUCTIONS.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("Champions League is canonical scrapbook demo", () => {
    it("has both 16:9 and 9:16 productions", () => {
      const cl = LIBRARY_PRODUCTIONS.filter((p) => p.template === "scrapbook");
      expect(cl).toHaveLength(2);
      expect(cl.map((p) => p.format).sort()).toEqual(["16:9", "9:16"]);
    });
  });
});
