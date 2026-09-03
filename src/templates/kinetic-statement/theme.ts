// ---------------------------------------------------------------------------
// Kinetic Statement — Theme
//
// Dark backgrounds, Inter font, gold accent, high-contrast typography.
// ---------------------------------------------------------------------------

import { createTheme } from "../../design/theme";

export const kineticStatementTheme = createTheme({
  name: "kineticStatement",
  colors: {
    bg: "#0b0d14",
    bg2: "#1a0b2e",
    card: "rgba(255,255,255,0.05)",
    line: "rgba(255,255,255,0.08)",
    accent1: "#ffd166",
    accent1Soft: "rgba(255,209,102,0.25)",
    accent2: "#3a0ca3",
    accent2Soft: "rgba(58,12,163,0.25)",
    accent3: "#1c1c1e",
    ink: "#ffffff",
    muted: "#9a9aad",
  },
  fonts: {
    display: "'Inter','Segoe UI',system-ui,sans-serif",
    body: "'Inter','Segoe UI',system-ui,sans-serif",
    mono: "'JetBrains Mono','Fira Code',monospace",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  typography: { caption: 15, body: 18, subtitle: 24, title: 40, titleLg: 56, hero: 92 },
});
