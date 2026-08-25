// ---------------------------------------------------------------------------
// CompareScene — Side-by-side comparison with constellation lines
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn, constellationDraw } from "../helpers";
import type { CosmosCompareContent } from "../types";

export type CompareSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CosmosCompareContent;

export const CompareSceneData: React.FC<CompareSceneProps> = ({
  frame,
  fps,
  title,
  left,
  right,
  insight,
}) => {
  const theme = useTheme();

  const titleAnim = textIn(frame, 0, fps, 30);
  const leftAnim = textIn(frame, 15, fps, 40);
  const rightAnim = textIn(frame, 25, fps, 40);
  const insightAnim = textIn(frame, 45, fps, 25);

  // Constellation line between the two sides
  const lineProgress = constellationDraw(frame, 20, 30);
  const lineX1 = 480;
  const lineX2 = 1440;
  const lineY = 540;
  const centerX = 960;

  const lc = left.color || theme.colors.accent1;
  const rc = right.color || theme.colors.accent2;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% 50%, #0a0a2e 0%, #050510 60%, #000005 100%)`,
      }}
    >
      {/* Constellation line */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <line
          x1={lineX1}
          y1={lineY}
          x2={lineX1 + (lineX2 - lineX1) * lineProgress}
          y2={lineY}
          stroke={theme.colors.line}
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity="0.4"
        />
        {/* Center node */}
        <circle
          cx={centerX}
          cy={lineY}
          r={6 * lineProgress}
          fill={theme.colors.accent3}
          opacity={lineProgress * 0.8}
        />
      </svg>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 100,
          right: 100,
          ...titleAnim,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 15,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: theme.colors.muted,
            marginBottom: 12,
          }}
        >
          So sánh
        </div>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 56,
            color: theme.colors.ink,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
      </div>

      {/* Left side */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 300,
          width: 700,
          ...leftAnim,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 14,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: lc,
            marginBottom: 12,
          }}
        >
          {left.label}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: 72,
            color: theme.colors.ink,
            lineHeight: 1.0,
          }}
        >
          {left.value}
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 300,
          width: 700,
          textAlign: "right",
          ...rightAnim,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 14,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: rc,
            marginBottom: 12,
          }}
        >
          {right.label}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: 72,
            color: theme.colors.ink,
            lineHeight: 1.0,
          }}
        >
          {right.value}
        </div>
      </div>

      {/* Insight */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 100,
          right: 100,
          textAlign: "center",
          ...insightAnim,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 24,
            color: theme.colors.muted,
            lineHeight: 1.5,
          }}
        >
          {insight}
        </div>
      </div>
    </AbsoluteFill>
  );
};
