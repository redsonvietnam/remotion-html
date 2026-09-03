// ---------------------------------------------------------------------------
// NodeFlow Scene Registry — Maps scene kind to Remotion wrapper component
// ---------------------------------------------------------------------------

import React from "react";
import { TitleScene, FlowScene, ContributionScene, BenefitScene, CompareScene, EndScene } from "./RemotionScenes";
import type { NodeFlowSceneContent } from "../types";

type BaseProps = { audio: string; caption: string; dur: number };

export function renderScene(
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

// Re-export data components for Preview Studio
export { TitleSceneData } from "./TitleScene";
export { FlowSceneData } from "./FlowScene";
export { ContributionSceneData } from "./ContributionScene";
export { BenefitSceneData } from "./BenefitScene";
export { CompareSceneData } from "./CompareScene";
export { EndSceneData } from "./EndScene";
