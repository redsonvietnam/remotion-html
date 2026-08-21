// ---------------------------------------------------------------------------
// Scene Registry — Maps scene IDs to components
// ---------------------------------------------------------------------------

import React from "react";
import { HookScene } from "./HookScene";
import { StatementScene } from "./StatementScene";
import { SplitScene } from "./SplitScene";
import { ConceptScene } from "./ConceptScene";
import { ImpermanenceScene } from "./ImpermanenceScene";
import { EndingScene } from "./EndingScene";
import type { StoicLoveSceneContent } from "../../../data/stoicLove";

type RenderSceneProps = {
  audio: string;
  caption: string;
  dur: number;
} & StoicLoveSceneContent;

export function renderScene(
  sceneId: string,
  content: StoicLoveSceneContent | undefined,
  props: { audio: string; caption: string; dur: number }
): React.ReactNode {
  if (!content) return null;

  switch (content.kind) {
    case "hook":
      return <HookScene {...props} {...content} />;
    case "statement":
      return <StatementScene {...props} {...content} />;
    case "split":
      return <SplitScene {...props} {...content} />;
    case "concept":
      return <ConceptScene {...props} {...content} />;
    case "impermanence":
      return <ImpermanenceScene {...props} {...content} />;
    case "ending":
      return <EndingScene {...props} {...content} />;
    default:
      return null;
  }
}