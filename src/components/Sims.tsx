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

/* ---------- 16. Unit converter ---------- */
const DIST_UNITS = [
  { id: "km", label: "km", km: 1 },
  { id: "au", label: "AU", km: 1.495978707e8 },
  { id: "ly", label: "light-years", km: 9.4607e12 },
  { id: "pc", label: "parsecs", km: 3.0857e13 },
] as const;
const DIST_PRESETS: [string, number, (typeof DIST_UNITS)[number]["id"]][] = [
  ["Moon", 384400, "km"], ["Sun", 1, "au"], ["Neptune", 30.07, "au"], ["Proxima Centauri", 4.24, "ly"], ["Galactic centre", 8.2, "pc"], ["Andromeda", 2.5e6, "ly"],
];
export function UnitsSim() {
  const touch = useTouch("units");
  const [val, setVal] = useState("4.24");
  const [unit, setUnit] = useState<(typeof DIST_UNITS)[number]["id"]>("ly");
  const n = parseFloat(val);
  const km = n * DIST_UNITS.find((u) => u.id === unit)!.km;
  const lightTime = (km * 1000) / 299792458; // seconds
  const lt = lightTime < 120 ? `${fmt(lightTime, 1)} s` : lightTime < 7200 ? `${fmt(lightTime / 60, 1)} min` : lightTime < 2 * 86400 * 365.25 ? `${fmt(lightTime / 3600, 1)} h` : `${fmtSci(lightTime / (86400 * 365.25), 3)} years`;
  return (
    <SimShell>
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <input className="field" inputMode="decimal" value={val} onChange={(e) => { touch(); setVal(e.target.value); }} aria-label="Distance value" style={{ maxWidth: 200 }} />
        <Chips options={DIST_UNITS.map((u) => u.id)} value={unit} onChange={(v) => { touch(); setUnit(v); }} render={(v) => DIST_UNITS.find((u) => u.id === v)!.label} />
      </div>
      <div className="grid g2" style={{ gap: 14, marginTop: 18 }}>
        {DIST_UNITS.map((u) => (
          <Readout key={u.id} label={u.label} value={Number.isFinite(km) ? fmtSci(km / u.km, 3) : "—"} />
        ))}
      </div>
      <p className="muted" style={{ marginTop: 14 }}>💡 Light takes <b style={{ color: "var(--fg)" }}>{Number.isFinite(km) ? lt : "—"}</b> to cross this distance.</p>
      <div className="row" style={{ gap: 6 }}>
        {DIST_PRESETS.map(([name, v, u]) => (
          <button key={name} className="chip" onClick={() => { touch(); setVal(String(v)); setUnit(u); }}>{name}</button>
        ))}
      </div>
    </SimShell>
  );
}

/* ---------- 17. Angular size (small-angle formula) ---------- */
const ANG_PRESETS: [string, number, number][] = [
  ["Moon", 3474, 384400], ["Sun", 1.3927e6, 1.496e8], ["Jupiter (closest)", 139820, 5.88e8], ["ISS overhead", 0.109, 420], ["Coin at 100 m", 0.0000243, 0.1],
];
function fmtAngle(arcsec: number) {
  if (!Number.isFinite(arcsec)) return "—";
  if (arcsec >= 3600) return `${fmt(arcsec / 3600, 2)}°`;
  if (arcsec >= 60) return `${fmt(arcsec / 60, 2)}′`;
  return `${fmt(arcsec, arcsec < 1 ? 3 : 1)}″`;
}
export function AngularSim() {
  const touch = useTouch("angular");
  const [size, setSize] = useState(3474);
  const [dist, setDist] = useState(384400);
  const rad = 2 * Math.atan(size / (2 * dist));
  const arcsec = (rad * 180 * 3600) / Math.PI;
  const approx = (206265 * size) / dist;
  const eyeOK = arcsec >= 60;
  return (
    <SimShell>
      <div className="grid g2" style={{ gap: 14 }}>
        <Readout label="Angular size" value={fmtAngle(arcsec)} />
        <Readout label="Small-angle estimate (206,265 × s / d)" value={fmtAngle(approx)} />
      </div>
      <p className={eyeOK ? "status-ok" : "muted"}>{eyeOK ? "Big enough for the eye to see as a disc (≈1′ limit)." : "Smaller than ~1′ — it looks like a point without a telescope."}</p>
      <label className="ctrl"><span className="spread"><span>Object size (km)</span></span>
        <input className="field" inputMode="decimal" value={size} onChange={(e) => { touch(); setSize(parseFloat(e.target.value) || 0); }} aria-label="Object size in km" />
      </label>
      <label className="ctrl"><span className="spread"><span>Distance (km)</span></span>
        <input className="field" inputMode="decimal" value={dist} onChange={(e) => { touch(); setDist(parseFloat(e.target.value) || 1); }} aria-label="Distance in km" />
      </label>
      <div className="row" style={{ gap: 6, marginTop: 14 }}>
        {ANG_PRESETS.map(([n, s, d]) => <button key={n} className="chip" onClick={() => { touch(); setSize(s); setDist(d); }}>{n}</button>)}
      </div>
    </SimShell>
  );
}

/* ---------- 18. Magnitudes ---------- */
const MAG_PRESETS: [string, number][] = [["Sun", -26.74], ["Full Moon", -12.7], ["Venus (max)", -4.9], ["Sirius", -1.46], ["Vega", 0.03], ["Polaris", 1.98], ["Naked-eye limit", 6.5], ["Pluto", 14.4]];
export function MagnitudeSim() {
  const touch = useTouch("magnitude");
  const [m1, setM1] = useState(-1.46);
  const [m2, setM2] = useState(1.98);
  const [absM, setAbsM] = useState(4.83);
  const [dpc, setDpc] = useState(10);
  const ratio = Math.pow(10, -0.4 * (m1 - m2));
  const apparent = absM + 5 * Math.log10(dpc) - 5;
  return (
    <SimShell
      side={
        <div>
          <div className="muted" style={{ fontSize: "0.85rem", marginBottom: 6 }}>Distance modulus: how bright from far away?</div>
          <Readout label="Apparent magnitude m" value={apparent.toFixed(2)} />
          <Slider label="Absolute magnitude M" value={absM} min={-10} max={15} step={0.01} display={absM.toFixed(2)} onChange={(v) => { touch(); setAbsM(v); }} />
          <Slider label="Distance" value={Math.log10(dpc)} min={-5.3} max={6} step={0.01} display={`${fmtSci(dpc, 3)} pc`} onChange={(v) => { touch(); setDpc(10 ** v); }} />
          <p className="muted" style={{ fontSize: "0.85rem" }}>{apparent <= 6.5 ? "✓ Visible to the naked eye from a dark site." : apparent <= 12 ? "Needs binoculars or a small telescope." : "Needs a large telescope or long exposures."}</p>
          <div className="row" style={{ gap: 6 }}>
            <button className="chip" onClick={() => { setAbsM(4.83); setDpc(10); }}>Sun from 10 pc</button>
            <button className="chip" onClick={() => { setAbsM(4.83); setDpc(1.3); }}>Sun from Proxima</button>
            <button className="chip" onClick={() => { setAbsM(-3.5); setDpc(800000); }}>Cepheid in Andromeda</button>
          </div>
        </div>
      }
    >
      <Readout label="Star A is this many times brighter than star B" value={`${fmtSci(ratio, 3)}×`} />
      <Slider label="Star A magnitude" value={m1} min={-27} max={15} step={0.01} display={m1.toFixed(2)} onChange={(v) => { touch(); setM1(v); }} />
      <Slider label="Star B magnitude" value={m2} min={-27} max={15} step={0.01} display={m2.toFixed(2)} onChange={(v) => { touch(); setM2(v); }} />
      <div className="row" style={{ gap: 6, marginTop: 12 }}>
        {MAG_PRESETS.map(([n, m]) => <button key={n} className="chip" onClick={() => { touch(); setM1(m); }}>{n}</button>)}
      </div>
      <p className="muted" style={{ fontSize: "0.82rem", marginTop: 8 }}>Presets set star A. Ratio = 10^(−0.4 × (m_A − m_B)).</p>
    </SimShell>
  );
}

/* ---------- 19. Parallax ---------- */
export function ParallaxSim() {
  const touch = useTouch("parallax");
  const [lp, setLp] = useState(Math.log10(0.768));
  const p = 10 ** lp;
  const d = 1 / p;
  const shift = Math.min(60, 8 + p * 40);
  return (
    <SimShell
      side={
        <svg viewBox="0 0 220 200" className="sim-canvas" role="img" aria-label="Parallax triangle">
          {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(i * 47) % 220} cy={10 + ((i * 29) % 40)} r="1.2" fill="#fff" opacity="0.6" />)}
          <circle cx="110" cy="170" r="6" fill="#f5d34a" />
          <circle cx="60" cy="170" r="4" fill="#4fb3ff" /><circle cx="160" cy="170" r="4" fill="#4fb3ff" />
          <text x="60" y="190" fontSize="8" fill="#9aa" textAnchor="middle">Jan</text>
          <text x="160" y="190" fontSize="8" fill="#9aa" textAnchor="middle">Jul</text>
          <line x1="60" y1="170" x2="110" y2={70 + 40 / (1 + p)} stroke="#2bb3c0" strokeDasharray="3 3" />
          <line x1="160" y1="170" x2="110" y2={70 + 40 / (1 + p)} stroke="#2bb3c0" strokeDasharray="3 3" />
          <circle cx="110" cy={70 + 40 / (1 + p)} r="4" fill="#fff" />
          <circle cx={110 - shift / 2} cy="30" r="3" fill="#ff7a59" /><circle cx={110 + shift / 2} cy="30" r="3" fill="#ff7a59" />
          <text x="110" y="20" fontSize="8" fill="#ff7a59" textAnchor="middle">apparent shift (exaggerated)</text>
        </svg>
      }
    >
      <div className="grid g2" style={{ gap: 14 }}>
        <Readout label="Distance" value={fmtSci(d, 3)} unit="pc" />
        <Readout label="In light-years" value={fmtSci(d * 3.2616, 3)} unit="ly" />
      </div>
      <Slider label="Parallax angle" value={lp} min={-4.7} max={0} step={0.01} display={p >= 0.001 ? `${fmt(p, 4)}″` : `${fmt(p * 1e6, 0)} µas`} onChange={(v) => { touch(); setLp(v); }} />
      <div className="row" style={{ gap: 6, marginTop: 12 }}>
        <button className="chip" onClick={() => setLp(Math.log10(0.768))}>Proxima Centauri</button>
        <button className="chip" onClick={() => setLp(Math.log10(0.379))}>Sirius</button>
        <button className="chip" onClick={() => setLp(Math.log10(0.287))}>61 Cygni</button>
        <button className="chip" onClick={() => setLp(Math.log10(0.0022))}>Polaris</button>
      </div>
      <p className="muted" style={{ fontSize: "0.85rem", marginTop: 10 }}>d (pc) = 1 / p (″). Ground telescopes manage ~0.01″; ESA's Gaia reaches tens of micro-arcseconds (µas).</p>
    </SimShell>
  );
}

/* ---------- 20. Plate scale & field of view ---------- */
const SENSORS = [
  { id: "ff", label: "Full frame", w: 36, h: 24, px: 5.9 },
  { id: "apsc", label: "APS-C", w: 23.5, h: 15.6, px: 3.9 },
  { id: "585", label: "IMX585 astro cam", w: 11.2, h: 6.3, px: 2.9 },
  { id: "533", label: "IMX533 astro cam", w: 11.3, h: 11.3, px: 3.76 },
];
export function PlateScaleSim() {
  const touch = useTouch("platescale");
  const [focal, setFocal] = useState(480);
  const [aperture, setAperture] = useState(80);
  const [factor, setFactor] = useState(1);
  const [sensor, setSensor] = useState("533");
  const [seeing, setSeeing] = useState(2.5);
  const s = SENSORS.find((x) => x.id === sensor)!;
  const [px, setPx] = useState(s.px);
  const f = focal * factor;
  const scale = (206.265 * px) / f;
  const fovW = (3437.75 * s.w) / f;
  const fovH = (3437.75 * s.h) / f;
  const fr = f / aperture;
  const lo = seeing / 3, hi = seeing / 2;
  const verdict = scale < lo * 0.8 ? ["Oversampled — try 2×2 binning or a reducer", "warn"] : scale > hi * 1.3 ? ["Undersampled — stars may look blocky", "warn"] : ["Well matched to your seeing", "ok"];
  const planetaryFr = [3 * px, 5 * px];
  return (
    <SimShell
      side={
        <div>
          <div className="muted" style={{ fontSize: "0.85rem", marginBottom: 6 }}>Field of view vs the full Moon (31′)</div>
          <svg viewBox="-110 -80 220 160" className="sim-canvas" role="img" aria-label="Field of view compared with the Moon">
            {(() => {
              const k = 150 / Math.max(fovW, 31 * 1.2, 1);
              return (
                <>
                  <circle r={(31 / 2) * k} fill="#cfc6a8" opacity="0.85" />
                  <rect x={(-fovW / 2) * k} y={(-fovH / 2) * k} width={fovW * k} height={fovH * k} fill="none" stroke="#f5d34a" strokeWidth="2" />
                </>
              );
            })()}
          </svg>
          <p className="muted" style={{ fontSize: "0.82rem", marginTop: 8 }}>
            Planets: aim for about f/{planetaryFr[0].toFixed(0)}–f/{planetaryFr[1].toFixed(0)} with these pixels → Barlow ≈ {(planetaryFr[0] / (focal / aperture)).toFixed(1)}×–{(planetaryFr[1] / (focal / aperture)).toFixed(1)}×.
          </p>
        </div>
      }
    >
      <div className="grid g2" style={{ gap: 14 }}>
        <Readout label="Plate scale" value={scale.toFixed(2)} unit="″/px" tone={verdict[1] === "ok" ? "ok" : "warn"} />
        <Readout label="Field of view" value={`${fmt(fovW, 1)}′ × ${fmt(fovH, 1)}′`} />
        <Readout label="Focal ratio" value={`f/${fr.toFixed(1)}`} />
        <Readout label="Ideal for your seeing" value={`${lo.toFixed(2)}–${hi.toFixed(2)}`} unit="″/px" />
      </div>
      <p className={verdict[1] === "ok" ? "status-ok" : "status-warn"}>{verdict[0]}</p>
      <div className="ctrl"><span className="muted" style={{ fontSize: "0.88rem" }}>Camera sensor</span>
        <Chips options={SENSORS.map((x) => x.id)} value={sensor} onChange={(v) => { touch(); setSensor(v); setPx(SENSORS.find((x) => x.id === v)!.px); }} render={(v) => SENSORS.find((x) => x.id === v)!.label} />
      </div>
      <Slider label="Pixel size" value={px} min={1.5} max={9} step={0.01} display={`${px.toFixed(2)} µm`} onChange={(v) => { touch(); setPx(v); }} />
      <Slider label="Telescope focal length" value={focal} min={135} max={4000} step={5} display={`${focal} mm`} onChange={(v) => { touch(); setFocal(v); }} />
      <Slider label="Aperture" value={aperture} min={50} max={400} step={1} display={`${aperture} mm`} onChange={(v) => { touch(); setAperture(v); }} />
      <div className="ctrl"><span className="muted" style={{ fontSize: "0.88rem" }}>Reducer / Barlow</span>
        <Chips options={[0.63, 0.8, 1, 2, 3]} value={factor} onChange={(v) => { touch(); setFactor(v); }} render={(v) => (v === 1 ? "None" : `${v}×`)} />
      </div>
      <Slider label="Seeing (star blur)" value={seeing} min={1} max={5} step={0.1} display={`${seeing.toFixed(1)}″`} onChange={(v) => { touch(); setSeeing(v); }} />
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
  platescale: { title: "Plate scale & field of view", track: "astrophotography", blurb: "Match a camera to a telescope and your seeing.", C: PlateScaleSim },
  units: { title: "Space distance converter", track: "math", blurb: "km, AU, light-years and parsecs — plus light travel time.", C: UnitsSim },
  angular: { title: "Angular size calculator", track: "math", blurb: "How big does it look? The small-angle formula.", C: AngularSim },
  magnitude: { title: "Magnitude calculator", track: "math", blurb: "Brightness ratios and the distance modulus.", C: MagnitudeSim },
  parallax: { title: "Parallax distance", track: "math", blurb: "Turn a tiny angle into a star distance.", C: ParallaxSim },
};
