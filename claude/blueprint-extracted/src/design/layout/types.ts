// ---------------------------------------------------------------------------
// Layout Engine — Type Contracts
//
// Template-agnostic layout primitives.
// These describe STRUCTURE, not STYLE.
// ---------------------------------------------------------------------------

import type { CSSProperties, ReactNode } from "react";

// ─── Alignment ──────────────────────────────────────────────────────────────

/** Horizontal alignment within a flex container. */
export type AlignItems = "start" | "center" | "end" | "stretch";

/** Vertical alignment within a flex container. */
export type JustifyContent = "start" | "center" | "end" | "between";

/** Flex direction. */
export type Direction = "row" | "column";

/** Map semantic alignment to CSS values. */
export function mapAlign(align: AlignItems): CSSProperties["alignItems"] {
  switch (align) {
    case "start": return "flex-start";
    case "center": return "center";
    case "end": return "flex-end";
    case "stretch": return "stretch";
  }
}

/** Map semantic justify to CSS values. */
export function mapJustify(justify: JustifyContent): CSSProperties["justifyContent"] {
  switch (justify) {
    case "start": return "flex-start";
    case "center": return "center";
    case "end": return "flex-end";
    case "between": return "space-between";
  }
}

// ─── Container ──────────────────────────────────────────────────────────────

export interface ContainerProps {
  children: ReactNode;
  /** Horizontal padding (CSS value). */
  padding?: string | number;
  /** Maximum width (CSS value). */
  maxWidth?: string | number;
  /** Horizontal alignment of content. Default: "center". */
  align?: AlignItems;
  /** Vertical alignment of content. Default: "center". */
  justify?: JustifyContent;
  /** Flex direction. Default: "column". */
  direction?: Direction;
  /** CSS style override. */
  style?: CSSProperties;
  /** CSS class name. */
  className?: string;
}

// ─── Stack ──────────────────────────────────────────────────────────────────

export interface StackProps {
  children: ReactNode;
  /** Gap between items in px. Default: 0. */
  gap?: number;
  /** Horizontal alignment of items. Default: "stretch". */
  align?: AlignItems;
  /** Vertical alignment of items. Default: "start". */
  justify?: JustifyContent;
  /** Flex direction. Default: "column". */
  direction?: Direction;
  /** CSS style override. */
  style?: CSSProperties;
  /** CSS class name. */
  className?: string;
}

// ─── Row ────────────────────────────────────────────────────────────────────

export interface RowProps {
  children: ReactNode;
  /** Gap between items in px. Default: 0. */
  gap?: number;
  /** Vertical alignment of items. Default: "center". */
  align?: AlignItems;
  /** Horizontal distribution of items. Default: "start". */
  justify?: JustifyContent;
  /** Allow items to wrap. Default: false. */
  wrap?: boolean;
  /** CSS style override. */
  style?: CSSProperties;
  /** CSS class name. */
  className?: string;
}
