// ---------------------------------------------------------------------------
// contractLoader.mjs — shared esbuild-based loader for contract pure logic
//
// Contract semantics live in TypeScript under src/contract/. This loader
// bundles the requested module on demand (same mechanism validate.mjs uses)
// so CLI scripts and vitest share a single source of truth (no logic drift).
// ---------------------------------------------------------------------------

import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Module from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let _require;
function cjsRequire() {
  if (!_require) _require = Module.createRequire(path.join(ROOT, "package.json"));
  return _require;
}

export async function loadContractModule(relPath) {
  const abs = path.join(ROOT, relPath);
  const result = await build({
    entryPoints: [abs],
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    absWorkingDir: ROOT,
  });
  const code = result.outputFiles[0].text;
  const mod = { exports: {} };
  const fn = new Function("module", "exports", "require", code);
  fn(mod, mod.exports, cjsRequire());
  return mod.exports;
}
