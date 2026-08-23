// ---------------------------------------------------------------------------
// Seal — the closing "stamp": a geometric mark built from the same
// crosshair-and-ring vocabulary used throughout the video, now doubled into
// two concentric rings with radial ticks and finished with a rotation
// settle. This is the resolution beat: every beam/tag/dimension line drawn
// earlier collapses into this one finished mark.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { draftProgress, sp, ramp } from "./motion";

type Props = {
  size?: number;
  color?: string;
  delay?: number;
};

export const Seal: React.FC<Props> = ({ size = 220, color = "#e8a33d", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const outerP = draftProgress(frame, delay, fps, 30);
  const innerP = draftProgress(frame, delay + 14, fps, 26);
  const settle = sp(frame, delay, fps, "settle");
  const rot = ramp(frame, delay, delay + 60, -16, 0);
  const c = size / 2;
  const rOuter = c - 10;
  const rInner = c - 34;
  const outerLen = 2 * Math.PI * rOuter;
  const innerLen = 2 * Math.PI * rInner;
  const ticks = Array.from({ length: 16 }, (_, i) => (i / 16) * 360);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: `rotate(${rot}deg) scale(${0.9 + Math.min(settle, 1) * 0.1})` }}
    >
      <circle
        cx={c}
        cy={c}
        r={rOuter}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={outerLen}
        strokeDashoffset={outerLen * (1 - outerP)}
      />
      <circle
        cx={c}
        cy={c}
        r={rInner}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={innerLen}
        strokeDashoffset={innerLen * (1 - innerP)}
        opacity={0.7}
      />
      {ticks.map((deg, i) => {
        const on = ramp(frame, delay + 24 + i * 1.2, delay + 30 + i * 1.2, 0, 1);
        const rad = (deg * Math.PI) / 180;
        const x1 = c + Math.cos(rad) * (rOuter - 12);
        const y1 = c + Math.sin(rad) * (rOuter - 12);
        const x2 = c + Math.cos(rad) * rOuter;
        const y2 = c + Math.sin(rad) * rOuter;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} opacity={on} />
        );
      })}
      <line x1={c - 14} y1={c} x2={c + 14} y2={c} stroke={color} strokeWidth={2} opacity={innerP} />
      <line x1={c} y1={c - 14} x2={c} y2={c + 14} stroke={color} strokeWidth={2} opacity={innerP} />
    </svg>
  );
};
