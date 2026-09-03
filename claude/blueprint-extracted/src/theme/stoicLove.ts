// ---------------------------------------------------------------------------
// Theme Stoic Love — Cinematic Philosophy palette
//
// Deep charcoal / midnight + warm ivory + muted gold/amber
// Elegant, contemplative, cinematic feeling for vertical short-form.
// Uses createTheme() for contract validation.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export const stoicLove = createTheme({
  name: "stoicLove",
  colors: {
    bg: "#0a0a0c",
    bg2: "#111114",
    card: "rgba(255,250,240,0.03)",
    line: "rgba(210,180,120,0.15)",
    accent1: "#f5e6c8",
    accent1Soft: "#faf0e0",
    accent2: "#d4a843",
    accent2Soft: "#e8c56d",
    accent3: "#8b7355",
    ink: "#faf8f3",
    muted: "#9a8c7a",
  },
  fonts: {
    display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
  },
});