// ---------------------------------------------------------------------------
// preflight.mjs — Remotion Production Contract v1 `preflight` capability
//
// READ-ONLY readiness / safe-to-operate assessment.
// Does NOT mutate source, repair, install dependencies, render, or generate
// TTS. Reports semantic state: READY | BLOCKED | FAILED.
// ---------------------------------------------------------------------------

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function runPreflight() {
  const checks = [
    {
      name: "contract",
      state: existsSync(path.join(ROOT, "contract.json")) ? "READY" : "FAILED",
    },
    {
      name: "source",
      state: existsSync(path.join(ROOT, "src", "Root.tsx")) ? "READY" : "FAILED",
    },
  ];

  let status = "READY";
  const evaluated = [];
  for (const check of checks) {
    evaluated.push(check);
    if (check.state === "FAILED") {
      status = "FAILED";
      break;
    }
    if (check.state === "BLOCKED") {
      status = "BLOCKED";
      break;
    }
  }
  return { status, checks: evaluated };
}

function main() {
  const out = runPreflight();
  console.log(JSON.stringify(out, null, 2));
  const rc = out.status === "READY" ? 0 : out.status === "BLOCKED" ? 2 : 1;
  process.exit(rc);
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (invoked.endsWith("/scripts/preflight.mjs")) main();
