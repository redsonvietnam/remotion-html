// ---------------------------------------------------------------------------
// HistoryScene — Historical fact, handwritten annotation, large number
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBg } from "../components/PaperBg";
import { ChapterBar } from "../components/ChapterBar";
import { textIn, highlightSwipe, handwrittenReveal } from "../helpers";
import type { ScrapbookHistoryContent } from "../types";

export type HistorySceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & ScrapbookHistoryContent;

export const HistorySceneData: React.FC<HistorySceneProps> = ({
  frame,
  fps,
  year,
  fact,
  detail,
  annotation,
}) => {
  const yearAnim = textIn(frame, 0, fps, 40);
  const factAnim = textIn(frame, 15, fps, 30);
  const detailAnim = textIn(frame, 30, fps, 20);
  const highlightWidth = highlightSwipe(frame, 10, 35);
  const handReveal = handwrittenReveal(frame, 25, 40);

  return (
    <AbsoluteFill>
      <PaperBg />
      <ChapterBar sceneIndex={2} totalScenes={6} />

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
            ...yearAnim,
            fontFamily: "Courier New, monospace",
            fontSize: 120,
            fontWeight: 900,
            color: "#1a1a1a",
            opacity: 0.15,
            position: "absolute",
            top: 80,
            right: 100,
          }}
        >
          {year}
        </div>

        <div
          style={{
            ...factAnim,
            fontFamily: "Georgia, serif",
            fontWeight: 900,
            fontSize: 64,
            color: "#1a1a1a",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.2,
            position: "relative",
          }}
        >
          {fact}
          <div
            style={{
              position: "absolute",
              bottom: -4,
              left: 0,
              width: `${highlightWidth}%`,
              height: 10,
              background: "#f7dc6f",
              opacity: 0.7,
            }}
          />
        </div>

        <div
          style={{
            ...detailAnim,
            fontFamily: "Georgia, serif",
            fontSize: 24,
            color: "#666666",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.5,
            marginTop: 32,
          }}
        >
          {detail}
        </div>

        <div
          style={{
            ...handReveal,
            fontFamily: "Segoe Script, cursive",
            fontSize: 18,
            color: "#c0392b",
            marginTop: 32,
            transform: "rotate(-2deg)",
          }}
        >
          {annotation}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
