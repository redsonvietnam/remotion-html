// ---------------------------------------------------------------------------
// BeamBlock — a modular structural panel: four corner brackets that snap
// inward from off-panel into place, framing whatever content sits inside.
//
// Semantic role: each "beam" is one load-bearing idea (one pillar, one
// clause, one step). Structure scenes assemble several beams into a single
// diagram, which is exactly the visual metaphor: a law/policy is a
// structure built from discrete, fitted parts — not a list of bullet points.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { sp, ramp } from "./motion";

type Props = {
  width: number;
  height: number;
  color?: string;
  fill?: string;
  delay?: number;
  bracket?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
};

export const BeamBlock: React.FC<Props> = ({
  width,
  height,
  color = "#eaf4ff",
  fill = "rgba(224,238,255,0.04)",
  delay = 0,
  bracket = 22,
  strokeWidth = 2,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const snap = sp(frame, delay, fps, "snap");
  const travel = 34; // px the brackets slide in from
  const off = (1 - Math.min(snap, 1)) * travel;
  const fade = ramp(frame, delay, delay + 10, 0, 1);
  const panelFade = ramp(frame, delay + 6, delay + 22, 0, 1);

  const corner = (cx: number, cy: number, sx: 1 | -1, sy: 1 | -1) => (
    <path
      d={`M ${cx} ${cy + bracket * sy} L ${cx} ${cy} L ${cx + bracket * sx} ${cy}`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
    />
  );

  return (
    <div style={{ position: "relative", width, height }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: fill,
          opacity: panelFade,
        }}
      />
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0, overflow: "visible", opacity: fade }}
      >
        <g transform={`translate(${-off} ${-off})`}>{corner(0, 0, 1, 1)}</g>
        <g transform={`translate(${off} ${-off})`}>{corner(width, 0, -1, 1)}</g>
        <g transform={`translate(${-off} ${off})`}>{corner(0, height, 1, -1)}</g>
        <g transform={`translate(${off} ${off})`}>{corner(width, height, -1, -1)}</g>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: panelFade,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
};
