import { useState } from "react";
import { Link } from "react-router-dom";
import { Mascot } from "../components/Mascot";
import { HeroArt, Starfield } from "../components/Starfield";
import { SIMS, MoonIcon } from "../components/Sims";
import { GITHUB_URL, Rich, useTitle } from "../components/Layout";
import { TRACKS, TOTAL_LESSONS, TRACK_KEYS } from "../data/tracks";
import { GLOSSARY } from "../data/glossary";
import { moonPhase } from "../lib/astro";
import { useStore } from "../lib/store";

const DEMOS = [
  { id: "aerospace", label: "🚀 Rocket Science", q: "How does a heavy rocket push itself into space where there's no air to push against?", a: "Blow up a balloon and let it go without tying it. Air rushes out the back, the balloon zooms forward. Rockets do the exact same thing — just with super-fast hot gas!", f: "Newton's 3rd Law: F = ṁ · vₑ", sim: "thruster" },
  { id: "astrophysics", label: "🌌 Astrophysics", q: "Why are some stars blue and others red?", a: "Think of a stove ring: it glows red, then orange, then white as it heats up. Stars are the same — blue stars are the hottest, red stars the coolest!", f: "Wien's law: λ_max = b / T", sim: "wien" },
  { id: "astronomy", label: "🔭 Astronomy", q: "How do astronomers find planets around other stars?", a: "When a planet crosses its star, it blocks a tiny bit of light — like a moth in front of a streetlight. That little dip reveals a whole new world!", f: "Transit depth ≈ (R_planet / R_star)²", sim: "transit" },
  { id: "astrophotography", label: "📸 Astrophotography", q: "Why do my star photos come out streaky?", a: "Earth keeps spinning while your shutter is open! Divide 500 by your lens's focal length to find the longest exposure before stars smear.", f: "t_max = 500 / (focal length × crop)", sim: "rule500" },
];

export default function Home() {
  useTitle("");
  const [tab, setTab] = useState(0);
  const d = DEMOS[tab];
  const Sim = SIMS[d.sim].C;
  const completed = useStore((s) => s.completed);
  const profile = useStore((s) => s.profile);
  const moon = moonPhase(new Date());

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <Starfield />
        <HeroArt />
        <div className="container hero-content fade-in">
          <span className="badge">✦ Self-paced · Ages 10 to PhD · Free</span>
          <h1>
            Space science anyone can <span className="grad">actually understand.</span>
          </h1>
          <p className="lead">
            Astrophysics, astronomy, aerospace and astrophotography — one topic at a time or all together, guided by Lambda in the space cab.
          </p>
          <div className="row" style={{ marginTop: 28 }}>
            <Link to="/quiz" className="btn primary">{profile ? "Retake the diagnostic" : "Start learning — take the quiz"} →</Link>
            <a href="#demo" className="btn">Try a lesson</a>
            <Link to="/labs" className="btn">🛠 Open the labs</Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn">GitHub ↗</a>
          </div>
          <div className="stats">
            <div className="stat"><b>{TRACKS.length}</b><span>learning tracks</span></div>
            <div className="stat"><b>{TOTAL_LESSONS}</b><span>lessons, two levels each</span></div>
            <div className="stat"><b>{Object.keys(SIMS).length}</b><span>interactive simulators</span></div>
            <div className="stat"><b>{GLOSSARY.length}+</b><span>glossary terms</span></div>
          </div>
        </div>
      </section>

      {/* GUIDE */}
      <section className="section">
        <div className="container guide-row">
          <Mascot size={200} mood="wave" />
          <div>
            <span className="eyebrow">Your space cab guide</span>
            <div className="bubble">
              "Hey there! I'm Lambda! Hop into our space cab — whether you're in 5th grade or college, I'll help you master rockets, stars, telescopes and night-sky cameras step by step!"
            </div>
            <div className="row" style={{ marginTop: 18 }}>
              <span className="chip">🧒 5th-grade friendly mode</span>
              <span className="chip">🎓 Deep-dive mode for uni+</span>
              <span className="chip">⚡ XP, ranks & badges</span>
              <span className="chip">💬 Ask Lambda anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE LESSON */}
      <section className="section" id="demo">
        <div className="container">
          <span className="eyebrow">Live lesson</span>
          <h2>See how Lambda makes it simple.</h2>
          <div className="row" style={{ margin: "24px 0" }} role="tablist">
            {DEMOS.map((x, i) => (
              <button key={x.id} role="tab" aria-selected={i === tab} className={`chip ${i === tab ? "on" : ""}`} style={{ padding: "9px 16px" }} onClick={() => setTab(i)}>
                {x.label}
              </button>
            ))}
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <div className="card fade-in" key={`q${tab}`}>
              <h3 style={{ fontSize: "1.45rem" }}>{d.q}</h3>
              <div className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap", gap: 16, marginTop: 18 }}>
                <div style={{ flex: "none", width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", color: "var(--primary-fg)", display: "grid", placeItems: "center", fontWeight: 900 }}>λ</div>
                <div className="bubble sm">"{d.a}"</div>
              </div>
              <div className="formula" style={{ marginTop: 18 }}>{d.f}</div>
              <Link to={`/learn/${d.id}`} className="btn sm" style={{ marginTop: 18 }}>Open the full track →</Link>
            </div>
            <div className="card fade-in" key={`s${tab}`}>
              <div className="muted" style={{ fontSize: "0.85rem", marginBottom: 8 }}>{SIMS[d.sim].title}</div>
              <Sim />
            </div>
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">Four tracks · your pace</span>
          <h2>Pick one subject or combine them all.</h2>
          <p className="lead">Every lesson has a 5th-grade explanation and a deep-dive version with the real equations, plus quick checks and a simulator.</p>
          <div className="grid g4" style={{ marginTop: 32 }}>
            {TRACKS.map((t) => {
              const keys = TRACK_KEYS[t.id];
              const done = keys.filter((k) => completed.includes(k)).length;
              return (
                <Link key={t.id} to={`/learn/${t.id}`} className="card hover track-card">
                  <div className="spread">
                    <div className="icon" style={{ background: `color-mix(in oklch, ${t.color} 18%, transparent)` }}>{t.icon}</div>
                    <span className="num">{t.num}</span>
                  </div>
                  <h3>{t.title}</h3>
                  <p className="muted" style={{ fontSize: "0.93rem" }}>{t.blurb}</p>
                  <div className="muted" style={{ fontSize: "0.8rem" }}>{t.lessons.length} lessons · {done}/{keys.length} done</div>
                  <div className="progress"><i style={{ width: `${(done / keys.length) * 100}%` }} /></div>
                  <span className="explore">Explore →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">How it works</span>
          <h2>From launch pad to orbit in three steps.</h2>
          <div className="grid g3" style={{ marginTop: 32 }}>
            {[
              ["01", "Run the pre-flight diagnostic", "Three minutes, eight questions. Lambda finds your level and recommends where to begin."],
              ["02", "Learn at your level", "Flip any lesson between Simple and Deep dive. Same idea — explained for a 10-year-old or a physics major."],
              ["03", "Simulate, check & rank up", "Play with real physics in the labs, pass quick checks and climb from Cadet to Astrophysicist."],
            ].map(([n, h, p]) => (
              <div key={n} className="card">
                <span className="mono" style={{ color: "var(--primary)" }}>{n}</span>
                <h3 style={{ marginTop: 10 }}>{h}</h3>
                <p className="muted">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LABS + SKY */}
      <section className="section">
        <div className="container grid g2" style={{ gap: 24 }}>
          <div className="card">
            <span className="eyebrow">Simulator labs</span>
            <h3 style={{ fontSize: "1.6rem" }}>{Object.keys(SIMS).length} hands-on physics toys.</h3>
            <p className="muted">Fire Newton's cannon, plan a Hohmann transfer to Mars, size a black hole, or tune your camera for the Milky Way.</p>
            <div className="row" style={{ gap: 6, marginBottom: 18 }}>
              {Object.entries(SIMS).slice(0, 8).map(([id, s]) => (
                <Link key={id} to={`/labs#${id}`} className="chip">{s.title}</Link>
              ))}
            </div>
            <Link to="/labs" className="btn primary sm">Open the labs →</Link>
          </div>
          <div className="card row" style={{ flexWrap: "nowrap", gap: 24 }}>
            <MoonIcon frac={moon.frac} size={110} />
            <div>
              <span className="eyebrow">Sky tonight</span>
              <h3 style={{ fontSize: "1.6rem" }}>{moon.name}</h3>
              <p className="muted">{Math.round(moon.illum * 100)}% illuminated. {moon.illum < 0.3 ? "Great night for faint galaxies and the Milky Way!" : moon.illum > 0.8 ? "Bright moonlight — perfect for lunar photos and planets." : "Good for the Moon's craters along the terminator."}</p>
              <Link to="/sky" className="btn sm">See meteor showers & tips →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="section">
        <div className="container" style={{ maxWidth: 900, textAlign: "center" }}>
          <span className="eyebrow">Founder's vision</span>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, lineHeight: 1.3 }}>
            <Rich text={'"My dream is to make astrophysics, cosmology, rocket science and astrophotography so clear and inspiring that **a 5th grader can understand physics and rockets.**"'} />
          </p>
          <p className="muted">ProInnoTech · Founder of Lambda Learn, open space-science curriculum</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "radial-gradient(ellipse at 50% 100%, oklch(88% 0.14 92 / 0.12), transparent 60%)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <Mascot size={120} mood="cheer" />
          <h2 style={{ marginTop: 16 }}>Find your rank in 3 minutes.</h2>
          <p className="lead" style={{ margin: "0 auto 24px" }}>No signup needed to start. Your progress saves on this device.</p>
          <Link to="/quiz" className="btn primary">Take the pre-flight diagnostic →</Link>
        </div>
      </section>
    </>
  );
}
