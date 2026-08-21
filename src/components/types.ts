// ---------------------------------------------------------------------------
// Video UI Components — Type Contracts
//
// Reusable video UI components built on Design primitives.
// These are template-agnostic: they know structure, not content.
// ---------------------------------------------------------------------------

import type { CSSProperties, ReactNode } from "react";

// ─── SectionLabel ───────────────────────────────────────────────────────────

/** Uppercase label above content sections. */
export interface SectionLabelProps {
  /** Label text. */
  text: string;
  /** Font family. */
  fontFamily?: string;
  /** Font size in px. Default: 26. */
  fontSize?: number;
  /** Font weight. Default: 700. */
  fontWeight?: number;
  /** Text color. Default: muted. */
  color?: string;
  /** Letter spacing in px. Default: 4. */
  letterSpacing?: number;
  /** Bottom margin in px. Default: 30. */
  marginBottom?: number;
  /** CSS class name. */
  className?: string;
  /** Style override. */
  style?: CSSProperties;
}

// ─── GradientText ───────────────────────────────────────────────────────────

/** Text with gradient background clip effect. */
export interface GradientTextProps {
  /** Text content. */
  text: string;
  /** Start color of the gradient. */
  colorFrom?: string;
  /** End color of the gradient. */
  colorTo?: string;
  /** Gradient direction in degrees (0 = left-to-right). Default: 90. */
  gradientAngle?: number;
  /** Font family. */
  fontFamily?: string;
  /** Font size in px. Default: 120. */
  fontSize?: number;
  /** Font weight. Default: 800. */
  fontWeight?: number;
  /** Line height. Default: 1. */
  lineHeight?: number;
  /** CSS class name. */
  className?: string;
  /** Style override. */
  style?: CSSProperties;
}

// ─── CardBlock ──────────────────────────────────────────────────────────────

/** Card with optional number badge, title, and subtitle. */
export interface CardBlockProps {
  /** Number displayed in the badge (null = no badge). */
  number?: number | null;
  /** Badge border/accent color. */
  accent?: string;
  /** Card title text. */
  title?: string;
  /** Card subtitle text. */
  subtitle?: string;
  /** Card width in px. Default: 420. */
  width?: number;
  /** Card background color (semantic: "card" from theme). */
  background?: string;
  /** Card border color (semantic: "line" from theme). */
  borderColor?: string;
  /** Primary text color (semantic: "ink" from theme). */
  text?: string;
  /** Secondary text color (semantic: "muted" from theme). */
  muted?: string;
  /** Border radius in px. Default: 24. */
  borderRadius?: number;
  /** Card padding. Default: "40px 34px". */
  padding?: string;
  /** Font family. */
  fontFamily?: string;
  /** Title font size in px. Default: 34. */
  titleSize?: number;
  /** Title font weight. Default: 700. */
  titleWeight?: number;
  /** Subtitle font size in px. Default: 22. */
  subtitleSize?: number;
  /** Subtitle font weight. Default: 500. */
  subtitleWeight?: number;
  /** Badge size in px. Default: 86. */
  badgeSize?: number;
  /** Badge font size in px. Default: 40. */
  badgeFontSize?: number;
  /** Badge font weight. Default: 800. */
  badgeFontWeight?: number;
  /** Box shadow. */
  boxShadow?: string;
  /** CSS class name. */
  className?: string;
  /** Style override. */
  style?: CSSProperties;
  /** Children (alternative to title/subtitle). */
  children?: ReactNode;
}
