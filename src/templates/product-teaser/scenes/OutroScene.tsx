// ---------------------------------------------------------------------------
// Product Teaser — Outro Scene
//
// Brand logo pop-in, tagline, CTA button with pulse
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { ProductTeaserOutroContent } from "../../../data/productTeaser";
import { interpolate, easeOutBack, sceneOpacity } from "../helpers";
import type { ProductTeaserTheme } from "../../../theme/productTeaser";

interface Props {
  content: ProductTeaserOutroContent;
  durationInFrames: number;
  theme: ProductTeaserTheme;
}

export const OutroScene: React.FC<Props> = ({ content, durationInFrames, theme }) => {
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
          textAlign: "center",
          padding: "0 34px",
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.sans,
          opacity,
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontWeight: 900,
            fontSize: "26px",
            letterSpacing: "-0.5px",
            transform: `scale(${interpolate(frame, [0, 18], [0.75, 1], easeOutBack)})`,
          }}
        >
          {content.logo}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "12.5px",
            color: theme.colors.textSecondary,
            marginTop: "10px",
            maxWidth: "270px",
            opacity: interpolate(frame, [16, 28], [0, 1]),
          }}
        >
          {content.tagline}
        </div>

        {/* CTA Button */}
        <button
          style={{
            marginTop: "26px",
            fontWeight: 700,
            fontSize: "13.5px",
            background: theme.colors.textPrimary,
            color: theme.colors.bg,
            padding: "11px 24px",
            borderRadius: "24px",
            border: "none",
            cursor: "pointer",
            fontFamily: theme.fonts.sans,
            opacity: interpolate(frame, [30, 42], [0, 1]),
            transform: `scale(${frame > 44 ? 1 + 0.03 * Math.sin(frame * 0.15) : 1})`,
          }}
        >
          {content.cta}
        </button>
      </div>
    </AbsoluteFill>
  );
};
