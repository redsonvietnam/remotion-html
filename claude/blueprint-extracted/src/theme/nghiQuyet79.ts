// ---------------------------------------------------------------------------
// Theme Nghị Quyết 79 — Institutional / Authority palette
//
// Deep navy / midnight + warm gold + restrained red accent
// White typography. Subtle metallic / institutional feeling.
// Uses createTheme() for contract validation.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export const nghiQuyet79 = createTheme({
  name: "nghiQuyet79",
  colors: {
    bg: "#050d1a",
    bg2: "#0a1628",
    card: "rgba(255,255,255,0.035)",
    line: "rgba(210,180,120,0.12)",
    accent1: "#d4a843",
    accent1Soft: "#e8c56d",
    accent2: "#b8860b",
    accent2Soft: "#d4a017",
    accent3: "#c0392b",
    ink: "#fdfbf7",
    muted: "#a89a7c",
  },
  fonts: {
    display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
  },
});