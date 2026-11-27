-- Profiles use column level update grants, so the assistant columns need their own.
grant update (assistant_name, assistant_color, assistant_shape, workspace_matches_assistant, assistant_onboarded_at)
  on public.profiles to authenticated;
