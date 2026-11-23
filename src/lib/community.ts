import { supabase, cloudEnabled } from "./cloud";
import { getState } from "./store";

/**
 * Community forum data layer.
 *
 * Two interchangeable backends share one interface:
 *   - supabaseBackend: the real thing (tables from supabase/migrations/0002_community.sql)
 *   - demoBackend:     saves to this browser only. Used ONLY in local development
 *                      (`npm run dev`) when Supabase keys are missing, so you can try every screen.
 * In a production build without keys, the forum shows a "not connected yet" message instead.
 */

export const CATEGORIES = [
  { id: "calculations", label: "Calculations", emoji: "🧮", blurb: "Work through the numbers: exposure times, delta-v, orbits, distances." },
  { id: "mathematics", label: "Mathematics", emoji: "∑", blurb: "The maths behind it all — algebra, trig, logs, calculus, with LaTeX." },
  { id: "telescope-imaging", label: "Telescope imaging", emoji: "🔭", blurb: "Capturing photos through telescopes: gear, settings, processing." },
  { id: "projects", label: "Project showcase", emoji: "🚀", blurb: "Share what you observed, photographed, built or launched." },
  { id: "questions", label: "Questions", emoji: "❓", blurb: "Stuck? Ask anything — no question is too small." },
  { id: "general", label: "General", emoji: "💬", blurb: "Everything else in astronomy, astrophysics and astrophotography." },
] as const;
export type CategoryId = (typeof CATEGORIES)[number]["id"];
export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);

export interface Author { display_name: string }
export interface Post {
  id: number;
  author_id: string;
  category: CategoryId;
  title: string;
  body: string;
  image_path: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  is_hidden?: boolean;
  author: Author | null;
}
export interface Comment {
  id: number;
  post_id: number;
  author_id: string;
  body: string;
  created_at: string;
  is_hidden?: boolean;
  author: Author | null;
}
export interface Report {
  id: number;
  post_id: number | null;
  comment_id: number | null;
  reason: string;
  created_at: string;
  post?: { id: number; title: string; author_id: string; is_hidden: boolean } | null;
  comment?: { id: number; body: string; post_id: number; author_id: string; is_hidden: boolean } | null;
}
export interface Me { id: string; email?: string | null; profile: { display_name: string; bio: string | null } | null; isAdmin: boolean; banned: boolean }
export interface ListOpts { category?: string; q?: string; sort?: "new" | "top"; page?: number }

export const PAGE_SIZE = 15;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface Backend {
  mode: "live" | "demo";
  me(): Promise<Me | null>;
  saveProfile(name: string, bio: string): Promise<void>;
  listPosts(o: ListOpts): Promise<{ posts: Post[]; more: boolean }>;
  getPost(id: number): Promise<Post | null>;
  listComments(postId: number): Promise<Comment[]>;
  likedByMe(postIds: number[]): Promise<Set<number>>;
  createPost(p: { category: CategoryId; title: string; body: string; image?: File | null }): Promise<number>;
  deletePost(post: Post): Promise<void>;
  addComment(postId: number, body: string): Promise<void>;
  deleteComment(id: number): Promise<void>;
  setLike(postId: number, like: boolean): Promise<void>;
  report(target: "post" | "comment", id: number, reason: string): Promise<void>;
  imageUrl(path: string): string;
  listReports(): Promise<Report[]>;
  moderate(target: "post" | "comment", id: number, hide: boolean): Promise<void>;
  dismissReport(id: number): Promise<void>;
  ban(uid: string, reason: string): Promise<void>;
}

/** Turn database errors into friendly messages. */
export function friendlyError(e: unknown): string {
  const m = (e as { message?: string })?.message ?? String(e);
  if (/Slow down/.test(m)) return m;
  if (/row-level security|permission denied|violates row/i.test(m)) return "You can't do that — make sure you're signed in and have a community name.";
  if (/check constraint.*title/i.test(m)) return "Titles need 5 to 140 characters.";
  if (/check constraint.*display_name/i.test(m)) return "Names need 2 to 40 characters.";
  if (/duplicate key/i.test(m)) return "Already done!";
  if (/fetch|network/i.test(m)) return "Can't reach the server. Check your connection and try again.";
  return m || "Something went wrong.";
}

function safeFileName(name: string) {
  const ext = (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

export function checkImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return "Please choose a JPG, PNG, WebP or GIF image.";
  if (file.size > MAX_IMAGE_BYTES) return "That image is over 5 MB. Try exporting a smaller JPG.";
  return null;
}

/* ===================================================================== */
/*  Live backend (Supabase)                                              */
/* ===================================================================== */
const SELECT_POST = "id, author_id, category, title, body, image_path, like_count, comment_count, created_at, is_hidden, author:profiles(display_name)";

function liveBackend(): Backend {
  const sb = supabase!;
  const uid = async () => (await sb.auth.getUser()).data.user?.id ?? null;
  const must = <T>(r: { data: T; error: unknown }) => {
    if (r.error) throw r.error;
    return r.data;
  };
  return {
    mode: "live",
    async me() {
      const { data } = await sb.auth.getUser();
      const user = data.user;
      if (!user) return null;
      const [profile, admin, banned] = await Promise.all([
        sb.from("profiles").select("display_name, bio").eq("id", user.id).maybeSingle(),
        sb.rpc("is_admin"),
        sb.from("banned").select("user_id").eq("user_id", user.id).maybeSingle(),
      ]);
      return { id: user.id, email: user.email, profile: profile.data ?? null, isAdmin: !!admin.data, banned: !!banned.data };
    },
    async saveProfile(name, bio) {
      const id = await uid();
      if (!id) throw new Error("Please sign in first.");
      const { data } = await sb.from("profiles").select("id").eq("id", id).maybeSingle();
      if (data) must(await sb.from("profiles").update({ display_name: name, bio: bio || null }).eq("id", id));
      else must(await sb.from("profiles").insert({ id, display_name: name, bio: bio || null }));
    },
    async listPosts({ category, q, sort = "new", page = 0 }) {
      let query = sb.from("posts").select(SELECT_POST).eq("is_hidden", false);
      if (category && category !== "all") query = query.eq("category", category);
      if (q?.trim()) query = query.textSearch("search", q.trim(), { type: "websearch", config: "english" });
      query = sort === "top" ? query.order("like_count", { ascending: false }).order("created_at", { ascending: false }) : query.order("created_at", { ascending: false });
      const rows = must(await query.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)) as unknown as Post[];
      return { posts: rows.slice(0, PAGE_SIZE), more: rows.length > PAGE_SIZE };
    },
    async getPost(id) {
      return (must(await sb.from("posts").select(SELECT_POST).eq("id", id).maybeSingle()) as unknown as Post) ?? null;
    },
    async listComments(postId) {
      return must(await sb.from("comments").select("id, post_id, author_id, body, created_at, is_hidden, author:profiles(display_name)").eq("post_id", postId).order("created_at")) as unknown as Comment[];
    },
    async likedByMe(postIds) {
      const id = await uid();
      if (!id || !postIds.length) return new Set();
      const rows = must(await sb.from("likes").select("post_id").eq("user_id", id).in("post_id", postIds)) as { post_id: number }[];
      return new Set(rows.map((r) => r.post_id));
    },
    async createPost({ category, title, body, image }) {
      const id = await uid();
      if (!id) throw new Error("Please sign in first.");
      let image_path: string | null = null;
      if (image) {
        const bad = checkImage(image);
        if (bad) throw new Error(bad);
        image_path = `${id}/${safeFileName(image.name)}`;
        must(await sb.storage.from("community").upload(image_path, image, { contentType: image.type, upsert: false }));
      }
      const row = must(await sb.from("posts").insert({ category, title: title.trim(), body, image_path }).select("id").single()) as { id: number };
      return row.id;
    },
    async deletePost(post) {
      must(await sb.from("posts").delete().eq("id", post.id));
      if (post.image_path) await sb.storage.from("community").remove([post.image_path]);
    },
    async addComment(postId, body) {
      must(await sb.from("comments").insert({ post_id: postId, body }));
    },
    async deleteComment(id) {
      must(await sb.from("comments").delete().eq("id", id));
    },
    async setLike(postId, like) {
      const id = await uid();
      if (!id) throw new Error("Please sign in first.");
      if (like) must(await sb.from("likes").insert({ post_id: postId }));
      else must(await sb.from("likes").delete().eq("post_id", postId).eq("user_id", id));
    },
    async report(target, id, reason) {
      must(await sb.from("reports").insert(target === "post" ? { post_id: id, reason } : { comment_id: id, reason }));
    },
    imageUrl(path) {
      return sb.storage.from("community").getPublicUrl(path).data.publicUrl;
    },
    async listReports() {
      return must(
        await sb
          .from("reports")
          .select("id, post_id, comment_id, reason, created_at, post:posts(id, title, author_id, is_hidden), comment:comments(id, body, post_id, author_id, is_hidden)")
          .eq("resolved", false)
          .order("created_at", { ascending: false }),
      ) as unknown as Report[];
    },
    async moderate(target, id, hide) {
      must(await sb.rpc("moderate", { target, target_id: id, hide }));
    },
    async dismissReport(id) {
      must(await sb.from("reports").update({ resolved: true }).eq("id", id));
    },
    async ban(uid2, reason) {
      must(await sb.rpc("ban_user", { uid: uid2, why: reason }));
    },
  };
}

/* ===================================================================== */
/*  Demo backend (this browser only, development builds)                 */
/* ===================================================================== */
interface DemoDB { posts: (Post & { is_hidden: boolean })[]; comments: (Comment & { is_hidden: boolean })[]; likes: [number, string][]; reports: (Report & { resolved: boolean })[]; profile: { display_name: string; bio: string | null } | null; nextId: number }
const DEMO_KEY = "lambda-learn:community-demo";
const DEMO_USER = "00000000-0000-4000-8000-000000000001";

function seed(): DemoDB {
  const now = Date.now();
  const at = (h: number) => new Date(now - h * 3600e3).toISOString();
  const lambda = { display_name: "Lambda (demo)" };
  return {
    nextId: 4,
    profile: null,
    likes: [],
    reports: [],
    comments: [
      { id: 1, post_id: 1, author_id: "seed", body: "Plate scale is $206.265 \\times \\frac{\\text{pixel size (µm)}}{\\text{focal length (mm)}}$ arcsec per pixel. With 3.76 µm pixels at 400 mm that's about **1.94″/px** — nicely matched to average seeing!", created_at: at(20), is_hidden: false, author: lambda },
    ],
    posts: [
      {
        id: 1, author_id: "seed", category: "telescope-imaging", title: "Which camera sampling is right for my 80 mm refractor?", like_count: 3, comment_count: 1, created_at: at(26), image_path: null, is_hidden: false, author: lambda,
        body: "I'm attaching a camera to an 80 mm f/5 refractor (400 mm focal length).\n\nHow do I know if my pixels are too big or too small for the sky conditions?\n\n- Camera pixel size: 3.76 µm\n- Typical seeing at my site: 2–3 arcseconds",
      },
      {
        id: 2, author_id: "seed", category: "mathematics", title: "Why does the rocket equation use a natural log?", like_count: 5, comment_count: 0, created_at: at(50), image_path: null, is_hidden: false, author: lambda,
        body: "Starting from momentum conservation, a rocket of mass $m$ ejecting $dm$ at speed $v_e$ gains $dv$:\n\n$$m\\,dv = -v_e\\,dm \\quad\\Rightarrow\\quad \\Delta v = v_e \\ln\\frac{m_0}{m_f}$$\n\nIntegrating $\\frac{1}{m}$ is exactly what gives the logarithm. Can someone explain it for beginners?",
      },
      {
        id: 3, author_id: "seed", category: "projects", title: "My first Moon mosaic with a phone and a 4-inch telescope", like_count: 8, comment_count: 0, created_at: at(80), image_path: null, is_hidden: false, author: lambda,
        body: "Held my phone to the eyepiece (25 mm, 26× magnification) and took 40 photos, then stitched 6 of them. Tips:\n\n1. Lock focus and exposure on the Moon\n2. Lower ISO, short shutter\n3. Shoot near the terminator for shadows",
      },
    ],
  };
}
function demoLoad(): DemoDB {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return seed();
}
function demoSave(db: DemoDB) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(db));
  } catch {
    throw new Error("Demo storage is full — remove a demo image post and try again.");
  }
}
const fileToDataUrl = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(f);
  });

function demoBackend(): Backend {
  const me = (db: DemoDB) => (db.profile ? { display_name: db.profile.display_name } : null);
  return {
    mode: "demo",
    async me() {
      const db = demoLoad();
      return { id: DEMO_USER, email: getState().profile?.email ?? null, profile: db.profile, isAdmin: true, banned: false };
    },
    async saveProfile(name, bio) {
      const db = demoLoad();
      if (name.trim().length < 2 || name.trim().length > 40) throw new Error("Names need 2 to 40 characters.");
      db.profile = { display_name: name.trim(), bio: bio || null };
      for (const p of db.posts) if (p.author_id === DEMO_USER) p.author = me(db);
      for (const c of db.comments) if (c.author_id === DEMO_USER) c.author = me(db);
      demoSave(db);
    },
    async listPosts({ category, q, sort = "new", page = 0 }) {
      const db = demoLoad();
      let rows = db.posts.filter((p) => !p.is_hidden && (!category || category === "all" || p.category === category));
      if (q?.trim()) {
        const words = q.toLowerCase().split(/\s+/).filter(Boolean);
        rows = rows.filter((p) => words.every((w) => `${p.title} ${p.body}`.toLowerCase().includes(w)));
      }
      rows.sort((a, b) => (sort === "top" ? b.like_count - a.like_count : 0) || b.created_at.localeCompare(a.created_at));
      const slice = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE + 1);
      return { posts: slice.slice(0, PAGE_SIZE), more: slice.length > PAGE_SIZE };
    },
    async getPost(id) {
      const p = demoLoad().posts.find((x) => x.id === id);
      return p && (!p.is_hidden || p.author_id === DEMO_USER) ? p : null;
    },
    async listComments(postId) {
      return demoLoad().comments.filter((c) => c.post_id === postId && (!c.is_hidden || c.author_id === DEMO_USER));
    },
    async likedByMe(ids) {
      return new Set(demoLoad().likes.filter(([p, u]) => u === DEMO_USER && ids.includes(p)).map(([p]) => p));
    },
    async createPost({ category, title, body, image }) {
      const db = demoLoad();
      if (!db.profile) throw new Error("Choose a community name first.");
      if (title.trim().length < 5 || title.trim().length > 140) throw new Error("Titles need 5 to 140 characters.");
      const recent = db.posts.filter((p) => p.author_id === DEMO_USER && Date.now() - Date.parse(p.created_at) < 3600e3).length;
      if (recent >= 5) throw new Error("Slow down: you can create 5 posts per hour.");
      let image_path: string | null = null;
      if (image) {
        const bad = checkImage(image);
        if (bad) throw new Error(bad);
        if (image.size > 1.5 * 1024 * 1024) throw new Error("Demo mode keeps images under 1.5 MB (the live site allows 5 MB).");
        image_path = await fileToDataUrl(image);
      }
      const id = db.nextId++;
      db.posts.unshift({ id, author_id: DEMO_USER, category, title: title.trim(), body, image_path, like_count: 0, comment_count: 0, created_at: new Date().toISOString(), is_hidden: false, author: me(db) });
      demoSave(db);
      return id;
    },
    async deletePost(post) {
      const db = demoLoad();
      db.posts = db.posts.filter((p) => p.id !== post.id);
      db.comments = db.comments.filter((c) => c.post_id !== post.id);
      demoSave(db);
    },
    async addComment(postId, body) {
      const db = demoLoad();
      if (!db.profile) throw new Error("Choose a community name first.");
      const p = db.posts.find((x) => x.id === postId);
      if (!p || p.is_hidden) throw new Error("This post can't take comments.");
      db.comments.push({ id: db.nextId++, post_id: postId, author_id: DEMO_USER, body, created_at: new Date().toISOString(), is_hidden: false, author: me(db) });
      p.comment_count++;
      demoSave(db);
    },
    async deleteComment(id) {
      const db = demoLoad();
      const c = db.comments.find((x) => x.id === id);
      db.comments = db.comments.filter((x) => x.id !== id);
      const p = c && db.posts.find((x) => x.id === c.post_id);
      if (p) p.comment_count = Math.max(0, p.comment_count - 1);
      demoSave(db);
    },
    async setLike(postId, like) {
      const db = demoLoad();
      if (!db.profile) throw new Error("Choose a community name first.");
      const has = db.likes.some(([p, u]) => p === postId && u === DEMO_USER);
      const p = db.posts.find((x) => x.id === postId);
      if (like && !has) {
        db.likes.push([postId, DEMO_USER]);
        if (p) p.like_count++;
      } else if (!like && has) {
        db.likes = db.likes.filter(([pp, u]) => !(pp === postId && u === DEMO_USER));
        if (p) p.like_count = Math.max(0, p.like_count - 1);
      }
      demoSave(db);
    },
    async report(target, id, reason) {
      const db = demoLoad();
      db.reports.push({ id: db.nextId++, post_id: target === "post" ? id : null, comment_id: target === "comment" ? id : null, reason, created_at: new Date().toISOString(), resolved: false });
      demoSave(db);
    },
    imageUrl(path) {
      return path;
    },
    async listReports() {
      const db = demoLoad();
      return db.reports
        .filter((r) => !r.resolved)
        .map((r) => ({
          ...r,
          post: r.post_id ? (db.posts.find((p) => p.id === r.post_id) ?? null) : null,
          comment: r.comment_id ? (db.comments.find((c) => c.id === r.comment_id) ?? null) : null,
        })) as Report[];
    },
    async moderate(target, id, hide) {
      const db = demoLoad();
      const list = target === "post" ? db.posts : db.comments;
      const item = list.find((x) => x.id === id);
      if (item) item.is_hidden = hide;
      for (const r of db.reports) if ((target === "post" ? r.post_id : r.comment_id) === id) r.resolved = true;
      demoSave(db);
    },
    async dismissReport(id) {
      const db = demoLoad();
      const r = db.reports.find((x) => x.id === id);
      if (r) r.resolved = true;
      demoSave(db);
    },
    async ban() {
      throw new Error("Banning isn't available in demo mode.");
    },
  };
}

/** The active backend, or null when the forum isn't connected (production without keys). */
export const forum: Backend | null = cloudEnabled ? liveBackend() : import.meta.env.DEV ? demoBackend() : null;
export const forumMode = forum?.mode ?? "off";

export function timeAgo(iso: string) {
  const s = (Date.now() - Date.parse(iso)) / 1000;
  if (s < 60) return "just now";
  const m = s / 60, h = m / 60, d = h / 24;
  if (m < 60) return `${Math.floor(m)} min ago`;
  if (h < 24) return `${Math.floor(h)} h ago`;
  if (d < 30) return `${Math.floor(d)} d ago`;
  return new Date(iso).toLocaleDateString();
}
