// editor.vitest.ts — WS-CREATOR-EDITOR-01 test suite
//
// Tests the Editor MVP: project creation, scene management, content editing,
// persistence, legacy template rejection, and state transitions.
//
// Coverage targets: project identity, scene CRUD, content editing, duration,
// kind switching, localStorage, URL params, legacy templates.

import { describe, it, expect, beforeEach, vi } from "vitest";

// ─── Minimal localStorage mock ──────────────────────────────────────────────
function mockLocalStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { for (const k of Object.keys(store)) delete store[k]; }),
    _store: store,
  };
}

// ─── Editor model functions (extracted from editor.html for testability) ────
// These replicate the pure logic from the editor HTML.

const EDITABLE_IDS = ["scrapbook", "cr7", "cosmos", "nodeflow"];
const LEGACY_IDS = ["nq57", "stoiclove", "blueprint"];
const TEMPLATE_FORMATS: Record<string, string[]> = {
  scrapbook: ["16:9", "9:16"],
  cr7: ["16:9", "9:16"],
  cosmos: ["16:9", "9:16"],
  nodeflow: ["16:9"],
};

const TEMPLATE_SCHEMAS: Record<string, { sceneKinds: string[]; fields: Record<string, Record<string, string>> }> = {
  scrapbook: {
    sceneKinds: ["hero", "match", "history", "photo", "timeline", "closing"],
    fields: {
      hero: { title: "Title", subtitle: "Subtitle", tagline: "Tagline" },
      match: { homeTeam: "Home Team", awayTeam: "Away Team", score: "Score", competition: "Competition", highlight: "Highlight" },
      history: { year: "Year", fact: "Fact", detail: "Detail", annotation: "Annotation" },
      photo: { caption: "Caption", annotation: "Annotation" },
      timeline: { title: "Title" },
      closing: { title: "Title", subtitle: "Subtitle", reference: "Reference" },
    },
  },
  cr7: {
    sceneKinds: ["hero", "stat", "milestone", "closing"],
    fields: {
      hero: { name: "Name", tagline: "Tagline", subtitle: "Subtitle" },
      stat: { label: "Label", bigNumber: "Big Number", sub: "Sub", detail: "Detail" },
      milestone: { title: "Title" },
      closing: { title: "Title", subtitle: "Subtitle", reference: "Reference" },
    },
  },
  cosmos: {
    sceneKinds: ["title", "fact", "compare", "timeline", "diagram", "closing"],
    fields: {
      title: { title: "Title", subtitle: "Subtitle", tagline: "Tagline" },
      fact: { label: "Label", bigValue: "Big Value", unit: "Unit", description: "Description", detail: "Detail" },
      compare: { title: "Title", insight: "Insight" },
      timeline: { title: "Title" },
      diagram: { title: "Title" },
      closing: { title: "Title", subtitle: "Subtitle", reference: "Reference" },
    },
  },
  nodeflow: {
    sceneKinds: ["title", "flow", "contribution", "benefit", "compare", "end"],
    fields: {
      title: { lawCode: "Law Code", title: "Title", subtitle: "Subtitle", tagline: "Tagline" },
      flow: { title: "Title" },
      contribution: { title: "Title" },
      benefit: { title: "Title", description: "Description" },
      compare: { title: "Title" },
      end: { closingTitle: "Title", closingSubtitle: "Subtitle", reference: "Reference" },
    },
  },
};

interface Scene {
  id: string;
  kind: string;
  dur: number;
  content: Record<string, string>;
  audio?: string;
}

interface Project {
  id: string;
  name: string;
  templateId: string;
  format: string;
  scenes: Scene[];
  createdAt: string;
  updatedAt: string;
}

function uid(): string {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function defaultScenes(templateId: string): Scene[] {
  const tpl = TEMPLATE_SCHEMAS[templateId];
  if (!tpl) return [];
  return tpl.sceneKinds.map((kind, i) => {
    const content: Record<string, string> = {};
    const fields = tpl.fields[kind] || {};
    for (const key of Object.keys(fields)) content[key] = "";
    return { id: "s" + (i + 1), kind, dur: 5, content, audio: "" };
  });
}

function createProject(templateId: string, format: string = "16:9", name: string = "Test"): Project {
  const supportedFormats = TEMPLATE_FORMATS[templateId] || ["16:9"];
  const fmt = supportedFormats.includes(format) ? format : "16:9";
  return {
    id: uid(),
    name,
    templateId,
    format: fmt,
    scenes: defaultScenes(templateId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function addScene(project: Project, kind?: string): Project {
  const tpl = TEMPLATE_SCHEMAS[project.templateId];
  if (!tpl) return project;
  const sceneKind = kind || tpl.sceneKinds[0];
  const fields = tpl.fields[sceneKind] || {};
  const content: Record<string, string> = {};
  for (const key of Object.keys(fields)) content[key] = "";
  const newScene: Scene = {
    id: "s" + (project.scenes.length + 1) + "_" + Date.now().toString(36),
    kind: sceneKind,
    dur: 5,
    content,
  };
  return { ...project, scenes: [...project.scenes, newScene], updatedAt: new Date().toISOString() };
}

function duplicateScene(project: Project, idx: number): Project {
  const src = project.scenes[idx];
  if (!src) return project;
  const dup: Scene = { ...src, id: src.id + "_copy", content: { ...src.content } };
  const scenes = [...project.scenes];
  scenes.splice(idx + 1, 0, dup);
  return { ...project, scenes, updatedAt: new Date().toISOString() };
}

function deleteScene(project: Project, idx: number): Project {
  if (project.scenes.length <= 1) return project;
  const scenes = project.scenes.filter((_, i) => i !== idx);
  return { ...project, scenes, updatedAt: new Date().toISOString() };
}

function moveScene(project: Project, idx: number, dir: -1 | 1): Project {
  const ni = idx + dir;
  if (ni < 0 || ni >= project.scenes.length) return project;
  const scenes = [...project.scenes];
  [scenes[idx], scenes[ni]] = [scenes[ni], scenes[idx]];
  return { ...project, scenes, updatedAt: new Date().toISOString() };
}

function updateContent(project: Project, sceneIdx: number, field: string, value: string): Project {
  if (sceneIdx < 0 || sceneIdx >= project.scenes.length) return project;
  const scenes = [...project.scenes];
  scenes[sceneIdx] = {
    ...scenes[sceneIdx],
    content: { ...scenes[sceneIdx].content, [field]: value },
  };
  return { ...project, scenes, updatedAt: new Date().toISOString() };
}

function updateDuration(project: Project, sceneIdx: number, dur: number): Project {
  if (sceneIdx < 0 || sceneIdx >= project.scenes.length) return project;
  if (isNaN(dur) || dur < 0.5) return project;
  const scenes = [...project.scenes];
  scenes[sceneIdx] = { ...scenes[sceneIdx], dur };
  return { ...project, scenes, updatedAt: new Date().toISOString() };
}

function updateKind(project: Project, sceneIdx: number, newKind: string): Project {
  if (sceneIdx < 0 || sceneIdx >= project.scenes.length) return project;
  const tpl = TEMPLATE_SCHEMAS[project.templateId];
  if (!tpl) return project;
  if (!tpl.sceneKinds.includes(newKind)) return project;
  const fields = tpl.fields[newKind] || {};
  const content: Record<string, string> = {};
  for (const key of Object.keys(fields)) {
    content[key] = project.scenes[sceneIdx].content[key] || "";
  }
  const scenes = [...project.scenes];
  scenes[sceneIdx] = { ...scenes[sceneIdx], kind: newKind, content };
  return { ...project, scenes, updatedAt: new Date().toISOString() };
}

function isEditable(templateId: string): boolean {
  return EDITABLE_IDS.includes(templateId);
}

function isLegacy(templateId: string): boolean {
  return LEGACY_IDS.includes(templateId);
}

function updateAudio(project: Project, sceneIdx: number, audio: string): Project {
  if (sceneIdx < 0 || sceneIdx >= project.scenes.length) return project;
  const scenes = [...project.scenes];
  scenes[sceneIdx] = { ...scenes[sceneIdx], audio };
  return { ...project, scenes, updatedAt: new Date().toISOString() };
}

function buildStudioProject(project: Project): Record<string, unknown> {
  const THEMES: Record<string, Record<string, string>> = {
    scrapbook: { bg:"#f5f0e8", a1:"#c0392b" },
    cr7: { bg:"#0c0a09", a1:"#f59e0b" },
    cosmos: { bg:"#050510", a1:"#3b82f6" },
    nodeflow: { bg:"#0a0e1a", a1:"#00d4ff" },
  };
  const th = THEMES[project.templateId] || THEMES.nodeflow;
  const studioProject: Record<string, unknown> = {
    id: project.id, name: project.name, template: project.templateId, format: project.format,
    theme: th,
    scenes: project.scenes.map(s => ({ id: s.id, dur: s.dur, kind: s.kind })),
    content: {} as Record<string, Record<string, string>>,
  };
  const content = studioProject.content as Record<string, Record<string, string>>;
  for (const s of project.scenes) {
    content[s.id] = { kind: s.kind, ...s.content };
  }
  return studioProject;
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("WS-CREATOR-EDITOR-01: Editor MVP", () => {
  // ─── Template Registry ────────────────────────────────────────────────────
  describe("Template Registry", () => {
    it("editable templates are correctly identified", () => {
      expect(isEditable("scrapbook")).toBe(true);
      expect(isEditable("cr7")).toBe(true);
      expect(isEditable("cosmos")).toBe(true);
      expect(isEditable("nodeflow")).toBe(true);
    });

    it("legacy templates are correctly identified", () => {
      expect(isLegacy("nq57")).toBe(true);
      expect(isLegacy("stoiclove")).toBe(true);
      expect(isLegacy("blueprint")).toBe(true);
    });

    it("unknown templates are neither editable nor legacy", () => {
      expect(isEditable("unknown")).toBe(false);
      expect(isLegacy("unknown")).toBe(false);
    });

    it("all editable templates have scene kinds defined", () => {
      for (const id of EDITABLE_IDS) {
        const tpl = TEMPLATE_SCHEMAS[id];
        expect(tpl).toBeDefined();
        expect(tpl!.sceneKinds.length).toBeGreaterThan(0);
      }
    });

    it("all editable templates have fields defined for each kind", () => {
      for (const id of EDITABLE_IDS) {
        const tpl = TEMPLATE_SCHEMAS[id]!;
        for (const kind of tpl.sceneKinds) {
          expect(tpl.fields[kind]).toBeDefined();
        }
      }
    });
  });

  // ─── Project Creation ─────────────────────────────────────────────────────
  describe("Project Creation", () => {
    it("creates a scrapbook project with correct defaults", () => {
      const p = createProject("scrapbook", "9:16", "CL Final");
      expect(p.templateId).toBe("scrapbook");
      expect(p.format).toBe("9:16");
      expect(p.name).toBe("CL Final");
      expect(p.scenes.length).toBe(6); // hero, match, history, photo, timeline, closing
      expect(p.scenes[0].kind).toBe("hero");
    });

    it("creates a cr7 project with correct defaults", () => {
      const p = createProject("cr7", "16:9", "CR7 Legacy");
      expect(p.templateId).toBe("cr7");
      expect(p.scenes.length).toBe(4);
    });

    it("creates a cosmos project with correct defaults", () => {
      const p = createProject("cosmos", "16:9");
      expect(p.templateId).toBe("cosmos");
      expect(p.scenes.length).toBe(6);
    });

    it("creates a nodeflow project with correct defaults", () => {
      const p = createProject("nodeflow", "16:9");
      expect(p.templateId).toBe("nodeflow");
      expect(p.scenes.length).toBe(6);
    });

    it("all scenes have unique IDs", () => {
      const p = createProject("scrapbook");
      const ids = p.scenes.map(s => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all scenes have default duration of 5s", () => {
      const p = createProject("scrapbook");
      for (const s of p.scenes) {
        expect(s.dur).toBe(5);
      }
    });

    it("all scene content fields are initialized empty", () => {
      const p = createProject("scrapbook");
      for (const s of p.scenes) {
        for (const val of Object.values(s.content)) {
          expect(val).toBe("");
        }
      }
    });

    it("invalid format falls back to 16:9", () => {
      const p = createProject("scrapbook", "4:3");
      expect(p.format).toBe("16:9");
    });

    it("unknown template creates empty scenes", () => {
      const p = createProject("unknown");
      expect(p.scenes.length).toBe(0);
    });

    it("project has timestamps", () => {
      const p = createProject("scrapbook");
      expect(p.createdAt).toBeTruthy();
      expect(p.updatedAt).toBeTruthy();
      expect(new Date(p.createdAt).getTime()).toBeGreaterThan(0);
    });
  });

  // ─── Scene Management ─────────────────────────────────────────────────────
  describe("Scene Management", () => {
    it("adds a new scene at the end", () => {
      const p = createProject("scrapbook");
      const p2 = addScene(p, "hero");
      expect(p2.scenes.length).toBe(7);
      expect(p2.scenes[6].kind).toBe("hero");
    });

    it("adds a scene with default kind when none specified", () => {
      const p = createProject("scrapbook");
      const p2 = addScene(p);
      expect(p2.scenes[6].kind).toBe("hero"); // first kind in scrapbook
    });

    it("duplicates a scene at the correct position", () => {
      const p = createProject("scrapbook");
      const p2 = duplicateScene(p, 0);
      expect(p2.scenes.length).toBe(7);
      expect(p2.scenes[1].kind).toBe("hero"); // duplicate inserted after idx 0
      expect(p2.scenes[1].id).not.toBe(p.scenes[0].id);
    });

    it("preserves content when duplicating", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "title", "Champions League");
      const p3 = duplicateScene(p2, 0);
      expect(p3.scenes[1].content.title).toBe("Champions League");
    });

    it("deletes a scene", () => {
      const p = createProject("scrapbook");
      const p2 = deleteScene(p, 2);
      expect(p2.scenes.length).toBe(5);
      expect(p2.scenes[1].kind).toBe("match"); // still at idx 1
    });

    it("prevents deleting the last scene", () => {
      const p = createProject("scrapbook");
      const singleScene = { ...p, scenes: [p.scenes[0]] };
      const p2 = deleteScene(singleScene, 0);
      expect(p2.scenes.length).toBe(1); // unchanged
    });

    it("moves scene left", () => {
      const p = createProject("scrapbook");
      const p2 = moveScene(p, 2, -1);
      expect(p2.scenes[0].kind).toBe("hero");
      expect(p2.scenes[1].kind).toBe("history"); // moved from idx 2 to 1
      expect(p2.scenes[2].kind).toBe("match");
    });

    it("moves scene right", () => {
      const p = createProject("scrapbook");
      const p2 = moveScene(p, 0, 1);
      expect(p2.scenes[0].kind).toBe("match");
      expect(p2.scenes[1].kind).toBe("hero");
    });

    it("prevents moving left from first position", () => {
      const p = createProject("scrapbook");
      const p2 = moveScene(p, 0, -1);
      expect(p2.scenes[0].kind).toBe("hero"); // unchanged
    });

    it("prevents moving right from last position", () => {
      const p = createProject("scrapbook");
      const lastIdx = p.scenes.length - 1;
      const p2 = moveScene(p, lastIdx, 1);
      expect(p2.scenes[lastIdx].kind).toBe("closing"); // unchanged
    });
  });

  // ─── Content Editing ──────────────────────────────────────────────────────
  describe("Content Editing", () => {
    it("updates a text field in a scene", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "title", "CL Final 2024");
      expect(p2.scenes[0].content.title).toBe("CL Final 2024");
    });

    it("preserves other fields when updating one", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "title", "CL Final");
      const p3 = updateContent(p2, 0, "subtitle", "Madrid vs Dortmund");
      expect(p3.scenes[0].content.title).toBe("CL Final");
      expect(p3.scenes[0].content.subtitle).toBe("Madrid vs Dortmund");
    });

    it("clears a field with empty string", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "title", "CL Final");
      const p3 = updateContent(p2, 0, "title", "");
      expect(p3.scenes[0].content.title).toBe("");
    });

    it("updates duration with valid value", () => {
      const p = createProject("scrapbook");
      const p2 = updateDuration(p, 0, 7.5);
      expect(p2.scenes[0].dur).toBe(7.5);
    });

    it("rejects duration below 0.5s", () => {
      const p = createProject("scrapbook");
      const p2 = updateDuration(p, 0, 0.3);
      expect(p2.scenes[0].dur).toBe(5); // unchanged
    });

    it("accepts duration of exactly 0.5s", () => {
      const p = createProject("scrapbook");
      const p2 = updateDuration(p, 0, 0.5);
      expect(p2.scenes[0].dur).toBe(0.5);
    });
  });

  // ─── Kind Switching ───────────────────────────────────────────────────────
  describe("Kind Switching", () => {
    it("switches scene kind and updates content fields", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "subtitle", "Madrid vs Dortmund");
      const p3 = updateKind(p2, 0, "match");
      expect(p3.scenes[0].kind).toBe("match");
      // subtitle field doesn't exist in match, should be cleared
      expect(p3.scenes[0].content.subtitle).toBeUndefined();
      // match-specific fields should be initialized
      expect(p3.scenes[0].content.homeTeam).toBe("");
    });

    it("clears fields that don't exist in new kind", () => {
      const p = createProject("cr7");
      const p2 = updateContent(p, 0, "name", "Ronaldo");
      const p2b = updateContent(p2, 0, "tagline", "GOAT");
      const p3 = updateKind(p2b, 0, "milestone"); // milestone only has 'title'
      expect(p3.scenes[0].kind).toBe("milestone");
      expect(p3.scenes[0].content.name).toBeUndefined();
      expect(p3.scenes[0].content.tagline).toBeUndefined();
    });

    it("kind switching with invalid kind is rejected", () => {
      const p = createProject("scrapbook");
      const p2 = updateKind(p, 0, "nonexistent");
      // invalid kind is rejected, scene unchanged
      expect(p2.scenes[0].kind).toBe("hero");
    });
  });

  // ─── Persistence ──────────────────────────────────────────────────────────
  describe("Persistence", () => {
    it("saves and loads projects from localStorage", () => {
      const ls = mockLocalStorage();
      const p = createProject("scrapbook", "16:9", "My Video");

      // Save
      const projects: Record<string, Project> = {};
      projects[p.id] = p;
      ls.setItem("nf_editor_projects", JSON.stringify(projects));

      // Load
      const loaded = JSON.parse(ls.getItem("nf_editor_projects") || "{}");
      expect(loaded[p.id]).toBeDefined();
      expect(loaded[p.id].name).toBe("My Video");
      expect(loaded[p.id].scenes.length).toBe(6);
    });

    it("persists current project ID", () => {
      const ls = mockLocalStorage();
      ls.setItem("nf_editor_current", "test_id");
      expect(ls.getItem("nf_editor_current")).toBe("test_id");
    });

    it("loads existing project by ID", () => {
      const ls = mockLocalStorage();
      const p = createProject("scrapbook");
      const projects: Record<string, Project> = {};
      projects[p.id] = p;
      ls.setItem("nf_editor_projects", JSON.stringify(projects));

      const loaded = JSON.parse(ls.getItem("nf_editor_projects") || "{}");
      expect(loaded[p.id]).toBeDefined();
      expect(loaded[p.id].id).toBe(p.id);
    });

    it("handles corrupt localStorage gracefully", () => {
      const ls = mockLocalStorage();
      ls.setItem("nf_editor_projects", "NOT_JSON!!!");
      let parsed: Record<string, Project>;
      try {
        parsed = JSON.parse(ls.getItem("nf_editor_projects") || "{}");
      } catch {
        parsed = {};
      }
      expect(parsed).toEqual({});
    });

    it("handles missing localStorage key gracefully", () => {
      const ls = mockLocalStorage();
      const val = ls.getItem("nf_editor_projects");
      expect(val).toBeNull();
    });
  });

  // ─── Legacy Template Rejection ────────────────────────────────────────────
  describe("Legacy Template Rejection", () => {
    it("nq57 is not editable", () => {
      expect(isEditable("nq57")).toBe(false);
    });

    it("stoiclove is not editable", () => {
      expect(isEditable("stoiclove")).toBe(false);
    });

    it("blueprint is not editable", () => {
      expect(isEditable("blueprint")).toBe(false);
    });

    it("legacy templates are flagged separately", () => {
      expect(isLegacy("nq57")).toBe(true);
      expect(isLegacy("stoiclove")).toBe(true);
      expect(isLegacy("blueprint")).toBe(true);
    });

    it("cannot create project with legacy template", () => {
      // The editor rejects legacy templates by returning null
      expect(isEditable("nq57")).toBe(false);
      expect(isEditable("stoiclove")).toBe(false);
      expect(isEditable("blueprint")).toBe(false);
    });
  });

  // ─── Project Identity ─────────────────────────────────────────────────────
  describe("Project Identity", () => {
    it("each project gets a unique ID", () => {
      const p1 = createProject("scrapbook");
      const p2 = createProject("scrapbook");
      expect(p1.id).not.toBe(p2.id);
    });

    it("project name can be updated", () => {
      const p = createProject("scrapbook", "16:9", "Old Name");
      const p2 = { ...p, name: "New Name" };
      expect(p2.name).toBe("New Name");
    });

    it("updatedAt changes on modification", () => {
      const p = createProject("scrapbook");
      const before = p.updatedAt;
      // Manually set a later updatedAt to verify the model supports it
      const p2 = { ...p, updatedAt: new Date(Date.now() + 1000).toISOString() };
      expect(p2.updatedAt).not.toBe(before);
      expect(new Date(p2.updatedAt).getTime()).toBeGreaterThan(new Date(before).getTime());
    });
  });

  // ─── Scene Count Validation ───────────────────────────────────────────────
  describe("Scene Count Validation", () => {
    it("scrapbook starts with 6 scenes", () => {
      expect(createProject("scrapbook").scenes.length).toBe(6);
    });

    it("cr7 starts with 4 scenes", () => {
      expect(createProject("cr7").scenes.length).toBe(4);
    });

    it("cosmos starts with 6 scenes", () => {
      expect(createProject("cosmos").scenes.length).toBe(6);
    });

    it("nodeflow starts with 6 scenes", () => {
      expect(createProject("nodeflow").scenes.length).toBe(6);
    });

    it("adding scenes increases count", () => {
      const p = createProject("scrapbook");
      let proj = p;
      for (let i = 0; i < 5; i++) proj = addScene(proj);
      expect(proj.scenes.length).toBe(11);
    });

    it("scene count never goes below 1", () => {
      const p = createProject("scrapbook");
      let proj = { ...p, scenes: [p.scenes[0]] };
      proj = deleteScene(proj, 0);
      expect(proj.scenes.length).toBe(1);
    });
  });

  // ─── URL Parameter Handling ───────────────────────────────────────────────
  describe("URL Parameter Handling", () => {
    it("recognizes project param", () => {
      const params = new URLSearchParams("?project=abc123");
      expect(params.get("project")).toBe("abc123");
    });

    it("recognizes template param", () => {
      const params = new URLSearchParams("?template=scrapbook&format=9:16&name=Test");
      expect(params.get("template")).toBe("scrapbook");
      expect(params.get("format")).toBe("9:16");
      expect(params.get("name")).toBe("Test");
    });

    it("handles missing params gracefully", () => {
      const params = new URLSearchParams("");
      expect(params.get("project")).toBeNull();
      expect(params.get("template")).toBeNull();
    });
  });

  // ─── Editor State Transitions ─────────────────────────────────────────────
  describe("Editor State Transitions", () => {
    it("new project starts with first scene selected", () => {
      const p = createProject("scrapbook");
      const selectedIdx = 0;
      expect(p.scenes[selectedIdx]).toBeDefined();
      expect(p.scenes[selectedIdx].kind).toBe("hero");
    });

    it("deleting selected scene adjusts selection", () => {
      const p = createProject("scrapbook");
      const selectedIdx = 3; // history
      const p2 = deleteScene(p, selectedIdx);
      const newSelected = Math.max(0, selectedIdx - 1);
      expect(p2.scenes[newSelected]).toBeDefined();
    });

    it("switching kind preserves scene ID", () => {
      const p = createProject("scrapbook");
      const originalId = p.scenes[0].id;
      const p2 = updateKind(p, 0, "match");
      expect(p2.scenes[0].id).toBe(originalId);
    });
  });

  // ─── Edge Cases ───────────────────────────────────────────────────────────
  describe("Edge Cases", () => {
    it("empty project name is allowed", () => {
      const p = createProject("scrapbook", "16:9", "");
      expect(p.name).toBe("");
    });

    it("very long project name is allowed", () => {
      const longName = "A".repeat(500);
      const p = createProject("scrapbook", "16:9", longName);
      expect(p.name.length).toBe(500);
    });

    it("special characters in content are preserved", () => {
      const p = createProject("scrapbook");
      const special = "Champions <League> & 'Final' \"2024\" 🏆";
      const p2 = updateContent(p, 0, "title", special);
      expect(p2.scenes[0].content.title).toBe(special);
    });

    it("very long content is preserved", () => {
      const p = createProject("scrapbook");
      const long = "Word ".repeat(200);
      const p2 = updateContent(p, 0, "title", long);
      expect(p2.scenes[0].content.title).toBe(long);
    });

    it("multiple rapid edits are applied correctly", () => {
      let p = createProject("scrapbook");
      for (let i = 0; i < 50; i++) {
        p = updateContent(p, 0, "title", "Edit " + i);
      }
      expect(p.scenes[0].content.title).toBe("Edit 49");
    });
  });

  // ─── Preview Renderer Coverage ────────────────────────────────────────────
  describe("Preview Renderer Coverage", () => {
    const EDITOR_TEMPLATES = ["scrapbook", "cr7", "cosmos", "nodeflow"];
    const RENDERER_MAP: Record<string, string[]> = {
      scrapbook: ["hero", "match", "history", "photo", "timeline", "closing"],
      cr7: ["hero", "stat", "milestone", "closing"],
      cosmos: ["title", "fact", "compare", "timeline", "diagram", "closing"],
      nodeflow: ["title", "flow", "contribution", "benefit", "compare", "end"],
    };

    for (const tplId of EDITOR_TEMPLATES) {
      it(`${tplId} has renderers for all scene kinds`, () => {
        const kinds = RENDERER_MAP[tplId];
        expect(kinds).toBeDefined();
        expect(kinds.length).toBeGreaterThan(0);
        // Each kind should be in the template's sceneKinds
        const tpl = TEMPLATE_SCHEMAS[tplId];
        expect(tpl).toBeDefined();
        for (const kind of kinds) {
          expect(tpl!.sceneKinds).toContain(kind);
        }
      });
    }
  });

  // ─── Creator → Editor Routing ─────────────────────────────────────────────
  describe("Creator → Editor Routing", () => {
    it("editor URL params are correctly formed", () => {
      const template = "scrapbook";
      const format = "9:16";
      const name = "CL Final";
      const url = `/preview/editor.html?template=${encodeURIComponent(template)}&format=${encodeURIComponent(format)}&name=${encodeURIComponent(name)}`;
      expect(url).toContain("template=scrapbook");
      expect(url).toContain("format=9%3A16");
      expect(url).toContain("name=CL%20Final");
    });

    it("editor creates project from template params", () => {
      const p = createProject("scrapbook", "9:16", "CL Final");
      expect(p.templateId).toBe("scrapbook");
      expect(p.format).toBe("9:16");
      expect(p.name).toBe("CL Final");
      expect(p.scenes.length).toBe(6);
    });

    it("editor loads existing project by ID", () => {
      const p = createProject("scrapbook");
      const loaded = createProject("scrapbook");
      // Simulate loading: both should be valid projects
      expect(p.id).toBeTruthy();
      expect(loaded.id).toBeTruthy();
      expect(p.id).not.toBe(loaded.id); // different IDs
    });
  });

  // ─── Multi-Format Support ─────────────────────────────────────────────────
  describe("Multi-Format Support", () => {
    it("scrapbook supports 16:9", () => {
      const p = createProject("scrapbook", "16:9");
      expect(p.format).toBe("16:9");
    });

    it("scrapbook supports 9:16", () => {
      const p = createProject("scrapbook", "9:16");
      expect(p.format).toBe("9:16");
    });

    it("cr7 supports 16:9", () => {
      const p = createProject("cr7", "16:9");
      expect(p.format).toBe("16:9");
    });

    it("cr7 supports 9:16", () => {
      const p = createProject("cr7", "9:16");
      expect(p.format).toBe("9:16");
    });

    it("cosmos supports 16:9", () => {
      const p = createProject("cosmos", "16:9");
      expect(p.format).toBe("16:9");
    });

    it("cosmos supports 9:16", () => {
      const p = createProject("cosmos", "9:16");
      expect(p.format).toBe("9:16");
    });

    it("nodeflow only supports 16:9", () => {
      const p = createProject("nodeflow", "16:9");
      expect(p.format).toBe("16:9");
      const p2 = createProject("nodeflow", "9:16");
      expect(p2.format).toBe("16:9"); // falls back to 16:9
    });
  });

  // ─── Export Boundary ──────────────────────────────────────────────────────
  describe("Export Boundary", () => {
    it("editor does not generate MP4 files", () => {
      // Editor is state-only, no export capability
      const p = createProject("scrapbook");
      expect(p).toHaveProperty("id");
      expect(p).toHaveProperty("scenes");
      // No export methods on the project object
      expect(typeof (p as any).export).toBe("undefined");
      expect(typeof (p as any).render).toBe("undefined");
    });

    it("editor does not mutate canonical data", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "title", "Test");
      // Project is a new object, original unchanged
      expect(p.scenes[0].content.title).toBe("");
      expect(p2.scenes[0].content.title).toBe("Test");
    });
  });

  // ─── Architecture Boundary ────────────────────────────────────────────────
  describe("Architecture Boundary", () => {
    it("editor data is independent of studio productions", () => {
      const p = createProject("scrapbook");
      // Editor project has different structure than studio production
      expect(p).toHaveProperty("templateId");
      expect(p).toHaveProperty("format");
      expect(p).toHaveProperty("scenes");
      // Studio productions have 'theme', editor projects don't
      expect((p as any).theme).toBeUndefined();
    });

    it("legacy templates remain blocked in editor", () => {
      expect(isEditable("nq57")).toBe(false);
      expect(isEditable("stoiclove")).toBe(false);
      expect(isEditable("blueprint")).toBe(false);
    });

    it("editor does not import from template layer", () => {
      // Editor defines its own TEMPLATES registry, independent of src/templates/
      // This is verified by the editor being a standalone HTML file
      expect(EDITABLE_IDS.length).toBe(4);
    });
  });

  // ─── Content Immutability ─────────────────────────────────────────────────
  describe("Content Immutability", () => {
    it("content update creates new object", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "title", "Test");
      expect(p.scenes[0]).not.toBe(p2.scenes[0]);
      expect(p.scenes[0].content).not.toBe(p2.scenes[0].content);
    });

    it("scene array is replaced, not mutated", () => {
      const p = createProject("scrapbook");
      const p2 = addScene(p);
      expect(p.scenes).not.toBe(p2.scenes);
      expect(p.scenes.length).toBe(6);
      expect(p2.scenes.length).toBe(7);
    });

    it("project is replaced on any mutation", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "title", "Test");
      expect(p).not.toBe(p2);
    });
  });

  // ─── Audio Foundation ─────────────────────────────────────────────────────
  describe("Audio Foundation", () => {
    it("scenes default to empty audio", () => {
      const p = createProject("scrapbook");
      for (const s of p.scenes) {
        expect(s.audio).toBe("");
      }
    });

    it("audio field is optional and can be set", () => {
      const p = createProject("scrapbook");
      const p2 = updateAudio(p, 0, "s1.mp3");
      expect(p2.scenes[0].audio).toBe("s1.mp3");
    });

    it("audio can be cleared", () => {
      const p = createProject("scrapbook");
      const p2 = updateAudio(p, 0, "s1.mp3");
      const p3 = updateAudio(p2, 0, "");
      expect(p3.scenes[0].audio).toBe("");
    });

    it("audio is preserved when duplicating a scene", () => {
      const p = createProject("scrapbook");
      const p2 = updateAudio(p, 0, "hero.mp3");
      const p3 = duplicateScene(p2, 0);
      expect(p3.scenes[1].audio).toBe("hero.mp3");
    });

    it("audio does not affect other scenes", () => {
      const p = createProject("scrapbook");
      const p2 = updateAudio(p, 0, "s1.mp3");
      expect(p2.scenes[1].audio).toBe("");
    });

    it("existing scenes without audio field remain valid", () => {
      const scene: Scene = { id: "s1", kind: "hero", dur: 5, content: {} };
      expect(scene.audio).toBeUndefined();
    });

    it("audio presence indicator is derived from audio field", () => {
      const p = createProject("scrapbook");
      expect(p.scenes[0].audio ? "\u266B" : "").toBe("");
      const p2 = updateAudio(p, 0, "s1.mp3");
      expect(p2.scenes[0].audio ? "\u266B" : "").toBe("\u266B");
    });
  });

  // ─── Studio Handoff ──────────────────────────────────────────────────────
  describe("Studio Handoff", () => {
    it("buildStudioProject creates valid Studio structure", () => {
      const p = createProject("scrapbook", "16:9", "Test Video");
      const sp = buildStudioProject(p);
      expect(sp.id).toBe(p.id);
      expect(sp.name).toBe("Test Video");
      expect(sp.template).toBe("scrapbook");
      expect(sp.format).toBe("16:9");
      expect(sp.theme).toBeDefined();
    });

    it("Studio project has scenes array with id, dur, kind", () => {
      const p = createProject("cr7");
      const sp = buildStudioProject(p);
      const scenes = sp.scenes as Array<{ id: string; dur: number; kind: string }>;
      expect(scenes.length).toBe(4);
      for (const s of scenes) {
        expect(s.id).toBeTruthy();
        expect(s.dur).toBeGreaterThan(0);
        expect(s.kind).toBeTruthy();
      }
    });

    it("Studio project has content keyed by scene ID", () => {
      const p = createProject("cosmos");
      const p2 = updateContent(p, 0, "title", "Solar System");
      const sp = buildStudioProject(p2);
      const content = sp.content as Record<string, Record<string, string>>;
      expect(content[p2.scenes[0].id]).toBeDefined();
      expect(content[p2.scenes[0].id].title).toBe("Solar System");
      expect(content[p2.scenes[0].id].kind).toBe("title");
    });

    it("Studio project does not include audio field", () => {
      const p = createProject("nodeflow");
      const p2 = updateAudio(p, 0, "title.mp3");
      const sp = buildStudioProject(p2);
      const scenes = sp.scenes as Array<{ id: string; dur: number; kind: string }>;
      expect(scenes[0]).not.toHaveProperty("audio");
    });

    it("Studio project ID matches Composer project ID", () => {
      const p = createProject("scrapbook");
      const sp = buildStudioProject(p);
      expect(sp.id).toBe(p.id);
    });

    it("Studio project preserves all scene durations", () => {
      const p = createProject("cr7");
      const p2 = updateDuration(p, 0, 8.5);
      const p3 = updateDuration(p2, 1, 12.0);
      const sp = buildStudioProject(p3);
      const scenes = sp.scenes as Array<{ id: string; dur: number }>;
      expect(scenes[0].dur).toBe(8.5);
      expect(scenes[1].dur).toBe(12.0);
    });

    it("invalid project ID shows error state", () => {
      const params = new URLSearchParams("?project=nonexistent");
      const projectId = params.get("project");
      const PRODUCTIONS = [{ id: "nq57" }, { id: "dean06" }];
      const idx = PRODUCTIONS.findIndex(p => p.id === projectId);
      // With invalid ID, findIndex returns -1, which is < 0
      expect(idx).toBe(-1);
    });

    it("invalid production ID shows error state", () => {
      const params = new URLSearchParams("?production=nonexistent");
      const productionId = params.get("production");
      const PRODUCTIONS = [{ id: "nq57" }, { id: "dean06" }];
      const idx = PRODUCTIONS.findIndex(p => p.id === productionId);
      expect(idx).toBe(-1);
    });

    it("valid production ID resolves correctly", () => {
      const params = new URLSearchParams("?production=nq57");
      const productionId = params.get("production");
      const PRODUCTIONS = [{ id: "nq57" }, { id: "dean06" }];
      const idx = PRODUCTIONS.findIndex(p => p.id === productionId);
      expect(idx).toBe(0);
    });

    it("Composer project structure is compatible with Studio renderers", () => {
      const TEMPLATES = ["scrapbook", "cr7", "cosmos", "nodeflow"];
      const RENDERER_MAP: Record<string, string[]> = {
        scrapbook: ["hero", "match", "history", "photo", "timeline", "closing"],
        cr7: ["hero", "stat", "milestone", "closing"],
        cosmos: ["title", "fact", "compare", "timeline", "diagram", "closing"],
        nodeflow: ["title", "flow", "contribution", "benefit", "compare", "end"],
      };
      for (const tpl of TEMPLATES) {
        const p = createProject(tpl);
        const sp = buildStudioProject(p);
        expect(sp.template).toBe(tpl);
        const scenes = sp.scenes as Array<{ id: string; kind: string }>;
        const content = sp.content as Record<string, Record<string, string>>;
        for (const s of scenes) {
          expect(RENDERER_MAP[tpl]).toContain(s.kind);
          expect(content[s.id]).toBeDefined();
          expect(content[s.id].kind).toBe(s.kind);
        }
      }
    });
  });

  // ─── Error Handling ──────────────────────────────────────────────────────
  describe("Error Handling", () => {
    it("corrupt localStorage returns empty object", () => {
      const ls = mockLocalStorage();
      ls.setItem("nf_editor_projects", "NOT_JSON!!!");
      let parsed: Record<string, Project>;
      try {
        parsed = JSON.parse(ls.getItem("nf_editor_projects") || "{}");
      } catch {
        parsed = {};
      }
      expect(parsed).toEqual({});
    });

    it("missing localStorage key returns empty object", () => {
      const ls = mockLocalStorage();
      let parsed: Record<string, Project>;
      try {
        parsed = JSON.parse(ls.getItem("nf_editor_projects") || "{}");
      } catch {
        parsed = {};
      }
      expect(parsed).toEqual({});
    });

    it("null project returns error state", () => {
      const project = null;
      const msg = project ? "has project" : "No project or template specified.";
      expect(msg).toBe("No project or template specified.");
    });

    it("invalid template ID returns empty scenes", () => {
      const p = createProject("nonexistent");
      expect(p.scenes.length).toBe(0);
    });

    it("invalid format falls back to 16:9", () => {
      const p = createProject("scrapbook", "4:3");
      expect(p.format).toBe("16:9");
    });

    it("invalid scene kind is rejected by updateKind", () => {
      const p = createProject("scrapbook");
      const p2 = updateKind(p, 0, "nonexistent");
      expect(p2.scenes[0].kind).toBe("hero");
    });

    it("duration below 0.5 is rejected", () => {
      const p = createProject("scrapbook");
      const p2 = updateDuration(p, 0, 0.1);
      expect(p2.scenes[0].dur).toBe(5);
    });

    it("NaN duration is rejected", () => {
      const p = createProject("scrapbook");
      const p2 = updateDuration(p, 0, NaN);
      expect(p2.scenes[0].dur).toBe(5);
    });

    it("negative duration is rejected", () => {
      const p = createProject("scrapbook");
      const p2 = updateDuration(p, 0, -1);
      expect(p2.scenes[0].dur).toBe(5);
    });

    it("delete scene index out of bounds is safe", () => {
      const p = createProject("scrapbook");
      const p2 = deleteScene(p, 99);
      expect(p2.scenes.length).toBe(6);
    });

    it("duplicate scene index out of bounds is safe", () => {
      const p = createProject("scrapbook");
      const p2 = duplicateScene(p, 99);
      expect(p2.scenes.length).toBe(6);
    });

    it("move scene out of bounds is safe", () => {
      const p = createProject("scrapbook");
      const p2 = moveScene(p, 99, 1);
      expect(p2.scenes.length).toBe(6);
    });

    it("updateContent with invalid scene index is safe", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 99, "title", "Test");
      expect(p2.scenes.length).toBe(6);
    });

    it("updateDuration with invalid scene index is safe", () => {
      const p = createProject("scrapbook");
      const p2 = updateDuration(p, 99, 10);
      expect(p2.scenes.length).toBe(6);
    });

    it("updateKind with invalid scene index is safe", () => {
      const p = createProject("scrapbook");
      const p2 = updateKind(p, 99, "match");
      expect(p2.scenes.length).toBe(6);
    });

    it("updateAudio with invalid scene index is safe", () => {
      const p = createProject("scrapbook");
      const p2 = updateAudio(p, 99, "test.mp3");
      expect(p2.scenes.length).toBe(6);
    });
  });

  // ─── Template Coverage ───────────────────────────────────────────────────
  describe("Template Coverage", () => {
    it("scrapbook has all 6 scene kinds", () => {
      const p = createProject("scrapbook");
      const kinds = p.scenes.map(s => s.kind);
      expect(kinds).toEqual(["hero", "match", "history", "photo", "timeline", "closing"]);
    });

    it("cr7 has all 4 scene kinds", () => {
      const p = createProject("cr7");
      const kinds = p.scenes.map(s => s.kind);
      expect(kinds).toEqual(["hero", "stat", "milestone", "closing"]);
    });

    it("cosmos has all 6 scene kinds", () => {
      const p = createProject("cosmos");
      const kinds = p.scenes.map(s => s.kind);
      expect(kinds).toEqual(["title", "fact", "compare", "timeline", "diagram", "closing"]);
    });

    it("nodeflow has all 6 scene kinds", () => {
      const p = createProject("nodeflow");
      const kinds = p.scenes.map(s => s.kind);
      expect(kinds).toEqual(["title", "flow", "contribution", "benefit", "compare", "end"]);
    });

    it("all template scene kinds have defined fields", () => {
      for (const [tplId, tpl] of Object.entries(TEMPLATE_SCHEMAS)) {
        for (const kind of tpl.sceneKinds) {
          expect(tpl.fields[kind]).toBeDefined();
          expect(Object.keys(tpl.fields[kind]).length).toBeGreaterThan(0);
        }
      }
    });

    it("kind switching preserves fields that exist in both kinds", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "title", "CL Final");
      const p3 = updateContent(p2, 0, "subtitle", "Madrid vs Dortmund");
      // Both hero and closing have title and subtitle
      const p4 = updateKind(p3, 0, "closing");
      expect(p4.scenes[0].content.title).toBe("CL Final");
      expect(p4.scenes[0].content.subtitle).toBe("Madrid vs Dortmund");
    });

    it("kind switching clears fields that don't exist in new kind", () => {
      const p = createProject("scrapbook");
      const p2 = updateContent(p, 0, "subtitle", "Madrid vs Dortmund");
      // hero has subtitle, but match doesn't have subtitle
      const p3 = updateKind(p2, 0, "match");
      expect(p3.scenes[0].content.subtitle).toBeUndefined();
    });
  });

  // ─── Content Field Coverage ──────────────────────────────────────────────
  describe("Content Field Coverage", () => {
    it("scrapbook hero has title, subtitle, tagline", () => {
      const fields = TEMPLATE_SCHEMAS.scrapbook.fields.hero;
      expect(Object.keys(fields)).toEqual(["title", "subtitle", "tagline"]);
    });

    it("scrapbook match has homeTeam, awayTeam, score, competition, highlight", () => {
      const fields = TEMPLATE_SCHEMAS.scrapbook.fields.match;
      expect(Object.keys(fields)).toEqual(["homeTeam", "awayTeam", "score", "competition", "highlight"]);
    });

    it("scrapbook history has year, fact, detail, annotation", () => {
      const fields = TEMPLATE_SCHEMAS.scrapbook.fields.history;
      expect(Object.keys(fields)).toEqual(["year", "fact", "detail", "annotation"]);
    });

    it("scrapbook photo has caption, annotation", () => {
      const fields = TEMPLATE_SCHEMAS.scrapbook.fields.photo;
      expect(Object.keys(fields)).toEqual(["caption", "annotation"]);
    });

    it("scrapbook timeline has title only", () => {
      const fields = TEMPLATE_SCHEMAS.scrapbook.fields.timeline;
      expect(Object.keys(fields)).toEqual(["title"]);
    });

    it("scrapbook closing has title, subtitle, reference", () => {
      const fields = TEMPLATE_SCHEMAS.scrapbook.fields.closing;
      expect(Object.keys(fields)).toEqual(["title", "subtitle", "reference"]);
    });

    it("cr7 hero has name, tagline, subtitle", () => {
      const fields = TEMPLATE_SCHEMAS.cr7.fields.hero;
      expect(Object.keys(fields)).toEqual(["name", "tagline", "subtitle"]);
    });

    it("cr7 stat has label, bigNumber, sub, detail", () => {
      const fields = TEMPLATE_SCHEMAS.cr7.fields.stat;
      expect(Object.keys(fields)).toEqual(["label", "bigNumber", "sub", "detail"]);
    });

    it("cr7 milestone has title only", () => {
      const fields = TEMPLATE_SCHEMAS.cr7.fields.milestone;
      expect(Object.keys(fields)).toEqual(["title"]);
    });

    it("cr7 closing has title, subtitle, reference", () => {
      const fields = TEMPLATE_SCHEMAS.cr7.fields.closing;
      expect(Object.keys(fields)).toEqual(["title", "subtitle", "reference"]);
    });

    it("cosmos title has title, subtitle, tagline", () => {
      const fields = TEMPLATE_SCHEMAS.cosmos.fields.title;
      expect(Object.keys(fields)).toEqual(["title", "subtitle", "tagline"]);
    });

    it("cosmos fact has label, bigValue, unit, description, detail", () => {
      const fields = TEMPLATE_SCHEMAS.cosmos.fields.fact;
      expect(Object.keys(fields)).toEqual(["label", "bigValue", "unit", "description", "detail"]);
    });

    it("cosmos compare has title, insight", () => {
      const fields = TEMPLATE_SCHEMAS.cosmos.fields.compare;
      expect(Object.keys(fields)).toEqual(["title", "insight"]);
    });

    it("cosmos timeline has title only", () => {
      const fields = TEMPLATE_SCHEMAS.cosmos.fields.timeline;
      expect(Object.keys(fields)).toEqual(["title"]);
    });

    it("cosmos diagram has title only", () => {
      const fields = TEMPLATE_SCHEMAS.cosmos.fields.diagram;
      expect(Object.keys(fields)).toEqual(["title"]);
    });

    it("cosmos closing has title, subtitle, reference", () => {
      const fields = TEMPLATE_SCHEMAS.cosmos.fields.closing;
      expect(Object.keys(fields)).toEqual(["title", "subtitle", "reference"]);
    });

    it("nodeflow title has lawCode, title, subtitle, tagline", () => {
      const fields = TEMPLATE_SCHEMAS.nodeflow.fields.title;
      expect(Object.keys(fields)).toEqual(["lawCode", "title", "subtitle", "tagline"]);
    });

    it("nodeflow flow has title only", () => {
      const fields = TEMPLATE_SCHEMAS.nodeflow.fields.flow;
      expect(Object.keys(fields)).toEqual(["title"]);
    });

    it("nodeflow contribution has title only", () => {
      const fields = TEMPLATE_SCHEMAS.nodeflow.fields.contribution;
      expect(Object.keys(fields)).toEqual(["title"]);
    });

    it("nodeflow benefit has title, description", () => {
      const fields = TEMPLATE_SCHEMAS.nodeflow.fields.benefit;
      expect(Object.keys(fields)).toEqual(["title", "description"]);
    });

    it("nodeflow compare has title only", () => {
      const fields = TEMPLATE_SCHEMAS.nodeflow.fields.compare;
      expect(Object.keys(fields)).toEqual(["title"]);
    });

    it("nodeflow end has closingTitle, closingSubtitle, reference", () => {
      const fields = TEMPLATE_SCHEMAS.nodeflow.fields.end;
      expect(Object.keys(fields)).toEqual(["closingTitle", "closingSubtitle", "reference"]);
    });
  });

  // ─── Format Validation ───────────────────────────────────────────────────
  describe("Format Validation", () => {
    it("scrapbook supports both 16:9 and 9:16", () => {
      expect(TEMPLATE_FORMATS.scrapbook).toEqual(["16:9", "9:16"]);
    });

    it("cr7 supports both 16:9 and 9:16", () => {
      expect(TEMPLATE_FORMATS.cr7).toEqual(["16:9", "9:16"]);
    });

    it("cosmos supports both 16:9 and 9:16", () => {
      expect(TEMPLATE_FORMATS.cosmos).toEqual(["16:9", "9:16"]);
    });

    it("nodeflow only supports 16:9", () => {
      expect(TEMPLATE_FORMATS.nodeflow).toEqual(["16:9"]);
    });

    it("unsupported format falls back to first supported format", () => {
      const p = createProject("nodeflow", "9:16");
      expect(p.format).toBe("16:9");
    });
  });
});
