// ---------------------------------------------------------------------------
// StatScene — Counter animation + label
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { interpolate, easeOutCubic, easeOutBack, sceneOpacity } from "../helpers";
import type { KineticStatContent } from "../types";

export type StatSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
  width?: number;
  height?: number;
} & KineticStatContent;

export const StatSceneData: React.FC<StatSceneProps> = ({
  frame,
  fps,
  dur,
  value,
  suffix,
  label,
}) => {
  const theme = useTheme();
  const opacity = sceneOpacity(frame, dur);

  const progress = interpolate(frame, [10, 55], [0, value], easeOutCubic);
  const scale = interpolate(frame, [10, 26], [0.7, 1], easeOutBack);
  const numOpacity = interpolate(frame, [8, 18], [0, 1]);
  const labelOpacity = interpolate(frame, [58, 74], [0, 1]);
  const labelY = interpolate(frame, [58, 74], [10, 0], easeOutCubic);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.colors.bg2}, ${theme.colors.accent2})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: 92,
          color: theme.colors.accent1,
          textAlign: "center",
          lineHeight: 1,
          opacity: numOpacity,
          transform: `scale(${Math.max(0, scale)})`,
        }}
      >
        {Math.round(progress)}{suffix}
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 15,
          color: theme.colors.muted,
          textAlign: "center",
          padding: "0 46px",
          lineHeight: 1.5,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
