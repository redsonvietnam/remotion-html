// ---------------------------------------------------------------------------
// ClosingScene — Final summary with constellation pattern
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn, constellationDraw, starTwinkle } from "../helpers";
import type { CosmosClosingContent } from "../types";

export type ClosingSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CosmosClosingContent;

export const ClosingSceneData: React.FC<ClosingSceneProps> = ({
  frame,
  fps,
  title,
  subtitle,
  stats,
  reference,
}) => {
  const theme = useTheme();

  const titleAnim = textIn(frame, 5, fps, 40);
  const subtitleAnim = textIn(frame, 20, fps, 30);
  const refAnim = textIn(frame, 40, fps, 20);

  const pulse = 0.015 * Math.sin((frame / fps) * 1.5);

  // Constellation pattern
  const constellationProgress = constellationDraw(frame, 10, 40);

  // Star field
  const stars = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 137.508) % 100,
    y: (i * 73.137) % 100,
    size: 1 + (i % 2),
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

      {/* Constellation lines */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {/* Decorative constellation */}
        <line
          x1="200"
          y1="200"
          x2={200 + 300 * constellationProgress}
          y2={200 + 100 * constellationProgress}
          stroke={theme.colors.accent1}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
        <line
          x1="1600"
          y1="200"
          x2={1600 - 300 * constellationProgress}
          y2={200 + 100 * constellationProgress}
          stroke={theme.colors.accent2}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
        <line
          x1="200"
          y1="800"
          x2={200 + 300 * constellationProgress}
          y2={800 - 100 * constellationProgress}
          stroke={theme.colors.accent3}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
        <line
          x1="1600"
          y1="800"
          x2={1600 - 300 * constellationProgress}
          y2={800 - 100 * constellationProgress}
          stroke={theme.colors.accent1}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
      </svg>

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Stats */}
        {stats.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 48,
              marginBottom: 48,
            }}
          >
            {stats.map((stat, i) => {
              const statAnim = textIn(frame, 15 + i * 10, fps, 30);
              return (
                <div
                  key={i}
                  style={{
                    ...statAnim,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px 32px",
                    background: `${theme.colors.card}80`,
                    borderRadius: 12,
                    border: `1px solid ${theme.colors.line}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: theme.fonts.display,
                      fontWeight: 900,
                      fontSize: 48,
                      color: theme.colors.accent1,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fonts.display,
                      fontSize: 16,
                      color: theme.colors.muted,
                      marginTop: 8,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            ...titleAnim,
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: 80,
            lineHeight: 1.1,
            textAlign: "center",
            letterSpacing: -2,
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

        {/* Subtitle */}
        <div
          style={{
            ...subtitleAnim,
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

        {/* Reference */}
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
