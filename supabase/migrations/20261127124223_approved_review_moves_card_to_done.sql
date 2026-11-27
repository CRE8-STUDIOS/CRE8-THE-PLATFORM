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
  if p_approve then
    update public.agenda_items
       set client_review_status = 'approved', client_feedback = null, reviewed_at = now(), board_status = 'done'
     where id = p_item_id;
  else
    update public.agenda_items
       set client_review_status = 'changes_requested', client_feedback = left(trim(p_feedback), 2000), reviewed_at = now()
     where id = p_item_id;
  end if;
end;
$$;
revoke all on function public.respond_to_review(uuid, boolean, text) from public, anon;
grant execute on function public.respond_to_review(uuid, boolean, text) to authenticated;
