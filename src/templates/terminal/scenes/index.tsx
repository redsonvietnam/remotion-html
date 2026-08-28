// ---------------------------------------------------------------------------
// Terminal Scene Registry — maps scene kinds to components
// ---------------------------------------------------------------------------

import React from "react";
import { IntroSceneWrapped } from "./RemotionScenes";
import { TypingSceneWrapped } from "./RemotionScenes";
import { RevealSceneWrapped } from "./RemotionScenes";
import { OutroSceneWrapped } from "./RemotionScenes";
import type { TerminalSceneContent } from "../../../data/terminal";

type BaseProps = { audio: string; caption: string; dur: number; sceneIndex: number; totalScenes: number };

export function renderScene(
  sceneId: string,
  content: TerminalSceneContent | undefined,
  props: BaseProps
): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "intro":
      return <IntroSceneWrapped {...props} {...content} />;
    case "typing":
      return <TypingSceneWrapped {...props} {...content} />;
    case "reveal":
      return <RevealSceneWrapped {...props} {...content} />;
    case "outro":
      return <OutroSceneWrapped {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
