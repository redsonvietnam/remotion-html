// ---------------------------------------------------------------------------
// SVG Engine — Type Contracts
//
// Template-agnostic SVG drawing primitives.
// These are visual primitives: they know how to draw, not what to draw.
// ---------------------------------------------------------------------------

import type { CSSProperties, SVGProps } from "react";

// ─── Animation ──────────────────────────────────────────────────────────────

/** Progress 0→1 drives stroke draw, arc reveal, flow, etc. */
export type Progress = number;

// ─── PathDraw ───────────────────────────────────────────────────────────────

export interface PathDrawProps {
  /** SVG path d attribute — any valid path string */
  d: string;
  /** Progress 0→1 (0 = hidden, 1 = fully drawn) */
  progress: Progress;
  /** SVG viewport width */
  width?: number;
  /** SVG viewport height */
  height?: number;
  /** Stroke color */
  stroke?: string;
  /** Stroke width in px */
  strokeWidth?: number;
  /** Stroke linecap */
  strokeLinecap?: SVGProps<SVGPathElement>["strokeLinecap"];
  /** Fill color (default: none) */
  fill?: string;
  /** Fill opacity */
  fillOpacity?: number;
  /** SVG viewBox (default: "0 0 {width} {height}") */
  viewBox?: string;
  /** CSS transform on the <svg> element */
  transform?: string;
  /** CSS style on the <svg> element */
  style?: CSSProperties;
}

// ─── CircleDraw ─────────────────────────────────────────────────────────────

export interface CircleDrawProps {
  /** Center X in viewBox units (default: 50) */
  cx?: number;
  /** Center Y in viewBox units (default: 50) */
  cy?: number;
  /** Radius in viewBox units (default: 47) */
  r?: number;
  /** Progress 0→1 (0 = no arc, 1 = full circle) */
  progress: Progress;
  /** Rendered size in px */
  size?: number;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Stroke linecap */
  strokeLinecap?: SVGProps<SVGCircleElement>["strokeLinecap"];
  /** Background ring color (null = no background) */
  backgroundStroke?: string | null;
  /** Rotation in degrees (default: -90, so 0 = top) */
  rotate?: number;
  /** SVG viewBox units (default: 100) */
  viewBoxSize?: number;
  /** CSS style on the <svg> element */
  style?: CSSProperties;
}

// ─── LineDraw ───────────────────────────────────────────────────────────────

export interface LineDrawProps {
  /** Start X */
  x1?: number;
  /** Start Y */
  y1?: number;
  /** End X (default: 100) */
  x2?: number;
  /** End Y (default: 5) */
  y2?: number;
  /** Progress 0→1 (0 = hidden, 1 = fully drawn) */
  progress: Progress;
  /** Rendered width in px */
  width?: number;
  /** Rendered height in px */
  height?: number;
  /** Stroke color */
  stroke?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Stroke linecap */
  strokeLinecap?: SVGProps<SVGLineElement>["strokeLinecap"];
  /** SVG viewBox (default: "0 0 100 10") */
  viewBox?: string;
  /** CSS style on the <svg> element */
  style?: CSSProperties;
}

// ─── FlowLine ───────────────────────────────────────────────────────────────

export interface FlowLineProps {
  /** Rendered width in px */
  width: number;
  /** Rendered height in px */
  height?: number;
  /** Progress 0→1 (drives dot movement) */
  progress: Progress;
  /** Dot color */
  dotColor?: string;
  /** Line color */
  lineColor?: string;
  /** Number of dots */
  dotCount?: number;
  /** Dot radius */
  dotRadius?: number;
  /** Dot opacity */
  dotOpacity?: number;
  /** Direction: "ltr" (default) or "rtl" */
  direction?: "ltr" | "rtl";
  /** CSS style on the <svg> element */
  style?: CSSProperties;
}

// ─── SVGMath (pure functions) ───────────────────────────────────────────────

/**
 * Generate tick mark positions around a circle.
 * Returns array of {x1,y1,x2,y2} in the given viewBox.
 */
export interface TickMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Generate tick marks around a circle.
 * @param count - number of ticks
 * @param cx - center X
 * @param cy - center Y
 * @param innerR - inner radius
 * @param outerR - outer radius
 * @param startAngle - start angle in radians (default: -PI/2 = top)
 */
export function computeTickMarks(
  count: number,
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number = -Math.PI / 2
): TickMark[] {
  const marks: TickMark[] = [];
  for (let i = 0; i < count; i++) {
    const angle = startAngle + (i * Math.PI * 2) / count;
    marks.push({
      x1: cx + Math.cos(angle) * innerR,
      y1: cy + Math.sin(angle) * innerR,
      x2: cx + Math.cos(angle) * outerR,
      y2: cy + Math.sin(angle) * outerR,
    });
  }
  return marks;
}

/**
 * Clamp a progress value to [0, 1].
 */
export function clampProgress(p: number): number {
  return Math.max(0, Math.min(1, p));
}
