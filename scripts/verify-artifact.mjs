// ---------------------------------------------------------------------------
// verify-artifact.mjs — Remotion Production Contract v1 `verify(artifact)`
// ---------------------------------------------------------------------------

import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadContractModule } from "./contractLoader.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function runVerifyArtifact(artifactPath) {
  const mod = await loadContractModule("src/contract/artifact.ts");
  const absPath = path.resolve(ROOT, artifactPath);
  
  const facts = {
    exists: existsSync(absPath),
    size: existsSync(absPath) ? statSync(absPath).size : 0,
    extension: path.extname(absPath),
    readable: true, // simplified
  };
  
  return mod.verifyArtifactFacts(artifactPath, facts, false); // hasProbe: false
}

async function main() {
  const artifactPath = process.argv[2];
  if (!artifactPath) { console.error("Usage: npm run verify:artifact -- <path>"); process.exit(1); }
  const out = await runVerifyArtifact(artifactPath);
  console.log(JSON.stringify(out, null, 2));
  process.exit(out.status === "SUCCESS" ? 0 : out.status === "BLOCKED" ? 2 : 1);
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (invoked.endsWith("/scripts/verify-artifact.mjs")) main();
