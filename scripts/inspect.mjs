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

import { loadContractModule } from "./contractLoader.mjs";

async function inspectContract() {
  const contractModule = await loadContractModule("src/contract/inspect.ts");
  const { inspectContractData } = contractModule;
  return inspectContractData(CONTRACT_PATH);
}

function main() {
  inspectContract().then(out => {
    console.log(JSON.stringify(out, null, 2));
    process.exit(0);
  }).catch(e => {
    console.error("Failed to inspect contract:", e);
    process.exit(1);
  });
}
const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (invoked.endsWith("/scripts/inspect.mjs")) main();
