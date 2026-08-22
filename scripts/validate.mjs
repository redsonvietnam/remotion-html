// ---------------------------------------------------------------------------
// validate.mjs — CLI content-contract validator for a production.
//
// Loads a production data file (TypeScript) via esbuild bundling, runs the
// shared validator from src/data/contract.ts, prints explicit errors, and
// exits non-zero when the content contract is invalid (so the production
// pipeline stops before TTS/render).
//
// Usage:
//   node scripts/validate.mjs --project <alias>
//   node scripts/validate.mjs --data <path/to/data.ts> --template <tpl>
// ---------------------------------------------------------------------------

import { build } from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

const argv = process.argv.slice(2);
const get = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 && i + 1 < argv.length ? argv[i + 1] : null;
};

let dataFile = get("--data");
let template = get("--template");
const projectArg = get("--project");

if (projectArg) {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "manifest.json"), "utf-8"));
  const p = manifest.productions[projectArg];
  if (!p) fail(`Unknown project "${projectArg}".`);
  dataFile = p.dataFile;
  template = p.template;
}

if (!dataFile || !template) {
  fail("Provide --project <alias> or --data <path> --template <tpl>.");
}

const absData = path.isAbsolute(dataFile) ? dataFile : path.join(ROOT, dataFile);
const absContract = path.join(ROOT, "src", "data", "contract.ts");

if (!fs.existsSync(absData)) fail(`Data file not found: ${absData}`);

const entry = `
import * as data from ${JSON.stringify(absData)};
import { validateProductionData } from ${JSON.stringify(absContract)};
export const __result = validateProductionData(data, ${JSON.stringify(template)});
`;

const tmp = path.join(os.tmpdir(), `ws35-validate-${Date.now()}.mjs`);
try {
  await build({
    stdin: { contents: entry, resolveDir: ROOT, loader: "ts" },
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: tmp,
    logLevel: "silent",
  });
} catch (e) {
  fail(`Failed to bundle data for validation: ${e.message}`);
}

const mod = await import("file://" + tmp);
const res = mod.__result;
fs.rmSync(tmp, { force: true });

if (res.valid) {
  console.log(`✓ Content contract valid — ${template} (${res.sceneCount} scenes)`);
  process.exit(0);
}

console.error(`✗ Content contract INVALID — ${template}`);
for (const e of res.errors) {
  console.error(`  [${e.code}]${e.scene ? " scene " + e.scene : ""}: ${e.message}`);
}
process.exit(1);
