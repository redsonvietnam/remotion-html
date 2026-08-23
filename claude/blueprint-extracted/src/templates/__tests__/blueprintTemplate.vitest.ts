import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "../..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(srcDir, relPath), "utf-8");
}

describe("Template: Blueprint scene registry", () => {
  it("renderScene has exhaustive switch on content.kind", () => {
    const content = readFile("templates/blueprint/scenes/index.tsx");
    expect(content).toMatch(/case\s+"title"/);
    expect(content).toMatch(/case\s+"pillars"/);
    expect(content).toMatch(/case\s+"measure"/);
    expect(content).toMatch(/case\s+"detail"/);
    expect(content).toMatch(/case\s+"process"/);
    expect(content).toMatch(/case\s+"seal"/);
  });

  it("renderScene has exhaustive check (never)", () => {
    const content = readFile("templates/blueprint/scenes/index.tsx");
    expect(content).toMatch(/never/);
  });

  it("renderScene throws on unknown kind", () => {
    const content = readFile("templates/blueprint/scenes/index.tsx");
    expect(content).toMatch(/throw new Error/);
  });
});

describe("Template: Blueprint content schema", () => {
  it("BlueprintSceneContent is a discriminated union on 'kind'", () => {
    const content = readFile("data/luatBHXH.ts");
    expect(content).toMatch(/type BlueprintSceneContent\s*=/);
    const unionMatch = content.match(/type BlueprintSceneContent\s*=\s*([\s\S]*?);/);
    expect(unionMatch).not.toBeNull();
    const union = unionMatch![1];
    expect(union).toContain("BlueprintTitleContent");
    expect(union).toContain("BlueprintPillarsContent");
    expect(union).toContain("BlueprintMeasureContent");
    expect(union).toContain("BlueprintDetailContent");
    expect(union).toContain("BlueprintProcessContent");
    expect(union).toContain("BlueprintSealContent");
  });

  it("each content interface has kind literal", () => {
    const content = readFile("data/luatBHXH.ts");
    expect(content).toMatch(/kind:\s*"title"/);
    expect(content).toMatch(/kind:\s*"pillars"/);
    expect(content).toMatch(/kind:\s*"measure"/);
    expect(content).toMatch(/kind:\s*"detail"/);
    expect(content).toMatch(/kind:\s*"process"/);
    expect(content).toMatch(/kind:\s*"seal"/);
  });
});

describe("Template: Blueprint theme contract", () => {
  it("blueprint theme uses createTheme()", () => {
    const content = readFile("theme/blueprint.ts");
    expect(content).toMatch(/createTheme/);
  });

  it("blueprint theme defines accent1, accent2, accent3", () => {
    const content = readFile("theme/blueprint.ts");
    expect(content).toMatch(/accent1:/);
    expect(content).toMatch(/accent2:/);
    expect(content).toMatch(/accent3:/);
  });

  it("blueprint theme defines bg, ink, muted", () => {
    const content = readFile("theme/blueprint.ts");
    expect(content).toMatch(/bg:/);
    expect(content).toMatch(/ink:/);
    expect(content).toMatch(/muted:/);
  });
});

describe("Template: Blueprint template entry", () => {
  it("BlueprintTemplate uses TransitionSeries", () => {
    const content = readFile("templates/blueprint/index.tsx");
    expect(content).toMatch(/TransitionSeries/);
  });

  it("BlueprintTemplate maps over scenes", () => {
    const content = readFile("templates/blueprint/index.tsx");
    expect(content).toMatch(/scenes/);
  });

  it("BlueprintTemplate calls renderScene", () => {
    const content = readFile("templates/blueprint/index.tsx");
    expect(content).toMatch(/renderScene/);
  });
});

describe("Template: Blueprint does not depend on other templates", () => {
  const files = [
    "templates/blueprint/index.tsx",
    "templates/blueprint/helpers.tsx",
    "templates/blueprint/scenes/index.tsx",
    "templates/blueprint/scenes/TitleScene.tsx",
    "templates/blueprint/scenes/PillarsScene.tsx",
    "templates/blueprint/scenes/MeasureScene.tsx",
    "templates/blueprint/scenes/DetailScene.tsx",
    "templates/blueprint/scenes/ProcessScene.tsx",
    "templates/blueprint/scenes/SealScene.tsx",
    "templates/blueprint/svg/index.ts",
  ];

  for (const f of files) {
    it(`${f} does not import templates/nq57 or templates/stoicLove`, () => {
      const content = readFile(f);
      expect(content).not.toMatch(/templates\/nq57/);
      expect(content).not.toMatch(/templates\/stoicLove/);
    });
  }
});
