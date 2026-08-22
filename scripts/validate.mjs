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
//   add --check-assets to also verify referenced audio files exist under public/
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
const checkAssets = argv.includes("--check-assets");

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
import { validateProductionData, discoverScenes, checkAudioAssets } from ${JSON.stringify(absContract)};
import fs from "node:fs";
import path from "node:path";
const ROOT = ${JSON.stringify(ROOT)};
const __checkAssets = ${JSON.stringify(checkAssets)};
const __result = validateProductionData(data, ${JSON.stringify(template)});
const __scenes = discoverScenes(data) || [];
let __assetErrors = [];
if (__checkAssets) {
  __assetErrors = checkAudioAssets(__scenes, (a) => fs.existsSync(path.join(ROOT, "public", a)));
}
export const __valid = (__result.errors.length + __assetErrors.length) === 0;
export const __errors = __result.errors.concat(__assetErrors);
export const __sceneCount = __result.sceneCount;
`;

const tmp = path.join(os.tmpdir(), `ws36-validate-${Date.now()}.mjs`);
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
fs.rmSync(tmp, { force: true });

if (mod.__valid) {
  console.log(`✓ Content contract valid — ${template} (${mod.__sceneCount} scenes)`);
  process.exit(0);
}

console.error(`✗ Content contract INVALID — ${template}`);
for (const e of mod.__errors) {
  console.error(`  [${e.code}]${e.scene ? " scene " + e.scene : ""}: ${e.message}`);
}
process.exit(1);
