// ---------------------------------------------------------------------------
// Transition System — Public API
//
// Template-agnostic transition configuration.
// Wraps Remotion's @remotion/transitions with a clean, reusable API.
// ---------------------------------------------------------------------------

export { getPreset, resolveConfig, totalFrames, sceneFrames } from "./helpers";
export { DEFAULT_TRANSITION, PRESETS } from "./types";
export type { TransitionType, TransitionConfig, TransitionPreset, SceneTiming } from "./types";
