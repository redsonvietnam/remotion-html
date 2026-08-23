// ---------------------------------------------------------------------------
// Theme De An 06 — Digital identity / transformation palette
//
// Blue/teal oriented. Modern, clean, authoritative.
// Uses createTheme() for contract validation.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export const deAn06 = createTheme({
  name: "deAn06",
  colors: {
    bg: "#061220",
    bg2: "#0a1a34",
    card: "rgba(255,255,255,0.04)",
    line: "rgba(160,200,255,0.1)",
    accent1: "#00d4ff",
    accent1Soft: "#66e0ff",
    accent2: "#0099cc",
    accent2Soft: "#33b5e5",
    accent3: "#00ffcc",
    ink: "#f5faff",
    muted: "#7a9cc6",
  },
  fonts: {
    display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
  },
});