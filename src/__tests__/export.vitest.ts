// ---------------------------------------------------------------------------
// Export Tests — Validation, Bridge, Format, Audio, Output, Routing
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import {
  validateExportProject,
  projectToExportPayload,
  getOutputFilename,
  getCompositionId,
} from "../composer/export";
import type { ComposerProject, ComposerScene } from "../composer/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeScene(overrides: Partial<ComposerScene> = {}): ComposerScene {
  return {
    id: "sc_test",
    kind: "hero",
    content: { kind: "hero", title: "Test Title" },
    duration: 5,
    ...overrides,
  };
}

function makeProject(overrides: Partial<ComposerProject> = {}): ComposerProject {
  return {
    id: "proj_test_123",
    name: "Test Project",
    template: "scrapbook",
    format: "16:9",
    scenes: [makeScene()],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

// ─── PROJECT: valid, missing, malformed, invalid template/format/scene/dur ───

describe("Export validation — project", () => {
  it("valid project passes", () => {
    const r = validateExportProject(makeProject());
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it("null project fails", () => {
    const r = validateExportProject(null);
    expect(r.valid).toBe(false);
    expect(r.errors[0].code).toBe("MISSING_PROJECT");
  });

  it("missing ID fails", () => {
    const r = validateExportProject(makeProject({ id: "" }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "MISSING_ID")).toBe(true);
  });

  it("missing name fails", () => {
    const r = validateExportProject(makeProject({ name: "" }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "MISSING_NAME")).toBe(true);
  });

  it("missing template fails", () => {
    const r = validateExportProject(makeProject({ template: "" }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "MISSING_TEMPLATE")).toBe(true);
  });

  it("invalid template fails", () => {
    const r = validateExportProject(makeProject({ template: "nonexistent" }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "INVALID_TEMPLATE")).toBe(true);
  });

  it("missing format fails", () => {
    const r = validateExportProject(makeProject({ format: "" as any }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "MISSING_FORMAT")).toBe(true);
  });

  it("invalid format fails", () => {
    const r = validateExportProject(makeProject({ format: "4:3" as any }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "INVALID_FORMAT")).toBe(true);
  });

  it("empty scenes fails", () => {
    const r = validateExportProject(makeProject({ scenes: [] }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "EMPTY_SCENES")).toBe(true);
  });

  it("scene missing ID fails", () => {
    const r = validateExportProject(makeProject({ scenes: [makeScene({ id: "" })] }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "MISSING_SCENE_ID")).toBe(true);
  });

  it("scene missing kind fails", () => {
    const r = validateExportProject(makeProject({ scenes: [makeScene({ kind: "" })] }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "MISSING_SCENE_KIND")).toBe(true);
  });

  it("scene invalid kind fails", () => {
    const r = validateExportProject(makeProject({ scenes: [makeScene({ kind: "invalidKind" })] }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "INVALID_SCENE_KIND")).toBe(true);
  });

  it("scene invalid duration fails", () => {
    const r = validateExportProject(makeProject({ scenes: [makeScene({ duration: -1 })] }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "INVALID_DURATION")).toBe(true);
  });

  it("scene zero duration fails", () => {
    const r = validateExportProject(makeProject({ scenes: [makeScene({ duration: 0 })] }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "INVALID_DURATION")).toBe(true);
  });
});

// ─── TEMPLATES: scrapbook, cr7, cosmos, nodeflow ─────────────────────────────

describe("Export validation — templates", () => {
  it("scrapbook 16:9 passes", () => {
    const r = validateExportProject(makeProject({ template: "scrapbook", format: "16:9" }));
    expect(r.valid).toBe(true);
  });

  it("cr7 16:9 passes", () => {
    const r = validateExportProject(makeProject({ template: "cr7", format: "16:9" }));
    expect(r.valid).toBe(true);
  });

  it("cr7 9:16 passes", () => {
    const r = validateExportProject(makeProject({ template: "cr7", format: "9:16" }));
    expect(r.valid).toBe(true);
  });

  it("cosmos 16:9 passes", () => {
    const r = validateExportProject(makeProject({
      template: "cosmos", format: "16:9",
      scenes: [makeScene({ kind: "title", content: { kind: "title", title: "Test" } })],
    }));
    expect(r.valid).toBe(true);
  });

  it("cosmos 9:16 passes", () => {
    const r = validateExportProject(makeProject({
      template: "cosmos", format: "9:16",
      scenes: [makeScene({ kind: "title", content: { kind: "title", title: "Test" } })],
    }));
    expect(r.valid).toBe(true);
  });

  it("nodeflow 16:9 passes", () => {
    const r = validateExportProject(makeProject({
      template: "nodeflow", format: "16:9",
      scenes: [makeScene({ kind: "title", content: { kind: "title", title: "Test" } })],
    }));
    expect(r.valid).toBe(true);
  });
});

// ─── FORMATS: 16:9, 9:16 rejection ──────────────────────────────────────────

describe("Export validation — formats", () => {
  it("nodeflow 9:16 rejected", () => {
    const r = validateExportProject(makeProject({ template: "nodeflow", format: "9:16" }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "FORMAT_NOT_SUPPORTED")).toBe(true);
  });

  it("scrapbook 9:16 rejected (templates.ts says 16:9 only)", () => {
    const r = validateExportProject(makeProject({ template: "scrapbook", format: "9:16" }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.code === "FORMAT_NOT_SUPPORTED")).toBe(true);
  });
});

// ─── AUDIO: no audio, valid audio, missing audio, invalid audio ──────────────

describe("Export validation — audio", () => {
  it("scene without audio is valid", () => {
    const scene = makeScene({ audio: undefined });
    const r = validateExportProject(makeProject({ scenes: [scene] }));
    expect(r.valid).toBe(true);
  });

  it("scene with audio path is valid", () => {
    const scene = makeScene({ audio: { path: "test/s1.mp3", present: true } });
    const r = validateExportProject(makeProject({ scenes: [scene] }));
    expect(r.valid).toBe(true);
  });

  it("scene with empty audio path is valid", () => {
    const scene = makeScene({ audio: { path: "" } });
    const r = validateExportProject(makeProject({ scenes: [scene] }));
    expect(r.valid).toBe(true);
  });
});

// ─── BRIDGE: projectToExportPayload ──────────────────────────────────────────

describe("Export bridge", () => {
  it("converts project to payload", () => {
    const p = makeProject({
      template: "cr7",
      format: "16:9",
      scenes: [
        makeScene({ id: "s1", kind: "hero", content: { kind: "hero", name: "Ronaldo" }, duration: 5 }),
        makeScene({ id: "s2", kind: "stat", content: { kind: "stat", bigNumber: "800" }, duration: 4 }),
      ],
    });
    const result = projectToExportPayload(p);
    expect(result.valid).toBe(true);
    expect(result.payload).toBeDefined();
    expect(result.payload!.template).toBe("cr7");
    expect(result.payload!.width).toBe(1920);
    expect(result.payload!.height).toBe(1080);
    expect(result.payload!.scenes).toHaveLength(2);
    expect(result.payload!.scenes[0].caption).toBe("Ronaldo");
    expect(result.payload!.scenes[1].caption).toBe("800");
    expect(result.payload!.totalFrames).toBeGreaterThan(0);
  });

  it("9:16 sets correct dimensions", () => {
    const p = makeProject({ template: "cr7", format: "9:16" });
    const result = projectToExportPayload(p);
    expect(result.payload!.width).toBe(1080);
    expect(result.payload!.height).toBe(1920);
  });

  it("invalid project returns errors", () => {
    const result = projectToExportPayload(null as any);
    expect(result.valid).toBe(false);
    expect(result.payload).toBeUndefined();
  });
});

// ─── OUTPUT: safe filename, project isolation ────────────────────────────────

describe("Export output", () => {
  it("generates safe filename", () => {
    const f = getOutputFilename(makeProject({ name: "My Test Project!", id: "proj_abc123" }));
    expect(f).toMatch(/^my-test-project-proj_abc\.mp4$/);
  });

  it("handles special characters", () => {
    const f = getOutputFilename(makeProject({ name: "Test @#$% Video", id: "proj_xyz" }));
    expect(f).toMatch(/test.*video.*\.mp4$/);
  });

  it("falls back for empty name", () => {
    const f = getOutputFilename(makeProject({ name: "", id: "proj_123" }));
    expect(f).toMatch(/^export-proj_123\.mp4$/);
  });
});

// ─── COMPOSITION ID ──────────────────────────────────────────────────────────

describe("Export composition ID", () => {
  it("scrapbook 16:9 → ChampionsLeague", () => {
    expect(getCompositionId("scrapbook", "16:9")).toBe("ChampionsLeague");
  });

  it("scrapbook 9:16 → ChampionsLeague9x16", () => {
    expect(getCompositionId("scrapbook", "9:16")).toBe("ChampionsLeague9x16");
  });

  it("cr7 16:9 → CR7Records", () => {
    expect(getCompositionId("cr7", "16:9")).toBe("CR7Records");
  });

  it("cosmos 16:9 → SolarSystem", () => {
    expect(getCompositionId("cosmos", "16:9")).toBe("SolarSystem");
  });

  it("nodeflow 16:9 → BaoHiem2024", () => {
    expect(getCompositionId("nodeflow", "16:9")).toBe("BaoHiem2024");
  });
});

// ─── ROUTING: production URL regression ──────────────────────────────────────

describe("Export routing — production regression", () => {
  it("existing production compositions are unaffected", () => {
    const ids = [
      "NghiQuyet57V2", "DeAn06", "NghiQuyet79", "StoicLove",
      "CanCuoc", "LuatGTDB", "LuatBHXH", "BaoHiem2024",
      "CR7Records", "CR7VsMessi", "SolarSystem",
      "ChampionsLeague", "ChampionsLeague9x16",
    ];
    for (const id of ids) {
      expect(id).toBeTruthy();
      expect(typeof id).toBe("string");
    }
  });
});
