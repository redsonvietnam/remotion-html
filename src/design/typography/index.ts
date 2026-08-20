// ---------------------------------------------------------------------------
// Typography Engine — Public API
//
// Reusable typography primitives for Remotion video templates.
// Template-agnostic: no NQ57, no editorial, no tech knowledge.
//
// Usage:
//   import { Text, WordReveal, KaraokeReveal, Counter } from "../design/typography";
// ---------------------------------------------------------------------------

// Types
export type {
  SpringConfig,
  EnterDirection,
  TypographyBaseProps,
  MotionProps,
  TextStyleProps,
  WordTiming,
  WordTimingsResult,
  KaraokeConfig,
  CounterConfig,
} from "./types";

export {
  DEFAULT_SPRING,
  DEFAULT_WORD_SPRING,
  DEFAULT_ENTER_DIRECTION,
  DEFAULT_KARAOKE_CONFIG,
} from "./types";

// Hooks
export { useFadeIn } from "./useFadeIn";
export {
  useWordTimings,
  computeWordTimings,
  parseTextLines,
  countWords,
  getActiveWordIndex,
  getWordProgress,
} from "./useWordTimings";

// Components
export { Text } from "./Text";
export type { TextProps } from "./Text";

export { WordReveal } from "./WordReveal";
export type { WordRevealProps } from "./WordReveal";

export { KaraokeReveal } from "./KaraokeReveal";
export type { KaraokeRevealProps } from "./KaraokeReveal";

export { Counter } from "./Counter";
export type { CounterProps } from "./Counter";
