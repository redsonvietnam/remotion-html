// ---------------------------------------------------------------------------
// Stack — Vertical/Horizontal Flex with Gap
//
// Layout primitive for stacking elements with consistent spacing.
// Replaces manual flexDirection: "column" + gap patterns.
// ---------------------------------------------------------------------------

import React from "react";
import type { StackProps } from "./types";
import { mapAlign, mapJustify } from "./types";

export const Stack: React.FC<StackProps> = ({
  children,
  gap = 0,
  align = "stretch",
  justify = "start",
  direction = "column",
  style,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: mapAlign(align),
        justifyContent: mapJustify(justify),
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
