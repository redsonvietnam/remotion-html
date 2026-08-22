// ---------------------------------------------------------------------------
// Content Contract - the canonical, machine-checkable schema every production
// data file must satisfy before entering the production pipeline.
//
// Pure logic + types (no React, no Remotion imports). Imported by vitest for
// unit validation and by scripts/validate.mjs (via esbuild) for the CLI path.
//
// The four existing data files (nq57, deAn06, nghiQuyet79, stoicLove) already
// follow this shape: each exports a SceneDef[] (named <NAME>_SCENES) and a
// content Record (named <NAME>_CONTENT) keyed by scene id.
// ---------------------------------------------------------------------------

import path from "node:path";

// Base scene metadata shared by every production.
export interface SceneDef {
  id: string;
  audio: string; // path under public/, e.g. "nq57/s1.mp3"
  caption: string; // on-screen narration text
  dur: number; // seconds
}

export interface ContentError {
  code: string;
  scene?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ContentError[];
  sceneCount: number;
}

// Per-template content schema: which scene kinds are allowed, and which kinds
// must carry a non-empty primary text field.
export interface TemplateContentSchema {
  allowedKinds: string[];
  requiredTextFields: Record<string, string[]>;
}

export const TEMPLATE_SCHEMAS: Record<string, TemplateContentSchema> = {
  nq57: {
    allowedKinds: ["title", "quote", "roles", "pillars", "stats", "vision", "end"],
    requiredTextFields: { title: ["title"], quote: ["text"] },
  },
  dean06: {
    allowedKinds: ["title", "quote", "roles", "pillars", "stats", "vision", "end"],
    requiredTextFields: { title: ["title"], quote: ["text"] },
  },
  nq79: {
    allowedKinds: ["title", "quote", "roles", "pillars", "stats", "vision", "end"],
    requiredTextFields: { title: ["title"], quote: ["text"] },
  },
  stoiclove: {
    allowedKinds: ["hook", "statement", "split", "concept", "impermanence", "ending"],
    requiredTextFields: { hook: ["mainQuestion"], statement: ["lines"] },
  },
};

function isSceneArray(v: unknown): v is SceneDef[] {
  return (
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((x) => x && typeof x === "object" && "id" in x && "audio" in x && "caption" in x && "dur" in x)
  );
}

function isContentMap(v: unknown): v is Record<string, { kind?: string }> {
  return (
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.values(v).some((x) => x && typeof x === "object" && "kind" in x)
  );
}

// Discover the scene array + content map from a module namespace by shape
// (preferring <NAME>_SCENES / <NAME>_CONTENT export names).
export function discoverScenes(mod: Record<string, unknown>): SceneDef[] | null {
  const byName = Object.entries(mod).find(([k, v]) => k.endsWith("_SCENES") && isSceneArray(v));
  if (byName) return byName[1] as SceneDef[];
  const byShape = Object.values(mod).find((v) => isSceneArray(v));
  return byShape ? (byShape as SceneDef[]) : null;
}

export function discoverContent(mod: Record<string, unknown>): Record<string, { kind?: string }> | null {
  const byName = Object.entries(mod).find(([k, v]) => k.endsWith("_CONTENT") && isContentMap(v));
  if (byName) return byName[1] as Record<string, { kind?: string }>;
  const byShape = Object.values(mod).find((v) => isContentMap(v));
  return byShape ? (byShape as Record<string, { kind?: string }>) : null;
}

export function validateProductionData(
  mod: Record<string, unknown>,
  template: string
): ValidationResult {
  const errors: ContentError[] = [];
  const schema = TEMPLATE_SCHEMAS[template];

  if (!schema) {
    errors.push({ code: "UNKNOWN_TEMPLATE", message: `No content schema for template "${template}".` });
    return { valid: false, errors, sceneCount: 0 };
  }

  const scenes = discoverScenes(mod);
  const content = discoverContent(mod);

  if (!scenes) {
    errors.push({ code: "MISSING_SCENE_ARRAY", message: "No SceneDef[] export found (expected <NAME>_SCENES)." });
    return { valid: false, errors, sceneCount: 0 };
  }
  if (!content) {
    errors.push({ code: "MISSING_CONTENT_MAP", message: "No content Record export found (expected <NAME>_CONTENT)." });
    return { valid: false, errors, sceneCount: 0 };
  }
  if (scenes.length === 0) {
    errors.push({ code: "EMPTY_SCENES", message: "Scene list is empty." });
  }

  const sceneIds = new Set(scenes.map((s) => s.id));

  for (const s of scenes) {
    if (!s.id) {
      errors.push({ code: "SCENE_NO_ID", scene: String(s.id), message: "Scene missing id." });
      continue;
    }
    if (!s.audio || typeof s.audio !== "string" || !s.audio.trim()) {
      errors.push({ code: "INVALID_AUDIO_PATH", scene: s.id, message: `Scene ${s.id} missing audio path.` });
    } else if (
      path.isAbsolute(s.audio) ||
      /^[A-Za-z]:[\\/]/.test(s.audio) ||
      s.audio.startsWith("/") ||
      s.audio.startsWith("\\")
    ) {
      errors.push({
        code: "INVALID_AUDIO_PATH",
        scene: s.id,
        message: `Scene ${s.id} audio path must be relative, not absolute: "${s.audio}".`,
      });
    } else if (s.audio.split("/").includes("..") || s.audio.split("\\").includes("..")) {
      errors.push({
        code: "INVALID_AUDIO_PATH",
        scene: s.id,
        message: `Scene ${s.id} audio path must not contain ".." traversal: "${s.audio}".`,
      });
    }
    if (!s.caption || typeof s.caption !== "string" || !s.caption.trim()) {
      errors.push({ code: "MISSING_NARRATION", scene: s.id, message: `Scene ${s.id} missing caption/narration text.` });
    }
    if (typeof s.dur !== "number" || !isFinite(s.dur) || s.dur <= 0) {
      errors.push({ code: "INVALID_DURATION", scene: s.id, message: `Scene ${s.id} has invalid duration (${s.dur}).` });
    }
    const c = content[s.id];
    if (!c) {
      errors.push({ code: "MISSING_SCENE_CONTENT", scene: s.id, message: `Scene ${s.id} has no matching content entry.` });
      continue;
    }
    if (!c.kind) {
      errors.push({ code: "MISSING_KIND", scene: s.id, message: `Scene ${s.id} content missing 'kind'.` });
    } else if (!schema.allowedKinds.includes(c.kind)) {
      errors.push({
        code: "INVALID_SCENE_KIND",
        scene: s.id,
        message: `Scene ${s.id} kind "${c.kind}" is not allowed for template "${template}".`,
      });
    } else {
      const req = schema.requiredTextFields[c.kind] || [];
      for (const f of req) {
        const v = (c as Record<string, unknown>)[f];
        const ok = (typeof v === "string" && v.trim() !== "") || (Array.isArray(v) && v.length > 0);
        if (!ok) {
          errors.push({
            code: "MISSING_TEXT",
            scene: s.id,
            message: `Scene ${s.id} (${c.kind}) missing required text field "${f}".`,
          });
        }
      }
    }
  }

  for (const key of Object.keys(content)) {
    if (!sceneIds.has(key)) {
      errors.push({ code: "ORPHAN_CONTENT", scene: key, message: `Content entry "${key}" has no matching scene.` });
    }
  }

  return { valid: errors.length === 0, errors, sceneCount: scenes.length };
}

// Real asset existence check. Kept free of direct filesystem access: the caller
// injects an `exists(audioPath)` predicate (e.g. backed by fs in the CLI).
// Only reports scenes whose structural audio path already passed (non-empty),
// so missing/absolute/traversal paths are not double-reported here.
export function checkAudioAssets(
  scenes: SceneDef[],
  exists: (audioPath: string) => boolean
): ContentError[] {
  const errors: ContentError[] = [];
  for (const s of scenes) {
    if (!s.audio || typeof s.audio !== "string" || !s.audio.trim()) continue;
    if (!exists(s.audio)) {
      errors.push({
        code: "INVALID_AUDIO_ASSET",
        scene: s.id,
        message: `Scene ${s.id} references \`${s.audio}\`, but the file does not exist.`,
      });
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Storyboard Contract - the higher-level artifact C1 produces from research +
// fact-checking, BEFORE generating src/data/<project>.ts.
// ---------------------------------------------------------------------------

export type Platform = "youtube" | "tiktok" | "facebook" | "generic";
export type AspectRatio = "16:9" | "9:16";

export interface StoryboardClaim {
  claim: string;
  source: string;
  verified: boolean;
}

export interface StoryboardScene {
  id: string;
  kind: string;
  purpose: string;
  narration: string;
  onScreenText: string;
  visualConcept: string;
  factualClaims: StoryboardClaim[];
}

export interface Storyboard {
  project: string;
  topic: string;
  platform: Platform;
  aspectRatio: AspectRatio;
  template: string;
  scenes: StoryboardScene[];
}

export function validateStoryboard(sb: unknown): ValidationResult {
  const errors: ContentError[] = [];
  const s = sb as Storyboard;
  if (!s || typeof s !== "object") {
    return { valid: false, errors: [{ code: "INVALID_STORYBOARD", message: "Storyboard is not an object." }], sceneCount: 0 };
  }
  if (!s.project || !String(s.project).trim()) errors.push({ code: "MISSING_PROJECT", message: "Storyboard missing project." });
  if (!s.topic || !String(s.topic).trim()) errors.push({ code: "MISSING_TOPIC", message: "Storyboard missing topic." });
  const platforms: Platform[] = ["youtube", "tiktok", "facebook", "generic"];
  if (!platforms.includes(s.platform)) errors.push({ code: "INVALID_PLATFORM", message: `Platform "${s.platform}" not allowed.` });
  const aspects: AspectRatio[] = [];
  if (!["16:9", "9:16"].includes(s.aspectRatio as string)) errors.push({ code: "INVALID_ASPECT", message: `Aspect ratio "${s.aspectRatio}" not allowed.` });
  if (!s.template || !String(s.template).trim()) {
    errors.push({ code: "MISSING_TEMPLATE", message: "Storyboard missing template." });
  } else if (!TEMPLATE_SCHEMAS[s.template]) {
    errors.push({ code: "INVALID_TEMPLATE", message: `Unknown template "${s.template}".` });
  }
  if (!Array.isArray(s.scenes) || s.scenes.length === 0) {
    errors.push({ code: "EMPTY_SCENES", message: "Storyboard has no scenes." });
  } else {
    for (const sc of s.scenes) {
      if (!sc.id) errors.push({ code: "SCENE_NO_ID", scene: String(sc.id), message: "Scene missing id." });
      const schema = TEMPLATE_SCHEMAS[s.template];
      if (schema && !schema.allowedKinds.includes(sc.kind)) {
        errors.push({
          code: "INVALID_SCENE_KIND",
          scene: sc.id,
          message: `Scene ${sc.id} kind "${sc.kind}" is not allowed for template "${s.template}".`,
        });
      }
      for (const f of ["purpose", "narration", "onScreenText", "visualConcept"] as const) {
        if (!sc[f] || !String(sc[f]).trim()) {
          errors.push({ code: "MISSING_STORYBOARD_FIELD", scene: sc.id, message: `Scene ${sc.id} missing "${f}".` });
        }
      }
      if (!Array.isArray(sc.factualClaims) || sc.factualClaims.length === 0) {
        errors.push({ code: "MISSING_CLAIMS", scene: sc.id, message: `Scene ${sc.id} has no factual claims.` });
      } else {
        for (const cl of sc.factualClaims) {
          if (!cl.claim || !String(cl.claim).trim()) errors.push({ code: "MISSING_CLAIM", scene: sc.id, message: `Scene ${sc.id} has an empty claim.` });
          if (!cl.source || !String(cl.source).trim()) errors.push({ code: "MISSING_SOURCE", scene: sc.id, message: `Scene ${sc.id} claim missing source.` });
          if (cl.verified !== true) errors.push({ code: "UNVERIFIED_CLAIM", scene: sc.id, message: `Scene ${sc.id} claim not verified: "${cl.claim}".` });
        }
      }
    }
  }
  return { valid: errors.length === 0, errors, sceneCount: Array.isArray(s.scenes) ? s.scenes.length : 0 };
}
