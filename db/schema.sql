-- Schéma de la base des prospects Géomètre Topo (PostgreSQL 14+ / Supabase / Neon).
-- Idempotent : peut être rejoué sans perte de données (npm run db:migrate).

create extension if not exists pgcrypto;

create table if not exists leads (
  id                 uuid primary key default gen_random_uuid(),
  reference          text not null unique,
  full_name          text not null,
  phone              text not null,
  email              text not null,
  preferred_contact  text not null check (preferred_contact in ('whatsapp', 'telephone', 'email')),
  service            text not null,
  locality           text not null,
  neighborhood       text,
  area               text,
  situation          text,
  description        text,
  timeline           text,
  has_documents      text,
  source             text not null default 'formulaire_devis',
  source_page        text,
  referrer           text,
  utm_source         text,
  utm_medium         text,
  utm_campaign       text,
  status             text not null default 'nouveau' check (status in (
                       'nouveau', 'a_contacter', 'contact_etabli', 'besoin_a_preciser', 'devis_a_preparer',
                       'devis_transmis', 'en_attente', 'confirme', 'non_converti', 'archive')),
  consent_processing boolean not null,
  consent_marketing  boolean not null default false,
  consent_at         timestamptz not null default now(),
  -- Empreinte (hachage salé) de l'adresse IP, uniquement pour limiter les abus. Jamais l'IP en clair.
  ip_hash            text,
  notification_status text not null default 'pending' check (notification_status in ('pending', 'sent', 'failed', 'disabled')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  anonymized_at      timestamptz
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_ip_hash_created_idx on leads (ip_hash, created_at);

-- Historique des actions commerciales : création, changements de statut, notes, notifications…
create table if not exists lead_events (
  id         bigserial primary key,
  lead_id    uuid not null references leads (id) on delete cascade,
  type       text not null check (type in ('created', 'status', 'note', 'notification', 'anonymized')),
  content    text,
  actor      text,
  created_at timestamptz not null default now()
);
create index if not exists lead_events_lead_idx on lead_events (lead_id, created_at desc);

-- Tentatives de connexion à l'administration (limitation des essais).
create table if not exists login_attempts (
  id         bigserial primary key,
  ip_hash    text not null,
  success    boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_ip_idx on login_attempts (ip_hash, created_at);

-- Abonnés aux conseils et actualités (inscription par Google ou par e-mail, avec consentement).
create table if not exists subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  name              text,
  source            text not null check (source in ('google', 'email')),
  consent_at        timestamptz not null default now(),
  unsubscribe_token text not null unique,
  unsubscribed_at   timestamptz,
  ip_hash           text,
  created_at        timestamptz not null default now()
);
create index if not exists subscribers_ip_created_idx on subscribers (ip_hash, created_at);

-- Sur Supabase, l'API publique (PostgREST) ne doit jamais exposer ces tables :
-- RLS activé sans aucune politique = aucun accès via les clés anon/authenticated.
-- Le site se connecte avec la chaîne de connexion serveur, qui n'est pas soumise au RLS.
alter table leads enable row level security;
alter table lead_events enable row level security;
alter table login_attempts enable row level security;
alter table subscribers enable row level security;
