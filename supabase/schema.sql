-- =====================================================
-- Aura Nuit — Schéma de base de données Supabase
-- À exécuter dans le SQL Editor de Supabase.
-- =====================================================

-- Extension utiles
create extension if not exists "pgcrypto";

-- =====================================================
-- Table : types_produits
-- =====================================================
create table if not exists public.types_produits (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  slug        text not null unique,
  ordre       integer not null default 0,
  icone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.types_produits
  add column if not exists icone text;

create index if not exists types_produits_ordre_idx on public.types_produits (ordre);

-- =====================================================
-- Table : sous_types_produits
-- =====================================================
create table if not exists public.sous_types_produits (
  id          uuid primary key default gen_random_uuid(),
  type_id     uuid not null references public.types_produits(id) on delete cascade,
  nom         text not null,
  slug        text not null,
  ordre       integer not null default 0,
  icone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (type_id, slug)
);

alter table public.sous_types_produits
  add column if not exists icone text;

create index if not exists sous_types_produits_type_id_idx on public.sous_types_produits (type_id);
create index if not exists sous_types_produits_ordre_idx on public.sous_types_produits (ordre);

-- =====================================================
-- Table : produits
-- =====================================================
create table if not exists public.produits (
  id              uuid primary key default gen_random_uuid(),
  nom             text not null,
  description     text,
  couleurs        jsonb not null default '[]'::jsonb,
  tailles         text[] not null default '{}',
  images          jsonb not null default '[]'::jsonb,
  prix_achat      numeric(10,2) not null default 0,
  prix_original   numeric(10,2) not null default 0,
  prix_vente      numeric(10,2) not null default 0,
  statut          text not null default 'en stock'
                  check (statut in ('en stock', 'en rupture')),
  sous_type_id    uuid references public.sous_types_produits(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Pour les bases déjà existantes : ajouter la colonne si elle manque.
alter table public.produits
  add column if not exists sous_type_id uuid references public.sous_types_produits(id) on delete set null;

-- Le stock est désormais stocké par couleur dans la colonne jsonb `couleurs`
-- (chaque objet { nom, hex, stock }). On retire la colonne `stock` éventuelle.
alter table public.produits drop column if exists stock;

create index if not exists produits_statut_idx on public.produits (statut);
create index if not exists produits_created_at_idx on public.produits (created_at desc);
create index if not exists produits_sous_type_id_idx on public.produits (sous_type_id);

-- =====================================================
-- Table : commandes
-- =====================================================
create table if not exists public.commandes (
  id                uuid primary key default gen_random_uuid(),
  date              timestamptz not null default now(),
  nom_client        text not null,
  adresse_client    text not null,
  telephone_client  text not null,
  articles          jsonb not null default '[]'::jsonb,
  total             numeric(10,2) not null default 0,
  statut            text not null default 'en attente'
                    check (statut in ('en attente', 'confirmé', 'livré', 'retour')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists commandes_statut_idx on public.commandes (statut);
create index if not exists commandes_date_idx on public.commandes (date desc);

-- =====================================================
-- Trigger : updated_at automatique
-- =====================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_produits_updated_at on public.produits;
create trigger touch_produits_updated_at
  before update on public.produits
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_commandes_updated_at on public.commandes;
create trigger touch_commandes_updated_at
  before update on public.commandes
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_types_produits_updated_at on public.types_produits;
create trigger touch_types_produits_updated_at
  before update on public.types_produits
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_sous_types_produits_updated_at on public.sous_types_produits;
create trigger touch_sous_types_produits_updated_at
  before update on public.sous_types_produits
  for each row execute function public.touch_updated_at();

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================
-- Stratégie : tout passe par la clé service-role côté serveur.
-- On désactive l'accès anon par défaut.
alter table public.produits enable row level security;
alter table public.commandes enable row level security;
alter table public.types_produits enable row level security;
alter table public.sous_types_produits enable row level security;

-- Lecture publique des produits "en stock" (pour la boutique côté client si besoin direct).
drop policy if exists "Produits lisibles publiquement" on public.produits;
create policy "Produits lisibles publiquement"
  on public.produits for select
  using (true);

drop policy if exists "Types lisibles publiquement" on public.types_produits;
create policy "Types lisibles publiquement"
  on public.types_produits for select
  using (true);

drop policy if exists "Sous-types lisibles publiquement" on public.sous_types_produits;
create policy "Sous-types lisibles publiquement"
  on public.sous_types_produits for select
  using (true);

-- Aucune politique INSERT/UPDATE/DELETE publique : seul service-role peut écrire.
-- Aucune politique sur commandes : tout passe par les Server Actions (service-role).
