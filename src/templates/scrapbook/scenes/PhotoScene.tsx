// ---------------------------------------------------------------------------
// PhotoScene — Polaroid cards, tape, caption, staggered entrance
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBg } from "../components/PaperBg";
import { ChapterBar } from "../components/ChapterBar";
import { Polaroid } from "../components/Polaroid";
import { textIn, polaroidIn } from "../helpers";
import type { ScrapbookPhotoContent } from "../types";

export type PhotoSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & ScrapbookPhotoContent;

export const PhotoSceneData: React.FC<PhotoSceneProps> = ({
  frame,
  fps,
  caption,
  annotation,
  Polaroid: photos,
}) => {
  const titleAnim = textIn(frame, 0, fps, 30);

  return (
    <AbsoluteFill>
      <PaperBg />
      <ChapterBar sceneIndex={3} totalScenes={8} />

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
            fontFamily: "Georgia, serif",
            fontWeight: 900,
            fontSize: 48,
            color: "#1a1a1a",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          {caption}
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {photos.map((photo, i) => (
            <Polaroid
              key={i}
              label={photo.label}
              sublabel={photo.sublabel}
              frame={frame}
              fps={fps}
              delay={10 + i * 12}
              rotation={i % 2 === 0 ? -3 : 3}
            />
          ))}
        </div>

        <div
          style={{
            fontFamily: "Segoe Script, cursive",
            fontSize: 18,
            color: "#c0392b",
            marginTop: 32,
            transform: "rotate(-1deg)",
            opacity: polaroidIn(frame, 40, fps).opacity,
          }}
        >
          {annotation}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
