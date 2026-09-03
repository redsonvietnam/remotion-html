// ---------------------------------------------------------------------------
// TimelineScene — Sequential progression along orbital path
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn, reveal } from "../helpers";
import type { CosmosTimelineContent } from "../types";

export type TimelineSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CosmosTimelineContent;

export const TimelineSceneData: React.FC<TimelineSceneProps> = ({
  frame,
  fps,
  title,
  items,
}) => {
  const theme = useTheme();

  const titleAnim = textIn(frame, 0, fps, 30);

  // Timeline track
  const trackWidth = 1400;
  const trackX = 260;
  const trackY = 540;
  const nodeSpacing = trackWidth / (items.length + 1);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% 50%, #0a0a2e 0%, #050510 60%, #000005 100%)`,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 100,
          right: 100,
          ...titleAnim,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 15,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: theme.colors.muted,
            marginBottom: 12,
          }}
        >
          Dòng thời gian
        </div>
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

      {/* Timeline */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Track line */}
        <line
          x1={trackX}
          y1={trackY}
          x2={trackX + trackWidth}
          y2={trackY}
          stroke={theme.colors.line}
          strokeWidth="2"
          opacity="0.4"
        />

        {/* Animated progress line */}
        <line
          x1={trackX}
          y1={trackY}
          x2={trackX + trackWidth * reveal(frame, 10, 60)}
          y2={trackY}
          stroke={theme.colors.accent1}
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Nodes */}
        {items.map((item, i) => {
          const nodeX = trackX + nodeSpacing * (i + 1);
          const nodeDelay = 15 + i * 12;
          const nodeProgress = reveal(frame, nodeDelay, 15);
          const isActive = frame >= nodeDelay;

          return (
            <g key={i} opacity={nodeProgress}>
              {/* Node circle */}
              <circle
                cx={nodeX}
                cy={trackY}
                r={isActive ? 12 : 8}
                fill={isActive ? theme.colors.accent1 : theme.colors.card}
                stroke={theme.colors.accent1}
                strokeWidth="2"
              />

              {/* Node label */}
              <text
                x={nodeX}
                y={trackY - 40}
                textAnchor="middle"
                fill={theme.colors.ink}
                fontSize="16"
                fontWeight="700"
                fontFamily={theme.fonts.display}
              >
                {item.label}
              </text>

              {/* Node value */}
              <text
                x={nodeX}
                y={trackY + 50}
                textAnchor="middle"
                fill={theme.colors.accent1}
                fontSize="20"
                fontWeight="700"
                fontFamily={theme.fonts.mono ?? theme.fonts.display}
              >
                {item.value}
              </text>

              {/* Year (if present) */}
              {item.year && (
                <text
                  x={nodeX}
                  y={trackY + 80}
                  textAnchor="middle"
                  fill={theme.colors.muted}
                  fontSize="14"
                  fontFamily={theme.fonts.mono ?? theme.fonts.display}
                >
                  {item.year}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
