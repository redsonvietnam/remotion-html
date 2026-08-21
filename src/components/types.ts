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
  /** Gradient CSS value. Default: "linear-gradient(90deg, #e23b3b, #f3c969)". */
  gradient?: string;
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
  accentColor?: string;
  /** Card title text. */
  title?: string;
  /** Card subtitle text. */
  subtitle?: string;
  /** Card width in px. Default: 420. */
  width?: number;
  /** Card background color. */
  background?: string;
  /** Card border color. */
  border?: string;
  /** Border radius in px. Default: 24. */
  borderRadius?: number;
  /** Card padding. Default: "40px 34px". */
  padding?: string;
  /** Font family. */
  fontFamily?: string;
  /** Title font size in px. Default: 34. */
  titleFontSize?: number;
  /** Title font weight. Default: 700. */
  titleFontWeight?: number;
  /** Title text color. */
  titleColor?: string;
  /** Subtitle font size in px. Default: 22. */
  subtitleFontSize?: number;
  /** Subtitle font weight. Default: 500. */
  subtitleFontWeight?: number;
  /** Subtitle text color. */
  subtitleColor?: string;
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
