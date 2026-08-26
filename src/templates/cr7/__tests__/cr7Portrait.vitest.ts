// ---------------------------------------------------------------------------
// CR7 Portrait Adaptation Tests — Typography scaling for 9:16
// ---------------------------------------------------------------------------

// @ts-nocheck — test file with mocked Remotion modules

import { describe, it, expect, vi } from "vitest";

vi.mock("remotion", () => ({
  AbsoluteFill: ({ children, style }: any) => {
    const React = require("react");
    return React.createElement("div", { "data-testid": "absolute-fill", style }, children);
  },
  spring: () => 1,
  interpolate: (_t: number, _in: number[], out: number[]) => out[1],
}));

vi.mock("../../../design/theme", () => ({
  useTheme: () => ({
    colors: {
      bg: "#0c0a09",
      bg2: "#1c1917",
      card: "#292524",
      accent1: "#f59e0b",
      accent2: "#ef4444",
      ink: "#fafaf9",
      muted: "#a8a29e",
    },
    fonts: {
      display: '"Inter", sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  }),
}));

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HeroSceneData } from "../scenes/HeroScene";
import { StatSceneData } from "../scenes/StatScene";

function extractFontSize(html: string, label: string): number {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`font-size:(\\d+)px[^"]*">${escaped}`));
  return match ? parseInt(match[1], 10) : 0;
}

describe("CR7 portrait adaptation — hero", () => {
  it("16:9 uses design font size (120px)", () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "hero", name: "Cristiano Ronaldo", tagline: "GOAT", subtitle: "The Greatest of All Time",
        width: 1920, height: 1080,
      })
    );
    expect(html).toContain("font-size:120px");
  });

  it("9:16 scales font size to fit viewport", () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "hero", name: "Cristiano Ronaldo", tagline: "GOAT", subtitle: "The Greatest of All Time",
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "Cristiano Ronaldo");
    expect(fontSize).toBeGreaterThan(0);
    expect(fontSize).toBeLessThan(120);
  });

  it("9:16 font size is approximately 68px (120 * 1080/1920)", () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "hero", name: "Cristiano Ronaldo", tagline: "GOAT", subtitle: "The Greatest of All Time",
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "Cristiano Ronaldo");
    expect(fontSize).toBeGreaterThanOrEqual(67);
    expect(fontSize).toBeLessThanOrEqual(69);
  });

  it("portrait title fits within viewport width at 1080px", () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "hero", name: "Cristiano Ronaldo", tagline: "GOAT", subtitle: "The Greatest of All Time",
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "Cristiano Ronaldo");
    const estimatedTextWidth = fontSize * "Cristiano Ronaldo".length * 0.5;
    expect(estimatedTextWidth).toBeLessThanOrEqual(1080);
  });
});

describe("CR7 portrait adaptation — stat", () => {
  it("16:9 uses design font size (200px)", () => {
    const html = renderToStaticMarkup(
      React.createElement(StatSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "stat", label: "CAREER GOALS", bigNumber: "800+",
        sub: "All-time top scorer", detail: "Club and international", color: "accent1",
        width: 1920, height: 1080,
      })
    );
    expect(html).toContain("font-size:200px");
  });

  it("9:16 scales font size to fit viewport", () => {
    const html = renderToStaticMarkup(
      React.createElement(StatSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "stat", label: "CAREER GOALS", bigNumber: "800+",
        sub: "All-time top scorer", detail: "Club and international", color: "accent1",
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "800+");
    expect(fontSize).toBeGreaterThan(0);
    expect(fontSize).toBeLessThan(200);
  });

  it("9:16 font size is approximately 113px (200 * 1080/1920)", () => {
    const html = renderToStaticMarkup(
      React.createElement(StatSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "stat", label: "CAREER GOALS", bigNumber: "800+",
        sub: "All-time top scorer", detail: "Club and international", color: "accent1",
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "800+");
    expect(fontSize).toBeGreaterThanOrEqual(112);
    expect(fontSize).toBeLessThanOrEqual(114);
  });

  it("portrait stat value fits within viewport width at 1080px", () => {
    const html = renderToStaticMarkup(
      React.createElement(StatSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "stat", label: "CAREER GOALS", bigNumber: "800+",
        sub: "All-time top scorer", detail: "Club and international", color: "accent1",
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "800+");
    const estimatedTextWidth = fontSize * 4 * 0.5;
    expect(estimatedTextWidth).toBeLessThanOrEqual(1080);
  });
});

describe("CR7 portrait adaptation — no regression", () => {
  it("default width (no prop) uses design size", () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "hero", name: "Cristiano Ronaldo", tagline: "GOAT", subtitle: "The Greatest of All Time",
      })
    );
    expect(html).toContain("font-size:120px");
  });

  it("wider than design still uses design size (capped at 1)", () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSceneData, {
        audio: "", caption: "", dur: 5, frame: 60, fps: 30,
        kind: "hero", name: "Cristiano Ronaldo", tagline: "GOAT", subtitle: "The Greatest of All Time",
        width: 2560, height: 1440,
      })
    );
    expect(html).toContain("font-size:120px");
  });
});
