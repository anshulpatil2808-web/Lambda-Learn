import type { ComponentType, ReactNode } from "react";

/**
 * Simple labelled illustrations for the Launch Pad (5th-grade) lessons.
 * All are inline SVG on a 400×240 canvas so they stay sharp and load instantly.
 */
const T = ({ x, y, children, a = "middle", s = 13, c = "#e8edf3" }: { x: number; y: number; children: ReactNode; a?: "start" | "middle" | "end"; s?: number; c?: string }) => (
  <text x={x} y={y} textAnchor={a} fontSize={s} fill={c} fontFamily="Manrope, sans-serif" fontWeight={700}>{children}</text>
);

function Stars({ n = 40, seed = 1 }: { n?: number; seed?: number }) {
  const pts = Array.from({ length: n }, (_, i) => {
    const r = Math.sin((i + 1) * 999 * seed) * 10000;
    const f = r - Math.floor(r);
    const r2 = Math.sin((i + 7) * 77 * seed) * 10000;
    const g = r2 - Math.floor(r2);
    return [f * 400, g * 240, 0.6 + ((f * 7) % 1) * 1.2];
  });
  return <g fill="#fff" opacity="0.8">{pts.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>;
}

const Space = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <Stars n={50} />
    <defs>
      <linearGradient id="atm" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4fb3ff" stopOpacity="0" /><stop offset="1" stopColor="#4fb3ff" stopOpacity="0.7" /></linearGradient>
    </defs>
    <ellipse cx="200" cy="420" rx="330" ry="260" fill="url(#atm)" />
    <ellipse cx="200" cy="440" rx="300" ry="240" fill="#1d6fb8" />
    <path d="M80 212 q30 -14 60 -4 q20 6 40 -2 q30 -10 60 2" fill="#3aa860" />
    <line x1="10" y1="150" x2="390" y2="150" stroke="#f5d34a" strokeDasharray="6 6" />
    <T x={392} y={142} a="end" c="#f5d34a">Space starts here · about 100 km up</T>
    <T x={200} y={185} c="#cfe8ff">Atmosphere (air)</T>
    <g transform="translate(300 90)"><rect x="-14" y="-4" width="28" height="8" fill="#c7d0db" /><rect x="-36" y="-6" width="18" height="12" fill="#2b5c9e" /><rect x="18" y="-6" width="18" height="12" fill="#2b5c9e" /></g>
    <T x={300} y={78} s={11} c="#9aa">Space station · 400 km</T>
  </>
);

const DayNight = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <Stars n={30} seed={2} />
    <circle cx="40" cy="120" r="70" fill="#f5d34a" />
    <circle cx="40" cy="120" r="90" fill="#f5d34a" opacity="0.15" />
    {[0, 1, 2, 3].map((i) => <line key={i} x1="120" y1={70 + i * 33} x2="215" y2={70 + i * 33} stroke="#f5d34a" strokeOpacity="0.5" strokeDasharray="4 6" />)}
    <g transform="translate(280 120)">
      <circle r="70" fill="#1d6fb8" />
      <path d="M -20 -50 q 20 10 30 -5 q 15 20 -5 35 q -20 10 -10 30 q -25 -5 -15 -60z" fill="#3aa860" />
      <path d="M 0 -70 A 70 70 0 0 1 0 70 Z" fill="#000" opacity="0.6" />
      <path d="M 0 -95 A 95 95 0 0 1 80 -50" fill="none" stroke="#fff" strokeWidth="2" markerEnd="url(#arr)" />
    </g>
    <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="#fff" /></marker></defs>
    <T x={245} y={128}>DAY</T>
    <T x={318} y={128}>NIGHT</T>
    <T x={320} y={18} s={12}>Earth spins once a day</T>
    <T x={40} y={210} c="#f5d34a">Sun</T>
  </>
);

const PLANETS: [string, number, string][] = [
  ["Mercury", 5, "#a39b8f"], ["Venus", 9, "#e3c27a"], ["Earth", 9.5, "#3d8fd6"], ["Mars", 6, "#d0603a"],
  ["Jupiter", 30, "#d9a66e"], ["Saturn", 25, "#e7cf8f"], ["Uranus", 14, "#8fd8e0"], ["Neptune", 13.5, "#4a6fe3"],
];
const Planets = () => {
  let x = 46;
  return (
    <>
      <rect width="400" height="240" fill="#05070f" />
      <Stars n={30} seed={3} />
      <circle cx="-60" cy="120" r="100" fill="#f5d34a" />
      {PLANETS.map(([n, r, c], i) => {
        x += i === 0 ? 0 : PLANETS[i - 1][1] + r + 8;
        const cx = x;
        return (
          <g key={n}>
            {n === "Saturn" && <ellipse cx={cx} cy="120" rx={r * 1.8} ry={r * 0.45} fill="none" stroke="#f3d6a4" strokeWidth="3" />}
            <circle cx={cx} cy="120" r={r} fill={c} />
            <T x={cx} y={i % 2 ? 185 : 70} s={11}>{n}</T>
          </g>
        );
      })}
      <T x={200} y={225} s={11} c="#9aa">Sizes roughly to scale · distances are NOT!</T>
    </>
  );
};

const Constellation = () => {
  const dipper: [number, number][] = [[70, 150], [120, 130], [165, 135], [205, 150], [215, 195], [275, 200], [285, 152]];
  return (
    <>
      <rect width="400" height="240" fill="#05070f" />
      <Stars n={40} seed={4} />
      <polyline points={dipper.map((p) => p.join(",")).join(" ")} fill="none" stroke="#2bb3c0" strokeWidth="2" />
      <line x1="205" y1="150" x2="285" y2="152" stroke="#2bb3c0" strokeWidth="2" />
      {dipper.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#fff" />)}
      <line x1="285" y1="152" x2="320" y2="40" stroke="#f5d34a" strokeDasharray="5 5" strokeWidth="2" />
      <circle cx="322" cy="34" r="7" fill="#fff" />
      <circle cx="322" cy="34" r="14" fill="#fff" opacity="0.2" />
      <T x={340} y={30} a="start" c="#f5d34a">North Star</T>
      <T x={150} y={225} c="#2bb3c0">The Big Dipper</T>
      <T x={350} y={110} s={11} c="#9aa">follow the</T>
      <T x={350} y={124} s={11} c="#9aa">pointer stars</T>
    </>
  );
};

const Gravity = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <Stars n={30} seed={5} />
    <circle cx="150" cy="140" r="70" fill="#1d6fb8" />
    <path d="M110 110 q20 -10 40 0 q15 10 30 -5 q10 20 -10 30 q-30 10 -60 -25z" fill="#3aa860" />
    <ellipse cx="150" cy="140" rx="170" ry="80" fill="none" stroke="#fff" strokeOpacity="0.35" strokeDasharray="5 6" />
    <circle cx="318" cy="135" r="16" fill="#cfc6a8" />
    <T x={318} y={170} s={12}>Moon</T>
    <line x1="300" y1="135" x2="230" y2="138" stroke="#f5d34a" strokeWidth="3" markerEnd="url(#ga)" />
    <defs><marker id="ga" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="#f5d34a" /></marker></defs>
    <circle cx="150" cy="40" r="10" fill="#e04848" />
    <path d="M150 30 q4 -8 10 -8" stroke="#3aa860" strokeWidth="3" fill="none" />
    <line x1="150" y1="54" x2="150" y2="62" stroke="#f5d34a" strokeWidth="3" markerEnd="url(#ga)" />
    <T x={168} y={45} a="start" s={12}>Apple falls</T>
    <T x={150} y={145} s={13}>Earth</T>
    <T x={265} y={125} s={11} c="#f5d34a">gravity pull</T>
  </>
);

const Light = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <line x1="0" y1="120" x2="160" y2="120" stroke="#fff" strokeWidth="6" />
    <polygon points="160,60 220,170 100,170" fill="#a8d8ff" opacity="0.35" stroke="#cfe8ff" strokeWidth="2" transform="translate(30 -20)" />
    {["#ff4040", "#ff9a3c", "#ffe04a", "#4ad66d", "#4aa8ff", "#5a5aff", "#a04aff"].map((c, i) => (
      <line key={c} x1="200" y1="118" x2="400" y2={60 + i * 22} stroke={c} strokeWidth="5" />
    ))}
    <T x={70} y={105}>White light</T>
    <T x={190} y={190} c="#cfe8ff">Prism</T>
    <T x={330} y={230} s={12}>All the colours!</T>
  </>
);

const Star = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <Stars n={20} seed={6} />
    <circle cx="150" cy="120" r="100" fill="#ffb347" />
    <circle cx="150" cy="120" r="110" fill="#ffb347" opacity="0.2" />
    <path d="M150 120 L250 120 A100 100 0 0 0 150 20 Z" fill="#ff7a00" />
    <path d="M150 120 L215 120 A65 65 0 0 0 150 55 Z" fill="#ffd166" />
    <path d="M150 120 L180 120 A30 30 0 0 0 150 90 Z" fill="#fff7d6" />
    <line x1="168" y1="108" x2="300" y2="60" stroke="#fff" strokeWidth="1.5" />
    <T x={304} y={58} a="start" s={12}>Core: fusion!</T>
    <line x1="220" y1="80" x2="300" y2="110" stroke="#fff" strokeWidth="1.5" />
    <T x={304} y={114} a="start" s={12}>Energy moves out</T>
    <line x1="240" y1="160" x2="300" y2="170" stroke="#fff" strokeWidth="1.5" />
    <T x={304} y={174} a="start" s={12}>Glowing surface</T>
    <circle cx="370" cy="210" r="2.5" fill="#3d8fd6" />
    <T x={362} y={232} a="end" s={10} c="#9aa">Earth to scale →</T>
  </>
);

const Plane = () => (
  <>
    <rect width="400" height="240" fill="#0d2440" />
    <defs><marker id="pa" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="context-stroke" /></marker></defs>
    <g transform="translate(200 125)">
      <path d="M -110 0 Q -100 -14 60 -10 Q 100 -8 110 0 Q 100 8 60 10 Q -100 14 -110 0 Z" fill="#e8edf3" />
      <path d="M 10 4 L -30 52 L -12 52 L 40 4 Z" fill="#c7d0db" />
      <path d="M 10 -4 L -18 -30 L -6 -30 L 34 -4 Z" fill="#aeb8c4" />
      <path d="M -95 -6 L -80 -40 L -68 -40 L -72 -6 Z" fill="#c7d0db" />
      <circle cx="80" cy="-3" r="3" fill="#2bb3c0" /><circle cx="70" cy="-3" r="3" fill="#2bb3c0" /><circle cx="60" cy="-3" r="3" fill="#2bb3c0" />
    </g>
    <line x1="210" y1="100" x2="210" y2="30" stroke="#4ade80" strokeWidth="4" markerEnd="url(#pa)" />
    <line x1="210" y1="150" x2="210" y2="215" stroke="#ff7a59" strokeWidth="4" markerEnd="url(#pa)" />
    <line x1="315" y1="125" x2="385" y2="125" stroke="#f5d34a" strokeWidth="4" markerEnd="url(#pa)" />
    <line x1="85" y1="125" x2="20" y2="125" stroke="#9aa6b4" strokeWidth="4" markerEnd="url(#pa)" />
    <T x={225} y={40} a="start" c="#4ade80">LIFT</T>
    <T x={225} y={210} a="start" c="#ff7a59">WEIGHT</T>
    <T x={350} y={112} c="#f5d34a">THRUST</T>
    <T x={50} y={112} c="#cfd6de">DRAG</T>
  </>
);

const Rocket = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <Stars n={30} seed={7} />
    <defs>
      <marker id="ra" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="context-stroke" /></marker>
      <linearGradient id="fl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff7d6" /><stop offset="0.5" stopColor="#f5d34a" /><stop offset="1" stopColor="#ff7a00" stopOpacity="0" /></linearGradient>
    </defs>
    <g transform="translate(200 95)">
      <path d="M0 -80 C 20 -55 22 -20 20 40 L -20 40 C -22 -20 -20 -55 0 -80 Z" fill="#e8edf3" />
      <circle cy="-30" r="9" fill="#2bb3c0" stroke="#0e3b40" strokeWidth="3" />
      <path d="M-20 10 L -38 50 L -20 42 Z M20 10 L 38 50 L 20 42 Z" fill="#ff7a59" />
      <path d="M -14 42 Q 0 160 14 42 Z" fill="url(#fl)" />
    </g>
    <line x1="260" y1="60" x2="260" y2="10" stroke="#4ade80" strokeWidth="4" markerEnd="url(#ra)" />
    <T x={270} y={40} a="start" c="#4ade80">Rocket goes UP</T>
    <line x1="140" y1="160" x2="140" y2="225" stroke="#f5d34a" strokeWidth="4" markerEnd="url(#ra)" />
    <T x={130} y={200} a="end" c="#f5d34a">Hot gas pushes DOWN</T>
  </>
);

const Camera = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <circle cx="30" cy="60" r="4" fill="#fff" /><circle cx="22" cy="170" r="3" fill="#fff" /><circle cx="40" cy="120" r="5" fill="#fff" />
    {[60, 120, 170].map((y, i) => <line key={i} x1="40" y1={y} x2="200" y2={120 + (y - 120) * 0.5} stroke="#f5d34a" strokeOpacity="0.7" strokeWidth="2" />)}
    {[60, 120, 170].map((y, i) => <line key={`b${i}`} x1="200" y1={120 + (y - 120) * 0.5} x2="320" y2={120 - (y - 120) * 0.35} stroke="#f5d34a" strokeOpacity="0.7" strokeWidth="2" />)}
    <ellipse cx="200" cy="120" rx="12" ry="50" fill="#a8d8ff" opacity="0.6" stroke="#cfe8ff" />
    <rect x="320" y="70" width="14" height="100" fill="#2bb3c0" />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1="320" y1={70 + i * 10} x2="334" y2={70 + i * 10} stroke="#0e3b40" />)}
    <rect x="180" y="55" width="170" height="130" rx="14" fill="none" stroke="#9aa6b4" strokeWidth="2" strokeDasharray="6 5" />
    <T x={200} y={210}>Lens bends the light</T>
    <T x={327} y={50}>Sensor</T>
    <T x={40} y={30} a="start" s={12}>Starlight</T>
  </>
);

const Phone = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <Stars n={40} seed={8} />
    <circle cx="320" cy="50" r="26" fill="#f2ecd2" />
    <circle cx="312" cy="44" r="5" fill="#d8cfae" /><circle cx="328" cy="58" r="4" fill="#d8cfae" />
    <g transform="translate(150 150)">
      <line x1="0" y1="20" x2="-40" y2="85" stroke="#9aa6b4" strokeWidth="4" />
      <line x1="0" y1="20" x2="40" y2="85" stroke="#9aa6b4" strokeWidth="4" />
      <line x1="0" y1="20" x2="0" y2="88" stroke="#9aa6b4" strokeWidth="4" />
      <g transform="rotate(-25)">
        <rect x="-26" y="-50" width="52" height="90" rx="8" fill="#1a1c24" stroke="#e8edf3" strokeWidth="3" />
        <rect x="-20" y="-42" width="40" height="72" rx="4" fill="#0b1630" />
        <circle cx="6" cy="-20" r="9" fill="#f2ecd2" />
      </g>
    </g>
    <T x={260} y={140} a="start">1. Steady (tripod)</T>
    <T x={260} y={165} a="start">2. Tap to focus</T>
    <T x={260} y={190} a="start">3. Lower brightness</T>
    <T x={260} y={215} a="start">4. Use the timer</T>
  </>
);

const DarkSky = () => (
  <>
    <rect width="200" height="240" fill="#3a2a1a" />
    <rect x="200" width="200" height="240" fill="#05070f" />
    <defs><radialGradient id="glow" cx="0.5" cy="1" r="0.8"><stop offset="0" stopColor="#ff9a3c" stopOpacity="0.6" /><stop offset="1" stopColor="#ff9a3c" stopOpacity="0" /></radialGradient></defs>
    <rect width="200" height="240" fill="url(#glow)" />
    <circle cx="60" cy="50" r="2" fill="#fff" /><circle cx="140" cy="80" r="1.5" fill="#fff" />
    {[20, 50, 80, 115, 150].map((x, i) => <rect key={x} x={x} y={160 - (i % 3) * 25} width="26" height={80 + (i % 3) * 25} fill="#111" />)}
    {[25, 55, 85, 120, 155].map((x) => <rect key={x} x={x + 4} y="180" width="6" height="6" fill="#ffd166" />)}
    <g clipPath="url(#right)"><g transform="translate(200 0)"><Stars n={120} seed={9} /></g></g>
    <clipPath id="right"><rect x="200" width="200" height="240" /></clipPath>
    <path d="M200 240 L240 160 L290 190 L330 140 L400 200 L400 240 Z" fill="#0a0f0a" />
    <path d="M200 120 Q 300 40 400 20" stroke="#b9a7d6" strokeOpacity="0.25" strokeWidth="40" fill="none" />
    <T x={100} y={30}>City sky</T>
    <T x={300} y={225}>Dark countryside sky</T>
  </>
);

const POWERS: [string, string, string, number][] = [
  ["10⁰ m", "You (about 1 m)", "🧒", 6],
  ["10⁷ m", "Earth (12,700 km wide)", "🌍", 46],
  ["10⁸ m", "To the Moon (3.8 × 10⁸ m)", "🌙", 66],
  ["10¹¹ m", "To the Sun (1.5 × 10¹¹ m)", "☀️", 126],
  ["10¹⁶ m", "One light-year", "✨", 226],
  ["10²¹ m", "Across the Milky Way", "🌌", 330],
];
const Powers = () => (
  <>
    <rect width="400" height="240" fill="#05070f" />
    <Stars n={25} seed={10} />
    {POWERS.map(([p, label, e, w], i) => (
      <g key={p} transform={`translate(0 ${22 + i * 36})`}>
        <T x={12} y={14} a="start" s={13} c="#f5d34a">{p}</T>
        <rect x="64" y="2" width={w} height="16" rx="8" fill="#2bb3c0" opacity={0.35 + i * 0.1} />
        <text x={70 + w} y="15" fontSize="13">{e}</text>
        <T x={90 + w > 330 ? 392 : 90 + w} y={15} a={90 + w > 330 ? "end" : "start"} s={11}>{label}</T>
      </g>
    ))}
    <T x={200} y={234} s={10} c="#9aa">Each step right = many times more zeros</T>
  </>
);

const MAP: Record<string, ComponentType> = {
  powers: Powers,
  space: Space, daynight: DayNight, planets: Planets, constellation: Constellation, gravity: Gravity,
  light: Light, star: Star, plane: Plane, rocket: Rocket, camera: Camera, phone: Phone, darksky: DarkSky,
};
export const PICTURE_KEYS = Object.keys(MAP);

export function Picture({ name, alt }: { name: string; alt: string }) {
  const P = MAP[name];
  if (!P) return null;
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label={alt} style={{ width: "100%", height: "auto", display: "block", borderRadius: 16, border: "1px solid var(--border)" }}>
      <P />
    </svg>
  );
}
