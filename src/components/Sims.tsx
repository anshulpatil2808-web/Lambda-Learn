import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import { markSim } from "../lib/store";
import { fmt, fmtSci, kelvinToRgb, moonPhase } from "../lib/astro";

/* ---------- shared bits ---------- */
function useTouch(id: string) {
  const done = useRef(false);
  return () => {
    if (!done.current) {
      done.current = true;
      markSim(id);
    }
  };
}

function Slider(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="ctrl">
      <span className="spread">
        <span>{props.label}</span>
        <b>{props.display ?? props.value}</b>
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onChange={(e) => props.onChange(parseFloat(e.target.value))}
        aria-label={props.label}
      />
    </label>
  );
}

function Chips<T extends string | number>({ options, value, onChange, render }: { options: T[]; value: T; onChange: (v: T) => void; render?: (v: T) => ReactNode }) {
  return (
    <div className="row" style={{ gap: 8 }}>
      {options.map((o) => (
        <button key={String(o)} className={`chip ${o === value ? "on" : ""}`} onClick={() => onChange(o)} type="button">
          {render ? render(o) : String(o)}
        </button>
      ))}
    </div>
  );
}

function Readout({ label, value, unit, tone }: { label: string; value: string; unit?: string; tone?: "ok" | "warn" }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: "0.82rem" }}>{label}</div>
      <div className="sim-readout" style={{ fontSize: "1.7rem", color: tone === "ok" ? "var(--green)" : tone === "warn" ? "var(--coral)" : undefined }}>
        {value}
        {unit && <small>{unit}</small>}
      </div>
    </div>
  );
}

function SimShell({ children, side }: { children: ReactNode; side?: ReactNode }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: side ? "repeat(auto-fit, minmax(260px, 1fr))" : "1fr", gap: 24 }}>
      <div>{children}</div>
      {side && <div>{side}</div>}
    </div>
  );
}

/* ---------- 1. Thruster ---------- */
export function ThrusterSim() {
  const touch = useTouch("thruster");
  const [p, setP] = useState(65);
  const v = (12 * p) / 100;
  const status = v >= 11.2 ? ["Escape velocity! Bound for the Moon and beyond.", "ok"] : v >= 7.8 ? ["✓ Orbit reached!", "ok"] : ["Suborbital — falls back to Earth", "warn"];
  return (
    <SimShell
      side={
        <svg viewBox="0 0 200 220" className="sim-canvas" role="img" aria-label="Rocket with flame proportional to power">
          <line x1="20" y1={200 - 1.6 * p} x2="180" y2={200 - 1.6 * p} stroke="#2bb3c0" strokeDasharray="4 6" opacity="0.4" />
          <g transform={`translate(100 ${170 - 1.2 * p})`}>
            <path d={`M -9 30 Q 0 ${30 + p * 0.9} 9 30 Z`} fill="#f5d34a" opacity="0.9" />
            <path d={`M -5 30 Q 0 ${30 + p * 0.55} 5 30 Z`} fill="#fff7d6" />
            <path d="M0 -40 C 12 -25 13 0 12 30 L -12 30 C -13 0 -12 -25 0 -40 Z" fill="#e8edf3" />
            <circle cy="-12" r="5" fill="#2bb3c0" />
            <path d="M-12 12 L -22 34 L -12 30 Z M12 12 L 22 34 L 12 30 Z" fill="#ff7a59" />
          </g>
        </svg>
      }
    >
      <div className="muted" style={{ fontSize: "0.85rem" }}>Velocity at burnout</div>
      <div className="sim-readout">{v.toFixed(1)}<small>km/s</small></div>
      <p className={status[1] === "ok" ? "status-ok" : "status-warn"} style={{ marginTop: 8 }}>{status[0]}</p>
      <Slider label="Engine power" value={p} min={0} max={100} display={`${p}%`} onChange={(x) => { touch(); setP(x); }} />
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 14 }}>Orbit needs ~7.8 km/s sideways. Escape needs 11.2 km/s.</p>
    </SimShell>
  );
}

/* ---------- 2. Rocket equation ---------- */
const ENGINES = [
  { name: "Solid", isp: 265 },
  { name: "Kerosene/LOX", isp: 330 },
  { name: "Methane/LOX", isp: 360 },
  { name: "Hydrogen/LOX", isp: 450 },
];
const TARGETS = [
  { name: "Low Earth orbit", dv: 9.4 },
  { name: "Geostationary transfer", dv: 11.8 },
  { name: "Trans-lunar injection", dv: 12.5 },
];
export function RocketEqSim() {
  const touch = useTouch("rocket-eq");
  const [isp, setIsp] = useState(330);
  const [mr, setMr] = useState(6);
  const [stages, setStages] = useState(2);
  const single = (isp * 9.81 * Math.log(mr)) / 1000;
  const total = single * stages;
  const propFrac = 1 - 1 / mr;
  return (
    <SimShell
      side={
        <div className="grid" style={{ gap: 10 }}>
          {TARGETS.map((t) => {
            const ok = total >= t.dv;
            return (
              <div key={t.name}>
                <div className="spread" style={{ fontSize: "0.88rem" }}>
                  <span>{t.name}</span>
                  <span className={ok ? "status-ok" : "muted"}>{ok ? "✓ reachable" : `${t.dv} km/s`}</span>
                </div>
                <div className="progress"><i style={{ width: `${Math.min(100, (total / t.dv) * 100)}%` }} /></div>
              </div>
            );
          })}
          <p className="muted" style={{ fontSize: "0.82rem", marginTop: 8 }}>Idealised: each stage has the same mass ratio and engine. Real rockets mix engines per stage.</p>
        </div>
      }
    >
      <Readout label="Total delta-v" value={total.toFixed(2)} unit="km/s" />
      <div className="muted" style={{ fontSize: "0.85rem", marginTop: 4 }}>Each stage is {(propFrac * 100).toFixed(0)}% propellant · {single.toFixed(2)} km/s per stage</div>
      <div style={{ marginTop: 14 }}>
        <Chips options={ENGINES.map((e) => e.isp)} value={isp} onChange={(v) => { touch(); setIsp(v); }} render={(v) => ENGINES.find((e) => e.isp === v)!.name} />
      </div>
      <Slider label="Specific impulse (Isp)" value={isp} min={200} max={470} display={`${isp} s`} onChange={(v) => { touch(); setIsp(v); }} />
      <Slider label="Mass ratio per stage (m₀/m_f)" value={mr} min={1.2} max={20} step={0.1} display={mr.toFixed(1)} onChange={(v) => { touch(); setMr(v); }} />
      <Slider label="Number of stages" value={stages} min={1} max={3} onChange={(v) => { touch(); setStages(v); }} />
    </SimShell>
  );
}

/* ---------- 3. Newton's cannon orbit ---------- */
export function OrbitSim() {
  const touch = useTouch("orbit");
  const [v0, setV0] = useState(7.7);
  const [result, setResult] = useState<string>("Set a speed and fire the cannon.");
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  const fire = (user = true) => {
    if (user) touch();
    cancelAnimationFrame(raf.current);
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const R = 6371, mu = 398600.4418;
    const scale = (Math.min(W, H) / 2) / (R * 2.6);
    const cx = W / 2, cy = H / 2;
    let x = 0, y = R + 400, vx = v0, vy = 0;
    const r0 = y;
    const trail: [number, number][] = [];
    let angle = 0, prevAng = Math.atan2(y, x);
    let done = false;
    const drawBase = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.shadowBlur = 0;
      const g = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, R * scale);
      g.addColorStop(0, "#4fb3ff");
      g.addColorStop(1, "#0b3b6b");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(79,179,255,0.25)";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.fillStyle = "#8a6a4a";
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - R * scale + 2);
      ctx.lineTo(cx, cy - r0 * scale);
      ctx.lineTo(cx + 14, cy - R * scale + 2);
      ctx.fill();
    };
    const step = () => {
      for (let i = 0; i < 40 && !done; i++) {
        const dt = 5;
        const r = Math.hypot(x, y);
        const a = -mu / (r * r * r);
        vx += a * x * dt;
        vy += a * y * dt;
        x += vx * dt;
        y += vy * dt;
        const ang = Math.atan2(y, x);
        let d = ang - prevAng;
        if (d > Math.PI) d -= 2 * Math.PI;
        if (d < -Math.PI) d += 2 * Math.PI;
        angle += d;
        prevAng = ang;
        if (i % 4 === 0) trail.push([x, y]);
        const rr = Math.hypot(x, y);
        if (rr < R) { done = true; setResult(`💥 Crashed ${fmt(Math.abs(angle) * R, 0)} km downrange. Too slow for orbit.`); }
        else if (Math.abs(angle) > 2 * Math.PI) { done = true; setResult(v0 >= 7.67 && v0 < 7.72 ? "✓ Near-circular orbit! ~92 minutes per lap." : "✓ Stable elliptical orbit — it keeps missing the ground!"); }
        else if (rr > R * 2.6 * 1.6) { done = true; setResult(v0 >= 10.8 ? "🚀 Escape! Leaving Earth's gravity for good." : "↗ Very high orbit — heading far out before returning."); }
      }
      drawBase();
      ctx.strokeStyle = "#f5d34a";
      ctx.lineWidth = 3; ctx.shadowColor = "#f5d34a"; ctx.shadowBlur = 8;
      ctx.beginPath();
      trail.forEach(([tx, ty], i) => {
        const px = cx + tx * scale, py = cy - ty * scale;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(cx + x * scale, cy - y * scale, 4, 0, Math.PI * 2);
      ctx.fill();
      if (!done) raf.current = requestAnimationFrame(step);
    };
    setResult("Flying…");
    step();
  };
  useEffect(() => {
    fire(false);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SimShell side={<canvas ref={ref} width={420} height={420} className="sim-canvas" aria-label="Newton's cannon orbit simulation" />}>
      <Readout label="Launch speed (horizontal, from 400 km)" value={v0.toFixed(2)} unit="km/s" />
      <Slider label="Cannon speed" value={v0} min={4} max={11.5} step={0.05} display={`${v0.toFixed(2)} km/s`} onChange={setV0} />
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn primary sm" onClick={() => fire(true)}>🔥 Fire cannon</button>
        <Chips options={[6, 7.67, 9, 11]} value={v0} onChange={(v) => setV0(v)} render={(v) => `${v}`} />
      </div>
      <p style={{ marginTop: 16, fontWeight: 700 }}>{result}</p>
      <p className="muted" style={{ fontSize: "0.85rem" }}>Mountain height exaggerated. Real physics: v² ∝ GM/r integrated every 5 seconds of flight.</p>
    </SimShell>
  );
}

/* ---------- 4. Hohmann ---------- */
const HOH = [
  { name: "LEO → GEO", mu: 398600.4418, r1: 6778, r2: 42164, unit: "km", body: "Earth" },
  { name: "Earth → Venus", mu: 1.32712e11, r1: 1.496e8, r2: 1.082e8, unit: "km", body: "Sun" },
  { name: "Earth → Mars", mu: 1.32712e11, r1: 1.496e8, r2: 2.279e8, unit: "km", body: "Sun" },
  { name: "Earth → Jupiter", mu: 1.32712e11, r1: 1.496e8, r2: 7.785e8, unit: "km", body: "Sun" },
];
export function HohmannSim() {
  const touch = useTouch("hohmann");
  const [i, setI] = useState(2);
  const h = HOH[i];
  const { r1, r2, mu } = h;
  const dv1 = Math.sqrt(mu / r1) * (Math.sqrt((2 * r2) / (r1 + r2)) - 1);
  const dv2 = Math.sqrt(mu / r2) * (1 - Math.sqrt((2 * r1) / (r1 + r2)));
  const t = Math.PI * Math.sqrt(((r1 + r2) / 2) ** 3 / mu);
  const days = t / 86400;
  const max = Math.max(r1, r2);
  const s = 90 / max;
  const a = ((r1 + r2) / 2) * s;
  const c = a - Math.min(r1, r2) * s; // focus offset
  const b = Math.sqrt(a * a - c * c);
  const outward = r2 > r1;
  return (
    <SimShell
      side={
        <svg viewBox="-110 -110 220 220" className="sim-canvas" role="img" aria-label="Hohmann transfer diagram">
          <circle r="6" fill={h.body === "Sun" ? "#f5d34a" : "#4fb3ff"} />
          <circle r={r1 * s} fill="none" stroke="#4fb3ff" strokeOpacity="0.6" />
          <circle r={r2 * s} fill="none" stroke="#ff7a59" strokeOpacity="0.6" />
          <path
            d={outward ? `M ${r1 * s} 0 A ${a} ${b} 0 0 1 ${-r2 * s} 0` : `M ${r1 * s} 0 A ${a} ${b} 0 0 1 ${-r2 * s} 0`}
            fill="none"
            stroke="#f5d34a"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <circle cx={r1 * s} r="4" fill="#4fb3ff" />
          <circle cx={-r2 * s} r="4" fill="#ff7a59" />
          <text x={r1 * s + 6} y="-6" fontSize="8" fill="#9aa">burn 1</text>
          <text x={-r2 * s - 4} y="-8" fontSize="8" fill="#9aa" textAnchor="end">burn 2</text>
        </svg>
      }
    >
      <Chips options={HOH.map((_, k) => k)} value={i} onChange={(v) => { touch(); setI(v); }} render={(k) => HOH[k].name} />
      <div className="grid g2" style={{ marginTop: 18, gap: 14 }}>
        <Readout label="Burn 1 (depart)" value={Math.abs(dv1).toFixed(2)} unit="km/s" />
        <Readout label="Burn 2 (arrive)" value={Math.abs(dv2).toFixed(2)} unit="km/s" />
        <Readout label="Total Δv" value={(Math.abs(dv1) + Math.abs(dv2)).toFixed(2)} unit="km/s" />
        <Readout label="Flight time" value={days < 2 ? (days * 24).toFixed(1) : fmt(days, 0)} unit={days < 2 ? "hours" : "days"} />
      </div>
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 14 }}>
        {h.body === "Sun" ? "Heliocentric Δv relative to the planets' orbital speeds — excludes escaping Earth and capturing at the target." : "LEO at 400 km altitude to geostationary orbit (ignoring plane change)."}
      </p>
    </SimShell>
  );
}

/* ---------- 5. Kepler ---------- */
const PLANETS = [
  { n: "Mercury", a: 0.387 }, { n: "Venus", a: 0.723 }, { n: "Earth", a: 1 }, { n: "Mars", a: 1.524 },
  { n: "Ceres", a: 2.77 }, { n: "Jupiter", a: 5.203 }, { n: "Saturn", a: 9.537 }, { n: "Uranus", a: 19.19 }, { n: "Neptune", a: 30.07 }, { n: "Pluto", a: 39.48 },
];
export function KeplerSim() {
  const touch = useTouch("kepler");
  const [la, setLa] = useState(0); // log10 AU
  const a = 10 ** la;
  const P = Math.sqrt(a ** 3);
  const v = 29.78 / Math.sqrt(a);
  const nearest = PLANETS.reduce((b, p) => (Math.abs(Math.log(p.a / a)) < Math.abs(Math.log(b.a / a)) ? p : b));
  return (
    <SimShell
      side={
        <svg viewBox="-110 -110 220 220" className="sim-canvas" role="img" aria-label="Orbit size comparison">
          <circle r="5" fill="#f5d34a" />
          {PLANETS.map((p) => (
            <circle key={p.n} r={10 + (Math.log10(p.a) + 0.5) * 45} fill="none" stroke="#fff" strokeOpacity="0.1" />
          ))}
          <circle r={10 + (la + 0.5) * 45} fill="none" stroke="#f5d34a" strokeWidth="2">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${Math.min(60, 3 * P ** 0.5)}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={10 + (la + 0.5) * 45} r="5" fill="#2bb3c0">
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur={`${Math.min(60, 3 * P ** 0.5)}s`} repeatCount="indefinite" />
          </circle>
          <text y="104" fontSize="8" fill="#9aa" textAnchor="middle">log scale</text>
        </svg>
      }
    >
      <div className="grid g2" style={{ gap: 14 }}>
        <Readout label="Orbital period" value={P < 1 ? fmt(P * 365.25, 0) : fmt(P, P < 10 ? 2 : 1)} unit={P < 1 ? "days" : "years"} />
        <Readout label="Mean orbital speed" value={fmt(v, 1)} unit="km/s" />
      </div>
      <Slider label="Distance from Sun (semi-major axis)" value={la} min={-0.6} max={1.7} step={0.01} display={`${fmt(a, 2)} AU`} onChange={(x) => { touch(); setLa(x); }} />
      <p className="muted" style={{ fontSize: "0.88rem", marginTop: 12 }}>Closest real world: <b style={{ color: "var(--fg)" }}>{nearest.n}</b> at {nearest.a} AU.</p>
      <div className="row" style={{ gap: 6 }}>
        {PLANETS.map((p) => (
          <button key={p.n} className="chip" onClick={() => { touch(); setLa(Math.log10(p.a)); }}>{p.n}</button>
        ))}
      </div>
    </SimShell>
  );
}

/* ---------- 6. Wien / star colour ---------- */
function spectralClass(T: number) {
  if (T >= 30000) return ["O", "Blue — e.g. Mintaka's primary"];
  if (T >= 10000) return ["B", "Blue-white — e.g. Rigel"];
  if (T >= 7500) return ["A", "White — e.g. Sirius, Vega"];
  if (T >= 6000) return ["F", "Yellow-white — e.g. Procyon"];
  if (T >= 5200) return ["G", "Yellow — e.g. the Sun"];
  if (T >= 3700) return ["K", "Orange — e.g. Arcturus"];
  return ["M", "Red — e.g. Betelgeuse, Proxima Centauri"];
}
export function WienSim() {
  const touch = useTouch("wien");
  const [T, setT] = useState(5772);
  const lam = 2.898e6 / T;
  const [cls, ex] = spectralClass(T);
  const col = kelvinToRgb(T);
  const band = lam < 400 ? "ultraviolet" : lam > 700 ? "infrared" : "visible";
  return (
    <SimShell
      side={
        <div className="sim-canvas" style={{ aspectRatio: "1", display: "grid", placeItems: "center" }}>
          <div style={{ width: "46%", aspectRatio: "1", borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, #fff, ${col} 45%, ${col})`, boxShadow: `0 0 60px 20px ${col}` }} />
        </div>
      }
    >
      <div className="grid g2" style={{ gap: 14 }}>
        <Readout label="Peak wavelength" value={fmt(lam, 0)} unit="nm" />
        <Readout label="Spectral class" value={cls} />
      </div>
      <p className="muted" style={{ marginTop: 8 }}>{ex} · peak in the {band}</p>
      <Slider label="Surface temperature" value={T} min={2500} max={40000} step={50} display={`${fmt(T, 0)} K`} onChange={(v) => { touch(); setT(v); }} />
      <div className="row" style={{ marginTop: 14, gap: 6 }}>
        {[["Betelgeuse", 3600], ["Sun", 5772], ["Sirius", 9940], ["Rigel", 12100], ["O-star", 35000]].map(([n, t]) => (
          <button key={n} className="chip" onClick={() => { touch(); setT(t as number); }}>{n}</button>
        ))}
      </div>
    </SimShell>
  );
}

/* ---------- 7. Schwarzschild ---------- */
const BH = [
  ["Earth", 3.003e-6], ["Sun", 1], ["Cygnus X-1", 21], ["GW150914", 62], ["Sgr A*", 4.3e6], ["M87*", 6.5e9],
] as const;
export function SchwarzschildSim() {
  const touch = useTouch("schwarzschild");
  const [lm, setLm] = useState(0);
  const M = 10 ** lm;
  const rkm = 2.953 * M;
  const pretty = rkm < 1 ? `${fmt(rkm * 1e6, 1)} mm` : rkm < 1e6 ? `${fmt(rkm, 2)} km` : `${fmt(rkm / 1.496e8, 3)} AU`;
  const compare = rkm < 0.01 ? "about the size of a marble" : rkm < 50 ? "about the size of a city" : rkm < 7e5 ? "smaller than the Sun" : rkm < 1.5e8 ? "larger than the Sun, inside Earth's orbit" : rkm < 4.5e9 ? "bigger than the inner solar system" : "bigger than the orbit of Neptune";
  return (
    <SimShell
      side={
        <div className="sim-canvas" style={{ aspectRatio: "1", display: "grid", placeItems: "center", overflow: "hidden" }}>
          <div style={{ width: `${20 + ((lm + 6) / 16) * 60}%`, aspectRatio: "1", borderRadius: "50%", background: "#000", boxShadow: "0 0 0 6px rgba(245,211,74,.6), 0 0 50px 18px rgba(255,140,40,.45)" }} />
        </div>
      }
    >
      <Readout label="Event horizon radius" value={pretty} />
      <p className="muted" style={{ marginTop: 6 }}>{compare}</p>
      <Slider label="Mass" value={lm} min={-6} max={10} step={0.05} display={`${fmtSci(M, 2)} M☉`} onChange={(v) => { touch(); setLm(v); }} />
      <div className="row" style={{ marginTop: 14, gap: 6 }}>
        {BH.map(([n, m]) => (
          <button key={n} className="chip" onClick={() => { touch(); setLm(Math.log10(m)); }}>{n}</button>
        ))}
      </div>
    </SimShell>
  );
}

/* ---------- 8. Hubble ---------- */
export function HubbleSim() {
  const touch = useTouch("hubble");
  const [d, setD] = useState(100);
  const [H0, setH0] = useState(70);
  const v = H0 * d;
  const z = v / 299792;
  return (
    <SimShell>
      <div className="grid g3" style={{ gap: 14 }}>
        <Readout label="Recession velocity" value={fmt(v, 0)} unit="km/s" />
        <Readout label="Redshift (z ≈ v/c)" value={z.toFixed(3)} />
        <Readout label="Distance" value={fmt(d * 3.2616, 0)} unit="million ly" />
      </div>
      <Slider label="Distance" value={d} min={1} max={1000} display={`${d} Mpc`} onChange={(x) => { touch(); setD(x); }} />
      <div style={{ marginTop: 14 }}>
        <div className="muted" style={{ fontSize: "0.85rem", marginBottom: 6 }}>Hubble constant H₀ (km/s/Mpc)</div>
        <Chips options={[67.4, 70, 73]} value={H0} onChange={(v) => { touch(); setH0(v); }} render={(v) => (v === 67.4 ? "67.4 · Planck CMB" : v === 73 ? "73 · SH0ES ladder" : "70 · round number")} />
      </div>
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 14 }}>
        The ~9% gap between 67.4 and 73 is the "Hubble tension". Above z ≈ 0.1 this simple linear law starts to break down.
      </p>
    </SimShell>
  );
}

/* ---------- 9. Telescope ---------- */
export function TelescopeSim() {
  const touch = useTouch("telescope");
  const [D, setD] = useState(130);
  const [F, setF] = useState(900);
  const [ep, setEp] = useState(10);
  const mag = F / ep;
  const maxMag = 2 * D;
  const light = (D / 7) ** 2;
  const lim = 2.7 + 5 * Math.log10(D);
  const dawes = 116 / D;
  const exit = D / mag;
  return (
    <SimShell>
      <div className="grid g3" style={{ gap: 14 }}>
        <Readout label="Magnification" value={`${fmt(mag, 0)}×`} tone={mag > maxMag ? "warn" : undefined} />
        <Readout label="Light vs your eye" value={`${fmt(light, 0)}×`} />
        <Readout label="Faintest stars" value={`mag ${lim.toFixed(1)}`} />
        <Readout label="Resolution (Dawes)" value={dawes.toFixed(2)} unit="arcsec" />
        <Readout label="Focal ratio" value={`f/${(F / D).toFixed(1)}`} />
        <Readout label="Exit pupil" value={exit.toFixed(1)} unit="mm" />
      </div>
      {mag > maxMag && <p className="status-warn" style={{ marginTop: 10 }}>Above ~{maxMag}× the image just gets blurry — "empty magnification".</p>}
      <Slider label="Aperture" value={D} min={50} max={400} step={5} display={`${D} mm`} onChange={(v) => { touch(); setD(v); }} />
      <Slider label="Telescope focal length" value={F} min={300} max={3000} step={10} display={`${F} mm`} onChange={(v) => { touch(); setF(v); }} />
      <Slider label="Eyepiece focal length" value={ep} min={3} max={40} display={`${ep} mm`} onChange={(v) => { touch(); setEp(v); }} />
    </SimShell>
  );
}

/* ---------- 10. Transit ---------- */
export function TransitSim() {
  const touch = useTouch("transit");
  const [rp, setRp] = useState(11.2); // Earth radii
  const [rs, setRs] = useState(1); // Solar radii
  const ratio = (rp * 6371) / (rs * 696340);
  const depth = ratio ** 2;
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT(((now - start) / 4000) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const starR = 50;
  const pR = Math.max(1.5, starR * ratio);
  const px = -90 + t * 180;
  // light curve
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = -90 + (i / 100) * 180;
    const overlap = Math.max(0, Math.min(1, (starR + pR - Math.abs(x)) / (2 * pR)));
    const f = 1 - depth * overlap;
    pts.push(`${(i / 100) * 200},${20 + (1 - f) * (60 / Math.max(depth, 0.002))}`);
  }
  const overlapNow = Math.max(0, Math.min(1, (starR + pR - Math.abs(px)) / (2 * pR)));
  return (
    <SimShell
      side={
        <svg viewBox="0 0 200 220" className="sim-canvas" role="img" aria-label="Planet crossing a star with light curve">
          <g transform="translate(100 70)">
            <circle r={starR} fill={kelvinToRgb(5800)} />
            <circle cx={px} r={pR} fill="#0b0b0c" />
          </g>
          <g transform="translate(0 135)">
            <polyline points={pts.join(" ")} fill="none" stroke="#f5d34a" strokeWidth="1.5" />
            <circle cx={t * 200} cy={20 + depth * overlapNow * (60 / Math.max(depth, 0.002))} r="3" fill="#2bb3c0" />
            <text x="4" y="12" fontSize="7" fill="#9aa">brightness</text>
          </g>
        </svg>
      }
    >
      <Readout label="Transit depth" value={depth >= 0.001 ? `${(depth * 100).toFixed(2)}%` : `${fmt(depth * 1e6, 0)} ppm`} />
      <Slider label="Planet radius" value={rp} min={0.5} max={20} step={0.1} display={`${rp.toFixed(1)} R⊕`} onChange={(v) => { touch(); setRp(v); }} />
      <Slider label="Star radius" value={rs} min={0.1} max={3} step={0.05} display={`${rs.toFixed(2)} R☉`} onChange={(v) => { touch(); setRs(v); }} />
      <div className="row" style={{ marginTop: 14, gap: 6 }}>
        <button className="chip" onClick={() => { setRp(1); setRs(1); }}>Earth / Sun</button>
        <button className="chip" onClick={() => { setRp(11.2); setRs(1); }}>Jupiter / Sun</button>
        <button className="chip" onClick={() => { setRp(1.1); setRs(0.12); }}>TRAPPIST-1e</button>
      </div>
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 12 }}>Small stars make small planets easier to find — the dip is deeper.</p>
    </SimShell>
  );
}

/* ---------- 11. Exposure ---------- */
export function ExposureSim() {
  const touch = useTouch("exposure");
  const [iso, setIso] = useState(3200);
  const [N, setN] = useState(2.8);
  const [t, setT] = useState(20);
  const [fl, setFl] = useState(20);
  const stops = Math.log2((t * iso) / (N * N) / ((20 * 3200) / (2.8 * 2.8)));
  const maxT = 500 / fl;
  const trailing = t > maxT;
  const bright = Math.pow(2, stops);
  const noise = Math.min(0.55, Math.log2(iso / 400) * 0.08);
  const stars = useMemo(() => Array.from({ length: 90 }, () => [Math.random() * 300, Math.random() * 200, Math.random() ** 3 * 1.6 + 0.4]), []);
  const verdict = stops > 1.5 ? ["Overexposed — sky turns grey", "warn"] : stops < -1.5 ? ["Underexposed — faint stars vanish", "warn"] : ["Nicely exposed", "ok"];
  return (
    <SimShell
      side={
        <div style={{ position: "relative" }}>
          <svg viewBox="0 0 300 200" className="sim-canvas" style={{ filter: `brightness(${Math.min(3, Math.max(0.15, bright))})` }} role="img" aria-label="Preview of a night-sky exposure">
            <defs>
              <linearGradient id="mw" x1="0" x2="1" y1="1" y2="0">
                <stop offset="0" stopColor="#000" stopOpacity="0" />
                <stop offset="0.5" stopColor="#b9a7d6" stopOpacity="0.25" />
                <stop offset="1" stopColor="#000" stopOpacity="0" />
              </linearGradient>
              <filter id="grain"><feTurbulence baseFrequency="0.9" numOctaves="1" seed="3" /><feColorMatrix type="saturate" values="0" /></filter>
            </defs>
            <rect width="300" height="200" fill="#070912" />
            <rect width="300" height="200" fill="url(#mw)" />
            {stars.map(([x, y, r], k) => (
              trailing ? (
                <line key={k} x1={x} y1={y} x2={x + Math.min(14, (t - maxT) * 0.6)} y2={y - Math.min(6, (t - maxT) * 0.25)} stroke="#fff" strokeWidth={r} strokeLinecap="round" />
              ) : (
                <circle key={k} cx={x} cy={y} r={r} fill="#fff" />
              )
            ))}
            <path d="M0 200 L0 170 Q 40 150 80 165 T 160 160 T 240 150 T 300 165 L300 200 Z" fill="#000" />
            <rect width="300" height="200" filter="url(#grain)" opacity={noise} />
          </svg>
        </div>
      }
    >
      <Readout label="Exposure vs Milky Way baseline (f/2.8 · 20 s · ISO 3200)" value={`${stops >= 0 ? "+" : ""}${stops.toFixed(1)}`} unit="stops" />
      <p className={verdict[1] === "ok" ? "status-ok" : "status-warn"}>{verdict[0]}{trailing ? ` · Stars trailing (limit ≈ ${maxT.toFixed(0)} s at ${fl} mm)` : ""}</p>
      <div className="ctrl"><span className="muted" style={{ fontSize: "0.88rem" }}>ISO</span><Chips options={[400, 800, 1600, 3200, 6400, 12800]} value={iso} onChange={(v) => { touch(); setIso(v); }} /></div>
      <div className="ctrl"><span className="muted" style={{ fontSize: "0.88rem" }}>Aperture</span><Chips options={[1.4, 2, 2.8, 4, 5.6]} value={N} onChange={(v) => { touch(); setN(v); }} render={(v) => `f/${v}`} /></div>
      <div className="ctrl"><span className="muted" style={{ fontSize: "0.88rem" }}>Lens focal length</span><Chips options={[14, 20, 24, 35, 50]} value={fl} onChange={(v) => { touch(); setFl(v); }} render={(v) => `${v} mm`} /></div>
      <Slider label="Shutter" value={t} min={1} max={60} display={`${t} s`} onChange={(v) => { touch(); setT(v); }} />
    </SimShell>
  );
}

/* ---------- 12. Rule of 500 ---------- */
export function Rule500Sim() {
  const touch = useTouch("rule500");
  const [f, setF] = useState(20);
  const [crop, setCrop] = useState(1);
  const [N, setN] = useState(2.8);
  const [pitch, setPitch] = useState(5.9);
  const r500 = 500 / (f * crop);
  const r300 = 300 / (f * crop);
  const npf = (35 * N + 30 * pitch) / f;
  return (
    <SimShell>
      <div className="grid g3" style={{ gap: 14 }}>
        <Readout label="Rule of 500" value={r500.toFixed(1)} unit="s" />
        <Readout label="Rule of 300 (strict)" value={r300.toFixed(1)} unit="s" />
        <Readout label="NPF (pixel-sharp)" value={npf.toFixed(1)} unit="s" tone="ok" />
      </div>
      <Slider label="Focal length" value={f} min={8} max={200} display={`${f} mm`} onChange={(v) => { touch(); setF(v); }} />
      <div className="ctrl"><span className="muted" style={{ fontSize: "0.88rem" }}>Sensor (crop factor)</span>
        <Chips options={[1, 1.5, 1.6, 2]} value={crop} onChange={(v) => { touch(); setCrop(v); }} render={(v) => (v === 1 ? "Full frame" : v === 2 ? "Micro 4/3 (2×)" : `APS-C ${v}×`)} />
      </div>
      <div className="ctrl"><span className="muted" style={{ fontSize: "0.88rem" }}>Aperture</span><Chips options={[1.4, 1.8, 2.8, 4]} value={N} onChange={(v) => { touch(); setN(v); }} render={(v) => `f/${v}`} /></div>
      <Slider label="Pixel pitch" value={pitch} min={2} max={9} step={0.1} display={`${pitch.toFixed(1)} µm`} onChange={(v) => { touch(); setPitch(v); }} />
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 12 }}>Pixel pitch ≈ sensor width ÷ pixels across. 24 MP full-frame ≈ 6 µm; 45 MP ≈ 4.4 µm; 24 MP APS-C ≈ 3.9 µm. NPF here uses actual focal length and pitch, so crop factor is already accounted for.</p>
    </SimShell>
  );
}

/* ---------- 13. Stacking ---------- */
export function StackingSim() {
  const touch = useTouch("stacking");
  const [n, setN] = useState(1);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    const img = ctx.createImageData(W, H);
    const sigma = 0.55 / Math.sqrt(n);
    const gauss = () => {
      let u = 0, v = 0;
      while (!u) u = Math.random();
      while (!v) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const dx = (x - W * 0.5) / (W * 0.22), dy = (y - H * 0.5) / (H * 0.3);
        const neb = 0.35 * Math.exp(-(dx * dx + dy * dy)) + 0.12 * Math.exp(-((dx + 0.8) ** 2 + (dy - 0.6) ** 2) * 3);
        const star = ((x * 7919 + y * 104729) % 997 === 0 ? 0.9 : 0);
        const val = neb + star + gauss() * sigma * 0.35;
        const i = (y * W + x) * 4;
        img.data[i] = Math.max(0, Math.min(255, (val * 1.2 + 0.02) * 255));
        img.data[i + 1] = Math.max(0, Math.min(255, (val * 0.5 + 0.02) * 255));
        img.data[i + 2] = Math.max(0, Math.min(255, (val * 0.8 + 0.05) * 255));
        img.data[i + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
  }, [n]);
  return (
    <SimShell side={<canvas ref={ref} width={240} height={160} className="sim-canvas" style={{ imageRendering: "pixelated" }} aria-label="Simulated nebula with noise decreasing as frames are stacked" />}>
      <div className="grid g2" style={{ gap: 14 }}>
        <Readout label="SNR improvement" value={`${Math.sqrt(n).toFixed(1)}×`} />
        <Readout label="Integration (2-min subs)" value={n * 2 >= 60 ? (n / 30).toFixed(1) : `${n * 2}`} unit={n * 2 >= 60 ? "hours" : "min"} />
      </div>
      <Slider label="Frames stacked" value={n} min={1} max={100} display={`${n}`} onChange={(v) => { touch(); setN(v); }} />
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 12 }}>Notice the diminishing returns: going from 1 → 4 frames halves the noise, but you need 16 to halve it again.</p>
    </SimShell>
  );
}

/* ---------- 14. Lift ---------- */
export function LiftSim() {
  const touch = useTouch("lift");
  const [v, setV] = useState(55);
  const [aoa, setAoa] = useState(5);
  const [alt, setAlt] = useState(0);
  const rho = 1.225 * Math.exp(-alt / 8500);
  const S = 16.2, m = 1100;
  const stalled = aoa > 15;
  const CL = stalled ? 0.8 : 0.3 + 0.1 * aoa;
  const L = 0.5 * rho * v * v * S * CL;
  const W = m * 9.81;
  const ratio = L / W;
  const state = stalled ? ["⚠ STALL — airflow separated, lift collapsed", "warn"] : ratio > 1.05 ? ["Climbing ↗", "ok"] : ratio > 0.95 ? ["Level flight —", "ok"] : ["Sinking ↘ — need more speed or angle", "warn"];
  return (
    <SimShell
      side={
        <svg viewBox="0 0 200 160" className="sim-canvas" role="img" aria-label="Wing with lift and weight arrows">
          <g transform={`translate(100 85) rotate(${-aoa})`}>
            <path d="M -60 0 Q -40 -16 20 -8 Q 50 -4 60 0 Q 20 6 -60 0 Z" fill="#e8edf3" />
            {Array.from({ length: 5 }, (_, k) => (
              <path key={k} d={`M -90 ${-30 + k * 14} q 60 ${stalled && k < 2 ? 10 : -6} 180 ${stalled && k < 2 ? -8 : 10}`} stroke="#2bb3c0" strokeOpacity="0.5" fill="none" strokeDasharray={stalled && k < 2 ? "2 4" : undefined} />
            ))}
          </g>
          <line x1="100" y1="85" x2="100" y2={85 - Math.min(70, 40 * ratio)} stroke="#4ade80" strokeWidth="4" />
          <line x1="100" y1="85" x2="100" y2="125" stroke="#ff7a59" strokeWidth="4" />
          <text x="108" y={85 - Math.min(70, 40 * ratio) + 8} fontSize="9" fill="#4ade80">lift</text>
          <text x="108" y="124" fontSize="9" fill="#ff7a59">weight</text>
        </svg>
      }
    >
      <div className="grid g2" style={{ gap: 14 }}>
        <Readout label="Lift" value={fmt(L / 1000, 1)} unit="kN" />
        <Readout label="Lift ÷ weight" value={ratio.toFixed(2)} tone={ratio >= 0.95 && !stalled ? "ok" : "warn"} />
      </div>
      <p className={state[1] === "ok" ? "status-ok" : "status-warn"}>{state[0]}</p>
      <Slider label="Airspeed" value={v} min={0} max={100} display={`${v} m/s (${fmt(v * 1.944, 0)} kt)`} onChange={(x) => { touch(); setV(x); }} />
      <Slider label="Angle of attack" value={aoa} min={0} max={20} display={`${aoa}°`} onChange={(x) => { touch(); setAoa(x); }} />
      <Slider label="Altitude" value={alt} min={0} max={6000} step={100} display={`${alt} m · ρ = ${rho.toFixed(3)}`} onChange={(x) => { touch(); setAlt(x); }} />
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 12 }}>Modelled on a light four-seat aircraft: 16.2 m² wing, 1,100 kg. Simplified C_L = 0.3 + 0.1 × angle, stall above 15°.</p>
    </SimShell>
  );
}

/* ---------- 15. Moon phase ---------- */
export function MoonIcon({ frac, size = 120 }: { frac: number; size?: number }) {
  const r = 50;
  const k = Math.cos(2 * Math.PI * frac);
  const waxing = frac < 0.5;
  const rx = Math.abs(k) * r;
  const sweep = k > 0 ? 0 : 1;
  return (
    <svg viewBox="-60 -60 120 120" width={size} height={size} role="img" aria-label="Moon phase">
      <defs>
        <radialGradient id="mlit" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="1" stopColor="#cfc6a8" />
        </radialGradient>
      </defs>
      <circle r={r} fill="#1a1c24" />
      <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${rx} ${r} 0 0 ${sweep} 0 ${-r} Z`} fill="url(#mlit)" transform={waxing ? undefined : "scale(-1 1)"} />
      <circle r={r} fill="none" stroke="#fff" strokeOpacity="0.08" />
    </svg>
  );
}
export function MoonSim() {
  const touch = useTouch("moon");
  const [off, setOff] = useState(0);
  const date = new Date(Date.now() + off * 864e5);
  const m = moonPhase(date);
  return (
    <SimShell side={<div className="sim-canvas" style={{ display: "grid", placeItems: "center", aspectRatio: "1.3" }}><MoonIcon frac={m.frac} size={160} /></div>}>
      <Readout label={date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })} value={m.name} />
      <p className="muted">{Math.round(m.illum * 100)}% illuminated · {m.age.toFixed(1)} days since new moon</p>
      <Slider label="Days from today" value={off} min={-15} max={30} display={off === 0 ? "today" : `${off > 0 ? "+" : ""}${off} d`} onChange={(v) => { touch(); setOff(v); }} />
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 12 }}>Shown as seen from the northern hemisphere; flip left–right for the southern hemisphere.</p>
    </SimShell>
  );
}

/* ---------- Registry ---------- */
export const SIMS: Record<string, { title: string; track: string; blurb: string; C: ComponentType }> = {
  thruster: { title: "Thruster simulator", track: "aerospace", blurb: "Throttle up and see if you reach orbit.", C: ThrusterSim },
  "rocket-eq": { title: "Rocket equation & staging", track: "aerospace", blurb: "Trade engine efficiency, mass ratio and stages for delta-v.", C: RocketEqSim },
  orbit: { title: "Newton's cannon", track: "aerospace", blurb: "Fire a cannonball fast enough to fall around Earth.", C: OrbitSim },
  hohmann: { title: "Hohmann transfer planner", track: "aerospace", blurb: "Delta-v and travel time between orbits and planets.", C: HohmannSim },
  lift: { title: "Wing lift lab", track: "aerospace", blurb: "Speed, angle of attack and air density vs. weight.", C: LiftSim },
  kepler: { title: "Kepler's third law", track: "astronomy", blurb: "Slide a planet outward and watch its year stretch.", C: KeplerSim },
  telescope: { title: "Telescope calculator", track: "astronomy", blurb: "Magnification, light grasp, resolution and limits.", C: TelescopeSim },
  transit: { title: "Exoplanet transit", track: "astronomy", blurb: "Watch a planet dim its star and draw a light curve.", C: TransitSim },
  moon: { title: "Moon phase explorer", track: "astronomy", blurb: "See the Moon's phase for any day this month.", C: MoonSim },
  wien: { title: "Star colour thermometer", track: "astrophysics", blurb: "Wien's law: temperature → colour → spectral class.", C: WienSim },
  schwarzschild: { title: "Black hole sizer", track: "astrophysics", blurb: "Event horizon radius from Earth-mass to M87*.", C: SchwarzschildSim },
  hubble: { title: "Hubble's law", track: "astrophysics", blurb: "Distance → recession speed → redshift.", C: HubbleSim },
  exposure: { title: "Night exposure triangle", track: "astrophotography", blurb: "ISO, aperture and shutter on a live preview.", C: ExposureSim },
  rule500: { title: "Rule of 500 & NPF", track: "astrophotography", blurb: "Longest exposure before stars trail.", C: Rule500Sim },
  stacking: { title: "Stacking & noise", track: "astrophotography", blurb: "Stack frames and watch the noise melt away.", C: StackingSim },
};
