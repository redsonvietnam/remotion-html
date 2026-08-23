// ---------------------------------------------------------------------------
// HeroScene — Opening: name + tagline
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn, reveal } from "../helpers";
import type { CR7HeroContent } from "../types";

export type HeroSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CR7HeroContent;

export const HeroSceneData: React.FC<HeroSceneProps> = ({
  frame,
  fps,
  name,
  tagline,
  subtitle,
}) => {
  const theme = useTheme();

  const nameAnim = textIn(frame, 0, fps, 50);
  const tagAnim = textIn(frame, 15, fps, 40);
  const subAnim = textIn(frame, 30, fps, 30);
  const pulse = 0.03 * Math.sin((frame / fps) * 1.8);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% 50%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%, #050403 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 50% at 50% 45%, ${theme.colors.accent1}10, transparent 70%)`,
        }}
      />
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
            ...tagAnim,
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 14,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: theme.colors.accent1,
            marginBottom: 24,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            ...nameAnim,
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: 120,
            lineHeight: 1.0,
            textAlign: "center",
            letterSpacing: -4,
            color: theme.colors.ink,
            transform: `scale(${1 + pulse})`,
          }}
        >
          {name}
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
            fontSize: 26,
            color: theme.colors.muted,
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
