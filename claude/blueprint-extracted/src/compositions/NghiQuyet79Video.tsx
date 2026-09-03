// ---------------------------------------------------------------------------
// Nghị Quyết 79 Composition — Thin Remotion entry point
//
// Registers the Nghị Quyết 79 video using the NQ57 template with
// NQ79 data, theme, and Vietnamese TTS narration.
// ---------------------------------------------------------------------------

import React from "react";
import { Composition } from "remotion";
import { NQ57Template } from "../templates/nq57";
import { NGHI_QUYET_79_SCENES, NGHI_QUYET_79_CONTENT, sceneFrames } from "../data/nghiQuyet79";
import { nghiQuyet79 } from "../theme/nghiQuyet79";

const FPS = 30;

const NGHI_QUYET_79_FRAMES =
  NGHI_QUYET_79_SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) +
  (NGHI_QUYET_79_SCENES.length - 1) * 16;

export const NghiQuyet79Video: React.FC = () => {
  return (
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
  );
};