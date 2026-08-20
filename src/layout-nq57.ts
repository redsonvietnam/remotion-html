import { CSSProperties } from "react";

/** Shared visual layout tokens for NQ57 scenes. Keep scene content intact while preventing edge/overflow collisions. */
export const NQ57_SAFE = {
  horizontal: "6%",
  bottom: "12%",
  maxText: "88%",
  contentMax: 1500,
} as const;

export const safeText = (extra: CSSProperties = {}): CSSProperties => ({
  maxWidth: NQ57_SAFE.maxText,
  overflowWrap: "break-word",
  wordBreak: "normal",
  ...extra,
});

export const cardText = (extra: CSSProperties = {}): CSSProperties => ({
  minWidth: 0,
  maxWidth: "100%",
  overflowWrap: "break-word",
  wordBreak: "normal",
  ...extra,
});
