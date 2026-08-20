import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";
import { useWordTimings, getActiveWordIndex, parseTextLines, countWords } from "./useWordTimings";
import type { TypographyBaseProps, KaraokeConfig } from "./types";
import { DEFAULT_KARAOKE_CONFIG } from "./types";

// ---------------------------------------------------------------------------
// KaraokeReveal — Progressive word highlighting with marquee scroll
//
// Caption-style typography: words are revealed progressively, the current
// word is highlighted, and long lines scroll (marquee) to keep the active
// word visible.
//
// This is the "karaoke" effect used for TTS captions in video.
//
// Usage:
//   <KaraokeReveal
//     text="MC: Hello. Expert: Today we discuss..."
//     dur={10.5}
//     fontFamily="'Be Vietnam Pro', sans-serif"
//     activeColor="#f3c969"
//   />
// ---------------------------------------------------------------------------

export interface KaraokeRevealProps extends TypographyBaseProps, KaraokeConfig {
  /** Font family for the caption bar. */
  fontFamily?: string;

  /** Font weight for the caption bar. Default: 600. */
  fontWeight?: number;

  /** Font size in pixels. Default: 30. */
  fontSize?: number;

  /** Line height. Default: 1.25. */
  lineHeight?: number;

  /** Background color for the caption bar. Default: "rgba(5,8,16,0.72)". */
  background?: string;

  /** Border color for the caption bar. Uses KaraokeConfig's line color or this. */
  borderColor?: string;

  /** Border radius for the caption bar. Default: 14. */
  borderRadius?: number;

  /** Padding for the caption bar. Default: "10px 26px". */
  padding?: string;

  /** Bottom padding for the caption bar position. Default: "4.5%". */
  bottomPadding?: string;

  /** Max width of the caption bar. Default: "92%". */
  maxWidth?: string;

  /** Enable backdrop blur. Default: true. */
  backdropBlur?: boolean;
}

export const KaraokeReveal: React.FC<KaraokeRevealProps> = ({
  text,
  delay = 0,
  dur = 10,
  style,
  className,
  // Karaoke config
  activeColor = DEFAULT_KARAOKE_CONFIG.activeColor,
  revealedColor = DEFAULT_KARAOKE_CONFIG.revealedColor,
  pendingColor = DEFAULT_KARAOKE_CONFIG.pendingColor,
  pendingOpacity = DEFAULT_KARAOKE_CONFIG.pendingOpacity,
  activeFontWeight = DEFAULT_KARAOKE_CONFIG.activeFontWeight,
  defaultFontWeight = DEFAULT_KARAOKE_CONFIG.defaultFontWeight,
  enableMarquee = DEFAULT_KARAOKE_CONFIG.enableMarquee,
  containerWidth = DEFAULT_KARAOKE_CONFIG.containerWidth,
  fontSize: karaokeFontSize = DEFAULT_KARAOKE_CONFIG.fontSize,
  charWidthRatio = DEFAULT_KARAOKE_CONFIG.charWidthRatio,
  // Style props
  fontFamily,
  fontWeight = 600,
  fontSize = karaokeFontSize,
  lineHeight = 1.25,
  background = "rgba(5,8,16,0.72)",
  borderColor,
  borderRadius = 14,
  padding = "10px 26px",
  bottomPadding = "4.5%",
  maxWidth = "92%",
  backdropBlur = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalFrames = dur != null ? Math.round(dur * fps) : durationInFrames;

  // Compute word timings
  const { timings, totalWords } = useWordTimings({
    text,
    dur,
    startOffset: 6,
    endBuffer: 8,
  });

  if (totalWords === 0 || timings.length === 0) return null;

  // Find the currently active line (the line containing the active word)
  const lines = parseTextLines(text);
  const wordsPerLine = lines.map(countWords);
  const activeWordIdx = getActiveWordIndex(timings, frame);
  const activeTiming = timings[activeWordIdx];

  // Determine which line is active
  let accumulatedWords = 0;
  let activeLineIdx = 0;
  for (let i = 0; i < wordsPerLine.length; i++) {
    if (activeWordIdx < accumulatedWords + wordsPerLine[i]) {
      activeLineIdx = i;
      break;
    }
    accumulatedWords += wordsPerLine[i];
    activeLineIdx = i;
  }

  // Get the active line's words
  const activeLine = lines[activeLineIdx] || "";
  const tokens = activeLine.split(/(\s+)/);

  // Compute marquee scroll
  const estWidth = activeLine.length * fontSize * charWidthRatio;
  const maxScroll = Math.max(0, estWidth - containerWidth);

  // Progress within the active line for marquee calculation
  const lineStartFrame = timings[accumulatedWords]?.startFrame ?? 0;
  const lineEndFrame =
    timings[accumulatedWords + wordsPerLine[activeLineIdx] - 1]?.endFrame ??
    totalFrames;
  const localProgress = interpolate(
    frame,
    [lineStartFrame, lineEndFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scrollX =
    maxScroll > 0
      ? -Math.max(0, Math.min(maxScroll, localProgress * estWidth - containerWidth / 2))
      : 0;

  // Render tokens with highlighting
  let wordCounter = 0;
  const renderedTokens = tokens.map((token, ti) => {
    if (/^\s+$/.test(token)) {
      return <span key={ti}>{" "}</span>;
    }

    const isRevealed = wordCounter < activeWordIdx + 1;
    const isCurrent = wordCounter === activeWordIdx;
    wordCounter++;

    return (
      <span
        key={ti}
        style={{
          opacity: isRevealed ? 1 : pendingOpacity,
          color: isCurrent ? activeColor : isRevealed ? revealedColor : pendingColor,
          fontWeight: isCurrent ? activeFontWeight : defaultFontWeight,
        }}
      >
        {token}
      </span>
    );
  });

  return (
    <AbsoluteFill
      className={className}
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottomPadding,
        ...style,
      }}
    >
      <div
        style={{
          maxWidth,
          display: "flex",
          justifyContent: maxScroll > 0 ? "flex-start" : "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontFamily,
          fontWeight,
          fontSize,
          lineHeight,
          background,
          border: borderColor ? `1px solid ${borderColor}` : undefined,
          borderRadius,
          padding,
          backdropFilter: backdropBlur ? "blur(8px)" : undefined,
        }}
      >
        <span
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            transform: `translateX(${scrollX}px)`,
          }}
        >
          {renderedTokens}
        </span>
      </div>
    </AbsoluteFill>
  );
};
