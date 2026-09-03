/**
 * Real Estate Listing — Theme & Design Tokens
 * Premium, warm aesthetic with bronze accent and serif/sans blend.
 */

export interface RealEstateListingTheme {
  color: {
    bg: string;
    ink: string;
    inkSoft: string;
    muted: string;
    accent: string;
    card: string;
    border: string;
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
    lg: number;
  };
}

/**
 * Default Real Estate Listing theme.
 * Warm beige background, bronze accent, serif for headings/pricing.
 */
export const REAL_ESTATE_LISTING_THEME: RealEstateListingTheme = {
  color: {
    bg: '#f6f2ea',           // warm beige background
    ink: '#221e19',          // near-black ink
    inkSoft: '#5a534a',      // softened ink for secondary text
    muted: '#7a7268',        // warm muted gray
    accent: '#a9762f',       // bronze accent
    card: '#ffffff',         // white cards
    border: '#e8e0d2',       // light border
  },
  typography: {
    serif: "'Fraunces', serif",  // warm serif for headings/pricing
    sans: "'Inter', sans-serif",  // clean sans for body
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 12,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 20,
    md: 16,
    lg: 20,
  },
};
