-- TalentPath initial relational schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'student' check (role in ('student','coach','mentor','organization')),
  headline text,
  about text,
  location text,
  avatar_url text,
  visibility text not null default 'public' check (visibility in ('public','private','coaches_only')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text not null,
  level numeric check (level between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  rubric jsonb not null default '[]'::jsonb,
  xp integer not null default 0,
  published boolean not null default false,
  creator_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id uuid references public.challenges(id) on delete set null,
  category text not null,
  evidence_url text,
  evidence_type text not null default 'video',
  status text not null default 'submitted' check (status in ('draft','submitted','reviewed')),
  ai_feedback jsonb,
  coach_feedback text,
  score numeric check (score between 0 and 100),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  unique(requester_id, recipient_id),
  check (requester_id <> recipient_id)
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles(id) on delete set null,
  title text not null,
  organization text not null,
  category text not null,
  location text,
  description text not null,
  application_url text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) <= 3000),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.challenges enable row level security;
alter table public.submissions enable row level security;
alter table public.connections enable row level security;
alter table public.opportunities enable row level security;
alter table public.community_posts enable row level security;

-- Profiles: public or authenticated can read public profiles; users only edit own profile.
create policy "public profiles readable" on public.profiles for select using (visibility = 'public' or auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "skills owner manages" on public.skills for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "published challenges readable" on public.challenges for select using (published = true or auth.uid() = creator_id);
create policy "challenge creator manages" on public.challenges for all using (auth.uid() = creator_id) with check (auth.uid() = creator_id);
create policy "submission owner or coach reads" on public.submissions for select using (auth.uid() = owner_id);
create policy "submission owner creates" on public.submissions for insert with check (auth.uid() = owner_id);
create policy "submission owner edits" on public.submissions for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "connection participants read" on public.connections for select using (auth.uid() = requester_id or auth.uid() = recipient_id);
create policy "requester creates connection" on public.connections for insert with check (auth.uid() = requester_id);
create policy "recipient updates connection" on public.connections for update using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);
create policy "open opportunities readable" on public.opportunities for select using (status = 'open' or auth.uid() = creator_id);
create policy "creator manages opportunities" on public.opportunities for all using (auth.uid() = creator_id) with check (auth.uid() = creator_id);
create policy "community posts readable" on public.community_posts for select using (true);
create policy "author creates own post" on public.community_posts for insert with check (auth.uid() = author_id);
create policy "author edits own post" on public.community_posts for update using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- Storage bucket: create `talent-evidence` in Supabase Storage dashboard, private by default.
-- Storage object policies should restrict uploads/downloads to authenticated owners;
-- avoid public buckets for student video by default.
