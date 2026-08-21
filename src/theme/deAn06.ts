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
    bg: "#0a1628",
    bg2: "#0f1f3a",
    card: "rgba(255,255,255,0.05)",
    line: "rgba(200,220,255,0.12)",
    accent1: "#00b4d8",
    accent1Soft: "#48cae4",
    accent2: "#0077b6",
    accent2Soft: "#0096c7",
    accent3: "#90e0ef",
    ink: "#f0f4f8",
    muted: "#8ba3c0",
  },
  fonts: {
    display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
  },
});
