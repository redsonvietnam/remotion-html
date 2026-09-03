// ---------------------------------------------------------------------------
// SVG Engine — Public API
//
// Template-agnostic SVG drawing primitives.
// These are visual primitives: they know how to draw, not what to draw.
// ---------------------------------------------------------------------------

export { PathDraw } from "./PathDraw";
export { CircleDraw, RingDraw } from "./RingDraw";
export { LineDraw } from "./LineDraw";
export { FlowLine } from "./FlowLine";

export type {
  PathDrawProps,
  CircleDrawProps,
  LineDrawProps,
  FlowLineProps,
  TickMark,
  Progress,
} from "./types";

export { computeTickMarks, clampProgress } from "./types";
