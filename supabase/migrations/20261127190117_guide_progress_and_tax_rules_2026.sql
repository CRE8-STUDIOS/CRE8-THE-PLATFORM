create type public.guide_track as enum ('app', 'money');

create table public.guide_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  track public.guide_track not null,
  item_slug text not null check (item_slug ~ '^[a-z0-9-]{1,60}$'),
  step integer not null default 0 check (step >= 0),
  completed_at timestamptz,
  unique (user_id, track, item_slug)
);
comment on table public.guide_progress is 'Which guide chapters and lessons a freelancer started or finished. Lesson texts live in the app code.';

alter table public.guide_progress enable row level security;
create policy "Freelancer reads own progress" on public.guide_progress for select to authenticated using (user_id = (select auth.uid()));
create policy "Freelancer creates own progress" on public.guide_progress for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Freelancer updates own progress" on public.guide_progress for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Freelancer deletes own progress" on public.guide_progress for delete to authenticated using (user_id = (select auth.uid()));

create trigger guide_progress_set_updated_at before update on public.guide_progress for each row execute function public.set_updated_at();

create unique index if not exists tax_rules_year_key_idx on public.tax_rules (year, key);

insert into public.tax_rules (year, key, value, description) values
  (2026, 'btw_rate_standard', 21, 'Standard btw rate in percent'),
  (2026, 'btw_rate_reduced', 9, 'Reduced btw rate in percent'),
  (2026, 'btw_rate_zero', 0, 'Zero btw rate in percent'),
  (2026, 'kor_turnover_limit', 20000, 'KOR: maximum turnover per year, excluding btw, in euro'),
  (2026, 'hours_criterion', 1225, 'Urencriterium: minimum hours per calendar year'),
  (2026, 'zelfstandigenaftrek', 1200, 'Self-employed deduction in euro'),
  (2026, 'startersaftrek', 2123, 'Starter deduction in euro, on top of the zelfstandigenaftrek; announced to end'),
  (2026, 'kvk_registration_fee', 85.15, 'One time KVK registration fee in euro'),
  (2026, 'vpb_rate_low', 19, 'Vennootschapsbelasting rate in percent up to the bracket'),
  (2026, 'vpb_rate_high', 25.8, 'Vennootschapsbelasting rate in percent above the bracket'),
  (2026, 'vpb_bracket', 200000, 'Vennootschapsbelasting bracket limit in euro'),
  (2026, 'gebruikelijk_loon', 58000, 'Minimum salary a dga pays themselves from a bv, in euro'),
  (2026, 'bewaarplicht_years', 7, 'Years to keep business records')
on conflict (year, key) do update set value = excluded.value, description = excluded.description;
