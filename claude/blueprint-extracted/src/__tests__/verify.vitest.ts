import { describe, it, expect } from "vitest";
import {
  EXPECTED_PRODUCTIONS,
  ROUTING_CONTRACT,
  loadManifest,
  checkManifestCompleteness,
  parseRoutedComposition,
} from "../../scripts/verify.mjs";

describe("verify.mjs — manifest completeness", () => {
  it("baseline manifest contains all expected productions", () => {
    const manifest = loadManifest();
    const { ids, missing } = checkManifestCompleteness(manifest);
    expect(missing).toEqual([]);
    for (const id of EXPECTED_PRODUCTIONS) expect(ids).toContain(id);
  });

  it("flags a missing expected production", () => {
    const manifest = { productions: { nq57: {}, dean06: {} } };
    const { missing } = checkManifestCompleteness(manifest);
    expect(missing).toContain("canCuoc");
  });
});

describe("verify.mjs — routing parse", () => {
  it("parses the resolved composition from produce --route-only output", () => {
    const out =
      "  PRODUCE: NghiQuyet79  (template: nq79)\n  Comp  : NghiQuyet79  (1920x1080)\n";
    expect(parseRoutedComposition(out)).toBe("NghiQuyet79");
  });

  it("returns null when no composition is resolved", () => {
    expect(parseRoutedComposition("NO_MATCH:\n  no template matched")).toBeNull();
  });
});

describe("verify.mjs — routing contract coverage", () => {
  it("every expected production's composition is covered by a routing assertion", () => {
    const manifest = loadManifest();
    const routed = new Set(ROUTING_CONTRACT.map((r) => r.expect));
    for (const id of EXPECTED_PRODUCTIONS) {
      const comp = (manifest.productions[id] as { composition?: string })?.composition;
      expect(comp, `manifest entry ${id} should declare a composition`).toBeTruthy();
      expect(routed.has(comp as string), `${id} -> ${comp} not covered by routing`).toBe(true);
    }
  });
});
