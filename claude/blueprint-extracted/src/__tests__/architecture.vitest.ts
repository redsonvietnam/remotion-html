import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(srcDir, relPath), "utf-8");
}

function getImports(filePath: string): string[] {
  const content = readFile(filePath);
  const imports: string[] = [];
  const importRegex = /import\s+(?:.*?\s+from\s+)?["']([^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

describe("Architecture: design must not import templates", () => {
  const designModules = [
    "design/typography/index.ts",
    "design/svg/index.ts",
    "design/layout/index.ts",
    "design/motion/index.ts",
    "design/transition/index.ts",
    "design/theme/index.ts",
  ];

  for (const mod of designModules) {
    it(`${mod} does not import from templates/`, () => {
      const imports = getImports(mod);
      for (const imp of imports) {
        expect(imp).not.toMatch(/templates/);
      }
    });
  }
});

describe("Architecture: design must not import NQ57 theme/data", () => {
  const designModules = [
    "design/typography/index.ts",
    "design/svg/index.ts",
    "design/layout/index.ts",
    "design/motion/index.ts",
    "design/transition/index.ts",
    "design/theme/index.ts",
  ];

  for (const mod of designModules) {
    it(`${mod} does not import NQ57 theme/data`, () => {
      const imports = getImports(mod);
      for (const imp of imports) {
        expect(imp).not.toMatch(/theme\/nq57/);
        expect(imp).not.toMatch(/data\/nq57/);
      }
    });
  }
});

describe("Architecture: components must not import NQ57 theme", () => {
  const componentFiles = [
    "components/SectionLabel.tsx",
    "components/GradientText.tsx",
    "components/CardBlock.tsx",
  ];

  for (const comp of componentFiles) {
    it(`${comp} does not import NQ57 theme`, () => {
      const imports = getImports(comp);
      for (const imp of imports) {
        expect(imp).not.toMatch(/theme\/nq57/);
      }
    });
  }
});

describe("Architecture: template scenes must not import compositions", () => {
  const sceneFiles = [
    "templates/nq57/scenes/TitleScene.tsx",
    "templates/nq57/scenes/QuoteScene.tsx",
    "templates/nq57/scenes/RolesScene.tsx",
    "templates/nq57/scenes/PillarsScene.tsx",
    "templates/nq57/scenes/StatsScene.tsx",
    "templates/nq57/scenes/VisionScene.tsx",
    "templates/nq57/scenes/EndScene.tsx",
  ];

  for (const scene of sceneFiles) {
    it(`${scene} does not import compositions`, () => {
      const imports = getImports(scene);
      for (const imp of imports) {
        expect(imp).not.toMatch(/compositions/);
      }
    });
  }
});

describe("Architecture: components require semantic colors", () => {
  it("SectionLabel type requires color prop", () => {
    const content = readFile("components/types.ts");
    // SectionLabelProps should have "color: string" (required, not optional)
    expect(content).toMatch(/SectionLabelProps[\s\S]*?color:\s*string/);
  });

  it("GradientText type requires colorFrom and colorTo", () => {
    const content = readFile("components/types.ts");
    expect(content).toMatch(/GradientTextProps[\s\S]*?colorFrom:\s*string/);
    expect(content).toMatch(/GradientTextProps[\s\S]*?colorTo:\s*string/);
  });

  it("CardBlock type requires accent, background, borderColor, text, muted", () => {
    const content = readFile("components/types.ts");
    expect(content).toMatch(/CardBlockProps[\s\S]*?accent:\s*string/);
    expect(content).toMatch(/CardBlockProps[\s\S]*?background:\s*string/);
    expect(content).toMatch(/CardBlockProps[\s\S]*?borderColor:\s*string/);
    expect(content).toMatch(/CardBlockProps[\s\S]*?text:\s*string/);
    expect(content).toMatch(/CardBlockProps[\s\S]*?muted:\s*string/);
  });
});
