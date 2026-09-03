// ---------------------------------------------------------------------------
// Contract v1 Regression Tests — WS-ZC-04
//
// Tests the canonical machine-readable contract.json and its semantic rules.
// Ensures ADR compliance, capability discovery, and result model stability.
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { evaluatePreflight } from "../contract/preflight";
import { inspectContractData } from "../contract/inspect";
import { resolveTtsRequest, ttsCollision, TTS_TARGETS } from "../contract/tts";
import { verifyArtifactFacts } from "../contract/artifact";
import { validateRenderOutput, validateRenderRequest, renderCollision } from "../contract/model";

const ROOT = path.resolve(__dirname, "..", "..");
const CONTRACT_PATH = path.join(ROOT, "contract.json");

// ─── Contract file presence & basic structure ───────────────────────────────

describe("Contract file: contract.json", () => {
  it("contract.json exists at repository root", () => {
    expect(existsSync(CONTRACT_PATH)).toBe(true);
  });

  it("contract.json is valid JSON", () => {
    expect(() => JSON.parse(readFileSync(CONTRACT_PATH, "utf8"))).not.toThrow();
  });

  it("contractVersion is '1.0'", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    expect(contract.contractVersion).toBe("1.0");
  });

  it("project identity is stable", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    expect(contract.projectId).toBe("remotion-html-project");
    expect(contract.projectName).toBe("remotion-html");
    expect(contract.projectVersion).toBe("1.0.0"); // Matches package.json
  });
});

// ─── Capability surface & semantics ─────────────────────────────────────────

describe("Contract capabilities: ADR compliance", () => {
  let contract: any;
  beforeAll(() => {
    contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
  });

  it("exactly five V1 capabilities: inspect, preflight, tts, render, verify", () => {
    const capabilities = contract.capabilities.map((c: any) => c.name);
    expect(capabilities).toEqual(["inspect", "preflight", "tts", "render", "verify"]);
    expect(capabilities).toHaveLength(5);
  });

  it("capabilities do not expose stdout/stderr/exitCode as outputs", () => {
    for (const capability of contract.capabilities) {
      if (capability.outputs) {
        expect(capability.outputs).not.toContain("stdout");
        expect(capability.outputs).not.toContain("stderr");
        expect(capability.outputs).not.toContain("exitCode");
      }
    }
  });

  it("resultModel is defined (SUCCESS|BLOCKED|FAILED)", () => {
    expect(contract.resultModel).toEqual(["SUCCESS", "BLOCKED", "FAILED"]);
  });

  it("artifactBoundary is 'out/'", () => {
    expect(contract.artifactBoundary).toBe("out/");
  });

  it("inspect capability outputs expected metadata", () => {
    const inspectCap = contract.capabilities.find((c: any) => c.name === "inspect");
    expect(inspectCap.outputs).toEqual(["contractVersion", "projectId", "projectVersion", "capabilities", "productions"]);
  });

  it("preflight capability outputs status and checks", () => {
    const preflightCap = contract.capabilities.find((c: any) => c.name === "preflight");
    expect(preflightCap.outputs).toEqual(["status", "checks"]);
  });

  it("tts capability defines productionId input", () => {
    const ttsCap = contract.capabilities.find((c: any) => c.name === "tts");
    expect(ttsCap.inputs[0].name).toBe("productionId");
    expect(ttsCap.outputs).toEqual(["status", "artifact"]);
  });

  it("render capability defines composition and output inputs", () => {
    const renderCap = contract.capabilities.find((c: any) => c.name === "render");
    expect(renderCap.inputs.map((i: any) => i.name)).toEqual(["composition", "output"]);
    expect(renderCap.outputs).toEqual(["status", "artifact"]);
  });

  it("verify capability defines optional target input", () => {
    const verifyCap = contract.capabilities.find((c: any) => c.name === "verify");
    expect(verifyCap.inputs.find((i: any) => i.name === "target")?.type).toBe("string");
    expect(verifyCap.outputs).toEqual(["status", "checks"]);
  });
});

// ─── Production definitions (stable composition identities) ─────────────────

describe("Contract productions: stable composition identities", () => {
  let contract: any;
  beforeAll(() => {
    contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
  });

  it("productions map exists", () => {
    expect(contract.productions).toBeDefined();
    expect(Object.keys(contract.productions).length).toBeGreaterThan(0);
  });

  it("each production defines id, composition, output, format", () => {
    const productions = Object.values(contract.productions) as any[];
    for (const prod of productions) {
      expect(prod.id).toBeDefined();
      expect(prod.composition).toBeDefined();
      expect(prod.output).toBeDefined();
      expect(prod.format).toBeDefined();
    }
  });

  it("productions have consistent formats (16:9 or 9:16)", () => {
    const productions = Object.values(contract.productions) as any[];
    for (const prod of productions) {
      expect(["16:9", "9:16"]).toContain(prod.format);
    }
  });
});

// ─── Native command integration tests ───────────────────────────────────────

describe("Native command execution: inspect and preflight", () => {
  it("npm run inspect emits contract metadata", () => {
    const result = inspectContractData(CONTRACT_PATH);
    expect(result.contractVersion).toBe("1.0");
    expect(result.capabilities).toEqual(["inspect", "preflight", "tts", "render", "verify"]);
    expect(Object.keys(result.productions).length).toBeGreaterThan(0);
  });

  it("npm run preflight for a healthy project returns READY", () => {
    const result = evaluatePreflight(ROOT);
    expect(result.status).toBe("READY");
    expect(result.checks.length).toBeGreaterThanOrEqual(2);
    expect(result.checks.every((c: any) => c.state === "READY")).toBe(true);
  });
});

// ─── TTS limitations ────────────────────────────────────────────────────────

describe("TTS capability: implementation limitation", () => {
  let contract: any;
  beforeAll(() => {
    contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
  });

  it("tts capability documentation exists for limitation", () => {
    expect(contract.tts).toBeDefined();
    expect(contract.tts.notes).toContain("SolarSystem");
    expect(contract.tts.notes).toContain("implementation limitation");
  });
});

// ─── TTS contract semantics ─────────────────────────────────────────────────

describe("TTS capability: semantic rules", () => {
  it("resolveTtsRequest with empty productionId returns BLOCKED", () => {
    const result = resolveTtsRequest({ productionId: "" });
    expect(result.status).toBe("BLOCKED");
  });

  it("resolveTtsRequest with unsupported productionId returns BLOCKED", () => {
    const result = resolveTtsRequest({ productionId: "nonexistent" });
    expect(result.status).toBe("BLOCKED");
  });

  it("resolveTtsRequest with solarSystem returns SUCCESS with target", () => {
    const result = resolveTtsRequest({ productionId: "solarSystem" });
    expect(result.status).toBe("SUCCESS");
    expect(result.target).toBeDefined();
    expect(result.target!.productionId).toBe("solarSystem");
  });

  it("ttsCollision with existing artifact returns BLOCKED", () => {
    const target = TTS_TARGETS.solarSystem;
    const result = ttsCollision(target, true);
    expect(result.status).toBe("BLOCKED");
    expect(result.message).toContain("already exists");
  });

  it("ttsCollision with no artifact returns SUCCESS", () => {
    const target = TTS_TARGETS.solarSystem;
    const result = ttsCollision(target, false);
    expect(result.status).toBe("SUCCESS");
  });
});

// ─── Artifact verification semantics ────────────────────────────────────────

describe("Artifact verification: semantic rules", () => {
  it("verifyArtifactFacts with non-existent artifact returns BLOCKED", () => {
    const facts = { exists: false, size: 0, extension: ".mp4", readable: false };
    const result = verifyArtifactFacts("out/nonexistent.mp4", facts, false);
    expect(result.status).toBe("BLOCKED");
    expect(result.checks.some((c: any) => c.name === "exists" && !c.passed)).toBe(true);
  });

  it("verifyArtifactFacts with valid artifact returns SUCCESS", () => {
    const facts = { exists: true, size: 1024, extension: ".mp4", readable: true };
    const result = verifyArtifactFacts("out/video.mp4", facts, false);
    expect(result.status).toBe("SUCCESS");
    expect(result.checks.every((c: any) => c.available ? c.passed : true)).toBe(true);
  });

  it("verifyArtifactFacts with empty artifact returns FAILED", () => {
    const facts = { exists: true, size: 0, extension: ".mp4", readable: true };
    const result = verifyArtifactFacts("out/empty.mp4", facts, false);
    expect(result.status).toBe("FAILED");
    expect(result.checks.some((c: any) => c.name === "size" && !c.passed)).toBe(true);
  });

  it("verifyArtifactFacts with unsupported extension returns FAILED", () => {
    const facts = { exists: true, size: 1024, extension: ".txt", readable: true };
    const result = verifyArtifactFacts("out/document.txt", facts, false);
    expect(result.status).toBe("FAILED");
    expect(result.checks.some((c: any) => c.name === "container" && !c.passed)).toBe(true);
  });
});

// ─── Render contract semantics ──────────────────────────────────────────────

describe("Render capability: semantic rules", () => {
  it("validateRenderOutput rejects paths outside out/", () => {
    const result = validateRenderOutput("tmp/video.mp4");
    expect(result.status).toBe("BLOCKED");
    expect(result.message).toContain("must live within the artifact boundary");
  });

  it("validateRenderOutput accepts paths inside out/", () => {
    const result = validateRenderOutput("out/video.mp4");
    expect(result.status).toBe("SUCCESS");
  });

  it("validateRenderRequest rejects empty composition", () => {
    const result = validateRenderRequest({ composition: "", output: "out/video.mp4" });
    expect(result.status).toBe("BLOCKED");
    expect(result.message).toContain("composition must be a non-empty");
  });

  it("validateRenderRequest rejects empty output", () => {
    const result = validateRenderRequest({ composition: "MyComp", output: "" });
    expect(result.status).toBe("BLOCKED");
    expect(result.message).toContain("output must be a non-empty string");
  });

  it("renderCollision detects existing output file", () => {
    const result = renderCollision(true);
    expect(result.status).toBe("BLOCKED");
    expect(result.message).toContain("already exists");
  });

  it("renderCollision allows non-existing output file", () => {
    const result = renderCollision(false);
    expect(result.status).toBe("SUCCESS");
  });
});

// ─── TTS test fixture: solarSystem-contract-test ────────────────────────────

describe("TTS test fixture: solarSystem-contract-test", () => {
  it("test production identity exists in TTS_TARGETS", () => {
    expect(TTS_TARGETS["solarSystem-contract-test"]).toBeDefined();
  });

  it("test production resolves correctly", () => {
    const result = resolveTtsRequest({ productionId: "solarSystem-contract-test" });
    expect(result.status).toBe("SUCCESS");
    expect(result.target).toBeDefined();
    expect(result.target!.productionId).toBe("solarSystem-contract-test");
  });

  it("test artifact root is dedicated namespace", () => {
    const target = TTS_TARGETS["solarSystem-contract-test"];
    expect(target.artifactRoot).toBe("public/solarSystem-contract-test");
  });

  it("test sentinel is correct", () => {
    const target = TTS_TARGETS["solarSystem-contract-test"];
    expect(target.sentinel).toBe("public/solarSystem-contract-test/durations.json");
  });

  it("unsupported productionId is BLOCKED", () => {
    const result = resolveTtsRequest({ productionId: "nonexistent-production" });
    expect(result.status).toBe("BLOCKED");
  });

  it("fresh target has no collision", () => {
    const target = TTS_TARGETS["solarSystem-contract-test"];
    const result = ttsCollision(target, false);
    expect(result.status).toBe("SUCCESS");
  });

  it("existing sentinel returns BLOCKED", () => {
    const target = TTS_TARGETS["solarSystem-contract-test"];
    const result = ttsCollision(target, true);
    expect(result.status).toBe("BLOCKED");
    expect(result.message).toContain("already exists");
  });

  it("test namespace cannot escape project boundaries", () => {
    const target = TTS_TARGETS["solarSystem-contract-test"];
    expect(target.artifactRoot).not.toContain("..");
    expect(target.artifactRoot).not.toMatch(/^[a-zA-Z]:[\\/]/);
  });

  it("real SolarSystem target remains unchanged", () => {
    const target = TTS_TARGETS.solarSystem;
    expect(target.artifactRoot).toBe("public/solarSystem");
    expect(target.sentinel).toBe("public/solarSystem/durations.json");
  });

  it("contract contains no provider/script/path implementation leak", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    const ttsCapability = contract.capabilities.find((c: any) => c.name === "tts");
    expect(ttsCapability).toBeDefined();
    expect(JSON.stringify(ttsCapability)).not.toContain("python");
    expect(JSON.stringify(ttsCapability)).not.toContain("edge_tts");
    expect(JSON.stringify(ttsCapability)).not.toContain("gen_tts");
    expect(JSON.stringify(ttsCapability)).not.toContain("vi-VN");
  });
});

// ─── Contract capability surface stability ──────────────────────────────────

describe("Contract capability surface: stability", () => {
  it("public capability surface remains exactly five", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    expect(contract.capabilities).toHaveLength(5);
    const names = contract.capabilities.map((c: any) => c.name);
    expect(names).toEqual(["inspect", "preflight", "tts", "render", "verify"]);
  });

  it("test production has test flag in contract", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    expect(contract.productions["solarSystem-contract-test"]).toBeDefined();
    expect(contract.productions["solarSystem-contract-test"].test).toBe(true);
  });

  it("test production uses SolarSystem composition", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    expect(contract.productions["solarSystem-contract-test"].composition).toBe("SolarSystem");
  });

  it("test production output is within artifact boundary", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    const output = contract.productions["solarSystem-contract-test"].output;
    expect(output).toMatch(/^out\//);
  });
});
