// ---------------------------------------------------------------------------
// Crosshair — the template's single recurring alignment glyph.
//
// A small drafting crosshair (+ inside a thin ring) that draws itself on.
// It appears once per scene as a focal anchor — the place the eye should
// land first — and reappears transformed into the closing Seal, giving the
// whole video one continuous visual thread instead of six disconnected
// scenes.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { draftProgress } from "./motion";

type Props = {
  size?: number;
  color?: string;
  delay?: number;
  strokeWidth?: number;
};

export const Crosshair: React.FC<Props> = ({
  size = 64,
  color = "#eaf4ff",
  delay = 0,
  strokeWidth = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = draftProgress(frame, delay, fps, 18);
  const r = size / 2 - strokeWidth;
  const c = size / 2;
  const ringLen = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={ringLen}
        strokeDashoffset={ringLen * (1 - p)}
        strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
      />
      <line
        x1={c - r * 0.55 * p}
        y1={c}
        x2={c + r * 0.55 * p}
        y2={c}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <line
        x1={c}
        y1={c - r * 0.55 * p}
        x2={c}
        y2={c + r * 0.55 * p}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
