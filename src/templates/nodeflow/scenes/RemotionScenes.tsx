// ---------------------------------------------------------------------------
// NodeFlow Remotion Wrappers — Bridge Remotion hooks to data components
//
// Each wrapper calls useCurrentFrame()/useVideoConfig() and passes the
// values as props to the corresponding data component. This is the ONLY
// file that should import useCurrentFrame/useVideoConfig for NodeFlow scenes.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TitleSceneData } from "./TitleScene";
import { FlowSceneData } from "./FlowScene";
import { ContributionSceneData } from "./ContributionScene";
import { BenefitSceneData } from "./BenefitScene";
import { CompareSceneData } from "./CompareScene";
import { EndSceneData } from "./EndScene";
import type { NodeFlowSceneContent } from "../types";

type BaseProps = { audio: string; caption: string; dur: number };

/** Wrap a data component with Remotion frame/fps injection. */
function withRemotion<P extends { frame: number; fps: number }>(
  DataComponent: React.FC<P>
): React.FC<Omit<P, "frame" | "fps">> {
  return (props) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return <DataComponent {...(props as P)} frame={frame} fps={fps} />;
  };
}

export const TitleScene = withRemotion(TitleSceneData);
export const FlowScene = withRemotion(FlowSceneData);
export const ContributionScene = withRemotion(ContributionSceneData);
export const BenefitScene = withRemotion(BenefitSceneData);
export const CompareScene = withRemotion(CompareSceneData);
export const EndScene = withRemotion(EndSceneData);

/** Render a NodeFlow scene by kind — Remotion version. */
export function renderRemotionScene(
  sceneId: string,
  content: NodeFlowSceneContent | undefined,
  props: BaseProps
): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "title":
      return <TitleScene {...props} {...content} />;
    case "flow":
      return <FlowScene {...props} {...content} />;
    case "contribution":
      return <ContributionScene {...props} {...content} />;
    case "benefit":
      return <BenefitScene {...props} {...content} />;
    case "compare":
      return <CompareScene {...props} {...content} />;
    case "end":
      return <EndScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
