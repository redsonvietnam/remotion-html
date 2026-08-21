import { describe, it, expect } from "vitest";
import { mapAlign, mapJustify } from "../types";

describe("mapAlign", () => {
  it("start → flex-start", () => {
    expect(mapAlign("start")).toBe("flex-start");
  });

  it("center → center", () => {
    expect(mapAlign("center")).toBe("center");
  });

  it("end → flex-end", () => {
    expect(mapAlign("end")).toBe("flex-end");
  });

  it("stretch → stretch", () => {
    expect(mapAlign("stretch")).toBe("stretch");
  });
});

describe("mapJustify", () => {
  it("start → flex-start", () => {
    expect(mapJustify("start")).toBe("flex-start");
  });

  it("center → center", () => {
    expect(mapJustify("center")).toBe("center");
  });

  it("end → flex-end", () => {
    expect(mapJustify("end")).toBe("flex-end");
  });

  it("between → space-between", () => {
    expect(mapJustify("between")).toBe("space-between");
  });
});
