// ---------------------------------------------------------------------------
// Cosmos Theme — Deep space, cosmic palette
// ---------------------------------------------------------------------------

import type { Theme } from "../design/theme";

export const cosmos: Theme = {
  name: "cosmos",
  colors: {
    bg: "#050510",
    bg2: "#0a0a2e",
    card: "#111133",
    line: "rgba(255,255,255,0.06)",
    accent1: "#3b82f6",
    accent1Soft: "#2563eb",
    accent2: "#a855f7",
    accent2Soft: "#9333ea",
    accent3: "#f8fafc",
    ink: "#f8fafc",
    muted: "#94a3b8",
  },
  fonts: {
    display: '"Inter","Segoe UI",system-ui,sans-serif',
    body: '"Inter","Segoe UI",system-ui,sans-serif',
    mono: '"JetBrains Mono","Fira Code",monospace',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  typography: { caption: 14, body: 18, subtitle: 24, title: 48, titleLg: 72, hero: 100 },
};
