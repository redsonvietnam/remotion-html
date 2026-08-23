import React from "react";
import { useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { useWordTimings, getActiveWordIndex, parseTextLines, countWords, chunkCaptionText } from "./useWordTimings";
import type { TypographyBaseProps, KaraokeConfig } from "./types";
import { DEFAULT_KARAOKE_CONFIG } from "./types";

// ---------------------------------------------------------------------------
// KaraokeReveal — Progressive word highlighting with chunk replacement
//
// Caption-style typography: long text is split into semantic 4–7 word chunks
// via chunkCaptionText(). Only the current chunk is displayed. Words within
// the active chunk are revealed progressively with the current word highlighted.
// When the chunk completes, it is replaced by the next chunk.
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
  enableMarquee: _enableMarquee = DEFAULT_KARAOKE_CONFIG.enableMarquee,
  containerWidth: _containerWidth = DEFAULT_KARAOKE_CONFIG.containerWidth,
  fontSize: karaokeFontSize = DEFAULT_KARAOKE_CONFIG.fontSize,
  charWidthRatio: _charWidthRatio = DEFAULT_KARAOKE_CONFIG.charWidthRatio,
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
  const { fps } = useVideoConfig();

  // Chunk text into semantic 4-7 word lines for one-row display
  const chunkedText = chunkCaptionText(text);

  // Compute word timings (internally uses chunked text)
  const { timings, totalWords } = useWordTimings({
    text,
    dur,
    startOffset: 6,
    endBuffer: 8,
  });

  if (totalWords === 0 || timings.length === 0) return null;

  // Parse chunked lines (not raw text) for display
  const lines = parseTextLines(chunkedText);
  const wordsPerLine = lines.map(countWords);
  const activeWordIdx = getActiveWordIndex(timings, frame);

  // Determine which chunk is active
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

  // Get the active chunk's words
  const activeLine = lines[activeLineIdx] || "";
  const tokens = activeLine.split(/(\s+)/);

  // Render tokens with highlighting — only the active chunk is visible
  let wordCounter = 0;
  const lineStartWordIdx = accumulatedWords;
  const renderedTokens = tokens.map((token, ti) => {
    if (/^\s+$/.test(token)) {
      return <span key={ti}>{" "}</span>;
    }

    const globalWordIdx = lineStartWordIdx + wordCounter;
    const isRevealed = globalWordIdx < activeWordIdx + 1;
    const isCurrent = globalWordIdx === activeWordIdx;
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
          justifyContent: "center",
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
          }}
        >
          {renderedTokens}
        </span>
      </div>
    </AbsoluteFill>
  );
};
