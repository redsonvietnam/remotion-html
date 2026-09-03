// ---------------------------------------------------------------------------
// Motion System — Public API
//
// Template-agnostic motion primitives.
// Pure functions — no React hooks, no browser timing.
// ---------------------------------------------------------------------------

export { fadeSlide, fadeSlideWithFps, getTranslate } from "./fadeSlide";
export { stagger, staggerWithFps } from "./stagger";
export {
  linearProgress,
  delayedProgress,
  staggerProgress,
  secondsToFrames,
  framesToSeconds,
} from "./timing";
export { clampProgress } from "./types";

export type {
  Direction,
  SpringConfig,
  MotionStyle,
  FadeSlideConfig,
  StaggerConfig,
  LinearProgressConfig,
} from "./types";
