// ---------------------------------------------------------------------------
// CR7 vs Messi Content Data
//
// Cristiano Ronaldo vs Lionel Messi — The Eternal Debate
// YouTube 1920x1080, ~61s, 7 scenes
// CR7 template — typography/statistics visual grammar
//
// All facts verified from public records:
//   - Ronaldo: 900+ goals, 140 CL goals, 136 international goals
//   - Messi: 800+ goals, 129 CL goals, 108 international goals
//   - Ronaldo: 5 Ballon d'Or, 5 CL titles, 1 Euro
//   - Messi: 8 Ballon d'Or, 4 CL titles, 1 World Cup
//   - Both: all-time top scorers for their clubs and countries
// ---------------------------------------------------------------------------

import { FPS, TAIL, sceneFrames } from "./contract";
import type { SceneDef } from "./contract";
import type { CR7SceneContent } from "./contract";

export { FPS, TAIL, sceneFrames };
export type { SceneDef };
export type { CR7SceneContent };

// ---------------------------------------------------------------------------
// CR7 vs Messi Scene Content — keyed by scene ID
// ---------------------------------------------------------------------------

export const CR7_VS_MESSI_CONTENT: Record<string, CR7SceneContent> = {
  s1: {
    kind: "hero",
    name: "RONALDO vs MESSI",
    tagline: "THE ETERNAL DEBATE",
    subtitle: "Two legends. One question. Numbers tell the story.",
  },

  s2: {
    kind: "stat",
    label: "CAREER GOALS",
    bigNumber: "900+",
    sub: "Ronaldo leads — first to 900 official career goals",
    detail: "Ronaldo: 900+ goals. Messi: 800+ goals. Both all-time greats.",
    color: "accent1",
  },

  s3: {
    kind: "stat",
    label: "CHAMPIONS LEAGUE",
    bigNumber: "140",
    sub: "Ronaldo — all-time top scorer",
    detail: "Ronaldo: 140 CL goals. Messi: 129 CL goals. Both dominated Europe.",
    color: "accent2",
  },

  s4: {
    kind: "stat",
    label: "BALLON D'OR",
    bigNumber: "8",
    sub: "Messi — most in history",
    detail: "Messi: 8 Ballon d'Or. Ronaldo: 5. Individual brilliance defined an era.",
    color: "accent3",
  },

  s5: {
    kind: "milestone",
    title: "HEAD TO HEAD",
    items: [
      { label: "Ronaldo Goals", value: "900+" },
      { label: "Messi Goals", value: "800+" },
      { label: "Ronaldo Ballon d'Or", value: "5" },
      { label: "Messi Ballon d'Or", value: "8" },
    ],
  },

  s6: {
    kind: "stat",
    label: "INTERNATIONAL",
    bigNumber: "136",
    sub: "Ronaldo — all-time men's international top scorer",
    detail: "Ronaldo: 136 for Portugal. Messi: 108 for Argentina. Both won major tournaments.",
    color: "accent1",
  },

  s7: {
    kind: "closing",
    title: "LEGACY",
    subtitle: "There is no winner. Only two legends\nwho pushed each other to greatness.",
    reference: "Ronaldo vs Messi — The numbers speak",
  },
};

// ---------------------------------------------------------------------------
// CR7 vs Messi Scene Definitions
// ---------------------------------------------------------------------------

export const CR7_VS_MESSI_SCENES: SceneDef[] = [
  { id: "s1", audio: "cr7vsMessi/s1.mp3", caption: "Ronaldo versus Messi — the eternal debate", dur: 10.8 },
  { id: "s2", audio: "cr7vsMessi/s2.mp3", caption: "Career goals — Ronaldo leads with over nine hundred", dur: 13.5 },
  { id: "s3", audio: "cr7vsMessi/s3.mp3", caption: "Champions League — Ronaldo all-time top scorer", dur: 14.7 },
  { id: "s4", audio: "cr7vsMessi/s4.mp3", caption: "Ballon d'Or — Messi holds the record with eight", dur: 13.2 },
  { id: "s5", audio: "cr7vsMessi/s5.mp3", caption: "Head to head — two legends compared", dur: 12.7 },
  { id: "s6", audio: "cr7vsMessi/s6.mp3", caption: "International — Ronaldo top scorer for Portugal", dur: 13.9 },
  { id: "s7", audio: "cr7vsMessi/s7.mp3", caption: "No winner — only two legends who pushed each other", dur: 8.3 },
];
