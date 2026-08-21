// ---------------------------------------------------------------------------
// Root — Remotion entry point
//
// Registers all compositions. This is the thinnest layer.
// ---------------------------------------------------------------------------

import React from "react";
import { Composition } from "remotion";
import { NQ57Template } from "./templates/nq57";
import { SCENES, sceneFrames } from "./data/nq57";
import { DE_AN06_SCENES, DE_AN06_CONTENT, sceneFrames as deAn06SceneFrames } from "./data/deAn06";
import { deAn06 } from "./theme/deAn06";
import { NGHI_QUYET_79_SCENES, NGHI_QUYET_79_CONTENT, sceneFrames as nq79SceneFrames } from "./data/nghiQuyet79";
import { nghiQuyet79 } from "./theme/nghiQuyet79";

const FPS = 30;

const NQ57_FRAMES =
  SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) + (SCENES.length - 1) * 16;

const DE_AN06_FRAMES =
  DE_AN06_SCENES.reduce((acc, s) => acc + deAn06SceneFrames(s.dur), 0) +
  (DE_AN06_SCENES.length - 1) * 16;

const NGHI_QUYET_79_FRAMES =
  NGHI_QUYET_79_SCENES.reduce((acc, s) => acc + nq79SceneFrames(s.dur), 0) +
  (NGHI_QUYET_79_SCENES.length - 1) * 16;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="NghiQuyet57V2"
        component={NQ57Template}
        durationInFrames={NQ57_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
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
          theme: deAn06,
        }}
      />
      <Composition
        id="NghiQuyet79"
        component={NQ57Template}
        durationInFrames={NGHI_QUYET_79_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: NGHI_QUYET_79_SCENES,
          content: NGHI_QUYET_79_CONTENT,
          theme: nghiQuyet79,
        }}
      />
    </>
  );
};
