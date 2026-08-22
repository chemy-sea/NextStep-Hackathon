-- =============================================================================
-- TrashMap — Step 2 & 3 migration: `bounties` table + RLS, `bounty-photos` bucket + RLS
-- DEMO MODE: no auth dependency — anon key can select/insert/update bounties
-- and upload photos. poster_id is nullable. There is NO ownership check on
-- insert/update and NO per-user folder isolation on storage uploads.
--
-- This intentionally has zero backend enforcement against fraud/spam beyond
-- what the client UI does. Fine for a disposable hackathon demo; revisit
-- before any real users/data are involved (see chat notes).
--
-- Run this whole block once in the Supabase Dashboard → SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS guards.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 2: bounties table (demo version — no auth dependency)
-- -----------------------------------------------------------------------------

create table if not exists public.bounties (
  id                 uuid primary key default gen_random_uuid(),
  poster_id          uuid references auth.users(id) on delete cascade,
  title              text not null,
  description        text,
  category           text not null,
  severity           text not null,
  latitude           float8 not null,
  longitude          float8 not null,
  location_accuracy  float8,
  photo_url          text not null,
  status             text not null default 'open',
  points             int not null,
  karma              int not null,
  created_at         timestamptz not null default now(),

  constraint bounties_category_check
    check (category in ('plastic', 'cans', 'glass', 'bulky', 'hazardous', 'mixed')),
  constraint bounties_severity_check
    check (severity in ('low', 'medium', 'high', 'critical')),
  constraint bounties_status_check
    check (status in ('open', 'claimed', 'pending_verification', 'verified', 'disputed'))
);

create index if not exists bounties_poster_id_idx on public.bounties (poster_id);
create index if not exists bounties_status_idx on public.bounties (status);
create index if not exists bounties_created_at_idx on public.bounties (created_at desc);

alter table public.bounties enable row level security;

drop policy if exists "bounties_select_public" on public.bounties;
create policy "bounties_select_public"
  on public.bounties for select to anon, authenticated using (true);

drop policy if exists "bounties_insert_public" on public.bounties;
create policy "bounties_insert_public"
  on public.bounties for insert to anon, authenticated with check (true);

drop policy if exists "bounties_update_public" on public.bounties;
create policy "bounties_update_public"
  on public.bounties for update to anon, authenticated using (true) with check (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bounties'
  ) then
    alter publication supabase_realtime add table public.bounties;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- STEP 3: bounty-photos bucket (demo version — no auth dependency)
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('bounty-photos', 'bounty-photos', true)
on conflict (id) do nothing;

drop policy if exists "bounty_photos_public_read" on storage.objects;
create policy "bounty_photos_public_read"
  on storage.objects for select to public using (bucket_id = 'bounty-photos');

drop policy if exists "bounty_photos_public_insert" on storage.objects;
create policy "bounty_photos_public_insert"
  on storage.objects for insert to anon, authenticated with check (bucket_id = 'bounty-photos');
