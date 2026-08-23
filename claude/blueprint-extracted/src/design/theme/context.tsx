// ---------------------------------------------------------------------------
// Theme Context — React context for theme injection
//
// Templates provide ThemeProvider at the root.
// Scene components consume via useTheme().
// ---------------------------------------------------------------------------

import React, { createContext, useContext } from "react";
import type { Theme } from "./types";

const ThemeContext = createContext<Theme | null>(null);

/**
 * Provide theme to all descendant components.
 * Use at template root level.
 */
export const ThemeProvider: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

/**
 * Consume the current theme from context.
 * Must be used inside a ThemeProvider.
 */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return theme;
}
