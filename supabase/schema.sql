create table if not exists public.pix_finance_profiles (
  vault_id text primary key,
  settings jsonb not null default '{"accountBalance":0,"periodStartDay":27,"savingsGoal":0,"fixedCosts":0}',
  transactions jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pix_finance_profiles enable row level security;

-- Modelo simples para app pessoal sem autenticação.
-- Para uso sensível/compartilhado, substitua por autenticação Supabase Auth.
drop policy if exists "allow anonymous read by vault id" on public.pix_finance_profiles;
create policy "allow anonymous read by vault id"
  on public.pix_finance_profiles
  for select
  using (true);

drop policy if exists "allow anonymous insert" on public.pix_finance_profiles;
create policy "allow anonymous insert"
  on public.pix_finance_profiles
  for insert
  with check (true);

drop policy if exists "allow anonymous update" on public.pix_finance_profiles;
create policy "allow anonymous update"
  on public.pix_finance_profiles
  for update
  using (true)
  with check (true);
