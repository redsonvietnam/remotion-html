import { Composition } from "remotion";
import { HabitLoopVideo } from "./HabitLoopVideo";
import { NghiQuyet57Video } from "./NghiQuyet57Video";
import { NghiQuyet57VideoV2 } from "./NghiQuyet57VideoV2";
import { SCENES, sceneFrames } from "./nq57-data";

const FPS = 30;

const NQ57_FRAMES =
  SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) + (SCENES.length - 1) * 12;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HabitLoop"
        component={HabitLoopVideo}
        durationInFrames={FPS * 12} // 12s tong (khop 2 scene + transition)
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="NghiQuyet57"
        component={NghiQuyet57Video}
        durationInFrames={NQ57_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="NghiQuyet57V2"
        component={NghiQuyet57VideoV2}
        durationInFrames={NQ57_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
