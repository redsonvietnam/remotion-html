// ---------------------------------------------------------------------------
// Feature Drop — Theme
//
// Dark aurora background, Inter font, JetBrains Mono accent, SVG icons,
// gradient accents. Preserves prototype visual tokens.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

/** SVG icon paths (viewBox 0 0 100 100) — hand-drawn, no icon library. */
export const ICON_PATHS: Record<string, string> = {
  sync:
    "M78 30 A34 34 0 1 0 82 55 M78 30 L78 12 M78 30 L60 30",
  shield:
    "M50 8 L84 22 V50 C84 74 68 88 50 94 C32 88 16 74 16 50 V22 Z",
  bolt:
    "M56 6 L22 56 H46 L40 96 L82 40 H56 Z",
};

export const featureDropTheme = createTheme({
  name: "featureDrop",
  colors: {
    bg: "#0a0812",
    bg2: "#140f24",
    card: "rgba(124,92,255,0.08)",
    line: "rgba(124,92,255,0.18)",
    accent1: "#7c5cff",
    accent1Soft: "rgba(124,92,255,0.25)",
    accent2: "#3ddcff",
    accent2Soft: "rgba(61,220,255,0.25)",
    accent3: "#f5f4fa",
    ink: "#f5f4fa",
    muted: "rgba(245,244,250,0.55)",
  },
  fonts: {
    display: "'Inter','Segoe UI',system-ui,sans-serif",
    body: "'Inter','Segoe UI',system-ui,sans-serif",
    mono: "'JetBrains Mono','Fira Code',monospace",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii: { sm: 6, md: 12, lg: 18, xl: 24, full: 9999 },
  typography: { caption: 11, body: 13, subtitle: 18, title: 32, titleLg: 56, hero: 56 },
});
