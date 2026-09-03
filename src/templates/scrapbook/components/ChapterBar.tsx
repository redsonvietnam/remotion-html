// ---------------------------------------------------------------------------
// ChapterBar — Editorial chapter progress indicator
// ---------------------------------------------------------------------------

import React from "react";

type ChapterBarProps = {
  sceneIndex: number;
  totalScenes: number;
};

export const ChapterBar: React.FC<ChapterBarProps> = ({
  sceneIndex,
  totalScenes,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: "rgba(0,0,0,0.05)",
        display: "flex",
      }}
    >
      {Array.from({ length: totalScenes }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: "100%",
            background: i <= sceneIndex ? "#c0392b" : "transparent",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
};
