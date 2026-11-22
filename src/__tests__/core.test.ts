import { describe, expect, it } from "vitest";
import { kelvinToRgb, moonPhase } from "../lib/astro";
import { mergeStates, rankFor } from "../lib/store";
import { TRACKS, TOTAL_LESSONS } from "../data/tracks";
import { GLOSSARY } from "../data/glossary";
import { SIMS } from "../components/Sims";

describe("moon phase", () => {
  it("is new on a known new moon (2000-01-06)", () => {
    const m = moonPhase(new Date(Date.UTC(2000, 0, 6, 18, 14)));
    expect(m.illum).toBeLessThan(0.01);
    expect(m.name).toBe("New Moon");
  });
  it("is full about 14.8 days later", () => {
    const m = moonPhase(new Date(Date.UTC(2000, 0, 21, 12)));
    expect(m.illum).toBeGreaterThan(0.98);
    expect(m.name).toBe("Full Moon");
  });
});

describe("star colour", () => {
  it("makes cool stars red and hot stars blue", () => {
    expect(kelvinToRgb(3000)).toMatch(/^rgb\(255, /);
    expect(kelvinToRgb(30000)).toMatch(/, 255\)$/);
  });
});

describe("ranks", () => {
  it("starts at Cadet and reaches Astrophysicist", () => {
    expect(rankFor(0).name).toBe("Cadet");
    expect(rankFor(150).name).toBe("Navigator");
    expect(rankFor(99999).name).toBe("Astrophysicist");
    expect(rankFor(99999).next).toBeUndefined();
  });
});

describe("merging local and cloud progress", () => {
  it("never loses progress from either side", () => {
    const local = { xp: 300, completed: ["a/1"], sims: ["orbit"], checks: { "a/1": 0.5 } };
    const cloud = { xp: 200, completed: ["b/2"], sims: ["orbit", "wien"], checks: { "a/1": 1 } };
    const m = mergeStates(local, cloud);
    expect(m.xp).toBe(300);
    expect(m.completed.sort()).toEqual(["a/1", "b/2"]);
    expect(m.sims.sort()).toEqual(["orbit", "wien"]);
    expect(m.checks["a/1"]).toBe(1);
  });
});

describe("content integrity", () => {
  it("has unique ids and valid quiz answers", () => {
    expect(TOTAL_LESSONS).toBeGreaterThan(0);
    for (const t of TRACKS) {
      const ids = t.lessons.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const l of t.lessons) {
        expect(l.simple.length).toBeGreaterThan(0);
        expect(l.deep.length).toBeGreaterThan(0);
        if (l.sim) expect(SIMS[l.sim], `${t.id}/${l.id} sim`).toBeDefined();
        for (const c of l.check) expect(c.options[c.answer], `${t.id}/${l.id}: ${c.q}`).toBeDefined();
      }
    }
  });
  it("only links glossary terms to lessons that exist", () => {
    const keys = new Set(TRACKS.flatMap((t) => t.lessons.map((l) => `${t.id}/${l.id}`)));
    for (const g of GLOSSARY) if (g.link) expect(keys.has(g.link), g.term).toBe(true);
  });
});
