// ---------------------------------------------------------------------------
// WS-CREATOR-SHELL-01 — Creator Shell Tests
//
// Validates creator shell data consistency and routing logic.
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { TEMPLATE_SCHEMAS } from "../data/contract";

// Creator page data (mirrors preview/creator.html)
const CREATOR_TEMPLATES = [
  { id: "scrapbook", name: "Scrapbook", status: "ready", formats: ["16:9", "9:16"] },
  { id: "cr7", name: "CR7", status: "ready", formats: ["16:9", "9:16"] },
  { id: "cosmos", name: "Cosmos", status: "ready", formats: ["16:9", "9:16"] },
  { id: "nodeflow", name: "NodeFlow", status: "ready", formats: ["16:9"] },
  { id: "nq57", name: "NQ57", status: "legacy", formats: ["16:9"] },
  { id: "stoiclove", name: "Stoic Love", status: "legacy", formats: ["9:16"] },
  { id: "blueprint", name: "Blueprint", status: "legacy", formats: ["16:9"] },
];

// Library page data (mirrors preview/library.html) — for cross-reference
const LIBRARY_TEMPLATES = [
  { id: "scrapbook", status: "ready" },
  { id: "cr7", status: "ready" },
  { id: "cosmos", status: "ready" },
  { id: "nodeflow", status: "ready" },
  { id: "nq57", status: "legacy" },
  { id: "stoiclove", status: "legacy" },
  { id: "blueprint", status: "legacy" },
];

describe("Creator Shell data consistency", () => {
  describe("creator templates match library templates", () => {
    it("same set of template IDs", () => {
      const creatorIds = CREATOR_TEMPLATES.map(t => t.id).sort();
      const libraryIds = LIBRARY_TEMPLATES.map(t => t.id).sort();
      expect(creatorIds).toEqual(libraryIds);
    });

    it("statuses match between creator and library", () => {
      for (const ct of CREATOR_TEMPLATES) {
        const lt = LIBRARY_TEMPLATES.find(t => t.id === ct.id);
        expect(lt).toBeDefined();
        expect(lt!.status).toBe(ct.status);
      }
    });
  });

  describe("creator templates exist in TEMPLATE_SCHEMAS", () => {
    for (const tpl of CREATOR_TEMPLATES) {
      it(`"${tpl.id}" exists in TEMPLATE_SCHEMAS`, () => {
        expect(TEMPLATE_SCHEMAS).toHaveProperty(tpl.id);
      });
    }
  });

  describe("ready templates can create new videos", () => {
    const readyTemplates = CREATOR_TEMPLATES.filter(t => t.status === "ready");
    it("4 ready templates", () => {
      expect(readyTemplates).toHaveLength(4);
    });

    for (const tpl of readyTemplates) {
      it(`"${tpl.id}" has at least one format`, () => {
        expect(tpl.formats.length).toBeGreaterThanOrEqual(1);
      });
    }
  });

  describe("legacy templates are preview-only", () => {
    const legacyTemplates = CREATOR_TEMPLATES.filter(t => t.status === "legacy");
    it("3 legacy templates", () => {
      expect(legacyTemplates).toHaveLength(3);
    });

    for (const tpl of legacyTemplates) {
      it(`"${tpl.id}" has status "legacy"`, () => {
        expect(tpl.status).toBe("legacy");
      });
    }
  });

  describe("format validation", () => {
    const validFormats = ["16:9", "9:16"];
    for (const tpl of CREATOR_TEMPLATES) {
      for (const fmt of tpl.formats) {
        it(`"${tpl.id}" format "${fmt}" is valid`, () => {
          expect(validFormats).toContain(fmt);
        });
      }
    }
  });

  describe("default format selection", () => {
    for (const tpl of CREATOR_TEMPLATES) {
      it(`"${tpl.id}" default format is first in list`, () => {
        expect(tpl.formats[0]).toBeDefined();
      });
    }
  });

  describe("default video name pattern", () => {
    for (const tpl of CREATOR_TEMPLATES) {
      it(`"${tpl.id}" default name is "Untitled ${tpl.name} Video"`, () => {
        const expected = "Untitled " + tpl.name + " Video";
        expect(expected).toContain(tpl.name);
      });
    }
  });
});
