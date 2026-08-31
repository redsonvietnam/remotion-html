// ---------------------------------------------------------------------------
// BentoScene — Glassmorphism bento grid with staggered card reveal
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import {
  interpolate,
  easeOutCubic,
  easeOutBack,
  sceneOpacity,
  clamp,
  MiniChart,
} from "../helpers";
import type { BentoGridBentoContent } from "../types";

export type BentoSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & BentoGridBentoContent;

const CARD_IDS = ["stat", "feature1", "feature2", "chart", "quote", "palette"] as const;

const HERO_ZOOM_START = 130;
const HERO_ZOOM_HOLD = 155;
const HERO_ZOOM_BACK = 180;
const HERO_ZOOM_END = 200;

const cardStyle = (theme: ReturnType<typeof useTheme>): React.CSSProperties => ({
  background: theme.colors.card,
  WebkitBackdropFilter: "blur(14px)",
  backdropFilter: "blur(14px)",
  border: `1px solid ${theme.colors.line}`,
  borderRadius: 18,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 24px rgba(0,0,0,0.3)",
  padding: "12px 13px",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

export const BentoSceneData: React.FC<BentoSceneProps> = ({
  frame,
  fps,
  dur,
  title,
  stat,
  feature1,
  feature2,
  chart,
  quote,
  palette,
}) => {
  const theme = useTheme();
  const opacity = sceneOpacity(frame, Math.round(dur * fps));

  // Title fade
  const titleOpacity = interpolate(frame, [0, 12], [0, 1]);

  // Counter animation
  const statProgress = interpolate(frame, [16, 40], [0, stat.value], easeOutCubic);
  const statDisplay = Math.round(statProgress) + stat.suffix;

  // Chart animation
  const chartStart = 46;
  const chartDrawDur = 40;
  const chartProgress = interpolate(frame, [chartStart, chartStart + chartDrawDur], [0, 1], easeOutCubic);

  // Card reveal configurations
  const cardReveals = CARD_IDS.map((id, i) => {
    const start = 10 + i * 10;
    const reveal = interpolate(frame, [start, start + 18], [0, 1], easeOutBack);
    const fade = interpolate(frame, [start, start + 14], [0, 1]);
    const rotate = interpolate(frame, [start, start + 18], [-2.5, 0]);
    let scale = Math.max(0, reveal);
    let zIndex = 1;
    let boxShadow: string | undefined;

    if (id === "stat") {
      const zoomIn = interpolate(frame, [HERO_ZOOM_START, HERO_ZOOM_HOLD], [1, 1.12], easeOutCubic);
      const zoomOut = interpolate(frame, [HERO_ZOOM_BACK, HERO_ZOOM_END], [1.12, 1], easeOutCubic);
      const heroScale =
        frame < HERO_ZOOM_HOLD ? zoomIn : frame < HERO_ZOOM_BACK ? 1.12 : zoomOut;
      scale = scale * (frame >= HERO_ZOOM_START ? heroScale : 1);
      zIndex =
        frame >= HERO_ZOOM_START && frame < HERO_ZOOM_END ? 5 : 1;
      boxShadow =
        frame >= HERO_ZOOM_START && frame < HERO_ZOOM_END
          ? "0 20px 50px rgba(124,92,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
          : "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 24px rgba(0,0,0,0.3)";
    }

    return { id, opacity: fade, scale, rotate, zIndex, boxShadow };
  });

  const getCardStyle = (id: string) => {
    const r = cardReveals.find((c) => c.id === id)!;
    const base: React.CSSProperties = {
      ...cardStyle(theme),
      opacity: r.opacity,
      transform: `scale(${r.scale}) rotate(${r.rotate}deg)`,
      zIndex: r.zIndex,
    };
    if (r.boxShadow) base.boxShadow = r.boxShadow;
    return base;
  };

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        padding: "56px 16px 0",
        opacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 3,
          color: theme.colors.muted,
          textTransform: "uppercase",
          marginBottom: 14,
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: 64,
          gap: 9,
          position: "relative",
        }}
      >
        {/* Card: Stat (2×2) */}
        <div style={{ ...getCardStyle("stat"), gridColumn: "1/3", gridRow: "1/3", alignItems: "flex-start" }}>
          <div style={{ fontWeight: 900, fontSize: 38, letterSpacing: -1, color: theme.colors.ink }}>
            {statDisplay}
          </div>
          <div style={{ fontSize: 11, color: theme.colors.muted, marginTop: 4 }}>
            {stat.label}
          </div>
        </div>

        {/* Card: Feature1 (2×1) */}
        <div style={{ ...getCardStyle("feature1"), gridColumn: "3/5", gridRow: "1/2" }}>
          <div style={{ fontSize: 17 }}>{feature1.icon}</div>
          <div style={{ fontSize: 11.5, fontWeight: 700, marginTop: 4, color: theme.colors.ink }}>
            {feature1.title}
          </div>
        </div>

        {/* Card: Feature2 (1×1) */}
        <div style={{ ...getCardStyle("feature2"), gridColumn: "3/4", gridRow: "2/3", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: 20 }}>{feature2.icon}</div>
        </div>

        {/* Card: Chart (1×1) */}
        <div style={{ ...getCardStyle("chart"), gridColumn: "4/5", gridRow: "2/3" }}>
          <MiniChart points={chart.points} progress={chartProgress} />
        </div>

        {/* Card: Quote (3×1) */}
        <div style={{ ...getCardStyle("quote"), gridColumn: "1/4", gridRow: "3/4", justifyContent: "center" }}>
          <div style={{ fontSize: 11.5, fontStyle: "italic", lineHeight: 1.4, color: theme.colors.ink }}>
            &ldquo;{quote.text}&rdquo;
          </div>
          <div style={{ fontSize: 9.5, color: theme.colors.muted, marginTop: 4 }}>
            {quote.author}
          </div>
        </div>

        {/* Card: Palette (1×1) */}
        <div style={{ ...getCardStyle("palette"), gridColumn: "4/5", gridRow: "3/4", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {palette.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  background: c,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
