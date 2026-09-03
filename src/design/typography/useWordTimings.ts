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
// Splits long caption text into short semantic chunks.
// Priority: meaning → speech pause → semantic unit integrity → visual rhythm
//           → word count (4-7 preferred, 8-10 acceptable, 12 hard max).
// ---------------------------------------------------------------------------

// --- Protected Semantic Units (NEVER split across chunks) ---

interface ProtectedRange {
  start: number;
  end: number;
}

const PROTECTED_UNIT_PATTERNS: RegExp[] = [
  // Vietnamese text dates: ngày 1 tháng 7 năm 2025
  /ngày\s+\d{1,2}\s+tháng\s+\d{1,2}\s+năm\s+\d{4}/gi,
  // Slash dates: 29/06/2024, 01/07/2025
  /\d{1,2}\/\d{1,2}\/\d{4}/g,
  // Law name + identifier: Luật Bảo hiểm xã hội số 41/2024/QH15
  /Luật\s+\S+(?:\s+\S+)*\s+số\s+\S+/gi,
  // Legal references: Điều 64, Nghị quyết 28, Quyết định 15
  /(?:Điều|Nghị quyết|Quyết định)\s+\d+/gi,
  // Law name without identifier: Luật Bảo hiểm xã hội, Luật Lao động (with optional year)
  /Luật\s+(?:Bảo hiểm xã hội|Lao động|Doanh nghiệp|Thuế|Hình sự|Dân sự|Đất đai|Xây dựng|Giao thông)(?:\s+\d{4})?/gi,
  // Number + unit (compound Vietnamese): mười lăm năm, hai mươi tuổi, hai mươi năm
  /(?:hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|hai mươi|ba mươi|bốn mươi|năm mươi)\s+(?:lăm|bốn|hai|ba|sáu|bảy|tám|chín)\s+(?:năm|tháng|ngày|tuổi|phần trăm)|(?:hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|hai mươi|ba mươi|bốn mươi|năm mươi)\s+(?:năm|tháng|ngày|tuổi|phần trăm)/g,
  // Number + unit (digit form): 15 năm, 41/2024, 2024
  /\d+\s*(?:năm|tháng|ngày|tuổi|phần trăm)/g,
  // Percentages: 25,5%, 100%
  /\d+(?:[.,]\d+)?\s*%/g,
  // Domain terms (multi-word): bảo hiểm xã hội, an sinh xã hội, lương hưu
  /bảo hiểm xã hội|an sinh xã hội|hưởng lương hưu|rút bảo hiểm|đóng bảo hiểm|lương hưu|Trung ương Đảng|Quốc hội|người lao động|bền vững và bao trùm/gi,
];

function buildProtectedRanges(text: string): ProtectedRange[] {
  const ranges: ProtectedRange[] = [];
  for (const pattern of PROTECTED_UNIT_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      ranges.push({ start: m.index, end: m.index + m[0].length });
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  return ranges;
}

function isCharInProtected(charIndex: number, ranges: ProtectedRange[]): boolean {
  for (const r of ranges) {
    if (charIndex >= r.start && charIndex < r.end) return true;
    if (r.start > charIndex) break;
  }
  return false;
}

function isWordInProtected(charStart: number, charEnd: number, ranges: ProtectedRange[]): boolean {
  for (const r of ranges) {
    // Word overlaps with protected range (handles trailing punctuation)
    if (charStart < r.end && charEnd > r.start) return true;
    if (r.start >= charEnd) break;
  }
  return false;
}

// --- Word Tokenizer ---

interface WordToken {
  word: string;
  charStart: number;
  charEnd: number;
}

function tokenizeWords(text: string): WordToken[] {
  const tokens: WordToken[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    tokens.push({ word: m[0], charStart: m.index, charEnd: m.index + m[0].length });
  }
  return tokens;
}

// --- Break Scoring ---

const CONJUNCTIONS = ["và", "hoặc", "nhưng", "mà", "khi", "nếu", "thì"];
const PREPOSITIONS = ["của", "cho", "từ", "tới", "đến", "với", "theo"];

function scoreBreakPosition(
  word: WordToken,
  wordIndex: number,
  words: WordToken[],
  chunkLen: number,
  protectedRanges: ProtectedRange[],
): number {
  const w = word.word;
  const isLast = wordIndex === words.length - 1;
  if (isLast) return 200;

  const next = words[wordIndex + 1];

  // Inside protected unit: never break
  const curProtected = isWordInProtected(word.charStart, word.charEnd, protectedRanges);
  const nextProtected = isWordInProtected(next.charStart, next.charEnd, protectedRanges);
  if (curProtected && nextProtected) return -100;

  // At boundary of protected unit
  const atProtectedEnd = curProtected && !nextProtected;

  let score = 0;

  // Punctuation strength (0–30)
  if (/[.!?]$/.test(w)) score += 30;
  else if (/;/.test(w)) score += 25;
  else if (/:/.test(w)) score += 18;
  else if (/,/.test(w)) score += 10;

  // Protected unit boundary
  if (atProtectedEnd) score += 20;

  // Conjunction as clause boundary
  const clean = w.toLowerCase().replace(/[,.]$/, "");
  if (CONJUNCTIONS.includes(clean) && chunkLen >= 3) score += 10;

  // Preposition (weak, needs decent chunk)
  if (PREPOSITIONS.includes(clean) && chunkLen >= 4) score += 5;

  // Chunk size preference
  if (chunkLen >= 3 && chunkLen <= 7) score += 10;
  else if (chunkLen >= 8 && chunkLen <= 10) score += 3;
  else if (chunkLen < 3) score -= 20;
  else if (chunkLen > 10) score -= 20;

  return score;
}

// --- Main Chunking Function ---

export function chunkCaptionText(text: string, minWords = 4, maxWords = 7, hardMax = 10): string {
  const words = tokenizeWords(text);
  if (words.length <= maxWords) return text;

  const protectedRanges = buildProtectedRanges(text);
  const breaks: number[] = [words.length - 1]; // end is always a break

  // Left-to-right greedy: accumulate words, break at best local position
  let chunkStart = 0;
  let i = 0;
  while (i < words.length - 1) {
    const chunkLen = i - chunkStart + 1;

    // Force break at hardMax — overrides everything (including protected units)
    if (chunkLen >= hardMax) {
      breaks.push(i);
      chunkStart = i + 1;
      i++;
      continue;
    }

    const score = scoreBreakPosition(words[i], i, words, chunkLen, protectedRanges);

    // Accept break if: good score AND chunk >= minWords AND not splitting protected unit
    const next = words[i + 1];
    const curInProt = isWordInProtected(words[i].charStart, words[i].charEnd, protectedRanges);
    const nextOverlapsProt = isWordInProtected(next.charStart, next.charEnd, protectedRanges);

    // Lookahead: prevent break when BOTH current and next words are in protected ranges
    // This preserves protected units (dates, law names, number+unit, etc.)
    // But allow break when current word is NOT protected (natural break point)
    const splittingProtected = curInProt && nextOverlapsProt && !/[.!?;:]$/.test(words[i].word);

    const shouldBreak =
      !splittingProtected &&
      (chunkLen >= minWords || (curInProt && !nextOverlapsProt)) &&
      (score >= 10 || chunkLen >= hardMax || /[.!?;]$/.test(words[i].word));

    if (shouldBreak) {
      breaks.push(i);
      chunkStart = i + 1;
      i++;
      continue;
    }

    i++;
  }

  // Build chunks from breaks (sorted ascending, deduplicated)
  const sortedBreaks = [...new Set(breaks)].sort((a, b) => a - b);
  const chunks: string[] = [];
  let prev = -1;
  const chunkRanges: { start: number; end: number }[] = [];
  for (const b of sortedBreaks) {
    const chunkWords = words.slice(prev + 1, b + 1).map((w) => w.word);
    chunks.push(chunkWords.join(" "));
    chunkRanges.push({ start: prev + 1, end: b });
    prev = b;
  }

  // Post-process: merge too-short chunks (<3 words) with neighbor
  // Allow 3-word chunks only if they contain a protected unit
  for (let ci = chunks.length - 1; ci > 0; ci--) {
    const wc = chunks[ci].split(/\s+/).filter(Boolean).length;
    if (wc >= 3) continue;
    const range = chunkRanges[ci];
    const chunkCharStart = words[range.start]?.charStart ?? 0;
    const chunkCharEnd = words[range.end]?.charEnd ?? 0;
    const isProtected = isWordInProtected(chunkCharStart, chunkCharEnd, protectedRanges);
    if (!isProtected) {
      chunks[ci - 1] = chunks[ci - 1] + " " + chunks[ci];
      chunks.splice(ci, 1);
      chunkRanges.splice(ci, 1);
    }
  }

  // Safety: split any chunk still exceeding hardMax
  const finalChunks: string[] = [];
  for (const chunk of chunks) {
    const chunkWords = chunk.split(/\s+/).filter(Boolean);
    if (chunkWords.length > hardMax) {
      for (let j = 0; j < chunkWords.length; j += maxWords) {
        finalChunks.push(chunkWords.slice(j, j + maxWords).join(" "));
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
