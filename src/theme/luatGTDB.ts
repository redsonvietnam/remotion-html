// ---------------------------------------------------------------------------
// Theme Luật GTDB — Road traffic safety law palette
//
// Blue/yellow oriented — evokes road signs, authority, clarity.
// Uses createTheme() for contract validation.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export const luatGTDB = createTheme({
  name: "luatGTDB",
  colors: {
    bg: "#0a0f1e",
    bg2: "#0f1a30",
    card: "rgba(255,255,255,0.04)",
    line: "rgba(160,200,255,0.1)",
    accent1: "#f59e0b",
    accent1Soft: "#fbbf24",
    accent2: "#3b82f6",
    accent2Soft: "#60a5fa",
    accent3: "#10b981",
    ink: "#f5faff",
    muted: "#7a9cc6",
  },
  fonts: {
    display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
  },
});
