// ---------------------------------------------------------------------------
// export.mjs — Composer Project → MP4 export orchestrator
//
// Reads a Composer project JSON, validates it, generates a self-contained
// Remotion entry file with the data embedded, renders to MP4, and cleans up.
//
// Usage:
//   node scripts/export.mjs <project.json> [--output out/custom.mp4] [--skip-validation]
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENTRY_PATH = path.join(ROOT, "src", "export-entry.tsx");

const TEMPLATE_MODULES = {
  scrapbook: "./templates/scrapbook",
  cr7: "./templates/cr7",
  cosmos: "./templates/cosmos",
  nodeflow: "./templates/nodeflow",
  terminal: "./templates/terminal",
  kineticStatement: "./templates/kinetic-statement",
};

const THEME_DEFAULTS = {
  cr7: {
    name: "cr7",
    colors: { bg: "#0c0a09", bg2: "#1c1917", card: "#292524", line: "rgba(255,255,255,0.06)", accent1: "#f59e0b", accent1Soft: "#d97706", accent2: "#ef4444", accent2Soft: "#dc2626", accent3: "#10b981", ink: "#fafaf9", muted: "#a8a29e" },
    fonts: { display: '"Inter","Segoe UI",system-ui,sans-serif', body: '"Inter","Segoe UI",system-ui,sans-serif', mono: '"JetBrains Mono","Fira Code",monospace' },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
    typography: { caption: 14, body: 18, subtitle: 24, title: 48, titleLg: 72, hero: 120 },
  },
  cosmos: {
    name: "cosmos",
    colors: { bg: "#050510", bg2: "#0a0a2e", card: "#111133", line: "rgba(255,255,255,0.06)", accent1: "#3b82f6", accent1Soft: "#2563eb", accent2: "#a855f7", accent2Soft: "#9333ea", accent3: "#f8fafc", ink: "#f8fafc", muted: "#94a3b8" },
    fonts: { display: '"Inter","Segoe UI",system-ui,sans-serif', body: '"Inter","Segoe UI",system-ui,sans-serif', mono: '"JetBrains Mono","Fira Code",monospace' },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
    typography: { caption: 14, body: 18, subtitle: 24, title: 48, titleLg: 72, hero: 100 },
  },
  nodeflow: {
    name: "baoHiem2024",
    colors: { bg: "#05080f", bg2: "#080d1a", card: "rgba(0,220,255,0.05)", line: "rgba(0,200,255,0.18)", accent1: "#00d4ff", accent1Soft: "#7feeff", accent2: "#f59e0b", accent2Soft: "#fcd34d", accent3: "#10b981", ink: "#f0f8ff", muted: "#4a7a9b" },
    fonts: { display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif", mono: "'JetBrains Mono', 'Fira Code', monospace" },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
    typography: { caption: 14, body: 18, subtitle: 24, title: 48, titleLg: 72, hero: 100 },
  },
  terminal: {
    name: "terminal",
    colors: { bg: "#000000", bg2: "#0a0a0a", card: "rgba(13,17,23,0.85)", line: "rgba(0,255,102,0.12)", accent1: "#00ff66", accent1Soft: "rgba(0,255,102,0.25)", accent2: "#00cc52", accent2Soft: "rgba(0,204,82,0.20)", accent3: "#003d1a", ink: "#e6e6e6", muted: "#6a7a8a" },
    fonts: { display: "'Barlow Condensed','Segoe UI',system-ui,sans-serif", body: "'Barlow Condensed','Segoe UI',system-ui,sans-serif", mono: "'JetBrains Mono','Fira Code',monospace" },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
    typography: { caption: 18, body: 22, subtitle: 28, title: 40, titleLg: 56, hero: 72 },
  },
  kineticStatement: {
    name: "kineticStatement",
    colors: { bg: "#0b0d14", bg2: "#1a0b2e", card: "rgba(255,255,255,0.05)", line: "rgba(255,255,255,0.08)", accent1: "#ffd166", accent1Soft: "rgba(255,209,102,0.25)", accent2: "#3a0ca3", accent2Soft: "rgba(58,12,163,0.25)", accent3: "#1c1c1e", ink: "#ffffff", muted: "#9a9aad" },
    fonts: { display: "'Inter','Segoe UI',system-ui,sans-serif", body: "'Inter','Segoe UI',system-ui,sans-serif", mono: "'JetBrains Mono','Fira Code',monospace" },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
    typography: { caption: 15, body: 18, subtitle: 24, title: 40, titleLg: 56, hero: 92 },
  },
};

const FORMAT_DIMENSIONS = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
};

function validateProject(project) {
  const errors = [];
  if (!project) { errors.push({ code: "MISSING_PROJECT", message: "Project not found" }); return { valid: false, errors }; }
  if (!project.id) errors.push({ code: "MISSING_ID", message: "Project ID required" });
  if (!project.name?.trim()) errors.push({ code: "MISSING_NAME", message: "Project name required" });
  if (!project.template) errors.push({ code: "MISSING_TEMPLATE", message: "Template required" });
  if (!project.format) { errors.push({ code: "MISSING_FORMAT", message: "Format required" }); }
  else if (!FORMAT_DIMENSIONS[project.format]) { errors.push({ code: "INVALID_FORMAT", message: `Unsupported format: ${project.format}` }); }
  if (project.template && !TEMPLATE_MODULES[project.template]) {
    errors.push({ code: "INVALID_TEMPLATE", message: `Unknown template: ${project.template}` });
  }
  if (!project.scenes || project.scenes.length === 0) {
    errors.push({ code: "EMPTY_SCENES", message: "At least one scene required" });
  } else {
    for (const scene of project.scenes) {
      if (!scene.id) errors.push({ code: "MISSING_SCENE_ID", message: "Scene ID required" });
      if (!scene.kind) errors.push({ code: "MISSING_KIND", scene: scene.id, message: "Scene kind required" });
      if (typeof scene.duration !== "number" || scene.duration <= 0) {
        errors.push({ code: "INVALID_DURATION", scene: scene.id, message: `Invalid duration: ${scene.duration}` });
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

function extractCaption(template, content) {
  const FIELD_MAP = {
    scrapbook: { hero: "title", match: "homeTeam", history: "fact", photo: "caption", timeline: "title", closing: "title" },
    cr7: { hero: "name", stat: "bigNumber", milestone: "title", closing: "title" },
    cosmos: { title: "title", fact: "bigValue", compare: "title", diagram: "title", timeline: "title", closing: "title" },
    nodeflow: { title: "title", flow: "title", contribution: "title", benefit: "title", compare: "title", end: "title" },
    terminal: { intro: "title", typing: "caption", reveal: "caption", outro: "title" },
    kineticStatement: { hook: "words", stat: "label", quote: "text", outro: "brand" },
  };
  const kind = content?.kind;
  const field = FIELD_MAP[template]?.[kind] ?? "title";
  return String(content?.[field] ?? "");
}

function buildPayload(project) {
  const { width, height } = FORMAT_DIMENSIONS[project.format];
  const FPS = 30;
  const TAIL = 0.5;
  const sceneFrames = (dur) => Math.ceil((dur + TAIL) * FPS);
  const scenes = project.scenes.map((s) => ({
    id: s.id, audio: s.audio?.path ?? "",
    caption: extractCaption(project.template, s.content), dur: s.duration,
  }));
  const content = {};
  for (const s of project.scenes) {
    const c = s.content || {};
    const sanitized = { kind: s.kind, ...c };
    if (project.template === "scrapbook") {
      if (s.kind === "photo" && !sanitized.Polaroid) sanitized.Polaroid = [];
      if (s.kind === "timeline" && !sanitized.items) sanitized.items = [];
      if (s.kind === "closing" && !sanitized.stats) sanitized.stats = [];
    } else if (project.template === "cr7") {
      if (s.kind === "milestone" && !sanitized.items) sanitized.items = [];
    } else if (project.template === "cosmos") {
      if (s.kind === "diagram") {
        if (!sanitized.nodes) sanitized.nodes = [];
        if (!sanitized.edges) sanitized.edges = [];
      }
      if (s.kind === "timeline" && !sanitized.events) sanitized.events = [];
      if (s.kind === "compare") {
        if (!sanitized.left) sanitized.left = { value: "", label: "" };
        if (!sanitized.right) sanitized.right = { value: "", label: "" };
      }
    } else if (project.template === "nodeflow") {
      if (s.kind === "title" && !sanitized.nodes) sanitized.nodes = [];
      if (s.kind === "flow") {
        if (!sanitized.description) sanitized.description = [];
        if (!sanitized.flowNodes) sanitized.flowNodes = [];
      }
      if (s.kind === "contribution" && !sanitized.rows) sanitized.rows = [];
      if (s.kind === "compare" && !sanitized.columns) sanitized.columns = [];
    } else if (project.template === "terminal") {
      if (s.kind === "typing") {
        if (!sanitized.lines) sanitized.lines = [];
      }
      if (s.kind === "reveal") {
        if (!sanitized.lines) sanitized.lines = [];
        if (typeof sanitized.highlightLine !== "number") sanitized.highlightLine = 0;
      }
    } else if (project.template === "kineticStatement") {
      if (s.kind === "hook") {
        if (!Array.isArray(sanitized.words)) sanitized.words = [];
      }
      if (s.kind === "stat") {
        if (typeof sanitized.value !== "number") sanitized.value = 0;
        if (!sanitized.suffix) sanitized.suffix = "";
      }
      if (s.kind === "quote") {
        if (!sanitized.text) sanitized.text = "";
      }
    }
    content[s.id] = sanitized;
  }
  const totalFrames = scenes.reduce((acc, s) => acc + sceneFrames(s.dur), 0)
    + Math.max(0, scenes.length - 1) * 16;
  return { template: project.template, scenes, content, format: project.format,
    width, height, fps: FPS, totalFrames, projectName: project.name };
}

function generateEntryFile(payload) {
  const mod = TEMPLATE_MODULES[payload.template];
  const scenesJson = JSON.stringify(payload.scenes);
  const contentJson = JSON.stringify(payload.content);
  const needsTheme = payload.template !== "scrapbook";
  const themeJson = needsTheme ? JSON.stringify(THEME_DEFAULTS[payload.template]) : null;
  const componentImport = payload.template === "scrapbook" ? "ScrapbookTemplate" :
    payload.template === "cr7" ? "CR7Template" :
    payload.template === "cosmos" ? "CosmosTemplate" :
    payload.template === "terminal" ? "TerminalTemplate" :
    payload.template === "kineticStatement" ? "KineticStatementTemplate" : "NodeFlowTemplate";
  const themeProp = needsTheme ? `\n    theme={THEME}` : "";
  const themeConst = needsTheme ? `\nconst THEME = ${themeJson};\n` : "";

  return `// Auto-generated by export.mjs — do not edit
import { registerRoot } from "remotion";
import React from "react";
import { Composition } from "remotion";
import { ${componentImport} } from "${mod}";

const SCENES = ${scenesJson};
const CONTENT = ${contentJson} as const;
const TOTAL_FRAMES = ${payload.totalFrames};
const FPS = ${payload.fps};
const WIDTH = ${payload.width};
const HEIGHT = ${payload.height};
${themeConst}
const Root = () => (
  <Composition
    id="ExportComposition"
    component={${componentImport}}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{
      scenes: SCENES,
      content: CONTENT,${needsTheme ? "\n      theme: THEME," : ""}
    }}
  />
);

registerRoot(Root);
`;
}

function getOutputPath(project, customOutput) {
  if (customOutput) return path.resolve(ROOT, customOutput);
  const safe = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return path.join(ROOT, "out", `${safe || "export"}-${project.id.slice(0, 8)}.mp4`);
}

function main() {
  const argv = process.argv.slice(2);
  const projectFile = argv.find((a) => !a.startsWith("--"));
  const outputIdx = argv.indexOf("--output");
  const customOutput = outputIdx !== -1 ? argv[outputIdx + 1] : null;
  const skipValidation = argv.includes("--skip-validation");

  if (!projectFile) {
    console.error("Usage: node scripts/export.mjs <project.json> [--output out/custom.mp4]");
    process.exit(1);
  }

  const projectPath = path.resolve(ROOT, projectFile);
  if (!fs.existsSync(projectPath)) { console.error(`Project file not found: ${projectPath}`); process.exit(1); }

  let project;
  try { project = JSON.parse(fs.readFileSync(projectPath, "utf-8")); }
  catch (e) { console.error(`Failed to parse project: ${e.message}`); process.exit(1); }

  if (!skipValidation) {
    const result = validateProject(project);
    if (!result.valid) {
      console.error("Validation failed:");
      for (const err of result.errors) {
        console.error(`  [${err.code}] ${err.message}${err.scene ? ` (scene: ${err.scene})` : ""}`);
      }
      process.exit(1);
    }
    console.log("  ✓ Project validation passed");
  }

  const payload = buildPayload(project);
  const outputPath = getOutputPath(project, customOutput);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log("════════════════════════════════════════════════════════");
  console.log(`  EXPORT: ${project.name}`);
  console.log(`  Template: ${payload.template}`);
  console.log(`  Format: ${payload.format} (${payload.width}×${payload.height})`);
  console.log(`  Scenes: ${payload.scenes.length}`);
  console.log(`  Duration: ${(payload.totalFrames / payload.fps).toFixed(1)}s`);
  console.log(`  Output: ${outputPath}`);
  console.log("════════════════════════════════════════════════════════");

  try {
    const entryContent = generateEntryFile(payload);
    fs.writeFileSync(ENTRY_PATH, entryContent, "utf-8");
    console.log("  ✓ Generated export entry file");

    const cmd = `npx remotion render src/export-entry.tsx ExportComposition ${outputPath}`;
    console.log(`\n▶ Rendering...`);
    console.log(`  $ ${cmd}`);

    const r = spawnSync(cmd, [], { cwd: ROOT, stdio: "inherit", shell: true });
    if (r.error) { console.error(`  ✗ Render failed: ${r.error.message}`); process.exit(1); }
    if (r.status !== 0) { console.error(`  ✗ Render exited with code ${r.status}`); process.exit(1); }

    const stat = fs.statSync(outputPath);
    console.log(`\n════════════════════════════════════════════════════════`);
    console.log(`  ✓ EXPORT COMPLETE`);
    console.log(`  File: ${outputPath}`);
    console.log(`  Size: ${(stat.size / 1024 / 1024).toFixed(1)} MB`);
    console.log("════════════════════════════════════════════════════════");
  } finally {
    try { fs.unlinkSync(ENTRY_PATH); } catch {}
  }
}

main();
