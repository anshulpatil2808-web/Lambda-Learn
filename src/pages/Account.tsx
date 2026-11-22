import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mascot } from "../components/Mascot";
import { useTitle } from "../components/Layout";
import { TRACKS, TRACK_KEYS } from "../data/tracks";
import { BADGES, RANKS, exportData, rankFor, saveProfile, signOut, useStore, type AgeGroup } from "../lib/store";
import { cloudEnabled, deleteCloudData, sendCode, signInWithGoogle, signOutEverywhere, useAuth, verifyCode } from "../lib/cloud";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const friendly = (e: unknown) => {
  const m = e instanceof Error ? e.message : String(e);
  if (/expired|invalid/i.test(m)) return "That code didn't work or has expired. Check the latest email, or send a new code.";
  if (/rate|seconds|too many/i.test(m)) return "Too many tries — please wait a minute and try again.";
  if (/failed to fetch|network/i.test(m)) return "Can't reach the sign-in server. Check your internet connection and try again.";
  if (/provider is not enabled/i.test(m)) return "Google sign-in isn't switched on yet. Use the email code instead.";
  return m || "Something went wrong. Please try again.";
};

function AgeSelect({ value, onChange }: { value: AgeGroup; onChange: (a: AgeGroup) => void }) {
  return (
    <div>
      <label className="lbl" htmlFor="ag">I am…</label>
      <select id="ag" className="field" value={value} onChange={(e) => onChange(e.target.value as AgeGroup)}>
        <option value="kid">Ages 10–13</option>
        <option value="teen">Ages 14–18</option>
        <option value="uni">University student</option>
        <option value="adult">Lifelong learner</option>
      </select>
    </div>
  );
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

export function Auth() {
  useTitle("Join the crew");
  const nav = useNavigate();
  const profile = useStore((s) => s.profile);
  const { user, ready } = useAuth();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [code, setCode] = useState("");
  const [name, setName] = useState(profile?.name ?? "");
  const [age, setAge] = useState<AgeGroup>(profile?.ageGroup ?? "adult");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // The cloud profile can arrive just after sign-in; prefill the form with it.
  useEffect(() => {
    if (profile) {
      setName((n) => n || profile.name);
      setAge(profile.ageGroup);
    }
  }, [profile]);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErr(null);
    try {
      await fn();
    } catch (e) {
      setErr(friendly(e));
    } finally {
      setBusy(false);
    }
  };

  const requestCode = (e?: FormEvent) => {
    e?.preventDefault();
    if (!EMAIL_RE.test(email.trim())) return setErr("Please enter a valid email address.");
    void run(async () => {
      await sendCode(email.trim());
      setStep("code");
      setCode("");
      setCooldown(60);
    });
  };
  const confirmCode = (e: FormEvent) => {
    e.preventDefault();
    void run(() => verifyCode(email.trim(), code.trim()));
  };
  const saveDetails = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile({
      name: name.trim(),
      email: user?.email ?? (email.trim() || undefined),
      ageGroup: age,
      interests: profile?.interests ?? [],
      joinedAt: profile?.joinedAt ?? new Date().toISOString(),
    });
    nav("/profile");
  };

  const signedIn = cloudEnabled && !!user;
  const stepNo = !cloudEnabled ? 1 : !signedIn ? (step === "email" ? 1 : 2) : 3;
  const stepLabel = !cloudEnabled ? "CREATE PROFILE" : !signedIn ? (step === "email" ? "CREATE ACCOUNT" : "VERIFY EMAIL") : profile ? "YOUR PROFILE" : "CREW DETAILS";
  const wide = { width: "100%", justifyContent: "center" } as const;

  return (
    <div className="container">
      <div className="grid g2" style={{ padding: "64px 0 96px", gap: 48, alignItems: "center" }}>
        <div>
          <span className="eyebrow">01 / Mission control</span>
          <h1 style={{ textTransform: "uppercase" }}>Real people.<br /><span className="grad">Real orbits.</span></h1>
          <p className="lead">
            {cloudEnabled
              ? "Every Lambda Learn crew member verifies their email with a one-time code. Your XP, badges and lessons follow you to any device."
              : "Create your crew profile to keep your XP, badges and lesson progress. It's free, and you can start learning without one."}
          </p>
          <Mascot size={160} mood={step === "code" && !signedIn ? "think" : "wave"} />
        </div>

        <div className="card" style={{ padding: 32 }}>
          <span className="mono muted" style={{ fontSize: "0.78rem" }}>
            Λ · STEP {stepNo} OF {cloudEnabled ? 3 : 1} · {stepLabel}
          </span>

          {cloudEnabled && !ready ? (
            <p className="muted" style={{ marginTop: 20 }}>Checking your session…</p>
          ) : cloudEnabled && !signedIn && step === "email" ? (
            <form onSubmit={requestCode}>
              <h2 style={{ fontSize: "1.8rem", marginTop: 10 }}>Join the crew</h2>
              <p className="muted">Start with Google, or get a sign-in code by email. New and returning crew use the same steps.</p>
              <button type="button" className="btn" style={wide} disabled={busy} onClick={() => run(signInWithGoogle)}>
                <GoogleIcon /> Continue with Google
              </button>
              <div className="row" style={{ margin: "18px 0", flexWrap: "nowrap" }}>
                <hr style={{ flex: 1, border: 0, borderTop: "1px solid var(--border)" }} />
                <span className="muted" style={{ fontSize: "0.8rem" }}>or</span>
                <hr style={{ flex: 1, border: 0, borderTop: "1px solid var(--border)" }} />
              </div>
              <label className="lbl" htmlFor="em">Email</label>
              <input id="em" className="field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              <button className="btn primary" type="submit" disabled={busy || !email} style={{ ...wide, marginTop: 14 }}>
                {busy ? "Sending…" : "Email me a code"}
              </button>
            </form>
          ) : cloudEnabled && !signedIn ? (
            <form onSubmit={confirmCode}>
              <h2 style={{ fontSize: "1.8rem", marginTop: 10 }}>Check your inbox</h2>
              <p className="muted">We sent a sign-in code to <b style={{ color: "var(--fg)" }}>{email}</b>. It can take a minute — check spam too.</p>
              <label className="lbl" htmlFor="code">Sign-in code</label>
              <input
                id="code"
                className="field mono"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="123456"
                style={{ fontSize: "1.4rem", letterSpacing: "0.3em", textAlign: "center" }}
              />
              <button className="btn primary" type="submit" disabled={busy || code.length < 6} style={{ ...wide, marginTop: 14 }}>
                {busy ? "Checking…" : "Verify & sign in"}
              </button>
              <div className="spread" style={{ marginTop: 14 }}>
                <button type="button" className="btn ghost sm" onClick={() => { setStep("email"); setErr(null); }}>← Change email</button>
                <button type="button" className="btn ghost sm" disabled={busy || cooldown > 0} onClick={() => requestCode()}>
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={saveDetails}>
              <h2 style={{ fontSize: "1.8rem", marginTop: 10 }}>{profile ? "Update your profile" : signedIn ? "Welcome aboard!" : "Join the crew"}</h2>
              {signedIn && (
                <p className="muted">Signed in as <b style={{ color: "var(--fg)" }}>{user!.email}</b>. {profile ? "" : "One last step: what should Lambda call you?"}</p>
              )}
              <div className="grid" style={{ gap: 16, marginTop: 16 }}>
                <div>
                  <label className="lbl" htmlFor="nm">Display name</label>
                  <input id="nm" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nickname" maxLength={40} required />
                  <p className="muted" style={{ fontSize: "0.8rem", margin: "6px 0 0" }}>Kids: please use a nickname, not your full name.</p>
                </div>
                {!cloudEnabled && (
                  <div>
                    <label className="lbl" htmlFor="em2">Email (optional)</label>
                    <input id="em2" className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                )}
                <AgeSelect value={age} onChange={setAge} />
                <button className="btn primary" type="submit" disabled={!name.trim() || (!cloudEnabled && !!email && !EMAIL_RE.test(email))} style={{ justifyContent: "center" }}>
                  {profile ? "Save profile" : "Start my mission →"}
                </button>
              </div>
            </form>
          )}

          {err && <p role="alert" style={{ color: "var(--danger)", fontWeight: 600, marginTop: 14, marginBottom: 0 }}>{err}</p>}
          <p className="muted" style={{ fontSize: "0.82rem", marginTop: 16, marginBottom: 0 }}>
            🔒 {cloudEnabled ? "We store only your email, nickname, age group and learning progress." : "Your profile and progress are stored only in this browser — nothing is sent to a server."} Under 13? Ask a parent or teacher before signing up. <Link to="/privacy" style={{ textDecoration: "underline" }}>Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export function Profile() {
  useTitle("My progress");
  const s = useStore((x) => x);
  const nav = useNavigate();
  const { user, sync } = useAuth();
  const [busy, setBusy] = useState(false);
  const r = rankFor(s.xp);
  const cloudUser = cloudEnabled && !!user;
  const doSignOut = async () => {
    const msg = cloudUser
      ? "Sign out on this device? Your progress is saved to your account and will come back when you sign in again."
      : "Erase your profile, XP and badges from this browser? This can't be undone.";
    if (!confirm(msg)) return;
    setBusy(true);
    await (cloudUser ? signOutEverywhere() : Promise.resolve(signOut()));
    setBusy(false);
    nav("/");
  };
  const doDelete = async () => {
    if (!confirm("Permanently delete your saved progress from Lambda Learn's servers and sign out? This can't be undone.")) return;
    setBusy(true);
    try {
      await deleteCloudData();
      nav("/");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't delete your data. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  if (!s.profile) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "96px 20px" }}>
        <Mascot size={140} mood="think" />
        <h1 style={{ fontSize: "2.4rem", marginTop: 20 }}>No crew profile yet</h1>
        <p className="lead" style={{ margin: "0 auto 24px" }}>Take the diagnostic or create a profile to start tracking XP{ s.xp ? ` — you've already earned ${s.xp} XP!` : "." }</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link to="/quiz" className="btn primary">Take the diagnostic</Link>
          <Link to="/auth" className="btn">Create profile</Link>
        </div>
      </div>
    );
  }
  const download = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "lambda-learn-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head guide-row" style={{ gridTemplateColumns: "160px 1fr" }}>
        <Mascot size={150} mood="cheer" />
        <div>
          <span className="eyebrow">Crew profile</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>{s.profile.name}</h1>
          <p className="lead" style={{ marginBottom: 8 }}>{r.emoji} {r.name} · {s.xp} XP · 🔥 {s.streak.count}-day streak</p>
          <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 12 }}>
            {cloudUser ? (
              <>☁ {user!.email} · {sync === "syncing" ? "Saving…" : sync === "error" ? <span className="status-warn">Couldn't sync — will retry on your next change</span> : "Progress synced"}</>
            ) : cloudEnabled ? (
              <>💾 Saved on this device only · <Link to="/auth" style={{ color: "var(--primary)", fontWeight: 700 }}>Sign in to back it up</Link></>
            ) : (
              <>💾 Saved on this device</>
            )}
          </p>
          <div style={{ maxWidth: 480 }}>
            <div className="progress" style={{ height: 10 }}><i style={{ width: `${r.pct * 100}%` }} /></div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: 6 }}>{r.next ? `${r.next.min - s.xp} XP to ${r.next.emoji} ${r.next.name}` : "Maximum rank reached — you're an Astrophysicist!"}</p>
          </div>
        </div>
      </div>

      <h3>Track progress</h3>
      <div className="grid g4">
        {TRACKS.map((t) => {
          const keys = TRACK_KEYS[t.id];
          const done = keys.filter((k) => s.completed.includes(k)).length;
          return (
            <Link key={t.id} to={`/learn/${t.id}`} className="card hover">
              <div style={{ fontSize: "1.6rem" }}>{t.icon}</div>
              <b>{t.short}</b>
              <div className="muted" style={{ fontSize: "0.85rem", margin: "4px 0 10px" }}>{done}/{keys.length} lessons</div>
              <div className="progress"><i style={{ width: `${(done / keys.length) * 100}%` }} /></div>
            </Link>
          );
        })}
      </div>

      <h3 style={{ marginTop: 40 }}>Badges · {s.badges.length}/{BADGES.length}</h3>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {BADGES.map((b) => (
          <div key={b.id} className={`badge-tile ${s.badges.includes(b.id) ? "earned" : ""}`}>
            <span className="em">{b.emoji}</span>
            <b>{b.name}</b>
            <span>{b.desc}</span>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 40 }}>Rank ladder</h3>
      <div className="row">
        {RANKS.map((x, i) => (
          <span key={x.name} className={`chip ${i <= r.index ? "on" : ""}`}>{x.emoji} {x.name} · {x.min}</span>
        ))}
      </div>

      <div className="card" style={{ marginTop: 40 }}>
        <h3>Your data</h3>
        <p className="muted">{cloudUser ? "Your progress is saved to your account and this browser." : "Everything is stored in this browser."} Export a backup any time.</p>
        <div className="row">
          <Link to="/auth" className="btn sm">Edit profile</Link>
          <button className="btn sm" onClick={download}>⬇ Export progress (JSON)</button>
          <button className="btn sm" disabled={busy} onClick={doSignOut} style={cloudUser ? undefined : { borderColor: "var(--danger)", color: "var(--danger)" }}>
            {cloudUser ? "Sign out" : "Sign out & erase"}
          </button>
          {cloudUser && (
            <button className="btn sm" disabled={busy} onClick={doDelete} style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>Delete my cloud data</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function About() {
  useTitle("About");
  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <div className="page-head">
        <span className="eyebrow">About Lambda Learn</span>
        <h1>Make the universe make sense.</h1>
        <p className="lead">Lambda Learn is a free, self-paced space-science school for curious minds from 5th grade to PhD — built by ProInnoTech.</p>
      </div>
      <div className="prose">
        <h2>Why "Lambda"?</h2>
        <p>Λ (lambda) is the cosmological constant in Einstein's equations — the term behind dark energy and the accelerating expansion of the universe. It's also the symbol for wavelength, the key to reading starlight. One letter, two of the biggest ideas in astrophysics.</p>
        <h2>How we teach</h2>
        <ul>
          <li><b>Two levels, one idea.</b> Every lesson has a Simple version written for 10-year-olds and a Deep dive with the real equations.</li>
          <li><b>Learn by doing.</b> Fifteen simulators run the same physics professionals use — the rocket equation, vis-viva, Wien's law, the NPF rule.</li>
          <li><b>Small wins.</b> Short lessons, quick checks, XP, ranks and badges keep momentum going.</li>
          <li><b>Accuracy first.</b> Facts are checked against NASA, ESA, IAU and peer-reviewed sources. Spotted an error? Tell us and we'll fix it.</li>
        </ul>
        <h2>For teachers & clubs</h2>
        <p>Lessons map naturally to middle- and high-school physics topics: forces and motion, waves and light, energy, and Earth and space science. Simulators work great on a projector, and everything runs in the browser with no installs or accounts.</p>
        <div className="callout"><b>Founder's vision:</b> "My dream is to make astrophysics, cosmology, rocket science and astrophotography so clear and inspiring that a 5th grader can understand physics and rockets." — ProInnoTech</div>
      </div>
    </div>
  );
}

export function Privacy() {
  useTitle("Privacy");
  return (
    <div className="container prose" style={{ maxWidth: 760, paddingBottom: 80 }}>
      <div className="page-head">
        <span className="eyebrow">Privacy</span>
        <h1>Your data stays with you.</h1>
      </div>
      {cloudEnabled ? (
        <>
          <p>You can use Lambda Learn without an account — your progress is then kept <b>only in your browser's local storage</b>.</p>
          <p>If you sign in, we store your <b>email address, display name, age group, interests, XP, badges and lesson progress</b> so they follow you between devices. Sign-in and storage are provided by Supabase. Each learner's data is protected so only they can read or change it. We don't sell data, show ads or use tracking cookies.</p>
          <p>Signing in with Google shares your email address with us; we don't receive your Google password or contacts.</p>
          <p>You can delete your saved progress at any time from <Link to="/profile">your profile</Link> ("Delete my cloud data"). To remove your sign-in record entirely, contact us.</p>
        </>
      ) : (
        <p>Lambda Learn currently stores your profile (display name, optional email, age group, interests), XP, badges and lesson progress <b>only in your browser's local storage</b>. We don't send it to any server, and we don't use advertising or tracking cookies.</p>
      )}
      <p>Fonts are loaded from Google Fonts, which may receive your IP address as part of a normal web request.</p>
      <p>You can export or erase your data at any time from <Link to="/profile">your profile</Link>. Clearing your browser data will also remove it.</p>
      <p>Children under 13 should only sign up with a parent or teacher's permission.</p>
    </div>
  );
}
