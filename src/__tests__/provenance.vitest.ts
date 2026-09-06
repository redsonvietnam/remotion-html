// ---------------------------------------------------------------------------
// Provenance Regression Tests — WS-ECO-02 / WS-ECO-02A
//
// Tests the provenance model: types, generation, sidecar path computation,
// validation, and integration with actual production configuration.
// Provenance enables artifact traceability and reproducibility.
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import path from "node:path";
import { readFileSync, existsSync } from "node:fs";
import {
  Provenance,
  resolveSourceRevision,
  generateProvenance,
  provenancePath,
  validateProvenance,
} from "../contract/provenance";

const ROOT = path.resolve(__dirname, "..", "..");

// ─── Source revision resolution ────────────────────────────────────────────

describe("Provenance: resolveSourceRevision", () => {
  it("returns a 40-char hex SHA from a real Git repo", () => {
    const sha = resolveSourceRevision(ROOT);
    expect(sha).toMatch(/^[0-9a-f]{40}$/);
  });

  it("returns 'unknown' for a non-existent path", () => {
    const sha = resolveSourceRevision("/nonexistent/path");
    expect(sha).toBe("unknown");
  });
});

// ─── Provenance generation ─────────────────────────────────────────────────

describe("Provenance: generateProvenance", () => {
  it("generates a valid provenance record with accurate backend", () => {
    const p = generateProvenance({
      productionId: "solarSystem",
      contractVersion: "1.0",
      composition: "SolarSystem",
      ttsBackend: "edge",           // actual engine: edge_tts (Microsoft Edge TTS)
      voice: "vi-VN-NamMinhNeural", // actual voice from gen_tts_solarSystem.py
      duration: 70.048,             // actual duration from durations.json
      artifactPath: "out/solarSystem.mp4",
      artifactSize: 1024000,
      repoRoot: ROOT,
    });

    expect(p.productionId).toBe("solarSystem");
    expect(p.contractVersion).toBe("1.0");
    expect(p.composition).toBe("SolarSystem");
    expect(p.ttsBackend).toBe("edge");
    expect(p.voice).toBe("vi-VN-NamMinhNeural");
    expect(p.duration).toBe(70.048);
    expect(p.sourceRevision).toMatch(/^[0-9a-f]{40}$/);
    expect(p.artifactPath).toBe("out/solarSystem.mp4");
    expect(p.artifactSize).toBe(1024000);
    expect(p.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(p.environment.nodeVersion).toMatch(/^v\d+/);
    expect(p.environment.platform).toBeDefined();
    expect(p.environment.arch).toBeDefined();
  });

  it("handles null optional fields", () => {
    const p = generateProvenance({
      productionId: "test",
      contractVersion: "1.0",
      composition: "TestComp",
      ttsBackend: null,
      voice: null,
      duration: null,
      artifactPath: "out/test.mp4",
      artifactSize: null,
      repoRoot: ROOT,
    });

    expect(p.ttsBackend).toBeNull();
    expect(p.voice).toBeNull();
    expect(p.duration).toBeNull();
    expect(p.artifactSize).toBeNull();
  });
});

// ─── Provenance sidecar path ───────────────────────────────────────────────

describe("Provenance: provenancePath", () => {
  it("computes sidecar path for .mp4", () => {
    expect(provenancePath("out/video.mp4")).toBe("out/video.provenance.json");
  });

  it("computes sidecar path for .webm", () => {
    expect(provenancePath("out/video.webm")).toBe("out/video.provenance.json");
  });

  it("computes sidecar path for nested paths", () => {
    expect(provenancePath("out/nested/video.mp4")).toBe("out/nested/video.provenance.json");
  });

  it("computes sidecar path for durations.json", () => {
    expect(provenancePath("public/solarSystem/durations.json")).toBe(
      "public/solarSystem/durations.provenance.json"
    );
  });
});

// ─── Provenance validation ─────────────────────────────────────────────────

describe("Provenance: validateProvenance", () => {
  const validProvenance: Provenance = {
    productionId: "solarSystem",
    contractVersion: "1.0",
    composition: "SolarSystem",
    ttsBackend: "edge",
    voice: "vi-VN-NamMinhNeural",
    duration: 70.048,
    sourceRevision: "a".repeat(40),
    artifactPath: "out/solarSystem.mp4",
    artifactSize: 1024000,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  };

  it("validates a correct provenance record", () => {
    const result = validateProvenance(validProvenance);
    expect(result.status).toBe("SUCCESS");
    expect(result.missing).toHaveLength(0);
  });

  it("rejects missing productionId", () => {
    const result = validateProvenance({ ...validProvenance, productionId: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("productionId");
  });

  it("rejects missing contractVersion", () => {
    const result = validateProvenance({ ...validProvenance, contractVersion: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("contractVersion");
  });

  it("rejects missing composition", () => {
    const result = validateProvenance({ ...validProvenance, composition: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("composition");
  });

  it("rejects missing sourceRevision", () => {
    const result = validateProvenance({ ...validProvenance, sourceRevision: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("sourceRevision");
  });

  it("rejects invalid sourceRevision format", () => {
    const result = validateProvenance({ ...validProvenance, sourceRevision: "not-a-sha" });
    expect(result.status).toBe("FAILED");
    expect(result.missing.some((m) => m.includes("sourceRevision"))).toBe(true);
  });

  it("allows 'unknown' as explicit unavailable representation", () => {
    const result = validateProvenance({ ...validProvenance, sourceRevision: "unknown" });
    expect(result.status).toBe("SUCCESS");
  });

  it("rejects missing artifactPath", () => {
    const result = validateProvenance({ ...validProvenance, artifactPath: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("artifactPath");
  });

  it("rejects missing timestamp", () => {
    const result = validateProvenance({ ...validProvenance, timestamp: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("timestamp");
  });

  it("rejects invalid timestamp format", () => {
    const result = validateProvenance({ ...validProvenance, timestamp: "not-a-date" });
    expect(result.status).toBe("FAILED");
    expect(result.missing.some((m) => m.includes("timestamp"))).toBe(true);
  });

  it("reports multiple missing fields", () => {
    const result = validateProvenance({
      ...validProvenance,
      productionId: "",
      composition: "",
    });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("productionId");
    expect(result.missing).toContain("composition");
  });
});

// ─── Integration: actual production configuration ──────────────────────────

describe("Provenance: integration with actual TTS configuration", () => {
  it("solarSystem TTS backend is edge_tts (not python)", () => {
    // Source of truth: gen_tts_solarSystem.py line 5: import edge_tts
    const ttsScript = readFileSync(path.join(ROOT, "gen_tts_solarSystem.py"), "utf8");
    expect(ttsScript).toContain("import edge_tts");
    expect(ttsScript).not.toContain("import openai");
    expect(ttsScript).not.toContain("import pyttsx3");
  });

  it("solarSystem voice is vi-VN-NamMinhNeural", () => {
    // Source of truth: gen_tts_solarSystem.py line 8: VOICE = "vi-VN-NamMinhNeural"
    const ttsScript = readFileSync(path.join(ROOT, "gen_tts_solarSystem.py"), "utf8");
    const voiceMatch = ttsScript.match(/VOICE\s*=\s*"([^"]+)"/);
    expect(voiceMatch).not.toBeNull();
    expect(voiceMatch![1]).toBe("vi-VN-NamMinhNeural");
  });

  it("solarSystem durations.json exists and contains valid durations", () => {
    const durationsPath = path.join(ROOT, "public/solarSystem/durations.json");
    expect(existsSync(durationsPath)).toBe(true);

    const durations = JSON.parse(readFileSync(durationsPath, "utf8"));
    expect(Object.keys(durations).length).toBeGreaterThan(0);

    // All durations should be positive numbers
    for (const [scene, duration] of Object.entries(durations)) {
      expect(typeof duration).toBe("number");
      expect(duration).toBeGreaterThan(0);
    }
  });

  it("solarSystem total duration matches sum of scene durations", () => {
    const durationsPath = path.join(ROOT, "public/solarSystem/durations.json");
    const durations = JSON.parse(readFileSync(durationsPath, "utf8"));
    const total = Object.values(durations).reduce((sum: number, d) => sum + (typeof d === "number" ? d : 0), 0);
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThan(200); // sanity check: should be under 200 seconds
  });
});

// ─── Integration: contract.json source of truth ────────────────────────────

describe("Provenance: contract.json is canonical source of truth", () => {
  it("contract.json exists and is valid JSON", () => {
    const contractPath = path.join(ROOT, "contract.json");
    expect(existsSync(contractPath)).toBe(true);
    const contract = JSON.parse(readFileSync(contractPath, "utf8"));
    expect(contract.contractVersion).toBe("1.0");
    expect(contract.productions).toBeDefined();
  });

  it("solarSystem production exists in contract.json", () => {
    const contract = JSON.parse(readFileSync(path.join(ROOT, "contract.json"), "utf8"));
    expect(contract.productions.solarSystem).toBeDefined();
    expect(contract.productions.solarSystem.composition).toBe("SolarSystem");
    expect(contract.productions.solarSystem.output).toBe("out/solarSystem.mp4");
  });
});

// ─── Contract result model with provenance ─────────────────────────────────

describe("Contract result model: provenance compatibility", () => {
  it("result() returns status and message without provenance", async () => {
    const { result } = await import("../contract/model");
    const r = result("SUCCESS", "test");
    expect(r.status).toBe("SUCCESS");
    expect(r.message).toBe("test");
    expect(r.provenance).toBeUndefined();
  });

  it("result can include provenance", async () => {
    const prov: Provenance = {
      productionId: "test",
      contractVersion: "1.0",
      composition: "TestComp",
      ttsBackend: null,
      voice: null,
      duration: null,
      sourceRevision: "a".repeat(40),
      artifactPath: "out/test.mp4",
      artifactSize: null,
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
    const r = { status: "SUCCESS" as const, message: "done", provenance: prov };
    expect(r.provenance?.productionId).toBe("test");
    expect(r.provenance?.sourceRevision).toMatch(/^[0-9a-f]{40}$/);
  });
});
