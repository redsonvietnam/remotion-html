// ---------------------------------------------------------------------------
// Stoic Love — Custom SVG Visual Language
//
// ONE design system for the whole journey. Consistent stroke, glow, color,
// motion. Every component is typed, composable, frame-driven.
//
// Color roles (from theme):
//   love   = accent1  (ivory)   — love / light / freedom
//   struct = accent2  (gold)    — structure / control / attachment
//   drift  = accent3  (bronze)  — the world that drifts beyond our control
// ---------------------------------------------------------------------------

import React from "react";
import { useId } from "react";
import { useTheme } from "../../../design/theme";
import { rot } from "./motion";

export const HEART_PATH =
  "M50 84 C 50 84, 12 58, 12 36 C 12 20 28 12 40 22 C 46 27 50 33 50 33 C 50 33, 54 27 60 22 C 72 12 88 20 88 36 C 88 58 50 84 50 84 Z";

const VB = 100;

interface BaseProps {
  frame: number;
  fps: number;
  size?: number;
  love?: string;
  struct?: string;
  drift?: string;
  line?: string;
}

function usePalette(p: Partial<BaseProps>) {
  const theme = useTheme();
  return {
    love: p.love ?? theme.colors.accent1,
    struct: p.struct ?? theme.colors.accent2,
    drift: p.drift ?? theme.colors.accent3,
    line: p.line ?? theme.colors.line,
    ink: theme.colors.ink,
    muted: theme.colors.muted,
  };
}

function Glow({ id, color }: { id: string; color: string }) {
  return (
    <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor={color} floodOpacity="0.85" />
    </filter>
  );
}

function HeartGlyph({
  love,
  struct,
  id,
  glow = true,
  scale = 1,
}: {
  love: string;
  struct: string;
  id: string;
  glow?: boolean;
  scale?: number;
}) {
  return (
    <g
      transform={`translate(50 50) scale(${scale}) translate(-50 -50)`}
      filter={glow ? `url(#${id})` : undefined}
    >
      <path d={HEART_PATH} fill={`url(#hg${id})`} />
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={love} />
          <stop offset="72%" stopColor={struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={struct} stopOpacity={0.25} />
        </radialGradient>
      </defs>
    </g>
  );
}

// ─── HeartShape ───────────────────────────────────────────────────────────────
export const HeartShape: React.FC<
  BaseProps & { glow?: boolean; beat?: boolean; scale?: number }
> = ({ frame, fps, size = 200, glow = true, beat = true, scale = 1, ...rest }) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const b = beat ? 1 + Math.sin((frame / fps) * 1.6) * 0.02 : 1;
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
      </defs>
      <HeartGlyph love={c.love} struct={c.struct} id={`g${id}`} glow={glow} scale={scale * b} />
    </svg>
  );
};

// ─── OrbitField — LOVE → ATTACHMENT → FEAR (orbit tightens) ───────────────────
export const OrbitField: React.FC<BaseProps & { amount?: number; showHeart?: boolean }> = ({
  frame,
  fps,
  size = 340,
  amount = 0,
  showHeart = true,
  ...rest
}) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const r = 40 - amount * 22;
  const speed = 14 + amount * 60;
  const a = (rot(frame, fps, speed) * Math.PI) / 180;
  const N = 8;
  const dots = Array.from({ length: N }).map((_, i) => {
    const ang = a + (i / N) * Math.PI * 2;
    return { x: 50 + Math.cos(ang) * r, y: 50 + Math.sin(ang) * r };
  });
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
      </defs>
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={c.struct}
        strokeWidth={amount > 0.5 ? 1.4 : 1}
        strokeOpacity={0.5}
        strokeDasharray="2 5"
      />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.6 + amount * 0.8} fill={c.struct} opacity={0.9} />
      ))}
      {showHeart && <HeartGlyph love={c.love} struct={c.struct} id={`g${id}`} scale={0.42} />}
    </svg>
  );
};

// ─── ControlOrbital — LOVE vs CONTROL (lines wrap then release) ───────────────
export const ControlOrbital: React.FC<BaseProps & { amount?: number }> = ({
  frame,
  fps,
  size = 340,
  amount = 0,
  ...rest
}) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const N = 6;
  const radii = Array.from({ length: N }).map((_, i) => 34 + i * 5 - amount * 16);
  const a = (rot(frame, fps, 6) * Math.PI) / 180;
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
      </defs>
      {radii.map((r, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={Math.max(10, r)}
          fill="none"
          stroke={c.drift}
          strokeWidth={1}
          strokeOpacity={0.25 + amount * 0.45}
          strokeDasharray={`${8 - amount * 4} ${6 - amount * 3}`}
        />
      ))}
      <g opacity={amount}>
        {Array.from({ length: N }).map((_, i) => {
          const ang = a + (i / N) * Math.PI * 2;
          const r = 30;
          const x = 50 + Math.cos(ang) * r;
          const y = 50 + Math.sin(ang) * r;
          return (
            <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={c.drift} strokeWidth={0.8} strokeOpacity={0.5} />
          );
        })}
      </g>
      <HeartGlyph love={c.love} struct={c.struct} id={`g${id}`} scale={0.42} />
    </svg>
  );
};

// ─── Separation — two orbits part; self-core remains ──────────────────────────
export const Separation: React.FC<BaseProps & { amount?: number }> = ({
  frame,
  fps,
  size = 360,
  amount = 0,
  ...rest
}) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const sep = amount * 26;
  const a1 = (rot(frame, fps, 16) * Math.PI) / 180;
  const a2 = (rot(frame, fps, -10) * Math.PI) / 180;
  const self = { x: 50 - sep, y: 50 };
  const other = { x: 50 + sep, y: 50 };
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
        <Glow id={`gd${id}`} color={c.drift} />
      </defs>
      <line
        x1={self.x}
        y1={self.y}
        x2={other.x}
        y2={other.y}
        stroke={c.line}
        strokeWidth={1}
        strokeOpacity={1 - amount}
      />
      <circle cx={self.x} cy={self.y} r="13" fill="none" stroke={c.love} strokeWidth={1} strokeOpacity={0.7} />
      <circle cx={self.x + Math.cos(a1) * 9} cy={self.y + Math.sin(a1) * 9} r="1.6" fill={c.love} />
      <circle
        cx={other.x}
        cy={other.y}
        r="13"
        fill="none"
        stroke={c.drift}
        strokeWidth={1}
        strokeOpacity={0.7 * (1 - amount * 0.6)}
      />
      <circle
        cx={other.x + Math.cos(a2) * 9}
        cy={other.y + Math.sin(a2) * 9}
        r="1.6"
        fill={c.drift}
        opacity={1 - amount * 0.7}
      />
      <g transform={`translate(${self.x} ${self.y})`}>
        <HeartGlyph love={c.love} struct={c.struct} id={`g${id}`} scale={0.12} />
      </g>
    </svg>
  );
};

// ─── ImpermanenceCycle — forming/dissolving; presence then loss ───────────────
export const ImpermanenceCycle: React.FC<BaseProps & { phase?: number; presence?: number }> = ({
  frame,
  fps,
  size = 360,
  phase = 0,
  presence = 0,
  ...rest
}) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const a = (rot(frame, fps, 10) * Math.PI) / 180;
  const N = 12;
  const dots = Array.from({ length: N }).map((_, i) => {
    const ang = a + (i / N) * Math.PI * 2;
    const r = 40;
    const fade = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(ang * 2 + phase * Math.PI * 2));
    return { x: 50 + Math.cos(ang) * r, y: 50 + Math.sin(ang) * r, o: fade };
  });
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
      </defs>
      <circle cx="50" cy="50" r="40" fill="none" stroke={c.struct} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="1 6" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.8" fill={c.struct} opacity={d.o} />
      ))}
      <g opacity={presence}>
        <HeartGlyph love={c.love} struct={c.struct} id={`g${id}`} scale={0.3 * presence} />
      </g>
    </svg>
  );
};

// ─── InnerCore — central core + radial constellation (5 qualities) ────────────
export const InnerCore: React.FC<BaseProps & { count?: number; activation?: number }> = ({
  frame,
  fps,
  size = 360,
  count = 5,
  activation = 1,
  ...rest
}) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const a = (rot(frame, fps, 5) * Math.PI) / 180;
  const R = 36;
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
      </defs>
      <circle cx="50" cy="50" r="8" fill={`url(#hg${id})`} filter={`url(#g${id})`} />
      {Array.from({ length: count }).map((_, i) => {
        const visible = activation > i / count;
        const ang = a + (i / count) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + Math.cos(ang) * R;
        const y = 50 + Math.sin(ang) * R;
        const o = visible ? 0.85 : 0.12;
        return (
          <g key={i} opacity={o}>
            <line x1="50" y1="50" x2={x} y2={y} stroke={c.struct} strokeWidth={0.7} strokeOpacity={0.4} />
            <circle cx={x} cy={y} r="3.2" fill="none" stroke={c.love} strokeWidth={1} />
            <circle cx={x} cy={y} r="1.2" fill={c.love} />
          </g>
        );
      })}
    </svg>
  );
};

// ─── OpenHand — cradle (palm) + floating heart (openness = freedom) ───────────
export const OpenHand: React.FC<BaseProps & { openness?: number }> = ({
  frame,
  fps,
  size = 360,
  openness = 0,
  ...rest
}) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const cup = 1 - openness;
  const heartY = 36 - openness * 14;
  const handY = 70;
  const ctrlY = handY - 14 * cup;
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
        <Glow id={`gh${id}`} color={c.love} />
      </defs>
      <path
        d={`M22 ${handY} Q 50 ${ctrlY} 78 ${handY}`}
        fill="none"
        stroke={c.struct}
        strokeWidth={2}
        strokeOpacity={0.8}
        strokeLinecap="round"
      />
      <g transform={`translate(50 ${heartY})`}>
        <HeartGlyph love={c.love} struct={c.struct} id={`gh${id}`} scale={0.26} />
      </g>
    </svg>
  );
};

// ─── FreedomOrbit — cage → open orbital system ────────────────────────────────
export const FreedomOrbit: React.FC<BaseProps & { freedom?: number }> = ({
  frame,
  fps,
  size = 380,
  freedom = 0,
  ...rest
}) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const N = 8;
  const a = (rot(frame, fps, 8) * Math.PI) / 180;
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
      </defs>
      {Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * Math.PI * 2;
        const r = 30 + freedom * 14;
        const x1 = 50 + Math.cos(ang) * 12;
        const y1 = 50 + Math.sin(ang) * 12;
        const x2 = 50 + Math.cos(ang + freedom * 0.6) * r;
        const y2 = 50 + Math.sin(ang + freedom * 0.6) * r;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={c.struct}
            strokeWidth={1}
            strokeOpacity={0.6 - freedom * 0.3}
          />
        );
      })}
      <circle
        cx="50"
        cy="50"
        r={30 + freedom * 14}
        fill="none"
        stroke={c.struct}
        strokeWidth={0.8}
        strokeOpacity={0.2 + freedom * 0.5}
        strokeDasharray="2 7"
        transform={`rotate(${(a * 180) / Math.PI} 50 50)`}
      />
      <HeartGlyph love={c.love} struct={c.struct} id={`g${id}`} scale={0.42} />
    </svg>
  );
};

// ─── StoicSymbol — resting final mark (open ring + heart) ─────────────────────
export const StoicSymbol: React.FC<BaseProps & { pulse?: boolean }> = ({
  frame,
  fps,
  size = 360,
  pulse = true,
  ...rest
}) => {
  const c = usePalette(rest);
  const id = useId().replace(/:/g, "");
  const p = pulse ? 1 + Math.sin((frame / fps) * 1.1) * 0.015 : 1;
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`hg${id}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={c.love} />
          <stop offset="72%" stopColor={c.struct} stopOpacity={0.85} />
          <stop offset="100%" stopColor={c.struct} stopOpacity={0.25} />
        </radialGradient>
        <Glow id={`g${id}`} color={c.struct} />
      </defs>
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke={c.struct}
        strokeWidth={1.4}
        strokeOpacity={0.7}
        strokeDasharray="60 14"
        transform={`rotate(-30 50 50)`}
      />
      <g transform={`translate(50 50) scale(${p}) translate(-50 -50)`} filter={`url(#g${id})`}>
        <path d={HEART_PATH} fill={`url(#hg${id})`} transform="translate(50 50) scale(0.34) translate(-50 -50)" />
      </g>
    </svg>
  );
};
