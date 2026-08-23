import { describe, it, expect } from "vitest";
import { createTheme, mergeTheme, getColor } from "../helpers";
import { DEFAULT_COLORS, DEFAULT_FONTS, DEFAULT_SPACING } from "../helpers";

describe("createTheme", () => {
  it("name preserved", () => {
    const t = createTheme({ name: "test" });
    expect(t.name).toBe("test");
  });

  it("default bg", () => {
    const t = createTheme({ name: "test" });
    expect(t.colors.bg).toBe(DEFAULT_COLORS.bg);
  });

  it("default fonts", () => {
    const t = createTheme({ name: "test" });
    expect(t.fonts.display).toBe(DEFAULT_FONTS.display);
  });

  it("default spacing", () => {
    const t = createTheme({ name: "test" });
    expect(t.spacing.md).toBe(DEFAULT_SPACING.md);
  });
});

describe("mergeTheme", () => {
  it("name overridden", () => {
    const base = createTheme({ name: "base" });
    const override = mergeTheme(base, { name: "custom" });
    expect(override.name).toBe("custom");
  });

  it("bg overridden", () => {
    const base = createTheme({ name: "base" });
    const override = mergeTheme(base, { colors: { bg: "#000", ink: "#fff" } });
    expect(override.colors.bg).toBe("#000");
  });

  it("ink overridden", () => {
    const base = createTheme({ name: "base" });
    const override = mergeTheme(base, { colors: { bg: "#000", ink: "#fff" } });
    expect(override.colors.ink).toBe("#fff");
  });

  it("accent1 kept from base", () => {
    const base = createTheme({ name: "base" });
    const override = mergeTheme(base, { colors: { bg: "#000", ink: "#fff" } });
    expect(override.colors.accent1).toBe(DEFAULT_COLORS.accent1);
  });

  it("fonts kept from base", () => {
    const base = createTheme({ name: "base" });
    const override = mergeTheme(base, { colors: { bg: "#000", ink: "#fff" } });
    expect(override.fonts.display).toBe(DEFAULT_FONTS.display);
  });
});

describe("getColor", () => {
  it("get bg color", () => {
    expect(getColor(DEFAULT_COLORS, "bg")).toBe("#0a0e1a");
  });

  it("get ink color", () => {
    expect(getColor(DEFAULT_COLORS, "ink")).toBe("#f7f5ef");
  });

  it("get accent1 color", () => {
    expect(getColor(DEFAULT_COLORS, "accent1")).toBe("#e23b3b");
  });
});

describe("determinism", () => {
  it("same input produces identical colors", () => {
    const t1 = createTheme({ name: "test" });
    const t2 = createTheme({ name: "test" });
    expect(t1.colors).toEqual(t2.colors);
  });
});
