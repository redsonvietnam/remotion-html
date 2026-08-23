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

// ---------------------------------------------------------------------------
// Semantic Caption Chunking — Vietnamese-aware one-line caption chunker
//
// Splits long caption text into short semantic chunks (4-7 words target,
// up to ~10 when preserving a semantic unit). Splits on punctuation/clause
// boundaries first, then semantic phrase boundaries. Preserves important
// units: numbers+units, percentages, dates, legal references, proper nouns.
// ---------------------------------------------------------------------------

const SEMANTIC_PRESERVE_PATTERNS = [
  // Percentages: 25,5%, 25.5%, 100%
  /\d+(?:[.,]\d+)?\s*%/g,
  // Numbers with units: 15 năm, 81%, 41/2024, 36/2024
  /\d+(?:[.,]\d+)?\s*(?:năm|tháng|ngày|tuổi|triệu|tỷ|%|điểm)/gi,
  // Legal references: Điều 64, Điều 70, Luật 41/2024, Luật 36/2024
  /(?:Điều|Luật|Nghị quyết|Quyết định)\s+\d+(?:\/\d+)?/gi,
  // Dates: 29/06/2024, 01/07/2025, 23/05/2018
  /\d{1,2}\/\d{1,2}\/\d{4}/g,
  // Vietnamese multi-word proper nouns (capitalized sequences)
  /(?:Luật|Bảo hiểm|Xã hội|Quốc hội|Chính phủ|Bộ|Cục|VNeID|BHXH|BHYT|GPLX|CCCD)(?:\s+[A-ZĐ][a-zàáâãèéêìíòóôõùúăđĩơư]+)*/g,
  // Currency: 400.000đ, 50.000.000đ
  /\d+(?:\.\d{3})*(?:,\d+)?\s*đ/g,
  // Fractions: 25,5%, 17,5%
  /\d+[.,]\d+\s*%/g,
];

function splitIntoWords(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.trim().length > 0);
}

function isPreservedUnit(word: string, nextWord: string): boolean {
  // Check single word against patterns (for dates, percentages, etc.)
  if (SEMANTIC_PRESERVE_PATTERNS.some((pattern) => pattern.test(word))) {
    return true;
  }
  // Check two-word combinations
  if (nextWord) {
    const combined = word + " " + nextWord;
    return SEMANTIC_PRESERVE_PATTERNS.some((pattern) => pattern.test(combined));
  }
  return false;
}

function shouldBreakAfter(word: string, nextWord: string, currentChunkLength: number): boolean {
  // Always break after sentence-ending punctuation
  if (/[.!?]$/.test(word)) return true;
  // Break after clause-separating commas in longer chunks
  if (/,/.test(word) && currentChunkLength >= 4) return true;
  // Don't break semantic units
  if (nextWord && isPreservedUnit(word, nextWord)) return false;
  // Don't break if would create too-short chunk
  if (currentChunkLength < 4) return false;
  // Break at natural phrase boundaries (prepositions, conjunctions)
  const phraseEnders = [
    "và", "hoặc", "nhưng", "mà", "khi", "nếu", "thì", "là", "của", "cho",
    "từ", "tới", "đến", "với", "theo", "theo đó", "do đó", "vì vậy",
  ];
  if (phraseEnders.some((p) => word.toLowerCase().endsWith(" " + p) || word.toLowerCase() === p)) {
    return currentChunkLength >= 4;
  }
  return false;
}

export function chunkCaptionText(text: string, minWords = 4, maxWords = 7, hardMax = 10): string {
  const words = splitIntoWords(text);
  if (words.length <= maxWords) return text;

  // First pass: identify natural break points
  const breakPoints: boolean[] = new Array(words.length).fill(false);
  for (let i = 0; i < words.length; i++) {
    if (i === words.length - 1) {
      breakPoints[i] = true; // Always break at end
      continue;
    }
    const word = words[i];
    const nextWord = words[i + 1];
    
    // Always break after sentence-ending punctuation
    if (/[.!?]$/.test(word)) {
      breakPoints[i] = true;
      continue;
    }
    // Break after clause-separating commas in longer chunks
    if (/,/.test(word)) {
      breakPoints[i] = true;
      continue;
    }
    // Don't break semantic units
    if (isPreservedUnit(word, words[i + 1] || "")) {
      breakPoints[i] = false;
      continue;
    }
    // Break at phrase boundaries
    const phraseEnders = ["và", "hoặc", "nhưng", "mà", "khi", "nếu", "thì", "là", "của", "cho", "từ", "tới", "đến", "với", "theo", "theo đó", "do đó", "vì vậy"];
    if (phraseEnders.some(p => word.toLowerCase().endsWith(" " + p) || word.toLowerCase() === p)) {
      breakPoints[i] = true;
      continue;
    }
  }

  // Second pass: build chunks respecting min/max limits
  const chunks: string[] = [];
  let currentChunk: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = i + 1 < words.length ? words[i + 1] : "";
    const nextIsPreserved = nextWord && isPreservedUnit(word, nextWord);

    // BEFORE adding, check if adding this word would exceed maxWords
    // If so, break BEFORE adding (unless it's a preserved unit)
    const wouldExceedMax = currentChunk.length >= 7 && !isPreservedUnit(currentChunk[currentChunk.length - 1] || "", word);
    if (wouldExceedMax && currentChunk.length > 0) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
    }

    // Add current word
    currentChunk.push(word);

    // If next word is preserved with current, add it too
    if (nextIsPreserved) {
      currentChunk.push(nextWord);
      i++; // skip next
    }

    // Check if we should break
    // Check if we should break
    const atHardMax = currentChunk.length >= 10;
    const atEnd = i === words.length - 1;
    
    // Only break at breakPoints if chunk has enough words (>= minWords)
    // This prevents creating too-short chunks at punctuation
    const canBreakAtBreakPoint = breakPoints[i] && currentChunk.length >= 4;
    const shouldBreak = currentChunk.length >= 10 || i === words.length - 1 || (breakPoints[i] && currentChunk.length >= 4);

    if (shouldBreak) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
    }
  }

  // Handle leftover (shouldn't happen due to atEnd, but safety)
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  // Post-process: merge any too-short final chunks (< 4 words) with previous
  for (let i = chunks.length - 1; i > 0; i--) {
    const wordsInChunk = chunks[i].split(/\s+/).filter(Boolean).length;
    if (wordsInChunk < 4) {
      // Merge with previous
      chunks[i - 1] = chunks[i - 1] + " " + chunks[i];
      chunks.splice(i, 1);
    }
  }

  // Final safety: split any chunk that's still too long (>10 words)
  const finalChunks: string[] = [];
  for (const chunk of chunks) {
    const chunkWords = chunk.split(/\s+/).filter(Boolean);
    if (chunkWords.length > 10) {
      // Split this oversized chunk
      for (let j = 0; j < chunkWords.length; j += 7) {
        finalChunks.push(chunkWords.slice(j, j + 7).join(" "));
      }
    } else {
      finalChunks.push(chunk);
    }
  }

  return finalChunks.join("\n");
}

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
  // Chunk long captions into semantic lines for one-row display
  const chunkedText = chunkCaptionText(text);
  const lines = parseTextLines(chunkedText);
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
