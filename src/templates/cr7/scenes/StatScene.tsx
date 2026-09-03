// ---------------------------------------------------------------------------
// StatScene — Big number + label + detail
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn } from "../helpers";
import type { CR7StatContent } from "../types";

/** Design viewport width — typography scales relative to this. */
const DESIGN_WIDTH = 1920;

export type StatSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
  width?: number;
  height?: number;
} & CR7StatContent;

export const StatSceneData: React.FC<StatSceneProps> = ({
  frame,
  fps,
  width = DESIGN_WIDTH,
  label,
  bigNumber,
  sub,
  detail,
  color,
}) => {
  const theme = useTheme();
  const scale = Math.min(1, width / DESIGN_WIDTH);

  const labelAnim = textIn(frame, 0, fps, 20);
  const numAnim = textIn(frame, 8, fps, 60);
  const subAnim = textIn(frame, 20, fps, 25);
  const detailAnim = textIn(frame, 35, fps, 20);
  const c = theme.colors[color] || theme.colors.accent1;
  const animScale = 1 + 0.02 * Math.sin((frame / fps) * 2);

  const bigFontSize = Math.round(200 * scale);
  const subFontSize = Math.round(28 * scale);
  const subMaxWidth = Math.round(700 * scale);
  const detailFontSize = Math.round(20 * scale);
  const detailMaxWidth = Math.round(600 * scale);
  const outerPadding = Math.round(80 * scale);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% 50%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%, #050403 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at 75% 40%, ${c}08, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: outerPadding,
        }}
      >
        <div
          style={{
            ...labelAnim,
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 14,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: c,
            marginBottom: 16,
          }}
        >
          {label}
        </div>
        <div
          style={{
            ...numAnim,
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: bigFontSize,
            lineHeight: 1.0,
            color: theme.colors.ink,
            textAlign: "center",
            transform: `scale(${animScale})`,
            textShadow: `0 0 80px ${c}30`,
          }}
        >
          {bigNumber}
        </div>
        <div
          style={{
            width: 80,
            height: 2,
            background: c,
            margin: "24px 0",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            ...subAnim,
            fontFamily: theme.fonts.display,
            fontSize: subFontSize,
            color: theme.colors.muted,
            textAlign: "center",
            maxWidth: subMaxWidth,
            lineHeight: 1.4,
          }}
        >
          {sub}
        </div>
        <div
          style={{
            ...detailAnim,
            fontFamily: theme.fonts.display,
            fontSize: detailFontSize,
            color: `${theme.colors.muted}99`,
            textAlign: "center",
            maxWidth: detailMaxWidth,
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
