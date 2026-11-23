/**
 * Tests the real SQL migrations against an in-memory Postgres (PGlite),
 * with small stand-ins for Supabase's `auth` and `storage` schemas.
 * Each test switches role to `anon` or `authenticated`, exactly like
 * Supabase does for real requests, so row-level security is enforced.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const MIG = join(__dirname, "..", "migrations");
const ALICE = "11111111-1111-4111-8111-111111111111";
const BOB = "22222222-2222-4222-8222-222222222222";
const MOD = "33333333-3333-4333-8333-333333333333";
const NOPROFILE = "44444444-4444-4444-8444-444444444444";

let db: PGlite;

async function as(uid: string | null, sql: string, params: unknown[] = []) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid ?? ""}', false); set role ${uid ? "authenticated" : "anon"};`);
  try {
    return await db.query<Record<string, unknown>>(sql, params);
  } finally {
    await db.exec("reset role;");
  }
}
const fails = async (p: Promise<unknown>, re?: RegExp) => {
  let err: unknown;
  try {
    await p;
  } catch (e) {
    err = e;
  }
  expect(err, "expected the statement to be rejected").toBeTruthy();
  if (re) expect(String((err as Error).message)).toMatch(re);
};

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create schema storage;
    create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as
      $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
    grant usage on schema public, auth, storage to anon, authenticated;
    grant select, insert, delete on storage.objects to authenticated;
    insert into auth.users values ('${ALICE}'), ('${BOB}'), ('${MOD}'), ('${NOPROFILE}');
  `);
  await db.exec(readFileSync(join(MIG, "0001_progress.sql"), "utf8"));
  await db.exec(readFileSync(join(MIG, "0002_community.sql"), "utf8"));
  // Make MOD an admin (done by the site owner in the SQL editor).
  await db.exec(`insert into public.admins values ('${MOD}');`);
  for (const [id, name] of [[ALICE, "Alice"], [BOB, "Bob"], [MOD, "Mod"]]) {
    await as(id, "insert into public.profiles (id, display_name) values ($1, $2)", [id, name]);
  }
});

const post = (uid: string, title = "My first Orion photo", category = "telescope-imaging") =>
  as(uid, "insert into public.posts (category, title, body) values ($1, $2, 'Shot with a 80mm refractor. $$m = -2.5\\log_{10}(F)$$') returning id", [category, title]);

describe("community database rules", () => {
  it("lets anyone read posts but only signed-in users with a profile write", async () => {
    await fails(as(null, "insert into public.posts (category, title, body) values ('general', 'Hello there', 'hi')"));
    await fails(as(NOPROFILE, "insert into public.posts (category, title, body) values ('general', 'Hello there', 'hi')"));
    const { rows } = await post(ALICE);
    expect(rows[0].id).toBeTruthy();
    const anon = await as(null, "select title, author_id from public.posts");
    expect(anon.rows.length).toBe(1);
    expect(anon.rows[0].author_id).toBe(ALICE);
  });

  it("stops people setting counters, hiding flags or someone else's name", async () => {
    await fails(as(ALICE, "insert into public.posts (category, title, body, like_count) values ('general', 'Cheating likes', 'x', 999)"), /permission denied/);
    await fails(as(ALICE, "update public.posts set is_hidden = true"), /permission denied/);
    await fails(as(ALICE, "insert into public.profiles (id, display_name) values ($1, 'Fake Bob')", [BOB]));
    await fails(as(ALICE, "insert into public.posts (category, title, body) values ('nonsense', 'Bad category', 'x')"), /check/);
  });

  it("only lets authors edit or delete their own posts", async () => {
    const { rows } = await post(BOB, "Bob's Saturn video");
    const id = rows[0].id;
    const edit = await as(ALICE, "update public.posts set title = 'Hacked title!' where id = $1", [id]);
    expect(edit.affectedRows).toBe(0);
    const del = await as(ALICE, "delete from public.posts where id = $1", [id]);
    expect(del.affectedRows).toBe(0);
    const own = await as(BOB, "update public.posts set title = 'Bob''s Saturn video (edited)' where id = $1", [id]);
    expect(own.affectedRows).toBe(1);
  });

  it("keeps like and comment counts in sync and blocks double likes", async () => {
    const { rows } = await post(ALICE, "Plate scale question");
    const id = rows[0].id;
    await as(BOB, "insert into public.likes (post_id) values ($1)", [id]);
    await fails(as(BOB, "insert into public.likes (post_id) values ($1)", [id]), /duplicate/);
    await as(BOB, "insert into public.comments (post_id, body) values ($1, 'Use 206.265 × pixel size / focal length')", [id]);
    let r = await as(null, "select like_count, comment_count from public.posts where id = $1", [id]);
    expect(r.rows[0]).toEqual({ like_count: 1, comment_count: 1 });
    await as(BOB, "delete from public.likes where post_id = $1", [id]);
    r = await as(null, "select like_count from public.posts where id = $1", [id]);
    expect(r.rows[0].like_count).toBe(0);
  });

  it("rate-limits posting to 5 per hour", async () => {
    // Alice already has 2 posts from earlier tests; 3 more are allowed.
    for (let i = 0; i < 3; i++) await post(ALICE, `Practice post number ${i}`);
    await fails(post(ALICE, "One too many posts"), /Slow down/);
  });

  it("lets moderators hide posts and blocks everyone else", async () => {
    const { rows } = await post(BOB, "Something rude");
    const id = rows[0].id;
    await fails(as(ALICE, "select public.moderate('post', $1, true)", [id]), /Only moderators/);
    await as(MOD, "select public.moderate('post', $1, true)", [id]);
    expect((await as(null, "select 1 from public.posts where id = $1", [id])).rows.length).toBe(0);
    expect((await as(BOB, "select 1 from public.posts where id = $1", [id])).rows.length).toBe(1); // author still sees it
    await fails(as(ALICE, "insert into public.comments (post_id, body) values ($1, 'reply')", [id]));
  });

  it("keeps reports private to moderators", async () => {
    const { rows } = await as(BOB, "select id from public.posts where author_id = $1 limit 1", [BOB]);
    await as(ALICE, "insert into public.reports (post_id, reason) values ($1, 'Spam link')", [rows[0].id]);
    expect((await as(ALICE, "select * from public.reports")).rows.length).toBe(0);
    expect((await as(MOD, "select * from public.reports")).rows.length).toBe(1);
  });

  it("bans users: they can't post and their posts disappear", async () => {
    await as(MOD, "select public.ban_user($1, 'spam')", [BOB]);
    await fails(post(BOB, "I'm back with spam"));
    const visible = await as(null, "select 1 from public.posts where author_id = $1", [BOB]);
    expect(visible.rows.length).toBe(0);
    await as(MOD, "select public.unban_user($1)", [BOB]);
  });

  it("only allows photo uploads into your own folder", async () => {
    await as(ALICE, "insert into storage.objects (bucket_id, name) values ('community', $1)", [`${ALICE}/orion.jpg`]);
    await fails(as(ALICE, "insert into storage.objects (bucket_id, name) values ('community', $1)", [`${BOB}/fake.jpg`]));
    await fails(as(null, "insert into storage.objects (bucket_id, name) values ('community', $1)", [`${ALICE}/anon.jpg`]));
  });

  it("keeps the existing progress table private per user", async () => {
    await as(ALICE, "insert into public.progress (user_id, data) values ($1, '{}')", [ALICE]);
    expect((await as(BOB, "select * from public.progress")).rows.length).toBe(0);
    expect((await as(ALICE, "select * from public.progress")).rows.length).toBe(1);
  });
});
