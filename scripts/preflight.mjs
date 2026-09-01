// ---------------------------------------------------------------------------
// preflight.mjs — Remotion Production Contract v1 `preflight` capability
//
// READ-ONLY readiness / safe-to-operate assessment.
// Does NOT mutate source, repair, install dependencies, render, or generate
// TTS. Reports semantic state: READY | BLOCKED | FAILED.
// ---------------------------------------------------------------------------

import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";
import { loadContractModule } from "./contractLoader.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function runPreflight() {
  const mod = await loadContractModule("src/contract/preflight.ts");
  return mod.evaluatePreflight(ROOT);
}

async function main() {
  const out = await runPreflight();
  console.log(JSON.stringify(out, null, 2));
  const rc = out.status === "READY" ? 0 : out.status === "BLOCKED" ? 2 : 1;
  process.exit(rc);
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (invoked.endsWith("/scripts/preflight.mjs")) main();
