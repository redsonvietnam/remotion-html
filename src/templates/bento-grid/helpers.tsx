// ---------------------------------------------------------------------------
// Bento Grid Helpers — frame-based animation primitives + visual components
//
// Deterministic per-frame functions mirroring the prototype's animation logic.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { AuroraBlob } from "../../theme/bentoGrid";

// ─── Math Helpers ────────────────────────────────────────────────────────────

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const interpolate = (
  frame: number,
  [i0, i1]: [number, number],
  [o0, o1]: [number, number],
  easing: (t: number) => number = (t) => t,
): number => {
  const t = clamp((frame - i0) / (i1 - i0), 0, 1);
  return o0 + (o1 - o0) * easing(t);
};

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Per-scene opacity: fade-in 14 frames, fade-out 14 frames. */
export const sceneOpacity = (localFrame: number, dur: number) => {
  const f = 14;
  return interpolate(localFrame, [0, f], [0, 1], easeOutCubic) *
    interpolate(localFrame, [dur - f, dur], [1, 0], easeOutCubic);
};

// ─── Aurora Background ──────────────────────────────────────────────────────

export const AuroraBackground: React.FC<{
  blobs: AuroraBlob[];
  frame: number;
}> = ({ blobs, frame }) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {blobs.map((b, i) => {
        const t = frame;
        const x = b.baseX + b.ax * Math.sin(t * b.freqx + b.phase);
        const y = b.baseY + b.ay * Math.cos(t * b.freqy + b.phase);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: b.color,
              filter: "blur(46px)",
              mixBlendMode: "screen",
              opacity: 0.55,
              left: `calc(${x}% - ${b.size / 2}px)`,
              top: `calc(${y}% - ${b.size / 2}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Noise Overlay ──────────────────────────────────────────────────────────

const NOISE_SVG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/></svg>")`;

export const NoiseOverlay: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: NOISE_SVG,
      mixBlendMode: "overlay",
      opacity: 1,
    }}
  />
);

// ─── Mini Chart (SVG line with deterministic stroke animation) ──────────────

export const MiniChart: React.FC<{
  points: number[];
  progress: number;
  width?: number;
  height?: number;
  color?: string;
}> = ({ points, progress, width = 100, height = 34, color = "#3ddcff" }) => {
  if (points.length < 2) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((v, i) => ({
    x: (i / (points.length - 1)) * width,
    y: height - 4 - ((v - min) / range) * (height - 8),
  }));

  const d = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(" ");

  // Deterministic path length estimate: sum of segment lengths
  let totalLen = 0;
  for (let i = 1; i < coords.length; i++) {
    const dx = coords[i].x - coords[i - 1].x;
    const dy = coords[i].y - coords[i - 1].y;
    totalLen += Math.sqrt(dx * dx + dy * dy);
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen * (1 - progress)}
      />
    </svg>
  );
};
