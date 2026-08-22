// ---------------------------------------------------------------------------
// EndScene — Closing: system status "ALL NODES ONLINE" + key summary
//
// Visual: Full network topology showing all 3 entity nodes fully active and
// connected. All edges illuminated with signal pulses. Bottom: 3 summary
// stat boxes. A "SYSTEM READY" or equivalent closing stamp.
// The network completes and steadies into a calm, live state.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio } from "remotion";
import { useTheme } from "../../../design/theme";
import { Backdrop, SignalIndicator, textIn, reveal, edgeDraw } from "../helpers";
import { SystemNode, EdgeLine, SignalPulse, NodeBox } from "../svg";
import { KaraokeReveal } from "../../../design/typography";
import type { NodeFlowEndContent } from "../types";

type Props = { audio: string; caption: string; dur: number } & NodeFlowEndContent;

export const EndScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  closingTitle,
  closingSubtitle,
  stats,
  reference,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = textIn(frame, 5, fps, 40);
  const subAnim = textIn(frame, 22, fps, 30);
  const refAnim = textIn(frame, 80, fps, 20);
  const statsReveal = stats.map((_, i) => reveal(frame, 40 + i * 18, 22));

  // Network in background — always on
  const nodeReveal = reveal(frame, 0, 25);
  const edgeReveal = reveal(frame, 20, 20);
  const signalsOn = frame > 35;

  // Positions for background network
  const W = 1920;
  const H = 1080;
  const ncx = [W * 0.12, W * 0.88, W * 0.5];
  const ncy = [H * 0.35, H * 0.35, H * 0.7];
  const nColors = [theme.colors.accent3, theme.colors.accent2, theme.colors.accent1];

  // Stats layout
  const STAT_W = 400;
  const STAT_H = 110;
  const STAT_Y = H - 230;
  const STAT_XS = [
    W / 2 - STAT_W * 1.5 - 30,
    W / 2 - STAT_W / 2,
    W / 2 + STAT_W / 2 + 30,
  ];

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SignalIndicator label="COMPLETE" frame={frame} />

      {/* Background network SVG */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Edges — all three connections */}
        {[[0, 1], [1, 2], [0, 2]].map(([a, b], i) => (
          <g key={i}>
            <EdgeLine
              x1={ncx[a]}
              y1={ncy[a]}
              x2={ncx[b]}
              y2={ncy[b]}
              progress={edgeReveal}
              color={nColors[a]}
              strokeWidth={1.5}
              arrowHead={false}
            />
            <SignalPulse
              x1={ncx[a]}
              y1={ncy[a]}
              x2={ncx[b]}
              y2={ncy[b]}
              frame={frame - i * 18}
              period={80}
              color={nColors[a]}
              visible={signalsOn}
              size={5}
            />
          </g>
        ))}

        {/* Nodes */}
        {[0, 1, 2].map((i) => (
          <SystemNode
            key={i}
            frame={frame}
            fps={fps}
            cx={ncx[i]}
            cy={ncy[i]}
            r={70}
            label={["NHÀ NƯỚC", "DOANH NGHIỆP", "NGƯỜI LAO ĐỘNG"][i]}
            active={true}
            activePct={nodeReveal}
            color={nColors[i]}
            beat={i === 2}
          />
        ))}

        {/* Stat boxes */}
        {stats.map((s, i) => (
          <g key={i}>
            <NodeBox
              x={STAT_XS[i]}
              y={STAT_Y}
              w={STAT_W}
              h={STAT_H}
              label={s.label}
              sublabel={s.value}
              active={true}
              activePct={statsReveal[i]}
              color={nColors[i]}
              textSize={17}
            />
          </g>
        ))}
      </svg>

      {/* Centered closing text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          paddingTop: 60,
          paddingBottom: 280,
        }}
      >
        <div style={titleAnim}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 900,
              fontSize: 80,
              lineHeight: 1.1,
              textAlign: "center",
              letterSpacing: -2,
              background: `linear-gradient(135deg, ${theme.colors.accent1} 0%, ${theme.colors.accent1Soft} 40%, ${theme.colors.accent2} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {closingTitle}
          </div>
        </div>
        <div style={subAnim}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 500,
              fontSize: 32,
              color: theme.colors.muted,
              textAlign: "center",
              marginTop: 16,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {closingSubtitle}
          </div>
        </div>
        <div style={{ ...refAnim, marginTop: 20 }}>
          <div
            style={{
              fontFamily: theme.fonts.mono ?? theme.fonts.display,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: 3,
              color: theme.colors.muted,
              textTransform: "uppercase",
            }}
          >
            {reference}
          </div>
        </div>
      </div>

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
