-- ============================================================
-- Taggo Reseñas Propias — Supabase setup (AppleMart)
-- Pegar TODO esto en el SQL Editor de Supabase y darle "Run".
-- Es idempotente: se puede correr más de una vez sin romper nada.
-- ============================================================

-- ---------- Tablas ----------
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  created_at timestamptz default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  product_model text,
  verified_purchase boolean default false,
  photo_urls text[] default '{}',
  approved boolean default true, -- auto-publish: no manual moderation
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_reviews_business_id on reviews(business_id);
create index if not exists idx_reviews_approved   on reviews(approved);
create index if not exists idx_reviews_created_at on reviews(created_at desc);

-- ---------- Row Level Security ----------
alter table businesses enable row level security;
alter table reviews    enable row level security;

drop policy if exists "Anyone can read businesses" on businesses;
create policy "Anyone can read businesses"
  on businesses for select using (true);

drop policy if exists "Anyone can read approved reviews" on reviews;
create policy "Anyone can read approved reviews"
  on reviews for select using (approved = true);

drop policy if exists "Anyone can create reviews" on reviews;
create policy "Anyone can create reviews"
  on reviews for insert with check (true);

-- Moderación manual desde el Dashboard de Supabase
drop policy if exists "Update reviews (admin only - manual update)" on reviews;
create policy "Update reviews (admin only - manual update)"
  on reviews for update using (true) with check (true);

-- ---------- Seed del negocio ----------
insert into businesses (slug, name, logo_url)
values ('applemart', 'AppleMart', '/logos/applemart-logo.png')
on conflict (slug) do nothing;

-- ---------- Storage: bucket de fotos ----------
-- (También podés crearlo desde Storage > New bucket, marcando "Public bucket".)
insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read review-photos" on storage.objects;
create policy "Public read review-photos"
  on storage.objects for select
  using (bucket_id = 'review-photos');

drop policy if exists "Anon upload review-photos" on storage.objects;
create policy "Anon upload review-photos"
  on storage.objects for insert
  with check (bucket_id = 'review-photos');
