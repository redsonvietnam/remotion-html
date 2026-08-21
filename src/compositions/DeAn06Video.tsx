// ---------------------------------------------------------------------------
// De An 06 Composition — Thin Remotion entry point
//
// Registers the De An 06 video using the NQ57 template with De An 06 data.
// ---------------------------------------------------------------------------

import React from "react";
import { Composition } from "remotion";
import { NQ57Template } from "../templates/nq57";
import { DE_AN06_SCENES, DE_AN06_CONTENT, sceneFrames } from "../data/deAn06";

const FPS = 30;

const DE_AN06_FRAMES =
  DE_AN06_SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) +
  (DE_AN06_SCENES.length - 1) * 16;

export const DeAn06Video: React.FC = () => {
  return (
    <Composition
      id="DeAn06"
      component={NQ57Template}
      durationInFrames={DE_AN06_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        scenes: DE_AN06_SCENES,
        content: DE_AN06_CONTENT,
      }}
    />
  );
};
