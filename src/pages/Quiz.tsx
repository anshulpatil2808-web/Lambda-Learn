import { useState } from "react";
import { Link } from "react-router-dom";
import { Mascot, type Mood } from "../components/Mascot";
import { useTitle } from "../components/Layout";
import { TRACKS, trackById } from "../data/tracks";
import { getState, rankFor, saveDiagnostic, saveProfile, setLevel, useStore, type AgeGroup } from "../lib/store";

const QS = [
  { track: "aerospace", q: "What pushes a rocket forward in space?", o: ["Air behind it", "Its exhaust being thrown backward", "Solar wind", "Magnetism"], a: 1 },
  { track: "aerospace", q: "Roughly how fast must you go to orbit Earth?", o: ["0.8 km/s", "7.8 km/s", "78 km/s", "The speed of light"], a: 1 },
  { track: "astrophysics", q: "What powers the Sun?", o: ["Burning gas", "Nuclear fusion", "Lightning", "Gravity alone"], a: 1 },
  { track: "astrophysics", q: "A blue star compared with a red star is…", o: ["Cooler", "Hotter", "Closer", "Younger"], a: 1 },
  { track: "astronomy", q: "What causes the phases of the Moon?", o: ["Earth's shadow", "Our view of its sunlit half changing", "Clouds", "The Moon spinning"], a: 1 },
  { track: "astronomy", q: "Doubling a telescope's aperture collects how much more light?", o: ["2×", "4×", "8×", "The same"], a: 1 },
  { track: "astrophotography", q: "Which camera aperture lets in the most light?", o: ["f/16", "f/8", "f/4", "f/1.8"], a: 3 },
  { track: "astrophotography", q: "Rule of 500 with a 25 mm lens on full-frame gives a max exposure of…", o: ["5 s", "20 s", "50 s", "125 s"], a: 1 },
];

const AGES: { id: AgeGroup; label: string; sub: string }[] = [
  { id: "kid", label: "Ages 10–13", sub: "Middle school explorer" },
  { id: "teen", label: "Ages 14–18", sub: "High school" },
  { id: "uni", label: "University", sub: "Studying STEM" },
  { id: "adult", label: "Lifelong learner", sub: "Hobbyist or professional" },
];

export default function Quiz() {
  useTitle("Pre-flight diagnostic");
  const existing = useStore((s) => s.profile);
  const [step, setStep] = useState(0); // 0 name, 1 age, 2 interests, 3..3+QS-1 questions, then result
  const [name, setName] = useState(existing?.name ?? "");
  const [age, setAge] = useState<AgeGroup | null>(existing?.ageGroup ?? null);
  const [interests, setInterests] = useState<string[]>(existing?.interests ?? []);
  const [answers, setAnswers] = useState<(number | null)[]>(QS.map(() => null));
  const [reveal, setReveal] = useState(false);
  const [result, setResult] = useState<{ score: number; rec: string; xp: number } | null>(null);

  const total = 3 + QS.length;
  const qi = step - 3;
  const xpLive = answers.filter((a, i) => a === QS[i].a && i < qi + (reveal ? 1 : 0)).length * 20;

  const lines: [string, Mood][] = [
    ["Welcome aboard the space cab! Before launch, tell me a bit about you.", "wave"],
    [`Nice to meet you, ${name || "cadet"}! How would you describe yourself?`, "happy"],
    ["Which destinations sound exciting? Pick as many as you like.", "think"],
  ];
  const line: [string, Mood] = step < 3 ? lines[step] : result ? [`Mission diagnostic complete, ${name}!`, "cheer"] : reveal ? (answers[qi] === QS[qi].a ? ["Spot on! +20 XP ⚡", "cheer"] : ["Close! Every astronaut learns by trying. Here's the answer.", "think"]) : [`Question ${qi + 1} of ${QS.length}. No pressure — this just finds your launch pad.`, "happy"];

  const finish = () => {
    const score = answers.filter((a, i) => a === QS[i].a).length;
    // recommend: interested track with lowest score, else lowest-scoring track
    const per: Record<string, number> = {};
    QS.forEach((q, i) => (per[q.track] = (per[q.track] ?? 0) + (answers[i] === q.a ? 1 : 0)));
    const pool = interests.length ? interests : TRACKS.map((t) => t.id);
    const rec = [...pool].sort((a, b) => (per[a] ?? 0) - (per[b] ?? 0))[0];
    const xp = score * 20 + 40;
    const prev = getState().profile;
    saveProfile({ name: name.trim() || "Cadet", email: prev?.email, ageGroup: age ?? "adult", interests, joinedAt: prev?.joinedAt ?? new Date().toISOString() });
    if (age === "kid" || age === "teen") setLevel("simple");
    if (age === "uni" && score >= 6) setLevel("deep");
    saveDiagnostic(score, rec, xp);
    setResult({ score, rec, xp });
  };

  const next = () => {
    if (step >= 3 && !reveal) return setReveal(true);
    setReveal(false);
    if (step === total - 1) return finish();
    setStep(step + 1);
  };

  const canNext = step === 0 ? name.trim().length > 0 : step === 1 ? !!age : step === 2 ? true : answers[qi] !== null;
  const level = result ? (result.score >= 7 ? "Advanced orbit" : result.score >= 4 ? "Mid-altitude" : "Launch pad") : "";

  return (
    <div className="container" style={{ maxWidth: 880, paddingBottom: 80 }}>
      <div className="page-head">
        <span className="eyebrow">Pre-flight diagnostic</span>
        <h1 style={{ textTransform: "uppercase" }}>Let's find your launch pad.</h1>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <div className="spread">
          <div className="progress" style={{ flex: 1 }}><i style={{ width: `${((result ? total : step) / total) * 100}%` }} /></div>
          <span className="mono" style={{ fontSize: "0.85rem" }}>⚡ {result ? result.xp : xpLive} XP</span>
        </div>
      </div>
      <div className="guide-row" style={{ gridTemplateColumns: "140px 1fr", margin: "28px 0" }}>
        <Mascot size={130} mood={line[1]} />
        <div className="bubble">"{line[0]}"</div>
      </div>

      <div className="card fade-in" key={result ? "r" : step} style={{ padding: 28 }}>
        {result ? (
          <div>
            <span className="eyebrow">Your results</span>
            <h2>{level}: {result.score}/{QS.length} correct</h2>
            <p className="lead">You earned <b style={{ color: "var(--primary)" }}>{result.xp} XP</b> and the 🧪 Pre-flight badge. Current rank: <b>{rankFor(getState().xp).name}</b>.</p>
            <div className="callout"><b>Recommended first track:</b> {trackById(result.rec)?.icon} {trackById(result.rec)?.title}</div>
            <div className="row" style={{ marginTop: 20 }}>
              {result.score < 6 || age === "kid" ? (
                <>
                  <Link to="/start" className="btn primary">🛝 Start on the Launch Pad →</Link>
                  <Link to={`/learn/${result.rec}`} className="btn">Or jump to {trackById(result.rec)?.short}</Link>
                </>
              ) : (
                <Link to={`/learn/${result.rec}`} className="btn primary">Start {trackById(result.rec)?.short} →</Link>
              )}
              <Link to="/profile" className="btn">View profile</Link>
              <button className="btn ghost" onClick={() => { setStep(0); setAnswers(QS.map(() => null)); setResult(null); }}>Retake</button>
            </div>
          </div>
        ) : step === 0 ? (
          <form onSubmit={(e) => { e.preventDefault(); if (canNext) next(); }}>
            <span className="eyebrow">Pre-flight 1 of {total}</span>
            <h3 style={{ fontSize: "1.5rem" }}>What should Lambda call you?</h3>
            <input className="field" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name or nickname" maxLength={40} aria-label="Your name" />
            <p className="muted" style={{ fontSize: "0.82rem", marginTop: 8 }}>Kids: please use a nickname, not your full name.</p>
            <button className="btn primary" style={{ marginTop: 12 }} disabled={!canNext} type="submit">Continue →</button>
          </form>
        ) : step === 1 ? (
          <div>
            <span className="eyebrow">Pre-flight 2 of {total}</span>
            <h3 style={{ fontSize: "1.5rem" }}>Which best describes you?</h3>
            <div className="grid g2" style={{ gap: 10 }}>
              {AGES.map((a) => (
                <button key={a.id} className={`option ${age === a.id ? "sel" : ""}`} onClick={() => setAge(a.id)}>
                  <span><b>{a.label}</b><br /><span className="muted" style={{ fontSize: "0.85rem" }}>{a.sub}</span></span>
                </button>
              ))}
            </div>
            <button className="btn primary" style={{ marginTop: 20 }} disabled={!canNext} onClick={next}>Continue →</button>
          </div>
        ) : step === 2 ? (
          <div>
            <span className="eyebrow">Pre-flight 3 of {total}</span>
            <h3 style={{ fontSize: "1.5rem" }}>What are you curious about?</h3>
            <div className="grid g2" style={{ gap: 10 }}>
              {TRACKS.map((t) => {
                const on = interests.includes(t.id);
                return (
                  <button key={t.id} className={`option ${on ? "sel" : ""}`} onClick={() => setInterests(on ? interests.filter((x) => x !== t.id) : [...interests, t.id])} aria-pressed={on}>
                    <span className="key">{t.icon}</span>
                    <span><b>{t.title}</b></span>
                  </button>
                );
              })}
            </div>
            <button className="btn primary" style={{ marginTop: 20 }} onClick={next}>{interests.length ? "Start the questions →" : "Skip — I'm curious about everything →"}</button>
          </div>
        ) : (
          <div>
            <span className="eyebrow">{trackById(QS[qi].track)?.icon} {trackById(QS[qi].track)?.short} · {step + 1} of {total}</span>
            <h3 style={{ fontSize: "1.5rem" }}>{QS[qi].q}</h3>
            <div className="grid" style={{ gap: 10 }}>
              {QS[qi].o.map((o, oi) => {
                const cls = reveal ? (oi === QS[qi].a ? "right" : answers[qi] === oi ? "wrong" : "") : answers[qi] === oi ? "sel" : "";
                return (
                  <button key={oi} className={`option ${cls}`} disabled={reveal} onClick={() => setAnswers(answers.map((a, k) => (k === qi ? oi : a)))}>
                    <span className="key">{"ABCD"[oi]}</span>
                    {o}
                  </button>
                );
              })}
            </div>
            <button className="btn primary" style={{ marginTop: 20 }} disabled={!canNext} onClick={next}>
              {reveal ? (step === total - 1 ? "See my results →" : "Next question →") : "Lock in answer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
