create type public.assistant_color as enum ('ink', 'pink', 'blue', 'green', 'orange', 'lilac');
create type public.assistant_shape as enum ('splat', 'bubble', 'star', 'cloud', 'flower');

alter table public.profiles
  add column assistant_name text,
  add column assistant_color public.assistant_color not null default 'ink',
  add column assistant_shape public.assistant_shape not null default 'splat',
  add column workspace_matches_assistant boolean not null default false,
  add column assistant_onboarded_at timestamptz;

alter table public.profiles
  add constraint assistant_name_length check (assistant_name is null or char_length(assistant_name) between 1 and 40);

comment on column public.profiles.assistant_name is 'Name the freelancer gave the assistant. Null means not named yet.';
comment on column public.profiles.assistant_color is 'Assistant colour chosen in onboarding or settings. ink is the original.';
comment on column public.profiles.assistant_shape is 'Assistant shape chosen in onboarding or settings. splat is the original.';
comment on column public.profiles.workspace_matches_assistant is 'When true the workspace theme uses the assistant colour.';
comment on column public.profiles.assistant_onboarded_at is 'When the assistant onboarding was finished. Null means show the onboarding.';
