/*
SQL Schema — run this in Supabase SQL editor:

create table proposals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  client_id uuid references clients(id),
  client_name text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  viewed_at timestamptz,
  accepted_at timestamptz
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamptz default now()
);

create table briefs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  client_name text,
  project_title text,
  raw_text text not null,
  extracted jsonb,
  created_at timestamptz default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  proposal_id uuid references proposals(id),
  client_id uuid references clients(id),
  client_name text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  paid_at timestamptz
);
*/

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function supabaseAdmin() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
