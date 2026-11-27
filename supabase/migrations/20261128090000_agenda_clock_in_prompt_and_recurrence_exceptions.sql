alter table public.agenda_items
  add column clock_in_prompt boolean not null default false,
  add column recurrence_exceptions date[] not null default '{}';

comment on column public.agenda_items.clock_in_prompt is 'Ask the user to clock in when this work block starts.';
comment on column public.agenda_items.recurrence_exceptions is 'Dates of a repeating item that were removed or changed one by one.';
