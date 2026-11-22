/** Lightweight astronomy helpers (no external ephemeris needed). */

const SYNODIC = 29.530588853;
const KNOWN_NEW_MOON_JD = 2451550.1; // 2000-01-06 18:14 UTC

export const toJD = (d: Date) => d.getTime() / 864e5 + 2440587.5;

export function moonPhase(d: Date) {
  const age = (((toJD(d) - KNOWN_NEW_MOON_JD) % SYNODIC) + SYNODIC) % SYNODIC;
  const frac = age / SYNODIC; // 0 = new, 0.5 = full
  const illum = (1 - Math.cos(2 * Math.PI * frac)) / 2;
  const names = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ];
  const name = names[Math.floor(frac * 8 + 0.5) % 8];
  return { age, frac, illum, name, waxing: frac < 0.5 };
}

export function nextPhase(from: Date, target: 0 | 0.5) {
  const { frac } = moonPhase(from);
  let delta = target - frac;
  if (delta <= 0.001) delta += 1;
  return new Date(from.getTime() + delta * SYNODIC * 864e5);
}

/** Annual meteor showers with typical peak dates (month is 1-based). */
export const SHOWERS = [
  { name: "Quadrantids", month: 1, day: 3, zhr: 110, radiant: "Boötes", note: "Sharp peak lasting only a few hours." },
  { name: "Lyrids", month: 4, day: 22, zhr: 18, radiant: "Lyra", note: "Occasional bright fireballs." },
  { name: "Eta Aquariids", month: 5, day: 6, zhr: 50, radiant: "Aquarius", note: "Debris from Halley's Comet; best from the southern hemisphere." },
  { name: "Perseids", month: 8, day: 12, zhr: 100, radiant: "Perseus", note: "Warm summer nights in the north — a great first shower." },
  { name: "Orionids", month: 10, day: 21, zhr: 20, radiant: "Orion", note: "Also from Halley's Comet; fast meteors." },
  { name: "Leonids", month: 11, day: 17, zhr: 15, radiant: "Leo", note: "Famous for historic meteor storms." },
  { name: "Geminids", month: 12, day: 14, zhr: 150, radiant: "Gemini", note: "Often the year's best; visible from evening onward." },
];

export function upcomingShowers(now = new Date()) {
  return SHOWERS.map((s) => {
    let d = new Date(now.getFullYear(), s.month - 1, s.day, 2);
    if (d.getTime() < now.getTime() - 864e5) d = new Date(now.getFullYear() + 1, s.month - 1, s.day, 2);
    const m = moonPhase(d);
    const rating = m.illum < 0.3 ? "Great" : m.illum < 0.65 ? "Fair" : "Moon-washed";
    return { ...s, date: d, moon: m, rating };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Planckian locus approximation → CSS rgb() for a blackbody temperature. */
export function kelvinToRgb(k: number) {
  const t = k / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${c(r)}, ${c(g)}, ${c(b)})`;
}

export const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";

export function fmtSci(n: number, d = 2) {
  if (!Number.isFinite(n)) return "—";
  if (n !== 0 && (Math.abs(n) >= 1e6 || Math.abs(n) < 1e-2)) {
    const [m, e] = n.toExponential(d).split("e");
    return `${m} × 10${toSup(e)}`;
  }
  return fmt(n, d);
}
const SUP: Record<string, string> = { "-": "⁻", "+": "", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const toSup = (s: string) => s.split("").map((c) => SUP[c] ?? c).join("");
