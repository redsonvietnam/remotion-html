// ---------------------------------------------------------------------------
// Design Model — barrel export
// ---------------------------------------------------------------------------

export type {
  Frames,
  Progress,
  SceneTiming,
  DesignScene,
  FrameContext,
  MotionPrimitive,
  CanvasSize,
} from "./types";

export { CANVAS_16_9, CANVAS_9_16, PROJECT_FPS } from "./types";

export {
  frameToProgress,
  buildFrameContext,
  progressToFrame,
  secondsToFrames,
  framesToSeconds,
  formatFrameTime,
} from "./progress";
