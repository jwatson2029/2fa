-- ============================================================
-- Migration: 20260406000000_init.sql
-- Sets up the public.profiles table, RLS policies, and an
-- automatic trigger that creates a profile row whenever a new
-- user signs up (email/password or Google SAML SSO).
-- ============================================================

-- ------------------------------------------------------------
-- 1.  profiles table
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  provider   text,                         -- 'email' | 'saml'
  created_at timestamptz default now() not null
);

comment on table public.profiles is
  'One row per authenticated user; kept in sync with auth.users via trigger.';

-- ------------------------------------------------------------
-- 2.  Row-Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;

-- Each user can read their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Each user can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- ------------------------------------------------------------
-- 3.  Trigger: auto-create a profile on user sign-up
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_app_meta_data ->> 'provider', 'email')
  )
  on conflict (id) do nothing;   -- idempotent; safe to re-run
  return new;
end;
$$;

-- Drop the trigger first so the migration is re-runnable
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
