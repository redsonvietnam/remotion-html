// ---------------------------------------------------------------------------
// Champions League — Scrapbook Production
//
// Historical Champions League moments (1997–2005 era).
// ---------------------------------------------------------------------------

import { sceneFrames } from "./contract";
import type { SceneDef, ScrapbookSceneContent } from "./contract";

export const CHAMPIONS_LEAGUE_SCENES: SceneDef[] = [
  { id: "hero", audio: "championsLeague/s1.mp3", caption: "Champions League 1997-2005", dur: 5 },
  { id: "match-1999", audio: "championsLeague/s2.mp3", caption: "Final 1999", dur: 6 },
  { id: "history-2002", audio: "championsLeague/s3.mp3", caption: "Zidane 2002", dur: 6 },
  { id: "photos", audio: "championsLeague/s4.mp3", caption: "Iconic Moments", dur: 5 },
  { id: "match-2003", audio: "championsLeague/s7.mp3", caption: "Milan Derby 2003", dur: 6 },
  { id: "history-2005", audio: "championsLeague/s8.mp3", caption: "Istanbul 2005", dur: 7 },
  { id: "timeline", audio: "championsLeague/s5.mp3", caption: "Timeline", dur: 7 },
  { id: "closing", audio: "championsLeague/s6.mp3", caption: "The Beautiful Game", dur: 5 },
];

export const CHAMPIONS_LEAGUE_CONTENT: Record<string, ScrapbookSceneContent> = {
  hero: {
    kind: "hero",
    title: "Champions League",
    subtitle: "The greatest club competition in world football",
    tagline: "1997 — 2005",
  },
  "match-1999": {
    kind: "match",
    homeTeam: "Manchester United",
    awayTeam: "Bayern Munich",
    score: "2 — 1",
    competition: "UEFA Champions League Final 1999",
    highlight: "Two goals in injury time — the greatest final ever",
  },
  "history-2002": {
    kind: "history",
    year: "2002",
    fact: "Zidane's volley",
    detail: "One of the greatest goals in Champions League history. A left-footed volley from the edge of the box into the top corner.",
    annotation: "Hampden Park, Glasgow — 22 May 2002",
  },
  photos: {
    kind: "photo",
    caption: "Iconic Moments",
    annotation: "The moments that defined an era",
    Polaroid: [
      { label: "United '99", sublabel: "Treble winners" },
      { label: "Real Madrid", sublabel: "La Decima era" },
      { label: "Milan '03", sublabel: "All-Italian final" },
    ],
  },
  "match-2003": {
    kind: "match",
    homeTeam: "AC Milan",
    awayTeam: "Juventus",
    score: "0 — 0 (3-2 pen)",
    competition: "UEFA Champions League Final 2003",
    highlight: "The first all-Italian final — Milan won on penalties at Old Trafford",
  },
  "history-2005": {
    kind: "history",
    year: "2005",
    fact: "The Istanbul Miracle",
    detail: "Liverpool trailed 3-0 at half-time against AC Milan, then scored three goals in six minutes to force extra time and win on penalties.",
    annotation: "Ataturk Olympic Stadium, Istanbul — 25 May 2005",
  },
  timeline: {
    kind: "timeline",
    title: "Champions League Timeline",
    items: [
      { label: "1997", value: "Dortmund wins first title", year: "1997" },
      { label: "1999", value: "United's dramatic comeback", year: "1999" },
      { label: "2002", value: "Zidane's legendary volley", year: "2002" },
      { label: "2005", value: "Istanbul — the miracle final", year: "2005" },
    ],
  },
  closing: {
    kind: "closing",
    title: "The Beautiful Game",
    subtitle: "Moments that live forever in football history",
    stats: [
      { label: "Years", value: "1997–2005" },
      { label: "Goals", value: "847" },
      { label: "Matches", value: "326" },
    ],
    reference: "UEFA Champions League Archives",
  },
};

export const sceneFramesCl = sceneFrames;
