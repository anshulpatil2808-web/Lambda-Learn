import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { getState, mergeStates, onPersist, replaceState, signOut as clearLocal, type State } from "./store";

/**
 * Cloud accounts via Supabase. If VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 * are not set, everything here is a no-op and the app stays local-only.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
export const cloudEnabled = !!supabase;

/* ---------- auth state ---------- */
type SyncStatus = "idle" | "syncing" | "synced" | "error";
interface AuthState {
  user: User | null;
  ready: boolean;
  sync: SyncStatus;
}
let auth: AuthState = { user: null, ready: !cloudEnabled, sync: "idle" };
const subs = new Set<() => void>();
const setAuth = (p: Partial<AuthState>) => {
  auth = { ...auth, ...p };
  subs.forEach((s) => s());
};
export function useAuth() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => {
        subs.delete(cb);
      };
    },
    () => auth,
  );
}

/* ---------- sync ---------- */
const TABLE = "progress";
let timer: number | undefined;

async function push(s: State) {
  if (!supabase || !auth.user) return;
  setAuth({ sync: "syncing" });
  const { error } = await supabase.from(TABLE).upsert({ user_id: auth.user.id, data: s, updated_at: new Date().toISOString() });
  setAuth({ sync: error ? "error" : "synced" });
  if (error) console.warn("Lambda Learn: cloud save failed", error.message);
}

function schedulePush(s: State) {
  clearTimeout(timer);
  timer = window.setTimeout(() => push(s), 1200);
}

async function pullAndMerge(user: User) {
  if (!supabase) return;
  setAuth({ sync: "syncing" });
  const { data, error } = await supabase.from(TABLE).select("data").eq("user_id", user.id).maybeSingle();
  if (error) {
    setAuth({ sync: "error" });
    console.warn("Lambda Learn: cloud load failed", error.message);
    return;
  }
  const cloud = (data?.data ?? {}) as Partial<State>;
  const merged = mergeStates(getState(), cloud);
  if (merged.profile && user.email && !merged.profile.email) merged.profile = { ...merged.profile, email: user.email };
  onPersist(null); // avoid a redundant debounce while replacing
  replaceState(merged);
  onPersist(schedulePush);
  await push(merged);
}

let lastUserId: string | null = null;
function handleUser(user: User | null) {
  setAuth({ user, ready: true });
  if (user && user.id !== lastUserId) {
    lastUserId = user.id;
    onPersist(schedulePush);
    void pullAndMerge(user);
  } else if (!user) {
    lastUserId = null;
    onPersist(null);
    setAuth({ sync: "idle" });
  }
}

if (supabase) {
  supabase.auth.getSession().then(({ data }) => handleUser(data.session?.user ?? null));
  supabase.auth.onAuthStateChange((_e, session) => handleUser(session?.user ?? null));
}

/* ---------- actions ---------- */
export async function sendCode(email: string) {
  if (!supabase) throw new Error("Cloud accounts are not configured.");
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: `${location.origin}/profile` } });
  if (error) throw error;
}

export async function verifyCode(email: string, token: string) {
  if (!supabase) throw new Error("Cloud accounts are not configured.");
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) throw error;
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error("Cloud accounts are not configured.");
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth` } });
  if (error) throw error;
}

/** Sign out of the cloud account and clear this device's copy. */
export async function signOutEverywhere() {
  clearTimeout(timer);
  if (supabase && auth.user) {
    await push(getState()); // make sure the latest progress is saved first
    onPersist(null);
    await supabase.auth.signOut();
  }
  onPersist(null);
  clearLocal();
}

/** Permanently delete the cloud copy of the learner's progress. */
export async function deleteCloudData() {
  if (!supabase || !auth.user) return;
  clearTimeout(timer);
  onPersist(null);
  const { error } = await supabase.from(TABLE).delete().eq("user_id", auth.user.id);
  if (error) throw error;
  await supabase.auth.signOut();
  clearLocal();
}
