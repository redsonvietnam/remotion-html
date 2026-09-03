// ---------------------------------------------------------------------------
// Row — Horizontal Flex with Gap
//
// Layout primitive for horizontal arrangements with consistent spacing.
// Replaces manual display: "flex" + gap + alignItems patterns.
// ---------------------------------------------------------------------------

import React from "react";
import type { RowProps } from "./types";
import { mapAlign, mapJustify } from "./types";

export const Row: React.FC<RowProps> = ({
  children,
  gap = 0,
  align = "center",
  justify = "start",
  wrap = false,
  style,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: mapAlign(align),
        justifyContent: mapJustify(justify),
        flexWrap: wrap ? "wrap" : "nowrap",
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
