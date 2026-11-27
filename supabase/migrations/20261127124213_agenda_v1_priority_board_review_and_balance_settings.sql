create type public.task_priority as enum ('must', 'should', 'could', 'wont');
create type public.board_status as enum ('todo', 'in_progress', 'in_review', 'done');
create type public.client_review_status as enum ('waiting', 'changes_requested', 'approved');

alter table public.agenda_items
  add column priority public.task_priority,
  add column board_status public.board_status,
  add column client_review_status public.client_review_status,
  add column client_feedback text,
  add column review_sent_at timestamptz,
  add column reviewed_at timestamptz,
  add column wrap_at timestamptz;

comment on column public.agenda_items.priority is 'MoSCoW priority for tasks. Null means no priority set.';
comment on column public.agenda_items.board_status is 'Column on the project board. Null means the item is not on a board.';
comment on column public.agenda_items.client_review_status is 'Client review in the portal while the card is in review.';
comment on column public.agenda_items.wrap_at is 'Wrap time for shoots, shown on the call sheet.';

create index agenda_items_project_board_idx on public.agenda_items (project_id, board_status) where board_status is not null;

-- keep status and board in step, and start a review when a card enters in_review
create or replace function public.agenda_items_board_sync()
returns trigger
language plpgsql
set search_path to ''
as $$
begin
  if new.board_status is distinct from old.board_status then
    if new.board_status = 'done' then
      new.status := 'done';
      new.completed_at := coalesce(new.completed_at, now());
    elsif old.board_status = 'done' then
      new.status := 'open';
      new.completed_at := null;
    end if;
    if new.board_status = 'in_review' then
      new.client_review_status := 'waiting';
      new.client_feedback := null;
      new.review_sent_at := now();
      new.reviewed_at := null;
    elsif old.board_status = 'in_review' and new.board_status <> 'done' then
      new.client_review_status := null;
    end if;
  end if;
  if new.status is distinct from old.status and new.board_status is not null then
    if new.status = 'done' then new.board_status := 'done';
    elsif old.status = 'done' and new.board_status = 'done' then new.board_status := 'todo';
    end if;
  end if;
  return new;
end;
$$;

create trigger agenda_items_board_sync
before update on public.agenda_items
for each row execute function public.agenda_items_board_sync();

-- client side: read only the cards in review for their projects, limited columns
create or replace function public.portal_review_items(p_project_id uuid)
returns table (id uuid, title text, client_review_status public.client_review_status, client_feedback text, review_sent_at timestamptz, reviewed_at timestamptz)
language sql
stable
security definer
set search_path to ''
as $$
  select a.id, a.title, a.client_review_status, a.client_feedback, a.review_sent_at, a.reviewed_at
    from public.agenda_items a
   where a.project_id = p_project_id
     and a.client_review_status is not null
     and public.client_has_project(p_project_id)
   order by a.review_sent_at desc;
$$;

-- client side: approve or ask for changes
create or replace function public.respond_to_review(p_item_id uuid, p_approve boolean, p_feedback text default null)
returns void
language plpgsql
security definer
set search_path to ''
as $$
declare
  v_item public.agenda_items;
begin
  if public.my_client_account_id() is null then
    raise exception 'Only a client can review this.' using errcode = '42501';
  end if;
  select * into v_item from public.agenda_items where id = p_item_id for update;
  if v_item.id is null or not public.client_has_project(v_item.project_id) then
    raise exception 'Card not found.' using errcode = 'P0002';
  end if;
  if v_item.board_status <> 'in_review' or v_item.client_review_status <> 'waiting' then
    raise exception 'This card is not waiting for a review.' using errcode = 'P0001';
  end if;
  if not p_approve and coalesce(length(trim(p_feedback)), 0) = 0 then
    raise exception 'Please tell what should change.' using errcode = 'P0001';
  end if;
  update public.agenda_items
     set client_review_status = case when p_approve then 'approved'::public.client_review_status else 'changes_requested'::public.client_review_status end,
         client_feedback = case when p_approve then null else left(trim(p_feedback), 2000) end,
         reviewed_at = now()
   where id = p_item_id;
end;
$$;

revoke all on function public.portal_review_items(uuid) from public, anon;
revoke all on function public.respond_to_review(uuid, boolean, text) from public, anon;
grant execute on function public.portal_review_items(uuid) to authenticated;
grant execute on function public.respond_to_review(uuid, boolean, text) to authenticated;

alter table public.profiles
  add column week_target_hours integer not null default 30 check (week_target_hours between 1 and 80),
  add column break_after_minutes integer not null default 180 check (break_after_minutes between 30 and 600),
  add column break_minutes integer not null default 15 check (break_minutes between 5 and 120),
  add column day_ends_at time not null default '18:00',
  add column deadline_headsup_days integer not null default 3 check (deadline_headsup_days between 0 and 30);
