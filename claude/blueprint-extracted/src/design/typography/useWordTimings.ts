import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { WordTiming, WordTimingsResult } from "./types";

// ---------------------------------------------------------------------------
// useWordTimings — Compute per-word reveal timing
//
// Given a text string and duration, computes the frame at which each word
// should start being revealed. Returns timing data that WordReveal and
// KaraokeReveal use to animate.
//
// Deterministic: all timing is computed from frame, fps, and dur.
// ---------------------------------------------------------------------------

interface UseWordTimingsOptions {
  /** Full text content (may contain newlines for multi-speaker dialogue). */
  text: string;

  /** Duration in seconds. If not provided, uses useVideoConfig().durationInFrames. */
  dur?: number;

  /** Frame offset before word reveal starts. Default: 6. */
  startOffset?: number;

  /** Frame buffer before end to stop reveal. Default: 8. */
  endBuffer?: number;
}

/**
 * Split text into display lines and word tokens.
 * Handles multi-line text (newline-separated speakers).
 */
export function parseTextLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * Count words in a line (splits on whitespace, filters empty).
 */
export function countWords(line: string): number {
  return line.split(/\s+/).filter(Boolean).length;
}

/**
 * Compute word timings for a multi-line text.
 * Returns flat array of WordTiming objects across all lines.
 */
export function computeWordTimings(
  text: string,
  totalFrames: number,
  startOffset: number = 6,
  endBuffer: number = 8
): WordTimingsResult {
  const lines = parseTextLines(text);
  const wordsPerLine = lines.map(countWords);
  const totalWords = wordsPerLine.reduce((a, b) => a + b, 0);

  if (totalWords === 0) {
    return { timings: [], totalWords: 0, totalFrames };
  }

  const revealStart = startOffset;
  const revealEnd = Math.max(revealStart + 1, totalFrames - endBuffer);
  const framesPerWord = (revealEnd - revealStart) / totalWords;

  const timings: WordTiming[] = [];
  let wordIndex = 0;
  let charOffset = 0;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const tokens = line.split(/(\s+)/);

    for (const token of tokens) {
      if (/^\s+$/.test(token)) {
        charOffset += token.length;
        continue;
      }

      const startFrame = revealStart + wordIndex * framesPerWord;
      const endFrame = revealStart + (wordIndex + 1) * framesPerWord;

      timings.push({
        word: token,
        index: wordIndex,
        startFrame: Math.round(startFrame),
        endFrame: Math.round(endFrame),
        charOffset,
      });

      wordIndex++;
      charOffset += token.length;
    }

    charOffset++; // account for newline
  }

  return {
    timings,
    totalWords,
    totalFrames: revealEnd - revealStart,
  };
}

/**
 * React hook that computes word timings based on current frame and duration.
 *
 * Usage:
 *   const { timings, totalWords } = useWordTimings({ text, dur: 10.5 });
 *   // Use timings to animate each word
 */
export function useWordTimings(options: UseWordTimingsOptions): WordTimingsResult {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const { text, dur, startOffset = 6, endBuffer = 8 } = options;

  const totalFrames = dur != null ? Math.round(dur * fps) : durationInFrames;

  return computeWordTimings(text, totalFrames, startOffset, endBuffer);
}

/**
 * Get the currently active word index based on the current frame.
 */
export function getActiveWordIndex(
  timings: WordTiming[],
  frame: number
): number {
  for (let i = timings.length - 1; i >= 0; i--) {
    if (frame >= timings[i].startFrame) {
      return i;
    }
  }
  return 0;
}

/**
 * Get the reveal progress for a specific word (0 = not started, 1 = fully revealed).
 */
export function getWordProgress(
  timing: WordTiming,
  frame: number,
  fps: number
): number {
  return interpolate(frame, [timing.startFrame, timing.endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
