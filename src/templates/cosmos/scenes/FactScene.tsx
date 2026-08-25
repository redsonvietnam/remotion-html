// ---------------------------------------------------------------------------
// FactScene — Single fact with orbital ring animation
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn, orbitalRotation } from "../helpers";
import type { CosmosFactContent } from "../types";

export type FactSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CosmosFactContent;

export const FactSceneData: React.FC<FactSceneProps> = ({
  frame,
  fps,
  label,
  bigValue,
  unit,
  description,
  detail,
}) => {
  const theme = useTheme();

  const labelAnim = textIn(frame, 0, fps, 20);
  const valueAnim = textIn(frame, 8, fps, 60);
  const unitAnim = textIn(frame, 15, fps, 30);
  const descAnim = textIn(frame, 25, fps, 25);
  const detailAnim = textIn(frame, 35, fps, 20);

  // Orbital ring
  const orbit1 = orbitalRotation(frame, fps, 8, 180, 0);
  const orbit2 = orbitalRotation(frame, fps, 12, 220, Math.PI / 3);

  const pulse = 0.015 * Math.sin((frame / fps) * 2);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% 50%, #0a0a2e 0%, #050510 60%, #000005 100%)`,
      }}
    >
      {/* Orbital rings */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <circle
          cx="960"
          cy="540"
          r="180"
          fill="none"
          stroke={theme.colors.accent1}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
        <circle
          cx="960"
          cy="540"
          r="220"
          fill="none"
          stroke={theme.colors.accent2}
          strokeWidth="0.5"
          strokeOpacity="0.2"
        />
        {/* Orbiting dots */}
        <circle
          cx={960 + orbit1.x}
          cy={540 + orbit1.y}
          r="4"
          fill={theme.colors.accent1}
          opacity="0.8"
        />
        <circle
          cx={960 + orbit2.x}
          cy={540 + orbit2.y}
          r="3"
          fill={theme.colors.accent2}
          opacity="0.6"
        />
      </svg>

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            ...labelAnim,
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 14,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: theme.colors.accent1,
            marginBottom: 16,
          }}
        >
          {label}
        </div>
        <div
          style={{
            ...valueAnim,
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: 180,
            lineHeight: 1.0,
            color: theme.colors.ink,
            textAlign: "center",
            transform: `scale(${1 + pulse})`,
            textShadow: `0 0 80px ${theme.colors.accent1}30`,
          }}
        >
          {bigValue}
        </div>
        <div
          style={{
            ...unitAnim,
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 24,
            color: theme.colors.accent1,
            marginBottom: 24,
          }}
        >
          {unit}
        </div>
        <div
          style={{
            width: 80,
            height: 2,
            background: theme.colors.accent1,
            margin: "0 0 24px 0",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            ...descAnim,
            fontFamily: theme.fonts.display,
            fontSize: 28,
            color: theme.colors.muted,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
        <div
          style={{
            ...detailAnim,
            fontFamily: theme.fonts.display,
            fontSize: 20,
            color: `${theme.colors.muted}99`,
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.5,
            marginTop: 16,
          }}
        >
          {detail}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
