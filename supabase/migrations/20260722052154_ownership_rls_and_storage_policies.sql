
alter table public.products
  add column owner_id uuid not null,
  add constraint products_owner_id_fkey
    foreign key (owner_id) references auth.users(id) on delete restrict;

alter table public.models
  add column owner_id uuid not null,
  add constraint models_owner_id_fkey
    foreign key (owner_id) references auth.users(id) on delete restrict;

alter table public.styles
  add column owner_id uuid not null,
  add constraint styles_owner_id_fkey
    foreign key (owner_id) references auth.users(id) on delete restrict;

alter table public.prompt_presets
  add column owner_id uuid not null,
  add constraint prompt_presets_owner_id_fkey
    foreign key (owner_id) references auth.users(id) on delete restrict;

alter table public.projects
  add column owner_id uuid not null,
  add constraint projects_owner_id_fkey
    foreign key (owner_id) references auth.users(id) on delete restrict;

create index products_owner_id_idx on public.products(owner_id);
create index models_owner_id_idx on public.models(owner_id);
create index styles_owner_id_idx on public.styles(owner_id);
create index prompt_presets_owner_id_idx on public.prompt_presets(owner_id);
create index projects_owner_id_idx on public.projects(owner_id);

revoke all privileges on table
  public.products,
  public.models,
  public.styles,
  public.prompt_presets,
  public.projects,
  public.product_images,
  public.product_analysis
from anon, authenticated;

revoke usage on schema public from anon;
grant usage on schema public to authenticated;

grant select, insert, update, delete on table
  public.products,
  public.models,
  public.styles,
  public.prompt_presets,
  public.projects,
  public.product_images,
  public.product_analysis
to authenticated;

alter table public.products enable row level security;
alter table public.models enable row level security;
alter table public.styles enable row level security;
alter table public.prompt_presets enable row level security;
alter table public.projects enable row level security;
alter table public.product_images enable row level security;
alter table public.product_analysis enable row level security;

create policy products_select_own
on public.products
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy products_insert_own
on public.products
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy products_update_own
on public.products
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy products_delete_own
on public.products
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create policy models_select_own
on public.models
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy models_insert_own
on public.models
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy models_update_own
on public.models
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy models_delete_own
on public.models
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create policy styles_select_own
on public.styles
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy styles_insert_own
on public.styles
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy styles_update_own
on public.styles
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy styles_delete_own
on public.styles
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create policy prompt_presets_select_own
on public.prompt_presets
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy prompt_presets_insert_own
on public.prompt_presets
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy prompt_presets_update_own
on public.prompt_presets
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy prompt_presets_delete_own
on public.prompt_presets
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create policy projects_select_own
on public.projects
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy projects_insert_own
on public.projects
for insert
to authenticated
with check (
  (select auth.uid()) = owner_id
  and exists (
    select 1
    from public.products p
    where p.id = projects.product_id
      and p.owner_id = (select auth.uid())
  )
  and (
    projects.model_id is null
    or exists (
      select 1
      from public.models m
      where m.id = projects.model_id
        and m.owner_id = (select auth.uid())
    )
  )
  and (
    projects.style_id is null
    or exists (
      select 1
      from public.styles s
      where s.id = projects.style_id
        and s.owner_id = (select auth.uid())
    )
  )
);

create policy projects_update_own
on public.projects
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check (
  (select auth.uid()) = owner_id
  and exists (
    select 1
    from public.products p
    where p.id = projects.product_id
      and p.owner_id = (select auth.uid())
  )
  and (
    projects.model_id is null
    or exists (
      select 1
      from public.models m
      where m.id = projects.model_id
        and m.owner_id = (select auth.uid())
    )
  )
  and (
    projects.style_id is null
    or exists (
      select 1
      from public.styles s
      where s.id = projects.style_id
        and s.owner_id = (select auth.uid())
    )
  )
);

create policy projects_delete_own
on public.projects
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create policy product_images_select_own
on public.product_images
for select
to authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_images.product_id
      and p.owner_id = (select auth.uid())
  )
);

create policy product_images_insert_own
on public.product_images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.products p
    where p.id = product_images.product_id
      and p.owner_id = (select auth.uid())
  )
);

create policy product_images_update_own
on public.product_images
for update
to authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_images.product_id
      and p.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.products p
    where p.id = product_images.product_id
      and p.owner_id = (select auth.uid())
  )
);

create policy product_images_delete_own
on public.product_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_images.product_id
      and p.owner_id = (select auth.uid())
  )
);

create policy product_analysis_select_own
on public.product_analysis
for select
to authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_analysis.product_id
      and p.owner_id = (select auth.uid())
  )
);

create policy product_analysis_insert_own
on public.product_analysis
for insert
to authenticated
with check (
  exists (
    select 1
    from public.products p
    where p.id = product_analysis.product_id
      and p.owner_id = (select auth.uid())
  )
);

create policy product_analysis_update_own
on public.product_analysis
for update
to authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_analysis.product_id
      and p.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.products p
    where p.id = product_analysis.product_id
      and p.owner_id = (select auth.uid())
  )
);

create policy product_analysis_delete_own
on public.product_analysis
for delete
to authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_analysis.product_id
      and p.owner_id = (select auth.uid())
  )
);

create policy storage_select_own_objects
on storage.objects
for select
to authenticated
using (
  bucket_id in ('products', 'models', 'generated-images', 'generated-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy storage_insert_own_objects
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('products', 'models', 'generated-images', 'generated-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy storage_update_own_objects
on storage.objects
for update
to authenticated
using (
  bucket_id in ('products', 'models', 'generated-images', 'generated-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id in ('products', 'models', 'generated-images', 'generated-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy storage_delete_own_objects
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('products', 'models', 'generated-images', 'generated-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
