// ---------------------------------------------------------------------------
// Kinetic Statement — Content Types
//
// 9:16 vertical video: hook (staggered words), stat (counter + label),
// quote (karaoke highlight), outro (brand + CTA).
// ---------------------------------------------------------------------------

export interface KineticHookContent {
  kind: "hook";
  words: string[];
}

export interface KineticStatContent {
  kind: "stat";
  value: number;
  suffix: string;
  label: string;
}

export interface KineticQuoteContent {
  kind: "quote";
  text: string;
}

export interface KineticOutroContent {
  kind: "outro";
  brand: string;
  tagline: string;
  cta: string;
}

export type KineticSceneContent =
  | KineticHookContent
  | KineticStatContent
  | KineticQuoteContent
  | KineticOutroContent;

// ---------------------------------------------------------------------------
// Scene definitions & demo content
// ---------------------------------------------------------------------------

import type { SceneDef } from "./contract";
import { sceneFrames } from "./contract";

export { sceneFrames as kineticSceneFrames };

export const KINETIC_SCENES: SceneDef[] = [
  { id: "s1", audio: "", caption: "3 seconds to decide", dur: 3.0 },
  { id: "s2", audio: "", caption: "73% of viewers scroll past", dur: 3.5 },
  { id: "s3", audio: "", caption: "A good video only needs the right rhythm", dur: 4.0 },
  { id: "s4", audio: "", caption: "REMOTION-HTML — Video Template Engine", dur: 2.5 },
];

export const KINETIC_CONTENT: Record<string, KineticSceneContent> = {
  s1: {
    kind: "hook",
    words: ["3", "GIÂY", "ĐẦU", "QUYẾT ĐỊNH", "TẤT CẢ"],
  },
  s2: {
    kind: "stat",
    value: 73,
    suffix: "%",
    label: "người xem sẽ lướt qua video của bạn nếu 3 giây đầu không đủ cuốn",
  },
  s3: {
    kind: "quote",
    text: "Một video tốt không cần dài, chỉ cần đúng nhịp và đúng lúc.",
  },
  s4: {
    kind: "outro",
    brand: "REMOTION-HTML",
    tagline: "VIDEO TEMPLATE ENGINE",
    cta: "Xem thêm mẫu →",
  },
};
