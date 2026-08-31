// ---------------------------------------------------------------------------
// Bento Grid Showcase — Theme
//
// Dark aurora background, Inter font, glassmorphism cards, vibrant accents.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export interface AuroraBlob {
  color: string;
  size: number;
  ax: number;
  ay: number;
  freqx: number;
  freqy: number;
  phase: number;
  baseX: number;
  baseY: number;
}

export interface BentoGridTheme {
  name: string;
  colors: ReturnType<typeof createTheme>["colors"];
  fonts: ReturnType<typeof createTheme>["fonts"];
  spacing: ReturnType<typeof createTheme>["spacing"];
  radii: ReturnType<typeof createTheme>["radii"];
  typography: ReturnType<typeof createTheme>["typography"];
  auroraBlobs: AuroraBlob[];
}

const baseTheme = createTheme({
  name: "bentoGrid",
  colors: {
    bg: "#06050a",
    bg2: "#0c0a14",
    card: "rgba(255,255,255,0.055)",
    line: "rgba(255,255,255,0.13)",
    accent1: "#7c5cff",
    accent1Soft: "rgba(124,92,255,0.25)",
    accent2: "#ff6bd6",
    accent2Soft: "rgba(255,107,214,0.25)",
    accent3: "#3ddcff",
    ink: "#f5f4fa",
    muted: "rgba(245,244,250,0.65)",
  },
  fonts: {
    display: "'Inter','Segoe UI',system-ui,sans-serif",
    body: "'Inter','Segoe UI',system-ui,sans-serif",
    mono: "'JetBrains Mono','Fira Code',monospace",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii: { sm: 6, md: 12, lg: 18, xl: 24, full: 9999 },
  typography: { caption: 11, body: 13, subtitle: 18, title: 26, titleLg: 38, hero: 56 },
});

export const bentoGridTheme: BentoGridTheme = {
  ...baseTheme,
  auroraBlobs: [
    { color: "#7c5cff", size: 220, ax: 26, ay: 18, freqx: 0.008, freqy: 0.011, phase: 0, baseX: 20, baseY: 22 },
    { color: "#ff6bd6", size: 200, ax: 20, ay: 24, freqx: 0.010, freqy: 0.007, phase: 2.1, baseX: 75, baseY: 30 },
    { color: "#3ddcff", size: 180, ax: 22, ay: 20, freqx: 0.006, freqy: 0.013, phase: 4.0, baseX: 30, baseY: 78 },
    { color: "#ffb84d", size: 160, ax: 18, ay: 16, freqx: 0.012, freqy: 0.009, phase: 1.2, baseX: 80, baseY: 80 },
  ],
};
