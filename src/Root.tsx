import { Composition } from "remotion";
import { NghiQuyet57VideoV2 } from "./compositions/NghiQuyet57VideoV2";
import { SCENES, sceneFrames } from "./data/nq57";

const FPS = 30;

const NQ57_FRAMES =
  SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) + (SCENES.length - 1) * 16;

export const Root: React.FC = () => {
  return (
    <Composition
      id="NghiQuyet57V2"
      component={NghiQuyet57VideoV2}
      durationInFrames={NQ57_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
