// ---------------------------------------------------------------------------
// NodeFlow Scene Registry — Maps scene kind to component
// ---------------------------------------------------------------------------

import React from "react";
import { TitleScene } from "./TitleScene";
import { FlowScene } from "./FlowScene";
import { ContributionScene } from "./ContributionScene";
import { BenefitScene } from "./BenefitScene";
import { CompareScene } from "./CompareScene";
import { EndScene } from "./EndScene";
import type { NodeFlowSceneContent } from "../../../data/baoHiem2024";

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
