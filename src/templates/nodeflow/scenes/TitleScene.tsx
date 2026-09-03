// ---------------------------------------------------------------------------
// TitleScene — Opening: law title + system status panel
//
// Data component: receives frame/fps as props (no Remotion hooks).
// Remotion wrapper: useTitleScene.tsx passes useCurrentFrame/useVideoConfig.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { Backdrop, SceneContainer, SectionLabel, LawBadge, SignalIndicator, textIn, nodeIn, reveal, edgeDraw } from "../helpers";
import { NodeBox, EdgeLine, SignalPulse } from "../svg";
import { KaraokeReveal } from "../../../design/typography";
import type { NodeFlowTitleContent } from "../types";

export type TitleSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & NodeFlowTitleContent;

export const TitleSceneData: React.FC<TitleSceneProps> = ({
  audio,
  caption,
  dur,
  frame,
  fps,
  lawCode,
  title,
  subtitle,
  tagline,
  nodes,
}) => {
  const theme = useTheme();

  const badgeAnim = textIn(frame, 0, fps);
  const titleAnim = textIn(frame, 8, fps, 40);
  const subAnim = textIn(frame, 20, fps, 30);
  const tagAnim = textIn(frame, 34, fps, 20);

  // Three entity nodes boot up at offsets
  const nodeDelays = [45, 60, 75];
  const nodeActivePcts = nodeDelays.map((d) => reveal(frame, d, 20));

  // Edges draw after all nodes are up
  const edge1Pct = edgeDraw(frame, 90, 18);
  const edge2Pct = edgeDraw(frame, 108, 18);

  // Signal pulses active after edges drawn
  const signalsVisible = frame > 120;

  // Node positions (bottom strip)
  const W = 1920;
  const NW = 260;
  const NH = 70;
  const NX = [240, W / 2 - NW / 2, W - 240 - NW];
  const NCX = NX.map((x) => x + NW / 2);

  return (
    <AbsoluteFill>
      <Backdrop frame={frame} />
      <SignalIndicator label="ONLINE" frame={frame} />

      <SceneContainer>
        {/* Law badge */}
        <div style={{ ...badgeAnim, marginBottom: 28 }}>
          <LawBadge text={lawCode} />
        </div>

        {/* Giant law title number */}
        <div style={titleAnim}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 900,
              fontSize: 110,
              lineHeight: 1.0,
              letterSpacing: -3,
              background: `linear-gradient(135deg, ${theme.colors.accent1} 0%, ${theme.colors.accent1Soft} 40%, ${theme.colors.accent2} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 0,
            }}
          >
            {title}
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ ...subAnim, maxWidth: 900 }}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 500,
              fontSize: 36,
              lineHeight: 1.35,
              color: theme.colors.ink,
              marginTop: 12,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Tagline */}
        <div style={tagAnim}>
          <div
            style={{
              fontFamily: theme.fonts.mono ?? theme.fonts.display,
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: 4,
              color: theme.colors.muted,
              textTransform: "uppercase",
              marginTop: 16,
            }}
          >
            {tagline}
          </div>
        </div>
      </SceneContainer>

      {/* Bottom node network (absolute) */}
      <svg
        width={W}
        height={300}
        viewBox={`0 0 ${W} 300`}
        style={{ position: "absolute", bottom: 80, left: 0, pointerEvents: "none" }}
      >
        {/* Edges */}
        <EdgeLine
          x1={NCX[0]}
          y1={35}
          x2={NCX[1]}
          y2={35}
          progress={edge1Pct}
          color={theme.colors.line}
          strokeWidth={1.2}
          arrowHead={false}
        />
        <EdgeLine
          x1={NCX[1]}
          y1={35}
          x2={NCX[2]}
          y2={35}
          progress={edge2Pct}
          color={theme.colors.line}
          strokeWidth={1.2}
          arrowHead={false}
        />
        {/* Signal pulses */}
        <SignalPulse
          x1={NCX[0]}
          y1={35}
          x2={NCX[1]}
          y2={35}
          frame={frame}
          period={55}
          color={theme.colors.accent1}
          visible={signalsVisible}
        />
        <SignalPulse
          x1={NCX[1]}
          y1={35}
          x2={NCX[2]}
          y2={35}
          frame={frame - 20}
          period={55}
          color={theme.colors.accent1}
          visible={signalsVisible}
        />
        {/* Nodes */}
        {nodes.map((n, i) => (
          <NodeBox
            key={i}
            x={NX[i]}
            y={0}
            w={NW}
            h={NH}
            label={n.label}
            sublabel={n.role}
            active={nodeActivePcts[i] > 0.5}
            activePct={nodeActivePcts[i]}
            color={i === 1 ? theme.colors.accent1 : i === 2 ? theme.colors.accent2 : theme.colors.accent3}
            textSize={16}
          />
        ))}
      </svg>

      {/* Karaoke caption */}
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
