// ---------------------------------------------------------------------------
// Scrapbook Portrait Adaptation Tests — Typography scaling for 9:16
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

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ClosingSceneData } from "../scenes/ClosingScene";

function extractFontSize(html: string, label: string): number {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`font-size:(\\d+)px[^"]*">${escaped}`));
  return match ? parseInt(match[1], 10) : 0;
}

function extractMaxWidth(html: string, label: string): number {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`max-width:(\\d+)px[^"]*">${escaped}`));
  return match ? parseInt(match[1], 10) : 0;
}

const BASE_CLOSING_PROPS = {
  audio: "", caption: "", dur: 5, frame: 60, fps: 30,
  kind: "closing" as const,
  title: "The Beautiful Game",
  subtitle: "Moments that live forever in football history",
  stats: [
    { label: "Years", value: "1997–2005" },
    { label: "Goals", value: "847" },
    { label: "Matches", value: "326" },
  ],
  reference: "UEFA Champions League Archives",
};

describe("Scrapbook portrait adaptation — closing scene", () => {
  it("16:9 uses design font size (64px)", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, {
        ...BASE_CLOSING_PROPS,
        width: 1920, height: 1080,
      })
    );
    expect(html).toContain("font-size:64px");
  });

  it("9:16 scales font size to fit viewport", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, {
        ...BASE_CLOSING_PROPS,
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "The Beautiful Game");
    expect(fontSize).toBeGreaterThan(0);
    expect(fontSize).toBeLessThan(64);
  });

  it("9:16 font size is approximately 36px (64 * 1080/1920)", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, {
        ...BASE_CLOSING_PROPS,
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "The Beautiful Game");
    expect(fontSize).toBeGreaterThanOrEqual(35);
    expect(fontSize).toBeLessThanOrEqual(37);
  });

  it("portrait title fits within viewport width at 1080px", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, {
        ...BASE_CLOSING_PROPS,
        width: 1080, height: 1920,
      })
    );
    const fontSize = extractFontSize(html, "The Beautiful Game");
    const maxWidth = extractMaxWidth(html, "The Beautiful Game");
    expect(maxWidth).toBeLessThanOrEqual(1080);
    expect(fontSize).toBeLessThanOrEqual(maxWidth);
  });

  it("portrait reference text is fully visible", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, {
        ...BASE_CLOSING_PROPS,
        width: 1080, height: 1920,
      })
    );
    expect(html).toContain("UEFA Champions League Archives");
    const refFontSize = extractFontSize(html, "UEFA Champions League Archives");
    expect(refFontSize).toBeGreaterThan(0);
    expect(refFontSize).toBeLessThanOrEqual(16);
  });
});

describe("Scrapbook portrait adaptation — no regression", () => {
  it("default width (no prop) uses design size", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, {
        ...BASE_CLOSING_PROPS,
      })
    );
    expect(html).toContain("font-size:64px");
  });

  it("wider than design still uses design size (capped at 1)", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, {
        ...BASE_CLOSING_PROPS,
        width: 2560, height: 1440,
      })
    );
    expect(html).toContain("font-size:64px");
  });

  it("all content elements render in portrait", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClosingSceneData, {
        ...BASE_CLOSING_PROPS,
        width: 1080, height: 1920,
      })
    );
    expect(html).toContain("The Beautiful Game");
    expect(html).toContain("Moments that live forever in football history");
    expect(html).toContain("1997–2005");
    expect(html).toContain("847");
    expect(html).toContain("326");
    expect(html).toContain("UEFA Champions League Archives");
  });
});
