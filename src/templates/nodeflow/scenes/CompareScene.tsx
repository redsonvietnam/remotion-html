// ---------------------------------------------------------------------------
// CompareScene — "Before vs. After": side-by-side comparison
//
// Visual: Split screen with two NodeBox panels (OLD LAW vs NEW LAW).
// A central dividing line animates. On the left: dim/inactive nodes.
// On the right: bright/active nodes (new law wins).
// Key changes highlighted with amber data badges.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio } from "remotion";
import { useTheme } from "../../../design/theme";
import { Backdrop, SceneContainer, SectionLabel, SignalIndicator, textIn, reveal, edgeDraw } from "../helpers";
import { NodeBox, EdgeLine, DataBadge } from "../svg";
import { KaraokeReveal } from "../../../design/typography";
import type { NodeFlowCompareContent } from "../types";

type Props = { audio: string; caption: string; dur: number } & NodeFlowCompareContent;

export const CompareScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  title,
  before,
  after,
  changeLabel,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = textIn(frame, 0, fps, 30);
  const leftReveal = reveal(frame, 10, 25);
  const rightReveal = reveal(frame, 30, 25);
  const dividerReveal = edgeDraw(frame, 20, 20);
  const badgeReveal = reveal(frame, 60, 20);

  // Card layout
  const CARD_W = 700;
  const CARD_H = 70;
  const CARD_GAP = 90;
  const LEFT_X = 80;
  const RIGHT_X = 940;
  const CARDS_Y_START = 80;

  const maxRows = Math.max(before.items.length, after.items.length);
  const SVG_H = maxRows * CARD_GAP + 160;

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SignalIndicator label="COMPARE" frame={frame} />

      {/* Title bar */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 100,
          right: 100,
          ...titleAnim,
        }}
      >
        <SectionLabel text="Thay đổi quan trọng" />
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 56,
            color: theme.colors.ink,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
      </div>

      {/* Comparison SVG */}
      <svg
        width={1720}
        height={SVG_H + 40}
        viewBox={`0 0 1720 ${SVG_H + 40}`}
        style={{
          position: "absolute",
          left: 100,
          top: 200,
          overflow: "visible",
        }}
      >
        {/* Column headers */}
        <g opacity={leftReveal}>
          <text x={LEFT_X + CARD_W / 2} y={30} textAnchor="middle" fill={theme.colors.muted} fontSize={18} fontWeight={700} fontFamily={theme.fonts.mono ?? theme.fonts.display} letterSpacing={3}>
            LUẬT CŨ
          </text>
          <line x1={LEFT_X} y1={48} x2={LEFT_X + CARD_W} y2={48} stroke={theme.colors.muted} strokeWidth={1} strokeOpacity={0.3} />
        </g>
        <g opacity={rightReveal}>
          <text x={RIGHT_X + CARD_W / 2} y={30} textAnchor="middle" fill={theme.colors.accent1} fontSize={18} fontWeight={700} fontFamily={theme.fonts.mono ?? theme.fonts.display} letterSpacing={3}>
            LUẬT MỚI 2024
          </text>
          <line x1={RIGHT_X} y1={48} x2={RIGHT_X + CARD_W} y2={48} stroke={theme.colors.accent1} strokeWidth={1.5} strokeOpacity={0.5} />
        </g>

        {/* Center divider */}
        <EdgeLine
          x1={CARD_W + LEFT_X + 40}
          y1={0}
          x2={CARD_W + LEFT_X + 40}
          y2={SVG_H}
          progress={dividerReveal}
          color={theme.colors.line}
          strokeWidth={1}
          arrowHead={false}
        />

        {/* "Change" label in center */}
        {changeLabel && (
          <g opacity={badgeReveal}>
            <rect
              x={CARD_W + LEFT_X + 40 - 80}
              y={SVG_H / 2 - 18}
              width={160}
              height={36}
              rx={6}
              fill={theme.colors.accent2}
              fillOpacity={0.12}
              stroke={theme.colors.accent2}
              strokeWidth={0.8}
            />
            <text
              x={CARD_W + LEFT_X + 40}
              y={SVG_H / 2 + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={theme.colors.accent2}
              fontSize={13}
              fontWeight={700}
              fontFamily={theme.fonts.mono ?? theme.fonts.display}
              letterSpacing={2}
            >
              {changeLabel}
            </text>
          </g>
        )}

        {/* Left cards (old law) */}
        {before.items.map((item, i) => (
          <g key={i} opacity={leftReveal}>
            <NodeBox
              x={LEFT_X}
              y={CARDS_Y_START + i * CARD_GAP}
              w={CARD_W}
              h={CARD_H}
              label={item.label}
              sublabel={item.value}
              active={false}
              activePct={1}
              color={theme.colors.muted}
              textSize={17}
            />
          </g>
        ))}

        {/* Right cards (new law) */}
        {after.items.map((item, i) => (
          <g key={i} opacity={rightReveal}>
            <NodeBox
              x={RIGHT_X}
              y={CARDS_Y_START + i * CARD_GAP}
              w={CARD_W}
              h={CARD_H}
              label={item.label}
              sublabel={item.value}
              active={true}
              activePct={1}
              color={item.highlight ? theme.colors.accent2 : theme.colors.accent1}
              textSize={17}
            />
            {item.highlight && (
              <DataBadge
                x={RIGHT_X + CARD_W + 8}
                y={CARDS_Y_START + i * CARD_GAP + CARD_H / 2 - 8}
                value="MỚI"
                activePct={badgeReveal}
                color={theme.colors.accent2}
              />
            )}
          </g>
        ))}
      </svg>

      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={theme.fonts.display}
        activeColor={theme.colors.accent1}
        revealedColor={theme.colors.ink}
        borderColor={theme.colors.line}
        fontSize={22}
      />
    </AbsoluteFill>
  );
};
