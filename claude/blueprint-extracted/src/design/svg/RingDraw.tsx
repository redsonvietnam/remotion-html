// ---------------------------------------------------------------------------
// CircleDraw — Ring/Arc Stroke Draw
//
// Draws a circle arc that reveals from 0 to full based on progress.
// Replaces NQ57's RingDraw with a template-agnostic primitive.
// ---------------------------------------------------------------------------

import React from "react";
import type { CircleDrawProps } from "./types";
import { clampProgress, computeTickMarks } from "./types";

export const CircleDraw: React.FC<CircleDrawProps> = ({
  cx = 50,
  cy = 50,
  r = 47,
  progress,
  size = 100,
  stroke = "white",
  strokeWidth = 2,
  strokeLinecap = "round",
  backgroundStroke = null,
  rotate = -90,
  viewBoxSize = 100,
  style,
}) => {
  const p = clampProgress(progress);
  const vb = `0 0 ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={vb}
      style={{ overflow: "visible", pointerEvents: "none", ...style }}
    >
      {backgroundStroke && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={backgroundStroke}
          strokeWidth={strokeWidth}
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        transform={`rotate(${rotate} ${cx} ${cy})`}
        opacity={0.85}
      />
    </svg>
  );
};

// ─── RingDraw with tick marks (convenience) ─────────────────────────────────

export interface RingDrawProps {
  progress: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
  tickCount?: number;
  tickColor?: string;
  tickLength?: number;
  style?: React.CSSProperties;
}

/**
 * Ring with tick marks — replaces NQ57's RingDraw.
 * A circle arc with optional tick marks around the perimeter.
 */
export const RingDraw: React.FC<RingDrawProps> = ({
  progress,
  size = 100,
  color = "white",
  strokeWidth = 2,
  tickCount = 8,
  tickColor,
  tickLength = 4,
  style,
}) => {
  const p = clampProgress(progress);
  const vb = 100;
  const cx = 50;
  const cy = 50;
  const r = 47;
  const tickR1 = r + 1;
  const tickR2 = r + 1 + tickLength;
  const tc = tickColor ?? color;

  const ticks = computeTickMarks(tickCount, cx, cy, tickR1, tickR2);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${vb} ${vb}`}
      style={{ overflow: "visible", pointerEvents: "none", ...style }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        transform="rotate(-90 50 50)"
        opacity={0.85}
      />
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={tc}
          strokeWidth={1.5}
          opacity={0.6}
        />
      ))}
    </svg>
  );
};
