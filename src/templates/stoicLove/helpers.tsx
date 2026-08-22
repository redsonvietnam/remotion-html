// ---------------------------------------------------------------------------
// Stoic Love Template Helpers — Vertical short-form visual primitives
//
// Cinematic, intimate, philosophical visual language.
// Theme consumed via useTheme() — NOT imported directly.
// ---------------------------------------------------------------------------

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useTheme } from "../../design/theme";

const WIDTH = 1080;
const HEIGHT = 1920;
const SAFE_TOP = 180;
const SAFE_BOTTOM = 180;

// ─── Cinematic Motion ───────────────────────────────────────────────────────

export const fadeIn = (frame: number, delay: number, fps: number, duration = 30) => {
  const t = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity: t };
};

export const slideUp = (frame: number, delay: number, fps: number, distance = 60) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 24, mass: 0.4 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [distance, 0])}px)`,
  };
};

export const slideInFromLeft = (frame: number, delay: number, fps: number, distance = 80) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 22, mass: 0.5 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateX(${interpolate(t, [0, 1], [-distance, 0])}px)`,
  };
};

export const slideInFromRight = (frame: number, delay: number, fps: number, distance = 80) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 22, mass: 0.5 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateX(${interpolate(t, [0, 1], [distance, 0])}px)`,
  };
};

export const scaleIn = (frame: number, delay: number, fps: number) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 20, mass: 0.6 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `scale(${interpolate(t, [0, 1], [0.85, 1])})`,
  };
};

export const wordReveal = (
  frame: number,
  delay: number,
  fps: number,
  wordIndex: number,
  wordDelay = 8
) => slideUp(frame, delay + wordIndex * wordDelay, fps, 40);

// ─── Backdrop (Cinematic Atmosphere) ────────────────────────────────────────

export const Backdrop: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 120], [0, 1], { extrapolateRight: "clamp" });
  const pulse = Math.sin(frame / 40) * 0.1 + 0.9;
  const x1 = interpolate(frame, [0, 500], [20, 40]);
  const y1 = interpolate(frame, [0, 500], [30, 15]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(140% 140% at 50% -20%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 70%, #040405 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 60% at ${x1}% ${y1}%, ${theme.colors.accent2}15, transparent 70%)`,
          opacity: a * pulse,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 50% at 85% 90%, ${theme.colors.accent3}10, transparent 70%)`,
          opacity: a * 0.7,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,250,240,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,250,240,0.015) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          opacity: 0.3,
          maskImage: "radial-gradient(100% 100% at 50% 50%, black, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Vertical Divider ───────────────────────────────────────────────────────

export const VerticalDivider: React.FC<{ height?: number; color?: string }> = ({
  height = 80,
  color,
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        width: 2,
        height,
        background: `linear-gradient(180deg, transparent, ${color || theme.colors.accent2}, transparent)`,
        margin: "0 auto",
      }}
    />
  );
};

// ─── Horizontal Rule ────────────────────────────────────────────────────────

export const HorizontalRule: React.FC<{ width?: number; color?: string }> = ({
  width = 120,
  color,
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        width,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color || theme.colors.accent2}, transparent)`,
        margin: "16px auto",
      }}
    />
  );
};

// ─── Gradual Light Sweep ─────────────────────────────────────────────────────

export const LightSweep: React.FC<{ frame: number; fps: number; color?: string }> = ({
  frame,
  fps,
  color,
}) => {
  const theme = useTheme();
  const t = (frame / fps) % 8;
  const progress = t / 8;
  const y = interpolate(progress, [0, 1], [-HEIGHT * 0.5, HEIGHT * 1.5]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -WIDTH,
          top: y,
          width: WIDTH * 3,
          height: 200,
          background: `linear-gradient(180deg, transparent, ${color || theme.colors.accent2}08, transparent)`,
          transform: "rotate(-15deg)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Blur Reveal ────────────────────────────────────────────────────────────

export const BlurReveal: React.FC<{
  frame: number;
  delay: number;
  fps: number;
  children: React.ReactNode;
  duration?: number;
}> = ({ frame, delay, fps, children, duration = 40 }) => {
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(progress, [0, 1], [40, 0]);
  const opacity = progress;
  return (
    <div
      style={{
        filter: `blur(${blur}px)`,
        opacity,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ─── Safe Area Container ────────────────────────────────────────────────────

export const SafeContainer: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: SAFE_TOP,
      paddingBottom: SAFE_BOTTOM,
      paddingLeft: 60,
      paddingRight: 60,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// ─── Fade Transition ────────────────────────────────────────────────────────

export const fadeTransition = (frame: number, duration: number) => {
  const t = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity: 1 - t };
};