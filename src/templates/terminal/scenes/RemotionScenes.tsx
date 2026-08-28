// ---------------------------------------------------------------------------
// Terminal Remotion Wrappers — Bridge Remotion hooks to data components
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { IntroScene } from "./IntroScene";
import { TypingScene } from "./TypingScene";
import { RevealScene } from "./RevealScene";
import { OutroScene } from "./OutroScene";
import type { TerminalSceneContent } from "../../../data/terminal";

type BaseProps = { audio: string; caption: string; dur: number; sceneIndex: number; totalScenes: number };

export function IntroSceneWrapped(props: BaseProps & Omit<React.ComponentProps<typeof IntroScene>, "frame" | "fps" | "width" | "height">) {
  return <IntroScene {...props} />;
}

export function TypingSceneWrapped(props: BaseProps & Omit<React.ComponentProps<typeof TypingScene>, "frame" | "fps" | "width" | "height">) {
  return <TypingScene {...props} />;
}

export function RevealSceneWrapped(props: BaseProps & Omit<React.ComponentProps<typeof RevealScene>, "frame" | "fps" | "width" | "height">) {
  return <RevealScene {...props} />;
}

export function OutroSceneWrapped(props: BaseProps & Omit<React.ComponentProps<typeof OutroScene>, "frame" | "fps" | "width" | "height">) {
  return <OutroScene {...props} />;
}

export function renderTerminalScene(
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
