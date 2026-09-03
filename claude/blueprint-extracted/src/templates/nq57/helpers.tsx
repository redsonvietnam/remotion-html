// ---------------------------------------------------------------------------
// NQ57 Template Helpers — Template-specific visual components
//
// These are NOT reusable. They belong to the NQ57 template only.
// Reusable primitives are in src/design/.
// Theme: consumed via useTheme() — not imported directly
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

// ─── fadeUp (template-specific motion) ──────────────────────────────────────

export const fadeUp = (frame: number, delay: number, fps: number) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 20, mass: 0.5 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [30, 0])}px)`,
  };
};

// ─── fadeIn (gentle fade for DeAn06) ────────────────────────────────────────

export const fadeIn = (frame: number, delay: number, fps: number, duration = 20) => {
  const t = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity: t };
};

// ─── slideUp (for staggered text) ───────────────────────────────────────────

export const slideUp = (frame: number, delay: number, fps: number, distance = 20) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 22, mass: 0.4 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [distance, 0])}px)`,
  };
};

// ─── Backdrop (template-specific background) ────────────────────────────────

export const Backdrop: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 180], [0, 1], { extrapolateRight: "clamp" });
  const x1 = interpolate(frame, [0, 400], [15, 35]);
  const y1 = interpolate(frame, [0, 400], [25, 15]);
  const pulse = Math.sin(frame / 30) * 0.15 + 0.85;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% -10%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%, #030812 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 50% at ${x1}% ${y1}%, ${theme.colors.accent1}25, transparent 70%)`,
          opacity: a * pulse,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 60% at 85% 90%, ${theme.colors.accent2}20, transparent 70%)`,
          opacity: a * 0.8,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at 15% 85%, ${theme.colors.accent3}12, transparent 70%)`,
          opacity: a * 0.6,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.4,
          maskImage: "radial-gradient(90% 90% at 50% 50%, black, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Gauge (template-specific stat gauge) ───────────────────────────────────

export const Gauge: React.FC<{
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  progress: number;
}> = ({ value, max, label, unit, color, progress }) => {
  const theme = useTheme();
  const r = 48;
  const pct = value / max;
  const shown = Math.round(value * progress);
  return (
    <div style={{ textAlign: "center", width: 340 }}>
      <svg width={190} height={190} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={theme.colors.accent1} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={10} />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={10}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - pct * progress}
          transform="rotate(-90 50 50)"
          filter="drop-shadow(0 0 8px rgba(0,212,255,0.4))"
        />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          dominantBaseline="central"
          fill={theme.colors.ink}
          fontSize="28"
          fontWeight={800}
          fontFamily={theme.fonts.display}
        >
          {shown}
          <tspan fontSize="14" fill={theme.colors.muted} x="50" dy="22">
            {unit}
          </tspan>
        </text>
      </svg>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 600,
          fontSize: 15,
          color: theme.colors.ink,
          marginTop: 10,
          lineHeight: 1.4,
          maxWidth: 300,
          margin: "10px auto 0",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ─── Emblem3D (template-specific Three.js emblem) ──────────────────────────

const Emblem3D: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const t = frame / 30;
  const nodes = [0, 1, 2, 3, 4];
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.4} color="#66e0ff" />
      <pointLight position={[-3, -2, 2]} intensity={1.0} color="#00ffcc" />
      <pointLight position={[0, 4, -3]} intensity={0.8} color="#0099cc" />
      <mesh rotation={[0.4, t * 0.5, 0]}>
        <torusGeometry args={[1.6, 0.1, 24, 100]} />
        <meshStandardMaterial
          color={theme.colors.accent1}
          emissive={theme.colors.accent1}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[t * 0.4, t * 0.7, 0]}>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial
          color={theme.colors.accent2}
          wireframe
          emissive={theme.colors.accent2}
          emissiveIntensity={0.4}
        />
      </mesh>
      {nodes.map((i) => {
        const a = t * 0.7 + (i * Math.PI * 2) / 5;
        const r = 2.3;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 1.2) * 0.6, Math.sin(a) * r]}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshStandardMaterial
              color={theme.colors.accent3}
              emissive={theme.colors.accent3}
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const EmblemBox: React.FC<{ size?: number }> = ({ size = 460 }) => (
  <div style={{ width: size, height: size }}>
    <Sequence layout="none">
      <ThreeCanvas width={size} height={size} camera={{ position: [0, 0, 5.5], fov: 42 }}>
        <Emblem3D />
      </ThreeCanvas>
    </Sequence>
  </div>
);

// ─── Bars3D (template-specific Three.js bars) ──────────────────────────────

const Bars3D: React.FC<{ count: number }> = ({ count }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;
  const colors = [
    theme.colors.accent1,
    theme.colors.accent2,
    theme.colors.accent3,
    theme.colors.accent2,
    theme.colors.accent1,
  ];
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 6, 5]} intensity={1.3} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} intensity={0.9} color="#00ffcc" />
      <gridHelper args={[10, 10, "#1a2a4a", "#0a1628"]} position={[0, -1.6, 0]} />
      {Array.from({ length: count }).map((_, i) => {
        const p = spring({ frame: frame - 10 - i * 6, fps, config: { damping: 14, mass: 0.9 } });
        const h = 0.35 + p * (1.3 + i * 0.4);
        return (
          <mesh key={i} position={[(i - (count - 1) / 2) * 1.3, -1.6 + h / 2, 0]}>
            <boxGeometry args={[0.85, h, 0.85]} />
            <meshStandardMaterial
              color={colors[i % colors.length]}
              emissive={colors[i % colors.length]}
              emissiveIntensity={0.35}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const Bars3DBox: React.FC<{ count: number; width?: number; height?: number }> = ({
  count,
  width = 1400,
  height = 540,
}) => (
  <div style={{ width: "100%", height, marginTop: 12 }}>
    <Sequence layout="none">
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 1.0, 7.5], fov: 40 }}>
        <Bars3D count={count} />
      </ThreeCanvas>
    </Sequence>
  </div>
);

// ─── RingPulse (for emphasis moments) ──────────────────────────────────────

export const RingPulse: React.FC<{
  frame: number;
  fps: number;
  triggerFrame: number;
  duration: number;
  size: number;
  color: string;
}> = ({ frame, fps, triggerFrame, duration, size, color }) => {
  const progress = interpolate(frame, [triggerFrame, triggerFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (progress <= 0 || progress >= 1) return null;
  const scale = interpolate(progress, [0, 1], [0.8, 1.6]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0.6, 1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        width: size * scale,
        height: size * scale,
        border: `3px solid ${color}`,
        borderRadius: "50%",
        opacity,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        left: "50%",
        top: "50%",
      }}
    />
  );
};