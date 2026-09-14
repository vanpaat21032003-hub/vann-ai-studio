create table public.generated_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  storage_path text not null,
  prompt_snapshot text not null,
  aspect_ratio text not null,
  source_type text not null default 'external_upload',
  provider text,
  created_at timestamptz not null default now(),

  constraint generated_images_project_id_fkey
    foreign key (project_id) references public.projects (id) on delete restrict,
  constraint generated_images_storage_path_key unique (storage_path),
  constraint generated_images_storage_path_nonempty_check
    check (char_length(btrim(storage_path)) > 0),
  constraint generated_images_storage_path_format_check
    check (
      storage_path ~ (
        '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
        || project_id::text
        || '/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.](jpg|png|webp)$'
      )
    ),
  constraint generated_images_prompt_snapshot_check
    check (
      char_length(prompt_snapshot) between 1 and 20000
      and prompt_snapshot ~ '[^[:space:]]'
    ),
  constraint generated_images_aspect_ratio_check
    check (aspect_ratio in ('9:16', '1:1', '4:5')),
  constraint generated_images_source_type_check
    check (source_type = 'external_upload'),
  constraint generated_images_provider_check
    check (
      provider is null
      or (
        char_length(provider) between 1 and 120
        and provider = btrim(provider)
        and provider ~ '[^[:space:]]'
      )
    )
);

create index generated_images_project_gallery_idx
  on public.generated_images (project_id, created_at desc, id desc);

alter table public.generated_images enable row level security;

revoke all privileges on table public.generated_images
  from public, anon, authenticated;

grant select on table public.generated_images to authenticated;
grant insert (
  project_id, storage_path, prompt_snapshot, aspect_ratio, source_type, provider
) on public.generated_images to authenticated;

create policy generated_images_select_own_project
  on public.generated_images for select to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = generated_images.project_id
        and p.owner_id = (select auth.uid())
    )
  );

create policy generated_images_insert_own_project
  on public.generated_images for insert to authenticated
  with check (
    split_part(storage_path, '/', 1) = (select auth.uid())::text
    and exists (
      select 1 from public.projects p
      where p.id = generated_images.project_id
        and p.owner_id = (select auth.uid())
    )
  );
