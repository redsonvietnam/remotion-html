// ---------------------------------------------------------------------------
// Composer Scene Operations — immutable updates
//
// All operations return new arrays/objects (no mutation).
// ---------------------------------------------------------------------------

import type { ComposerScene, ComposerProject, ComposerAudio } from "./types";
import { generateSceneId } from "./store";
import { getValidKinds, getDefaultContent } from "./templates";

/** Add a scene at the given index (or end). */
export function addScene(
  project: ComposerProject,
  scene: ComposerScene,
  index?: number
): ComposerProject {
  const scenes = [...project.scenes];
  const idx = index !== undefined ? Math.min(index, scenes.length) : scenes.length;
  scenes.splice(idx, 0, scene);
  return { ...project, scenes, updatedAt: Date.now() };
}

/** Duplicate a scene by ID. */
export function duplicateScene(
  project: ComposerProject,
  sceneId: string
): ComposerProject {
  const idx = project.scenes.findIndex((s) => s.id === sceneId);
  if (idx < 0) return project;
  const original = project.scenes[idx];
  const duplicate: ComposerScene = {
    ...original,
    id: generateSceneId(),
    content: { ...original.content },
    audio: original.audio ? { ...original.audio } : undefined,
  };
  const scenes = [...project.scenes];
  scenes.splice(idx + 1, 0, duplicate);
  return { ...project, scenes, updatedAt: Date.now() };
}

/** Delete a scene by ID. Cannot delete the last scene. */
export function deleteScene(
  project: ComposerProject,
  sceneId: string
): ComposerProject {
  if (project.scenes.length <= 1) return project;
  const scenes = project.scenes.filter((s) => s.id !== sceneId);
  return { ...project, scenes, updatedAt: Date.now() };
}

/** Move a scene up (lower index). */
export function moveSceneUp(
  project: ComposerProject,
  sceneId: string
): ComposerProject {
  const idx = project.scenes.findIndex((s) => s.id === sceneId);
  if (idx <= 0) return project;
  const scenes = [...project.scenes];
  [scenes[idx - 1], scenes[idx]] = [scenes[idx], scenes[idx - 1]];
  return { ...project, scenes, updatedAt: Date.now() };
}

/** Move a scene down (higher index). */
export function moveSceneDown(
  project: ComposerProject,
  sceneId: string
): ComposerProject {
  const idx = project.scenes.findIndex((s) => s.id === sceneId);
  if (idx < 0 || idx >= project.scenes.length - 1) return project;
  const scenes = [...project.scenes];
  [scenes[idx], scenes[idx + 1]] = [scenes[idx + 1], scenes[idx]];
  return { ...project, scenes, updatedAt: Date.now() };
}

/** Update scene content. */
export function updateSceneContent(
  project: ComposerProject,
  sceneId: string,
  content: Record<string, unknown>
): ComposerProject {
  const scenes = project.scenes.map((s) =>
    s.id === sceneId ? { ...s, content: { ...content }, updatedAt: Date.now() } : s
  );
  return { ...project, scenes, updatedAt: Date.now() };
}

/** Update scene duration. */
export function updateSceneDuration(
  project: ComposerProject,
  sceneId: string,
  duration: number
): ComposerProject {
  if (duration <= 0 || !isFinite(duration)) return project;
  const scenes = project.scenes.map((s) =>
    s.id === sceneId ? { ...s, duration } : s
  );
  return { ...project, scenes, updatedAt: Date.now() };
}

/** Change scene kind (resets content to defaults). */
export function changeSceneKind(
  project: ComposerProject,
  sceneId: string,
  kind: string
): ComposerProject {
  const validKinds = getValidKinds(project.template);
  if (!validKinds.includes(kind)) return project;
  const scenes = project.scenes.map((s) => {
    if (s.id !== sceneId) return s;
    return { ...s, kind, content: getDefaultContent(project.template, kind) };
  });
  return { ...project, scenes, updatedAt: Date.now() };
}

/** Update scene audio. */
export function updateSceneAudio(
  project: ComposerProject,
  sceneId: string,
  audio?: ComposerAudio
): ComposerProject {
  const scenes = project.scenes.map((s) =>
    s.id === sceneId ? { ...s, audio } : s
  );
  return { ...project, scenes, updatedAt: Date.now() };
}
