// ---------------------------------------------------------------------------
// DiagramScene — System diagram with orbiting elements
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn, reveal, orbitalRotation } from "../helpers";
import type { CosmosDiagramContent } from "../types";

export type DiagramSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CosmosDiagramContent;

export const DiagramSceneData: React.FC<DiagramSceneProps> = ({
  frame,
  fps,
  title,
  nodes,
  edges,
}) => {
  const theme = useTheme();

  const titleAnim = textIn(frame, 0, fps, 30);

  // Center of the diagram
  const cx = 960;
  const cy = 540;

  // Node positions (circular layout)
  const nodePositions = nodes.map((node, i) => {
    const orbit = node.orbit || 200;
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * orbit,
      y: cy + Math.sin(angle) * orbit,
      orbit,
    };
  });

  // Edge draw progress
  const edgeProgress = edges.map((_, i) => reveal(frame, 20 + i * 10, 20));

  // Node reveal progress
  const nodeProgress = nodes.map((_, i) => reveal(frame, 10 + i * 8, 15));

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
          Sơ đồ hệ thống
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

      {/* Diagram */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodePositions[edge.from];
          const to = nodePositions[edge.to];
          if (!from || !to) return null;

          const progress = edgeProgress[i];
          const midX = from.x + (to.x - from.x) * progress;
          const midY = from.y + (to.y - from.y) * progress;

          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={midX}
                y2={midY}
                stroke={theme.colors.accent1}
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              {progress > 0.5 && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 10}
                  textAnchor="middle"
                  fill={theme.colors.muted}
                  fontSize="12"
                  fontFamily={theme.fonts.mono ?? theme.fonts.display}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = nodePositions[i];
          const progress = nodeProgress[i];
          const isActive = frame >= 10 + i * 8;

          return (
            <g key={i} opacity={progress}>
              {/* Orbit ring */}
              <circle
                cx={cx}
                cy={cy}
                r={pos.orbit}
                fill="none"
                stroke={theme.colors.line}
                strokeWidth="0.5"
                strokeDasharray="4 8"
                opacity="0.2"
              />

              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 40 : 30}
                fill={isActive ? `${theme.colors.accent1}20` : theme.colors.card}
                stroke={theme.colors.accent1}
                strokeWidth="1.5"
                strokeOpacity={isActive ? 0.8 : 0.3}
              />

              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y - 6}
                textAnchor="middle"
                fill={isActive ? theme.colors.ink : theme.colors.muted}
                fontSize="14"
                fontWeight="700"
                fontFamily={theme.fonts.display}
              >
                {node.label}
              </text>

              {/* Node sublabel */}
              {node.sublabel && (
                <text
                  x={pos.x}
                  y={pos.y + 12}
                  textAnchor="middle"
                  fill={theme.colors.accent1}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily={theme.fonts.mono ?? theme.fonts.display}
                >
                  {node.sublabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Center node */}
        <circle
          cx={cx}
          cy={cy}
          r="8"
          fill={theme.colors.accent1}
          opacity="0.8"
        />
      </svg>
    </AbsoluteFill>
  );
};
