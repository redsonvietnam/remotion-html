// ---------------------------------------------------------------------------
// Theme System — Type Contracts
//
// Defines what a theme IS: colors, fonts, spacing, radii.
// Theme is HOW IT LOOKS, not WHAT it shows or HOW it's structured.
// ---------------------------------------------------------------------------

// ─── Colors ─────────────────────────────────────────────────────────────────

/** Semantic color tokens. Every theme must define these. */
export interface ThemeColors {
  /** Primary background. */
  bg: string;
  /** Secondary/alt background. */
  bg2: string;
  /** Card/panel background. */
  card: string;
  /** Border/divider line color. */
  line: string;
  /** Primary accent (strong). */
  accent1: string;
  /** Primary accent (soft). */
  accent1Soft: string;
  /** Secondary accent (strong). */
  accent2: string;
  /** Secondary accent (soft). */
  accent2Soft: string;
  /** Tertiary accent. */
  accent3: string;
  /** Primary text (high contrast). */
  ink: string;
  /** Secondary text (lower contrast). */
  muted: string;
}

// ─── Fonts ──────────────────────────────────────────────────────────────────

/** Font family tokens. */
export interface ThemeFonts {
  /** Display/heading font (e.g., "'Inter', sans-serif"). */
  display: string;
  /** Body/text font. */
  body: string;
  /** Monospace font (for code/numbers). */
  mono?: string;
}

// ─── Spacing ────────────────────────────────────────────────────────────────

/** Spacing scale tokens (in px). */
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

// ─── Radii ──────────────────────────────────────────────────────────────────

/** Border radius tokens (in px). */
export interface ThemeRadii {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

// ─── Typography Scale ───────────────────────────────────────────────────────

/** Typography size/weight tokens. */
export interface ThemeTypography {
  /** Caption/small text size (px). */
  caption: number;
  /** Body text size (px). */
  body: number;
  /** Subtitle size (px). */
  subtitle: number;
  /** Title size (px). */
  title: number;
  /** Large title size (px). */
  titleLg: number;
  /** Hero/display size (px). */
  hero: number;
}

// ─── Complete Theme ─────────────────────────────────────────────────────────

/** Complete theme definition. All visual design decisions live here. */
export interface Theme {
  /** Theme name (for debugging/identification). */
  name: string;
  /** Color tokens. */
  colors: ThemeColors;
  /** Font families. */
  fonts: ThemeFonts;
  /** Spacing scale. */
  spacing: ThemeSpacing;
  /** Border radii. */
  radii: ThemeRadii;
  /** Typography sizes. */
  typography: ThemeTypography;
}

// ─── Theme Input (partial) ──────────────────────────────────────────────────

/** Partial colors for overriding. */
export type ThemeColorsInput = Partial<ThemeColors>;

/** Partial theme for extending/overriding a base theme. */
export type ThemeInput = Partial<Omit<Theme, "name" | "colors">> & {
  name?: string;
  colors?: ThemeColorsInput;
};
