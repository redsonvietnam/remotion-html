// ---------------------------------------------------------------------------
// Composer Validation — input validation for projects and scenes
//
// No production data mutation. Validates user input only.
// ---------------------------------------------------------------------------

import type { ComposerProject, ComposerScene } from "./types";
import { getValidKinds, getTemplateCapability } from "./templates";

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  scene?: string;
}

/** Validate a project. */
export function validateProject(project: ComposerProject): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!project.id) {
    errors.push({ code: "MISSING_ID", message: "Project missing ID." });
  }
  if (!project.name || !project.name.trim()) {
    errors.push({ code: "MISSING_NAME", message: "Project missing name." });
  }
  if (!project.template) {
    errors.push({ code: "MISSING_TEMPLATE", message: "Project missing template." });
  } else if (!getTemplateCapability(project.template)) {
    errors.push({
      code: "INVALID_TEMPLATE",
      message: `Unknown template "${project.template}".`,
    });
  }
  if (!["16:9", "9:16"].includes(project.format)) {
    errors.push({
      code: "INVALID_FORMAT",
      message: `Invalid format "${project.format}".`,
    });
  }
  if (project.template && project.format) {
    const cap = getTemplateCapability(project.template);
    if (cap && !cap.formats.includes(project.format as "16:9" | "9:16")) {
      errors.push({
        code: "FORMAT_NOT_SUPPORTED",
        message: `Template "${project.template}" does not support format "${project.format}".`,
      });
    }
  }
  if (!Array.isArray(project.scenes) || project.scenes.length === 0) {
    errors.push({ code: "EMPTY_SCENES", message: "Project has no scenes." });
  } else {
    for (const scene of project.scenes) {
      const sceneErrors = validateScene(project.template, scene);
      errors.push(...sceneErrors);
    }
  }

  return errors;
}

/** Validate a single scene. */
export function validateScene(
  template: string,
  scene: ComposerScene
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!scene.id) {
    errors.push({ code: "SCENE_NO_ID", message: "Scene missing ID." });
  }
  if (!scene.kind) {
    errors.push({
      code: "SCENE_NO_KIND",
      scene: scene.id,
      message: `Scene ${scene.id} missing kind.`,
    });
  } else {
    const validKinds = getValidKinds(template);
    if (validKinds.length > 0 && !validKinds.includes(scene.kind)) {
      errors.push({
        code: "INVALID_KIND",
        scene: scene.id,
        message: `Scene ${scene.id} kind "${scene.kind}" is not valid for template "${template}".`,
      });
    }
  }
  if (typeof scene.duration !== "number" || scene.duration <= 0 || !isFinite(scene.duration)) {
    errors.push({
      code: "INVALID_DURATION",
      scene: scene.id,
      message: `Scene ${scene.id} has invalid duration.`,
    });
  }

  return errors;
}
