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
  const t = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.6 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`,
  };
};

// ─── Backdrop (template-specific background) ────────────────────────────────

export const Backdrop: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 200], [0, 1], { extrapolateRight: "clamp" });
  const x1 = interpolate(frame, [0, 300], [20, 40]);
  const y1 = interpolate(frame, [0, 300], [30, 20]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 50% 0%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 55%, #070a12 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(40% 40% at ${x1}% ${y1}%, ${theme.colors.accent1}38, transparent 70%)`, opacity: a }} />
      <AbsoluteFill style={{ background: `radial-gradient(45% 45% at 80% 85%, ${theme.colors.accent2}28, transparent 70%)`, opacity: a }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: 0.5, maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent 100%)" }} />
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
  const r = 42;
  const pct = value / max;
  const shown = Math.round(value * progress);
  return (
    <div style={{ textAlign: "center", width: 300 }}>
      <svg width={170} height={170} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pct * progress} transform="rotate(-90 50 50)" />
        <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="24" fontWeight={800} fontFamily={theme.fonts.display}>
          {shown}
          <tspan fontSize="12" fill={theme.colors.ink}>{unit}</tspan>
        </text>
      </svg>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 600, fontSize: 16, color: theme.colors.ink, marginTop: 4, lineHeight: 1.3, maxWidth: 280, margin: "4px auto 0" }}>{label}</div>
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
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 3]} intensity={1.3} color="#ffd27f" />
      <pointLight position={[-3, -2, 2]} intensity={0.9} color="#5eead4" />
      <mesh rotation={[0.5, t * 0.6, 0]}>
        <torusGeometry args={[1.5, 0.12, 18, 90]} />
        <meshStandardMaterial color={theme.colors.accent1} emissive={theme.colors.accent1} emissiveIntensity={0.45} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh rotation={[t * 0.5, t * 0.8, 0]}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial color={theme.colors.accent2} wireframe emissive={theme.colors.accent2} emissiveIntensity={0.35} />
      </mesh>
      {nodes.map((i) => {
        const a = t * 0.8 + (i * Math.PI * 2) / 5;
        const r = 2.15;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.5, Math.sin(a) * r]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color={theme.colors.accent3} emissive={theme.colors.accent3} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </>
  );
};

export const EmblemBox: React.FC<{ size?: number }> = ({ size = 460 }) => (
  <div style={{ width: size, height: size }}>
    <Sequence layout="none">
      <ThreeCanvas width={size} height={size} camera={{ position: [0, 0, 5.2], fov: 45 }}>
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
  const colors = [theme.colors.accent1, theme.colors.accent2, theme.colors.accent3, theme.colors.accent2, theme.colors.accent1];
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 6, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} intensity={0.8} color="#5eead4" />
      <gridHelper args={[10, 10, "#2a3350", "#1a2138"]} position={[0, -1.6, 0]} />
      {Array.from({ length: count }).map((_, i) => {
        const p = spring({ frame: frame - 12 - i * 7, fps, config: { damping: 12, mass: 1 } });
        const h = 0.4 + p * (1.1 + i * 0.35);
        return (
          <mesh key={i} position={[(i - (count - 1) / 2) * 1.25, -1.6 + h / 2, 0]}>
            <boxGeometry args={[0.8, h, 0.8]} />
            <meshStandardMaterial color={colors[i % colors.length]} emissive={colors[i % colors.length]} emissiveIntensity={0.25} metalness={0.4} roughness={0.4} />
          </mesh>
        );
      })}
    </>
  );
};

export const Bars3DBox: React.FC<{ count: number; width?: number; height?: number }> = ({
  count,
  width = 1344,
  height = 500,
}) => (
  <div style={{ width: "100%", height, marginTop: 6 }}>
    <Sequence layout="none">
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 1.2, 7], fov: 42 }}>
        <Bars3D count={count} />
      </ThreeCanvas>
    </Sequence>
  </div>
);
