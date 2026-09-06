// ---------------------------------------------------------------------------
// tts.mjs — Remotion Production Contract v1 `tts` capability
// ---------------------------------------------------------------------------

import { existsSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadContractModule } from "./contractLoader.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function runTts(productionId) {
  const mod = await loadContractModule("src/contract/tts.ts");
  const provMod = await loadContractModule("src/contract/provenance.ts");
  const resolution = mod.resolveTtsRequest({ productionId });
  if (resolution.status !== "SUCCESS") return resolution;

  const target = resolution.target;
  const collision = mod.ttsCollision(target, existsSync(path.join(ROOT, target.sentinel)));
  if (collision.status !== "SUCCESS") return collision;

  // Implementation-specific delegation
  let genResult;
  if (productionId === "solarSystem") {
    const r = spawnSync("python", [path.join(ROOT, "gen_tts_solarSystem.py")], { cwd: ROOT, stdio: "inherit" });
    if (r.status !== 0) return { status: "FAILED", message: "TTS generation failed" };
    genResult = { status: "SUCCESS", message: "TTS generation completed" };
  } else if (productionId === "solarSystem-contract-test") {
    const r = spawnSync("python", [path.join(ROOT, "gen_tts_solarSystem.py"), target.artifactRoot], { cwd: ROOT, stdio: "inherit" });
    if (r.status !== 0) return { status: "FAILED", message: "TTS generation failed" };
    genResult = { status: "SUCCESS", message: "TTS generation completed" };
  } else {
    return { status: "BLOCKED", message: `no generation path for production "${productionId}"` };
  }

  // Generate provenance for successful TTS
  const sentinelPath = path.join(ROOT, target.sentinel);
  let artifactSize = null;
  try {
    if (existsSync(sentinelPath)) {
      artifactSize = statSync(sentinelPath).size;
    }
  } catch { /* ignore */ }

  const contract = JSON.parse((await import("node:fs")).readFileSync(path.join(ROOT, "contract.json"), "utf8"));
  const composition = contract.productions[productionId]?.composition || "unknown";

  const provenance = provMod.generateProvenance({
    productionId,
    contractVersion: contract.contractVersion,
    composition,
    ttsBackend: "python",
    voice: null,
    duration: null,
    artifactPath: target.sentinel,
    artifactSize,
    repoRoot: ROOT,
  });

  // Write provenance sidecar
  const provPath = provMod.provenancePath(target.sentinel);
  writeFileSync(path.join(ROOT, provPath), JSON.stringify(provenance, null, 2));

  return { ...genResult, provenance };
}

async function main() {
  const productionId = process.argv[2];
  if (!productionId) { console.error("Usage: npm run tts -- <productionId>"); process.exit(1); }
  const out = await runTts(productionId);
  console.log(JSON.stringify(out, null, 2));
  process.exit(out.status === "SUCCESS" ? 0 : out.status === "BLOCKED" ? 2 : 1);
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (invoked.endsWith("/scripts/tts.mjs")) main();
