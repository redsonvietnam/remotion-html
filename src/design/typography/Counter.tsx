import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useFadeIn } from "./useFadeIn";
import type { TypographyBaseProps, CounterConfig, EnterDirection, SpringConfig } from "./types";
import { DEFAULT_SPRING } from "./types";

// ---------------------------------------------------------------------------
// Counter — Animated number counter
//
// Counts up from 0 to a target value with spring animation.
// Used for statistics, metrics, and data visualization.
//
// Usage:
//   <Counter
//     target={57}
//     unit="%"
//     color="#f3c969"
//     fontFamily="'Be Vietnam Pro', sans-serif"
//     numberFontSize={110}
//     unitFontSize={46}
//   />
// ---------------------------------------------------------------------------

export interface CounterProps extends TypographyBaseProps, CounterConfig {
  /** Spring config for the count-up animation. */
  spring?: SpringConfig;

  /** Frame delay before counting starts. Default: 0. */
  delay?: number;

  /** Direction for enter animation. Default: "up". */
  enterDirection?: EnterDirection;

  /** Font family string. */
  fontFamily?: string;
}

export const Counter: React.FC<CounterProps> = ({
  text: _text, // unused — counter generates its own display
  target,
  unit = "",
  color = "#f3c969", // gold accent — template should override
  unitColor,
  numberFontSize = 110,
  unitFontSize = 46,
  spring: springConfig = DEFAULT_SPRING,
  delay = 0,
  enterDirection = "up",
  style,
  className,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Count-up animation
  const progress = spring({
    frame: frame - delay,
    fps,
    config: springConfig,
  });

  const displayedValue = Math.round(interpolate(progress, [0, 1], [0, target]));

  // Enter animation for the whole element
  const anim = useFadeIn({
    delay,
    direction: enterDirection,
    spring: springConfig,
  });

  return (
    <div
      className={className}
      style={{
        ...anim,
        textAlign: "center",
        fontFamily,
        ...style,
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: numberFontSize,
          lineHeight: 1,
          color,
        }}
      >
        {displayedValue}
        {unit && (
          <span
            style={{
              fontSize: unitFontSize,
              marginLeft: 6,
              color: unitColor ?? color,
            }}
          >
            {unit}
          </span>
        )}
      </span>
    </div>
  );
};
