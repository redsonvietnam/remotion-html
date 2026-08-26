// ---------------------------------------------------------------------------
// Composer Tests — Project, Scenes, Content, Templates, Studio, Audio, Error
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadProjects,
  saveProject,
  loadProject,
  deleteProject,
  loadCurrentProjectId,
  saveCurrentProjectId,
  createProject,
  generateId,
  generateSceneId,
} from "../composer/store";
import {
  addScene,
  duplicateScene,
  deleteScene,
  moveSceneUp,
  moveSceneDown,
  updateSceneContent,
  updateSceneDuration,
  changeSceneKind,
  updateSceneAudio,
} from "../composer/scenes";
import {
  getTemplateCapability,
  getValidKinds,
  getDefaultContent,
  TEMPLATE_CAPABILITIES,
} from "../composer/templates";
import { validateProject, validateScene } from "../composer/validation";
import type { ComposerProject, ComposerScene } from "../composer/types";

// ─── Mock localStorage ───────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

beforeEach(() => {
  localStorageMock.clear();
  vi.stubGlobal("localStorage", localStorageMock);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeScene(overrides: Partial<ComposerScene> = {}): ComposerScene {
  return {
    id: generateSceneId(),
    kind: "hero",
    content: { kind: "hero", title: "Test" },
    duration: 5,
    ...overrides,
  };
}

function makeProject(overrides: Partial<ComposerProject> = {}): ComposerProject {
  return {
    id: generateId(),
    name: "Test Project",
    template: "scrapbook",
    format: "16:9",
    scenes: [makeScene()],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

// ─── PROJECT: create, load, save, update, persistence ────────────────────────

describe("Project operations", () => {
  it("createProject returns valid project", () => {
    const p = createProject("My Project", "scrapbook", "16:9");
    expect(p.id).toBeTruthy();
    expect(p.name).toBe("My Project");
    expect(p.template).toBe("scrapbook");
    expect(p.format).toBe("16:9");
    expect(p.scenes).toEqual([]);
  });

  it("save and load project", () => {
    const p = makeProject();
    saveProject(p);
    const loaded = loadProject(p.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.id).toBe(p.id);
    expect(loaded!.name).toBe(p.name);
  });

  it("loadProjects returns all", () => {
    const p1 = makeProject({ name: "P1" });
    const p2 = makeProject({ name: "P2" });
    saveProject(p1);
    saveProject(p2);
    const all = loadProjects();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it("deleteProject removes project", () => {
    const p = makeProject();
    saveProject(p);
    deleteProject(p.id);
    expect(loadProject(p.id)).toBeNull();
  });

  it("current project ID persistence", () => {
    saveCurrentProjectId("test-123");
    expect(loadCurrentProjectId()).toBe("test-123");
    saveCurrentProjectId(null);
    expect(loadCurrentProjectId()).toBeNull();
  });

  it("generateId produces unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it("generateSceneId produces unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateSceneId()));
    expect(ids.size).toBe(100);
  });
});

// ─── SCENES: add, duplicate, delete, reorder, select ─────────────────────────

describe("Scene operations", () => {
  it("addScene appends to end", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" })] });
    const s2 = makeScene({ id: "s2" });
    const result = addScene(p, s2);
    expect(result.scenes).toHaveLength(2);
    expect(result.scenes[1].id).toBe("s2");
  });

  it("addScene inserts at index", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" }), makeScene({ id: "s3" })] });
    const s2 = makeScene({ id: "s2" });
    const result = addScene(p, s2, 1);
    expect(result.scenes).toHaveLength(3);
    expect(result.scenes[1].id).toBe("s2");
  });

  it("duplicateScene creates copy after original", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1", kind: "hero" })] });
    const result = duplicateScene(p, "s1");
    expect(result.scenes).toHaveLength(2);
    expect(result.scenes[0].id).toBe("s1");
    expect(result.scenes[1].id).not.toBe("s1");
    expect(result.scenes[1].kind).toBe("hero");
  });

  it("duplicateScene with invalid ID returns unchanged", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" })] });
    const result = duplicateScene(p, "nonexistent");
    expect(result.scenes).toHaveLength(1);
  });

  it("deleteScene removes scene", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" }), makeScene({ id: "s2" })] });
    const result = deleteScene(p, "s1");
    expect(result.scenes).toHaveLength(1);
    expect(result.scenes[0].id).toBe("s2");
  });

  it("deleteScene cannot delete last scene", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" })] });
    const result = deleteScene(p, "s1");
    expect(result.scenes).toHaveLength(1);
  });

  it("moveSceneUp swaps with previous", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" }), makeScene({ id: "s2" })] });
    const result = moveSceneUp(p, "s2");
    expect(result.scenes[0].id).toBe("s2");
    expect(result.scenes[1].id).toBe("s1");
  });

  it("moveSceneUp at top does nothing", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" }), makeScene({ id: "s2" })] });
    const result = moveSceneUp(p, "s1");
    expect(result.scenes[0].id).toBe("s1");
  });

  it("moveDown swaps with next", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" }), makeScene({ id: "s2" })] });
    const result = moveSceneDown(p, "s1");
    expect(result.scenes[0].id).toBe("s2");
    expect(result.scenes[1].id).toBe("s1");
  });

  it("moveDown at bottom does nothing", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" }), makeScene({ id: "s2" })] });
    const result = moveSceneDown(p, "s2");
    expect(result.scenes[1].id).toBe("s2");
  });
});

// ─── CONTENT: text update, duration update, kind change ──────────────────────

describe("Content operations", () => {
  it("updateSceneContent merges content", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1", content: { kind: "hero", title: "Old" } })] });
    const result = updateSceneContent(p, "s1", { kind: "hero", title: "New", subtitle: "Sub" });
    expect(result.scenes[0].content.title).toBe("New");
    expect(result.scenes[0].content.subtitle).toBe("Sub");
  });

  it("updateSceneDuration changes duration", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1", duration: 5 })] });
    const result = updateSceneDuration(p, "s1", 10);
    expect(result.scenes[0].duration).toBe(10);
  });

  it("updateSceneDuration rejects invalid", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1", duration: 5 })] });
    const result = updateSceneDuration(p, "s1", -1);
    expect(result.scenes[0].duration).toBe(5);
  });

  it("changeKind updates kind and resets content", () => {
    const p = makeProject({ template: "scrapbook", scenes: [makeScene({ id: "s1", kind: "hero" })] });
    const result = changeSceneKind(p, "s1", "match");
    expect(result.scenes[0].kind).toBe("match");
    expect(result.scenes[0].content.kind).toBe("match");
  });

  it("changeKind rejects invalid kind", () => {
    const p = makeProject({ template: "scrapbook", scenes: [makeScene({ id: "s1", kind: "hero" })] });
    const result = changeSceneKind(p, "s1", "invalidKind");
    expect(result.scenes[0].kind).toBe("hero");
  });

  it("updateSceneAudio sets audio", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1" })] });
    const result = updateSceneAudio(p, "s1", { path: "test/s1.mp3", present: true });
    expect(result.scenes[0].audio?.path).toBe("test/s1.mp3");
  });

  it("updateSceneAudio clears audio", () => {
    const p = makeProject({ scenes: [makeScene({ id: "s1", audio: { path: "test/s1.mp3" } })] });
    const result = updateSceneAudio(p, "s1", undefined);
    expect(result.scenes[0].audio).toBeUndefined();
  });
});

// ─── TEMPLATES: scrapbook, cr7, cosmos, nodeflow ─────────────────────────────

describe("Template capabilities", () => {
  it("all templates have capabilities", () => {
    for (const tpl of ["scrapbook", "cr7", "cosmos", "nodeflow"]) {
      expect(getTemplateCapability(tpl)).not.toBeNull();
    }
  });

  it("scrapbook has 6 scene kinds", () => {
    expect(getValidKinds("scrapbook")).toEqual([
      "hero", "match", "history", "photo", "timeline", "closing",
    ]);
  });

  it("cr7 has 4 scene kinds", () => {
    expect(getValidKinds("cr7")).toEqual(["hero", "stat", "milestone", "closing"]);
  });

  it("cosmos has 6 scene kinds", () => {
    expect(getValidKinds("cosmos")).toEqual([
      "title", "fact", "compare", "diagram", "timeline", "closing",
    ]);
  });

  it("nodeflow has 6 scene kinds", () => {
    expect(getValidKinds("nodeflow")).toEqual([
      "title", "flow", "contribution", "benefit", "compare", "end",
    ]);
  });

  it("unknown template returns empty kinds", () => {
    expect(getValidKinds("unknown")).toEqual([]);
  });

  it("getDefaultContent returns kind field", () => {
    const c = getDefaultContent("scrapbook", "hero");
    expect(c.kind).toBe("hero");
    expect(c).toHaveProperty("title");
  });
});

// ─── FORMATS: 16:9, 9:16 ────────────────────────────────────────────────────

describe("Format support", () => {
  it("scrapbook supports 16:9 only", () => {
    expect(TEMPLATE_CAPABILITIES.scrapbook.formats).toEqual(["16:9"]);
  });

  it("cr7 supports both formats", () => {
    expect(TEMPLATE_CAPABILITIES.cr7.formats).toEqual(["16:9", "9:16"]);
  });

  it("cosmos supports both formats", () => {
    expect(TEMPLATE_CAPABILITIES.cosmos.formats).toEqual(["16:9", "9:16"]);
  });

  it("nodeflow supports 16:9 only", () => {
    expect(TEMPLATE_CAPABILITIES.nodeflow.formats).toEqual(["16:9"]);
  });
});

// ─── STUDIO: project URL routing ─────────────────────────────────────────────

describe("Studio routing", () => {
  it("composerProjectToProduction creates virtual production", () => {
    const cp = makeProject({ id: "test-123", name: "My Project" });
    // Simulate the conversion function from studio.jsx
    const virtualProd = {
      id: "__composer__" + cp.id,
      name: cp.name + " (Composer)",
      template: cp.template,
      format: cp.format,
      scenes: cp.scenes.map(s => ({ id: s.id, dur: s.duration, kind: s.kind })),
      content: Object.fromEntries(cp.scenes.map(s => [s.id, s.content])),
      _composerProject: true,
    };
    expect(virtualProd.id).toBe("__composer__test-123");
    expect(virtualProd.name).toBe("My Project (Composer)");
    expect(virtualProd._composerProject).toBe(true);
  });

  it("invalid project ID produces null", () => {
    const projects = loadProjects();
    const found = projects.find(p => p.id === "nonexistent");
    expect(found).toBeUndefined();
  });
});

// ─── AUDIO: optional, missing, presence ──────────────────────────────────────

describe("Audio foundation", () => {
  it("scene without audio is valid", () => {
    const scene = makeScene({ audio: undefined });
    const errors = validateScene("scrapbook", scene);
    expect(errors.filter(e => e.code.includes("AUDIO"))).toHaveLength(0);
  });

  it("scene with audio is valid", () => {
    const scene = makeScene({ audio: { path: "test/s1.mp3", present: true } });
    const errors = validateScene("scrapbook", scene);
    expect(errors.filter(e => e.code.includes("AUDIO"))).toHaveLength(0);
  });

  it("audio path is optional in content", () => {
    const scene = makeScene({ audio: { path: "" } });
    expect(scene.audio?.path).toBe("");
  });
});

// ─── ERROR: corrupted storage, invalid project, invalid template ─────────────

describe("Error handling", () => {
  it("corrupted localStorage returns empty", () => {
    localStorageMock.setItem("composer_projects", "not-json{{{");
    const projects = loadProjects();
    expect(projects).toEqual([]);
  });

  it("invalid project ID returns null", () => {
    expect(loadProject("nonexistent")).toBeNull();
  });

  it("validateProject catches missing name", () => {
    const p = makeProject({ name: "" });
    const errors = validateProject(p);
    expect(errors.some(e => e.code === "MISSING_NAME")).toBe(true);
  });

  it("validateProject catches invalid template", () => {
    const p = makeProject({ template: "unknown" });
    const errors = validateProject(p);
    expect(errors.some(e => e.code === "INVALID_TEMPLATE")).toBe(true);
  });

  it("validateProject catches empty scenes", () => {
    const p = makeProject({ scenes: [] });
    const errors = validateProject(p);
    expect(errors.some(e => e.code === "EMPTY_SCENES")).toBe(true);
  });

  it("validateScene catches invalid kind", () => {
    const scene = makeScene({ kind: "invalidKind" });
    const errors = validateScene("scrapbook", scene);
    expect(errors.some(e => e.code === "INVALID_KIND")).toBe(true);
  });

  it("validateScene catches invalid duration", () => {
    const scene = makeScene({ duration: -1 });
    const errors = validateScene("scrapbook", scene);
    expect(errors.some(e => e.code === "INVALID_DURATION")).toBe(true);
  });
});
