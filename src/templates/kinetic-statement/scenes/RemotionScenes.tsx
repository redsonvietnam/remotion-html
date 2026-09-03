// ---------------------------------------------------------------------------
// Kinetic Statement Remotion Wrappers — Bridge Remotion hooks to data components
//
// Each wrapper calls useCurrentFrame()/useVideoConfig() and passes the
// values as props to the corresponding data component. This is the ONLY
// file that should import useCurrentFrame/useVideoConfig for Kinetic scenes.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HookSceneData } from "./HookScene";
import { StatSceneData } from "./StatScene";
import { QuoteSceneData } from "./QuoteScene";
import { OutroSceneData } from "./OutroScene";
import type { KineticSceneContent } from "../types";

type BaseProps = { audio: string; caption: string; dur: number };

/** Wrap a data component with Remotion frame/fps/viewport injection. */
function withRemotion<P extends { frame: number; fps: number; width?: number; height?: number }>(
  DataComponent: React.FC<P>,
): React.FC<Omit<P, "frame" | "fps" | "width" | "height">> {
  return (props) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    return <DataComponent {...(props as P)} frame={frame} fps={fps} width={width} height={height} />;
  };
}

export const HookScene = withRemotion(HookSceneData);
export const StatScene = withRemotion(StatSceneData);
export const QuoteScene = withRemotion(QuoteSceneData);
export const OutroScene = withRemotion(OutroSceneData);

/** Render a Kinetic scene by kind — Remotion version. */
export function renderRemotionScene(
  sceneId: string,
  content: KineticSceneContent | undefined,
  props: BaseProps,
): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "hook":
      return <HookScene {...props} {...content} />;
    case "stat":
      return <StatScene {...props} {...content} />;
    case "quote":
      return <QuoteScene {...props} {...content} />;
    case "outro":
      return <OutroScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
