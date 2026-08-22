// ---------------------------------------------------------------------------
// FlowScene — "How it works": system diagram with 3 entity nodes + edges
//
// Visual grammar: The 3 parties (NLĐ / DOANH NGHIỆP / QUỸ BHXH) arranged in
// a triangle. Edges draw sequentially showing money flow direction.
// Data badges float on edges showing contribution rates.
// Signal pulses travel along edges.
// Left panel: narrative text. Right panel: live SVG diagram.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio } from "remotion";
import { useTheme } from "../../../design/theme";
import { Backdrop, SceneContainer, SectionLabel, HRule, SignalIndicator, textIn, nodeIn, reveal, edgeDraw } from "../helpers";
import { SystemNode, EdgeLine, SignalPulse, DataBadge } from "../svg";
import { KaraokeReveal } from "../../../design/typography";
import type { NodeFlowFlowContent } from "../types";

type Props = { audio: string; caption: string; dur: number } & NodeFlowFlowContent;

export const FlowScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  title,
  description,
  flowNodes,
  edges,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = textIn(frame, 0, fps, 30);
  const descAnim = textIn(frame, 12, fps, 25);

  // Node reveal timing
  const nodeDelays = [15, 28, 42];
  const nodeActivePcts = nodeDelays.map((d) => reveal(frame, d, 22));

  // Edge draw timing — after all nodes are visible
  const edgeTimings = edges.map((_, i) => edgeDraw(frame, 65 + i * 25, 22));
  const edgeSignals = edges.map((_, i) => frame > 90 + i * 25);

  // SVG diagram region: right half
  const SVG_W = 880;
  const SVG_H = 680;
  // Node positions in diagram (cx, cy, r)
  const nodePositions = [
    { cx: 210, cy: 160, r: 88 },   // node 0 — top-left (NLĐ)
    { cx: 670, cy: 160, r: 88 },   // node 1 — top-right (DOANH NGHIỆP)
    { cx: 440, cy: 500, r: 98 },   // node 2 — bottom-center (QUỸ BHXH)
  ];

  const nodeColors = [theme.colors.accent1, theme.colors.accent2, theme.colors.accent3];

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SignalIndicator label="FLOW" frame={frame} />

      {/* Left text panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 820,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 100,
          paddingRight: 60,
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <SectionLabel text="Cơ chế hoạt động" />
        <div style={titleAnim}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 1.15,
              letterSpacing: -1,
              color: theme.colors.ink,
              marginBottom: 24,
            }}
          >
            {title}
          </div>
        </div>
        <HRule />
        <div style={descAnim}>
          {description.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 26,
                lineHeight: 1.6,
                color: i === 0 ? theme.colors.ink : theme.colors.muted,
                marginBottom: 8,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        {/* Node legend */}
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10 }}>
          {flowNodes.map((n, i) => (
            <div
              key={i}
              style={{
                opacity: nodeActivePcts[i],
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: theme.fonts.display,
                fontSize: 20,
                color: nodeColors[i],
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: nodeColors[i],
                  display: "inline-block",
                  boxShadow: `0 0 8px ${nodeColors[i]}`,
                }}
              />
              {n.label}
              {n.rate && (
                <span
                  style={{
                    fontFamily: theme.fonts.mono ?? theme.fonts.display,
                    fontSize: 15,
                    color: theme.colors.muted,
                    fontWeight: 500,
                  }}
                >
                  — {n.rate}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right SVG diagram */}
      <svg
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          overflow: "visible",
        }}
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodePositions[edge.from];
          const to = nodePositions[edge.to];
          return (
            <g key={i}>
              <EdgeLine
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                progress={edgeTimings[i]}
                color={nodeColors[edge.from]}
                strokeWidth={2}
              />
              {edgeTimings[i] > 0.5 && (
                <DataBadge
                  x={(from.cx + to.cx) / 2 - 10}
                  y={(from.cy + to.cy) / 2 - 20}
                  value={edge.label}
                  activePct={edgeTimings[i]}
                  color={nodeColors[edge.from]}
                />
              )}
              <SignalPulse
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                frame={frame - 20 * i}
                period={70}
                color={nodeColors[edge.from]}
                visible={edgeSignals[i]}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {flowNodes.map((n, i) => (
          <SystemNode
            key={i}
            frame={frame}
            fps={fps}
            cx={nodePositions[i].cx}
            cy={nodePositions[i].cy}
            r={nodePositions[i].r}
            label={n.label}
            sublabel={n.sublabel}
            active={nodeActivePcts[i] > 0.5}
            activePct={nodeActivePcts[i]}
            color={nodeColors[i]}
            beat={i === 2}
          />
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
