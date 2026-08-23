import { describe, it, expect } from "vitest";
import {
  NQ57_CONTENT,
  NQ57SceneContent,
  SCENES,
  FPS,
  sceneFrames,
} from "../../data/nq57";

describe("NQ57 content typing", () => {
  it("NQ57_CONTENT is a Record<string, NQ57SceneContent>", () => {
    expect(typeof NQ57_CONTENT).toBe("object");
    expect(NQ57_CONTENT).not.toBeNull();
  });

  it("has all 7 scene keys", () => {
    const keys = Object.keys(NQ57_CONTENT);
    expect(keys).toContain("s1");
    expect(keys).toContain("s2");
    expect(keys).toContain("s3");
    expect(keys).toContain("s4");
    expect(keys).toContain("s5");
    expect(keys).toContain("s6");
    expect(keys).toContain("s7");
    expect(keys.length).toBe(7);
  });

  it("each content has a kind discriminator", () => {
    for (const [key, content] of Object.entries(NQ57_CONTENT)) {
      expect(typeof (content as NQ57SceneContent).kind).toBe("string");
      expect(["title", "quote", "roles", "pillars", "stats", "vision", "end"]).toContain(
        (content as NQ57SceneContent).kind
      );
    }
  });

  it("s1 is title", () => {
    expect(NQ57_CONTENT.s1.kind).toBe("title");
  });

  it("s2 is quote", () => {
    expect(NQ57_CONTENT.s2.kind).toBe("quote");
  });

  it("s3 is roles", () => {
    expect(NQ57_CONTENT.s3.kind).toBe("roles");
  });

  it("s4 is pillars", () => {
    expect(NQ57_CONTENT.s4.kind).toBe("pillars");
  });

  it("s5 is stats", () => {
    expect(NQ57_CONTENT.s5.kind).toBe("stats");
  });

  it("s6 is vision", () => {
    expect(NQ57_CONTENT.s6.kind).toBe("vision");
  });

  it("s7 is end", () => {
    expect(NQ57_CONTENT.s7.kind).toBe("end");
  });
});

describe("NQ57 content — no presentation settings", () => {
  const disallowedKeys = ["color", "fontFamily", "fontSize", "backgroundColor", "opacity", "transform"];

  it("title content has no presentation keys", () => {
    for (const key of disallowedKeys) {
      expect(NQ57_CONTENT.s1).not.toHaveProperty(key);
    }
  });

  it("quote content has no presentation keys", () => {
    for (const key of disallowedKeys) {
      expect(NQ57_CONTENT.s2).not.toHaveProperty(key);
    }
  });

  it("roles content has no presentation keys", () => {
    for (const key of disallowedKeys) {
      expect(NQ57_CONTENT.s3).not.toHaveProperty(key);
    }
  });

  it("pillars content has no presentation keys", () => {
    for (const key of disallowedKeys) {
      expect(NQ57_CONTENT.s4).not.toHaveProperty(key);
    }
  });

  it("stats content has no presentation keys", () => {
    for (const key of disallowedKeys) {
      expect(NQ57_CONTENT.s5).not.toHaveProperty(key);
    }
  });

  it("vision content has no presentation keys", () => {
    for (const key of disallowedKeys) {
      expect(NQ57_CONTENT.s6).not.toHaveProperty(key);
    }
  });

  it("end content has no presentation keys", () => {
    for (const key of disallowedKeys) {
      expect(NQ57_CONTENT.s7).not.toHaveProperty(key);
    }
  });
});

describe("NQ57 scene definitions", () => {
  it("SCENES is an array of 7 items", () => {
    expect(Array.isArray(SCENES)).toBe(true);
    expect(SCENES.length).toBe(7);
  });

  it("each scene has id, audio, caption, dur", () => {
    for (const scene of SCENES) {
      expect(typeof scene.id).toBe("string");
      expect(typeof scene.audio).toBe("string");
      expect(typeof scene.caption).toBe("string");
      expect(typeof scene.dur).toBe("number");
      expect(scene.dur).toBeGreaterThan(0);
    }
  });

  it("scene IDs match NQ57_CONTENT keys", () => {
    for (const scene of SCENES) {
      expect(NQ57_CONTENT).toHaveProperty(scene.id);
    }
  });

  it("FPS is 30", () => {
    expect(FPS).toBe(30);
  });

  it("sceneFrames returns positive integer", () => {
    expect(sceneFrames(10)).toBeGreaterThan(0);
    expect(Number.isInteger(sceneFrames(10))).toBe(true);
  });
});
