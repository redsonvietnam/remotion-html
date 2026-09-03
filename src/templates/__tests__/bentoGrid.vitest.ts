import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "../..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(srcDir, relPath), "utf-8");
}

describe("Template: Bento Grid scene registry", () => {
  it("renderScene has exhaustive switch on content.kind", () => {
    const content = readFile("templates/bento-grid/scenes/index.tsx");
    expect(content).toMatch(/case\s+"hook"/);
    expect(content).toMatch(/case\s+"bento"/);
    expect(content).toMatch(/case\s+"outro"/);
  });

  it("renderScene has exhaustive check (never)", () => {
    const content = readFile("templates/bento-grid/scenes/index.tsx");
    expect(content).toMatch(/never/);
  });

  it("renderScene throws on unknown kind", () => {
    const content = readFile("templates/bento-grid/scenes/index.tsx");
    expect(content).toMatch(/throw new Error/);
  });
});

describe("Template: Bento Grid content schema", () => {
  it("BentoGridSceneContent is a discriminated union on 'kind'", () => {
    const content = readFile("data/bentoGrid.ts");
    expect(content).toMatch(/type BentoGridSceneContent\s*=/);
    const unionMatch = content.match(/type BentoGridSceneContent\s*=\s*([\s\S]*?);/);
    expect(unionMatch).not.toBeNull();
    const union = unionMatch![1];
    expect(union).toContain("BentoGridHookContent");
    expect(union).toContain("BentoGridBentoContent");
    expect(union).toContain("BentoGridOutroContent");
  });

  it("each content interface has kind literal", () => {
    const content = readFile("data/bentoGrid.ts");
    expect(content).toMatch(/kind:\s*"hook"/);
    expect(content).toMatch(/kind:\s*"bento"/);
    expect(content).toMatch(/kind:\s*"outro"/);
  });
});

describe("Template: Bento Grid theme contract", () => {
  it("bentoGrid theme uses createTheme()", () => {
    const content = readFile("theme/bentoGrid.ts");
    expect(content).toMatch(/createTheme/);
  });

  it("bentoGrid theme defines accent1, accent2, accent3", () => {
    const content = readFile("theme/bentoGrid.ts");
    expect(content).toMatch(/accent1:/);
    expect(content).toMatch(/accent2:/);
    expect(content).toMatch(/accent3:/);
  });

  it("bentoGrid theme defines bg, ink, muted", () => {
    const content = readFile("theme/bentoGrid.ts");
    expect(content).toMatch(/bg:/);
    expect(content).toMatch(/ink:/);
    expect(content).toMatch(/muted:/);
  });

  it("bentoGrid theme exports auroraBlobs", () => {
    const content = readFile("theme/bentoGrid.ts");
    expect(content).toMatch(/auroraBlobs/);
    expect(content).toMatch(/export const bentoGridTheme/);
  });
});

describe("Template: Bento Grid template entry", () => {
  it("BentoGridTemplate uses TransitionSeries", () => {
    const content = readFile("templates/bento-grid/index.tsx");
    expect(content).toMatch(/TransitionSeries/);
  });

  it("BentoGridTemplate maps over scenes", () => {
    const content = readFile("templates/bento-grid/index.tsx");
    expect(content).toMatch(/scenes\.forEach/);
  });

  it("BentoGridTemplate calls renderScene", () => {
    const content = readFile("templates/bento-grid/index.tsx");
    expect(content).toMatch(/renderScene/);
  });

  it("BentoGridTemplate wraps with ThemeProvider", () => {
    const content = readFile("templates/bento-grid/index.tsx");
    expect(content).toMatch(/ThemeProvider/);
  });
});

describe("Template: Bento Grid demo data", () => {
  it("bentoGrid.ts has BENTO_GRID_SCENES", () => {
    const content = readFile("data/bentoGrid.ts");
    expect(content).toMatch(/export const BENTO_GRID_SCENES/);
  });

  it("bentoGrid.ts has BENTO_GRID_CONTENT", () => {
    const content = readFile("data/bentoGrid.ts");
    expect(content).toMatch(/export const BENTO_GRID_CONTENT/);
  });

  it("bentoGrid.ts has all 3 scene kinds (hook, bento, outro)", () => {
    const content = readFile("data/bentoGrid.ts");
    expect(content).toMatch(/kind:\s*"hook"/);
    expect(content).toMatch(/kind:\s*"bento"/);
    expect(content).toMatch(/kind:\s*"outro"/);
  });
});

describe("Template: Bento Grid helpers", () => {
  it("helpers.tsx exports interpolate", () => {
    const content = readFile("templates/bento-grid/helpers.tsx");
    expect(content).toMatch(/export const interpolate/);
  });

  it("helpers.tsx exports easeOutCubic", () => {
    const content = readFile("templates/bento-grid/helpers.tsx");
    expect(content).toMatch(/export const easeOutCubic/);
  });

  it("helpers.tsx exports easeOutExpo", () => {
    const content = readFile("templates/bento-grid/helpers.tsx");
    expect(content).toMatch(/export const easeOutExpo/);
  });

  it("helpers.tsx exports easeOutBack", () => {
    const content = readFile("templates/bento-grid/helpers.tsx");
    expect(content).toMatch(/export const easeOutBack/);
  });

  it("helpers.tsx exports sceneOpacity", () => {
    const content = readFile("templates/bento-grid/helpers.tsx");
    expect(content).toMatch(/export const sceneOpacity/);
  });

  it("helpers.tsx exports AuroraBackground", () => {
    const content = readFile("templates/bento-grid/helpers.tsx");
    expect(content).toMatch(/export const AuroraBackground/);
  });

  it("helpers.tsx exports NoiseOverlay", () => {
    const content = readFile("templates/bento-grid/helpers.tsx");
    expect(content).toMatch(/export const NoiseOverlay/);
  });

  it("helpers.tsx exports MiniChart", () => {
    const content = readFile("templates/bento-grid/helpers.tsx");
    expect(content).toMatch(/export const MiniChart/);
  });
});

describe("Template: Bento Grid scene components", () => {
  it("HookScene uses useTheme", () => {
    const content = readFile("templates/bento-grid/scenes/HookScene.tsx");
    expect(content).toMatch(/useTheme/);
  });

  it("HookScene exports HookSceneData", () => {
    const content = readFile("templates/bento-grid/scenes/HookScene.tsx");
    expect(content).toMatch(/export const HookSceneData/);
  });

  it("BentoScene uses useTheme", () => {
    const content = readFile("templates/bento-grid/scenes/BentoScene.tsx");
    expect(content).toMatch(/useTheme/);
  });

  it("BentoScene exports BentoSceneData", () => {
    const content = readFile("templates/bento-grid/scenes/BentoScene.tsx");
    expect(content).toMatch(/export const BentoSceneData/);
  });

  it("BentoScene uses CSS Grid", () => {
    const content = readFile("templates/bento-grid/scenes/BentoScene.tsx");
    expect(content).toMatch(/gridTemplateColumns/);
  });

  it("BentoScene uses MiniChart", () => {
    const content = readFile("templates/bento-grid/scenes/BentoScene.tsx");
    expect(content).toMatch(/MiniChart/);
  });

  it("OutroScene uses useTheme", () => {
    const content = readFile("templates/bento-grid/scenes/OutroScene.tsx");
    expect(content).toMatch(/useTheme/);
  });

  it("OutroScene exports OutroSceneData", () => {
    const content = readFile("templates/bento-grid/scenes/OutroScene.tsx");
    expect(content).toMatch(/export const OutroSceneData/);
  });
});

describe("Template: Bento Grid Remotion bridge", () => {
  it("RemotionScenes uses useCurrentFrame", () => {
    const content = readFile("templates/bento-grid/scenes/RemotionScenes.tsx");
    expect(content).toMatch(/useCurrentFrame/);
  });

  it("RemotionScenes uses useVideoConfig", () => {
    const content = readFile("templates/bento-grid/scenes/RemotionScenes.tsx");
    expect(content).toMatch(/useVideoConfig/);
  });

  it("RemotionScenes wraps HookScene, BentoScene, OutroScene", () => {
    const content = readFile("templates/bento-grid/scenes/RemotionScenes.tsx");
    expect(content).toMatch(/withRemotion\(HookSceneData\)/);
    expect(content).toMatch(/withRemotion\(BentoSceneData\)/);
    expect(content).toMatch(/withRemotion\(OutroSceneData\)/);
  });
});

describe("Template: Bento Grid types", () => {
  it("types.ts re-exports content types", () => {
    const content = readFile("templates/bento-grid/types.ts");
    expect(content).toMatch(/export type/);
    expect(content).toMatch(/BentoGridHookContent/);
    expect(content).toMatch(/BentoGridBentoContent/);
    expect(content).toMatch(/BentoGridOutroContent/);
  });
});
