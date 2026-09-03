// ---------------------------------------------------------------------------
// CR7 Theme — Dark, warm, statistics-driven
// ---------------------------------------------------------------------------

import type { Theme } from "../design/theme";

export const cr7: Theme = {
  name: "cr7",
  colors: {
    bg: "#0c0a09",
    bg2: "#1c1917",
    card: "#292524",
    line: "rgba(255,255,255,0.06)",
    accent1: "#f59e0b",
    accent1Soft: "#d97706",
    accent2: "#ef4444",
    accent2Soft: "#dc2626",
    accent3: "#10b981",
    ink: "#fafaf9",
    muted: "#a8a29e",
  },
  fonts: {
    display: '"Inter","Segoe UI",system-ui,sans-serif',
    body: '"Inter","Segoe UI",system-ui,sans-serif',
    mono: '"JetBrains Mono","Fira Code",monospace',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  typography: { caption: 14, body: 18, subtitle: 24, title: 48, titleLg: 72, hero: 120 },
};
