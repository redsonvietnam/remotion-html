// ---------------------------------------------------------------------------
// Composer Export — Validation + Project → Remotion Bridge
//
// Validates Composer projects for export and converts them to
// Remotion-compatible inputProps. No production mutation, no backend.
// ---------------------------------------------------------------------------

import type { ComposerProject, ComposerScene, ComposerFormat } from "./types";
import { TEMPLATE_CAPABILITIES } from "./templates";
import { sceneFrames, FPS } from "../data/contract";
import type { SceneDef } from "../data/contract";

export interface ExportError {
  code: string;
  scene?: string;
  message: string;
}

export interface ExportValidationResult {
  valid: boolean;
  errors: ExportError[];
}

export interface ExportPayload {
  template: string;
  scenes: SceneDef[];
  content: Record<string, Record<string, unknown>>;
  format: ComposerFormat;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  projectName: string;
}

const FORMAT_DIMENSIONS: Record<ComposerFormat, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
};

/** Extract caption from scene content based on template's primary text field. */
function extractCaption(template: string, content: Record<string, unknown>): string {
  const cap = TEMPLATE_CAPABILITIES[template];
  if (!cap) return "";
  const sk = cap.sceneKinds.find((k) => k.kind === content.kind);
  if (!sk || sk.fields.length === 0) return "";
  const primary = sk.fields.find((f) => f.required) ?? sk.fields[0];
  return String(content[primary.key] ?? "");
}

/** Validate a Composer project for export. */
export function validateExportProject(project: ComposerProject | null): ExportValidationResult {
  const errors: ExportError[] = [];

  if (!project) {
    errors.push({ code: "MISSING_PROJECT", message: "Project not found" });
    return { valid: false, errors };
  }

  if (!project.id) {
    errors.push({ code: "MISSING_ID", message: "Project ID is required" });
  }

  if (!project.name || project.name.trim() === "") {
    errors.push({ code: "MISSING_NAME", message: "Project name is required" });
  }

  if (!project.template) {
    errors.push({ code: "MISSING_TEMPLATE", message: "Template is required" });
  } else if (!TEMPLATE_CAPABILITIES[project.template]) {
    errors.push({ code: "INVALID_TEMPLATE", message: `Unknown template: ${project.template}` });
  }

  if (!project.format) {
    errors.push({ code: "MISSING_FORMAT", message: "Format is required" });
  } else if (!FORMAT_DIMENSIONS[project.format]) {
    errors.push({ code: "INVALID_FORMAT", message: `Unsupported format: ${project.format}` });
  }

  if (project.template && project.format && TEMPLATE_CAPABILITIES[project.template]) {
    const cap = TEMPLATE_CAPABILITIES[project.template];
    if (!cap.formats.includes(project.format)) {
      errors.push({
        code: "FORMAT_NOT_SUPPORTED",
        message: `${project.template} does not support ${project.format} format`,
      });
    }
  }

  if (!project.scenes || project.scenes.length === 0) {
    errors.push({ code: "EMPTY_SCENES", message: "Project must have at least one scene" });
  } else {
    const cap = project.template ? TEMPLATE_CAPABILITIES[project.template] : null;
    const validKinds = cap ? cap.sceneKinds.map((k) => k.kind) : [];

    for (const scene of project.scenes) {
      if (!scene.id) {
        errors.push({ code: "MISSING_SCENE_ID", message: "Scene ID is required" });
      }

      if (!scene.kind) {
        errors.push({ code: "MISSING_SCENE_KIND", scene: scene.id, message: "Scene kind is required" });
      } else if (validKinds.length > 0 && !validKinds.includes(scene.kind)) {
        errors.push({
          code: "INVALID_SCENE_KIND",
          scene: scene.id,
          message: `Invalid kind "${scene.kind}" for template ${project.template}`,
        });
      }

      if (typeof scene.duration !== "number" || scene.duration <= 0) {
        errors.push({
          code: "INVALID_DURATION",
          scene: scene.id,
          message: `Duration must be positive, got ${scene.duration}`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/** Convert a Composer project to Remotion-compatible export payload. */
export function projectToExportPayload(project: ComposerProject): ExportValidationResult & { payload?: ExportPayload } {
  const validation = validateExportProject(project);
  if (!validation.valid) return validation;

  const { width, height } = FORMAT_DIMENSIONS[project.format];
  const cap = TEMPLATE_CAPABILITIES[project.template];

  const scenes: SceneDef[] = project.scenes.map((s) => ({
    id: s.id,
    audio: s.audio?.path ?? "",
    caption: extractCaption(project.template, s.content),
    dur: s.duration,
  }));

  const content: Record<string, Record<string, unknown>> = {};
  for (const s of project.scenes) {
    content[s.id] = { ...s.content };
  }

  const totalFrames = scenes.reduce((acc, s) => acc + sceneFrames(s.dur), 0)
    + Math.max(0, scenes.length - 1) * 16;

  return {
    ...validation,
    payload: {
      template: project.template,
      scenes,
      content,
      format: project.format,
      width,
      height,
      fps: FPS,
      totalFrames,
      projectName: project.name,
    },
  };
}

/** Generate a safe output filename from project name. */
export function getOutputFilename(project: ComposerProject): string {
  const safe = project.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safe || "export"}-${project.id.slice(0, 8)}.mp4`;
}

/** Get the composition ID for a template + format combination. */
export function getCompositionId(template: string, format: ComposerFormat): string {
  const suffix = format === "9:16" ? "9x16" : "";
  const base = {
    scrapbook: "ChampionsLeague",
    cr7: "CR7Records",
    cosmos: "SolarSystem",
    nodeflow: "BaoHiem2024",
    kineticStatement: "KineticStatement",
    bentoGrid: "BentoGrid",
  }[template];
  return base ? base + suffix : `Composer_${template}${suffix}`;
}
