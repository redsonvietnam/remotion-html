// ---------------------------------------------------------------------------
// PathDraw — Generic SVG Stroke Draw
//
// The core primitive. Draws any SVG path using strokeDashoffset technique.
// RingDraw, LineDraw, and other stroke-based animations all compose from this.
// ---------------------------------------------------------------------------

import React from "react";
import type { PathDrawProps } from "./types";
import { clampProgress } from "./types";

export const PathDraw: React.FC<PathDrawProps> = ({
  d,
  progress,
  width = 100,
  height = 100,
  stroke = "white",
  strokeWidth = 2,
  strokeLinecap = "round",
  fill = "none",
  fillOpacity = 1,
  viewBox,
  transform,
  style,
}) => {
  const p = clampProgress(progress);
  const vb = viewBox ?? `0 0 ${width} ${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={vb}
      style={{ overflow: "visible", pointerEvents: "none", ...style }}
      transform={transform}
    >
      <path
        d={d}
        fill={fill}
        fillOpacity={fillOpacity}
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
