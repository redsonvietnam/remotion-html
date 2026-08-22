// ---------------------------------------------------------------------------
// CanCuoc Composition — Thin Remotion entry point
//
// Registers the Luật Căn cước 2023 video using the NQ57 template with
// CanCuoc data, theme, and Vietnamese TTS narration. Reuses the existing
// NQ57 visual grammar; no new template.
// ---------------------------------------------------------------------------

import React from "react";
import { Composition } from "remotion";
import { NQ57Template } from "../templates/nq57";
import { CAN_CUOC_SCENES, CAN_CUOC_CONTENT, sceneFrames } from "../data/canCuoc";
import { canCuoc } from "../theme/canCuoc";

const FPS = 30;

const CAN_CUOC_FRAMES =
  CAN_CUOC_SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) +
  (CAN_CUOC_SCENES.length - 1) * 16;

export const CanCuocVideo: React.FC = () => {
  return (
    <Composition
      id="CanCuoc"
      component={NQ57Template}
      durationInFrames={CAN_CUOC_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        scenes: CAN_CUOC_SCENES,
        content: CAN_CUOC_CONTENT,
        theme: canCuoc,
      }}
    />
  );
};
