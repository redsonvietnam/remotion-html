// ---------------------------------------------------------------------------
// LineDraw — Straight Line Stroke Draw
//
// Draws a straight line that reveals from start to end based on progress.
// Replaces NQ57's UnderlineDraw with a template-agnostic primitive.
// ---------------------------------------------------------------------------

import React from "react";
import type { LineDrawProps } from "./types";
import { clampProgress } from "./types";

export const LineDraw: React.FC<LineDrawProps> = ({
  x1 = 0,
  y1 = 5,
  x2 = 100,
  y2 = 5,
  progress,
  width = 420,
  height = 10,
  stroke = "white",
  strokeWidth = 3,
  strokeLinecap = "round",
  viewBox = "0 0 100 10",
  style,
}) => {
  const p = clampProgress(progress);

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      style={{ display: "block", pointerEvents: "none", ...style }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};
