// ---------------------------------------------------------------------------
// Transition Helpers — Convert config to Remotion's TransitionSeries API
//
// These helpers convert our template-agnostic TransitionConfig into
// Remotion's @remotion/transitions format.
// ---------------------------------------------------------------------------

import type { TransitionConfig } from "./types";
import { DEFAULT_TRANSITION, PRESETS } from "./types";

/**
 * Get a preset transition configuration by name.
 *
 * @example
 *   const config = getPreset("fade");
 *   // { type: "fade", durationInFrames: 16 }
 */
export function getPreset(name: string): TransitionConfig {
  const preset = PRESETS[name];
  if (!preset) {
    console.warn(`Transition preset "${name}" not found. Using "fade".`);
    return PRESETS.fade.config;
  }
  return { ...preset.config };
}

/**
 * Resolve a TransitionConfig with defaults applied.
 *
 * @example
 *   const resolved = resolveConfig({ type: "slide", slideDirection: "right" });
 *   // { type: "slide", durationInFrames: 16, slideDirection: "right", ... }
 */
export function resolveConfig(config: TransitionConfig = {}): Required<TransitionConfig> {
  return {
    ...DEFAULT_TRANSITION,
    ...config,
  };
}

/**
 * Calculate total frames for a sequence with transitions.
 *
 * @example
 *   const total = totalFrames([3, 3, 3], 16, 30);
 *   // 3 scenes × 90 frames + 2 transitions × 16 frames = 302 frames
 */
export function totalFrames(
  sceneDurationsSec: number[],
  transitionFrames: number,
  fps: number
): number {
  const sceneFrames = sceneDurationsSec.reduce(
    (acc, dur) => acc + Math.round(dur * fps),
    0
  );
  const transitions = Math.max(0, sceneDurationsSec.length - 1) * transitionFrames;
  return sceneFrames + transitions;
}

/**
 * Calculate scene frames from duration in seconds.
 *
 * @example
 *   const frames = sceneFrames(3, 30); // 90
 */
export function sceneFrames(durSec: number, fps: number): number {
  return Math.round(durSec * fps);
}
