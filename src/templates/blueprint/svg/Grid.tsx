// ---------------------------------------------------------------------------
// Grid — the blueprint's drafting-table backdrop.
//
// A fine grid + sparser major grid, both very low-opacity. The grid is the
// continuity device of the template: it persists under every scene and
// drifts almost imperceptibly, so a hard cut still reads as "same table,
// new drawing" rather than "new screen".
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { gridDrift } from "./motion";

type Props = {
  width: number;
  height: number;
  color?: string;
  cell?: number;
  majorEvery?: number;
};

export const Grid: React.FC<Props> = ({
  width,
  height,
  color = "rgba(224,238,255,0.22)",
  cell = 48,
  majorEvery = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dx = gridDrift(frame, fps, 5);
  const dy = gridDrift(frame + 90, fps, 4);

  const id = "bp-grid";
  const majorId = "bp-grid-major";

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0 }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <pattern
          id={id}
          width={cell}
          height={cell}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${dx} ${dy})`}
        >
          <path
            d={`M ${cell} 0 L 0 0 0 ${cell}`}
            fill="none"
            stroke={color}
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        </pattern>
        <pattern
          id={majorId}
          width={cell * majorEvery}
          height={cell * majorEvery}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${dx} ${dy})`}
        >
          <path
            d={`M ${cell * majorEvery} 0 L 0 0 0 ${cell * majorEvery}`}
            fill="none"
            stroke={color}
            strokeOpacity={0.16}
            strokeWidth={1}
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${id})`} />
      <rect width={width} height={height} fill={`url(#${majorId})`} />
    </svg>
  );
};
