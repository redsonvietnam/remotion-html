import React from "react";
import { useFadeIn } from "./useFadeIn";
import type {
  TypographyBaseProps,
  MotionProps,
  TextStyleProps,
  EnterDirection,
  SpringConfig,
} from "./types";
import { DEFAULT_ENTER_DIRECTION, DEFAULT_SPRING } from "./types";

// ---------------------------------------------------------------------------
// Text — Basic text with enter animation
//
// The simplest typography primitive. Renders text with a configurable
// fade+slide enter animation. No word-by-word, no karaoke — just text.
//
// Usage:
//   <Text
//     text="Hello World"
//     fontFamily="'Inter', sans-serif"
//     fontSize={48}
//     fontWeight={700}
//     color="#fff"
//     enterDirection="up"
//     delay={10}
//   />
// ---------------------------------------------------------------------------

export interface TextProps
  extends TypographyBaseProps,
    MotionProps,
    TextStyleProps {}

export const Text: React.FC<TextProps> = ({
  text,
  delay = 0,
  style,
  className,
  enterDirection = DEFAULT_ENTER_DIRECTION,
  enterSpring = DEFAULT_SPRING,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  color,
  textAlign,
}) => {
  const anim = useFadeIn({
    delay,
    direction: enterDirection,
    spring: enterSpring,
  });

  return (
    <div
      className={className}
      style={{
        ...anim,
        fontFamily,
        fontWeight,
        fontSize,
        lineHeight,
        color,
        textAlign,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
