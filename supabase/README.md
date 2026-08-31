# Setup Supabase — Fase 2

Bagian ini **cuma bisa kamu lakuin sendiri** (aku gak bisa bikin akun pihak ketiga atas nama kamu). Ikutin langkah ini, ~5 menit:

1. Buka **[supabase.com](https://supabase.com)** → **Sign Up** (bisa pakai akun GitHub `abukhalid-io` biar cepet, atau email).
2. Setelah masuk dashboard, klik **New Project**.
   - Nama project: `ronda` (bebas)
   - Database password: bikin password kuat, **simpan** (jarang dipakai langsung, tapi kalau ilang harus reset)
   - Region: pilih yang paling deket (Singapore biasanya paling cepat buat Indonesia)
   - Tunggu ~2 menit sampai project selesai di-provision.
3. Buka **SQL Editor** (ikon di sidebar kiri) → **New query** → copy-paste seluruh isi [schema.sql](schema.sql) di folder ini → klik **Run**.
   - Kalau sukses, cek **Table Editor** — harusnya udah muncul 9 tabel (`keluarga`, `anggota`, `perangkat`, `unit`, `item`, `jadwal_sekolah`, `poin_ledger`, `reward`, `punishment_rule`).
4. Buka **Project Settings** (ikon gear) → **API**.
   - Copy **Project URL**
   - Copy **anon public** key (bukan yang `service_role` — itu rahasia, jangan disebar)
5. Kasih tau aku dua nilai itu (URL + anon key) — aku isikan ke `ronda-app/.env` dan lanjut bangun layar login/gabung keluarga & sambungin ke database beneran.

Setelah itu aku bisa lanjut: layar "Daftar/Masuk", "Bikin/Gabung Keluarga", dan migrasi data lokal ke sinkron server, sesuai [ronda-app-spec-v2-online.md](../ronda-app-spec-v2-online.md).
