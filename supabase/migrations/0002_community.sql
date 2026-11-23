-- =====================================================================
-- Lambda Learn community forum
-- Run this in Supabase → SQL Editor after 0001_progress.sql.
--
-- Security model, in plain words:
--   * Anyone (even logged out) can READ visible posts and comments.
--   * Signed-in users with a profile can post, comment, like and report.
--   * You can only edit or delete your own things.
--   * Admins (rows in public.admins) can hide anything, ban users and read reports.
--   * Rate limits slow down spam: 5 posts and 30 comments per hour per person.
-- =====================================================================

-- Make the progress table's permissions explicit (Supabase grants these by default; other Postgres hosts do not).
grant select, insert, update, delete on public.progress to authenticated;

/* ---------------- Profiles (public display names) ---------------- */
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 40),
  bio          text check (char_length(bio) <= 280),
  created_at   timestamptz not null default now()
);

/* Admins and bans are managed only from the SQL editor or the moderation page. */
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
create table public.banned (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  reason     text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Signed in, has a profile, and not banned.
create or replace function public.can_post()
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null
     and exists (select 1 from public.profiles where id = auth.uid())
     and not exists (select 1 from public.banned where user_id = auth.uid());
$$;

/* ---------------- Posts ---------------- */
create table public.posts (
  id            bigint generated always as identity primary key,
  author_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  category      text not null check (category in ('calculations', 'mathematics', 'telescope-imaging', 'projects', 'questions', 'general')),
  title         text not null check (char_length(btrim(title)) between 5 and 140),
  body          text not null check (char_length(body) between 1 and 20000),
  image_path    text check (image_path is null or image_path ~ '^[0-9a-f-]{36}/[A-Za-z0-9._-]{1,120}$'),
  is_hidden     boolean not null default false,
  like_count    integer not null default 0,
  comment_count integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  search        tsvector generated always as (to_tsvector('english', title || ' ' || body)) stored
);
create index posts_category_created on public.posts (category, created_at desc);
create index posts_created on public.posts (created_at desc);
create index posts_search on public.posts using gin (search);

/* ---------------- Comments ---------------- */
create table public.comments (
  id         bigint generated always as identity primary key,
  post_id    bigint not null references public.posts (id) on delete cascade,
  author_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 5000),
  is_hidden  boolean not null default false,
  created_at timestamptz not null default now()
);
create index comments_post on public.comments (post_id, created_at);

/* ---------------- Likes ---------------- */
create table public.likes (
  post_id    bigint not null references public.posts (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

/* ---------------- Reports ---------------- */
create table public.reports (
  id          bigint generated always as identity primary key,
  post_id     bigint references public.posts (id) on delete cascade,
  comment_id  bigint references public.comments (id) on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  reason      text not null check (char_length(btrim(reason)) between 3 and 500),
  resolved    boolean not null default false,
  created_at  timestamptz not null default now(),
  check (num_nonnulls(post_id, comment_id) = 1)
);

/* ---------------- Triggers: counters, timestamps, rate limits ---------------- */
create or replace function public.tg_like_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
  else
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end $$;
create trigger likes_count after insert or delete on public.likes
  for each row execute function public.tg_like_count();

create or replace function public.tg_comment_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
  else
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end $$;
create trigger comments_count after insert or delete on public.comments
  for each row execute function public.tg_comment_count();

create or replace function public.tg_touch_updated() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger posts_touch before update on public.posts
  for each row execute function public.tg_touch_updated();

create or replace function public.tg_rate_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if public.is_admin() then return new; end if;
  if tg_table_name = 'posts' then
    select count(*) into n from public.posts where author_id = new.author_id and created_at > now() - interval '1 hour';
    if n >= 5 then raise exception 'Slow down: you can create 5 posts per hour.' using errcode = 'P0001'; end if;
  else
    select count(*) into n from public.comments where author_id = new.author_id and created_at > now() - interval '1 hour';
    if n >= 30 then raise exception 'Slow down: you can write 30 comments per hour.' using errcode = 'P0001'; end if;
  end if;
  return new;
end $$;
create trigger posts_rate before insert on public.posts for each row execute function public.tg_rate_limit();
create trigger comments_rate before insert on public.comments for each row execute function public.tg_rate_limit();

/* ---------------- Row-level security ---------------- */
alter table public.profiles enable row level security;
alter table public.admins   enable row level security;
alter table public.banned   enable row level security;
alter table public.posts    enable row level security;
alter table public.comments enable row level security;
alter table public.likes    enable row level security;
alter table public.reports  enable row level security;

-- Column-level grants: users can never set counters, is_hidden or author ids themselves.
revoke all on public.profiles, public.admins, public.banned, public.posts, public.comments, public.likes, public.reports from anon, authenticated;
grant select on public.profiles, public.posts, public.comments, public.likes to anon, authenticated;
grant insert (id, display_name, bio) on public.profiles to authenticated;
grant update (display_name, bio) on public.profiles to authenticated;
grant insert (category, title, body, image_path) on public.posts to authenticated;
grant update (category, title, body, image_path) on public.posts to authenticated;
grant delete on public.posts, public.comments, public.likes to authenticated;
grant insert (post_id, body) on public.comments to authenticated;
grant insert (post_id) on public.likes to authenticated;
grant insert (post_id, comment_id, reason) on public.reports to authenticated;
grant select, update (resolved) on public.reports to authenticated;
grant select on public.admins, public.banned to authenticated;

create policy "profiles: anyone can read"  on public.profiles for select using (true);
create policy "profiles: create own"       on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles: update own"       on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "admins: see self"           on public.admins for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "banned: admins or self"     on public.banned for select to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "posts: read visible"        on public.posts for select using (not is_hidden or author_id = auth.uid() or public.is_admin());
create policy "posts: create"              on public.posts for insert to authenticated with check (author_id = auth.uid() and public.can_post());
create policy "posts: edit own"            on public.posts for update to authenticated using (author_id = auth.uid() and public.can_post()) with check (author_id = auth.uid());
create policy "posts: delete own or admin" on public.posts for delete to authenticated using (author_id = auth.uid() or public.is_admin());

create policy "comments: read visible"     on public.comments for select using (not is_hidden or author_id = auth.uid() or public.is_admin());
create policy "comments: create"           on public.comments for insert to authenticated
  with check (author_id = auth.uid() and public.can_post()
              and exists (select 1 from public.posts p where p.id = post_id and not p.is_hidden));
create policy "comments: delete own or admin" on public.comments for delete to authenticated using (author_id = auth.uid() or public.is_admin());

create policy "likes: anyone can read"     on public.likes for select using (true);
create policy "likes: add own"             on public.likes for insert to authenticated with check (user_id = auth.uid() and public.can_post());
create policy "likes: remove own"          on public.likes for delete to authenticated using (user_id = auth.uid());

create policy "reports: file"              on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "reports: admins read"       on public.reports for select to authenticated using (public.is_admin());
create policy "reports: admins resolve"    on public.reports for update to authenticated using (public.is_admin()) with check (public.is_admin());

/* ---------------- Moderation (admins only) ---------------- */
create or replace function public.moderate(target text, target_id bigint, hide boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only moderators can do this.' using errcode = '42501'; end if;
  if target = 'post' then
    update public.posts set is_hidden = hide where id = target_id;
    update public.reports set resolved = true where post_id = target_id;
  elsif target = 'comment' then
    update public.comments set is_hidden = hide where id = target_id;
    update public.reports set resolved = true where comment_id = target_id;
  else
    raise exception 'Unknown target %', target;
  end if;
end $$;

create or replace function public.ban_user(uid uuid, why text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only moderators can do this.' using errcode = '42501'; end if;
  if uid = auth.uid() then raise exception 'You cannot ban yourself.'; end if;
  insert into public.banned (user_id, reason) values (uid, why) on conflict (user_id) do update set reason = excluded.reason;
  update public.posts set is_hidden = true where author_id = uid;
  update public.comments set is_hidden = true where author_id = uid;
end $$;

create or replace function public.unban_user(uid uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only moderators can do this.' using errcode = '42501'; end if;
  delete from public.banned where user_id = uid;
end $$;

revoke execute on function public.moderate(text, bigint, boolean), public.ban_user(uuid, text), public.unban_user(uuid) from public, anon;
grant execute on function public.moderate(text, bigint, boolean), public.ban_user(uuid, text), public.unban_user(uuid) to authenticated;
grant execute on function public.is_admin(), public.can_post() to anon, authenticated;

/* ---------------- Photo storage ---------------- */
-- Public bucket: anyone can view images; uploads limited to 5 MB images in your own folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community', 'community', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

create policy "community images: upload to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'community' and (storage.foldername(name))[1] = auth.uid()::text and public.can_post());
create policy "community images: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'community' and (storage.foldername(name))[1] = auth.uid()::text);
