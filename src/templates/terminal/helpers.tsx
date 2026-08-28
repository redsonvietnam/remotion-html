// ---------------------------------------------------------------------------
// Terminal Code Tip Helpers — Vertical short-form visual primitives
//
// Matrix-green, terminal aesthetic, deterministic frame-based animation.
// ---------------------------------------------------------------------------

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../../design/theme";

// ─── Animation Helpers ──────────────────────────────────────────────────────

export const fadeIn = (frame: number, delay: number, fps: number, duration = 20) => {
  const t = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity: t };
};

export const slideUp = (frame: number, delay: number, fps: number, distance = 50) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 24, mass: 0.4 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [distance, 0])}px)`,
  };
};

export const scaleIn = (frame: number, delay: number, fps: number) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 20, mass: 0.6 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `scale(${interpolate(t, [0, 1], [0.85, 1])})`,
  };
};

// ─── Matrix Rain (deterministic) ───────────────────────────────────────────

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface Drop {
  x: number;
  speed: number;
  startFrame: number;
  chars: string[];
}

function generateDrops(count: number, cols: number, charH: number, fps: number): Drop[] {
  const drops: Drop[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 137 + 42;
    const col = Math.floor(seededRandom(seed) * cols);
    const len = 8 + Math.floor(seededRandom(seed + 1) * 12);
    const chars: string[] = [];
    for (let j = 0; j < len; j++) {
      chars.push(CHARS[Math.floor(seededRandom(seed + j * 3 + 2) * CHARS.length)]);
    }
    drops.push({
      x: col * charH,
      speed: 1.5 + seededRandom(seed + 3) * 2.5,
      startFrame: Math.floor(seededRandom(seed + 4) * fps * 4),
      chars,
    });
  }
  return drops;
}

export const MatrixRain: React.FC<{ W: number; H: number }> = ({ W, H }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const charH = 18;
  const charW = 14;
  const cols = Math.ceil(W / charW);
  const rows = Math.ceil(H / charH);
  const dropCount = Math.floor(cols * 0.6);

  const drops = React.useMemo(() => generateDrops(dropCount, cols, charH, fps), [dropCount, cols, charH, fps]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ width: W, height: H, position: "relative" }}>
        {drops.map((drop, i) => {
          const elapsed = frame - drop.startFrame;
          if (elapsed < 0) return null;
          const headY = Math.floor(elapsed * drop.speed);
          return drop.chars.map((ch, j) => {
            const y = headY - j;
            if (y < 0 || y >= rows) return null;
            const isHead = j === 0;
            const alpha = isHead ? 1 : Math.max(0, 1 - j / drop.chars.length) * 0.5;
            return (
              <span
                key={`${i}-${j}`}
                style={{
                  position: "absolute",
                  left: drop.x,
                  top: y * charH,
                  fontFamily: theme.fonts.mono,
                  fontSize: 14,
                  lineHeight: `${charH}px`,
                  color: isHead ? "#ffffff" : theme.colors.accent1,
                  opacity: alpha,
                  textShadow: isHead ? `0 0 8px ${theme.colors.accent1}` : "none",
                }}
              >
                {ch}
              </span>
            );
          });
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Terminal Card ──────────────────────────────────────────────────────────

export const TerminalCard: React.FC<{
  W: number;
  H: number;
  language: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ W, H, language, children, style }) => {
  const theme = useTheme();
  const cardW = Math.min(W - 60, 920);
  const cardH = H * 0.52;

  return (
    <div
      style={{
        position: "absolute",
        left: (W - cardW) / 2,
        top: H * 0.2,
        width: cardW,
        height: cardH,
        background: theme.colors.card,
        borderRadius: theme.radii.lg,
        border: `1px solid ${theme.colors.line}`,
        overflow: "hidden",
        boxShadow: `0 0 40px rgba(0,255,102,0.08)`,
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 40,
          padding: "0 14px",
          background: "rgba(0,0,0,0.3)",
          borderBottom: `1px solid ${theme.colors.line}`,
          gap: 8,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        <span
          style={{
            marginLeft: "auto",
            fontFamily: theme.fonts.mono,
            fontSize: 12,
            color: theme.colors.muted,
            letterSpacing: 0.5,
          }}
        >
          {language}
        </span>
      </div>
      {/* Code area */}
      <div style={{ padding: "16px 20px", overflow: "hidden", height: cardH - 40 }}>
        {children}
      </div>
    </div>
  );
};

// ─── Code Block ─────────────────────────────────────────────────────────────

import { SYNTAX_COLORS } from "../../theme/terminal";
import type { CodeLine } from "../../data/terminal";

export const CodeBlock: React.FC<{
  lines: CodeLine[];
  visibleChars?: number;
  highlightLine?: number;
}> = ({ lines, visibleChars, highlightLine }) => {
  const theme = useTheme();

  let charCount = 0;
  return (
    <pre
      style={{
        margin: 0,
        fontFamily: theme.fonts.mono,
        fontSize: 18,
        lineHeight: 1.7,
        color: theme.colors.ink,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      {lines.map((line, li) => {
        const isHighlight = highlightLine === li;
        const lineStart = charCount;

        let rendered: React.ReactNode;
        if (visibleChars !== undefined && visibleChars <= lineStart) {
          rendered = null;
        } else if (visibleChars !== undefined && line.tokens && line.tokens.length > 0) {
          const available = visibleChars - lineStart;
          rendered = renderTokens(line.text, line.tokens, available);
        } else if (visibleChars !== undefined) {
          const available = visibleChars - lineStart;
          rendered = line.text.slice(0, Math.max(0, available));
        } else {
          rendered = line.tokens && line.tokens.length > 0
            ? renderTokens(line.text, line.tokens, line.text.length)
            : line.text;
        }

        charCount += line.text.length + 1; // +1 for newline

        return (
          <div
            key={li}
            style={{
              background: isHighlight ? "rgba(0,255,102,0.08)" : "transparent",
              borderLeft: isHighlight ? `2px solid ${theme.colors.accent1}` : "2px solid transparent",
              paddingLeft: 8,
            }}
          >
            {rendered ?? "\u00A0"}
          </div>
        );
      })}
    </pre>
  );
};

function renderTokens(text: string, tokens: CodeLine["tokens"] & {}, maxLen: number): React.ReactNode {
  if (!tokens || tokens.length === 0) return text.slice(0, maxLen);

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const tok of tokens) {
    if (tok.start > cursor) {
      parts.push(<span key={`p${cursor}`}>{text.slice(cursor, Math.min(tok.start, maxLen))}</span>);
      cursor = tok.start;
    }
    if (cursor >= maxLen) break;
    const end = Math.min(tok.start + tok.length, maxLen);
    parts.push(
      <span key={`t${tok.start}`} style={{ color: SYNTAX_COLORS[tok.kind] ?? "#e6e6e6" }}>
        {text.slice(cursor, end)}
      </span>
    );
    cursor = end;
  }
  if (cursor < maxLen) {
    parts.push(<span key={`e${cursor}`}>{text.slice(cursor, maxLen)}</span>);
  }
  return parts;
}

// ─── Caption ────────────────────────────────────────────────────────────────

export const Caption: React.FC<{
  text: string;
  W: number;
  H: number;
  anim?: React.CSSProperties;
}> = ({ text, W, H, anim }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        bottom: H * 0.1,
        left: 0,
        right: 0,
        textAlign: "center",
        padding: "0 40px",
        ...anim,
      }}
    >
      <span
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 600,
          fontSize: 34,
          color: theme.colors.ink,
          textShadow: `0 2px 20px rgba(0,255,102,0.3)`,
          letterSpacing: -0.5,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ─── Progress Dots ──────────────────────────────────────────────────────────

export const ProgressDots: React.FC<{
  total: number;
  current: number;
  W: number;
  H: number;
}> = ({ total, current, W, H }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        bottom: H * 0.04,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i === current ? theme.colors.accent1 : theme.colors.muted,
            opacity: i === current ? 1 : 0.4,
            transition: "none",
          }}
        />
      ))}
    </div>
  );
};
