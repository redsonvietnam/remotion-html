// ---------------------------------------------------------------------------
// HeroScene — Season intro, large editorial title
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBg } from "../components/PaperBg";
import { ChapterBar } from "../components/ChapterBar";
import { textIn, highlightSwipe, handwrittenReveal } from "../helpers";
import type { ScrapbookHeroContent } from "../types";

export type HeroSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & ScrapbookHeroContent;

export const HeroSceneData: React.FC<HeroSceneProps> = ({
  frame,
  fps,
  title,
  subtitle,
  tagline,
}) => {
  const titleAnim = textIn(frame, 0, fps, 40);
  const subtitleAnim = textIn(frame, 15, fps, 30);
  const tagAnim = textIn(frame, 30, fps, 20);
  const highlightWidth = highlightSwipe(frame, 10, 30);
  const handReveal = handwrittenReveal(frame, 20, 40);

  return (
    <AbsoluteFill>
      <PaperBg />
      <ChapterBar sceneIndex={0} totalScenes={6} />

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
            ...tagAnim,
            fontFamily: "Courier New, monospace",
            fontSize: 14,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c0392b",
            marginBottom: 24,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            ...titleAnim,
            fontFamily: "Georgia, serif",
            fontWeight: 900,
            fontSize: 96,
            lineHeight: 1.0,
            textAlign: "center",
            letterSpacing: -2,
            color: "#1a1a1a",
            position: "relative",
          }}
        >
          {title}
          <div
            style={{
              position: "absolute",
              bottom: -8,
              left: 0,
              width: `${highlightWidth}%`,
              height: 12,
              background: "#f7dc6f",
              opacity: 0.7,
            }}
          />
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
            fontSize: 24,
            color: "#666666",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            ...handReveal,
            fontFamily: "Segoe Script, cursive",
            fontSize: 18,
            color: "#c0392b",
            marginTop: 24,
            transform: "rotate(-2deg)",
          }}
        >
          {tagline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
