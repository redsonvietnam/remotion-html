// ---------------------------------------------------------------------------
// Theme CanCuoc — Civic / Legal palette
//
// Deep indigo + civic blue + restrained gold + teal accent.
// White typography. Uses createTheme() for contract validation.
// Reuses the NQ57 template; this is presentation only (no new visual grammar).
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export const canCuoc = createTheme({
  name: "canCuoc",
  colors: {
    bg: "#081120",
    bg2: "#0d1a2e",
    card: "rgba(255,255,255,0.04)",
    line: "rgba(120,170,220,0.16)",
    accent1: "#3b82f6",
    accent1Soft: "#7cb0ff",
    accent2: "#f4b740",
    accent2Soft: "#ffd877",
    accent3: "#2dd4bf",
    ink: "#f6f9ff",
    muted: "#9fb2c9",
  },
  fonts: {
    display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
  },
});
