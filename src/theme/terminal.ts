// ---------------------------------------------------------------------------
// Terminal Code Tip — Theme
//
// Matrix-green palette, dark terminal, monospace fonts.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export const terminalTheme = createTheme({
  name: "terminal",
  colors: {
    bg: "#000000",
    bg2: "#0a0a0a",
    card: "rgba(13,17,23,0.85)",
    line: "rgba(0,255,102,0.12)",
    accent1: "#00ff66",
    accent1Soft: "rgba(0,255,102,0.25)",
    accent2: "#00cc52",
    accent2Soft: "rgba(0,204,82,0.20)",
    accent3: "#003d1a",
    ink: "#e6e6e6",
    muted: "#6a7a8a",
  },
  fonts: {
    display: "'Barlow Condensed','Segoe UI',system-ui,sans-serif",
    body: "'Barlow Condensed','Segoe UI',system-ui,sans-serif",
    mono: "'JetBrains Mono','Fira Code',monospace",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  typography: { caption: 18, body: 22, subtitle: 28, title: 40, titleLg: 56, hero: 72 },
});

/** Syntax token color map — matches the prototype's highlight.css. */
export const SYNTAX_COLORS: Record<string, string> = {
  keyword: "#ff79c6",
  string: "#50fa7b",
  function: "#8be9fd",
  number: "#bd93f9",
  comment: "#6272a4",
  variable: "#f1fa8c",
  type: "#8be9fd",
};
