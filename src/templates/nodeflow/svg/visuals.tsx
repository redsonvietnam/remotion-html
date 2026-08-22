// ---------------------------------------------------------------------------
// NodeFlow — Custom SVG Visual Language
//
// Design grammar: network / system diagram / data flow.
// Every element is a graph primitive: nodes, edges, signals, labels.
//
// Color roles (from theme):
//   signal  = accent1  (cyan)   — active nodes, live signal, data flow
//   data    = accent2  (amber)  — monetary values, numbers, labels
//   ok      = accent3  (green)  — positive outcome, rights, benefits
//   muted   = muted             — inactive nodes, dormant edges
// ---------------------------------------------------------------------------

import React from "react";
import { useId } from "react";
import { interpolate } from "remotion";
import { useTheme } from "../../../design/theme";

// ─── Shared types ─────────────────────────────────────────────────────────────

interface BaseProps {
  frame: number;
  fps: number;
  size?: number;
}

// ─── GridBackground — blueprint engineering graph paper ───────────────────────

export const GridBackground: React.FC<{
  width: number;
  height: number;
  frame: number;
  cellSize?: number;
  majorEvery?: number;
  lineColor?: string;
  majorColor?: string;
  opacity?: number;
}> = ({
  width,
  height,
  frame,
  cellSize = 60,
  majorEvery = 5,
  lineColor,
  majorColor,
  opacity = 1,
}) => {
  const theme = useTheme();
  const lc = lineColor ?? theme.colors.line;
  const mc = majorColor ?? theme.colors.accent1;

  // Subtle pan over time
  const ox = (frame * 0.04) % cellSize;
  const oy = (frame * 0.02) % cellSize;

  const cols = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;

  const lines: React.ReactNode[] = [];

  // Vertical lines
  for (let i = 0; i < cols; i++) {
    const x = i * cellSize - ox;
    const isMajor = i % majorEvery === 0;
    lines.push(
      <line
        key={`v${i}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke={isMajor ? mc : lc}
        strokeWidth={isMajor ? 0.5 : 0.25}
        opacity={isMajor ? 0.2 : 0.12}
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i < rows; i++) {
    const y = i * cellSize - oy;
    const isMajor = i % majorEvery === 0;
    lines.push(
      <line
        key={`h${i}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={isMajor ? mc : lc}
        strokeWidth={isMajor ? 0.5 : 0.25}
        opacity={isMajor ? 0.2 : 0.12}
      />
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}
    >
      {lines}
    </svg>
  );
};

// ─── NodeBox — a single graph node (rect + label) ─────────────────────────────

export const NodeBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  active?: boolean;
  pulse?: number; // 0..1 pulse intensity
  activePct?: number; // 0..1 reveal/activation progress
  color?: string;
  textSize?: number;
}> = ({
  x,
  y,
  w,
  h,
  label,
  sublabel,
  active = false,
  pulse = 0,
  activePct = 1,
  color,
  textSize = 14,
}) => {
  const theme = useTheme();
  const id = useId().replace(/:/g, "");
  const c = color ?? (active ? theme.colors.accent1 : theme.colors.muted);
  const fillOpacity = active ? 0.08 + pulse * 0.06 : 0.04;
  const strokeOpacity = active ? 0.7 + pulse * 0.3 : 0.25;
  const rx = 8;

  return (
    <g opacity={activePct}>
      <defs>
        <filter id={`glow-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation={active ? 4 : 1} floodColor={c} floodOpacity={active ? 0.6 : 0.2} />
        </filter>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity={fillOpacity * 1.5} />
          <stop offset="100%" stopColor={c} stopOpacity={fillOpacity * 0.5} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={`url(#fill-${id})`}
        stroke={c}
        strokeWidth={active ? 1.5 : 0.8}
        strokeOpacity={strokeOpacity}
        filter={active ? `url(#glow-${id})` : undefined}
      />
      {/* Corner tick marks */}
      <line x1={x + 2} y1={y + 2} x2={x + 10} y2={y + 2} stroke={c} strokeWidth={1} opacity={0.5} />
      <line x1={x + 2} y1={y + 2} x2={x + 2} y2={y + 10} stroke={c} strokeWidth={1} opacity={0.5} />
      <line x1={x + w - 2} y1={y + h - 2} x2={x + w - 10} y2={y + h - 2} stroke={c} strokeWidth={1} opacity={0.5} />
      <line x1={x + w - 2} y1={y + h - 2} x2={x + w - 2} y2={y + h - 10} stroke={c} strokeWidth={1} opacity={0.5} />
      <text
        x={x + w / 2}
        y={sublabel ? y + h / 2 - 6 : y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={active ? theme.colors.ink : theme.colors.muted}
        fontSize={textSize}
        fontWeight={active ? 700 : 500}
        fontFamily={theme.fonts.display}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fill={c}
          fontSize={textSize * 0.78}
          fontWeight={600}
          fontFamily={theme.fonts.mono ?? theme.fonts.display}
        >
          {sublabel}
        </text>
      )}
    </g>
  );
};

// ─── EdgeLine — animated stroke drawing edge between two points ───────────────

export const EdgeLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number; // 0..1 draw progress
  dashed?: boolean;
  color?: string;
  strokeWidth?: number;
  arrowHead?: boolean;
}> = ({
  x1,
  y1,
  x2,
  y2,
  progress,
  dashed = false,
  color,
  strokeWidth = 1.5,
  arrowHead = true,
}) => {
  const theme = useTheme();
  const c = color ?? theme.colors.accent1;
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const p = Math.min(1, Math.max(0, progress));

  // Arrow direction
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const ax = x1 + Math.cos(ang) * len * p;
  const ay = y1 + Math.sin(ang) * len * p;
  const as = 8; // arrow size

  return (
    <g opacity={0.9}>
      <line
        x1={x1}
        y1={y1}
        x2={x1 + (x2 - x1) * p}
        y2={y1 + (y2 - y1) * p}
        stroke={c}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashed ? "6 4" : undefined}
        opacity={0.8}
      />
      {arrowHead && p > 0.1 && (
        <polygon
          points={`
            ${ax},${ay}
            ${ax - Math.cos(ang - 0.4) * as},${ay - Math.sin(ang - 0.4) * as}
            ${ax - Math.cos(ang + 0.4) * as},${ay - Math.sin(ang + 0.4) * as}
          `}
          fill={c}
          opacity={p}
        />
      )}
    </g>
  );
};

// ─── SignalPulse — a dot travelling along an edge ────────────────────────────

export const SignalPulse: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  frame: number;
  period?: number; // frames per cycle
  color?: string;
  size?: number;
  visible?: boolean;
}> = ({
  x1,
  y1,
  x2,
  y2,
  frame,
  period = 60,
  color,
  size = 5,
  visible = true,
}) => {
  const theme = useTheme();
  const c = color ?? theme.colors.accent1;
  if (!visible) return null;

  const t = (frame % period) / period;
  const cx = x1 + (x2 - x1) * t;
  const cy = y1 + (y2 - y1) * t;
  // Fade in/out at endpoints
  const opacity = t < 0.08 ? t / 0.08 : t > 0.9 ? (1 - t) / 0.1 : 1;

  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy} r={size * 1.8} fill={c} opacity={0.15} />
      <circle cx={cx} cy={cy} r={size * 0.7} fill={c} opacity={0.9} />
    </g>
  );
};

// ─── DataBadge — floating amber label showing a number / stat ────────────────

export const DataBadge: React.FC<{
  x: number;
  y: number;
  value: string;
  unit?: string;
  activePct?: number;
  color?: string;
}> = ({ x, y, value, unit, activePct = 1, color }) => {
  const theme = useTheme();
  const id = useId().replace(/:/g, "");
  const c = color ?? theme.colors.accent2;

  return (
    <g opacity={activePct}>
      <defs>
        <filter id={`dbglow-${id}`}>
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={c} floodOpacity="0.6" />
        </filter>
      </defs>
      <rect
        x={x - 2}
        y={y - 14}
        width={value.length * 11 + (unit ? unit.length * 7 : 0) + 16}
        height={22}
        rx={4}
        fill={c}
        fillOpacity={0.12}
        stroke={c}
        strokeWidth={0.8}
        strokeOpacity={0.7}
        filter={`url(#dbglow-${id})`}
      />
      <text
        x={x + 6}
        y={y}
        fill={c}
        fontSize={13}
        fontWeight={700}
        fontFamily={theme.fonts.mono ?? theme.fonts.display}
        dominantBaseline="central"
      >
        {value}
        {unit && (
          <tspan fill={theme.colors.muted} fontSize={10} dx={2}>
            {unit}
          </tspan>
        )}
      </text>
    </g>
  );
};

// ─── SystemNode — large structural actor (employer/employee/state orb) ────────

export const SystemNode: React.FC<
  BaseProps & {
    cx: number;
    cy: number;
    r?: number;
    label: string;
    sublabel?: string;
    active?: boolean;
    activePct?: number;
    color?: string;
    beat?: boolean;
  }
> = ({
  frame,
  fps,
  cx,
  cy,
  r = 50,
  label,
  sublabel,
  active = false,
  activePct = 1,
  color,
  beat = false,
}) => {
  const theme = useTheme();
  const id = useId().replace(/:/g, "");
  const c = color ?? (active ? theme.colors.accent1 : theme.colors.muted);
  const beatScale = beat ? 1 + Math.sin((frame / fps) * 2.2) * 0.025 : 1;

  return (
    <g opacity={activePct} transform={`scale(${beatScale})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <defs>
        <filter id={`sn-${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="0" stdDeviation={active ? 12 : 3} floodColor={c} floodOpacity={active ? 0.5 : 0.15} />
        </filter>
        <radialGradient id={`sng-${id}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={c} stopOpacity={0.25} />
          <stop offset="100%" stopColor={c} stopOpacity={0.06} />
        </radialGradient>
      </defs>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={c} strokeWidth={0.6} strokeOpacity={0.2} strokeDasharray="3 6" />
      {/* Node body */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#sng-${id})`} stroke={c} strokeWidth={active ? 2 : 1} strokeOpacity={active ? 0.8 : 0.3} filter={`url(#sn-${id})`} />
      {/* Inner dot */}
      <circle cx={cx} cy={cy} r={4} fill={c} opacity={active ? 0.9 : 0.3} />
      {/* Label */}
      <text
        x={cx}
        y={sublabel ? cy - 8 : cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={active ? theme.colors.ink : theme.colors.muted}
        fontSize={r * 0.28}
        fontWeight={700}
        fontFamily={theme.fonts.display}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={cx}
          y={cy + r * 0.28 + 4}
          textAnchor="middle"
          dominantBaseline="central"
          fill={c}
          fontSize={r * 0.2}
          fontWeight={600}
          fontFamily={theme.fonts.mono ?? theme.fonts.display}
        >
          {sublabel}
        </text>
      )}
    </g>
  );
};

// ─── ProgressBar — horizontal fill bar for contribution/benefit percentage ────

export const ProgressBar: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  pct: number; // 0..1 target pct
  progress: number; // 0..1 animation progress
  label: string;
  valueLabel?: string;
  color?: string;
}> = ({
  x,
  y,
  w,
  h = 24,
  pct,
  progress,
  label,
  valueLabel,
  color,
}) => {
  const theme = useTheme();
  const c = color ?? theme.colors.accent1;
  const filled = w * pct * progress;

  return (
    <g>
      {/* Track */}
      <rect x={x} y={y} width={w} height={h} rx={4} fill={c} fillOpacity={0.06} stroke={c} strokeWidth={0.8} strokeOpacity={0.25} />
      {/* Fill */}
      <rect x={x + 1} y={y + 1} width={Math.max(0, filled - 2)} height={h - 2} rx={3} fill={c} fillOpacity={0.7} />
      {/* Label left */}
      <text
        x={x + 8}
        y={y + h / 2}
        dominantBaseline="central"
        fill={theme.colors.ink}
        fontSize={12}
        fontWeight={600}
        fontFamily={theme.fonts.display}
      >
        {label}
      </text>
      {/* Value right */}
      {valueLabel && (
        <text
          x={x + w + 8}
          y={y + h / 2}
          dominantBaseline="central"
          fill={c}
          fontSize={12}
          fontWeight={700}
          fontFamily={theme.fonts.mono ?? theme.fonts.display}
        >
          {valueLabel}
        </text>
      )}
    </g>
  );
};
