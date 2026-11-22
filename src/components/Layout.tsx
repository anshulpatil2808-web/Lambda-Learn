import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { onToast, rankFor, useStore } from "../lib/store";
import { GLOSSARY } from "../data/glossary";
import { TRACKS } from "../data/tracks";
import { Mascot } from "./Mascot";

export const GITHUB_URL = "https://github.com/anshulpatil2808-web/Lambda-Learn";

/** Render **bold** markup inside lesson strings. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? <strong key={i} style={{ color: "var(--fg)" }}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — Lambda Learn` : "Lambda Learn — Space Science for Everyone";
  }, [title]);
}

function Nav() {
  const [open, setOpen] = useState(false);
  const xp = useStore((s) => s.xp);
  const profile = useStore((s) => s.profile);
  const loc = useLocation();
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  const links = [
    ["/", "Home"],
    ["/start", "Start Here"],
    ["/learn", "Learn"],
    ["/play", "Play"],
    ["/labs", "Labs"],
    ["/sky", "Sky Tonight"],
    ["/quiz", "Quiz"],
  ];
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="Lambda Learn home">
          <span className="lam">Λ</span> LAMBDA LEARN
        </Link>
        <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `lnk ${isActive ? "active" : ""}`}>
              {label}
            </NavLink>
          ))}
          {profile ? (
            <Link to="/profile" className="xp-pill" title="Your profile">
              {rankFor(xp).emoji} {xp} XP
            </Link>
          ) : (
            <Link to="/auth" className="btn primary sm">SIGN IN</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: "var(--fg)", marginBottom: 10 }}>
              <span className="lam">Λ</span> LAMBDA LEARN
            </div>
            <p style={{ maxWidth: 340 }}>Space science anyone can actually understand — astrophysics, astronomy, aerospace and astrophotography, from 5th grade to PhD.</p>
          </div>
          <div>
            <h4>Learn</h4>
            {TRACKS.map((t) => (
              <Link key={t.id} to={`/learn/${t.id}`}>{t.short}</Link>
            ))}
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/start">Start here</Link>
            <Link to="/play">Space games</Link>
            <Link to="/labs">Simulator labs</Link>
            <Link to="/sky">Sky tonight</Link>
            <Link to="/glossary">Glossary</Link>
            <Link to="/quiz">Diagnostic quiz</Link>
          </div>
          <div>
            <h4>Lambda Learn</h4>
            <Link to="/about">About & mission</Link>
            <Link to="/profile">My progress</Link>
            <Link to="/privacy">Privacy</Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>
        <div className="spread" style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <span>© {new Date().getFullYear()} Lambda Learn · ProInnoTech</span>
          <span>Made for curious minds, 5th grade to PhD.</span>
        </div>
      </div>
    </footer>
  );
}

function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number>(0);
  useEffect(() => {
    onToast((m) => {
      setMsg(m);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), 2600);
    });
  }, []);
  return msg ? <div className="toast" role="status">{msg}</div> : null;
}

/* ---------- Ask Lambda: offline helper that searches glossary + lessons ---------- */
interface Msg { from: "bot" | "me"; body: ReactNode }

function answer(q: string): ReactNode {
  const s = q.toLowerCase().trim();
  if (!s) return "Ask me about any space word — like 'black hole', 'ISO' or 'delta-v'!";
  if (/^(hi|hello|hey)\b/.test(s)) return "Hey there, space cadet! 👋 Ask me what a word means, or say 'where do I start?'";
  if (/start|begin|new|first/.test(s))
    return <>Start on the <Link to="/start">Launch Pad</Link> — lesson 1 is <Link to="/learn/astronomy/what-is-space">What is space?</Link> Or take the <Link to="/quiz">3-minute quiz</Link> and I'll suggest where to begin!</>;
  if (/xp|rank|badge|level/.test(s))
    return <>You earn XP by finishing lessons (+50), passing checks (up to +30) and trying simulators (+10). Ranks go from Cadet to Astrophysicist. See <Link to="/profile">your profile</Link>.</>;
  if (/tonight|moon|meteor|see/.test(s))
    return <>Check <Link to="/sky">Sky Tonight</Link> for the Moon phase and upcoming meteor showers!</>;
  const words = s.replace(/[?!.]/g, "").split(/\s+/).filter((w) => w.length > 2 && !["what", "the", "does", "mean", "how", "why", "is", "are", "who"].includes(w));
  const score = (t: string) => words.reduce((n, w) => n + (t.toLowerCase().includes(w) ? 1 : 0), 0);
  const term = GLOSSARY.map((g) => ({ g, sc: score(g.term) * 3 + score(g.def) })).sort((a, b) => b.sc - a.sc)[0];
  const lessons = TRACKS.flatMap((t) => t.lessons.map((l) => ({ t, l, sc: score(l.title) * 3 + score(l.summary) }))).sort((a, b) => b.sc - a.sc);
  if (term && term.sc >= 3) {
    return (
      <>
        <b>{term.g.term}:</b> {term.g.def}
        {term.g.link && <> <Link to={`/learn/${term.g.link}`}>Learn more →</Link></>}
      </>
    );
  }
  if (lessons[0]?.sc > 0) {
    const { t, l } = lessons[0];
    return <>Great question! My lesson <Link to={`/learn/${t.id}/${l.id}`}>{l.title}</Link> covers that. {l.lambda}</>;
  }
  if (term && term.sc > 0) return <><b>{term.g.term}:</b> {term.g.def}</>;
  return <>Hmm, that's beyond my star charts for now! Try the <Link to="/glossary">glossary</Link>, or ask about rockets, stars, telescopes or cameras.</>;
}

function AskLambda() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", body: "Hi! I'm Lambda 🚀 Ask me what any space word means, or where to start." }]);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);
  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "me", body: text }, { from: "bot", body: answer(text) }]);
    setQ("");
  };
  return (
    <>
      {open && (
        <div className="ask-panel fade-in" role="dialog" aria-label="Ask Lambda">
          <div className="ask-head">
            <Mascot size={36} mood="happy" float={false} />
            <div style={{ flex: 1 }}>
              <b>Ask Lambda</b>
              <div className="muted" style={{ fontSize: "0.78rem" }}>Your space cab guide · works offline</div>
            </div>
            <button className="btn ghost sm" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>
          <div className="ask-body" ref={body}>
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>{m.body}</div>
            ))}
            <div className="row" style={{ gap: 6 }}>
              {["Where do I start?", "What is delta-v?", "Rule of 500", "What's a black hole?"].map((s) => (
                <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
          <form className="ask-foot" onSubmit={(e) => { e.preventDefault(); send(q); }}>
            <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about space…" aria-label="Your question" />
            <button className="btn primary sm" type="submit">Ask</button>
          </form>
        </div>
      )}
      <button className="ask-fab" onClick={() => setOpen(!open)} aria-label={open ? "Close Ask Lambda" : "Ask Lambda"}>
        <Mascot size={52} mood="wave" float={false} />
      </button>
    </>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { if (!window.location.hash) window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <>
      <ScrollTop />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AskLambda />
      <Toaster />
    </>
  );
}
