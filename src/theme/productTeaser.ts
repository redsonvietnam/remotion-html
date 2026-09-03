// ---------------------------------------------------------------------------
// Product Teaser Theme — Design Tokens
//
// Dark UI design system (Linear/Stripe/Vercel style)
// Extracted from: prototypes/product-teaser-remotion-prototype.html
// ---------------------------------------------------------------------------

export interface ProductTeaserTheme {
  colors: {
    bg: string;
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    accent: string;
    accentSoft: string;
    success: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  fonts: {
    sans: string;
    mono: string;
  };
}

export const productTeaser: ProductTeaserTheme = {
  colors: {
    bg: "#08090c",
    surface: "#101218",
    border: "rgba(255,255,255,.08)",
    textPrimary: "#f5f6f8",
    textSecondary: "#9a9ea8",
    textTertiary: "#5c6270",
    accent: "#6e8bff",
    accentSoft: "rgba(110,139,255,.15)",
    success: "#3ddc84",
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
  },
  fonts: {
    sans: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
};
