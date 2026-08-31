// ---------------------------------------------------------------------------
// FeaturesScene — SVG icon draw-in rows with stroke-dashoffset
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { interpolate, sceneOpacity, FeatureRow } from "../helpers";
import { ICON_PATHS } from "../../../theme/featureDrop";
import type { FeatureDropFeaturesContent } from "../types";

export type FeaturesSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & FeatureDropFeaturesContent;

const ACCENT_COLORS = ["#7c5cff", "#3ddcff", "#ffffff"];

export const FeaturesSceneData: React.FC<FeaturesSceneProps> = ({
  frame,
  fps,
  dur,
  items,
}) => {
  const theme = useTheme();
  const total = Math.round(dur * fps);
  const opacity = sceneOpacity(frame, total);
  const titleOp = interpolate(frame, [0, 12], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        padding: "64px 26px 0",
        opacity,
        zIndex: 5,
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 3,
          color: "rgba(245,244,250,0.5)",
          marginBottom: 20,
          opacity: titleOp,
        }}
      >
        3 TÍNH NĂNG NỔI BẬT
      </div>

      {items.map((item, i) => {
        const start = 12 + i * 36;
        return (
          <FeatureRow
            key={i}
            iconPath={ICON_PATHS[item.icon] ?? ""}
            label={item.label}
            sub={item.sub}
            frame={frame}
            delay={start}
            accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
          />
        );
      })}
    </AbsoluteFill>
  );
};
