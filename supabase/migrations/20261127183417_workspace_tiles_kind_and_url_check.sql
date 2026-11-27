create type public.tile_kind as enum ('app', 'link');

alter table public.dashboard_tiles
  add column kind public.tile_kind not null default 'app',
  add constraint dashboard_tiles_url_http check (url ~* '^https?://'),
  add constraint dashboard_tiles_name_length check (char_length(name) between 1 and 60);

comment on column public.dashboard_tiles.kind is 'app shows as a tile under My apps, link shows in the Important links list.';

create index if not exists dashboard_tiles_user_kind_position_idx on public.dashboard_tiles (user_id, kind, position);
