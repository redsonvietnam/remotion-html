// ---------------------------------------------------------------------------
// TitleScene — Opening: title + subtitle + cosmic intro
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn, starTwinkle } from "../helpers";
import type { CosmosTitleContent } from "../types";

export type TitleSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CosmosTitleContent;

export const TitleSceneData: React.FC<TitleSceneProps> = ({
  frame,
  fps,
  title,
  subtitle,
  tagline,
}) => {
  const theme = useTheme();

  const titleAnim = textIn(frame, 0, fps, 50);
  const subtitleAnim = textIn(frame, 15, fps, 40);
  const tagAnim = textIn(frame, 30, fps, 30);
  const pulse = 0.02 * Math.sin((frame / fps) * 1.5);

  // Star field
  const stars = Array.from({ length: 50 }, (_, i) => ({
    x: (i * 137.508) % 100,
    y: (i * 73.137) % 100,
    size: 1 + (i % 3),
    twinkle: starTwinkle(frame, fps, 0.5 + (i % 3) * 0.3),
  }));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% 50%, #0a0a2e 0%, #050510 60%, #000005 100%)`,
      }}
    >
      {/* Star field */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            background: "#ffffff",
            opacity: star.twinkle,
          }}
        />
      ))}

      {/* Nebula glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(50% 50% at 50% 45%, ${theme.colors.accent1}15, transparent 70%)`,
        }}
      />

      {/* Content */}
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
            ...titleAnim,
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: 100,
            lineHeight: 1.0,
            textAlign: "center",
            letterSpacing: -3,
            color: theme.colors.ink,
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
            ...subtitleAnim,
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
