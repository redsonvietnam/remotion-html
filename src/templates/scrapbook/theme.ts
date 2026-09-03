// ---------------------------------------------------------------------------
// Scrapbook Theme — aged paper, editorial, handwritten
//
// Visual grammar: warm paper tones, ink blacks, tape browns, highlighter
// yellows, Polaroid whites. No code, no remotion, no React.
// ---------------------------------------------------------------------------

export interface ScrapbookTheme {
  colors: {
    paper: string;
    paperDark: string;
    ink: string;
    inkMuted: string;
    accent: string;
    highlight: string;
    tape: string;
    red: string;
    grid: string;
    highlighter: string;
  };
  fonts: {
    display: string;
    handwritten: string;
    mono: string;
    body: string;
  };
}

export const SCRAPBOOK_THEME: ScrapbookTheme = {
  colors: {
    paper: "#f5f0e8",
    paperDark: "#e8e0d0",
    ink: "#1a1a1a",
    inkMuted: "#666666",
    accent: "#c0392b",
    highlight: "#d4a017",
    tape: "#c9b896",
    red: "#c0392b",
    grid: "#d0c8b8",
    highlighter: "#f7dc6f",
  },
  fonts: {
    display: "Georgia, serif",
    handwritten: "Segoe Script, cursive",
    mono: "Courier New, monospace",
    body: "Georgia, serif",
  },
};
