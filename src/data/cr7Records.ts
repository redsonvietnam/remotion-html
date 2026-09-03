// ---------------------------------------------------------------------------
// CR7 Records Content Data
//
// Cristiano Ronaldo — Career Records
// YouTube 1920x1080, ~61s, 7 scenes
// CR7 template — typography/statistics visual grammar
//
// All facts verified from public records:
//   - 900+ official career goals (first player in history)
//   - 140 Champions League goals (all-time top scorer)
//   - 136 international goals (all-time men's top scorer)
//   - 5 Ballon d'Or awards
//   - 5 Champions League titles
//   - 1 European Championship (Euro 2016)
//   - 7 league titles across 4 countries
//   - 20+ year professional career (2002–present)
// ---------------------------------------------------------------------------

import { FPS, TAIL, sceneFrames } from "./contract";
import type { SceneDef } from "./contract";
import type { CR7SceneContent } from "./contract";

export { FPS, TAIL, sceneFrames };
export type { SceneDef };
export type { CR7SceneContent };

// ---------------------------------------------------------------------------
// CR7 Scene Content — keyed by scene ID
// ---------------------------------------------------------------------------

export const CR7_CONTENT: Record<string, CR7SceneContent> = {
  s1: {
    kind: "hero",
    name: "CRISTIANO RONALDO",
    tagline: "THE RECORDS",
    subtitle: "A career defined by numbers that speak for themselves",
  },

  s2: {
    kind: "stat",
    label: "CAREER GOALS",
    bigNumber: "900+",
    sub: "Official goals across all competitions",
    detail: "The first player in football history to score 900+ official career goals.",
    color: "accent1",
  },

  s3: {
    kind: "stat",
    label: "CHAMPIONS LEAGUE",
    bigNumber: "140",
    sub: "All-time top scorer",
    detail: "More goals than any other player in the history of the competition.",
    color: "accent2",
  },

  s4: {
    kind: "stat",
    label: "INTERNATIONAL GOALS",
    bigNumber: "136",
    sub: "All-time men's international top scorer",
    detail: "More goals for Portugal than any other male player in history.",
    color: "accent3",
  },

  s5: {
    kind: "milestone",
    title: "MAJOR HONOURS",
    items: [
      { label: "Ballon d'Or", value: "5" },
      { label: "Champions League", value: "5" },
      { label: "European Championship", value: "1" },
      { label: "League Titles", value: "7" },
    ],
  },

  s6: {
    kind: "stat",
    label: "CAREER SPAN",
    bigNumber: "20+",
    sub: "Years at the highest level",
    detail: "From Sporting CP (2002) to Al Nassr — two decades of elite performance.",
    color: "accent1",
  },

  s7: {
    kind: "closing",
    title: "LEGACY",
    subtitle: "Records are made to be broken.\nSome records may never be broken.",
    reference: "Cristiano Ronaldo — The career in numbers",
  },
};

// ---------------------------------------------------------------------------
// CR7 Scene Definitions
// ---------------------------------------------------------------------------

export const CR7_SCENES: SceneDef[] = [
  { id: "s1", audio: "cr7/s1.mp3", caption: "Cristiano Ronaldo — The Records", dur: 7.6 },
  { id: "s2", audio: "cr7/s2.mp3", caption: "Over nine hundred career goals", dur: 9.5 },
  { id: "s3", audio: "cr7/s3.mp3", caption: "Champions League all-time top scorer", dur: 9.1 },
  { id: "s4", audio: "cr7/s4.mp3", caption: "International top scorer for Portugal", dur: 9.2 },
  { id: "s5", audio: "cr7/s5.mp3", caption: "Major honours across two decades", dur: 12.0 },
  { id: "s6", audio: "cr7/s6.mp3", caption: "Twenty plus years at the highest level", dur: 11.0 },
  { id: "s7", audio: "cr7/s7.mp3", caption: "A legacy that may never be matched", dur: 7.6 },
];
