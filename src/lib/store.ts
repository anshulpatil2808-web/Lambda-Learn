import { useSyncExternalStore } from "react";

/**
 * Local-first learner state. Everything lives in localStorage so the app
 * works with zero backend. To add real accounts later, swap `load`/`persist`
 * for calls to your backend (e.g. Supabase) — the rest of the app only uses
 * the exported hooks and actions.
 */

export type AgeGroup = "kid" | "teen" | "uni" | "adult";
export type Level = "simple" | "deep";

export interface Profile {
  name: string;
  email?: string;
  ageGroup: AgeGroup;
  interests: string[];
  joinedAt: string;
}

export interface State {
  profile: Profile | null;
  xp: number;
  completed: string[]; // lesson keys "track/lesson"
  checks: Record<string, number>; // lesson key -> best score (0..1)
  sims: string[];
  games: string[];
  badges: string[];
  diagnostic: { score: number; recommended: string; at: string } | null;
  streak: { last: string; count: number };
  level: Level;
}

const KEY = "lambda-learn:v1";
const empty: State = {
  profile: null,
  xp: 0,
  completed: [],
  checks: {},
  sims: [],
  games: [],
  badges: [],
  diagnostic: null,
  streak: { last: "", count: 0 },
  level: "simple",
};

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...empty, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable — fall back to in-memory */
  }
  return { ...empty };
}

let state: State = load();
const listeners = new Set<() => void>();
let toastFn: ((msg: string) => void) | null = null;

let persistHook: ((s: State) => void) | null = null;
/** Called after every local save — the cloud sync layer subscribes here. */
export function onPersist(fn: ((s: State) => void) | null) {
  persistHook = fn;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  persistHook?.(state);
}

/** Replace the whole learner state (used when merging cloud data). */
export function replaceState(next: Partial<State>) {
  state = withBadges({ ...empty, ...next });
  persist();
  listeners.forEach((l) => l());
}

/** Merge two learner states without losing progress from either. */
export function mergeStates(a: Partial<State>, b: Partial<State>): State {
  const A = { ...empty, ...a };
  const B = { ...empty, ...b };
  const uniq = (x: string[], y: string[]) => [...new Set([...x, ...y])];
  const checks: Record<string, number> = { ...A.checks };
  for (const [k, v] of Object.entries(B.checks)) checks[k] = Math.max(checks[k] ?? 0, v);
  const newer = (x?: string, y?: string) => (x ?? "") >= (y ?? "");
  return {
    // b is the cloud copy: its profile wins when both exist
    profile: B.profile ?? A.profile,
    xp: Math.max(A.xp, B.xp),
    completed: uniq(A.completed, B.completed),
    checks,
    sims: uniq(A.sims, B.sims),
    games: uniq(A.games, B.games),
    badges: uniq(A.badges, B.badges),
    diagnostic: A.diagnostic && B.diagnostic ? (newer(A.diagnostic.at, B.diagnostic.at) ? A.diagnostic : B.diagnostic) : A.diagnostic ?? B.diagnostic,
    streak: newer(A.streak.last, B.streak.last) ? A.streak : B.streak,
    level: A.level,
  };
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  state = withBadges(state);
  persist();
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => sel(state),
  );
}
export const getState = () => state;
export function onToast(fn: (msg: string) => void) {
  toastFn = fn;
}
const toast = (m: string) => toastFn?.(m);

/* ---------- Ranks ---------- */
export const RANKS = [
  { name: "Cadet", min: 0, emoji: "🧑‍🚀" },
  { name: "Navigator", min: 150, emoji: "🧭" },
  { name: "Pilot", min: 400, emoji: "🛩️" },
  { name: "Commander", min: 800, emoji: "🚀" },
  { name: "Mission Specialist", min: 1400, emoji: "🛰️" },
  { name: "Astrophysicist", min: 2200, emoji: "🌌" },
];
export function rankFor(xp: number) {
  let i = 0;
  RANKS.forEach((r, idx) => {
    if (xp >= r.min) i = idx;
  });
  const next = RANKS[i + 1];
  const pct = next ? (xp - RANKS[i].min) / (next.min - RANKS[i].min) : 1;
  return { ...RANKS[i], index: i, next, pct };
}

/* ---------- Badges ---------- */
export const BADGES = [
  { id: "first-steps", emoji: "👣", name: "First Steps", desc: "Complete your first lesson" },
  { id: "diagnostic", emoji: "🧪", name: "Pre-flight Done", desc: "Finish the diagnostic quiz" },
  { id: "astrophysics", emoji: "🌠", name: "Stargazer Scholar", desc: "Finish the Astrophysics track" },
  { id: "astronomy", emoji: "🔭", name: "Sky Cartographer", desc: "Finish the Astronomy track" },
  { id: "aerospace", emoji: "🚀", name: "Rocketeer", desc: "Finish the Rocket Science track" },
  { id: "astrophotography", emoji: "📸", name: "Light Catcher", desc: "Finish the Astrophotography track" },
  { id: "tinkerer", emoji: "🛠️", name: "Lab Tinkerer", desc: "Use 3 different simulators" },
  { id: "perfect", emoji: "💯", name: "Perfect Orbit", desc: "Ace 5 lesson checks" },
  { id: "streak-3", emoji: "🔥", name: "Ignition", desc: "Learn 3 days in a row" },
  { id: "xp-1000", emoji: "⚡", name: "Escape Velocity", desc: "Earn 1,000 XP" },
  { id: "launch-pad", emoji: "🛝", name: "Launch Pad Grad", desc: "Finish all Launch Pad basics" },
  { id: "gamer", emoji: "🎮", name: "Space Gamer", desc: "Win all 3 space games" },
];

// Track lesson counts are injected by the content module to avoid a cycle.
let trackLessonKeys: Record<string, string[]> = {};
let basicsKeys: string[] = [];
export function registerTracks(map: Record<string, string[]>, basics: string[] = []) {
  trackLessonKeys = map;
  basicsKeys = basics;
  state = withBadges(state);
}

function withBadges(s: State): State {
  const earned = new Set(s.badges);
  const add = (id: string) => {
    if (!earned.has(id)) {
      earned.add(id);
      const b = BADGES.find((x) => x.id === id);
      if (b && s !== empty) setTimeout(() => toast(`${b.emoji} Badge unlocked: ${b.name}`), 300);
    }
  };
  if (s.completed.length >= 1) add("first-steps");
  if (s.diagnostic) add("diagnostic");
  for (const [track, keys] of Object.entries(trackLessonKeys)) {
    if (keys.length && keys.every((k) => s.completed.includes(k))) add(track);
  }
  if (s.sims.length >= 3) add("tinkerer");
  if (Object.values(s.checks).filter((v) => v >= 1).length >= 5) add("perfect");
  if (s.streak.count >= 3) add("streak-3");
  if (s.xp >= 1000) add("xp-1000");
  if (basicsKeys.length && basicsKeys.every((k) => s.completed.includes(k))) add("launch-pad");
  if (s.games.length >= 3) add("gamer");
  if (earned.size === s.badges.length) return s;
  return { ...s, badges: [...earned] };
}

/* ---------- Actions ---------- */
const today = () => new Date().toISOString().slice(0, 10);

function bumpStreak(): State["streak"] {
  const t = today();
  const { last, count } = state.streak;
  if (last === t) return state.streak;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  return { last: t, count: last === y ? count + 1 : 1 };
}

export function addXp(amount: number, reason?: string) {
  set({ xp: state.xp + amount, streak: bumpStreak() });
  if (reason) toast(`+${amount} XP · ${reason}`);
}

export function completeLesson(key: string, xp = 50) {
  if (state.completed.includes(key)) return;
  set({ completed: [...state.completed, key], xp: state.xp + xp, streak: bumpStreak() });
  toast(`+${xp} XP · Lesson complete`);
}

export function recordCheck(key: string, score: number) {
  const prev = state.checks[key] ?? 0;
  if (score <= prev) return;
  const gained = Math.round((score - prev) * 30);
  set({ checks: { ...state.checks, [key]: score }, xp: state.xp + gained, streak: bumpStreak() });
  if (gained) toast(`+${gained} XP · Check passed`);
}

/** Win a game for the first time: +25 XP. */
export function winGame(id: string) {
  if (state.games.includes(id)) return false;
  set({ games: [...state.games, id], xp: state.xp + 25, streak: bumpStreak() });
  toast("+25 XP · Game won!");
  return true;
}

export function markSim(id: string) {
  if (state.sims.includes(id)) return;
  set({ sims: [...state.sims, id], xp: state.xp + 10 });
}

export function saveProfile(p: Profile) {
  set({ profile: p });
}

export function saveDiagnostic(score: number, recommended: string, xp: number) {
  set({ diagnostic: { score, recommended, at: new Date().toISOString() }, xp: state.xp + xp, streak: bumpStreak() });
}

export function setLevel(level: Level) {
  set({ level });
}

export function signOut() {
  state = { ...empty };
  persist();
  listeners.forEach((l) => l());
}

export function exportData() {
  return JSON.stringify(state, null, 2);
}
