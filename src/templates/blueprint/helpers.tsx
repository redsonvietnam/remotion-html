// ---------------------------------------------------------------------------
// Blueprint Template Helpers — landscape (1920x1080) drafting-board layout
//
// These are NOT reusable outside this template. Reusable SVG primitives and
// the motion vocabulary live in ./svg. Theme: consumed via useTheme().
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useTheme } from "../../design/theme";
import { Grid } from "./svg";
import { sp, ramp } from "./svg/motion";

const WIDTH = 1920;
const HEIGHT = 1080;

// ─── Backdrop — the drafting table ─────────────────────────────────────────
// The grid is the continuity device: it is the same object across every
// scene in the template, only ever drifting, never resetting.

export const Backdrop: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const vignette = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at 50% 8%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 62%, #050d1c 100%)`,
      }}
    >
      <Grid width={WIDTH} height={HEIGHT} color={theme.colors.accent1} />
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 260px 60px ${theme.colors.bg}`,
          opacity: vignette,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── SafeContainer — landscape safe margins ────────────────────────────────

export const SafeContainer: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "6% 8% 9%",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// ─── DOM motion wrappers (mirror svg/motion categories for HTML elements) ──

export const snapUp = (frame: number, delay: number, fps: number, distance = 26) => {
  const t = sp(frame, delay, fps, "snap");
  return {
    opacity: Math.min(ramp(frame, delay, delay + 14, 0, 1), 1),
    transform: `translateY(${interpolate(t, [0, 1], [distance, 0])}px)`,
  };
};

export const settleIn = (frame: number, delay: number, fps: number, distance = 14) => {
  const t = sp(frame, delay, fps, "settle");
  return {
    opacity: interpolate(t, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(t, [0, 1], [distance, 0])}px)`,
  };
};

// ─── EyebrowLabel — small tracked drafting-style annotation label ──────────

export const EyebrowLabel: React.FC<{
  text: string;
  color: string;
  fontFamily: string;
  style?: React.CSSProperties;
}> = ({ text, color, fontFamily, style }) => (
  <div
    style={{
      fontFamily,
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: 7,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {text}
  </div>
);

export const WIDTH_H = WIDTH;
export const HEIGHT_H = HEIGHT;
