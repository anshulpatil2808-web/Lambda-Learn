import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SIMS, MoonIcon } from "../components/Sims";
import { useTitle } from "../components/Layout";
import { LambdaSays } from "../components/Mascot";
import { TRACKS, trackById } from "../data/tracks";
import { GLOSSARY } from "../data/glossary";
import { moonPhase, nextPhase, upcomingShowers } from "../lib/astro";
import { useStore } from "../lib/store";

/* ---------------- Labs ---------------- */
export function Labs() {
  useTitle("Simulator labs");
  const [filter, setFilter] = useState("all");
  const used = useStore((s) => s.sims);
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [hash]);
  const list = Object.entries(SIMS).filter(([, s]) => filter === "all" || s.track === filter);
  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <span className="eyebrow">Simulator labs</span>
        <h1>Play with real physics.</h1>
        <p className="lead">Every slider runs the actual equations from the lessons. Trying a simulator for the first time earns +10 XP. You've tried {used.length} of {Object.keys(SIMS).length}.</p>
        <div className="row" style={{ marginTop: 18 }}>
          <button className={`chip ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>All</button>
          {TRACKS.map((t) => (
            <button key={t.id} className={`chip ${filter === t.id ? "on" : ""}`} onClick={() => setFilter(t.id)}>{t.icon} {t.short}</button>
          ))}
        </div>
      </div>
      <div className="grid" style={{ gap: 24 }}>
        {list.map(([id, s]) => {
          const t = trackById(s.track)!;
          const lesson = t.lessons.find((l) => l.sim === id);
          return (
            <section key={id} id={id} className="card" style={{ scrollMarginTop: 90 }}>
              <div className="spread" style={{ marginBottom: 16 }}>
                <div>
                  <span className="tag">{t.icon} {t.short}</span>
                  <h3 style={{ fontSize: "1.4rem", margin: "10px 0 4px" }}>{s.title} {used.includes(id) && <span style={{ color: "var(--green)", fontSize: "0.9rem" }}>✓</span>}</h3>
                  <p className="muted" style={{ margin: 0 }}>{s.blurb}</p>
                </div>
                {lesson && <Link to={`/learn/${t.id}/${lesson.id}`} className="btn sm">Lesson: {lesson.title} →</Link>}
              </div>
              <s.C />
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Sky tonight ---------------- */
const BORTLE = [
  [1, "Excellent dark site", "Zodiacal light, airglow; Milky Way casts shadows."],
  [2, "Typical dark site", "Milky Way highly structured; M33 easy naked-eye."],
  [3, "Rural sky", "Some light domes on horizon; Milky Way still complex."],
  [4, "Rural/suburban transition", "Milky Way visible but lacks detail near horizon."],
  [5, "Suburban sky", "Milky Way weak or invisible near horizon."],
  [6, "Bright suburban", "Milky Way only near zenith, if at all."],
  [7, "Suburban/urban transition", "Sky glows grey-orange; Milky Way invisible."],
  [8, "City sky", "Only bright constellations recognisable."],
  [9, "Inner city", "Only the Moon, planets and a few bright stars."],
];

export function Sky() {
  useTitle("Sky tonight");
  const now = new Date();
  const m = moonPhase(now);
  const nextNew = nextPhase(now, 0);
  const nextFull = nextPhase(now, 0.5);
  const showers = upcomingShowers(now);
  const days = Array.from({ length: 30 }, (_, i) => new Date(now.getTime() + i * 864e5));
  const df = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <span className="eyebrow">Sky tonight · {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
        <h1>What's up tonight?</h1>
      </div>
      <div className="grid g2" style={{ gap: 24 }}>
        <div className="card row" style={{ flexWrap: "nowrap", gap: 28 }}>
          <MoonIcon frac={m.frac} size={150} />
          <div>
            <h2 style={{ fontSize: "2rem" }}>{m.name}</h2>
            <p className="muted">{Math.round(m.illum * 100)}% illuminated · {m.age.toFixed(1)} days old</p>
            <p style={{ margin: 0 }}>🌑 New moon: <b>{df(nextNew)}</b><br />🌕 Full moon: <b>{df(nextFull)}</b></p>
          </div>
        </div>
        <div className="card">
          <LambdaSays mood={m.illum < 0.3 ? "cheer" : "think"}>
            {m.illum < 0.3
              ? "Dark skies ahead! Perfect for the Milky Way, galaxies and nebulae. Get away from city lights and give your eyes 30 minutes to adapt."
              : m.illum > 0.8
                ? "The Moon's very bright tonight — skip faint galaxies, but it's a great time for photographing the Moon itself or spotting bright planets."
                : "Try a telescope or zoom lens along the terminator — the line between light and dark — where crater shadows look the most dramatic."}
          </LambdaSays>
        </div>
      </div>

      <section style={{ marginTop: 40 }}>
        <h3>Next 30 nights</h3>
        <div className="scroll-x">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(30, 52px)", gap: 6, paddingBottom: 6 }}>
            {days.map((d) => {
              const p = moonPhase(d);
              return (
                <div key={d.toISOString()} style={{ textAlign: "center", padding: "8px 2px", borderRadius: 10, background: p.illum < 0.25 ? "oklch(78% 0.15 150 / 0.08)" : "var(--card)", border: "1px solid var(--border)" }} title={`${df(d)}: ${p.name}, ${Math.round(p.illum * 100)}%`}>
                  <MoonIcon frac={p.frac} size={34} />
                  <div className="mono" style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{d.getDate()}</div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="muted" style={{ fontSize: "0.85rem" }}>Green-tinted nights have less than 25% moonlight — best for deep-sky photography.</p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h3>Upcoming meteor showers</h3>
        <div className="card scroll-x" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr><th>Shower</th><th>Peak (approx.)</th><th>Rate / hr*</th><th>Radiant</th><th>Moon</th><th>Outlook</th></tr>
            </thead>
            <tbody>
              {showers.map((s) => (
                <tr key={s.name}>
                  <td><b>{s.name}</b><div className="muted" style={{ fontSize: "0.8rem" }}>{s.note}</div></td>
                  <td>{s.date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td>~{s.zhr}</td>
                  <td>{s.radiant}</td>
                  <td>{Math.round(s.moon.illum * 100)}%</td>
                  <td className={s.rating === "Great" ? "status-ok" : s.rating === "Fair" ? "" : "status-warn"}>{s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted" style={{ fontSize: "0.82rem", marginTop: 8 }}>*Zenithal hourly rate under ideal dark skies; real counts are usually lower. Peak dates can shift by a day year to year.</p>
      </section>

      <section style={{ marginTop: 40 }} className="grid g2">
        <div className="card">
          <h3>Your observing checklist</h3>
          <ul className="prose" style={{ margin: 0 }}>
            <li>Check the forecast for clear skies and low humidity</li>
            <li>Look up your site on a light-pollution map (aim for Bortle 4 or lower)</li>
            <li>Red headlamp, warm layers, snacks, spare batteries</li>
            <li>Tripod, camera, wide fast lens, remote shutter</li>
            <li>Allow 30 minutes for dark adaptation — no white screens!</li>
            <li>Tell someone where you're going</li>
          </ul>
        </div>
        <div className="card scroll-x" style={{ padding: 0 }}>
          <table className="table">
            <thead><tr><th>Bortle</th><th>Sky</th><th>What you'll see</th></tr></thead>
            <tbody>
              {BORTLE.map(([n, a, b]) => (
                <tr key={n}><td className="mono">{n}</td><td><b>{a}</b></td><td className="muted">{b}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: 40 }}>
        <span className="eyebrow">Mark your calendar</span>
        <h3>Total solar eclipse · 2 August 2027</h3>
        <p className="muted" style={{ margin: 0 }}>The path of totality crosses southern Spain, Gibraltar, North Africa, Egypt and Saudi Arabia, with up to about 6 minutes 23 seconds of totality near Luxor. Never look at the Sun without certified eclipse glasses (ISO 12312-2) except during totality itself.</p>
      </section>
    </div>
  );
}

/* ---------------- Glossary ---------------- */
export function Glossary() {
  useTitle("Glossary");
  const [q, setQ] = useState("");
  const [track, setTrack] = useState("all");
  const list = useMemo(() => {
    const s = q.toLowerCase();
    return [...GLOSSARY]
      .filter((g) => (track === "all" || g.track === track) && (g.term.toLowerCase().includes(s) || g.def.toLowerCase().includes(s)))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [q, track]);
  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <span className="eyebrow">Glossary</span>
        <h1>Space words, decoded.</h1>
        <p className="lead">{GLOSSARY.length} terms explained in plain language, each linked to the lesson that covers it.</p>
        <input className="field" style={{ maxWidth: 520, marginTop: 12 }} placeholder="Search: delta-v, nebula, ISO…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search glossary" />
        <div className="row" style={{ marginTop: 14 }}>
          <button className={`chip ${track === "all" ? "on" : ""}`} onClick={() => setTrack("all")}>All</button>
          {TRACKS.map((t) => (
            <button key={t.id} className={`chip ${track === t.id ? "on" : ""}`} onClick={() => setTrack(t.id)}>{t.icon} {t.short}</button>
          ))}
        </div>
      </div>
      <div className="grid g3">
        {list.map((g) => (
          <div key={g.term} className="card">
            <div className="spread"><h3 style={{ margin: 0 }}>{g.term}</h3><span>{trackById(g.track)?.icon}</span></div>
            <p className="muted" style={{ margin: "10px 0" }}>{g.def}</p>
            {g.link && <Link to={`/learn/${g.link}`} style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem" }}>Lesson →</Link>}
          </div>
        ))}
        {!list.length && <p className="muted">No matches. Try asking Lambda in the corner!</p>}
      </div>
    </div>
  );
}
