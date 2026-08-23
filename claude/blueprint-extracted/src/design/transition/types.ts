// ---------------------------------------------------------------------------
// Transition System — Type Contracts
//
// Template-agnostic transition configuration.
// Wraps Remotion's @remotion/transitions with a clean, reusable API.
// ---------------------------------------------------------------------------

// ─── Transition Type ────────────────────────────────────────────────────────

/** Built-in transition types. */
export type TransitionType = "fade" | "slide" | "wipe" | "none";

// ─── Transition Config ──────────────────────────────────────────────────────

export interface TransitionConfig {
  /** Transition type. Default: "fade". */
  type?: TransitionType;

  /** Duration in frames. Default: 16. */
  durationInFrames?: number;

  /** Slide direction (only for type "slide"). Default: "left". */
  slideDirection?: "left" | "right" | "up" | "down";

  /** Wipe direction (only for type "wipe"). Default: "left". */
  wipeDirection?: "left" | "right" | "up" | "down";

  /** Entering direction (for slide/wipe). Default: "from-left". */
  enteringDirection?: "from-left" | "from-right" | "from-top" | "from-bottom";
}

// ─── Preset ─────────────────────────────────────────────────────────────────

/** Pre-defined transition configurations. */
export interface TransitionPreset {
  name: string;
  config: TransitionConfig;
}

// ─── Scene Timing ───────────────────────────────────────────────────────────

/** Timing for a scene in a transition sequence. */
export interface SceneTiming {
  /** Scene duration in seconds. */
  dur: number;

  /** Transition duration in frames (between this scene and next). */
  transitionFrames?: number;
}

// ─── Defaults ───────────────────────────────────────────────────────────────

export const DEFAULT_TRANSITION: Required<TransitionConfig> = {
  type: "fade",
  durationInFrames: 16,
  slideDirection: "left",
  wipeDirection: "left",
  enteringDirection: "from-left",
};

export const PRESETS: Record<string, TransitionPreset> = {
  cut: {
    name: "cut",
    config: { type: "none", durationInFrames: 0 },
  },
  fade: {
    name: "fade",
    config: { type: "fade", durationInFrames: 16 },
  },
  fadeSlow: {
    name: "fadeSlow",
    config: { type: "fade", durationInFrames: 30 },
  },
  slideLeft: {
    name: "slideLeft",
    config: { type: "slide", durationInFrames: 20, slideDirection: "left" },
  },
  slideRight: {
    name: "slideRight",
    config: { type: "slide", durationInFrames: 20, slideDirection: "right" },
  },
  slideUp: {
    name: "slideUp",
    config: { type: "slide", durationInFrames: 20, slideDirection: "up" },
  },
  slideDown: {
    name: "slideDown",
    config: { type: "slide", durationInFrames: 20, slideDirection: "down" },
  },
  wipeLeft: {
    name: "wipeLeft",
    config: { type: "wipe", durationInFrames: 20, wipeDirection: "left" },
  },
  wipeRight: {
    name: "wipeRight",
    config: { type: "wipe", durationInFrames: 20, wipeDirection: "right" },
  },
};
