import { Link } from "react-router-dom";
import { Mascot } from "../components/Mascot";
import { useTitle } from "../components/Layout";
import { GAMES } from "../components/Games";
import { TRACKS, isBasics, lessonKey, type Lesson, type Track } from "../data/tracks";
import { setLevel, useStore } from "../lib/store";

/** Recommended Launch Pad order: mixes tracks so each idea builds on the last. */
const ORDER = [
  "astronomy/what-is-space",
  "astronomy/day-and-night",
  "astrophysics/what-is-gravity",
  "astronomy/meet-the-planets",
  "astrophysics/what-is-light",
  "astrophysics/what-is-a-star",
  "astronomy/star-pictures",
  "aerospace/how-things-fly",
  "aerospace/what-is-a-rocket",
  "astrophotography/how-cameras-work",
  "astrophotography/first-phone-photo",
  "astrophotography/dark-skies",
];

type Item = { t: Track; l: Lesson; key: string };
const all: Item[] = TRACKS.flatMap((t) => t.lessons.map((l) => ({ t, l, key: lessonKey(t.id, l.id) })));
const launchPad = ORDER.map((k) => all.find((x) => x.key === k)).filter((x): x is Item => !!x);
// any basics not listed above still show up
for (const x of all) if (isBasics(x.l) && !launchPad.includes(x)) launchPad.push(x);
const orbit = all.filter((x) => !isBasics(x.l));

function Row({ item, n, done, next }: { item: Item; n: number; done: boolean; next: boolean }) {
  return (
    <Link
      to={`/learn/${item.t.id}/${item.l.id}`}
      className="row"
      style={{ flexWrap: "nowrap", padding: "12px 14px", borderRadius: 12, background: next ? "oklch(88% 0.14 92 / 0.1)" : "var(--card)", border: `1px solid ${next ? "oklch(88% 0.14 92 / 0.5)" : "var(--border)"}` }}
    >
      <span className={`dot ${done ? "done" : ""}`} style={{ width: 28, height: 28, fontSize: "0.85rem" }}>{done ? "✓" : n}</span>
      <span style={{ fontSize: "1.3rem" }}>{item.t.icon}</span>
      <span style={{ flex: 1 }}>
        <b>{item.l.title}</b>
        <span className="muted" style={{ display: "block", fontSize: "0.85rem" }}>{item.l.summary}</span>
      </span>
      {next && <span className="tag basics">Next up →</span>}
      <span className="muted" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>{item.l.minutes} min</span>
    </Link>
  );
}

export default function Start() {
  useTitle("Start here");
  const completed = useStore((s) => s.completed);
  const games = useStore((s) => s.games);
  const lpDone = launchPad.filter((x) => completed.includes(x.key)).length;
  const nextLp = launchPad.find((x) => !completed.includes(x.key));
  const orbitDone = orbit.filter((x) => completed.includes(x.key)).length;
  const nextOrbit = orbit.find((x) => !completed.includes(x.key));
  const lpComplete = lpDone === launchPad.length;
  const nextUp = nextLp ?? nextOrbit;

  return (
    <div className="container" style={{ maxWidth: 960, paddingBottom: 80 }}>
      <div className="page-head guide-row" style={{ gridTemplateColumns: "170px 1fr" }}>
        <Mascot size={160} mood="wave" />
        <div>
          <span className="eyebrow">Start here · your learning path</span>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>Learn space, one step at a time.</h1>
          <p className="lead">
            Everyone starts on the <b style={{ color: "var(--primary)" }}>Launch Pad</b> — short, friendly lessons written for 5th graders. Then you blast off to bigger ideas. Go at your own speed!
          </p>
          {nextUp && (
            <Link to={`/learn/${nextUp.t.id}/${nextUp.l.id}`} className="btn primary" style={{ marginTop: 8 }}>
              {completed.length ? "Keep going" : "Start lesson 1"}: {nextUp.l.title} →
            </Link>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <div className="grid g3" style={{ gap: 16 }}>
          {[
            ["🛝", "Launch Pad", "Ages 10+. Big pictures, short sentences, read-aloud, games."],
            ["🛰️", "Orbit", "Middle & high school. Real formulas explained simply, plus simulators."],
            ["🌌", "Deep Space", "University level. Flip any lesson to 🎓 Deep dive for the full maths."],
          ].map(([e, h, p]) => (
            <div key={h}>
              <div style={{ fontSize: "1.8rem" }}>{e}</div>
              <b>{h}</b>
              <p className="muted" style={{ fontSize: "0.9rem", margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stage 1 */}
      <section className="stage" style={{ paddingBottom: 36 }}>
        <span className="eyebrow">Stage 1 · 🛝 Launch Pad</span>
        <div className="spread">
          <h2 style={{ fontSize: "1.8rem", margin: 0 }}>The basics</h2>
          <span className="muted">{lpDone} of {launchPad.length} done</span>
        </div>
        <div className="progress" style={{ margin: "12px 0 18px" }}><i style={{ width: `${(lpDone / launchPad.length) * 100}%` }} /></div>
        <div className="grid" style={{ gap: 8 }}>
          {launchPad.map((x, i) => (
            <Row key={x.key} item={x} n={i + 1} done={completed.includes(x.key)} next={x === nextLp} />
          ))}
        </div>
        <div className="card" style={{ marginTop: 18 }}>
          <div className="spread">
            <div>
              <b>🎮 Space games</b>
              <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>Practise what you learned. {games.length}/{Object.keys(GAMES).length} won.</p>
            </div>
            <Link to="/play" className="btn sm">Play →</Link>
          </div>
        </div>
      </section>

      {/* Stage 2 */}
      <section className="stage" style={{ paddingBottom: 36 }}>
        <span className="eyebrow">Stage 2 · 🛰️ Orbit</span>
        <div className="spread">
          <h2 style={{ fontSize: "1.8rem", margin: 0 }}>Bigger ideas</h2>
          <span className="muted">{orbitDone} of {orbit.length} done</span>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          {lpComplete ? "You finished the Launch Pad — amazing! Pick any track below." : "Finish the Launch Pad first if you're new — but you can jump in any time you feel ready."}
        </p>
        <div className="grid g2" style={{ gap: 12 }}>
          {TRACKS.map((t) => {
            const items = orbit.filter((x) => x.t.id === t.id);
            const d = items.filter((x) => completed.includes(x.key)).length;
            const nx = items.find((x) => !completed.includes(x.key)) ?? items[0];
            return (
              <Link key={t.id} to={`/learn/${t.id}/${nx.l.id}`} className="card hover">
                <div className="spread"><span style={{ fontSize: "1.6rem" }}>{t.icon}</span><span className="muted" style={{ fontSize: "0.85rem" }}>{d}/{items.length}</span></div>
                <b>{t.title}</b>
                <p className="muted" style={{ fontSize: "0.88rem", margin: "6px 0 10px" }}>Next: {nx.l.title}</p>
                <div className="progress"><i style={{ width: `${(d / items.length) * 100}%` }} /></div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stage 3 */}
      <section className="stage">
        <span className="eyebrow">Stage 3 · 🌌 Deep Space</span>
        <h2 style={{ fontSize: "1.8rem" }}>The real maths</h2>
        <p className="muted">Ready for university-level detail? Switch every lesson to Deep dive mode — the same lessons, with the equations scientists use.</p>
        <div className="row">
          <button className="btn" onClick={() => setLevel("deep")}>🎓 Turn on Deep dive everywhere</button>
          <Link to="/labs" className="btn ghost">Open the simulator labs →</Link>
        </div>
      </section>
    </div>
  );
}

export function Play() {
  useTitle("Space games");
  const games = useStore((s) => s.games);
  return (
    <div className="container" style={{ maxWidth: 960, paddingBottom: 80 }}>
      <div className="page-head">
        <span className="eyebrow">🎮 Space games</span>
        <h1>Play and learn.</h1>
        <p className="lead">Win a game for the first time to earn 25 XP. Win all three for the Space Gamer badge!</p>
      </div>
      <div className="grid" style={{ gap: 24 }}>
        {Object.entries(GAMES).map(([id, g]) => (
          <section key={id} id={id} className="card" style={{ scrollMarginTop: 90 }}>
            <div className="spread" style={{ marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: "1.4rem", margin: 0 }}>{g.emoji} {g.title} {games.includes(id) && <span style={{ color: "var(--green)", fontSize: "0.9rem" }}>✓ won</span>}</h3>
                <p className="muted" style={{ margin: 0 }}>{g.blurb}</p>
              </div>
            </div>
            <g.C />
          </section>
        ))}
      </div>
    </div>
  );
}
