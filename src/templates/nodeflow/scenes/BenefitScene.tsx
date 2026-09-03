// ---------------------------------------------------------------------------
// BenefitScene — "What you get": right to left list of benefits
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { Backdrop, SceneContainer, SectionLabel, HRule, SignalIndicator, textIn, reveal } from "../helpers";
import { NodeBox, EdgeLine } from "../svg";
import { KaraokeReveal } from "../../../design/typography";
import type { NodeFlowBenefitContent } from "../types";

const ICONS: Record<string, string> = {
  pension: "M8 4 L8 16 M4 8 L12 8 M4 12 L12 12",
  health: "M6 12 L10 12 M8 10 L8 14 M12 8 A4 4 0 1 1 4 8 A4 4 0 1 1 12 8",
  maternity: "M8 4 A3 3 0 0 1 14 4 L14 10 A6 6 0 0 1 2 10 L2 4",
  work: "M2 14 L8 2 L14 14 Z",
  unemployment: "M2 10 L8 4 L14 10 L14 14 L2 14 Z",
  death: "M8 2 L8 14 M4 6 L12 6",
};

const BenefitIcon: React.FC<{
  type: string;
  x: number;
  y: number;
  color: string;
  size?: number;
}> = ({ type, x, y, color, size = 40 }) => {
  const theme = useTheme();
  const r = size / 2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={r} cy={r} r={r} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={1} strokeOpacity={0.5} />
      <g transform={`translate(${r - 8} ${r - 8})`} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round">
        <path d={ICONS[type] ?? ICONS["pension"]} />
      </g>
    </g>
  );
};

export type BenefitSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & NodeFlowBenefitContent;

export const BenefitSceneData: React.FC<BenefitSceneProps> = ({
  audio,
  caption,
  dur,
  frame,
  fps,
  title,
  description,
  benefits,
}) => {
  const theme = useTheme();

  const titleAnim = textIn(frame, 0, fps, 30);
  const descAnim = textIn(frame, 12, fps, 25);

  const cardReveals = benefits.map((_, i) => reveal(frame, 20 + i * 22, 25));

  const CARD_W = 760;
  const CARD_H = 60;
  const CARD_GAP = 76;
  const CARD_X = 80;
  const CARD_Y_START = 0;
  const ICON_SIZE = 44;

  const colorCycle = [theme.colors.accent3, theme.colors.accent1, theme.colors.accent2, theme.colors.accent3, theme.colors.accent1, theme.colors.accent2];

  const SVG_H = benefits.length * CARD_GAP + 60;

  return (
    <AbsoluteFill>
      <Backdrop frame={frame} />
      <SignalIndicator label="RIGHTS" frame={frame} />

      {/* Left panel: text */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 700,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 100,
          paddingRight: 60,
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <SectionLabel text="Quyền lợi người lao động" />
        <div style={titleAnim}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 52,
              lineHeight: 1.15,
              color: theme.colors.ink,
              marginBottom: 20,
            }}
          >
            {title}
          </div>
        </div>
        <HRule />
        <div style={descAnim}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 24,
              lineHeight: 1.6,
              color: theme.colors.muted,
            }}
          >
            {description}
          </div>
        </div>
      </div>

      {/* Right: benefit cards SVG */}
      <svg
        width={900}
        height={SVG_H}
        viewBox={`0 0 900 ${SVG_H}`}
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: `translateY(-${SVG_H / 2}px)`,
          overflow: "visible",
        }}
      >
        <EdgeLine
          x1={60}
          y1={CARD_H / 2}
          x2={60}
          y2={CARD_Y_START + (benefits.length - 1) * CARD_GAP + CARD_H / 2}
          progress={cardReveals[Math.min(2, benefits.length - 1)]}
          color={theme.colors.line}
          strokeWidth={1}
          arrowHead={false}
        />

        {benefits.map((b, i) => {
          const y = CARD_Y_START + i * CARD_GAP;
          const c = colorCycle[i % colorCycle.length];
          return (
            <g key={i} opacity={cardReveals[i]}>
              <BenefitIcon type={b.icon} x={36} y={y + (CARD_H - ICON_SIZE) / 2} color={c} size={ICON_SIZE} />
              <NodeBox
                x={CARD_X}
                y={y}
                w={CARD_W}
                h={CARD_H}
                label={b.label}
                sublabel={b.value}
                active={true}
                activePct={1}
                color={c}
                textSize={18}
              />
              <circle cx={60} cy={y + CARD_H / 2} r={4} fill={c} opacity={cardReveals[i] * 0.9} />
            </g>
          );
        })}
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
