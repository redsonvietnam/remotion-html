import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "../../..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(srcDir, relPath), "utf-8");
}

describe("Template: Kinetic Statement scene registry", () => {
  it("renderScene has exhaustive switch on content.kind", () => {
    const content = readFile("templates/kinetic-statement/scenes/index.tsx");
    expect(content).toMatch(/case\s+"hook"/);
    expect(content).toMatch(/case\s+"stat"/);
    expect(content).toMatch(/case\s+"quote"/);
    expect(content).toMatch(/case\s+"outro"/);
  });

  it("renderScene has exhaustive check (never)", () => {
    const content = readFile("templates/kinetic-statement/scenes/index.tsx");
    expect(content).toMatch(/never/);
  });

  it("renderScene throws on unknown kind", () => {
    const content = readFile("templates/kinetic-statement/scenes/index.tsx");
    expect(content).toMatch(/throw new Error/);
  });
});

describe("Template: Kinetic Statement content schema", () => {
  it("KineticSceneContent is a discriminated union on 'kind'", () => {
    const content = readFile("data/kineticStatement.ts");
    expect(content).toMatch(/type KineticSceneContent\s*=/);
    const unionMatch = content.match(/type KineticSceneContent\s*=\s*([\s\S]*?);/);
    expect(unionMatch).not.toBeNull();
    const union = unionMatch![1];
    expect(union).toContain("KineticHookContent");
    expect(union).toContain("KineticStatContent");
    expect(union).toContain("KineticQuoteContent");
    expect(union).toContain("KineticOutroContent");
  });

  it("each content interface has kind literal", () => {
    const content = readFile("data/kineticStatement.ts");
    expect(content).toMatch(/kind:\s*"hook"/);
    expect(content).toMatch(/kind:\s*"stat"/);
    expect(content).toMatch(/kind:\s*"quote"/);
    expect(content).toMatch(/kind:\s*"outro"/);
  });
});

describe("Template: Kinetic Statement theme contract", () => {
  it("kineticStatement theme uses createTheme()", () => {
    const content = readFile("templates/kinetic-statement/theme.ts");
    expect(content).toMatch(/createTheme/);
  });

  it("kineticStatement theme defines accent1, accent2, accent3", () => {
    const content = readFile("templates/kinetic-statement/theme.ts");
    expect(content).toMatch(/accent1:/);
    expect(content).toMatch(/accent2:/);
    expect(content).toMatch(/accent3:/);
  });

  it("kineticStatement theme defines bg, ink, muted", () => {
    const content = readFile("templates/kinetic-statement/theme.ts");
    expect(content).toMatch(/bg:/);
    expect(content).toMatch(/ink:/);
    expect(content).toMatch(/muted:/);
  });
});

describe("Template: Kinetic Statement template entry", () => {
  it("KineticStatementTemplate uses TransitionSeries", () => {
    const content = readFile("templates/kinetic-statement/index.tsx");
    expect(content).toMatch(/TransitionSeries/);
  });

  it("KineticStatementTemplate maps over scenes", () => {
    const content = readFile("templates/kinetic-statement/index.tsx");
    expect(content).toMatch(/scenes\.forEach/);
  });

  it("KineticStatementTemplate calls renderScene", () => {
    const content = readFile("templates/kinetic-statement/index.tsx");
    expect(content).toMatch(/renderScene/);
  });
});

describe("Template: Kinetic Statement data contract in contract.ts", () => {
  it("TEMPLATE_SCHEMAS has kineticStatement entry", () => {
    const content = readFile("data/contract.ts");
    expect(content).toMatch(/kineticStatement:\s*\{/);
  });

  it("kineticStatement schema has all 4 scene kinds", () => {
    const content = readFile("data/contract.ts");
    const ksMatch = content.match(/kineticStatement:\s*\{[^}]*allowedKinds:\s*\[([^\]]+)\]/);
    expect(ksMatch).not.toBeNull();
    const kinds = ksMatch![1];
    expect(kinds).toContain("hook");
    expect(kinds).toContain("stat");
    expect(kinds).toContain("quote");
    expect(kinds).toContain("outro");
  });
});

describe("Template: Kinetic Statement demo data", () => {
  it("kineticStatement.ts has KINETIC_SCENES", () => {
    const content = readFile("data/kineticStatement.ts");
    expect(content).toMatch(/export const KINETIC_SCENES/);
  });

  it("kineticStatement.ts has KINETIC_CONTENT", () => {
    const content = readFile("data/kineticStatement.ts");
    expect(content).toMatch(/export const KINETIC_CONTENT/);
  });

  it("kineticStatement.ts has all 4 scene kinds", () => {
    const content = readFile("data/kineticStatement.ts");
    expect(content).toMatch(/kind:\s*"hook"/);
    expect(content).toMatch(/kind:\s*"stat"/);
    expect(content).toMatch(/kind:\s*"quote"/);
    expect(content).toMatch(/kind:\s*"outro"/);
  });
});

describe("Template: Kinetic Statement helpers", () => {
  it("helpers.tsx exports interpolation functions", () => {
    const content = readFile("templates/kinetic-statement/helpers.tsx");
    expect(content).toMatch(/export const interpolate/);
    expect(content).toMatch(/export const easeOutCubic/);
    expect(content).toMatch(/export const easeOutBack/);
    expect(content).toMatch(/export const sceneOpacity/);
  });

  it("helpers.tsx has no Remotion imports", () => {
    const content = readFile("templates/kinetic-statement/helpers.tsx");
    expect(content).not.toMatch(/from "remotion"/);
  });
});

describe("Template: Kinetic Statement Root.tsx registration", () => {
  it("Root.tsx imports KineticStatementTemplate", () => {
    const content = readFile("Root.tsx");
    expect(content).toMatch(/import.*KineticStatementTemplate.*from.*templates\/kinetic-statement/);
  });

  it("Root.tsx imports kinetic data", () => {
    const content = readFile("Root.tsx");
    expect(content).toMatch(/import.*KINETIC_SCENES.*from.*data\/kineticStatement/);
  });

  it("Root.tsx registers KineticStatement composition", () => {
    const content = readFile("Root.tsx");
    expect(content).toMatch(/id="KineticStatement"/);
  });
});

describe("Template: Kinetic Statement RemotionScenes hook boundary", () => {
  it("RemotionScenes.tsx imports useCurrentFrame and useVideoConfig", () => {
    const content = readFile("templates/kinetic-statement/scenes/RemotionScenes.tsx");
    expect(content).toMatch(/import.*useCurrentFrame.*from "remotion"/);
    expect(content).toMatch(/import.*useVideoConfig.*from "remotion"/);
  });

  it("RemotionScenes.tsx uses withRemotion HOC pattern", () => {
    const content = readFile("templates/kinetic-statement/scenes/RemotionScenes.tsx");
    expect(content).toMatch(/function withRemotion/);
  });

  it("scene components do NOT import Remotion hooks", () => {
    for (const scene of ["HookScene.tsx", "StatScene.tsx", "QuoteScene.tsx", "OutroScene.tsx"]) {
      const content = readFile(`templates/kinetic-statement/scenes/${scene}`);
      expect(content).not.toMatch(/useCurrentFrame|useVideoConfig/);
    }
  });
});

describe("Template: Kinetic Statement export registration", () => {
  it("export.mjs has kineticStatement in TEMPLATE_MODULES", () => {
    const content = readFile("../scripts/export.mjs");
    expect(content).toMatch(/kineticStatement:\s*"\.\/templates\/kinetic-statement"/);
  });

  it("export.mjs has kineticStatement in THEME_DEFAULTS", () => {
    const content = readFile("../scripts/export.mjs");
    expect(content).toMatch(/kineticStatement:\s*\{/);
    expect(content).toMatch(/name:\s*"kineticStatement"/);
  });

  it("export.mjs has kineticStatement caption field map", () => {
    const content = readFile("../scripts/export.mjs");
    expect(content).toMatch(/kineticStatement:\s*\{[^}]*hook/);
  });

  it("export.mjs has kineticStatement component import", () => {
    const content = readFile("../scripts/export.mjs");
    expect(content).toMatch(/kineticStatement.*KineticStatementTemplate/);
  });
});
