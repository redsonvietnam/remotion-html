// ---------------------------------------------------------------------------
// Container — Centered Content with Padding + MaxWidth
//
// The root layout primitive. Wraps content with alignment, padding, and
// optional max-width constraint. Replaces manual AbsoluteFill + flex column
// + center alignment patterns.
// ---------------------------------------------------------------------------

import React from "react";
import type { ContainerProps } from "./types";
import { mapAlign, mapJustify } from "./types";

export const Container: React.FC<ContainerProps> = ({
  children,
  padding = "0 8% 12%",
  maxWidth,
  align = "center",
  justify = "center",
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
        padding,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        position: "relative",
        ...(maxWidth ? { maxWidth } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
