// ---------------------------------------------------------------------------
// verify.mjs — deterministic production-baseline verification gate (WS40)
//
// Answers one machine-verifiable question:
//   "Is the current master production baseline structurally valid and
//    safe to continue from?"
//
// Reuses EXISTING infrastructure only:
//   - scripts/validate.mjs  (contract + real audio asset + audio duration)
//   - scripts/produce.mjs --route-only (topic routing, no render)
//
// It does NOT duplicate validation algorithms and does NOT render video,
// so it is safe/cheap to run in CI.
// ---------------------------------------------------------------------------

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(ROOT, "scripts", "manifest.json");

// Production lines that must always be present in the baseline.
export const EXPECTED_PRODUCTIONS = ["nq57", "dean06", "nq79", "stoiclove", "canCuoc"];

// Known topic -> expected composition (routing contract). If any of these
// stops resolving correctly, routing is considered broken.
export const ROUTING_CONTRACT = [
  { topic: "nghị quyết 79", expect: "NghiQuyet79" },
  { topic: "đề án 06", expect: "DeAn06" },
  { topic: "nghị quyết 57", expect: "NghiQuyet57V2" },
  { topic: "stoic love", expect: "StoicLove" },
  { topic: "luật căn cước 2023", expect: "CanCuoc" },
];

export function loadManifest() {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

// Returns the registered production ids and any expected ids that are missing.
export function checkManifestCompleteness(manifest) {
  const ids = Object.keys(manifest.productions || {});
  const missing = EXPECTED_PRODUCTIONS.filter((id) => !ids.includes(id));
  return { ids, missing };
}

// Parse the resolved composition from `produce --route-only` output.
export function parseRoutedComposition(text) {
  const m = String(text).match(/Comp\s*:\s*(\S+)/);
  return m ? m[1] : null;
}

function runValidate(project) {
  const r = spawnSync(
    process.execPath,
    ["scripts/validate.mjs", "--project", project, "--check-assets", "--check-durations"],
    { cwd: ROOT, encoding: "utf8" }
  );
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

function runRoute(topic) {
  const r = spawnSync(
    process.execPath,
    ["scripts/produce.mjs", "--topic", topic, "--route-only"],
    { cwd: ROOT, encoding: "utf8" }
  );
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}

// Runs every check. Returns { failures, ids }. Does not exit.
export function verifyAll() {
  const failures = [];
  const manifest = loadManifest();

  const { missing } = checkManifestCompleteness(manifest);
  if (missing.length) {
    failures.push(`manifest missing expected production(s): ${missing.join(", ")}`);
  }

  const ids = Object.keys(manifest.productions || {});
  for (const id of ids) {
    const { ok, out } = runValidate(id);
    if (!ok) failures.push(`production "${id}" failed validation:\n${out.trim()}`);
  }

  for (const { topic, expect } of ROUTING_CONTRACT) {
    const { ok, out } = runRoute(topic);
    const comp = parseRoutedComposition(out);
    if (!ok || comp !== expect) {
      failures.push(`routing for "${topic}" expected ${expect}, got ${comp ?? "<none>"}`);
    }
  }

  return { failures, ids };
}

function main() {
  const { failures, ids } = verifyAll();
  console.log(`Production baseline verification — ${ids.length} production(s) registered.`);
  if (failures.length === 0) {
    console.log("VERIFY: PASS — baseline structurally valid and safe to continue from.");
    process.exit(0);
  }
  console.error("VERIFY: FAIL");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (invoked.endsWith("/scripts/verify.mjs")) main();
