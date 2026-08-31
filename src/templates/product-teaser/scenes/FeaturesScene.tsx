// ---------------------------------------------------------------------------
// Product Teaser — Features Scene
//
// 3 feature cards with icon, title, description
// Animation: slide + fade with stagger
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { ProductTeaserFeaturesContent } from "../../../data/productTeaser";
import { interpolate, easeOutCubic, sceneOpacity } from "../helpers";
import type { ProductTeaserTheme } from "../../../theme/productTeaser";

interface Props {
  content: ProductTeaserFeaturesContent;
  durationInFrames: number;
  theme: ProductTeaserTheme;
}

export const FeaturesScene: React.FC<Props> = ({ content, durationInFrames, theme }) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <div
        style={{
          padding: "70px 24px 0",
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.sans,
          opacity,
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontWeight: 800,
            fontSize: "20px",
            textAlign: "center",
            marginBottom: "26px",
            opacity: interpolate(frame, [0, 14], [0, 1]),
          }}
        >
          {content.title}
        </h2>

        {/* Feature Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {content.features.map((feature, i) => {
            const start = 16 + i * 14;
            const cardOpacity = interpolate(frame, [start, start + 14], [0, 1]);
            const cardTransform = `translateX(${interpolate(frame, [start, start + 14], [-18, 0], easeOutCubic)}px)`;

            return (
              <div
                key={feature.title}
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "16px",
                  padding: "16px",
                  opacity: cardOpacity,
                  transform: cardTransform,
                }}
              >
                {/* Icon */}
                <div style={{ fontSize: "18px", flex: "none", marginTop: "2px" }}>{feature.icon}</div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
                    {feature.title}
                  </div>
                  <div style={{ fontSize: "12px", color: theme.colors.textSecondary, lineHeight: 1.45 }}>
                    {feature.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
