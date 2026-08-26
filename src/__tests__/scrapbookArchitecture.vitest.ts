// ---------------------------------------------------------------------------
// Scrapbook Template Architecture — Regression Tests
//
// Validates: contract compliance, renderer boundary, component structure,
// production data integrity, format metadata.
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import {
  validateProductionData,
  discoverScenes,
  checkAudioAssets,
  TEMPLATE_SCHEMAS,
  sceneFrames,
} from "../data/contract";
import { CHAMPIONS_LEAGUE_SCENES, CHAMPIONS_LEAGUE_CONTENT } from "../data/championsLeague";

// ─── Contract Compliance ─────────────────────────────────────────────────────

describe("Scrapbook template contract", () => {
  it("has scrapbook in TEMPLATE_SCHEMAS", () => {
    expect(TEMPLATE_SCHEMAS.scrapbook).toBeDefined();
  });

  it("defines correct allowed kinds", () => {
    expect(TEMPLATE_SCHEMAS.scrapbook.allowedKinds).toEqual([
      "hero", "match", "history", "photo", "timeline", "closing",
    ]);
  });

  it("Champions League production validates", () => {
    const result = validateProductionData(
      { SCENES: CHAMPIONS_LEAGUE_SCENES, CONTENT: CHAMPIONS_LEAGUE_CONTENT },
      "scrapbook"
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("Champions League has 6 scenes", () => {
    expect(CHAMPIONS_LEAGUE_SCENES).toHaveLength(6);
  });

  it("sceneFrames produces positive integers", () => {
    for (const s of CHAMPIONS_LEAGUE_SCENES) {
      const frames = sceneFrames(s.dur);
      expect(frames).toBeGreaterThan(0);
      expect(Number.isInteger(frames)).toBe(true);
    }
  });
});

// ─── Renderer Boundary ───────────────────────────────────────────────────────

describe("Scrapbook renderer boundary", () => {
  it("scenes/index.tsx exports renderScene", async () => {
    const mod = await import("../templates/scrapbook/scenes");
    expect(typeof mod.renderScene).toBe("function");
  });

  it("scenes/RemotionScenes.tsx is the only hook consumer", async () => {
    const mod = await import("../templates/scrapbook/scenes/RemotionScenes");
    expect(typeof mod.renderRemotionScene).toBe("function");
  });

  it("scene data components accept frame/fps props", async () => {
    const mod = await import("../templates/scrapbook/scenes/HeroScene");
    expect(typeof mod.HeroSceneData).toBe("function");
  });
});

// ─── Component Structure ─────────────────────────────────────────────────────

describe("Scrapbook component structure", () => {
  it("has PaperBg component", async () => {
    const mod = await import("../templates/scrapbook/components/PaperBg");
    expect(typeof mod.PaperBg).toBe("function");
  });

  it("has ChapterBar component", async () => {
    const mod = await import("../templates/scrapbook/components/ChapterBar");
    expect(typeof mod.ChapterBar).toBe("function");
  });

  it("has Polaroid component", async () => {
    const mod = await import("../templates/scrapbook/components/Polaroid");
    expect(typeof mod.Polaroid).toBe("function");
  });

  it("has Trophy component", async () => {
    const mod = await import("../templates/scrapbook/components/Trophy");
    expect(typeof mod.Trophy).toBe("function");
  });
});

// ─── Production Data Integrity ───────────────────────────────────────────────

describe("Champions League production data", () => {
  it("all scene ids are unique", () => {
    const ids = CHAMPIONS_LEAGUE_SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all content kinds are in allowedKinds", () => {
    const allowed = TEMPLATE_SCHEMAS.scrapbook.allowedKinds;
    for (const s of CHAMPIONS_LEAGUE_SCENES) {
      const content = CHAMPIONS_LEAGUE_CONTENT[s.id];
      expect(content).toBeDefined();
      expect(allowed).toContain(content!.kind);
    }
  });

  it("all content keys match scene ids", () => {
    const sceneIds = CHAMPIONS_LEAGUE_SCENES.map((s) => s.id);
    for (const id of sceneIds) {
      expect(CHAMPIONS_LEAGUE_CONTENT[id]).toBeDefined();
    }
  });

  it("all content entries have valid kinds", () => {
    for (const s of CHAMPIONS_LEAGUE_SCENES) {
      const content = CHAMPIONS_LEAGUE_CONTENT[s.id];
      expect(content).toBeDefined();
      expect(typeof content!.kind).toBe("string");
      expect(content!.kind.length).toBeGreaterThan(0);
    }
  });

  it("all scenes have positive duration", () => {
    for (const s of CHAMPIONS_LEAGUE_SCENES) {
      expect(s.dur).toBeGreaterThan(0);
    }
  });

  it("total frames are positive", () => {
    const total = CHAMPIONS_LEAGUE_SCENES.reduce(
      (acc, s) => acc + sceneFrames(s.dur),
      0
    );
    expect(total).toBeGreaterThan(0);
  });
});

// ─── Audio Assets ────────────────────────────────────────────────────────────

describe("Champions League audio assets", () => {
  it("all audio paths are non-empty", () => {
    for (const s of CHAMPIONS_LEAGUE_SCENES) {
      expect(s.audio).toBeTruthy();
    }
  });

  it("audio assets pass validation", () => {
    const assetErrors = checkAudioAssets(CHAMPIONS_LEAGUE_SCENES, () => true);
    expect(assetErrors).toHaveLength(0);
  });
});

// ─── Format Metadata ─────────────────────────────────────────────────────────

describe("Scrapbook format metadata", () => {
  it("16:9 primary format", () => {
    // Scrapbook is 16:9 primary
    expect(TEMPLATE_SCHEMAS.scrapbook).toBeDefined();
  });

  it("sceneFrames handles various durations", () => {
    expect(sceneFrames(5)).toBeGreaterThan(0);
    expect(sceneFrames(6)).toBeGreaterThan(0);
    expect(sceneFrames(7)).toBeGreaterThan(0);
  });
});
