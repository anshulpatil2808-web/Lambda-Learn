import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTitle } from "../components/Layout";
import { LambdaSays, Mascot } from "../components/Mascot";
import { useAuth } from "../lib/cloud";
import { useStore } from "../lib/store";
import {
  CATEGORIES,
  categoryById,
  checkImage,
  forum,
  forumMode,
  friendlyError,
  timeAgo,
  type CategoryId,
  type Comment,
  type Me,
  type Post,
  type Report,
} from "../lib/community";
import { plainPreview, renderMarkdown } from "../lib/markdown";

/* ---------------- shared hooks & bits ---------------- */
function useMe() {
  const { user } = useAuth();
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const reload = useCallback(async () => {
    if (!forum) return setMe(null);
    try {
      setMe(await forum.me());
    } catch {
      setMe(null);
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload, user?.id]);
  return { me, reload };
}

function Markdown({ text }: { text: string }) {
  const html = useMemo(() => renderMarkdown(text), [text]);
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}

function DemoBanner() {
  if (forumMode !== "demo") return null;
  return (
    <div className="callout" style={{ marginBottom: 20 }}>
      <b>Demo mode:</b> Supabase isn't connected, so posts are saved only in this browser and you're a pretend moderator.
      Follow "Turning on accounts" and "Turning on the community" in the README to go live.
    </div>
  );
}

function NotConnected() {
  return (
    <div className="container" style={{ maxWidth: 760, padding: "80px 20px", textAlign: "center" }}>
      <Mascot size={150} mood="think" />
      <h1 style={{ fontSize: "2.4rem", marginTop: 16 }}>The community is almost ready</h1>
      <p className="lead" style={{ margin: "0 auto 20px" }}>
        Soon you'll be able to share projects, calculations, maths and telescope photos here. Check back shortly!
      </p>
      <div className="row" style={{ justifyContent: "center" }}>
        <Link to="/start" className="btn primary">Keep learning meanwhile →</Link>
        <Link to="/labs" className="btn">Try the calculators</Link>
      </div>
    </div>
  );
}

/** Ask for a public community name the first time someone wants to post. */
function NameGate({ me, onDone }: { me: Me; onDone: () => void }) {
  const localName = useStore((s) => s.profile?.name ?? "");
  const [name, setName] = useState(me.profile?.display_name ?? localName);
  const [bio, setBio] = useState(me.profile?.bio ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await forum!.saveProfile(name.trim(), bio.trim());
      onDone();
    } catch (x) {
      setErr(friendlyError(x));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="card" onSubmit={submit} style={{ maxWidth: 560 }}>
      <span className="eyebrow">One-time setup</span>
      <h3 style={{ fontSize: "1.4rem" }}>Choose your community name</h3>
      <p className="muted">This is shown next to your posts. Use a nickname — never your full name, school or address.</p>
      <label className="lbl" htmlFor="cn">Community name</label>
      <input id="cn" className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} required placeholder="e.g. NebulaNova" />
      <label className="lbl" htmlFor="cb" style={{ marginTop: 12 }}>About you (optional)</label>
      <input id="cb" className="field" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} placeholder="e.g. Backyard astronomer with an 8-inch Dobsonian" />
      {err && <p role="alert" style={{ color: "var(--danger)", fontWeight: 600 }}>{err}</p>}
      <button className="btn primary" style={{ marginTop: 14 }} disabled={busy || name.trim().length < 2}>{busy ? "Saving…" : "Save name"}</button>
    </form>
  );
}

function SignInPrompt({ what }: { what: string }) {
  return (
    <div className="card row" style={{ flexWrap: "nowrap", gap: 16 }}>
      <Mascot size={60} mood="happy" float={false} />
      <div style={{ flex: 1 }}>
        <b>Sign in to {what}</b>
        <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>Reading is open to everyone. Posting needs a free Lambda Learn account.</p>
      </div>
      <Link to="/auth" className="btn primary sm">Sign in</Link>
    </div>
  );
}

const GUIDELINES = [
  "Be kind and patient — everyone here is learning, from 5th graders to professionals.",
  "Use a nickname. Never share your address, school, phone number or exact location.",
  "Show your working: share the numbers and formulas you used so others can learn.",
  "Only upload photos you took yourself, and credit gear and software.",
  "No ads, spam or links to buy things. Report anything that breaks these rules.",
  "Under 13? Ask a parent or teacher before posting.",
];

/* ===================================================================== */
/*  /community                                                            */
/* ===================================================================== */
export function CommunityHome() {
  useTitle("Community");
  const [params, setParams] = useSearchParams();
  const category = params.get("c") ?? "all";
  const sort = (params.get("sort") as "new" | "top") ?? "new";
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const { me } = useMe();

  const load = useCallback(
    async (p: number) => {
      if (!forum) return;
      setLoading(true);
      setErr(null);
      try {
        const r = await forum.listPosts({ category, q, sort, page: p });
        setPosts((old) => (p === 0 ? r.posts : [...old, ...r.posts]));
        setMore(r.more);
        setPage(p);
      } catch (e) {
        setErr(friendlyError(e));
      } finally {
        setLoading(false);
      }
    },
    [category, q, sort],
  );
  useEffect(() => {
    void load(0);
  }, [load]);

  if (!forum) return <NotConnected />;
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params);
    if (!v || v === "all" || (k === "sort" && v === "new")) n.delete(k);
    else n.set(k, v);
    setParams(n);
  };

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head spread" style={{ alignItems: "flex-end" }}>
        <div style={{ maxWidth: 640 }}>
          <span className="eyebrow">Community</span>
          <h1>Share, ask, calculate.</h1>
          <p className="lead">Talk about your projects, work through the maths together, and learn how to capture the sky with your telescope.</p>
        </div>
        <Link to="/community/new" className="btn primary">✏️ New post</Link>
      </div>
      <DemoBanner />

      <div className="community-layout">
        <div>
          <div className="row" style={{ marginBottom: 14 }}>
            <button className={`chip ${category === "all" ? "on" : ""}`} onClick={() => set("c", "all")}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`chip ${category === c.id ? "on" : ""}`} onClick={() => set("c", c.id)}>{c.emoji} {c.label}</button>
            ))}
          </div>
          <div className="row" style={{ marginBottom: 18, flexWrap: "nowrap" }}>
            <form onSubmit={(e) => { e.preventDefault(); set("q", search); }} style={{ flex: 1, display: "flex", gap: 8 }}>
              <input className="field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts: plate scale, Orion, delta-v…" aria-label="Search posts" />
              <button className="btn sm" type="submit">Search</button>
            </form>
            <div className="level-toggle" role="group" aria-label="Sort">
              <button className={sort === "new" ? "on" : ""} onClick={() => set("sort", "new")}>New</button>
              <button className={sort === "top" ? "on" : ""} onClick={() => set("sort", "top")}>Top</button>
            </div>
          </div>
          {q && (
            <p className="muted">
              Results for "<b style={{ color: "var(--fg)" }}>{q}</b>" · <button className="btn ghost sm" onClick={() => { setSearch(""); set("q", ""); }}>Clear</button>
            </p>
          )}
          {err && <p role="alert" style={{ color: "var(--danger)" }}>{err}</p>}
          <div className="grid" style={{ gap: 12 }}>
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
          {!loading && !posts.length && !err && (
            <div className="card" style={{ textAlign: "center" }}>
              <LambdaSays mood="think">{q ? "No posts match that search yet. Try different words — or be the first to ask!" : "No posts here yet. Start the conversation!"}</LambdaSays>
              <Link to={`/community/new${category !== "all" ? `?c=${category}` : ""}`} className="btn primary sm" style={{ marginTop: 14 }}>Write the first post</Link>
            </div>
          )}
          {loading && <p className="muted">Loading…</p>}
          {more && !loading && <button className="btn" style={{ marginTop: 16 }} onClick={() => load(page + 1)}>Load more</button>}
        </div>

        <aside className="grid" style={{ gap: 16, alignContent: "start" }}>
          {me === null && forumMode === "live" && <SignInPrompt what="post" />}
          {me?.isAdmin && <Link to="/community/moderate" className="btn sm">🛡️ Moderation queue</Link>}
          <div className="card">
            <h3>Categories</h3>
            <div className="grid" style={{ gap: 10 }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} className="cat-row" onClick={() => set("c", c.id)}>
                  <span style={{ fontSize: "1.2rem" }}>{c.emoji}</span>
                  <span><b>{c.label}</b><br /><span className="muted" style={{ fontSize: "0.82rem" }}>{c.blurb}</span></span>
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>Community guidelines</h3>
            <ul style={{ paddingLeft: "1.1em", margin: 0 }} className="muted">
              {GUIDELINES.map((g) => <li key={g} style={{ marginBottom: 6, fontSize: "0.88rem" }}>{g}</li>)}
            </ul>
          </div>
          <div className="card">
            <h3>Writing maths</h3>
            <p className="muted" style={{ fontSize: "0.88rem" }}>Wrap LaTeX in dollar signs:</p>
            <code className="mono" style={{ fontSize: "0.82rem", display: "block", whiteSpace: "pre-wrap" }}>{"$v = \\sqrt{GM/r}$\n$$\\Delta v = I_{sp} g_0 \\ln\\frac{m_0}{m_f}$$"}</code>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const cat = categoryById(post.category);
  return (
    <Link to={`/community/post/${post.id}`} className="card hover post-card">
      <div className="spread" style={{ marginBottom: 6 }}>
        <span className="tag">{cat?.emoji} {cat?.label}</span>
        <span className="muted" style={{ fontSize: "0.8rem" }}>{post.author?.display_name ?? "Someone"} · {timeAgo(post.created_at)}</span>
      </div>
      <h3 style={{ margin: "6px 0" }}>{post.title}</h3>
      <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>{plainPreview(post.body)}</p>
      <div className="row" style={{ marginTop: 10, gap: 16, fontSize: "0.85rem" }}>
        <span>▲ {post.like_count}</span>
        <span>💬 {post.comment_count}</span>
        {post.image_path && <span>🖼️ photo</span>}
      </div>
    </Link>
  );
}

/* ===================================================================== */
/*  Editor with Write / Preview tabs                                      */
/* ===================================================================== */
function Editor({ value, onChange, rows = 10, placeholder, id }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; id: string }) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);
  const insert = (before: string, after = "", sample = "") => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = value.slice(s, e) || sample;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  };
  return (
    <div className="editor">
      <div className="spread editor-bar">
        <div className="level-toggle" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "write"} className={tab === "write" ? "on" : ""} onClick={() => setTab("write")}>Write</button>
          <button type="button" role="tab" aria-selected={tab === "preview"} className={tab === "preview" ? "on" : ""} onClick={() => setTab("preview")}>Preview</button>
        </div>
        {tab === "write" && (
          <div className="row" style={{ gap: 4 }}>
            <button type="button" className="btn ghost sm" title="Bold" onClick={() => insert("**", "**", "bold")}><b>B</b></button>
            <button type="button" className="btn ghost sm" title="Inline maths" onClick={() => insert("$", "$", "E = mc^2")}>$x$</button>
            <button type="button" className="btn ghost sm" title="Display maths" onClick={() => insert("\n$$\n", "\n$$\n", "\\Delta v = I_{sp} g_0 \\ln\\frac{m_0}{m_f}")}>∑</button>
            <button type="button" className="btn ghost sm" title="List" onClick={() => insert("\n- ", "", "item")}>•</button>
          </div>
        )}
      </div>
      {tab === "write" ? (
        <textarea id={id} ref={ref} className="field mono" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ resize: "vertical", fontSize: "0.92rem" }} />
      ) : (
        <div className="card" style={{ minHeight: 120 }}>{value.trim() ? <Markdown text={value} /> : <p className="muted">Nothing to preview yet.</p>}</div>
      )}
      <p className="muted" style={{ fontSize: "0.78rem", margin: "6px 0 0" }}>**bold**, lists and links work · maths with $…$ (inline) or $$…$$ (on its own line)</p>
    </div>
  );
}

/* ===================================================================== */
/*  /community/new                                                        */
/* ===================================================================== */
const TEMPLATES: Partial<Record<CategoryId, string>> = {
  calculations: "**What I'm calculating:**\n\n**My numbers:**\n- \n\n**My working:**\n$$ $$\n\n**Where I'm stuck:**\n",
  "telescope-imaging": "**Target:**\n**Telescope:**\n**Camera:**\n**Mount / tracking:**\n**Exposure:** frames × seconds, gain/ISO\n**Processing:**\n\n**Question or notes:**\n",
  projects: "**What I made:**\n\n**How I did it:**\n\n**What I learned:**\n",
};

export function NewPost() {
  useTitle("New post");
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { me, reload } = useMe();
  const [category, setCategory] = useState<CategoryId>((categoryById(params.get("c") ?? "")?.id as CategoryId) ?? "questions");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  if (!forum) return <NotConnected />;
  if (me === undefined) return <div className="container page-head"><p className="muted">Loading…</p></div>;

  const pickImage = (f: File | null) => {
    setErr(null);
    if (preview) URL.revokeObjectURL(preview);
    if (!f) { setImage(null); setPreview(null); return; }
    const bad = checkImage(f);
    if (bad) { setErr(bad); return; }
    setImage(f);
    setPreview(URL.createObjectURL(f));
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) return setErr("Titles need at least 5 characters.");
    if (!body.trim()) return setErr("Please write something in your post.");
    setBusy(true);
    setErr(null);
    try {
      const id = await forum!.createPost({ category, title, body, image });
      nav(`/community/post/${id}`);
    } catch (x) {
      setErr(friendlyError(x));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 820, paddingBottom: 80 }}>
      <div className="page-head">
        <Link to="/community" className="muted mono" style={{ fontSize: "0.78rem" }}>← COMMUNITY</Link>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginTop: 12 }}>New post</h1>
      </div>
      <DemoBanner />
      {me === null ? (
        <SignInPrompt what="write a post" />
      ) : me.banned ? (
        <div className="callout">Your account can't post right now. If you think this is a mistake, contact the site owner.</div>
      ) : !me.profile ? (
        <NameGate me={me} onDone={reload} />
      ) : (
        <form onSubmit={submit} className="grid" style={{ gap: 18 }}>
          <div>
            <label className="lbl">Category</label>
            <div className="row">
              {CATEGORIES.map((c) => (
                <button type="button" key={c.id} className={`chip ${category === c.id ? "on" : ""}`} onClick={() => { setCategory(c.id); if (!body.trim() && TEMPLATES[c.id]) setBody(TEMPLATES[c.id]!); }}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <p className="muted" style={{ fontSize: "0.85rem", margin: "6px 0 0" }}>{categoryById(category)?.blurb}</p>
          </div>
          <div>
            <label className="lbl" htmlFor="pt">Title</label>
            <input id="pt" className="field" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} placeholder="e.g. How long can I expose with a 135 mm lens?" required />
          </div>
          <div>
            <label className="lbl" htmlFor="pb">Post</label>
            <Editor id="pb" value={body} onChange={setBody} rows={12} placeholder={"Share your project, numbers or question.\nMaths: $v = \\sqrt{GM/r}$"} />
            {!body && TEMPLATES[category] && <button type="button" className="btn ghost sm" onClick={() => setBody(TEMPLATES[category]!)}>Use the {categoryById(category)?.label} template</button>}
          </div>
          <div>
            <label className="lbl" htmlFor="pi">Photo (optional · JPG, PNG, WebP or GIF · up to 5 MB)</label>
            <input id="pi" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => pickImage(e.target.files?.[0] ?? null)} />
            {preview && (
              <div style={{ marginTop: 10, position: "relative", maxWidth: 420 }}>
                <img src={preview} alt="Preview of your upload" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)" }} />
                <button type="button" className="btn sm" style={{ marginTop: 8 }} onClick={() => pickImage(null)}>Remove photo</button>
              </div>
            )}
          </div>
          <p className="muted" style={{ fontSize: "0.85rem", margin: 0 }}>Posting as <b style={{ color: "var(--fg)" }}>{me.profile.display_name}</b>. By posting you agree to the community guidelines.</p>
          {err && <p role="alert" style={{ color: "var(--danger)", fontWeight: 600, margin: 0 }}>{err}</p>}
          <div className="row">
            <button className="btn primary" disabled={busy}>{busy ? "Posting…" : "Publish post"}</button>
            <Link to="/community" className="btn ghost">Cancel</Link>
          </div>
        </form>
      )}
    </div>
  );
}

/* ===================================================================== */
/*  /community/post/:id                                                   */
/* ===================================================================== */
export function PostPage() {
  const { id } = useParams();
  const postId = Number(id);
  const nav = useNavigate();
  const { me, reload } = useMe();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  useTitle(post?.title ?? "Post");

  const load = useCallback(async () => {
    if (!forum || !Number.isFinite(postId)) return setPost(null);
    try {
      const [p, c, l] = await Promise.all([forum.getPost(postId), forum.listComments(postId), forum.likedByMe([postId])]);
      setPost(p);
      setComments(c);
      setLiked(l.has(postId));
    } catch (e) {
      setErr(friendlyError(e));
      setPost(null);
    }
  }, [postId]);
  useEffect(() => {
    void load();
  }, [load, me?.id]);

  if (!forum) return <NotConnected />;
  if (post === undefined) return <div className="container page-head"><p className="muted">Loading…</p></div>;
  if (post === null)
    return (
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <Mascot size={120} mood="think" />
        <h2 style={{ marginTop: 16 }}>Post not found</h2>
        <p className="muted">It may have been removed. {err}</p>
        <Link to="/community" className="btn">Back to community</Link>
      </div>
    );

  const cat = categoryById(post.category);
  const canPost = !!me?.profile && !me.banned;
  const mine = me?.id === post.author_id;
  const act = async (fn: () => Promise<void>, ok?: string) => {
    setBusy(true);
    setErr(null);
    try {
      await fn();
      if (ok) setNote(ok);
      await load();
    } catch (e) {
      setErr(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };
  const like = () => {
    if (!canPost) return setErr(me ? "Choose a community name first (scroll down)." : "Sign in to like posts.");
    void act(() => forum!.setLike(post.id, !liked));
  };
  const report = (target: "post" | "comment", tid: number) => {
    const reason = prompt("What's wrong with it? (spam, rude, personal info, wrong category…)");
    if (reason && reason.trim().length >= 3) void act(() => forum!.report(target, tid, reason.trim()), "Thanks — a moderator will take a look.");
  };

  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <div className="page-head" style={{ paddingBottom: 16 }}>
        <Link to={`/community?c=${post.category}`} className="muted mono" style={{ fontSize: "0.78rem" }}>← {cat?.label.toUpperCase()}</Link>
      </div>
      <DemoBanner />
      {post.is_hidden && <div className="callout">This post is hidden by a moderator. Only you and moderators can see it.</div>}
      <article className="card" style={{ padding: 28 }}>
        <div className="spread">
          <span className="tag">{cat?.emoji} {cat?.label}</span>
          <span className="muted" style={{ fontSize: "0.85rem" }}>{post.author?.display_name ?? "Someone"} · {timeAgo(post.created_at)}</span>
        </div>
        <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", margin: "14px 0" }}>{post.title}</h1>
        {post.image_path && (
          <a href={forum.imageUrl(post.image_path)} target="_blank" rel="noreferrer">
            <img src={forum.imageUrl(post.image_path)} alt={`Photo for: ${post.title}`} loading="lazy" style={{ width: "100%", borderRadius: 14, border: "1px solid var(--border)", marginBottom: 16 }} />
          </a>
        )}
        <Markdown text={post.body} />
        <div className="row" style={{ marginTop: 20 }}>
          <button className={`btn sm ${liked ? "primary" : ""}`} onClick={like} disabled={busy} aria-pressed={liked}>▲ {liked ? "Liked" : "Like"} · {post.like_count}</button>
          {me && !mine && <button className="btn ghost sm" onClick={() => report("post", post.id)} disabled={busy}>⚑ Report</button>}
          {(mine || me?.isAdmin) && (
            <button className="btn ghost sm" style={{ color: "var(--danger)" }} disabled={busy} onClick={() => { if (confirm("Delete this post and its comments? This can't be undone.")) void act(async () => { await forum!.deletePost(post); nav("/community"); }); }}>
              🗑 Delete
            </button>
          )}
          {me?.isAdmin && !mine && (
            <button className="btn ghost sm" disabled={busy} onClick={() => act(() => forum!.moderate("post", post.id, !post.is_hidden), post.is_hidden ? "Post visible again." : "Post hidden.")}>
              🛡️ {post.is_hidden ? "Unhide" : "Hide"}
            </button>
          )}
        </div>
        {note && <p className="status-ok" style={{ marginBottom: 0 }}>{note}</p>}
        {err && <p role="alert" style={{ color: "var(--danger)", fontWeight: 600, marginBottom: 0 }}>{err}</p>}
      </article>

      <h3 style={{ marginTop: 32 }}>💬 {comments.length} {comments.length === 1 ? "reply" : "replies"}</h3>
      <div className="grid" style={{ gap: 12 }}>
        {comments.map((c) => (
          <div key={c.id} className="card" style={{ padding: 18, opacity: c.is_hidden ? 0.6 : 1 }}>
            <div className="spread" style={{ marginBottom: 6 }}>
              <b style={{ fontSize: "0.9rem" }}>{c.author?.display_name ?? "Someone"} {c.author_id === post.author_id && <span className="tag">author</span>}</b>
              <span className="muted" style={{ fontSize: "0.8rem" }}>{timeAgo(c.created_at)}{c.is_hidden ? " · hidden" : ""}</span>
            </div>
            <Markdown text={c.body} />
            <div className="row" style={{ gap: 4 }}>
              {me && me.id !== c.author_id && <button className="btn ghost sm" onClick={() => report("comment", c.id)}>⚑ Report</button>}
              {(me?.id === c.author_id || me?.isAdmin) && <button className="btn ghost sm" onClick={() => { if (confirm("Delete this reply?")) void act(() => forum!.deleteComment(c.id)); }}>🗑 Delete</button>}
              {me?.isAdmin && me.id !== c.author_id && <button className="btn ghost sm" onClick={() => act(() => forum!.moderate("comment", c.id, !c.is_hidden))}>🛡️ {c.is_hidden ? "Unhide" : "Hide"}</button>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {me === null ? (
          <SignInPrompt what="reply" />
        ) : me && !me.profile ? (
          <NameGate me={me} onDone={reload} />
        ) : me?.banned ? null : me ? (
          <form onSubmit={(e) => { e.preventDefault(); if (reply.trim()) void act(async () => { await forum!.addComment(post.id, reply.trim()); setReply(""); }); }} className="grid" style={{ gap: 10 }}>
            <label className="lbl" htmlFor="reply">Your reply</label>
            <Editor id="reply" value={reply} onChange={setReply} rows={5} placeholder="Help out, share your numbers, or ask a follow-up…" />
            <div><button className="btn primary" disabled={busy || !reply.trim()}>{busy ? "Posting…" : "Post reply"}</button></div>
          </form>
        ) : null}
      </div>
    </div>
  );
}

/* ===================================================================== */
/*  /community/moderate                                                   */
/* ===================================================================== */
export function Moderation() {
  useTitle("Moderation");
  const { me } = useMe();
  const [reports, setReports] = useState<Report[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!forum) return;
    try {
      setReports(await forum.listReports());
    } catch (e) {
      setErr(friendlyError(e));
    }
  }, []);
  useEffect(() => {
    if (me?.isAdmin) void load();
  }, [me?.isAdmin, load]);
  if (!forum) return <NotConnected />;
  if (me === undefined) return <div className="container page-head"><p className="muted">Loading…</p></div>;
  if (!me?.isAdmin)
    return (
      <div className="container page-head">
        <h1 style={{ fontSize: "2rem" }}>Moderators only</h1>
        <p className="muted">This page is for community moderators. <Link to="/community">Back to community</Link></p>
      </div>
    );
  const act = async (fn: () => Promise<void>) => {
    try {
      await fn();
      await load();
    } catch (e) {
      setErr(friendlyError(e));
    }
  };
  return (
    <div className="container" style={{ maxWidth: 900, paddingBottom: 80 }}>
      <div className="page-head">
        <Link to="/community" className="muted mono" style={{ fontSize: "0.78rem" }}>← COMMUNITY</Link>
        <h1 style={{ fontSize: "2.4rem", marginTop: 12 }}>🛡️ Moderation queue</h1>
        <p className="muted">Open reports, newest first. Hiding something resolves every report about it.</p>
      </div>
      <DemoBanner />
      {err && <p role="alert" style={{ color: "var(--danger)" }}>{err}</p>}
      {reports === null ? (
        <p className="muted">Loading…</p>
      ) : !reports.length ? (
        <div className="card"><LambdaSays mood="cheer">All clear — no open reports. Nice work keeping the community friendly!</LambdaSays></div>
      ) : (
        <div className="grid" style={{ gap: 12 }}>
          {reports.map((r) => {
            const target = r.post ? "post" : "comment";
            const tid = r.post?.id ?? r.comment?.id;
            const authorId = r.post?.author_id ?? r.comment?.author_id;
            const link = r.post ? `/community/post/${r.post.id}` : r.comment ? `/community/post/${r.comment.post_id}` : null;
            return (
              <div key={r.id} className="card">
                <div className="spread">
                  <span className="tag">{target}</span>
                  <span className="muted" style={{ fontSize: "0.8rem" }}>{timeAgo(r.created_at)}</span>
                </div>
                <p style={{ margin: "10px 0" }}><b>Reason:</b> {r.reason}</p>
                <p className="muted" style={{ margin: "0 0 12px" }}>{r.post ? r.post.title : r.comment ? plainPreview(r.comment.body, 200) : "(already deleted)"}</p>
                <div className="row">
                  {link && <Link to={link} className="btn sm">Open</Link>}
                  {tid !== undefined && <button className="btn sm" onClick={() => act(() => forum!.moderate(target, tid, true))}>Hide {target}</button>}
                  <button className="btn ghost sm" onClick={() => act(() => forum!.dismissReport(r.id))}>Dismiss</button>
                  {authorId && forumMode === "live" && (
                    <button className="btn ghost sm" style={{ color: "var(--danger)" }} onClick={() => { const why = prompt("Ban this user? Their posts will be hidden. Reason:"); if (why) void act(() => forum!.ban(authorId, why)); }}>Ban author</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
