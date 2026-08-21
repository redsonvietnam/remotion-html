// ---------------------------------------------------------------------------
// NQ57 Composition — Thin Remotion entry point
//
// Registers the NQ57 template as a Remotion Composition.
// This is a thin wrapper — the real logic is in src/templates/nq57/.
// ---------------------------------------------------------------------------

import React from "react";
import { Composition } from "remotion";
import { NQ57Template } from "../templates/nq57";
import { SCENES, sceneFrames } from "../data/nq57";

const FPS = 30;

const NQ57_FRAMES =
  SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) + (SCENES.length - 1) * 16;

export const NghiQuyet57Video: React.FC = () => {
  return (
    <Composition
      id="NghiQuyet57V2"
      component={NQ57Template}
      durationInFrames={NQ57_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
