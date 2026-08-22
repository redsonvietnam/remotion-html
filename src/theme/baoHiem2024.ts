// ---------------------------------------------------------------------------
// Theme: BaoHiem2024 — Luật Bảo hiểm Xã hội 2024
//
// Visual character: technical blueprint / engineering diagram
// Deep navy substrate + electric cyan signal lines + warm amber data labels
// + white node labels.
// Feels like a system architecture diagram or a network monitor — not a
// government brochure.
// ---------------------------------------------------------------------------

import { createTheme } from "../design/theme";

export const baoHiem2024 = createTheme({
  name: "baoHiem2024",
  colors: {
    // Blueprint dark navy substrate
    bg: "#05080f",
    bg2: "#080d1a",
    // Node card fills
    card: "rgba(0,220,255,0.05)",
    // Edge / grid line
    line: "rgba(0,200,255,0.18)",
    // Primary accent — electric cyan (signal / active node / highlight)
    accent1: "#00d4ff",
    accent1Soft: "#7feeff",
    // Secondary accent — warm amber (data label / monetary figure)
    accent2: "#f59e0b",
    accent2Soft: "#fcd34d",
    // Tertiary — soft emerald (positive / benefit / approval)
    accent3: "#10b981",
    // Typography
    ink: "#f0f8ff",
    muted: "#4a7a9b",
  },
  fonts: {
    display: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    body: "'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
});
