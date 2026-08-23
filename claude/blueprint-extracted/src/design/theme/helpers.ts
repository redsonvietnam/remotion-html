// ---------------------------------------------------------------------------
// Theme Helpers — Create, merge, and access themes
//
// Pure functions for theme manipulation. No React context — that's
// the template's responsibility.
// ---------------------------------------------------------------------------

import type { Theme, ThemeInput, ThemeColors, ThemeColorsInput } from "./types";

/**
 * Create a complete theme from a partial input, filling defaults.
 *
 * @example
 *   const myTheme = createTheme({
 *     name: "minimal",
 *     colors: { ... },
 *   });
 */
export function createTheme(input: ThemeInput): Theme {
  const colors: ThemeColors = {
    ...DEFAULT_COLORS,
    ...(input.colors ?? {}),
  } as ThemeColors;
  return {
    name: input.name ?? "unnamed",
    colors,
    fonts: { ...DEFAULT_FONTS, ...input.fonts },
    spacing: { ...DEFAULT_SPACING, ...input.spacing },
    radii: { ...DEFAULT_RADII, ...input.radii },
    typography: { ...DEFAULT_TYPOGRAPHY, ...input.typography },
  };
}

/**
 * Merge two themes: base + override. Override wins.
 *
 * @example
 *   const darkTheme = mergeTheme(baseTheme, {
 *     colors: { bg: "#000", ink: "#fff" },
 *   });
 */
export function mergeTheme(base: Theme, override: ThemeInput): Theme {
  const colors: ThemeColors = {
    ...base.colors,
    ...(override.colors as Partial<ThemeColors>),
  } as ThemeColors;
  return {
    name: override.name ?? base.name,
    colors,
    fonts: { ...base.fonts, ...override.fonts },
    spacing: { ...base.spacing, ...override.spacing },
    radii: { ...base.radii, ...override.radii },
    typography: { ...base.typography, ...override.typography },
  };
}

/**
 * Get a color by semantic name. Returns fallback if not found.
 *
 * @example
 *   const bg = getColor(theme.colors, "bg");
 */
export function getColor(colors: ThemeColors, name: keyof ThemeColors): string {
  return colors[name];
}

// ─── Defaults ───────────────────────────────────────────────────────────────

export const DEFAULT_COLORS: ThemeColors = {
  bg: "#0a0e1a",
  bg2: "#0f1525",
  card: "rgba(255,255,255,0.045)",
  line: "rgba(245,245,255,0.12)",
  accent1: "#e23b3b",
  accent1Soft: "#ff6b5e",
  accent2: "#f3c969",
  accent2Soft: "#ffe6a3",
  accent3: "#5eead4",
  ink: "#f7f5ef",
  muted: "#9aa0b5",
};

export const DEFAULT_FONTS = {
  display: "'Inter', 'Segoe UI', system-ui, sans-serif",
  body: "'Inter', 'Segoe UI', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const DEFAULT_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const DEFAULT_RADII = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  full: 999,
};

export const DEFAULT_TYPOGRAPHY = {
  caption: 16,
  body: 20,
  subtitle: 26,
  title: 42,
  titleLg: 64,
  hero: 120,
};
