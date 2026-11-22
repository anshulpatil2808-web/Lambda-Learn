import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { winGame } from "../lib/store";
import { MoonIcon } from "./Sims";
import { LambdaSays, type Mood } from "./Mascot";

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  // never start already solved
  return b.every((x, i) => x === a[i]) ? shuffle(a) : b;
}

/** Generic "tap the items in the right order" game. */
function OrderGame<T extends { id: string }>({
  gameId,
  items,
  render,
  intro,
  hint,
  winText,
}: {
  gameId: string;
  items: T[];
  render: (item: T) => ReactNode;
  intro: string;
  hint: (next: T) => string;
  winText: string;
}) {
  const [round, setRound] = useState(0);
  const pool = useMemo(() => shuffle(items), [items, round]);
  const [picked, setPicked] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);
  const [msg, setMsg] = useState<[string, Mood]>([intro, "happy"]);
  const done = picked.length === items.length;

  const tap = (it: T) => {
    if (done || picked.includes(it.id)) return;
    const next = items[picked.length];
    if (it.id === next.id) {
      const np = [...picked, it.id];
      setPicked(np);
      if (np.length === items.length) {
        const first = winGame(gameId);
        setMsg([`${winText} ${first ? "You earned 25 XP!" : "You did it again!"}`, "cheer"]);
      } else setMsg(["Yes! What comes next?", "happy"]);
    } else {
      setShake(it.id);
      setTimeout(() => setShake(null), 400);
      setMsg([`Not quite! Hint: ${hint(next)}`, "think"]);
    }
  };
  const reset = () => {
    setPicked([]);
    setRound(round + 1);
    setMsg([intro, "happy"]);
  };

  return (
    <div>
      <LambdaSays mood={msg[1]} size={64}>{msg[0]}</LambdaSays>
      <div className="row" style={{ margin: "18px 0", minHeight: 48 }} aria-live="polite">
        {picked.map((id, i) => {
          const it = items.find((x) => x.id === id)!;
          return (
            <span key={id} className="chip on" style={{ padding: "6px 12px" }}>
              {i + 1}. {render(it)}
            </span>
          );
        })}
        {!picked.length && <span className="muted">Your answer appears here, in order.</span>}
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
        {pool.map((it) => {
          const used = picked.includes(it.id);
          return (
            <button
              key={it.id}
              className={`option game-tile ${shake === it.id ? "wrong shake" : ""}`}
              disabled={used || done}
              style={{ justifyContent: "center", flexDirection: "column", opacity: used ? 0.3 : 1, minHeight: 96, fontSize: "1.05rem", fontWeight: 700 }}
              onClick={() => tap(it)}
            >
              {render(it)}
            </button>
          );
        })}
      </div>
      {done && (
        <button className="btn primary" style={{ marginTop: 18 }} onClick={reset}>
          🔁 Play again
        </button>
      )}
    </div>
  );
}

/* ---------- 1. Planet order ---------- */
const PLANETS = [
  { id: "Mercury", c: "#a39b8f", r: 10, tip: "the smallest, closest planet — it's first!" },
  { id: "Venus", c: "#e3c27a", r: 16, tip: "the hottest planet, second from the Sun." },
  { id: "Earth", c: "#3d8fd6", r: 16, tip: "our home is third." },
  { id: "Mars", c: "#d0603a", r: 12, tip: "the red planet is fourth." },
  { id: "Jupiter", c: "#d9a66e", r: 28, tip: "the biggest planet comes after Mars." },
  { id: "Saturn", c: "#e7cf8f", r: 24, tip: "the one with beautiful rings." },
  { id: "Uranus", c: "#8fd8e0", r: 19, tip: "the tilted ice giant is seventh." },
  { id: "Neptune", c: "#4a6fe3", r: 19, tip: "the windy blue giant is last." },
];
export function PlanetGame() {
  return (
    <OrderGame
      gameId="planets"
      items={PLANETS}
      intro="Tap the planets in order, starting with the one closest to the Sun. Remember: My Very Educated Mother Just Served Us Nachos!"
      hint={(n) => `look for ${n.tip}`}
      winText="Perfect planet parade!"
      render={(p) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexDirection: "inherit" }}>
          <svg width={p.r * 2 + 16} height={p.r * 2 + 4} viewBox={`${-p.r - 8} ${-p.r - 2} ${p.r * 2 + 16} ${p.r * 2 + 4}`} aria-hidden="true">
            {p.id === "Saturn" && <ellipse rx={p.r + 7} ry={p.r * 0.3} fill="none" stroke="#f3d6a4" strokeWidth="3" />}
            <circle r={p.r} fill={p.c} />
          </svg>
          {p.id}
        </span>
      )}
    />
  );
}

/* ---------- 2. Moon phase order ---------- */
const PHASES = [
  { id: "New Moon", f: 0.0, tip: "start with the dark New Moon." },
  { id: "Waxing Crescent", f: 0.125, tip: "a thin sliver lit on the right." },
  { id: "First Quarter", f: 0.25, tip: "half lit — the right half." },
  { id: "Waxing Gibbous", f: 0.375, tip: "almost full, still growing." },
  { id: "Full Moon", f: 0.5, tip: "the whole face is lit." },
  { id: "Waning Gibbous", f: 0.625, tip: "almost full, now shrinking." },
  { id: "Last Quarter", f: 0.75, tip: "half lit — the left half." },
  { id: "Waning Crescent", f: 0.875, tip: "a thin sliver lit on the left." },
];
export function MoonGame() {
  return (
    <OrderGame
      gameId="moon"
      items={PHASES}
      intro="Put the Moon's phases in order, starting with the New Moon. The lit part grows (waxes), then shrinks (wanes)!"
      hint={(n) => n.tip}
      winText="You know the Moon's whole month!"
      render={(p) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexDirection: "inherit", fontSize: "0.9rem" }}>
          <MoonIcon frac={p.f === 0 ? 0.01 : p.f} size={46} />
          {p.id}
        </span>
      )}
    />
  );
}

/* ---------- 3. True or false ---------- */
const TF: { s: string; a: boolean; why: string }[] = [
  { s: "The Sun is a star.", a: true, why: "It's our closest star!" },
  { s: "The Moon makes its own light.", a: false, why: "It reflects sunlight, like a mirror." },
  { s: "There is no air in space.", a: true, why: "That's why astronauts wear spacesuits." },
  { s: "Jupiter is the biggest planet.", a: true, why: "More than 1,300 Earths could fit inside." },
  { s: "Stars twinkle because they blink on and off.", a: false, why: "Moving air above us makes their light wobble." },
  { s: "Rockets need air to push against.", a: false, why: "They push out hot gas — no air needed." },
  { s: "Day and night happen because Earth spins.", a: true, why: "One spin takes about 24 hours." },
  { s: "Blue stars are colder than red stars.", a: false, why: "Blue stars are the hottest!" },
  { s: "You should never look straight at the Sun.", a: true, why: "It can hurt your eyes — even with sunglasses." },
  { s: "A light-year measures time.", a: false, why: "It's a distance: how far light goes in a year." },
  { s: "Saturn is the only planet with rings.", a: false, why: "Jupiter, Uranus and Neptune have faint rings too." },
  { s: "Gravity keeps the Moon going around Earth.", a: true, why: "Earth's pull holds it in orbit." },
];
export function TrueFalseGame() {
  const [deck, setDeck] = useState(() => shuffle(TF).slice(0, 8));
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [last, setLast] = useState<boolean | null>(null);
  const [pick, setPick] = useState<boolean | null>(null);
  const card = deck[i];
  const finished = i >= deck.length;
  const answer = (v: boolean) => {
    if (last !== null) return;
    const ok = v === card.a;
    setPick(v);
    setLast(ok);
    if (ok) setScore(score + 1);
  };
  const next = () => {
    const ni = i + 1;
    setI(ni);
    setLast(null);
    if (ni >= deck.length && score >= 6) winGame("truefalse");
  };
  const restart = () => {
    setDeck(shuffle(TF).slice(0, 8));
    setI(0);
    setScore(0);
    setLast(null);
  };
  if (finished) {
    const great = score >= 6;
    return (
      <div>
        <LambdaSays mood={great ? "cheer" : "think"} size={64}>
          {great ? `Wow, ${score} out of ${deck.length}! You're a space expert!` : `${score} out of ${deck.length}. Get 6 or more to win — try again!`}
        </LambdaSays>
        <button className="btn primary" style={{ marginTop: 18 }} onClick={restart}>🔁 Play again</button>
      </div>
    );
  }
  return (
    <div>
      <div className="spread"><span className="muted">Question {i + 1} of {deck.length}</span><span className="mono">⭐ {score}</span></div>
      <div className="card" style={{ margin: "14px 0", textAlign: "center", fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-display)", padding: "32px 20px" }}>
        {card.s}
      </div>
      <div className="grid g2" style={{ gap: 10 }}>
        <button className={`option ${last !== null ? (card.a ? "right" : pick === true ? "wrong" : "") : ""}`} style={{ justifyContent: "center", fontSize: "1.2rem", fontWeight: 800, minHeight: 64 }} disabled={last !== null} onClick={() => answer(true)}>👍 TRUE</button>
        <button className={`option ${last !== null ? (!card.a ? "right" : pick === false ? "wrong" : "") : ""}`} style={{ justifyContent: "center", fontSize: "1.2rem", fontWeight: 800, minHeight: 64 }} disabled={last !== null} onClick={() => answer(false)}>👎 FALSE</button>
      </div>
      {last !== null && (
        <div style={{ marginTop: 16 }}>
          <LambdaSays mood={last ? "cheer" : "think"} size={56}>
            {last ? "Correct! " : "Oops! "}
            {card.why}
          </LambdaSays>
          <button className="btn primary" style={{ marginTop: 12 }} onClick={next}>{i + 1 === deck.length ? "See my score →" : "Next →"}</button>
        </div>
      )}
    </div>
  );
}

export const GAMES: Record<string, { title: string; emoji: string; blurb: string; C: ComponentType }> = {
  planets: { title: "Planet Parade", emoji: "🪐", blurb: "Put the eight planets in order from the Sun.", C: PlanetGame },
  moon: { title: "Moon Month", emoji: "🌙", blurb: "Line up the Moon's phases from New to Full and back.", C: MoonGame },
  truefalse: { title: "Space True or False", emoji: "✅", blurb: "Eight quick questions — get 6 right to win.", C: TrueFalseGame },
};
