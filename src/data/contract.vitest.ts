import { describe, it, expect } from "vitest";
import * as nq57 from "./nq57";
import * as deAn06 from "./deAn06";
import * as nghiQuyet79 from "./nghiQuyet79";
import * as stoicLove from "./stoicLove";
import { validateProductionData, validateStoryboard, checkAudioAssets, TEMPLATE_SCHEMAS } from "./contract";

const baseScene = { id: "s1", audio: "x/s1.mp3", caption: "narration", dur: 5 };

describe("existing productions validate", () => {
  it("nq57", () => {
    const r = validateProductionData(nq57 as any, "nq57");
    expect(r.valid).toBe(true);
  });
  it("dean06", () => {
    const r = validateProductionData(deAn06 as any, "dean06");
    expect(r.valid).toBe(true);
  });
  it("nq79", () => {
    const r = validateProductionData(nghiQuyet79 as any, "nq79");
    expect(r.valid).toBe(true);
  });
  it("stoiclove", () => {
    const r = validateProductionData(stoicLove as any, "stoiclove");
    expect(r.valid).toBe(true);
  });
});

describe("invalid production data is rejected", () => {
  it("missing scene content (scene-count mismatch)", () => {
    const mod = { SCENES: [baseScene], CONTENT: { s2: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.code === "MISSING_SCENE_CONTENT")).toBe(true);
  });

  it("invalid scene kind", () => {
    const mod = { SCENES: [baseScene], CONTENT: { s1: { kind: "bogus" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "INVALID_SCENE_KIND")).toBe(true);
  });

  it("unsupported template/content combination", () => {
    const mod = { SCENES: [baseScene], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "stoiclove");
    expect(r.errors.some((e) => e.code === "INVALID_SCENE_KIND")).toBe(true);
  });

  it("missing narration", () => {
    const mod = { SCENES: [{ ...baseScene, caption: "" }], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "MISSING_NARRATION")).toBe(true);
  });

  it("invalid duration", () => {
    const mod = { SCENES: [{ ...baseScene, dur: 0 }], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "INVALID_DURATION")).toBe(true);
  });

  it("invalid audio path", () => {
    const mod = { SCENES: [{ ...baseScene, audio: "" }], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "INVALID_AUDIO_PATH")).toBe(true);
  });

  it("orphan content (scene-count mismatch)", () => {
    const mod = {
      SCENES: [baseScene],
      CONTENT: { s1: { kind: "quote", text: "x" }, s2: { kind: "quote", text: "y" } },
    };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "ORPHAN_CONTENT")).toBe(true);
  });

  it("missing required text field", () => {
    const mod = { SCENES: [baseScene], CONTENT: { s1: { kind: "quote" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "MISSING_TEXT")).toBe(true);
  });
});

describe("storyboard contract", () => {
  const valid = {
    project: "demo",
    topic: "Demo topic",
    platform: "youtube",
    aspectRatio: "16:9",
    template: "nq57",
    scenes: [
      {
        id: "s1",
        kind: "title",
        purpose: "Introduce",
        narration: "X",
        onScreenText: "Y",
        visualConcept: "Z",
        factualClaims: [{ claim: "A", source: "official.gov", verified: true }],
      },
    ],
  };

  it("valid storyboard passes", () => {
    expect(validateStoryboard(valid).valid).toBe(true);
  });

  it("unverified claim is rejected", () => {
    const sb = JSON.parse(JSON.stringify(valid));
    sb.scenes[0].factualClaims[0].verified = false;
    const r = validateStoryboard(sb);
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.code === "UNVERIFIED_CLAIM")).toBe(true);
  });

  it("missing source is rejected", () => {
    const sb = JSON.parse(JSON.stringify(valid));
    sb.scenes[0].factualClaims[0].source = "";
    const r = validateStoryboard(sb);
    expect(r.errors.some((e) => e.code === "MISSING_SOURCE")).toBe(true);
  });
});

describe("WS36 real audio asset validation", () => {
  it("rejects absolute audio path", () => {
    const mod = { SCENES: [{ id: "s1", audio: "C:/x/s1.mp3", caption: "c", dur: 5 }], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "INVALID_AUDIO_PATH" && /absolute/i.test(e.message))).toBe(true);
  });

  it("rejects traversal audio path", () => {
    const mod = { SCENES: [{ id: "s1", audio: "../secret/s1.mp3", caption: "c", dur: 5 }], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "INVALID_AUDIO_PATH" && /traversal/i.test(e.message))).toBe(true);
  });

  it("reports missing audio file via checkAudioAssets", () => {
    const scenes = [{ id: "s1", audio: "nq57/s1.mp3", caption: "c", dur: 5 }] as any;
    const errs = checkAudioAssets(scenes, () => false);
    expect(errs.some((e) => e.code === "INVALID_AUDIO_ASSET")).toBe(true);
  });

  it("passes checkAudioAssets when file exists", () => {
    const scenes = [{ id: "s1", audio: "nq57/s1.mp3", caption: "c", dur: 5 }] as any;
    expect(checkAudioAssets(scenes, () => true).length).toBe(0);
  });
});

describe("WS36 storyboard ↔ template validation", () => {
  const base = {
    project: "demo",
    topic: "Demo topic",
    platform: "youtube" as const,
    aspectRatio: "16:9" as const,
    template: "nq57",
    scenes: [
      {
        id: "s1",
        kind: "title",
        purpose: "Introduce",
        narration: "X",
        onScreenText: "Y",
        visualConcept: "Z",
        factualClaims: [{ claim: "A", source: "official.gov", verified: true }],
      },
    ],
  };

  it("unknown template → error", () => {
    const sb = { ...base, template: "bogus" };
    expect(validateStoryboard(sb).errors.some((e) => e.code === "INVALID_TEMPLATE")).toBe(true);
  });

  it("unsupported scene kind → error", () => {
    const sb = { ...base, scenes: [{ ...base.scenes[0], kind: "hook" }] };
    expect(validateStoryboard(sb).errors.some((e) => e.code === "INVALID_SCENE_KIND")).toBe(true);
  });

  it("valid storyboard for nq57", () => {
    expect(validateStoryboard(base).valid).toBe(true);
  });

  it("valid storyboard for stoiclove", () => {
    const sb = { ...base, template: "stoiclove", scenes: [{ ...base.scenes[0], kind: "hook" }] };
    expect(validateStoryboard(sb).valid).toBe(true);
  });
});

describe("template schemas", () => {
  it("covers all four templates", () => {
    for (const t of ["nq57", "dean06", "nq79", "stoiclove"]) {
      expect(TEMPLATE_SCHEMAS[t]).toBeDefined();
    }
  });
});
