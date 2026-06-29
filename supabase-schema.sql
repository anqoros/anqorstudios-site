-- ─────────────────────────────────────────────────────────────
-- ANQOR STUDIOS — SUPABASE SCHEMA
-- Run this entire file in your Supabase SQL editor
-- ─────────────────────────────────────────────────────────────

-- ── Proposals (already exists — skip if created) ──────────────
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  client_name text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  viewed_at timestamptz
);

-- ── Invoices (already exists — skip if created) ───────────────
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  proposal_id uuid references proposals(id),
  client_name text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  paid_at timestamptz
);

-- ── Clients ───────────────────────────────────────────────────
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  industry text,
  location text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Projects (job history per client) ─────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  title text not null,
  description text,
  date date,
  amount_invoiced numeric(10,2),
  amount_paid numeric(10,2),
  currency text default 'USD',
  payment_method text,
  status text default 'completed', -- completed | invoiced | unpaid | partial
  notes text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- SEED DATA — Yenaé Collection
-- ─────────────────────────────────────────────────────────────

-- Insert client
insert into clients (id, name, company, email, industry, location, notes)
values (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Fei Biratu & Seble Alemayehu',
  'Yenaé Collection (Yenae, LLC)',
  'fei@yenae.com',
  'Fashion / Jewellery',
  'USA (remote client)',
  'Contacts: Fei Biratu (fei@yenae.com), Seble Alemayehu (seble@yenae.com). Refer to Ubong as "Uby". Long-standing relationship. Pays via PayPal. Portfolio usage rights granted by client April 2025.'
);

-- Insert projects
insert into projects (client_id, title, description, date, amount_invoiced, amount_paid, currency, payment_method, status, notes)
values
(
  'a1b2c3d4-0000-0000-0000-000000000001',
  'DXB Photoshoot — September 2024',
  'Product photoshoot in Dubai for Yenaé jewellery collection.',
  '2024-09-01',
  null,
  680.00,
  'USD',
  'PayPal',
  'partial',
  'PayPal note: "DXB Photoshoot Sept 2024 Partial Payment". Full invoice amount unknown — confirm balance with client.'
),
(
  'a1b2c3d4-0000-0000-0000-000000000001',
  'December Photo Shoot — Tsirur & Dorze Collections',
  'Photo selection, retouching, image stitching, watermarking for Tsirur and Dorze jewellery collections. Two models. Composite shots included.',
  '2024-12-01',
  null,
  null,
  'USD',
  null,
  'invoiced',
  'Invoice amount unknown. Shoot Dec 2024, editing Jan 2025. Client: Fei Biratu.'
),
(
  'a1b2c3d4-0000-0000-0000-000000000001',
  'ET Airlines In-flight Promotional Video',
  'Video editing for Ethiopian Airlines in-flight promotional video. Coordinated with Welpix (Martin & Denis) for 4K CGI animation. Multiple revision rounds. Delivered Feb 2025.',
  '2025-01-21',
  null,
  null,
  'USD',
  null,
  'invoiced',
  'Invoice sent Feb 12, 2026 alongside Demo video invoice. Amount unknown — fill in when confirmed.'
),
(
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Buna Collection — Video + Reels (2024)',
  'Video production and social media reels for Yenaé Buna Collection. CGI assets provided by client. Video review call Feb 7, 2026.',
  '2026-02-01',
  717.00,
  717.00,
  'USD',
  'PayPal',
  'completed',
  'PayPal note: "2024 Video + Reels Buna Collection". Paid Feb 19, 2026.'
),
(
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Demo Video + Ethiopian Airlines Promos',
  'Demo video and promotional cuts for Ethiopian Airlines campaign.',
  '2026-02-12',
  null,
  null,
  'USD',
  null,
  'invoiced',
  'Invoice sent Feb 12, 2026. Amount unknown — fill in when confirmed.'
);

-- ─────────────────────────────────────────────────────────────
-- HELPFUL VIEWS
-- ─────────────────────────────────────────────────────────────

-- Client summary: total invoiced, total paid, outstanding
create or replace view client_summary as
select
  c.id,
  c.name,
  c.company,
  c.email,
  count(p.id) as total_jobs,
  sum(p.amount_invoiced) as total_invoiced,
  sum(p.amount_paid) as total_paid,
  sum(coalesce(p.amount_invoiced, 0) - coalesce(p.amount_paid, 0)) as outstanding,
  max(p.date) as last_job_date
from clients c
left join projects p on p.client_id = c.id
group by c.id, c.name, c.company, c.email;
