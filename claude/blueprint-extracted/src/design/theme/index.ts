// ---------------------------------------------------------------------------
// Theme System — Public API
//
// Theme is HOW IT LOOKS, not WHAT it shows or HOW it's structured.
// Pure functions + React context for template injection.
// ---------------------------------------------------------------------------

export { createTheme, mergeTheme, getColor } from "./helpers";
export {
  DEFAULT_COLORS,
  DEFAULT_FONTS,
  DEFAULT_SPACING,
  DEFAULT_RADII,
  DEFAULT_TYPOGRAPHY,
} from "./helpers";
export { ThemeProvider, useTheme } from "./context";
export type {
  Theme,
  ThemeInput,
  ThemeColors,
  ThemeColorsInput,
  ThemeFonts,
  ThemeSpacing,
  ThemeRadii,
  ThemeTypography,
} from "./types";
