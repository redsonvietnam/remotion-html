// ---------------------------------------------------------------------------
// inspect.mjs — Remotion Production Contract v1 `inspect` capability
//
// READ-ONLY stability/capability/project discovery. Emits the canonical
// machine-readable contract plus resolved production identities.
//
// Does NOT scan the source tree. ZeroClaw-independent.
// ---------------------------------------------------------------------------

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_PATH = path.join(ROOT, "contract.json");

export function loadContract() {
  return JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
}

export function inspectContract() {
  const contract = loadContract();
  return {
    contractVersion: contract.contractVersion,
    projectId: contract.projectId,
    projectName: contract.projectName,
    projectVersion: contract.projectVersion,
    capabilities: contract.capabilities.map((c) => c.name),
    productions: contract.productions,
    compatibility: contract.compatibility,
  };
}

function main() {
  console.log(JSON.stringify(inspectContract(), null, 2));
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (invoked.endsWith("/scripts/inspect.mjs")) main();
