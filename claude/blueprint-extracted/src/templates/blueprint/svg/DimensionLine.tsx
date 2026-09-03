// ---------------------------------------------------------------------------
// DimensionLine — an architectural/engineering "measurement" line: two
// perpendicular tick caps joined by a line with inward-pointing arrowheads.
//
// Semantic role: whenever the video needs to assert a quantity ("15 năm",
// "141 điều", a before/after comparison), the claim is drawn as something
// being *measured*, not just printed as a number.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { draftProgress } from "./motion";

type Props = {
  /** Pixel length of the dimension line. */
  length: number;
  color?: string;
  strokeWidth?: number;
  capHeight?: number;
  delay?: number;
  duration?: number;
};

/** Horizontal dimension line, drawn left-to-right. Wrap in a positioned div. */
export const DimensionLine: React.FC<Props> = ({
  length,
  color = "#e8a33d",
  strokeWidth = 2,
  capHeight = 14,
  delay = 0,
  duration = 24,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = draftProgress(frame, delay, fps, duration);
  const drawnLen = length * p;
  const arrow = 9;

  return (
    <svg
      width={length}
      height={capHeight * 2}
      viewBox={`0 0 ${length} ${capHeight * 2}`}
      style={{ overflow: "visible" }}
    >
      {/* end caps */}
      <line x1={0} y1={capHeight / 2} x2={0} y2={capHeight * 1.5} stroke={color} strokeWidth={strokeWidth} opacity={p > 0.02 ? 1 : 0} />
      <line
        x1={length}
        y1={capHeight / 2}
        x2={length}
        y2={capHeight * 1.5}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={p > 0.98 ? 1 : 0}
      />
      {/* main line */}
      <line x1={0} y1={capHeight} x2={drawnLen} y2={capHeight} stroke={color} strokeWidth={strokeWidth} />
      {/* arrowheads (fade in once line has nearly reached each end) */}
      {p > 0.06 && (
        <path
          d={`M ${arrow} ${capHeight - arrow * 0.5} L 0 ${capHeight} L ${arrow} ${capHeight + arrow * 0.5}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {p > 0.94 && (
        <path
          d={`M ${length - arrow} ${capHeight - arrow * 0.5} L ${length} ${capHeight} L ${length - arrow} ${capHeight + arrow * 0.5}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};
