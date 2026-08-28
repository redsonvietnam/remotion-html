// ---------------------------------------------------------------------------
// Content Contract - the canonical, machine-checkable schema every production
// data file must satisfy before entering the production pipeline.
//
// Pure logic + types (no React, no Remotion imports). Imported by vitest for
// unit validation and by scripts/validate.mjs (via esbuild) for the CLI path.
//
// NOTE: This file must NOT import Node.js built-ins (e.g. "path") because it
// gets bundled by webpack for Remotion rendering.  The `path`-dependent checks
// live in scripts/validate.mjs (esbuild, Node-only).
// ---------------------------------------------------------------------------

// Base scene metadata shared by every production.
export interface SceneDef {
  id: string;
  audio: string; // path under public/, e.g. "nq57/s1.mp3"
  caption: string; // on-screen narration text
  dur: number; // seconds
}

// Project-wide FPS constant.
export const FPS = 30;

// Tail buffer in seconds added to each scene's duration.
export const TAIL = 0.5;

// Convert scene duration (seconds) to frames.
export const sceneFrames = (dur: number) => Math.ceil((dur + TAIL) * FPS);

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
  nodeflow: {
    allowedKinds: ["title", "flow", "contribution", "benefit", "compare", "end"],
    requiredTextFields: { title: ["title"], flow: ["title"], contribution: ["title"], benefit: ["title"], compare: ["title"] },
  },
  blueprint: {
    allowedKinds: ["title", "pillars", "measure", "detail", "process", "seal"],
    requiredTextFields: { title: ["title"], pillars: ["heading"], measure: ["heading"], detail: ["heading"], process: ["heading"], seal: ["heading"] },
  },
  cr7: {
    allowedKinds: ["hero", "stat", "milestone", "closing"],
    requiredTextFields: { hero: ["name"], stat: ["bigNumber"], milestone: ["title"], closing: ["title"] },
  },
  cosmos: {
    allowedKinds: ["title", "fact", "compare", "timeline", "diagram", "closing"],
    requiredTextFields: { title: ["title"], fact: ["bigValue"], compare: ["title"], timeline: ["title"], diagram: ["title"], closing: ["title"] },
  },
  scrapbook: {
    allowedKinds: ["hero", "match", "history", "photo", "timeline", "closing"],
    requiredTextFields: { hero: ["title"], match: ["homeTeam"], history: ["fact"], photo: ["caption"], timeline: ["title"], closing: ["title"] },
  },
  terminal: {
    allowedKinds: ["intro", "typing", "reveal", "outro"],
    requiredTextFields: { intro: ["title"], typing: ["caption"], reveal: ["caption"], outro: ["title"] },
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

// Small tolerance (seconds) absorbing fractional MP3/codec probing error.
// Deliberately tiny: it must not hide real narration-vs-scene timing bugs.
export const DURATION_TOLERANCE = 0.15;

// Real audio duration validation. Pure: the caller injects `getDuration(audioPath)`
// returning the asset duration in seconds, or null if it cannot be determined
// (missing/unreadable). Enforces: 0 < audioDuration <= sceneDuration.
export function checkAudioDurations(
  scenes: SceneDef[],
  getDuration: (audioPath: string) => number | null,
  tolerance: number = DURATION_TOLERANCE
): ContentError[] {
  const errors: ContentError[] = [];
  for (const s of scenes) {
    if (!s.audio || typeof s.audio !== "string" || !s.audio.trim()) continue;
    const d = getDuration(s.audio);
    if (d === null || d === undefined || !isFinite(d) || d <= 0) {
      errors.push({
        code: "INVALID_AUDIO_METADATA",
        scene: s.id,
        message: `Scene ${s.id} references \`${s.audio}\`, but its duration could not be determined.`,
      });
      continue;
    }
    if (d > s.dur + tolerance) {
      errors.push({
        code: "INVALID_AUDIO_DURATION",
        scene: s.id,
        message: `Scene ${s.id} audio duration ${d.toFixed(2)}s exceeds scene duration ${s.dur.toFixed(2)}s.`,
      });
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// NodeFlow Template Content Contract
//
// Canonical content types for the NodeFlow template (blueprint grid,
// node-edge diagrams, signal flow). These are pure content types —
// no React, no Remotion, no visual implementation details.
// ---------------------------------------------------------------------------

export interface NodeFlowTitleContent {
  kind: "title";
  lawCode: string;
  title: string;
  subtitle: string;
  tagline: string;
  nodes: { label: string; role?: string }[];
}

export interface NodeFlowFlowContent {
  kind: "flow";
  title: string;
  description: string[];
  flowNodes: { label: string; sublabel?: string; rate?: string }[];
  edges: { from: number; to: number; label: string }[];
}

export interface NodeFlowContributionContent {
  kind: "contribution";
  title: string;
  rows: { party: string; type: string; pct: number; rateLabel: string }[];
  totalLabel: string;
  totalValue: string;
  note?: string;
}

export interface NodeFlowBenefitContent {
  kind: "benefit";
  title: string;
  description: string;
  benefits: { icon: string; label: string; value?: string }[];
}

export interface NodeFlowCompareContent {
  kind: "compare";
  title: string;
  before: { items: { label: string; value?: string }[] };
  after: { items: { label: string; value?: string; highlight?: boolean }[] };
  changeLabel?: string;
}

export interface NodeFlowEndContent {
  kind: "end";
  closingTitle: string;
  closingSubtitle: string;
  stats: { label: string; value: string }[];
  reference: string;
}

export type NodeFlowSceneContent =
  | NodeFlowTitleContent
  | NodeFlowFlowContent
  | NodeFlowContributionContent
  | NodeFlowBenefitContent
  | NodeFlowCompareContent
  | NodeFlowEndContent;

// ---------------------------------------------------------------------------
// CR7 Template Content Contract
//
// Canonical content types for the CR7 template (typography-driven,
// large statistics, dark background). Pure content types —
// no React, no Remotion, no visual implementation details.
// ---------------------------------------------------------------------------

export interface CR7HeroContent {
  kind: "hero";
  name: string;
  tagline: string;
  subtitle: string;
}

export interface CR7StatContent {
  kind: "stat";
  label: string;
  bigNumber: string;
  sub: string;
  detail: string;
  color: "accent1" | "accent2" | "accent3";
}

export interface CR7MilestoneContent {
  kind: "milestone";
  title: string;
  items: { label: string; value: string }[];
}

export interface CR7ClosingContent {
  kind: "closing";
  title: string;
  subtitle: string;
  reference: string;
}

export type CR7SceneContent =
  | CR7HeroContent
  | CR7StatContent
  | CR7MilestoneContent
  | CR7ClosingContent;

// ---------------------------------------------------------------------------
// Cosmos Template Content Contract
//
// Canonical content types for the Cosmos template (space/astronomy,
// orbital paths, constellation lines, deep space backgrounds).
// Pure content types — no React, no Remotion, no visual implementation details.
// ---------------------------------------------------------------------------

export interface CosmosTitleContent {
  kind: "title";
  title: string;
  subtitle: string;
  tagline: string;
}

export interface CosmosFactContent {
  kind: "fact";
  label: string;
  bigValue: string;
  unit: string;
  description: string;
  detail: string;
}

export interface CosmosCompareContent {
  kind: "compare";
  title: string;
  left: { label: string; value: string; color?: string };
  right: { label: string; value: string; color?: string };
  insight: string;
}

export interface CosmosTimelineContent {
  kind: "timeline";
  title: string;
  items: { label: string; value: string; year?: string }[];
}

export interface CosmosDiagramContent {
  kind: "diagram";
  title: string;
  nodes: { label: string; sublabel?: string; orbit?: number }[];
  edges: { from: number; to: number; label: string }[];
}

export interface CosmosClosingContent {
  kind: "closing";
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  reference: string;
}

export type CosmosSceneContent =
  | CosmosTitleContent
  | CosmosFactContent
  | CosmosCompareContent
  | CosmosTimelineContent
  | CosmosDiagramContent
  | CosmosClosingContent;

// ---------------------------------------------------------------------------
// Scrapbook Template Content Contract
//
// Canonical content types for the Scrapbook template (editorial collage,
// aged paper, handwritten annotations, Polaroid cards, VOX overlays).
// Pure content types — no React, no Remotion, no visual implementation details.
// ---------------------------------------------------------------------------

export interface ScrapbookHeroContent {
  kind: "hero";
  title: string;
  subtitle: string;
  tagline: string;
}

export interface ScrapbookMatchContent {
  kind: "match";
  homeTeam: string;
  awayTeam: string;
  score: string;
  competition: string;
  highlight: string;
}

export interface ScrapbookHistoryContent {
  kind: "history";
  year: string;
  fact: string;
  detail: string;
  annotation: string;
}

export interface ScrapbookPhotoContent {
  kind: "photo";
  caption: string;
  annotation: string;
  Polaroid: { label: string; sublabel?: string }[];
}

export interface ScrapbookTimelineContent {
  kind: "timeline";
  title: string;
  items: { label: string; value: string; year?: string }[];
}

export interface ScrapbookClosingContent {
  kind: "closing";
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  reference: string;
}

export type ScrapbookSceneContent =
  | ScrapbookHeroContent
  | ScrapbookMatchContent
  | ScrapbookHistoryContent
  | ScrapbookPhotoContent
  | ScrapbookTimelineContent
  | ScrapbookClosingContent;

// ---------------------------------------------------------------------------
// Terminal Template Content Contract
//
// Canonical content types for the Terminal template (Matrix rain,
// dark terminal, syntax-highlighted code, typing animation).
// Pure content types — no React, no Remotion, no visual implementation details.
// ---------------------------------------------------------------------------

export interface TerminalCodeToken {
  start: number;
  length: number;
  kind: "keyword" | "string" | "function" | "number" | "comment" | "variable" | "type";
}

export interface TerminalCodeLine {
  text: string;
  tokens?: TerminalCodeToken[];
}

export interface TerminalIntroContent {
  kind: "intro";
  kicker: string;
  title: string;
}

export interface TerminalTypingContent {
  kind: "typing";
  language: string;
  lines: TerminalCodeLine[];
  caption: string;
}

export interface TerminalRevealContent {
  kind: "reveal";
  language: string;
  lines: TerminalCodeLine[];
  highlightLine: number;
  caption: string;
}

export interface TerminalOutroContent {
  kind: "outro";
  kicker: string;
  title: string;
  subtitle: string;
}

export type TerminalSceneContent =
  | TerminalIntroContent
  | TerminalTypingContent
  | TerminalRevealContent
  | TerminalOutroContent;

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
