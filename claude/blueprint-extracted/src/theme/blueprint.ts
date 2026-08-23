// ---------------------------------------------------------------------------
// Theme Blueprint — Technical Drafting palette
//
// Deep drafting-navy background + cyan-white "ink" line work + one warm
// amber accent reserved for emphasis (callout numbers, dimension figures).
// Deliberately NOT gold-on-red (nq57 family) and NOT warm gravitational
// gold/bronze (stoicLove): this is a document/structure register.
// Uses createTheme() for contract validation.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export const blueprint = createTheme({
  name: "blueprint",
  colors: {
    bg: "#0a1830",
    bg2: "#0f2145",
    card: "rgba(224,238,255,0.04)",
    line: "rgba(224,238,255,0.22)",
    accent1: "#eaf4ff",
    accent1Soft: "rgba(234,244,255,0.55)",
    accent2: "#e8a33d",
    accent2Soft: "#f2c27a",
    accent3: "#5b84b8",
    ink: "#f2f6fb",
    muted: "#7d93b3",
  },
  fonts: {
    display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
  },
});
