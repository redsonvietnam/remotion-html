import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type { SpringConfig, EnterDirection } from "./types";
import { DEFAULT_SPRING, DEFAULT_ENTER_DIRECTION } from "./types";

// ---------------------------------------------------------------------------
// useFadeIn — Basic text enter animation hook
//
// Returns { opacity, transform } for a text element that fades/slides in.
// Deterministic: uses Remotion's useCurrentFrame(), no wall-clock dependency.
//
// Usage:
//   const style = useFadeIn({ delay: 10, direction: "up" });
//   return <div style={{ ...style, fontFamily: "..." }}>Hello</div>
// ---------------------------------------------------------------------------

interface UseFadeInOptions {
  /** Frame delay before animation starts. Default: 0. */
  delay?: number;

  /** Direction of enter animation. Default: "up". */
  direction?: EnterDirection;

  /** Spring config. */
  spring?: SpringConfig;

  /** Translate distance in pixels. Default: 40. */
  translateDistance?: number;
}

interface FadeInStyle {
  opacity: number;
  transform: string;
}

const DIRECTION_MAP: Record<EnterDirection, (t: number, dist: number) => string> = {
  up: (t, dist) => `translateY(${interpolate(t, [0, 1], [dist, 0])}px)`,
  down: (t, dist) => `translateY(${interpolate(t, [0, 1], [-dist, 0])}px)`,
  left: (t, dist) => `translateX(${interpolate(t, [0, 1], [dist, 0])}px)`,
  right: (t, dist) => `translateX(${interpolate(t, [0, 1], [-dist, 0])}px)`,
  none: () => "none",
};

export function useFadeIn(options: UseFadeInOptions = {}): FadeInStyle {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    delay = 0,
    direction = DEFAULT_ENTER_DIRECTION,
    spring: springConfig = DEFAULT_SPRING,
    translateDistance = 40,
  } = options;

  const t = spring({
    frame: frame - delay,
    fps,
    config: springConfig,
  });

  const opacity = interpolate(t, [0, 1], [0, 1]);
  const transform = DIRECTION_MAP[direction](t, translateDistance);

  return { opacity, transform };
}
