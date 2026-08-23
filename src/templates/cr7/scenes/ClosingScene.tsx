// ---------------------------------------------------------------------------
// ClosingScene — Legacy title + subtitle
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn } from "../helpers";
import type { CR7ClosingContent } from "../types";

export type ClosingSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CR7ClosingContent;

export const ClosingSceneData: React.FC<ClosingSceneProps> = ({
  frame,
  fps,
  title,
  subtitle,
  reference,
}) => {
  const theme = useTheme();

  const titleAnim = textIn(frame, 5, fps, 40);
  const subAnim = textIn(frame, 20, fps, 30);
  const refAnim = textIn(frame, 40, fps, 20);
  const pulse = 0.015 * Math.sin((frame / fps) * 1.5);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% 50%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%, #050403 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            ...titleAnim,
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: 100,
            lineHeight: 1.1,
            textAlign: "center",
            letterSpacing: -3,
            background: `linear-gradient(135deg, ${theme.colors.accent1}, ${theme.colors.accent2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: `scale(${1 + pulse})`,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 120,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${theme.colors.accent1}, transparent)`,
            margin: "32px 0",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            ...subAnim,
            fontFamily: theme.fonts.display,
            fontSize: 28,
            color: theme.colors.muted,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            ...refAnim,
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 16,
            letterSpacing: 3,
            color: `${theme.colors.muted}88`,
            marginTop: 24,
          }}
        >
          {reference}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
