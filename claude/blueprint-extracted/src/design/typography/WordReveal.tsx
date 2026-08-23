import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useWordTimings, getActiveWordIndex } from "./useWordTimings";
import type {
  TypographyBaseProps,
  TextStyleProps,
  EnterDirection,
  SpringConfig,
  WordTiming,
} from "./types";
import { DEFAULT_WORD_SPRING } from "./types";

// ---------------------------------------------------------------------------
// WordReveal — Word-by-word text reveal
//
// Text appears word-by-word with individual spring animations.
// Each word slides up and fades in with a staggered delay.
//
// This is the core typography primitive for kinetic text effects.
//
// Usage:
//   <WordReveal
//     text="Brain loves habits, not willpower"
//     dur={5.5}
//     fontFamily="'Inter', sans-serif"
//     fontSize={68}
//     color="#f7f5ef"
//     stagger={4}
//   />
// ---------------------------------------------------------------------------

export interface WordRevealProps extends TypographyBaseProps, TextStyleProps {
  /** Direction for each word's enter animation. Default: "up". */
  enterDirection?: EnterDirection;

  /** Spring config for each word. */
  wordSpring?: SpringConfig;

  /** Stagger delay between words (in frames). Default: 4. */
  stagger?: number;

  /** Translate distance for each word (pixels). Default: 40. */
  translateDistance?: number;

  /** Wrapper element type. Default: "div". */
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3";

  /** Style for the wrapper element. */
  wrapperStyle?: React.CSSProperties;

  /** Separator between words. Default: " " (space with marginRight). */
  wordSeparator?: string;
}

/** Single animated word. */
const AnimatedWord: React.FC<{
  text: string;
  delayFrames: number;
  spring: SpringConfig;
  direction: EnterDirection;
  translateDistance: number;
  style?: React.CSSProperties;
}> = ({ text, delayFrames, spring: springConfig, direction, translateDistance, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = spring({
    frame: frame - delayFrames,
    fps,
    config: springConfig,
  });

  const opacity = interpolate(t, [0, 1], [0, 1]);

  let transform: string;
  switch (direction) {
    case "up":
      transform = `translateY(${interpolate(t, [0, 1], [translateDistance, 0])}px)`;
      break;
    case "down":
      transform = `translateY(${interpolate(t, [0, 1], [-translateDistance, 0])}px)`;
      break;
    case "left":
      transform = `translateX(${interpolate(t, [0, 1], [translateDistance, 0])}px)`;
      break;
    case "right":
      transform = `translateX(${interpolate(t, [0, 1], [-translateDistance, 0])}px)`;
      break;
    case "none":
    default:
      transform = "none";
  }

  return (
    <span
      style={{
        display: "inline-block",
        transform,
        opacity,
        marginRight: "0.28em",
        ...style,
      }}
    >
      {text}
    </span>
  );
};

export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  delay = 0,
  dur,
  style,
  className,
  enterDirection = "up",
  wordSpring = DEFAULT_WORD_SPRING,
  stagger = 4,
  translateDistance = 40,
  as: Wrapper = "div",
  wrapperStyle,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  color,
  textAlign,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const totalFrames = dur != null ? Math.round(dur * fps) : durationInFrames;

  // Parse text into lines, then into words
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Flatten all words with their line context
  const allWords: { word: string; lineIdx: number; wordIdx: number }[] = [];
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const words = lines[lineIdx].split(/\s+/).filter(Boolean);
    for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
      allWords.push({
        word: words[wordIdx],
        lineIdx,
        wordIdx,
      });
    }
  }

  const totalWords = allWords.length;
  if (totalWords === 0) return null;

  // Compute stagger offsets
  const startOffset = delay + 6; // 6 frame minimum before first word
  const wordDelays = allWords.map((_, i) => startOffset + i * stagger);

  return (
    <Wrapper
      className={className}
      style={{
        fontFamily,
        fontWeight,
        fontSize,
        lineHeight,
        color,
        textAlign,
        ...wrapperStyle,
        ...style,
      }}
    >
      {lines.map((line, lineIdx) => {
        const lineWords = allWords.filter((w) => w.lineIdx === lineIdx);
        return (
          <div key={lineIdx} style={{ textAlign }}>
            {lineWords.map((w) => (
              <AnimatedWord
                key={`${w.lineIdx}-${w.wordIdx}`}
                text={w.word}
                delayFrames={wordDelays[allWords.indexOf(w)]}
                spring={wordSpring}
                direction={enterDirection}
                translateDistance={translateDistance}
              />
            ))}
          </div>
        );
      })}
    </Wrapper>
  );
};
