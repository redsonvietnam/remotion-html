// ---------------------------------------------------------------------------
// ClosingScene — Trophy, final statement, chapter bar complete
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBg } from "../components/PaperBg";
import { ChapterBar } from "../components/ChapterBar";
import { Trophy } from "../components/Trophy";
import { textIn, trophyBounce, handwrittenReveal } from "../helpers";
import type { ScrapbookClosingContent } from "../types";

/** Design viewport width — typography scales relative to this. */
const DESIGN_WIDTH = 1920;

export type ClosingSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
  width?: number;
  height?: number;
} & ScrapbookClosingContent;

export const ClosingSceneData: React.FC<ClosingSceneProps> = ({
  frame,
  fps,
  width = DESIGN_WIDTH,
  title,
  subtitle,
  stats,
  reference,
}) => {
  const scale = Math.min(1, width / DESIGN_WIDTH);

  const titleAnim = textIn(frame, 0, fps, 30);
  const subtitleAnim = textIn(frame, 15, fps, 20);
  const trophyAnim = trophyBounce(frame, 10, fps);
  const handReveal = handwrittenReveal(frame, 30, 35);

  const titleFontSize = Math.round(64 * scale);
  const titleMaxWidth = Math.round(800 * scale);
  const subtitleFontSize = Math.round(24 * scale);
  const subtitleMaxWidth = Math.round(600 * scale);
  const statFontSize = Math.round(36 * scale);
  const statLabelFontSize = Math.round(12 * scale);
  const referenceFontSize = Math.round(16 * scale);

  return (
    <AbsoluteFill>
      <PaperBg />
      <ChapterBar sceneIndex={5} totalScenes={8} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div style={{ ...trophyAnim, marginBottom: 32 }}>
          <Trophy />
        </div>

        <div
          style={{
            ...titleAnim,
            fontFamily: "Georgia, serif",
            fontWeight: 900,
            fontSize: titleFontSize,
            color: "#1a1a1a",
            textAlign: "center",
            maxWidth: titleMaxWidth,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        <div
          style={{
            width: 120,
            height: 2,
            background: "linear-gradient(90deg, transparent, #1a1a1a, transparent)",
            margin: "32px 0",
            opacity: 0.3,
          }}
        />

        <div
          style={{
            ...subtitleAnim,
            fontFamily: "Georgia, serif",
            fontSize: subtitleFontSize,
            color: "#666666",
            textAlign: "center",
            maxWidth: subtitleMaxWidth,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>

        {stats.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 48,
              marginTop: 40,
            }}
          >
            {stats.map((stat, i) => {
              const statAnim = textIn(frame, 25 + i * 8, fps, 15);
              return (
                <div key={i} style={{ ...statAnim, textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontWeight: 900,
                      fontSize: statFontSize,
                      color: "#c0392b",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "Courier New, monospace",
                      fontSize: statLabelFontSize,
                      color: "#666666",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      marginTop: 4,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div
          style={{
            ...handReveal,
            fontFamily: "Segoe Script, cursive",
            fontSize: referenceFontSize,
            color: "#c0392b",
            marginTop: 32,
            transform: "rotate(-1deg)",
          }}
        >
          {reference}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
