// ---------------------------------------------------------------------------
// TimelineScene — Chronological markers, chapter structure
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperBg } from "../components/PaperBg";
import { ChapterBar } from "../components/ChapterBar";
import { textIn, highlightSwipe, handwrittenReveal } from "../helpers";
import type { ScrapbookTimelineContent } from "../types";

export type TimelineSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & ScrapbookTimelineContent;

export const TimelineSceneData: React.FC<TimelineSceneProps> = ({
  frame,
  fps,
  title,
  items,
}) => {
  const titleAnim = textIn(frame, 0, fps, 30);

  return (
    <AbsoluteFill>
      <PaperBg />
      <ChapterBar sceneIndex={4} totalScenes={8} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 80,
          paddingTop: 120,
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
          {title}
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 800,
          }}
        >
          {/* Timeline line */}
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 0,
              bottom: 0,
              width: 3,
              background: "linear-gradient(180deg, #c0392b, #d4a017)",
            }}
          />

          {items.map((item, i) => {
            const itemAnim = textIn(frame, 15 + i * 10, fps, 20);
            const highlightWidth = highlightSwipe(frame, 20 + i * 10, 20);
            const handReveal = handwrittenReveal(frame, 25 + i * 10, 25);

            return (
              <div
                key={i}
                style={{
                  ...itemAnim,
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: 32,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#c0392b",
                    border: "3px solid #f5f0e8",
                    flexShrink: 0,
                    marginTop: 4,
                    marginLeft: 30,
                    zIndex: 1,
                  }}
                />
                <div style={{ marginLeft: 24, flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Courier New, monospace",
                      fontSize: 14,
                      color: "#c0392b",
                      marginBottom: 4,
                    }}
                  >
                    {item.year || item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "Georgia, serif",
                      fontWeight: 700,
                      fontSize: 24,
                      color: "#1a1a1a",
                      position: "relative",
                    }}
                  >
                    {item.value}
                    <div
                      style={{
                        position: "absolute",
                        bottom: -2,
                        left: 0,
                        width: `${highlightWidth}%`,
                        height: 6,
                        background: "#f7dc6f",
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
