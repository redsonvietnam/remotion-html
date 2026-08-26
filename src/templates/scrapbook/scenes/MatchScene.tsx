// ---------------------------------------------------------------------------
// MatchScene — Teams, score, yellow highlight, editorial chip
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBg } from "../components/PaperBg";
import { ChapterBar } from "../components/ChapterBar";
import { textIn, highlightSwipe, handwrittenReveal } from "../helpers";
import type { ScrapbookMatchContent } from "../types";

export type MatchSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & ScrapbookMatchContent;

export const MatchSceneData: React.FC<MatchSceneProps> = ({
  frame,
  fps,
  homeTeam,
  awayTeam,
  score,
  competition,
  highlight,
}) => {
  const titleAnim = textIn(frame, 0, fps, 30);
  const scoreAnim = textIn(frame, 15, fps, 20);
  const highlightWidth = highlightSwipe(frame, 20, 25);
  const handReveal = handwrittenReveal(frame, 25, 35);

  return (
    <AbsoluteFill>
      <PaperBg />
      <ChapterBar sceneIndex={1} totalScenes={6} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            ...titleAnim,
            fontFamily: "Courier New, monospace",
            fontSize: 14,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c0392b",
            marginBottom: 32,
          }}
        >
          {competition}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
            ...scoreAnim,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: 900,
                fontSize: 48,
                color: "#1a1a1a",
              }}
            >
              {homeTeam}
            </div>
          </div>

          <div
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: 900,
              fontSize: 72,
              color: "#c0392b",
              position: "relative",
            }}
          >
            {score}
            <div
              style={{
                position: "absolute",
                bottom: -4,
                left: 0,
                width: `${highlightWidth}%`,
                height: 8,
                background: "#f7dc6f",
                opacity: 0.7,
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: 900,
                fontSize: 48,
                color: "#1a1a1a",
              }}
            >
              {awayTeam}
            </div>
          </div>
        </div>

        <div
          style={{
            ...handReveal,
            fontFamily: "Segoe Script, cursive",
            fontSize: 20,
            color: "#c0392b",
            marginTop: 48,
            transform: "rotate(-1deg)",
          }}
        >
          {highlight}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
