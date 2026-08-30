# Ronda — Rancangan Prompt Website & Server (Registrasi, Backup, Restore)

> Pelengkap dari [ronda-app-spec-v2-online.md](ronda-app-spec-v2-online.md). Dokumen v2 itu bahas *apa* yang perlu sinkron (skema data, poin, dst.); dokumen ini fokus ke **pintu masuknya** — website tempat user daftar akun, dan mekanisme server yang bikin data user aman dipindah-pindah antar HP. Dipakai sebagai prompt buat developer/AI agent yang ngerjain bagian server & website-nya.

---

## 1. Tujuan & Prinsip Dasar

- User **wajib daftar akun dulu lewat website** sebelum app di HP bisa dipakai penuh (offline-only tanpa akun boleh jadi mode "coba-coba", tapi gak sinkron).
- Begitu login (baik di website maupun di app HP), **server jadi sumber kebenaran** (source of truth) — app di HP cuma cache lokal yang sinkron ke sana.
- **Backup itu otomatis, bukan tombol manual.** Karena tiap perubahan (tandai tugas selesai, tambah item, dst.) langsung terkirim ke server saat online, gak ada momen "lupa backup" — beda dari app yang nyimpen di HP doang terus ilang kalau HP ilang/rusak/ganti.
- **Restore itu otomatis pas login.** Install app di HP baru → login pakai akun yang sama → semua data (unit, item, poin, jadwal sekolah, dst.) ke-tarik balik dari server tanpa user harus "import file" manual.

---

## 2. Alur Pengguna End-to-End

1. **Daftar** — buka website, isi email + password (atau daftar pakai Google), verifikasi email.
2. **Bikin Keluarga** — user pertama otomatis jadi "kepala keluarga", bikin nama rumah tangga, dapet **kode undangan** (6 digit, berlaku beberapa hari).
3. **Install app di HP pertama** — buka app → "Masuk" pakai akun yang barusan didaftarin di website → app narik data keluarga (kosong kalau baru) dari server.
4. **Undang anggota lain** — pasangan/anak buka app di HP masing-masing → pilih "Gabung Keluarga" → masukin kode undangan → otomatis konek ke keluarga yang sama, langsung lihat data yang sama (unit, tugas, dst.) real-time.
5. **Pemakaian harian** — semua perubahan otomatis ke-backup ke server di belakang layar, gak ada aksi tambahan dari user.
6. **Ganti/tambah HP** — install app di HP baru (atau app di-uninstall-install ulang) → login pakai akun lama → **semua data balik otomatis**, gak mulai dari nol.
7. **Lupa password / ganti device tanpa akses HP lama** — reset password lewat website (link email), tetap bisa login di app dan data aman karena nempel di akun, bukan di HP.

---

## 3. Halaman yang Dibutuhkan di Website

| Halaman | Fungsi |
|---|---|
| **Landing** | Jelasin apa itu Ronda, ajakan daftar (opsional buat versi publik nanti — kalau cuma buat 1 keluarga, bisa di-skip/simpel) |
| **Daftar (Register)** | Email + password, atau OAuth Google. Setelah submit → email verifikasi dikirim. |
| **Verifikasi Email** | Klik link dari email → akun aktif. |
| **Masuk (Login)** | Email/password atau Google. Redirect ke Dashboard setelah berhasil. |
| **Lupa Password** | Kirim link reset ke email. |
| **Dashboard Akun** | Lihat/kelola: nama keluarga, kode undangan (generate ulang kalau perlu), daftar **perangkat yang terhubung** (nama device, terakhir sinkron kapan), daftar anggota keluarga. |
| **Pengaturan Akun** | Ubah email/password, **Hapus Akun** (harus beneran hapus semua data terkait — bukan cuma nonaktifin). |
| **Unduh/Pasang App** | Instruksi cara install PWA-nya di HP (Android "Add to Home Screen", dst.) + tombol/QR buat buka app langsung. |

Dashboard akun ini juga berguna buat orang tua yang lebih nyaman ngatur hal-hal kecil (nama anggota, hapus device lama yang udah gak dipakai) lewat layar besar (laptop) daripada di HP.

---

## 4. Server — Apa yang Perlu Dibangun

- **Auth**: register, login, verifikasi email, refresh token, forgot/reset password, (opsional) login Google. **Rekomendasi: pakai Supabase Auth** (bukan bikin sistem auth sendiri) — udah handle hashing password, token, email verifikasi, rate limiting dasar. Hemat waktu dan lebih aman daripada racik sendiri.
- **Sync data**: pakai Supabase Postgres + Realtime langsung dari client (app HP & website sama-sama connect ke sini) — gak perlu bikin API custom buat tiap operasi CRUD (tambah item, tandai selesai, dst.), cukup lewat Supabase client SDK dengan Row Level Security yang udah didefinisikan per `keluargaId` (detail skema di ronda-app-spec-v2-online.md §2 & §5).
- **Backend custom (minim, cuma buat yang gak bisa langsung dari client)**:
  - Kirim email undangan/notifikasi (pakai Supabase Edge Functions atau server kecil terpisah)
  - Generate & validasi kode undangan keluarga
  - Trigger push notification (H-3/H-1/hari-H, verifikasi tugas, dst.)
  - Endpoint "Hapus Akun" yang bener-bener bersihin semua data (cascade delete keluarga kalau dia kepala keluarga terakhir, atau cuma lepas dia dari keluarga kalau masih ada anggota lain)
- **Restore saat login pertama di device baru**: begitu app HP login dan `keluargaId` kedetect ada datanya di server, jalankan **full sync sekali** (tarik semua tabel terkait keluarga itu) buat ngisi IndexedDB lokal, baru lanjut ke mode realtime-sync biasa.
- **"Backup"**: gak perlu fitur backup terpisah — karena arsitekturnya server-first (tiap tulis data langsung ke Postgres, bukan nunggu di-backup belakangan), data di server itu sendiri **sudah** backup-nya. Yang perlu disediakan cuma:
  - **Export data** (opsional, buat rasa aman user) — tombol di Dashboard buat unduh semua data keluarga sebagai JSON, di luar sistem, murni buat portability.
  - Backup database rutin di sisi infrastruktur (Postgres/Supabase udah nyediain point-in-time recovery bawaan tergantung tier — ini urusan operasional, bukan fitur yang perlu dibangun di app).

---

## 5. Keamanan & Privasi

- **Row Level Security** (Supabase) sebagai garda utama: user cuma bisa baca/tulis data `keluargaId` miliknya sendiri — ini dicek di level database, bukan cuma di UI, jadi gak bisa dilewatin walau lewat API langsung.
- **Rate limiting** di endpoint login/register (cegah brute-force password).
- **Data anak itu sensitif** (nama, jadwal sekolah) — pastikan gak ada endpoint publik yang bocorin data lintas-keluarga. Test eksplisit sebelum dianggap production-ready: coba akses data keluarga lain pakai akun yang beda, harus ditolak.
- **Hapus akun beneran hapus** — bukan cuma soft-delete/nonaktifin, sesuai ekspektasi privasi user.
- **Kode undangan** harus expire (misal 7 hari) dan cuma bisa dipakai buat gabung, bukan buat akses admin/kepala keluarga.

---

## 6. Tech Stack Rekomendasi (Website)

- **Framework**: Next.js — beda dari app HP (React + Vite PWA), karena website butuh SEO-friendly buat landing page publik dan render halaman auth yang cepat. Auth & data tetap share backend yang sama (Supabase), jadi dua frontend (website + app) connect ke satu server pusat.
- **Hosting**: Vercel (paling gampang buat Next.js) atau Netlify.
- **Auth & DB**: Supabase (konsisten dengan rekomendasi di ronda-app-spec-v2-online.md §5) — satu project Supabase dipakai bareng oleh website dan app HP.
- **Domain**: perlu domain sendiri kalau mau kelihatan profesional & buat email verifikasi/reset password gak masuk spam (pakai custom domain email lewat Supabase SMTP settings atau layanan kayak Resend).

---

## 7. Fase Pembangunan

**Fase A — Wajib, blocking buat app online bisa jalan**
- Setup Supabase project (auth + skema tabel dari v2 spec)
- Halaman: Daftar, Verifikasi Email, Login, Lupa Password
- App HP: layar "Masuk" / "Gabung Keluarga pakai kode", full-sync pas login pertama

**Fase B — Dashboard Akun**
- Kelola keluarga (nama, kode undangan, daftar anggota & device)
- Pengaturan akun (ubah password, hapus akun)

**Fase C — Nice to have**
- Landing page publik yang lebih niat (kalau rencananya dipakai lebih dari 1 keluarga)
- Export data JSON
- Instruksi install PWA yang lebih interaktif (deteksi device, kasih langkah sesuai Android/iOS)

---

## 8. Catatan untuk Developer/AI Agent

- **Jangan bikin sistem login sendiri dari nol** — pakai Supabase Auth, waktu yang dihemat dipakai buat hal yang lebih penting (sync, reward system di v2 spec).
- Urutan prioritas: **Fase A dulu** — tanpa ini, app HP di v2 spec gak ada cara buat online sama sekali.
- Test yang wajib sebelum dianggap selesai: *(a)* device baru login akun lama → semua data lama muncul, *(b)* dua device login akun sama → perubahan di satu device muncul di device lain dalam hitungan detik, *(c)* akun A gak bisa lihat data akun B sama sekali.
- Website dan app HP itu **dua frontend, satu backend** — jangan duplikasi logic auth/sync, keduanya harus konsisten karena user bisa buka salah satu atau dua-duanya.
- Bahasa UI tetap Bahasa Indonesia, nada santai, konsisten sama app HP (ikutin gaya di ronda-app-spec.md).
