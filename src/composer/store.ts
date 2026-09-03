// ---------------------------------------------------------------------------
// Composer Store — localStorage CRUD + autosave
//
// All persistence is in localStorage under "composer_projects" key.
// No backend, no database, no production data mutation.
// ---------------------------------------------------------------------------

import type { ComposerProject } from "./types";

const STORAGE_KEY = "composer_projects";
const CURRENT_PROJECT_KEY = "composer_current_project";

/** Generate a stable unique ID. */
export function generateId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Generate a stable scene ID. */
export function generateSceneId(): string {
  return `sc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Load all projects from localStorage. */
export function loadProjects(): ComposerProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ComposerProject[];
  } catch {
    return [];
  }
}

/** Save all projects to localStorage. */
export function saveProjects(projects: ComposerProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Storage full or unavailable — silent fail
  }
}

/** Load a single project by ID. */
export function loadProject(id: string): ComposerProject | null {
  const projects = loadProjects();
  return projects.find((p) => p.id === id) ?? null;
}

/** Save or update a single project. */
export function saveProject(project: ComposerProject): void {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: Date.now() };
  if (idx >= 0) {
    projects[idx] = updated;
  } else {
    projects.push(updated);
  }
  saveProjects(projects);
}

/** Delete a project by ID. */
export function deleteProject(id: string): void {
  const projects = loadProjects();
  saveProjects(projects.filter((p) => p.id !== id));
  if (loadCurrentProjectId() === id) {
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  }
}

/** Get the current project ID. */
export function loadCurrentProjectId(): string | null {
  try {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  } catch {
    return null;
  }
}

/** Set the current project ID. */
export function saveCurrentProjectId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(CURRENT_PROJECT_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  } catch {
    // silent
  }
}

/** Create a new project with defaults. */
export function createProject(
  name: string,
  template: string,
  format: "16:9" | "9:16" = "16:9"
): ComposerProject {
  const now = Date.now();
  return {
    id: generateId(),
    name,
    template,
    format,
    scenes: [],
    createdAt: now,
    updatedAt: now,
  };
}
