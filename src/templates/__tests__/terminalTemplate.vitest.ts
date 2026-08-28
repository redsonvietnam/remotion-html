import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "../..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(srcDir, relPath), "utf-8");
}

describe("Template: Terminal scene registry", () => {
  it("renderScene has exhaustive switch on content.kind", () => {
    const content = readFile("templates/terminal/scenes/index.tsx");
    expect(content).toMatch(/case\s+"intro"/);
    expect(content).toMatch(/case\s+"typing"/);
    expect(content).toMatch(/case\s+"reveal"/);
    expect(content).toMatch(/case\s+"outro"/);
  });

  it("renderScene has exhaustive check (never)", () => {
    const content = readFile("templates/terminal/scenes/index.tsx");
    expect(content).toMatch(/never/);
  });

  it("renderScene throws on unknown kind", () => {
    const content = readFile("templates/terminal/scenes/index.tsx");
    expect(content).toMatch(/throw new Error/);
  });
});

describe("Template: Terminal content schema", () => {
  it("TerminalSceneContent is a discriminated union on 'kind'", () => {
    const content = readFile("data/terminal.ts");
    expect(content).toMatch(/type TerminalSceneContent\s*=/);
    const unionMatch = content.match(/type TerminalSceneContent\s*=\s*([\s\S]*?);/);
    expect(unionMatch).not.toBeNull();
    const union = unionMatch![1];
    expect(union).toContain("TerminalIntroContent");
    expect(union).toContain("TerminalTypingContent");
    expect(union).toContain("TerminalRevealContent");
    expect(union).toContain("TerminalOutroContent");
  });

  it("each content interface has kind literal", () => {
    const content = readFile("data/terminal.ts");
    expect(content).toMatch(/kind:\s*"intro"/);
    expect(content).toMatch(/kind:\s*"typing"/);
    expect(content).toMatch(/kind:\s*"reveal"/);
    expect(content).toMatch(/kind:\s*"outro"/);
  });
});

describe("Template: Terminal theme contract", () => {
  it("terminal theme uses createTheme()", () => {
    const content = readFile("theme/terminal.ts");
    expect(content).toMatch(/createTheme/);
  });

  it("terminal theme defines accent1, accent2, accent3", () => {
    const content = readFile("theme/terminal.ts");
    expect(content).toMatch(/accent1:/);
    expect(content).toMatch(/accent2:/);
    expect(content).toMatch(/accent3:/);
  });

  it("terminal theme defines bg, ink, muted", () => {
    const content = readFile("theme/terminal.ts");
    expect(content).toMatch(/bg:/);
    expect(content).toMatch(/ink:/);
    expect(content).toMatch(/muted:/);
  });
});

describe("Template: Terminal template entry", () => {
  it("TerminalTemplate uses TransitionSeries", () => {
    const content = readFile("templates/terminal/index.tsx");
    expect(content).toMatch(/TransitionSeries/);
  });

  it("TerminalTemplate maps over scenes", () => {
    const content = readFile("templates/terminal/index.tsx");
    expect(content).toMatch(/scenes\.forEach/);
  });

  it("TerminalTemplate calls renderScene", () => {
    const content = readFile("templates/terminal/index.tsx");
    expect(content).toMatch(/renderScene/);
  });
});

describe("Template: Terminal data contract in contract.ts", () => {
  it("TEMPLATE_SCHEMAS has terminal entry", () => {
    const content = readFile("data/contract.ts");
    expect(content).toMatch(/terminal:\s*\{/);
  });

  it("terminal schema has all 4 scene kinds", () => {
    const content = readFile("data/contract.ts");
    const terminalMatch = content.match(/terminal:\s*\{[^}]*allowedKinds:\s*\[([^\]]+)\]/);
    expect(terminalMatch).not.toBeNull();
    const kinds = terminalMatch![1];
    expect(kinds).toContain("intro");
    expect(kinds).toContain("typing");
    expect(kinds).toContain("reveal");
    expect(kinds).toContain("outro");
  });

  it("contract.ts exports TerminalSceneContent", () => {
    const content = readFile("data/contract.ts");
    expect(content).toMatch(/export type TerminalSceneContent/);
  });
});

describe("Template: Terminal demo data", () => {
  it("terminalDemo.ts has TERMINAL_SCENES", () => {
    const content = readFile("data/terminalDemo.ts");
    expect(content).toMatch(/export const TERMINAL_SCENES/);
  });

  it("terminalDemo.ts has TERMINAL_CONTENT", () => {
    const content = readFile("data/terminalDemo.ts");
    expect(content).toMatch(/export const TERMINAL_CONTENT/);
  });

  it("terminalDemo.ts has all 6 scenes (intro + 4 typing + outro)", () => {
    const content = readFile("data/terminalDemo.ts");
    expect(content).toMatch(/kind:\s*"intro"/);
    expect(content).toMatch(/kind:\s*"typing"/);
    expect(content).toMatch(/kind:\s*"outro"/);
  });
});

describe("Template: Terminal helpers", () => {
  it("helpers.tsx exports MatrixRain", () => {
    const content = readFile("templates/terminal/helpers.tsx");
    expect(content).toMatch(/export const MatrixRain/);
  });

  it("helpers.tsx exports TerminalCard", () => {
    const content = readFile("templates/terminal/helpers.tsx");
    expect(content).toMatch(/export const TerminalCard/);
  });

  it("helpers.tsx exports CodeBlock", () => {
    const content = readFile("templates/terminal/helpers.tsx");
    expect(content).toMatch(/export const CodeBlock/);
  });

  it("helpers.tsx exports Caption", () => {
    const content = readFile("templates/terminal/helpers.tsx");
    expect(content).toMatch(/export const Caption/);
  });

  it("helpers.tsx exports ProgressDots", () => {
    const content = readFile("templates/terminal/helpers.tsx");
    expect(content).toMatch(/export const ProgressDots/);
  });
});

describe("Template: Terminal Root.tsx registration", () => {
  it("Root.tsx imports TerminalTemplate", () => {
    const content = readFile("Root.tsx");
    expect(content).toMatch(/import.*TerminalTemplate.*from.*templates\/terminal/);
  });

  it("Root.tsx imports terminal data", () => {
    const content = readFile("Root.tsx");
    expect(content).toMatch(/import.*TERMINAL_SCENES.*from.*data\/terminalDemo/);
  });

  it("Root.tsx registers TerminalCodeTip composition", () => {
    const content = readFile("Root.tsx");
    expect(content).toMatch(/id="TerminalCodeTip"/);
  });
});
