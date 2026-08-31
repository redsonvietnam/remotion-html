/**
 * Editorial Feature Teaser — Theme & Design Tokens
 * Serif-based editorial aesthetic (Playfair Display + Inter).
 */

export interface EditorialFeatureTheme {
  color: {
    bg: string;
    ink: string;
    inkSoft: string;
    muted: string;
    accent: string;
    hairline: string;
  };
  typography: {
    serif: string;
    sans: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
  };
}

/**
 * Default Editorial Feature theme.
 * Light background, dark ink, serif display for headings.
 */
export const EDITORIAL_FEATURE_THEME: EditorialFeatureTheme = {
  color: {
    bg: '#f7f3ec',           // warm cream background
    ink: '#1a1a1a',          // almost black text
    inkSoft: '#2a2a26',      // softened black
    muted: '#6b6459',        // warm muted gray
    accent: '#b5432c',       // burnt sienna accent
    hairline: '#e4dccb',     // very light background
  },
  typography: {
    serif: "'Playfair Display', serif",  // editorial serif
    sans: "'Inter', sans-serif",        // clean sans
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 6,
    md: 12,
  },
};
