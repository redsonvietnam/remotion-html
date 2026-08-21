// ---------------------------------------------------------------------------
// FlowLine — Animated Dots Along a Line
//
// Dots move along a horizontal line, driven by progress.
// Replaces NQ57's DataFlow with a template-agnostic primitive.
// ---------------------------------------------------------------------------

import React from "react";
import type { FlowLineProps } from "./types";

export const FlowLine: React.FC<FlowLineProps> = ({
  width,
  height = 36,
  progress,
  dotColor = "white",
  lineColor = "rgba(255,255,255,0.15)",
  dotCount = 5,
  dotRadius = 4.5,
  dotOpacity = 0.9,
  direction = "ltr",
  style,
}) => {
  const p = progress;
  const midY = height / 2;
  const dir = direction === "rtl" ? -1 : 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", pointerEvents: "none", ...style }}
    >
      {/* Base line */}
      <line
        x1={0}
        y1={midY}
        x2={width}
        y2={midY}
        stroke={lineColor}
        strokeWidth={2}
      />
      {/* Animated dots */}
      {Array.from({ length: dotCount }).map((_, i) => {
        const spacing = width / dotCount;
        const baseX = i * spacing;
        // Each dot moves across the full width, offset by its index
        const rawX = (p * width * dir + baseX + width) % width;
        return (
          <circle
            key={i}
            cx={rawX}
            cy={midY}
            r={dotRadius}
            fill={dotColor}
            opacity={dotOpacity}
          />
        );
      })}
    </svg>
  );
};
