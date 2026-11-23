import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TRACKS, TRACK_KEYS, isBasics, lessonKey, trackById, type Check } from "../data/tracks";
import { completeLesson, recordCheck, setLevel, useStore } from "../lib/store";
import { SIMS } from "../components/Sims";
import { GAMES } from "../components/Games";
import { Picture } from "../components/Pictures";
import { LambdaSays, Mascot } from "../components/Mascot";
import { Rich, useTitle } from "../components/Layout";
import NotFound from "./NotFound";

export function LearnIndex() {
  useTitle("Learn");
  const completed = useStore((s) => s.completed);
  const diag = useStore((s) => s.diagnostic);
  return (
    <div className="container">
      <div className="page-head">
        <span className="eyebrow">Curriculum</span>
        <h1>Choose your mission.</h1>
        <p className="lead">{TRACKS.length} self-paced tracks. Each lesson takes under 10 minutes and works at two levels — start anywhere.</p>
        {diag && (
          <div className="callout" style={{ maxWidth: 640 }}>
            <b>Lambda recommends:</b> start with <Link to={`/learn/${diag.recommended}`} style={{ textDecoration: "underline" }}>{trackById(diag.recommended)?.title}</Link> based on your diagnostic.
          </div>
        )}
      </div>
      <div className="grid" style={{ gap: 28, paddingBottom: 80 }}>
        {TRACKS.map((t) => {
          const keys = TRACK_KEYS[t.id];
          const done = keys.filter((k) => completed.includes(k)).length;
          return (
            <section key={t.id} className="card" style={{ padding: 28 }}>
              <div className="spread" style={{ alignItems: "flex-start" }}>
                <div style={{ maxWidth: 620 }}>
                  <span className="mono muted">{t.num} · {t.icon}</span>
                  <h2 style={{ fontSize: "1.9rem", marginTop: 6 }}>{t.title}</h2>
                  <p className="muted">{t.blurb}</p>
                </div>
                <div style={{ minWidth: 200 }}>
                  <div className="muted" style={{ fontSize: "0.85rem", marginBottom: 6 }}>{done} of {keys.length} complete</div>
                  <div className="progress"><i style={{ width: `${(done / keys.length) * 100}%` }} /></div>
                  <Link to={`/learn/${t.id}`} className="btn primary sm" style={{ marginTop: 14 }}>{done ? "Continue" : "Start track"} →</Link>
                </div>
              </div>
              <div className="grid g3" style={{ marginTop: 20, gap: 10 }}>
                {t.lessons.map((l, i) => {
                  const isDone = completed.includes(lessonKey(t.id, l.id));
                  return (
                    <Link key={l.id} to={`/learn/${t.id}/${l.id}`} className="row" style={{ flexWrap: "nowrap", padding: "10px 12px", borderRadius: 10, background: "oklch(100% 0 0 / 0.02)", border: "1px solid var(--border)" }}>
                      <span className={`dot ${isDone ? "done" : ""}`}>{isDone ? "✓" : i + 1}</span>
                      <span style={{ fontSize: "0.93rem" }}>{l.title}</span>
                      <span className="muted" style={{ marginLeft: "auto", fontSize: "0.78rem" }}>{l.minutes}m</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export function TrackPage() {
  const { trackId } = useParams();
  const t = trackById(trackId);
  const completed = useStore((s) => s.completed);
  useTitle(t?.title ?? "Not found");
  if (!t) return <NotFound />;
  const keys = TRACK_KEYS[t.id];
  const next = t.lessons.find((l) => !completed.includes(lessonKey(t.id, l.id))) ?? t.lessons[0];
  const done = keys.filter((k) => completed.includes(k)).length;
  return (
    <div className="container">
      <div className="page-head">
        <Link to="/learn" className="muted mono" style={{ fontSize: "0.8rem" }}>← ALL TRACKS</Link>
        <div className="guide-row" style={{ marginTop: 20 }}>
          <div style={{ fontSize: "6rem", textAlign: "center" }}>{t.icon}</div>
          <div>
            <span className="eyebrow">Track {t.num}</span>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>{t.title}</h1>
            <p className="lead">{t.blurb}</p>
            <div className="row" style={{ marginTop: 16 }}>
              <Link to={`/learn/${t.id}/${next.id}`} className="btn primary">{done ? "Continue" : "Start"}: {next.title} →</Link>
              <span className="muted">{done}/{keys.length} lessons · ~{t.lessons.reduce((n, l) => n + l.minutes, 0)} min total</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid g2" style={{ paddingBottom: 80 }}>
        {t.lessons.map((l, i) => {
          const isDone = completed.includes(lessonKey(t.id, l.id));
          return (
            <Link key={l.id} to={`/learn/${t.id}/${l.id}`} className="card hover">
              <div className="spread">
                <span className="mono muted" style={{ fontSize: "0.8rem" }}>LESSON {i + 1} · {l.minutes} MIN</span>
                {isDone ? <span className="tag" style={{ color: "var(--green)" }}>✓ Done</span> : isBasics(l) ? <span className="tag basics">🛝 Launch Pad</span> : l.sim ? <span className="tag">+ simulator</span> : null}
              </div>
              <h3 style={{ marginTop: 10 }}>{l.title}</h3>
              <p className="muted" style={{ marginBottom: 0 }}>{l.summary}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CheckQuiz({ items, lessonId }: { items: Check[]; lessonId: string }) {
  const [picked, setPicked] = useState<(number | null)[]>(items.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const score = picked.filter((p, i) => p === items[i].answer).length;
  const submit = () => {
    setSubmitted(true);
    recordCheck(lessonId, score / items.length);
  };
  return (
    <div className="card" style={{ marginTop: 32 }}>
      <span className="eyebrow">Quick check</span>
      <h3>Lock in what you learned</h3>
      <div className="grid" style={{ gap: 24, marginTop: 16 }}>
        {items.map((c, qi) => (
          <div key={qi}>
            <p style={{ fontWeight: 700 }}>{qi + 1}. {c.q}</p>
            <div className="grid" style={{ gap: 8 }}>
              {c.options.map((o, oi) => {
                const cls = submitted ? (oi === c.answer ? "right" : picked[qi] === oi ? "wrong" : "") : picked[qi] === oi ? "sel" : "";
                return (
                  <button key={oi} className={`option ${cls}`} disabled={submitted} onClick={() => setPicked(picked.map((p, k) => (k === qi ? oi : p)))}>
                    <span className="key">{"ABCD"[oi]}</span>
                    {o}
                  </button>
                );
              })}
            </div>
            {submitted && <p className="muted" style={{ fontSize: "0.9rem", marginTop: 8 }}>{picked[qi] === c.answer ? "✓ " : "✗ "}{c.why}</p>}
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 20 }}>
        {!submitted ? (
          <button className="btn primary" disabled={picked.some((p) => p === null)} onClick={submit}>Check answers</button>
        ) : (
          <>
            <b style={{ fontSize: "1.1rem" }}>{score}/{items.length} correct {score === items.length ? "— perfect orbit! 🌟" : ""}</b>
            <button className="btn sm" onClick={() => { setPicked(items.map(() => null)); setSubmitted(false); }}>Try again</button>
          </>
        )}
      </div>
    </div>
  );
}

/** Read paragraphs aloud one at a time using the browser's built-in voice. */
function useReadAloud(texts: string[], resetKey: string) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [idx, setIdx] = useState<number | null>(null);
  const token = useRef(0);
  const stop = useCallback(() => {
    token.current++;
    if (supported) window.speechSynthesis.cancel();
    setIdx(null);
  }, [supported]);
  useEffect(() => {
    return () => stop();
  }, [resetKey, stop]);
  const play = () => {
    if (!supported) return;
    stop();
    const my = ++token.current;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => /^en/i.test(v.lang) && /female|samantha|google us|zira|aria/i.test(v.name)) ?? voices.find((v) => /^en/i.test(v.lang));
    const speakAt = (n: number) => {
      if (token.current !== my) return;
      if (n >= texts.length) return setIdx(null);
      const u = new SpeechSynthesisUtterance(texts[n].replace(/\*\*/g, ""));
      if (voice) u.voice = voice;
      u.rate = 0.9;
      u.pitch = 1.05;
      u.onend = () => speakAt(n + 1);
      u.onerror = () => {
        if (token.current === my) setIdx(null);
      };
      setIdx(n);
      window.speechSynthesis.speak(u);
    };
    speakAt(0);
  };
  return { supported, idx, speaking: idx !== null, play, stop };
}

export function LessonPage() {
  const { trackId, lessonId } = useParams();
  const t = trackById(trackId);
  const idx = t?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const l = t && idx >= 0 ? t.lessons[idx] : undefined;
  const level = useStore((s) => s.level);
  const completed = useStore((s) => s.completed);
  useTitle(l?.title ?? "Not found");
  const paras = l ? (level === "simple" ? l.simple : l.deep) : [];
  const reader = useReadAloud(paras, `${trackId}/${lessonId}/${level}`);
  if (!t || !l) return <NotFound />;
  const key = lessonKey(t.id, l.id);
  const isDone = completed.includes(key);
  const prev = t.lessons[idx - 1];
  const next = t.lessons[idx + 1];
  const Sim = l.sim ? SIMS[l.sim] : undefined;
  const Game = l.game ? GAMES[l.game] : undefined;
  const basics = isBasics(l);

  return (
    <div className="container">
      <div className="lesson-layout">
        <aside className="lesson-side">
          <Link to={`/learn/${t.id}`} className="muted mono" style={{ fontSize: "0.78rem" }}>← {t.short.toUpperCase()}</Link>
          <ul className="lesson-list" style={{ marginTop: 14 }}>
            {t.lessons.map((x, i) => {
              const d = completed.includes(lessonKey(t.id, x.id));
              return (
                <li key={x.id}>
                  <Link to={`/learn/${t.id}/${x.id}`} className={x.id === l.id ? "active" : ""}>
                    <span className={`dot ${d ? "done" : ""}`}>{d ? "✓" : i + 1}</span>
                    {x.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="card" style={{ marginTop: 20, padding: 16, textAlign: "center" }}>
            <Mascot size={90} mood="think" float={false} />
            <p className="muted" style={{ fontSize: "0.85rem", margin: "8px 0 0" }}>Stuck? Tap me in the corner to ask a question.</p>
          </div>
        </aside>

        <article className="fade-in" key={key}>
          <span className="eyebrow">
            {basics && <span className="tag basics" style={{ marginRight: 8 }}>🛝 Launch Pad</span>}
            {t.title} · Lesson {idx + 1} · {l.minutes} min
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}>{l.title}</h1>
          <p className="lead">{l.summary}</p>
          {l.picture && (
            <div style={{ margin: "24px 0", maxWidth: 720 }}>
              <Picture name={l.picture} alt={`Picture for ${l.title}`} />
            </div>
          )}
          <div className="spread" style={{ margin: "24px 0" }}>
            <div className="level-toggle" role="group" aria-label="Explanation level">
              <button className={level === "simple" ? "on" : ""} onClick={() => setLevel("simple")}>🧒 Simple</button>
              <button className={level === "deep" ? "on" : ""} onClick={() => setLevel("deep")}>{basics ? "🚀 A little more" : "🎓 Deep dive"}</button>
            </div>
            <div className="row">
              {reader.supported && (
                <button className="btn sm" onClick={reader.speaking ? reader.stop : () => reader.play()} aria-pressed={reader.speaking}>
                  {reader.speaking ? "⏹ Stop reading" : "🔊 Read to me"}
                </button>
              )}
              {isDone && <span className="tag" style={{ color: "var(--green)" }}>✓ Completed</span>}
            </div>
          </div>

          <LambdaSays mood="happy">{l.lambda}</LambdaSays>

          <div className={`prose ${basics || level === "simple" ? "kid" : ""}`} style={{ marginTop: 28 }}>
            {paras.map((p, i) => (
              <p key={i} className={reader.idx === i ? "speaking" : undefined}><Rich text={p} /></p>
            ))}
            {l.words && (
              <>
                <h3>📖 Words to know</h3>
                <div className="words">
                  {l.words.map((w) => (
                    <div key={w.word} className="word"><b>{w.word}</b>{w.meaning}</div>
                  ))}
                </div>
              </>
            )}
            {l.activity && (
              <div className="activity"><b>🧪 Try it at home:</b> {l.activity}</div>
            )}
            {l.formula && (
              <div className="formula">
                {l.formula.expr}
                <small>{l.formula.note}</small>
              </div>
            )}
            <div className="callout"><b>Cosmic fact:</b> {l.fact}</div>
          </div>

          {Sim && (
            <div className="card" style={{ marginTop: 28 }}>
              <span className="eyebrow">Try it · {Sim.title}</span>
              <Sim.C />
            </div>
          )}

          {Game && (
            <div className="card" style={{ marginTop: 28 }}>
              <span className="eyebrow">Play · {Game.emoji} {Game.title}</span>
              <Game.C />
            </div>
          )}

          <CheckQuiz key={key} items={l.check} lessonId={key} />

          <div className="spread" style={{ marginTop: 32 }}>
            {prev ? <Link to={`/learn/${t.id}/${prev.id}`} className="btn">← {prev.title}</Link> : <span />}
            <div className="row">
              {!isDone && <button className="btn primary" onClick={() => completeLesson(key)}>Mark complete · +50 XP</button>}
              {next ? (
                <Link to={`/learn/${t.id}/${next.id}`} className={`btn ${isDone ? "primary" : ""}`} onClick={() => !isDone && completeLesson(key)}>
                  Next: {next.title} →
                </Link>
              ) : (
                <Link to="/learn" className="btn" onClick={() => !isDone && completeLesson(key)}>Finish track 🎉</Link>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
