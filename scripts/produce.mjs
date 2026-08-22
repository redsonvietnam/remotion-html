// ---------------------------------------------------------------------------
// produce.mjs — thin topic → video production orchestrator + topic router.
//
// Two intake modes (both deterministic, no AI / no external API):
//   --project <alias|compositionId>   explicit production (original behavior)
//   --topic "<topic>"                 route topic → existing template → produce
//
// The repository-side contract lives in scripts/manifest.json. Each production
// declares: template, composition, dataFile, tts script, output, preview, and
// routing aliases/keywords. Topic routing matches against aliases (exact) and
// keywords (substring) after diacritic/lowercase normalization.
//
// If no template matches a topic, the system reports NO_MATCH and refuses to
// silently pick an inappropriate template.
//
// Steps executed per production (existing pipeline, wrapped):
//   1. (optional) generate Vietnamese TTS audio + scene data
//   2. render the Remotion composition to out/<comp>.mp4
//   3. report the standalone-preview command
//
// Usage:
//   node scripts/produce.mjs --list
//   node scripts/produce.mjs --manifest
//   node scripts/produce.mjs --project <alias|comp> [--topic <slug>] [--skip-tts] [--skip-render] [--route-only]
//   node scripts/produce.mjs --topic "<topic>" [--skip-tts] [--skip-render] [--route-only]
// ---------------------------------------------------------------------------

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "manifest.json");

const MANIFEST = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
const PRODUCTIONS = MANIFEST.productions;

function normalize(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Route a topic string to a production id, or null if no template fits.
function routeTopic(topic) {
  const t = normalize(topic);
  for (const [id, p] of Object.entries(PRODUCTIONS)) {
    const aliases = (p.aliases || []).map(normalize);
    const keywords = (p.keywords || []).map(normalize);
    if (aliases.includes(t) || keywords.some((k) => t.includes(k))) {
      return id;
    }
  }
  return null;
}

// Resolve explicit --project (alias or composition id) to a production id.
function resolveProject(arg) {
  if (PRODUCTIONS[arg]) return arg;
  const byComp = Object.entries(PRODUCTIONS).find(([, p]) => p.composition === arg);
  return byComp ? byComp[0] : null;
}

function findPython() {
  for (const cmd of ["python", "python3"]) {
    const r = spawnSync(cmd, ["--version"], { cwd: ROOT });
    if (r.status === 0) return cmd;
  }
  return null;
}

function run(cmdStr, label) {
  console.log(`\n▶ ${label}`);
  console.log(`  $ ${cmdStr}`);
  const r = spawnSync(cmdStr, [], { cwd: ROOT, stdio: "inherit", shell: true });
  if (r.error) {
    console.error(`  ✗ failed to start: ${r.error.message}`);
    return false;
  }
  if (r.status !== 0) {
    console.error(`  ✗ exited with code ${r.status}`);
    return false;
  }
  console.log(`  ✓ ${label} done`);
  return true;
}

function printManifest() {
  console.log(JSON.stringify({ productions: PRODUCTIONS }, null, 2));
}

function listProjects() {
  console.log("Available productions (--project <alias|composition>):");
  for (const [id, p] of Object.entries(PRODUCTIONS)) {
    console.log(`  ${id.padEnd(10)} → ${p.composition.padEnd(16)} ${p.resolution}`);
  }
  console.log("\nTopic routing examples:");
  console.log('  "Nghị quyết 79"            → nq79');
  console.log('  "Đề án 06"                 → dean06');
  console.log('  "Nghị quyết 57"            → nq57');
  console.log('  "quan niệm Stoicism tình yêu" → stoiclove');
  console.log('  "<unknown topic>"          → NO_MATCH');
}

function reportNoMatch(topic) {
  console.log("NO_MATCH:");
  console.log("No existing template is appropriate.");
  console.log("New template required.");
  if (topic) console.log(`  (topic: ${topic})`);
}

function produce(id, opts) {
  const p = PRODUCTIONS[id];
  const topic = opts.topic || p.template;

  console.log("════════════════════════════════════════════════════════");
  console.log(`  PRODUCE: ${p.composition}  (template: ${p.template})`);
  if (opts.routedFrom) console.log(`  Routed from topic: "${opts.routedFrom}"`);
  console.log(`  Topic : ${topic}`);
  console.log(`  Comp  : ${p.composition}  (${p.resolution})`);
  console.log(`  Output: ${p.output}`);
  console.log(`  Content data: ${p.dataFile}`);
  console.log("════════════════════════════════════════════════════════");

  if (opts.routeOnly) {
    console.log("\n  Routed manifest:");
    console.log(JSON.stringify(p, null, 2));
    return true;
  }

  // Content-contract gate: stop before TTS/render if data is invalid.
  if (!opts.skipValidation) {
    console.log("\n▶ Content contract validation");
    const v = spawnSync("node", ["scripts/validate.mjs", "--project", id], {
      cwd: ROOT,
      stdio: "inherit",
      shell: true,
    });
    if (v.status !== 0) {
      console.error("  ✗ content validation failed — stopping before TTS/render.");
      return false;
    }
    console.log("  ✓ content contract valid");
  } else {
    console.log("  · --skip-validation: skipped content validation");
  }

  if (!opts.skipTts) {
    const py = findPython();
    if (!py) {
      console.warn("  ! python not found — skipping TTS (use existing audio).");
    } else {
      const ok = run(`${py} ${p.tts}`, `TTS generation (${p.tts})`);
      if (!ok) console.warn("  ! TTS step failed — continuing with existing audio if present.");
    }
  } else {
    console.log("  · --skip-tts: TTS skipped");
  }

  if (!opts.skipRender) {
    const ok = run(`npx remotion render src/index.ts ${p.composition} ${p.output}`, `Render ${p.output}`);
    if (!ok) {
      console.error("  ✗ render failed");
      return false;
    }
  } else {
    console.log("  · --skip-render: render skipped");
  }

  console.log("\n════════════════════════════════════════════════════════");
  console.log(`  ✓ DONE — ${p.output}`);
  console.log("  Preview: npm run preview   (→ http://localhost:4321/)");
  console.log("════════════════════════════════════════════════════════");
  return true;
}

function main() {
  const argv = process.argv.slice(2);
  const get = (name, def = null) => {
    const i = argv.indexOf(name);
    return i !== -1 && i + 1 < argv.length ? argv[i + 1] : def;
  };
  const has = (name) => argv.includes(name);

  if (has("--manifest")) {
    printManifest();
    return;
  }
  if (has("--list")) {
    listProjects();
    return;
  }

  const projectArg = get("--project");
  const topicArg = get("--topic");
  const skipTts = has("--skip-tts");
  const skipRender = has("--skip-render");
  const routeOnly = has("--route-only");
  const skipValidation = has("--skip-validation");

  if (!projectArg && !topicArg) {
    console.error("Provide --project <alias|comp> or --topic \"<topic>\". Run --list for options.");
    process.exit(1);
  }

  // Explicit --project takes precedence (preserves original behavior).
  let id = null;
  let routedFrom = null;
  if (projectArg) {
    id = resolveProject(projectArg);
    if (!id) {
      console.error(`Unknown project "${projectArg}". Run --list.`);
      process.exit(1);
    }
  } else if (topicArg) {
    id = routeTopic(topicArg);
    if (!id) {
      reportNoMatch(topicArg);
      process.exit(2);
    }
    routedFrom = topicArg;
  }

  const ok = produce(id, { topic: topicArg || projectArg, skipTts, skipRender, routeOnly, skipValidation, routedFrom });
  process.exit(ok ? 0 : 1);
}

main();
