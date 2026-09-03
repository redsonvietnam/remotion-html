import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "../..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(srcDir, relPath), "utf-8");
}

describe("Template: NQ57 scene registry", () => {
  it("renderScene has exhaustive switch on content.kind", () => {
    const content = readFile("templates/nq57/scenes/index.tsx");
    // Should have all 7 kind cases
    expect(content).toMatch(/case\s+"title"/);
    expect(content).toMatch(/case\s+"quote"/);
    expect(content).toMatch(/case\s+"roles"/);
    expect(content).toMatch(/case\s+"pillars"/);
    expect(content).toMatch(/case\s+"stats"/);
    expect(content).toMatch(/case\s+"vision"/);
    expect(content).toMatch(/case\s+"end"/);
  });

  it("renderScene has exhaustive check (never)", () => {
    const content = readFile("templates/nq57/scenes/index.tsx");
    expect(content).toMatch(/never/);
  });

  it("renderScene throws on unknown kind", () => {
    const content = readFile("templates/nq57/scenes/index.tsx");
    expect(content).toMatch(/throw new Error/);
  });
});

describe("Template: NQ57 content schema", () => {
  it("NQ57SceneContent is a discriminated union on 'kind'", () => {
    const content = readFile("data/nq57.ts");
    expect(content).toMatch(/type NQ57SceneContent\s*=/);
    // Should be a union of 7 interfaces
    const unionMatch = content.match(/type NQ57SceneContent\s*=\s*([\s\S]*?);/);
    expect(unionMatch).not.toBeNull();
    const union = unionMatch![1];
    expect(union).toContain("NQ57TitleContent");
    expect(union).toContain("NQ57QuoteContent");
    expect(union).toContain("NQ57RolesContent");
    expect(union).toContain("NQ57PillarsContent");
    expect(union).toContain("NQ57StatsContent");
    expect(union).toContain("NQ57VisionContent");
    expect(union).toContain("NQ57EndContent");
  });

  it("each content interface has kind literal", () => {
    const content = readFile("data/nq57.ts");
    expect(content).toMatch(/kind:\s*"title"/);
    expect(content).toMatch(/kind:\s*"quote"/);
    expect(content).toMatch(/kind:\s*"roles"/);
    expect(content).toMatch(/kind:\s*"pillars"/);
    expect(content).toMatch(/kind:\s*"stats"/);
    expect(content).toMatch(/kind:\s*"vision"/);
    expect(content).toMatch(/kind:\s*"end"/);
  });
});

describe("Template: NQ57 theme contract", () => {
  it("nq57 theme uses createTheme()", () => {
    const content = readFile("theme/nq57.ts");
    expect(content).toMatch(/createTheme/);
  });

  it("nq57 theme defines accent1, accent2, accent3", () => {
    const content = readFile("theme/nq57.ts");
    expect(content).toMatch(/accent1:/);
    expect(content).toMatch(/accent2:/);
    expect(content).toMatch(/accent3:/);
  });

  it("nq57 theme defines bg, ink, muted", () => {
    const content = readFile("theme/nq57.ts");
    expect(content).toMatch(/bg:/);
    expect(content).toMatch(/ink:/);
    expect(content).toMatch(/muted:/);
  });
});

describe("Template: NQ57 template entry", () => {
  it("NQ57Template uses TransitionSeries", () => {
    const content = readFile("templates/nq57/index.tsx");
    expect(content).toMatch(/TransitionSeries/);
  });

  it("NQ57Template maps over SCENES", () => {
    const content = readFile("templates/nq57/index.tsx");
    expect(content).toMatch(/SCENES/);
  });

  it("NQ57Template calls renderScene", () => {
    const content = readFile("templates/nq57/index.tsx");
    expect(content).toMatch(/renderScene/);
  });
});
