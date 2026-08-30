# Ronda — Rancangan Prompt Pengembangan Aplikasi

> Dokumen ini adalah rancangan lengkap yang bisa dipakai sebagai prompt/brief untuk membangun aplikasi, baik oleh developer maupun AI coding agent (misal Claude Code).

---

## 1. Ringkasan Aplikasi

**Nama**: Ronda
**Tagline**: Ronda rumah, kendaraan, & elektronik kamu.
**Jenis**: Progressive Web App (PWA), installable di HP, bisa dipakai offline.
**Tujuan**: Pengingat maintenance rumah tangga (rumah, kendaraan, elektronik, dokumen) dengan pendekatan gamifikasi peta interaktif, supaya tidak terasa seperti checklist yang membosankan.

**Latar belakang konsep**: Terinspirasi dari alur kerja "ronda"/round inspection ala teknisi plant — berkeliling cek checkpoint, pastikan semua status hijau (mirip alarm state di sistem DCS/monitoring industri). Diterjemahkan ke versi rumah tangga dalam bentuk peta petualangan yang playful.

---

## 2. Gaya Visual (Design System)

**Arah visual terpilih**: Peta Petualangan (Adventure Map) — top-down map dengan zona kategori sebagai "pulau"/checkpoint yang terhubung jalur, karakter kecil menunjukkan zona paling genting.

### Palet Warna
| Peran | Warna |
|---|---|
| Langit (background atas) | `#8FD9F0` |
| Rumput/tanah (background bawah) | gradasi `#BFEAA8` → `#9ED97F` |
| Status aman | `#22C55E` (hijau) |
| Status segera (≤7 hari) | `#F59E0B` (kuning/amber) |
| Status terlambat/alarm | `#EF4444` (merah) |
| Kartu/panel | `#FFF9EE` (krem lembut) |
| Teks gelap | `#2D2A20` |
| Dark surface (form, header) | `#0F1115` / `#181B22` |

### Tipografi
- **Display/heading**: Quicksand (rounded, playful) — bold 600–700
- **Body**: Inter — 400–600
- **Data/kode/tanggal**: JetBrains Mono — untuk elemen teknis (skor, XP, tanggal singkat) kalau dibutuhkan aksen "instrumen"

### Elemen Signature
- **Node pulau bulat** per kategori (Rumah/Kendaraan/Elektronik), warna node = status terburuk dari semua unit/item di dalamnya
- **Badge angka merah** di pojok node = jumlah item butuh perhatian (overdue + segera)
- **Karakter penunjuk** (emoji/ikon kecil, bisa custom ilustrasi nanti) muncul mengambang (bob animation halus) di zona paling genting
- **Jalur putus-putus** menghubungkan pulau-pulau, kesan peta petualangan/board game
- **Ring skor sehat** (radial progress) di dashboard utama — opsional ditampilkan di atas peta atau di layar terpisah
- Semua animasi hormati `prefers-reduced-motion`

---

## 3. Struktur Data

```
Kategori (fixed 3: rumah, kendaraan, elektronik)
  └── Unit (opsional — hanya jika kategori punya >1 aset)
        └── Item/Tugas
              - id
              - nama
              - lastDone (tanggal terakhir dilakukan)
              - interval { value, unit: hari|bulan|tahun }
              - dueDate (dihitung otomatis: lastDone + interval)
              - riwayat (array tanggal-tanggal penyelesaian sebelumnya) — fase 2
```

**Aturan unit**:
- Kategori "Rumah" default tanpa unit (langsung ke item), kecuali user punya >1 properti
- Kategori "Kendaraan" dan "Elektronik" biasanya multi-unit (tiap motor/mobil/AC/kulkas = 1 unit)
- Unit punya: nama, keterangan bebas (plat nomor, merk, dll)

**Status turunan** (dihitung dari `dueDate`, bukan disimpan):
- `overdue`: dueDate < hari ini
- `soon`: 0 ≤ sisa hari ≤ 7
- `ok`: sisa hari > 7

**Skor sehat keseluruhan**: rata-rata dari semua item, dengan bobot `ok=1, soon=0.5, overdue=0`, ditampilkan sebagai persentase.

---

## 4. Daftar Preset Default (isi awal per kategori)

### Rumah
| Item | Interval |
|---|---|
| Servis AC (cuci coil, cek freon) | 3 bulan |
| Cek & bersihkan talang air/atap | 6 bulan |
| Semprot anti rayap/hama | 6–12 bulan |
| Ganti galon/cartridge filter air | 3–6 bulan |
| Cek genteng/atap bocor | 6 bulan |
| Bersihkan tandon/toren air | 6 bulan |
| Cek & servis pompa air | 6–12 bulan |
| Cat ulang dinding luar | 2–3 tahun |
| Cek instalasi listrik (MCB, kabel, stop kontak) | 1 tahun |
| Servis water heater | 6–12 bulan |
| Cek septic tank | 2–3 tahun |
| Bersihkan/servis kulkas (kondensor, seal pintu) | 6 bulan |

### Kendaraan (per unit)
| Item | Interval |
|---|---|
| Ganti oli mesin | 3.000–5.000 km / 3 bulan |
| Servis rutin/berkala | 6 bulan |
| Ganti aki | 1,5–2 tahun |
| Cek & rotasi tekanan ban | 1 bulan |
| Ganti kampas rem | sesuai kondisi |
| Ganti filter udara/oli | tiap servis besar |
| Cuci radiator/ganti coolant | 1 tahun |
| Servis AC kendaraan | 6–12 bulan |
| Ganti wiper | 6–12 bulan |
| Cek timing belt (mobil) | 40.000–60.000 km |

### Elektronik (per unit)
| Item | Interval |
|---|---|
| Bersihkan filter AC indoor | 1 bulan |
| Ganti baterai smoke detector | sesuai kondisi |
| Cek kabel & stop kontak | 1 tahun |
| Kalibrasi ulang UPS/genset kecil | 6–12 bulan |

### Dokumen (kadaluarsa — masuk kategori sesuai konteks, misal STNK di bawah unit kendaraan)
| Dokumen | Interval |
|---|---|
| Pajak STNK (tahunan) | 1 tahun |
| Ganti STNK (5 tahunan + plat) | 5 tahun |
| SIM | 5 tahun |
| Asuransi kendaraan | 1 tahun |
| Asuransi rumah/properti | 1 tahun |
| BPJS Kesehatan/Ketenagakerjaan (cek status) | berkala |
| Paspor | 5–10 tahun |
| PBB rumah/tanah | 1 tahun |

---

## 5. Layar & Alur Navigasi

1. **Peta Utama**
   - 3 node pulau kategori dengan badge alarm
   - Karakter penunjuk zona paling genting
   - Ring skor sehat (bisa di header atas peta)
   - Tap pulau → buka daftar unit (jika multi-unit) atau langsung daftar item

2. **Daftar Unit** (khusus kategori multi-unit)
   - List card unit dengan badge alarm masing-masing
   - Tombol "+ Tambah unit baru"

3. **Daftar Misi/Item** (per unit atau per kategori tanpa unit)
   - List item terurut berdasarkan urgensi
   - Tiap item: nama, status warna, sisa hari, tombol "Selesai"
   - Tombol "+ Tambah item"

4. **Form Tambah Unit**
   - Nama unit + keterangan opsional

5. **Form Tambah Item**
   - Preset cepat (chip pilihan) sesuai kategori/unit
   - Nama item, terakhir dilakukan, interval (angka + satuan)
   - Preview tanggal jatuh tempo otomatis

6. **Riwayat** (fase 2)
   - Log semua item yang pernah diselesaikan, per unit/kategori

---

## 6. Fitur & Mekanik Gamifikasi

- **Skor sehat rumah** (0–100%) — ditampilkan sebagai ring/progress
- **Badge alarm merah** di peta — jumlah item butuh perhatian per kategori
- **Karakter penunjuk zona genting** — otomatis "pindah" ke pulau dengan status terburuk
- **Streak** (fase 2/3) — berapa minggu berturut-turut tanpa item overdue
- **Reward teks saat selesai tugas** (fase 2/3) — variasi kalimat, bukan notifikasi generik

---

## 7. Tech Stack

Mengikuti pola project sebelumnya (konsisten dengan [[restroke-valve-app]]):

- **Frontend**: React + Vite, dikonfigurasi sebagai PWA (manifest + service worker, installable di HP)
- **Data lokal**: IndexedDB — supaya tetap berfungsi offline, krusial karena ini reminder rumah tangga
- **Notifikasi**: Web Push API + service worker, untuk reminder H-3/H-1/hari-H
- **Sync opsional (fase 2)**: PocketBase (self-hosted di Raspberry Pi) + Cloudflare Tunnel untuk akses dari luar — untuk dipakai bareng pasangan/keluarga di lebih dari 1 device
- **Styling**: Tailwind CSS / CSS-in-JS custom sesuai design system di atas
- **Icon**: lucide-react (ikon kategori), ilustrasi custom untuk karakter penunjuk (opsional, bisa emoji dulu di MVP)

---

## 8. Fase Pembangunan

**Fase 1 — MVP (offline, single user)**
- Peta 3 kategori + badge alarm + skor sehat
- CRUD penuh: kategori → unit → item
- Tandai selesai + auto-reschedule
- Simpan lokal (IndexedDB)

**Fase 2 — Notifikasi & sinkronisasi**
- Push notification H-3/H-1/hari-H
- Sync PocketBase untuk multi-device/keluarga
- Riwayat/log per item

**Fase 3 — Polish gamifikasi**
- Animasi transisi antar layar, ilustrasi karakter custom
- Ringkasan mingguan/bulanan otomatis
- Streak & badge pencapaian

---

## 9. Catatan untuk Developer/AI Agent

- Prioritaskan Fase 1 dulu, jangan over-engineer gamifikasi di awal.
- Semua perhitungan status (`overdue`/`soon`/`ok`) dihitung on-the-fly dari `dueDate`, jangan disimpan sebagai field statis supaya selalu akurat.
- Pastikan aksesibilitas dasar: kontras warna cukup terutama di atas gradasi langit-rumput, dan animasi bisa dimatikan (`prefers-reduced-motion`).
- Bahasa UI: Bahasa Indonesia, nada santai/personal (lihat contoh copy di sesi gamifikasi sebelumnya), bukan bahasa formal-kaku.
