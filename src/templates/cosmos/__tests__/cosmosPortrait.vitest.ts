// ---------------------------------------------------------------------------
// Cosmos Portrait Adaptation Tests — SVG responsiveness for 9:16
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
      bg: "#050510",
      bg2: "#0a0a2e",
      card: "#111133",
      accent1: "#3b82f6",
      accent2: "#a855f7",
      accent3: "#f8fafc",
      ink: "#f8fafc",
      muted: "#94a3b8",
    },
    fonts: {
      display: '"Inter", sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  }),
}));

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FactSceneData } from "../scenes/FactScene";
import { ClosingSceneData } from "../scenes/ClosingScene";

function extractSvgAttrs(html: string): { width?: string; height?: string; viewBox?: string; styleWidth?: string; styleHeight?: string } {
  const widthMatch = html.match(/<svg[^>]*width="([^"]*)"/);
  const heightMatch = html.match(/<svg[^>]*height="([^"]*)"/);
  const viewBoxMatch = html.match(/<svg[^>]*viewBox="([^"]*)"/);
  const styleWidthMatch = html.match(/<svg[^>]*style="[^"]*width:\s*([^;]*)/);
  const styleHeightMatch = html.match(/<svg[^>]*style="[^"]*height:\s*([^;]*)/);
  return {
    width: widthMatch?.[1],
    height: heightMatch?.[1],
    viewBox: viewBoxMatch?.[1],
    styleWidth: styleWidthMatch?.[1],
    styleHeight: styleHeightMatch?.[1],
  };
}

const BASE_FACT_PROPS = {
  audio: "", caption: "", dur: 5, frame: 60, fps: 30,
  kind: "fact" as const, label: "AGE OF THE SUN", bigValue: "4.6B",
  unit: "years", description: "Our star's current age", detail: "Main sequence",
};

const BASE_CLOSING_PROPS = {
  audio: "", caption: "", dur: 5, frame: 60, fps: 30,
  kind: "closing" as const, title: "Solar System", subtitle: "Our cosmic neighborhood",
  reference: "NASA", stars: [], stats: [],
};

describe("Cosmos portrait adaptation — fact scene SVG", () => {
  it("16:9 SVG has no hardcoded width/height attributes", () => {
    const html = renderToStaticMarkup(
      React.createElement(FactSceneData, { ...BASE_FACT_PROPS })
    );
    const svgAttrs = extractSvgAttrs(html);
    expect(svgAttrs.width).toBeUndefined();
    expect(svgAttrs.height).toBeUndefined();
  });

  it("SVG uses viewBox for coordinate system", () => {
    const html = renderToStaticMarkup(
      React.createElement(FactSceneData, { ...BASE_FACT_PROPS })
    );
    const svgAttrs = extractSvgAttrs(html);
    expect(svgAttrs.viewBox).toBe("0 0 1920 1080");
  });

  it("SVG style has width:100% and height:100%", () => {
    const html = renderToStaticMarkup(
      React.createElement(FactSceneData, { ...BASE_FACT_PROPS })
    );
    const svgAttrs = extractSvgAttrs(html);
    expect(svgAttrs.styleWidth).toBe("100%");
    expect(svgAttrs.styleHeight).toBe("100%");
  });

  it("orbital circles render within viewBox", () => {
    const html = renderToStaticMarkup(
      React.createElement(FactSceneData, { ...BASE_FACT_PROPS })
    );
    expect(html).toContain('cx="960"');
    expect(html).toContain('cy="540"');
    expect(html).toContain('r="180"');
    expect(html).toContain('r="220"');
  });
});

describe("Cosmos portrait adaptation — closing scene SVG", () => {
  it("SVG has no hardcoded width/height attributes", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, { ...BASE_CLOSING_PROPS })
    );
    const svgAttrs = extractSvgAttrs(html);
    expect(svgAttrs.width).toBeUndefined();
    expect(svgAttrs.height).toBeUndefined();
  });

  it("SVG uses viewBox and has 100% dimensions", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, { ...BASE_CLOSING_PROPS })
    );
    const svgAttrs = extractSvgAttrs(html);
    expect(svgAttrs.viewBox).toBe("0 0 1920 1080");
    expect(svgAttrs.styleWidth).toBe("100%");
    expect(svgAttrs.styleHeight).toBe("100%");
  });
});

describe("Cosmos portrait adaptation — no regression", () => {
  it("fact scene renders all content elements", () => {
    const html = renderToStaticMarkup(
      React.createElement(FactSceneData, { ...BASE_FACT_PROPS })
    );
    expect(html).toContain("AGE OF THE SUN");
    expect(html).toContain("4.6B");
    expect(html).toContain("years");
  });
});
