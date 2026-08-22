// ---------------------------------------------------------------------------
// NodeFlow Template Helpers — Motion vocabulary + shared visual primitives
//
// Visual grammar:
//   - Blueprint grid background (slow pan)
//   - Node reveal: scale + opacity (not just fade)
//   - Edge draw: stroke-dashoffset reveal
//   - Signal propagation: travelling dot
//   - Typography: uppercase monospace labels, large amber numbers
//   - Scene container: consistent safe-padding
//
// All primitives are template-private. Reusable design-system pieces
// are consumed from src/design/.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useTheme } from "../../design/theme";
import { GridBackground } from "./svg";

// ─── Canvas dimensions ───────────────────────────────────────────────────────

export const W = 1920;
export const H = 1080;
export const PAD_X = 100;
export const PAD_Y = 80;

// ─── Motion utilities ────────────────────────────────────────────────────────

/** Node pops in from scale 0.85 with opacity. */
export const nodeIn = (frame: number, delay: number, fps: number) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 20, mass: 0.6, stiffness: 160 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `scale(${interpolate(t, [0, 1], [0.82, 1])})`,
  };
};

/** Text slides in from 30px below with spring. */
export const textIn = (frame: number, delay: number, fps: number, distance = 30) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 22, mass: 0.4 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [distance, 0])}px)`,
  };
};

/** Linear reveal: 0→1 over `duration` frames starting at `delay`. */
export const reveal = (frame: number, delay: number, duration: number): number =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Edge draw progress — smooth linear. */
export const edgeDraw = (frame: number, delay: number, duration = 20) =>
  reveal(frame, delay, duration);

/** Number count-up. Returns current displayed integer. */
export const countUp = (frame: number, delay: number, duration: number, target: number): number => {
  const p = reveal(frame, delay, duration);
  return Math.round(p * target);
};

// ─── Backdrop — blueprint dark navy substrate ────────────────────────────────

export const Backdrop: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  // Slow radial drift in corner to keep the scene alive
  const a = interpolate(frame, [0, 200], [0, 1], { extrapolateRight: "clamp" });
  const x1 = 10 + Math.sin(frame / 180) * 5;
  const y1 = 8 + Math.cos(frame / 240) * 4;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at 50% -5%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 55%, #020408 100%)`,
      }}
    >
      {/* Faint cyan glow top-left (signal source) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at ${x1}% ${y1}%, ${theme.colors.accent1}18, transparent 70%)`,
          opacity: a * 0.7,
        }}
      />
      {/* Faint amber glow bottom-right (data field) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(35% 35% at 88% 88%, ${theme.colors.accent2}12, transparent 70%)`,
          opacity: a * 0.5,
        }}
      />
      {/* Blueprint grid */}
      <GridBackground width={W} height={H} frame={frame} cellSize={60} majorEvery={5} opacity={0.9} />
    </AbsoluteFill>
  );
};

// ─── SceneContainer — full-canvas padded content area ────────────────────────

export const SceneContainer: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill
    style={{
      paddingTop: PAD_Y,
      paddingBottom: PAD_Y,
      paddingLeft: PAD_X,
      paddingRight: PAD_X,
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// ─── SectionLabel — small uppercase monospace section identifier ──────────────

export const SectionLabel: React.FC<{
  text: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, color, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono ?? theme.fonts.display,
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: color ?? theme.colors.muted,
        marginBottom: 12,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ─── LawBadge — decorative law reference label ───────────────────────────────

export const LawBadge: React.FC<{
  text: string;
  style?: React.CSSProperties;
}> = ({ text, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 16px",
        borderRadius: 4,
        border: `1px solid ${theme.colors.accent1}40`,
        background: `${theme.colors.accent1}08`,
        fontFamily: theme.fonts.mono ?? theme.fonts.display,
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: 2,
        color: theme.colors.accent1,
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.colors.accent1, display: "inline-block" }} />
      {text}
    </div>
  );
};

// ─── HRule — thin horizontal rule ────────────────────────────────────────────

export const HRule: React.FC<{ color?: string; opacity?: number }> = ({ color, opacity = 0.3 }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        width: "100%",
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color ?? theme.colors.accent1}80, transparent)`,
        opacity,
        margin: "16px 0",
      }}
    />
  );
};

// ─── SignalIndicator — blinking status dot (top-right corner) ────────────────

export const SignalIndicator: React.FC<{
  label?: string;
  frame: number;
}> = ({ label = "LIVE", frame }) => {
  const theme = useTheme();
  const blink = Math.sin(frame / 12) > 0 ? 1 : 0.35;
  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        right: 80,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: theme.fonts.mono ?? theme.fonts.display,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: 3,
        color: theme.colors.accent3,
        opacity: 0.7,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: theme.colors.accent3,
          opacity: blink,
          display: "inline-block",
        }}
      />
      {label}
    </div>
  );
};
