// ---------------------------------------------------------------------------
// ContributionScene — "Rate breakdown": horizontal stacked progress bars
//
// Visual: Employer and employee contribution rates displayed as progress bars
// with amber data badges showing exact percentages. Bars build left-to-right
// sequentially. Total sum appears at the bottom.
// Right side: large numeric "total" treated as a data display.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio } from "remotion";
import { useTheme } from "../../../design/theme";
import { Backdrop, SceneContainer, SectionLabel, HRule, SignalIndicator, textIn, reveal } from "../helpers";
import { ProgressBar, DataBadge } from "../svg";
import { KaraokeReveal } from "../../../design/typography";
import type { NodeFlowContributionContent } from "../../../data/baoHiem2024";

type Props = { audio: string; caption: string; dur: number } & NodeFlowContributionContent;

export const ContributionScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  title,
  rows,
  totalLabel,
  totalValue,
  note,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = textIn(frame, 0, fps, 30);
  const noteAnim = textIn(frame, 90, fps, 20);

  // Each row appears 20 frames apart
  const rowReveals = rows.map((_, i) => reveal(frame, 15 + i * 20, 18));
  // Bar fills animate 10 frames after row appears
  const barFills = rows.map((_, i) => reveal(frame, 30 + i * 20, 30));

  const totalReveal = reveal(frame, 15 + rows.length * 20 + 10, 25);

  // Layout constants
  const BAR_X = 100;
  const BAR_W = 840;
  const BAR_H = 48;
  const ROW_GAP = 72;
  const CHART_Y_START = 160;

  const SVG_W = 1720;
  const SVG_H = 900;

  const rowColors = [
    theme.colors.accent2,   // employer — amber
    theme.colors.accent1,   // employee — cyan
    theme.colors.accent3,   // state — green
    theme.colors.muted,     // others
  ];

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SignalIndicator label="DATA" frame={frame} />

      <SceneContainer>
        <div style={titleAnim}>
          <SectionLabel text="Tỷ lệ đóng góp" />
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 60,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              color: theme.colors.ink,
              marginBottom: 8,
            }}
          >
            {title}
          </div>
        </div>
        <HRule />
      </SceneContainer>

      {/* SVG chart area */}
      <svg
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{
          position: "absolute",
          left: 100,
          top: 160,
          pointerEvents: "none",
        }}
      >
        {rows.map((row, i) => {
          const y = CHART_Y_START - 60 + i * ROW_GAP;
          const color = rowColors[i % rowColors.length];
          return (
            <g key={i} opacity={rowReveals[i]}>
              {/* Row header label */}
              <text
                x={0}
                y={y - 8}
                fill={color}
                fontSize={15}
                fontWeight={700}
                fontFamily={theme.fonts.mono ?? theme.fonts.display}
                letterSpacing={2}
              >
                {row.party.toUpperCase()}
              </text>
              {/* Bar */}
              <ProgressBar
                x={BAR_X}
                y={y}
                w={BAR_W}
                h={BAR_H}
                pct={row.pct}
                progress={barFills[i]}
                label={row.type}
                valueLabel={row.rateLabel}
                color={color}
              />
              {/* Data badge showing percentage */}
              <DataBadge
                x={BAR_X + BAR_W * row.pct * barFills[i] + 16}
                y={y + BAR_H / 2 - 6}
                value={row.rateLabel}
                activePct={barFills[i] > 0.4 ? (barFills[i] - 0.4) / 0.6 : 0}
                color={color}
              />
            </g>
          );
        })}

        {/* Total box */}
        <g opacity={totalReveal}>
          <rect
            x={BAR_X}
            y={CHART_Y_START - 60 + rows.length * ROW_GAP + 20}
            width={BAR_W + 80}
            height={64}
            rx={6}
            fill={theme.colors.accent2}
            fillOpacity={0.08}
            stroke={theme.colors.accent2}
            strokeWidth={1}
            strokeOpacity={0.5}
          />
          <text
            x={BAR_X + 16}
            y={CHART_Y_START - 60 + rows.length * ROW_GAP + 54}
            fill={theme.colors.ink}
            fontSize={20}
            fontWeight={700}
            fontFamily={theme.fonts.display}
          >
            {totalLabel}
          </text>
          <text
            x={BAR_X + BAR_W - 20}
            y={CHART_Y_START - 60 + rows.length * ROW_GAP + 54}
            textAnchor="end"
            fill={theme.colors.accent2}
            fontSize={28}
            fontWeight={900}
            fontFamily={theme.fonts.mono ?? theme.fonts.display}
          >
            {totalValue}
          </text>
        </g>

        {/* Right panel: large number display */}
        <g opacity={totalReveal}>
          <text
            x={1050}
            y={260}
            textAnchor="middle"
            fill={theme.colors.accent2}
            fontSize={180}
            fontWeight={900}
            fontFamily={theme.fonts.mono ?? theme.fonts.display}
            opacity={0.12}
          >
            {totalValue}
          </text>
          <text
            x={1050}
            y={310}
            textAnchor="middle"
            fill={theme.colors.accent2}
            fontSize={86}
            fontWeight={900}
            fontFamily={theme.fonts.mono ?? theme.fonts.display}
            opacity={0.8}
          >
            {totalValue}
          </text>
          <text
            x={1050}
            y={390}
            textAnchor="middle"
            fill={theme.colors.muted}
            fontSize={18}
            fontWeight={500}
            fontFamily={theme.fonts.display}
            letterSpacing={3}
          >
            TỔNG TỶ LỆ ĐÓNG
          </text>
        </g>
      </svg>

      {/* Note text */}
      {note && (
        <div
          style={{
            ...noteAnim,
            position: "absolute",
            bottom: 90,
            left: 100,
            right: 100,
            fontFamily: theme.fonts.display,
            fontSize: 18,
            color: theme.colors.muted,
            lineHeight: 1.5,
          }}
        >
          {note}
        </div>
      )}

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
