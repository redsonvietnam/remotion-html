// ---------------------------------------------------------------------------
// Theme System — Public API
//
// Theme is HOW IT LOOKS, not WHAT it shows or HOW it's structured.
// Pure functions — no React context. Templates provide context.
// ---------------------------------------------------------------------------

export { createTheme, mergeTheme, getColor } from "./helpers";
export {
  DEFAULT_COLORS,
  DEFAULT_FONTS,
  DEFAULT_SPACING,
  DEFAULT_RADII,
  DEFAULT_TYPOGRAPHY,
} from "./helpers";
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
