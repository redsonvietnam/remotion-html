// ---------------------------------------------------------------------------
// CalloutTag — a numbered annotation tag with a short leader stub, styled
// like a callout on a technical drawing ("see detail 01").
//
// Semantic role: used for itemized conditions/exceptions inside a Detail
// scene. The leader line draws in first (the pointer arrives), then the tag
// number resolves — reading order becomes "here → this is what's here",
// which is the annotation grammar of a real spec sheet.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { draftProgress, ramp } from "./motion";

type Props = {
  index: number;
  color?: string;
  delay?: number;
  size?: number;
  leaderLength?: number;
  mono: string;
};

export const CalloutTag: React.FC<Props> = ({
  index,
  color = "#e8a33d",
  delay = 0,
  size = 34,
  leaderLength = 28,
  mono,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leaderP = draftProgress(frame, delay, fps, 10);
  const tagP = ramp(frame, delay + 8, delay + 20, 0, 1);
  const total = size + leaderLength;

  return (
    <svg width={total} height={size} viewBox={`0 0 ${total} ${size}`} style={{ overflow: "visible", flexShrink: 0 }}>
      <line
        x1={size}
        y1={size / 2}
        x2={size + leaderLength * leaderP}
        y2={size / 2}
        stroke={color}
        strokeWidth={2}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={(size / 2 - 2) * tagP}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
      <text
        x={size / 2}
        y={size / 2}
        fill={color}
        fontFamily={mono}
        fontSize={13}
        fontWeight={600}
        textAnchor="middle"
        dominantBaseline="central"
        opacity={tagP}
      >
        {String(index).padStart(2, "0")}
      </text>
    </svg>
  );
};
