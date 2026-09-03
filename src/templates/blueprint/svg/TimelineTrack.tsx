// ---------------------------------------------------------------------------
// TimelineTrack — a horizontal process line with evenly-spaced step nodes
// that light up in sequence, like a construction schedule drawn along a
// dimension line.
//
// Semantic role: used whenever content is a sequence of steps/dates rather
// than a static structure — the ProcessScene's core primitive. Reuses the
// same "draft" pen-draw language as DimensionLine so a process reads as
// "the same kind of measured fact", just laid out in time instead of value.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { draftProgress, sp, ramp } from "./motion";

type Props = {
  width: number;
  steps: number;
  color?: string;
  activeColor?: string;
  delay?: number;
  stepDelay?: number;
  nodeRadius?: number;
};

export const TimelineTrack: React.FC<Props> = ({
  width,
  steps,
  color = "rgba(224,238,255,0.35)",
  activeColor = "#e8a33d",
  delay = 0,
  stepDelay = 20,
  nodeRadius = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineP = draftProgress(frame, delay, fps, 30);
  const drawnLen = width * lineP;
  const h = nodeRadius * 2 + 4;

  const positions = Array.from({ length: steps }, (_, i) =>
    steps === 1 ? 0 : (i / (steps - 1)) * width
  );

  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ overflow: "visible" }}>
      <line x1={0} y1={h / 2} x2={drawnLen} y2={h / 2} stroke={color} strokeWidth={2} />
      {positions.map((x, i) => {
        const nodeDelay = delay + 8 + i * stepDelay;
        const snap = sp(frame, nodeDelay, fps, "snap");
        const fill = ramp(frame, nodeDelay, nodeDelay + 12, 0, 1);
        const r = nodeRadius * Math.min(snap, 1);
        return (
          <g key={i}>
            <circle cx={x} cy={h / 2} r={nodeRadius} fill="none" stroke={color} strokeWidth={2} />
            <circle cx={x} cy={h / 2} r={r * fill} fill={activeColor} />
          </g>
        );
      })}
    </svg>
  );
};
