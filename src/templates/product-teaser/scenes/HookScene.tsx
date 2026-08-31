// ---------------------------------------------------------------------------
// Product Teaser — Hook Scene
//
// First scene: Kicker tag + title + subtitle
// Animation: fade + slide transitions
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useCurrentFrame } from "remotion";
import type { ProductTeaserHookContent } from "../../../data/productTeaser";
import { interpolate, easeOutCubic, sceneOpacity } from "../helpers";
import type { ProductTeaserTheme } from "../../../theme/productTeaser";

interface Props {
  content: ProductTeaserHookContent;
  durationInFrames: number;
  theme: ProductTeaserTheme;
}

export const HookScene: React.FC<Props> = ({ content, durationInFrames, theme }) => {
  const frame = useCurrentFrame();

  const opacity = sceneOpacity(frame, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0 30px",
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.sans,
          opacity,
        }}
      >
        {/* Kicker tag */}
        <div
          style={{
            display: "inline-block",
            fontFamily: theme.fonts.mono,
            fontSize: "11px",
            letterSpacing: "3px",
            color: theme.colors.accent,
            padding: "5px 12px",
            border: `1px solid ${theme.colors.accentSoft}`,
            borderRadius: "20px",
            backgroundColor: theme.colors.accentSoft,
            textTransform: "uppercase",
            opacity: interpolate(frame, [0, 10], [0, 1]),
            marginBottom: "18px",
          }}
        >
          {content.kicker}
        </div>

        {/* Main title */}
        <h1
          style={{
            fontWeight: 800,
            fontSize: "32px",
            lineHeight: 1.25,
            letterSpacing: "-0.5px",
            margin: 0,
            textAlign: "center",
            opacity: interpolate(frame, [6, 22], [0, 1]),
            transform: `translateY(${interpolate(frame, [6, 22], [14, 0], easeOutCubic)}px)`,
          }}
        >
          {content.title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "14.5px",
            color: theme.colors.textSecondary,
            marginTop: "12px",
            lineHeight: 1.5,
            maxWidth: "290px",
            textAlign: "center",
            opacity: interpolate(frame, [20, 32], [0, 1]),
          }}
        >
          {content.subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};
