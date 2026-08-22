// ---------------------------------------------------------------------------
// produce.mjs — thin topic → video production orchestrator.
//
// Orchestrates the EXISTING pipeline for a known project:
//   1. (optional) generate Vietnamese TTS audio + scene data
//   2. render the Remotion composition to out/<comp>.mp4
//   3. report the standalone-preview command
//
// It does NOT create visual templates or re-implement rendering — it wraps the
// existing gen_tts_*.py scripts and `remotion render`.
//
// Usage:
//   node scripts/produce.mjs --project <alias|compositionId>
//                            [--topic <slug>] [--skip-tts] [--skip-render]
//   node scripts/produce.mjs --list
// ---------------------------------------------------------------------------

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Registry of existing productions. Add an entry when a new composition is
// wired; the visual template is reused, not rebuilt.
const PROJECTS = {
  nq57: {
    label: "Nghị quyết 57 (NQ57)",
    comp: "NghiQuyet57V2",
    tts: "gen_tts_v2.py",
    out: "out/nq57.mp4",
    content: "src/data/nq57.ts",
    res: "1920x1080",
  },
  dean06: {
    label: "Đề án 06 (DeAn06)",
    comp: "DeAn06",
    tts: "gen_tts_deAn06.py",
    out: "out/deAn06.mp4",
    content: "src/data/deAn06.ts",
    res: "1920x1080",
  },
  nq79: {
    label: "Nghị quyết 79 (NQ79)",
    comp: "NghiQuyet79",
    tts: "gen_tts_nghiQuyet79.py",
    out: "out/nghiQuyet79.mp4",
    content: "src/data/nghiQuyet79.ts",
    res: "1920x1080",
  },
  stoiclove: {
    label: "Stoic Love",
    comp: "StoicLove",
    tts: "gen_tts_stoicLove.py",
    out: "out/stoicLove.mp4",
    content: "src/data/stoicLove.ts",
    res: "1080x1920",
  },
};

function resolveProject(arg) {
  if (PROJECTS[arg]) return { key: arg, ...PROJECTS[arg] };
  const byComp = Object.entries(PROJECTS).find(([, p]) => p.comp === arg);
  if (byComp) return { key: byComp[0], ...byComp[1] };
  return null;
}

function findPython() {
  for (const cmd of ["python", "python3"]) {
    const r = spawnSync(cmd, ["--version"], { cwd: ROOT });
    if (r.status === 0) return cmd;
  }
  return null;
}

function run(cmd, args, label) {
  const cmdStr = [cmd, ...args].join(" ");
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

function main() {
  const argv = process.argv.slice(2);
  const get = (name, def = null) => {
    const i = argv.indexOf(name);
    return i !== -1 && i + 1 < argv.length ? argv[i + 1] : def;
  };
  const has = (name) => argv.includes(name);

  if (has("--list")) {
    console.log("Available projects:");
    for (const [key, p] of Object.entries(PROJECTS)) {
      console.log(`  ${key.padEnd(10)} → ${p.comp.padEnd(16)} ${p.res}`);
    }
    return;
  }

  const projectArg = get("--project");
  if (!projectArg) {
    console.error("Missing --project. Run with --list to see options.");
    process.exit(1);
  }
  const p = resolveProject(projectArg);
  if (!p) {
    console.error(`Unknown project "${projectArg}". Run with --list.`);
    process.exit(1);
  }

  const topic = get("--topic", p.label);
  const skipTts = has("--skip-tts");
  const skipRender = has("--skip-render");

  console.log("════════════════════════════════════════════════════════");
  console.log(`  PRODUCE: ${p.label}`);
  console.log(`  Topic : ${topic}`);
  console.log(`  Comp  : ${p.comp}  (${p.res})`);
  console.log(`  Output: ${p.out}`);
  console.log(`  Content data: ${p.content}`);
  console.log("════════════════════════════════════════════════════════");

  if (!skipTts) {
    const py = findPython();
    if (!py) {
      console.warn("  ! python not found — skipping TTS (use existing audio).");
    } else {
      const ok = run(py, [p.tts], `TTS generation (${p.tts})`);
      if (!ok) {
        console.warn("  ! TTS step failed — continuing with existing audio if present.");
      }
    }
  } else {
    console.log("  · --skip-tts: TTS skipped");
  }

  if (!skipRender) {
    const ok = run("npx", ["remotion", "render", "src/index.ts", p.comp, p.out], `Render ${p.out}`);
    if (!ok) {
      console.error("  ✗ render failed");
      process.exit(1);
    }
  } else {
    console.log("  · --skip-render: render skipped");
  }

  console.log("\n════════════════════════════════════════════════════════");
  console.log(`  ✓ DONE — ${p.out}`);
  console.log("  Preview: npm run preview   (→ http://localhost:4321/)");
  console.log("════════════════════════════════════════════════════════");
}

main();
