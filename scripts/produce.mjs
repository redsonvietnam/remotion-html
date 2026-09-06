// ---------------------------------------------------------------------------
// produce.mjs — thin topic → video production orchestrator + topic router.
//
// Two intake modes (both deterministic, no AI / no external API):
//   --project <alias|compositionId>   explicit production (original behavior)
//   --topic "<topic>"                 route topic → existing template → produce
//
// SOURCE OF TRUTH:
//   contract.json = canonical production definitions (id, composition, output, format)
//   scripts/manifest.json = internal build metadata (template, aliases, keywords, dataFile, tts, resolution, preview)
//
// Production definitions are loaded from contract.json. Additional build metadata
// is merged from scripts/manifest.json. This ensures contract.json is the single
// canonical source for production identities.
//
// If no template matches a topic, the system reports NO_MATCH and refuses to
// silently pick an inappropriate template.
//
// Steps executed per production (existing pipeline, wrapped):
//   1. (optional) generate Vietnamese TTS audio + scene data
//   2. render the Remotion composition to out/<comp>.mp4
//   3. report the standalone-preview command
//
// PROVENANCE FAILURE SEMANTICS:
//   Artifact-producing capability succeeds + provenance successfully persisted = SUCCESS
//   If provenance persistence fails, the capability reports FAILED.
//   Provenance is required evidence for artifact-producing capabilities.
//
// Usage:
//   node scripts/produce.mjs --list
//   node scripts/produce.mjs --manifest
//   node scripts/produce.mjs --project <alias|comp> [--topic <slug>] [--skip-tts] [--skip-render] [--route-only]
//   node scripts/produce.mjs --topic "<topic>" [--skip-tts] [--skip-render] [--route-only]
// ---------------------------------------------------------------------------

import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContractModule } from "./contractLoader.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "manifest.json");
const CONTRACT_PATH = path.join(ROOT, "contract.json");

// ─── Source of truth: contract.json is canonical ──────────────────────────
const CONTRACT = JSON.parse(readFileSync(CONTRACT_PATH, "utf-8"));
const MANIFEST = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));

// Merge: contract.json provides canonical production definitions,
// manifest.json provides additional internal build metadata.
function buildProductions() {
  const productions = {};
  for (const [id, contractProd] of Object.entries(CONTRACT.productions)) {
    const manifestMeta = MANIFEST.productions[id] || {};
    productions[id] = {
      // Canonical fields from contract.json
      id: contractProd.id,
      composition: contractProd.composition,
      output: contractProd.output,
      format: contractProd.format,
      // Additional build metadata from manifest.json
      template: manifestMeta.template || id,
      dataFile: manifestMeta.dataFile || null,
      tts: manifestMeta.tts || null,
      resolution: manifestMeta.resolution || "1920x1080",
      preview: manifestMeta.preview || null,
      aliases: manifestMeta.aliases || [],
      keywords: manifestMeta.keywords || [],
    };
  }
  return productions;
}

const PRODUCTIONS = buildProductions();

// ─── TTS configuration constants ──────────────────────────────────────────
// These reflect the ACTUAL implementation in each gen_tts_*.py script.
// Source of truth: the Python scripts themselves (VOICE constant, edge_tts import).
const TTS_CONFIG = {
  solarSystem: {
    ttsBackend: "edge",           // actual engine: edge_tts (Microsoft Edge TTS)
    voice: "vi-VN-NamMinhNeural", // actual voice from gen_tts_solarSystem.py line 8
    sentinel: "public/solarSystem/durations.json",
  },
  // Add other TTS-enabled productions here as their scripts are inspected
};

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

// ─── Duration helpers ──────────────────────────────────────────────────────

/**
 * Read durations.json from a production's artifact root.
 * Returns total duration in seconds, or null if unavailable.
 * The durations.json is generated by the TTS script using mutagen.mp3
 * to measure actual MP3 artifact durations (not planned scene timing).
 */
function readArtifactDuration(sentinelPath) {
  try {
    if (!existsSync(sentinelPath)) return null;
    const raw = readFileSync(sentinelPath, "utf8");
    const durations = JSON.parse(raw);
    const total = Object.values(durations).reduce((sum, d) => sum + (typeof d === "number" ? d : 0), 0);
    return total > 0 ? Math.round(total * 1000) / 1000 : null;
  } catch {
    return null;
  }
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

async function produce(id, opts) {
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
    // Real-asset gate: after TTS, verify required audio files actually exist
    // before spending time rendering. (Skipped when validation is disabled.)
    if (!opts.skipValidation) {
      console.log("\n▶ Real asset + duration validation (audio files exist, durations fit scenes)");
      const a = spawnSync(
        "node",
        ["scripts/validate.mjs", "--project", id, "--check-assets", "--check-durations"],
        { cwd: ROOT, stdio: "inherit", shell: true }
      );
      if (a.status !== 0) {
        console.error("  ✗ asset/duration validation failed — stopping before render.");
        return false;
      }
      console.log("  ✓ required audio assets present and durations fit scene timing");
    } else {
      console.log("  · --skip-validation: skipped real-asset/duration gate");
    }
    const ok = run(`npx remotion render src/index.ts ${p.composition} ${p.output}`, `Render ${p.output}`);
    if (!ok) {
      console.error("  ✗ render failed");
      return false;
    }

    // Generate provenance for successful render — REQUIRED evidence
    // Provenance failure = capability failure (provenance is part of the capability output)
    try {
      const provMod = await loadContractModule("src/contract/provenance.ts");

      let artifactSize = null;
      try {
        if (existsSync(p.output)) {
          artifactSize = statSync(p.output).size;
        }
      } catch { /* ignore */ }

      // Get actual duration from rendered artifact if possible
      // For now, use null — actual video duration measurement requires ffprobe or similar
      const duration = null;

      // Get TTS configuration for accurate backend/voice
      const ttsConfig = TTS_CONFIG[id];
      const ttsBackend = ttsConfig ? ttsConfig.ttsBackend : null;
      const voice = ttsConfig ? ttsConfig.voice : null;

      const provenance = provMod.generateProvenance({
        productionId: id,
        contractVersion: CONTRACT.contractVersion,
        composition: p.composition,
        ttsBackend,
        voice,
        duration,
        artifactPath: p.output,
        artifactSize,
        repoRoot: ROOT,
      });

      const provPath = provMod.provenancePath(p.output);
      writeFileSync(path.join(ROOT, provPath), JSON.stringify(provenance, null, 2));
      console.log(`  ✓ Provenance: ${provPath}`);
    } catch (err) {
      // Provenance failure = capability failure
      console.error(`  ✗ Provenance generation failed: ${err.message}`);
      console.error("  ✗ Provenance is required evidence — marking capability as FAILED");
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
