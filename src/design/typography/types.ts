import type { CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Typography Engine — Type Contracts
//
// These types define the API surface for typography primitives.
// They are template-agnostic: no NQ57, no editorial, no tech knowledge.
// ---------------------------------------------------------------------------

/** Spring configuration for Remotion spring() function. */
export interface SpringConfig {
  damping: number;
  mass: number;
  stiffness?: number;
}

/** Direction for text enter/exit animations. */
export type EnterDirection = "up" | "down" | "left" | "right" | "none";

/** Common props shared by all typography primitives. */
export interface TypographyBaseProps {
  /** Text content. Plain string — no JSX. Keeps content separate from presentation. */
  text: string;

  /** Frame delay before animation starts (in frames). */
  delay?: number;

  /** Duration in seconds (used by KaraokeReveal for timing calculations). */
  dur?: number;

  /** Custom style applied to the outermost element. */
  style?: CSSProperties;

  /** CSS class name for the outermost element. */
  className?: string;
}

/** Configuration for enter/exit motion. */
export interface MotionProps {
  /** Direction of enter animation. Default: "up". */
  enterDirection?: EnterDirection;

  /** Spring config for enter animation. */
  enterSpring?: SpringConfig;

  /** If true, element exits (fades out) at end of duration. */
  exit?: boolean;

  /** Spring config for exit animation. */
  exitSpring?: SpringConfig;
}

/** Configuration for text styling. */
export interface TextStyleProps {
  /** Font family string (e.g., "'Be Vietnam Pro', sans-serif"). */
  fontFamily?: string;

  /** Font weight. */
  fontWeight?: number;

  /** Font size in pixels. */
  fontSize?: number;

  /** Line height. */
  lineHeight?: number;

  /** Text color. */
  color?: string;

  /** Text alignment. */
  textAlign?: CSSProperties["textAlign"];
}

/** Per-word timing data computed by useWordTimings. */
export interface WordTiming {
  /** The word text (including trailing whitespace/punctuation). */
  word: string;

  /** Index of this word in the full text. */
  index: number;

  /** Frame at which this word starts being revealed. */
  startFrame: number;

  /** Frame at which this word is fully revealed. */
  endFrame: number;

  /** Character index where this word starts in the full text. */
  charOffset: number;
}

/** Result of useWordTimings hook. */
export interface WordTimingsResult {
  /** Array of word timings for the full text. */
  timings: WordTiming[];

  /** Total number of words. */
  totalWords: number;

  /** Total number of frames for the full reveal. */
  totalFrames: number;
}

/** Karaoke-specific configuration. */
export interface KaraokeConfig {
  /** Color for the currently active word. Default: gold. */
  activeColor?: string;

  /** Color for revealed (but not active) words. Default: ink/white. */
  revealedColor?: string;

  /** Color for not-yet-revealed words. Default: ink with low opacity. */
  pendingColor?: string;

  /** Opacity for pending words. Default: 0.2. */
  pendingOpacity?: number;

  /** Font weight for the active word. Default: 700. */
  activeFontWeight?: number;

  /** Font weight for non-active words. Default: 600. */
  defaultFontWeight?: number;

  /** Enable marquee scroll for long lines. Default: true. */
  enableMarquee?: boolean;

  /** Container width for marquee calculation (pixels). Default: 1766 (92% of 1920). */
  containerWidth?: number;

  /** Font size for width estimation. Default: 30. */
  fontSize?: number;

  /** Character width ratio for estimation (width = charCount * fontSize * ratio). Default: 0.52. */
  charWidthRatio?: number;
}

/** Counter-specific configuration. */
export interface CounterConfig {
  /** Target number to count to. */
  target: number;

  /** Unit label displayed after the number (e.g., "%", "Top"). */
  unit?: string;

  /** Color for the number. */
  color?: string;

  /** Color for the unit label. */
  unitColor?: string;

  /** Font size for the number. */
  numberFontSize?: number;

  /** Font size for the unit. */
  unitFontSize?: number;
}

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

export const DEFAULT_SPRING: SpringConfig = {
  damping: 18,
  mass: 0.6,
};

export const DEFAULT_WORD_SPRING: SpringConfig = {
  damping: 14,
  mass: 0.5,
};

export const DEFAULT_ENTER_DIRECTION: EnterDirection = "up";

export const DEFAULT_KARAOKE_CONFIG: Required<KaraokeConfig> = {
  activeColor: "#f3c969",
  revealedColor: "#f7f5ef",
  pendingColor: "#f7f5ef",
  pendingOpacity: 0.2,
  activeFontWeight: 700,
  defaultFontWeight: 600,
  enableMarquee: true,
  containerWidth: 1766,
  fontSize: 30,
  charWidthRatio: 0.52,
};
