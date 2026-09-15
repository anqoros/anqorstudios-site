-- Rental catalog: table + RLS policies + seed data
-- Run this once in Supabase's SQL Editor (project: hmsaysnufuenadohfhpl).
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT DO NOTHING throughout.

create table if not exists rental_items (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,
  name        text not null,
  day_rate_aed numeric not null,
  image_url   text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table rental_items enable row level security;

-- Public catalog page needs to read this with the anon key, same posture
-- already used for the clients/proposals/invoices tables in this project.
drop policy if exists "rental_items_public_read" on rental_items;
create policy "rental_items_public_read" on rental_items
  for select using (true);

-- Only needed so a future admin tool could edit the catalog the same way
-- admin.html already manages clients today (anon key, no extra auth layer).
drop policy if exists "rental_items_public_write" on rental_items;
create policy "rental_items_public_write" on rental_items
  for all using (true) with check (true);

-- Orders placed through /rental. Created (status: pending) BEFORE redirecting
-- to Ziina to pay, because Ziina's webhook payload carries no metadata at
-- all (see api/rental-checkout.js) -- this table is what lets a bare
-- payment_intent id in an incoming webhook be resolved back to what was
-- actually ordered and who ordered it.
create table if not exists rental_orders (
  id                  uuid primary key default gen_random_uuid(),
  ziina_payment_intent_id text,
  items               jsonb not null,
  assistance          boolean not null default false,
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text,
  total_aed           numeric not null,
  status              text not null default 'pending',
  created_at          timestamptz not null default now()
);

alter table rental_orders enable row level security;

-- The checkout/webhook functions use the anon key (same posture as every
-- other table in this project), so they need read+write here too.
drop policy if exists "rental_orders_anon_all" on rental_orders;
create policy "rental_orders_anon_all" on rental_orders
  for all using (true) with check (true);

-- Seed data: 99 items from the studio's gear rate card, one row per item.
-- image_url starts null -- filled in separately once real product photos
-- are sourced and verified.
insert into rental_items (category, name, day_rate_aed, sort_order) values
  ('CAMERA', 'Sony FX3 Full-Frame Cinema Camera (Body Only)', 350, 0),
  ('CAMERA', 'Sony A7R V Full-frame Mirrorless Camera (Body Only)', 350, 1),
  ('CAMERA', 'Sony FX30 Digial Cinema Camera (Body Only)', 300, 2),
  ('LENS', 'Sony FE 70-200mm F/2.8 GM II', 240, 3),
  ('LENS', 'Sony FE 16-35mm F/2.8 GM II', 200, 4),
  ('LENS', 'Sony FE 24-70mm F/2.8 GM II', 200, 5),
  ('LENS', 'Sony FE 50mm F/1.4 GM', 150, 6),
  ('LENS', 'Sony FE 35mm F/1.4 GM', 150, 7),
  ('LENS', 'Sony FE 24mm F/1.4 GM', 150, 8),
  ('LENS', 'Sony FE 85mm F/1.4 GM', 150, 9),
  ('LENS', 'Sony E 11mm F/1.8 APSC Prime Lens SEL11F189', 70, 10),
  ('LENS', 'Sigma E 30mm F/1.4', 35, 11),
  ('LENS', 'Sigma E 56mm F/1.4', 50, 12),
  ('VIDEO MONITORS', 'Atomos Sumo 19" SE HDR Monitor, Recorder, and Switcher', 550, 13),
  ('VIDEO MONITORS', 'Atomos Sumo Master Caddy II – 500GB SSD', 100, 14),
  ('VIDEO MONITORS', 'Atomos AtomX CAST Switcher Module for Ninja V/Ninja V+', 100, 15),
  ('VIDEO MONITORS', 'Atomos ZATO CONNECT 5.2" Network-Connected Video Monitor/ Recorder', 350, 16),
  ('VIDEO MONITORS', 'Atomos Ninja V 5" HDMI Recording Monitor + 500GB SSD', 200, 17),
  ('WIRELESS VIDEO MONITORING', 'Hollyland Mars 4K Wireless Video Transmission Systems (2)', 800, 18),
  ('WIRELESS VIDEO MONITORING', 'Tilta Nucleus-Nano II Wirelesss Lens Control System', 250, 19),
  ('LIGHTS & STROBES', 'Nanlite Forza 500B II BI-COLOR LED', 400, 20),
  ('LIGHTS & STROBES', 'Nanlite FS 300C LED', 350, 21),
  ('LIGHTS & STROBES', 'Nanlite PavoSlim 120C RGB LED Panel', 200, 22),
  ('LIGHTS & STROBES', 'Aputure Amaran P60c RGB LED Panel', 70, 23),
  ('LIGHTS & STROBES', 'Nanlite Pavotube II 30XR RGBWW LED Tube light', 130, 24),
  ('LIGHTS & STROBES', 'Nanlite Pavotube II 30C RGB LED Tube light', 100, 25),
  ('LIGHTS & STROBES', 'Nanlite Pavotube II 6C RGB LED Tube light', 30, 26),
  ('LIGHTS & STROBES', 'Godox SL60W Daylight LED Monolight', 40, 27),
  ('LIGHTS & STROBES', 'Godox AD600Pro Witstro All-in-One Outdoor Flash', 100, 28),
  ('LIGHTS & STROBES', 'Godox AD400Pro Witstro All-in-One Outdoor Flash', 80, 29),
  ('LIGHTS & STROBES', 'Godox Ving V860III TTL Li-Ion Flash Kit for Sony Cameras', 40, 30),
  ('LIGHTS & STROBES', 'Godox X3 TTL Wireless Flash touchscreen Trigger', 30, 31),
  ('LIGHTS & STROBES', 'Godox XProS TTL Wireless Flash Trigger for (Sony)', 50, 32),
  ('LIGHTS & STROBES', 'Nanlite Projection Attachment for Bowens Mount with 19°/36° Lens', 250, 33),
  ('LIGHTS & STROBES', 'Sekonic Light Meter', 35, 34),
  ('ND FILTERS', 'NiSi 82mm True Color Vario ND 1 - 9 stops', 100, 35),
  ('ND FILTERS', 'NiSi 82mm True Color Vario ND 1 - 5 stops', 80, 36),
  ('ND FILTERS', 'K&F Concept 82mm Variable ND Lens Filter ND2-ND400', 50, 37),
  ('ND FILTERS', 'K&F Concept 77mm Variable ND Filter Adjustable', 40, 38),
  ('ND FILTERS', 'K&F Concept 55MM ND Filter ND1000', 20, 39),
  ('ND FILTERS', 'K&F Concept 52MM ND Filter ND1000', 20, 40),
  ('ND FILTERS', 'Tilta Mirage VND Kit', 65, 41),
  ('MEMORY/ STORAGE', 'Lexar Professional 160GB CFexpress Type A Gold Series Memory Card', 80, 42),
  ('MEMORY/ STORAGE', 'ProGrade Digital SDXC UHS-II V90 300R Memory Card (128GB)', 60, 43),
  ('MEMORY/ STORAGE', 'SanDisk 128 GB Extreme Pro SDXC card', 30, 44),
  ('MEMORY/ STORAGE', 'SanDisk 64GB Extreme Pro SDXC card', 20, 45),
  ('MEMORY/ STORAGE', 'SanDisk 64GB Extreme Plus SDXC card', 20, 46),
  ('MEMORY/ STORAGE', 'SanDisk 16GB Ultra SDHC card', 15, 47),
  ('MEMORY/ STORAGE', 'CF Express A Card Reader', 20, 48),
  ('MEMORY/ STORAGE', 'Lexar CFexpress Type A/SD Card Reader', 20, 49),
  ('AUDIO & RECORDER', 'Zoom F8n Pro Multitrack Field Recorder', 250, 50),
  ('AUDIO & RECORDER', 'Zoom H6 Audio Recorder', 100, 51),
  ('AUDIO & RECORDER', 'Rode NTG4+ Supercardioid Condenser Shotgun Mic', 50, 52),
  ('AUDIO & RECORDER', 'Shure SM7B Dynamic Microphone', 70, 53),
  ('AUDIO & RECORDER', 'Sennheiser EW-G4 Wireless Lavalier Microphone', 120, 54),
  ('AUDIO & RECORDER', 'Hollyland LARK MAX 2', 100, 55),
  ('AUDIO & RECORDER', 'Focusrite scarlett 2i2', 50, 56),
  ('AUDIO & RECORDER', 'Deity Microphones TC-1 Wireless Timecode Generator Box 2Pack Kit', 200, 57),
  ('AUDIO & RECORDER', 'UltraStudio Recorder 3G', 50, 58),
  ('AUDIO & RECORDER', 'Alctron MA-2 Mic Preamplifer', 30, 59),
  ('AUDIO & RECORDER', 'Hollyland Solidcom C1-4S Wireless Intercom System with 4 Headsets', 250, 60),
  ('AUDIO & RECORDER', 'Neewer Boompole for Rode NTG1, NTG2 and Video Mic (10.6'')', 25, 61),
  ('AUDIO & RECORDER', 'XLR Cables (Male to Female)', 10, 62),
  ('AUDIO & RECORDER', 'Mini XLR (TA3) M-to-F)', 50, 63),
  ('AUDIO & RECORDER', 'Studio Boom/Arm', 50, 64),
  ('BATTERY & CHARGERS', 'Sony NP-FZ100 Battery', 10, 65),
  ('BATTERY & CHARGERS', 'Neewer NW-F970 Battery', 35, 66),
  ('BATTERY & CHARGERS', 'Comer D&O Lighting 95Wh V-Mount Battery (BP-C95A/S) E', 60, 67),
  ('BATTERY & CHARGERS', 'Sony NP-FZ100 Battery Charger', 10, 68),
  ('BATTERY & CHARGERS', 'Neewer NP-F970 Dual Battery Charger', 20, 69),
  ('BATTERY & CHARGERS', 'Engon NP-FZ100 Dual Battery Charger', 20, 70),
  ('STABILIZERS', 'Easyrig Minimax Stabil Light Gimbal/Camera Support', 350, 71),
  ('STABILIZERS', 'DJI RS 3 Pro Gimbal Stabilizer', 160, 72),
  ('STABILIZERS', 'FeiyuTech Scorp C', 100, 73),
  ('STABILIZERS', 'Tilta Cage for FX 3/30', 50, 74),
  ('STABILIZERS', 'Tilta Advanced Ring Grip for DJI Ronin RS 3 Pro/RS 2', 130, 75),
  ('TELEPROMPTER', 'NEEWER Teleprompter X14 with RT-110 Remote', 100, 76),
  ('TRIPODS', 'SmallRig Heavy-Duty Fluid Head tripod AD-01', 40, 77),
  ('TRIPODS', 'Neewer 72.4-Inch Aluminum Camera Tripod Monopod', 60, 78),
  ('SOFTBOXES/REFLECTORS', 'Aputure Light Dome III', 40, 79),
  ('SOFTBOXES/REFLECTORS', 'Selens 51 Inch/130cm Umbrella Diffuser Lighting Umbrella', 50, 80),
  ('SOFTBOXES/REFLECTORS', 'Godox Parabolic Umbrella, Silver, 130 cm', 50, 81),
  ('SOFTBOXES/REFLECTORS', 'Godox P90 Parabolic Softbox 35.4"', 50, 82),
  ('SOFTBOXES/REFLECTORS', 'Phottix Raja Quickfolding Softbox 105cm', 50, 83),
  ('SOFTBOXES/REFLECTORS', 'SMALLRIG Strip Softbox RA-R30120 30 x 120cm', 30, 84),
  ('SOFTBOXES/REFLECTORS', 'eWINNER Photography Studio Reflective Lighting Umbrella', 15, 85),
  ('SOFTBOXES/REFLECTORS', '41cm/16in Video Standard Reflector Beauty Dish', 30, 86),
  ('LIGHTING SUPPORT', 'C-stand 12.5''', 35, 87),
  ('LIGHTING SUPPORT', 'C-stand 10.5''', 25, 88),
  ('LIGHTING SUPPORT', 'Boom Arm', 50, 89),
  ('LIGHTING SUPPORT', 'Regular Light stand', 10, 90),
  ('LIGHTING SUPPORT', 'Black Background', 50, 91),
  ('LIGHTING SUPPORT', 'Nanlite T12 holder for 1 tube Ball Head Yoke with Swivel Pin', 10, 92),
  ('LIGHTING SUPPORT', 'Height-Adjustable Tripod Speaker Stand', 20, 93),
  ('LIGHTING SUPPORT', 'Backdrop Stand', 60, 94),
  ('Collapsive Reflectors', 'Godox Collapsible Reflector Disc 7 in 1 150x200cm', 50, 95),
  ('Collapsive Reflectors', 'U-Shape Reflector 60x180cm', 20, 96),
  ('Collapsive Reflectors', 'Godox Collapsible Reflector Disc 5 in 1 110cm', 15, 97),
  ('FOG MACHINE', 'Anfari Z-1200II 1000W Fog Machine', 180, 98)
on conflict do nothing;
