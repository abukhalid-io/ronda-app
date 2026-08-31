-- Ronda — skema database Supabase (Fase 2)
-- Jalankan ini di Supabase Dashboard → SQL Editor → New query → Run.
-- Aman dijalankan berkali-kali (pakai IF NOT EXISTS / CREATE OR REPLACE) selama belum ada data penting.

-- ============================================================
-- 1. KELUARGA (tenant/household)
-- ============================================================
create table if not exists keluarga (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kode_undangan text unique not null,
  kode_undangan_expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. ANGGOTA (satu baris per orang, terikat ke satu akun Supabase Auth)
-- ============================================================
create table if not exists anggota (
  id uuid primary key default gen_random_uuid(),
  keluarga_id uuid not null references keluarga(id) on delete cascade,
  auth_id uuid unique references auth.users(id) on delete set null,
  nama text not null,
  avatar text not null default '🦁',
  peran text not null check (peran in ('orang_tua', 'anak')),
  poin integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3. PERANGKAT (device yang login, buat push notif & "lihat siapa yang connect")
-- ============================================================
create table if not exists perangkat (
  id uuid primary key default gen_random_uuid(),
  anggota_id uuid not null references anggota(id) on delete cascade,
  device_label text not null default 'Perangkat baru',
  push_token text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. UNIT (motor, mobil, AC, kulkas, dst — opsional, per kategori multi-unit)
-- ============================================================
create table if not exists unit (
  id uuid primary key default gen_random_uuid(),
  keluarga_id uuid not null references keluarga(id) on delete cascade,
  kategori text not null check (kategori in ('rumah', 'kendaraan', 'elektronik', 'dokumen', 'tugasRingan')),
  nama text not null,
  meta text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. ITEM (tugas maintenance — inti dari Fase 1, sekarang punya assignee & status verifikasi)
-- ============================================================
create table if not exists item (
  id uuid primary key default gen_random_uuid(),
  keluarga_id uuid not null references keluarga(id) on delete cascade,
  kategori text not null check (kategori in ('rumah', 'kendaraan', 'elektronik', 'dokumen', 'tugasRingan')),
  unit_id uuid references unit(id) on delete cascade,
  nama text not null,
  last_done date not null default current_date,
  interval_value integer not null,
  interval_unit text not null check (interval_unit in ('hari', 'bulan', 'tahun')),
  assignee_id uuid references anggota(id) on delete set null,
  status text not null default 'berjalan' check (status in ('berjalan', 'menunggu_verifikasi', 'selesai')),
  poin_selesai integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 6. JADWAL SEKOLAH / KEGIATAN ANAK
-- ============================================================
create table if not exists jadwal_sekolah (
  id uuid primary key default gen_random_uuid(),
  keluarga_id uuid not null references keluarga(id) on delete cascade,
  anak_id uuid not null references anggota(id) on delete cascade,
  tipe text not null check (tipe in ('pelajaran', 'pr', 'ujian', 'ekskul', 'kegiatan_lain')),
  judul text not null,
  deskripsi text,
  tanggal date,
  hari_berulang text[], -- contoh: ['senin','rabu'] buat jadwal mingguan
  jam_mulai time,
  jam_selesai time,
  status text not null default 'belum' check (status in ('belum', 'menunggu_verifikasi', 'selesai')),
  poin_selesai integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 7. POIN LEDGER (histori transaksi — jangan cuma simpan saldo akhir)
-- ============================================================
create table if not exists poin_ledger (
  id uuid primary key default gen_random_uuid(),
  anggota_id uuid not null references anggota(id) on delete cascade,
  jumlah integer not null, -- boleh negatif (punishment/tukar reward)
  alasan text not null,
  sumber_tipe text not null check (sumber_tipe in ('tugas', 'sekolah', 'manual', 'reward')),
  sumber_id uuid,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 8. REWARD (katalog hadiah, didefinisikan orang tua)
-- ============================================================
create table if not exists reward (
  id uuid primary key default gen_random_uuid(),
  keluarga_id uuid not null references keluarga(id) on delete cascade,
  nama text not null,
  harga_poin integer not null,
  stok integer, -- null = tak terbatas
  created_at timestamptz not null default now()
);

-- ============================================================
-- 9. PUNISHMENT RULE (opsional, default nonaktif per keluarga)
-- ============================================================
create table if not exists punishment_rule (
  id uuid primary key default gen_random_uuid(),
  keluarga_id uuid not null references keluarga(id) on delete cascade,
  kategori_target text not null,
  poin_dipotong integer not null,
  trigger_saat text not null check (trigger_saat in ('overdue', 'gak_selesai_h_minus_1')),
  aktif boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- HELPER FUNCTION — keluarga_id milik user yang lagi login
-- ============================================================
create or replace function keluarga_saya()
returns uuid
language sql
security definer
stable
as $$
  select keluarga_id from anggota where auth_id = auth.uid() limit 1;
$$;

-- ============================================================
-- ROW LEVEL SECURITY — satu-satunya garda multi-tenant.
-- Prinsip: tiap tabel cuma boleh diakses kalau keluarga_id-nya sama
-- dengan keluarga_id milik user yang login (lewat keluarga_saya()).
-- ============================================================
alter table keluarga enable row level security;
alter table anggota enable row level security;
alter table perangkat enable row level security;
alter table unit enable row level security;
alter table item enable row level security;
alter table jadwal_sekolah enable row level security;
alter table poin_ledger enable row level security;
alter table reward enable row level security;
alter table punishment_rule enable row level security;

-- keluarga: cuma bisa lihat/ubah keluarga sendiri
drop policy if exists "keluarga_select_own" on keluarga;
create policy "keluarga_select_own" on keluarga for select using (id = keluarga_saya());
drop policy if exists "keluarga_update_own" on keluarga;
create policy "keluarga_update_own" on keluarga for update using (id = keluarga_saya());
-- insert keluarga baru dibuka buat siapa aja yang authenticated (dipakai pas onboarding bikin keluarga baru)
drop policy if exists "keluarga_insert_authenticated" on keluarga;
create policy "keluarga_insert_authenticated" on keluarga for insert with check (auth.uid() is not null);

-- anggota: lihat semua anggota di keluarga sendiri, update/insert cuma anggota di keluarga sendiri
drop policy if exists "anggota_select_own_family" on anggota;
create policy "anggota_select_own_family" on anggota for select using (keluarga_id = keluarga_saya());
drop policy if exists "anggota_insert_own_family" on anggota;
create policy "anggota_insert_own_family" on anggota for insert with check (auth.uid() is not null);
drop policy if exists "anggota_update_own_family" on anggota;
create policy "anggota_update_own_family" on anggota for update using (keluarga_id = keluarga_saya());
drop policy if exists "anggota_delete_own_family" on anggota;
create policy "anggota_delete_own_family" on anggota for delete using (keluarga_id = keluarga_saya());

-- pola sama buat semua tabel bertipe keluarga_id
drop policy if exists "perangkat_all_own_family" on perangkat;
create policy "perangkat_all_own_family" on perangkat for all
  using (anggota_id in (select id from anggota where keluarga_id = keluarga_saya()))
  with check (anggota_id in (select id from anggota where keluarga_id = keluarga_saya()));

drop policy if exists "unit_all_own_family" on unit;
create policy "unit_all_own_family" on unit for all using (keluarga_id = keluarga_saya()) with check (keluarga_id = keluarga_saya());

drop policy if exists "item_all_own_family" on item;
create policy "item_all_own_family" on item for all using (keluarga_id = keluarga_saya()) with check (keluarga_id = keluarga_saya());

drop policy if exists "jadwal_sekolah_all_own_family" on jadwal_sekolah;
create policy "jadwal_sekolah_all_own_family" on jadwal_sekolah for all using (keluarga_id = keluarga_saya()) with check (keluarga_id = keluarga_saya());

drop policy if exists "poin_ledger_all_own_family" on poin_ledger;
create policy "poin_ledger_all_own_family" on poin_ledger for all
  using (anggota_id in (select id from anggota where keluarga_id = keluarga_saya()))
  with check (anggota_id in (select id from anggota where keluarga_id = keluarga_saya()));

drop policy if exists "reward_all_own_family" on reward;
create policy "reward_all_own_family" on reward for all using (keluarga_id = keluarga_saya()) with check (keluarga_id = keluarga_saya());

drop policy if exists "punishment_rule_all_own_family" on punishment_rule;
create policy "punishment_rule_all_own_family" on punishment_rule for all using (keluarga_id = keluarga_saya()) with check (keluarga_id = keluarga_saya());

-- ============================================================
-- REALTIME — aktifkan broadcast perubahan buat tabel yang perlu sinkron live
-- ============================================================
alter publication supabase_realtime add table item;
alter publication supabase_realtime add table jadwal_sekolah;
alter publication supabase_realtime add table anggota;
alter publication supabase_realtime add table poin_ledger;
