
drop table public.products;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  gender text,
  brand text,
  color text,
  material text,
  status text not null default 'draft',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_status_check
    check (status in ('draft', 'analyzed', 'archived'))
);

create index products_status_idx on public.products (status);
create index products_created_at_idx on public.products (created_at);

create table public.models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gender text,
  body_type text,
  height numeric(5,2),
  style text,
  pose text,
  thumbnail_url text,
  reference_url text,
  tags text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

create table public.styles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lighting text,
  camera text,
  background text,
  mood text,
  created_at timestamptz not null default now()
);

create table public.prompt_presets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  prompt text not null,
  created_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null,
  image_url text not null,
  image_type text not null default 'source',
  created_at timestamptz not null default now(),
  constraint product_images_product_id_fkey
    foreign key (product_id)
    references public.products (id)
    on delete cascade
);

create index product_images_product_id_idx
  on public.product_images (product_id);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  product_id uuid not null,
  model_id uuid,
  style_id uuid,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check
    check (status in ('draft', 'processing', 'completed', 'archived')),
  constraint projects_product_id_fkey
    foreign key (product_id)
    references public.products (id)
    on delete restrict,
  constraint projects_model_id_fkey
    foreign key (model_id)
    references public.models (id)
    on delete set null,
  constraint projects_style_id_fkey
    foreign key (style_id)
    references public.styles (id)
    on delete set null
);

create index projects_product_id_idx on public.projects (product_id);
create index projects_model_id_idx on public.projects (model_id);
create index projects_style_id_idx on public.projects (style_id);
create index projects_status_idx on public.projects (status);

create table public.product_analysis (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique,
  detected_category text,
  detected_color text,
  detected_material text,
  detected_gender text,
  keywords text[] not null default '{}'::text[],
  ai_summary text,
  confidence numeric(4,3),
  analyzed_at timestamptz not null default now(),
  constraint product_analysis_product_id_fkey
    foreign key (product_id)
    references public.products (id)
    on delete restrict,
  constraint product_analysis_confidence_check
    check (confidence >= 0 and confidence <= 1)
);

create function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row
execute function public.update_updated_at_column();

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.update_updated_at_column();

alter table public.products enable row level security;
alter table public.models enable row level security;
alter table public.styles enable row level security;
alter table public.prompt_presets enable row level security;
alter table public.product_images enable row level security;
alter table public.projects enable row level security;
alter table public.product_analysis enable row level security;

insert into storage.buckets (id, name, public)
values
  ('products', 'products', false),
  ('models', 'models', false),
  ('generated-images', 'generated-images', false),
  ('generated-videos', 'generated-videos', false);
