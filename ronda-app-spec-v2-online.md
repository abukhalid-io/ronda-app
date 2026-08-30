# Ronda v2 — Rancangan Prompt Pengembangan (Online, Multi-Device, Reward System)

> Lanjutan dari [ronda-app-spec.md](ronda-app-spec.md) (Fase 1, sudah dibangun — lihat status di §9). Dokumen ini rancangan buat versi **online**: satu keluarga bisa pakai dari banyak HP sekaligus (sinkron), ada jadwal sekolah/kegiatan anak, sistem penugasan dari orang tua ke anak, dan reward/punishment berbasis poin biar berasa kayak game beneran. Dipakai sebagai prompt/brief buat developer atau AI coding agent (Claude Code).

---

## 1. Ringkasan Perubahan dari Fase 1

| | Fase 1 (sudah jadi) | Fase 2 — dokumen ini |
|---|---|---|
| Penyimpanan | Lokal doang (IndexedDB per HP) | **Server pusat** + cache lokal offline-first |
| Multi-device | Tidak — tiap HP data sendiri-sendiri | **Sinkron real-time** antar semua HP anggota keluarga |
| Cakupan tugas | Maintenance rumah/kendaraan/elektronik/dokumen + tugas ringan | + **Jadwal sekolah & kegiatan anak** (PR, ujian, ekskul) |
| Penugasan | Assign tugas ke anggota (label doang, gak ada alur konfirmasi) | + **Orang tua kasih tugas → anak kerjain → orang tua verifikasi** |
| Motivasi | Streak + lencana (berlaku sama rata) | + **Poin reward/punishment** — dapet poin kalau selesai (rumah *maupun* sekolah), poin berkurang kalau kelewat/gak dikerjain |
| Login | Tidak ada (1 device = 1 data) | **Akun keluarga** — kepala keluarga bikin "rumah", undang anggota lain via kode |
| Arsitektur | Client-only PWA | **Client (PWA) ↔ Server API ↔ Database**, siap discale kalau user nambah |

Semua yang udah jalan di Fase 1 (peta petualangan, 5 kategori, streak, lencana, kalender Google) **tetap dipakai**, cuma dipindah dari "hidup di satu HP" jadi "hidup di server, di-mirror ke tiap HP".

---

## 2. Struktur Data (skema baru)

```
Keluarga (tenant/household)
  - id, nama, kode_undangan, createdAt

Anggota
  - id, keluargaId, nama, avatar (emoji), peran: "orang_tua" | "anak"
  - authId (akun login — lihat §6), poin (saldo berjalan)

Perangkat (device)
  - id, anggotaId, deviceLabel ("HP Ayah", "Tablet Kayla"), pushToken, lastSeenAt
  # dipakai buat push notification & nampilin "siapa lagi yang online"

Kategori (fixed, sama kayak Fase 1)
  rumah | kendaraan | elektronik | dokumen | tugasRingan

Unit (opsional, per Fase 1 — motor, mobil, AC, kulkas, dst.)

Item/Tugas Maintenance (Fase 1, ditambah field baru)
  - id, keluargaId, kategori, unitId, nama, lastDone, interval
  - assigneeId (nullable), status: "berjalan" | "menunggu_verifikasi" | "selesai"
  - poinSelesai (default per kategori, override manual boleh)

JadwalSekolah/Kegiatan (BARU — beda dari maintenance, gak recurring interval tapi jadwal kalender)
  - id, keluargaId, anakId
  - tipe: "pelajaran" | "pr" | "ujian" | "ekskul" | "kegiatan_lain"
  - judul, deskripsi
  - waktu: { tanggal atau hari_berulang (Senin-Jumat dst.), jamMulai, jamSelesai }
  - status: "belum" | "menunggu_verifikasi" | "selesai"
  - poinSelesai

PoinLedger (riwayat transaksi poin — jangan cuma simpan saldo akhir, biar ada histori & bisa di-audit orang tua)
  - id, anggotaId, jumlah (+/-), alasan, sumber: { tipe: "tugas"|"sekolah"|"manual", refId }, waktu

Reward (katalog hadiah — opsional, didefinisikan orang tua)
  - id, keluargaId, nama ("30 menit main game", "Jajan Rp20rb"), hargaPoin, stok (opsional)

PunishmentRule (aturan potong poin otomatis — opsional, bisa off)
  - id, keluargaId, kategori/tipe target, poinDipotong, trigger: "overdue" | "gak_selesai_H-1"
```

**Kenapa pisah `PoinLedger` dari `Anggota.poin`**: saldo poin dihitung dari total ledger (atau di-cache di kolom `poin` demi performa lalu direkonsiliasi), tapi histori transaksi tetap disimpan biar orang tua bisa lihat "kenapa poin Kayla berkurang minggu ini" — jangan cuma angka mentah.

---

## 3. Fitur Reward & Punishment (biar berasa game)

- **Dapet poin**: tiap tugas/jadwal sekolah ditandai selesai *dan* (untuk anak) diverifikasi orang tua → poin masuk ke ledger, animasi +poin muncul (reuse `Celebration` yang udah ada, tambah angka poin di kartu confetti-nya).
- **Kehilangan poin**: opsional per keluarga (lewat `PunishmentRule`) — misal tugas lewat H+1 tanpa dikerjain, auto potong poin sekali (bukan berulang tiap hari, biar gak jadi hukuman berlebihan). Orang tua juga bisa potong/tambah poin manual (misal alasan di luar sistem, "bantu adik").
- **Tukar poin**: layar "Toko Reward" — anak lihat daftar reward yg didefinisikan orang tua beserta harga poin, tap "Tukar" → masuk status "menunggu approve orang tua" (jangan langsung potong tanpa sepengetahuan ortu) → orang tua approve dari HP-nya → poin kepotong, reward dicatet "sudah ditukar".
- **Verifikasi wajib buat anak**: item yang di-assign ke anggota berperan `anak` **tidak langsung** "selesai" pas ditap ✓ — statusnya jadi `menunggu_verifikasi`, notifikasi masuk ke HP orang tua, baru orang tua tap "Sah" → poin cair + status `selesai`. (Tugas milik `orang_tua` sendiri tetap langsung selesai kayak Fase 1, gak perlu verifikasi diri sendiri.)
- **Papan peringkat keluarga** (opsional, hati-hati kalau anak lebih dari satu — bisa memicu rivalitas gak sehat): tampilkan progress masing-masing anak secara netral (skor sehat + poin), bukan ranking 1/2/3 eksplisit, kecuali keluarga secara sadar mau mode kompetitif (toggle-able).

---

## 4. Sinkronisasi Online & Multi-Device

- **Offline-first**: tiap aksi (tandai selesai, tambah tugas, dst.) langsung kesimpan ke penyimpanan lokal device dulu (biar tetap responsif & bisa dipakai tanpa internet), lalu disinkron ke server di background begitu ada koneksi.
- **Real-time**: begitu satu device update data, device lain di keluarga yang sama otomatis dapet update dalam hitungan detik (subscription/websocket), tanpa perlu refresh manual — ini yang bikin "keluarga langsung tau kalau ada yang selesai tugas."
- **Resolusi konflik**: karena kemungkinan kecil (satu tugas biasanya di-edit satu orang), pakai strategi simpel **last-write-wins** berdasar timestamp server, cukup buat skala keluarga.
- **Push notification**: H-3/H-1/hari-H buat maintenance (sesuai Fase 1), plus notifikasi baru — "Ada tugas baru dari Ayah", "Kayla nunggu verifikasi tugas", "Reward ditukar, tinggal approve".

---

## 5. Arsitektur & Tech Stack (Rekomendasi)

**Rekomendasi utama — Supabase** (Postgres + Auth + Realtime + Row Level Security):
- **Kenapa**: satu paket dapet database relasional yang beneran bisa discale (bukan SQLite/file lokal), auth siap pakai (email/OTP/Google), realtime subscription buat sinkron multi-device tanpa nulis WebSocket server sendiri, dan **Row Level Security** pas banget buat multi-tenant (`keluargaId` jadi boundary — tiap keluarga cuma bisa baca/tulis data mereka sendiri, aturan ini didefinisikan sekali di level database, bukan dicek manual di tiap endpoint).
- **Kalau user makin banyak**: Supabase (dasarnya Postgres terkelola) tinggal naik tier/scale vertikal, plus connection pooling built-in (PgBouncer) — jadi gak perlu re-arsitektur dari nol pas keluarga lain mulai ikut pakai.
- **Biaya**: free tier cukup buat 1 keluarga bahkan puluhan keluarga skala kecil; baru bayar kalau traffic/storage beneran gede.

**Alternatif self-hosted (kalau gak mau dependency cloud pihak ketiga)**: PocketBase (satu binary Go, embedded SQLite, ada realtime & auth & admin UI bawaan) — cocok kalau cuma buat 1-beberapa keluarga sendiri jalan di Raspberry Pi/VPS kecil (sesuai ide awal di spec Fase 1), **tapi** SQLite mulai jadi bottleneck kalau target-nya beneran banyak keluarga/tenant sekaligus dengan tulis-baca bersamaan. Kalau masih ragu skalanya bakal sebesar apa, mulai dari sini lebih murah, migrasi ke Supabase/Postgres kalau kepake nyata.

**Client**:
- Tetap React + Vite PWA (kode Fase 1 dipertahankan), tambah layer sync (Supabase client SDK / PocketBase SDK) yang menjembatani IndexedDB lokal ↔ server.
- Push notification: Web Push API (sudah disiapkan servicenya di Fase 1) + tabel `Perangkat` buat nyimpen token per device.

**Auth & onboarding**:
- Kepala keluarga daftar (email atau nomor HP) → bikin "Keluarga" → dapet kode undangan (6 digit atau link) → anggota lain (pasangan/anak) join pakai kode itu di device masing-masing.
- Akun anak: opsi ringan — PIN 4 digit per anak (gak perlu email sendiri), cukup buat identifikasi "siapa yang lagi pegang HP ini", bukan security tinggi (anak-anak, bukan data sensitif).

---

## 6. Layar & Alur Baru (tambahan dari Fase 1 §5)

1. **Onboarding** — Buat Keluarga / Gabung pakai Kode
2. **Verifikasi Orang Tua** — daftar tugas anak yang nunggu di-"Sah"-kan, tap buat approve + poin cair
3. **Jadwal Sekolah/Kegiatan** (per anak) — tampilan mingguan (Senin-Minggu), tambah PR/ujian/ekskul, tandai selesai (masuk alur verifikasi kalau perlu)
4. **Toko Reward** — daftar reward, saldo poin anak, tombol tukar → masuk antrian approve
5. **Riwayat Poin** — ledger transaksi (+/-), biar transparan buat anak & orang tua
6. **Kelola Keluarga** (upgrade dari `MembersScreen` Fase 1) — invite anggota baru, atur peran, atur `PunishmentRule`

---

## 7. Fase Pembangunan

**Fase 1 — ✅ Selesai** (offline, single-device, lihat ronda-app-spec.md)

**Fase 2 — Online & Multi-Device** (fokus dokumen ini, bagian pondasi)
- Setup Supabase/PocketBase, skema tabel di atas, auth + onboarding keluarga
- Migrasi client dari "IndexedDB-only" ke "IndexedDB cache + sync ke server"
- Realtime sync antar device dalam satu keluarga

**Fase 3 — Sekolah, Penugasan & Reward**
- Jadwal sekolah/kegiatan anak (CRUD + tampilan mingguan)
- Alur assign → kerjain → verifikasi orang tua
- Sistem poin: ledger, toko reward, aturan punishment (opsional/toggle)

**Fase 4 — Polish & Skala**
- Push notification lengkap (H-3/H-1/hari-H + notif sosial: tugas baru, verifikasi, reward)
- Monitoring dasar (berapa keluarga aktif, error rate) kalau mulai dipakai lebih dari 1 keluarga
- Audit privasi: data anak (nama, jadwal sekolah) sensitif — pastikan cuma keluarga sendiri yang bisa akses (ditegakkan RLS di §5), gak ada data lintas-keluarga bocor

---

## 8. Catatan untuk Developer/AI Agent

- **Jangan bongkar Fase 1 dari nol** — komponen UI (`MapScreen`, `ItemList`, `AddItemForm`, `Celebration`, dst.) tetap dipakai, cuma sumber datanya yang pindah dari `db.js` (IndexedDB langsung) jadi lewat sync layer.
- Prioritaskan **Fase 2 (fondasi online) dulu** sebelum reward/sekolah — percuma bikin sistem poin kalau datanya belum bisa sinkron antar HP.
- Verifikasi orang tua itu **wajib**, bukan opsional — ini yang bikin sistem poin gak gampang dicurangi anak sendiri.
- Punishment (potong poin) defaultnya **off**, orang tua yang aktifin sendiri per keluarga — jangan asumsikan semua keluarga mau mode "hukuman", sensitif secara parenting.
- Bahasa UI tetap Bahasa Indonesia, nada santai (ikutin gaya Fase 1), termasuk buat layar-layar baru di atas.
- Skema RLS Supabase (atau aturan koleksi PocketBase) itu **satu-satunya** garda keamanan multi-tenant — test eksplisit "keluarga A gak bisa lihat data keluarga B" sebelum ini dianggap production-ready.
