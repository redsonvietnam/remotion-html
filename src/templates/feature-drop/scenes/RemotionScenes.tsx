// ---------------------------------------------------------------------------
// Feature Drop Remotion Wrappers — Bridge Remotion hooks to data components
//
// Each wrapper calls useCurrentFrame()/useVideoConfig() and passes the
// values as props to the corresponding data component. This is the ONLY
// file that should import useCurrentFrame/useVideoConfig for Feature Drop scenes.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HookSceneData } from "./HookScene";
import { FeaturesSceneData } from "./FeaturesScene";
import { OutroSceneData } from "./OutroScene";

/** Wrap a data component with Remotion frame/fps injection. */
function withRemotion<P extends { frame: number; fps: number }>(
  DataComponent: React.FC<P>,
): React.FC<Omit<P, "frame" | "fps">> {
  return (props) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return <DataComponent {...(props as P)} frame={frame} fps={fps} />;
  };
}

export const HookScene = withRemotion(HookSceneData);
export const FeaturesScene = withRemotion(FeaturesSceneData);
export const OutroScene = withRemotion(OutroSceneData);
