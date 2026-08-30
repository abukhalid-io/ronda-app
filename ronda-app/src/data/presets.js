// Preset diambil dari rancangan (ronda-app-spec.md §4). value dalam satuan terkecil praktis.

export const CATEGORY_META = {
  rumah: { label: "Rumah", emoji: "🏠", needsUnit: false },
  kendaraan: { label: "Kendaraan", emoji: "🚗", needsUnit: true },
  elektronik: { label: "Elektronik", emoji: "🔌", needsUnit: true },
  dokumen: { label: "Dokumen", emoji: "📄", needsUnit: false },
  tugasRingan: { label: "Tugas Ringan", emoji: "🧸", needsUnit: false },
};

export const CATEGORY_ORDER = ["rumah", "kendaraan", "elektronik", "dokumen", "tugasRingan"];

export const PRESETS = {
  rumah: [
    { name: "Servis AC (cuci coil, cek freon)", interval: { value: 3, unit: "bulan" } },
    { name: "Cek & bersihkan talang air/atap", interval: { value: 6, unit: "bulan" } },
    { name: "Semprot anti rayap/hama", interval: { value: 12, unit: "bulan" } },
    { name: "Ganti galon/cartridge filter air", interval: { value: 3, unit: "bulan" } },
    { name: "Cek genteng/atap bocor", interval: { value: 6, unit: "bulan" } },
    { name: "Bersihkan tandon/toren air", interval: { value: 6, unit: "bulan" } },
    { name: "Cek & servis pompa air", interval: { value: 12, unit: "bulan" } },
    { name: "Cat ulang dinding luar", interval: { value: 3, unit: "tahun" } },
    { name: "Cek instalasi listrik (MCB, kabel, stop kontak)", interval: { value: 1, unit: "tahun" } },
    { name: "Servis water heater", interval: { value: 12, unit: "bulan" } },
    { name: "Cek septic tank", interval: { value: 3, unit: "tahun" } },
    { name: "Bersihkan/servis kulkas (kondensor, seal pintu)", interval: { value: 6, unit: "bulan" } },
    { name: "Pajak PBB rumah/tanah", interval: { value: 1, unit: "tahun" } },
    { name: "Asuransi rumah/properti", interval: { value: 1, unit: "tahun" } },
  ],
  kendaraan: [
    { name: "Ganti oli mesin", interval: { value: 3, unit: "bulan" } },
    { name: "Servis rutin/berkala", interval: { value: 6, unit: "bulan" } },
    { name: "Ganti aki", interval: { value: 2, unit: "tahun" } },
    { name: "Cek & rotasi tekanan ban", interval: { value: 1, unit: "bulan" } },
    { name: "Cuci radiator/ganti coolant", interval: { value: 1, unit: "tahun" } },
    { name: "Servis AC kendaraan", interval: { value: 12, unit: "bulan" } },
    { name: "Ganti wiper", interval: { value: 12, unit: "bulan" } },
    { name: "Pajak STNK (tahunan)", interval: { value: 1, unit: "tahun" } },
    { name: "Ganti STNK (5 tahunan + plat)", interval: { value: 5, unit: "tahun" } },
    { name: "Asuransi kendaraan", interval: { value: 1, unit: "tahun" } },
  ],
  elektronik: [
    { name: "Bersihkan filter AC indoor", interval: { value: 1, unit: "bulan" } },
    { name: "Ganti baterai smoke detector", interval: { value: 12, unit: "bulan" } },
    { name: "Cek kabel & stop kontak", interval: { value: 1, unit: "tahun" } },
    { name: "Kalibrasi ulang UPS/genset kecil", interval: { value: 12, unit: "bulan" } },
  ],
  dokumen: [
    { name: "Perpanjang SIM", interval: { value: 5, unit: "tahun" } },
    { name: "Perpanjang paspor", interval: { value: 5, unit: "tahun" } },
    { name: "Ganti kartu ATM/debit", interval: { value: 5, unit: "tahun" } },
    { name: "Ganti kartu kredit", interval: { value: 4, unit: "tahun" } },
    { name: "Cek status BPJS Kesehatan/Ketenagakerjaan", interval: { value: 12, unit: "bulan" } },
    { name: "Perpanjang asuransi jiwa/kesehatan pribadi", interval: { value: 1, unit: "tahun" } },
  ],
  tugasRingan: [
    { name: "Siram tanaman", interval: { value: 1, unit: "hari" } },
    { name: "Kasih makan kucing/peliharaan", interval: { value: 1, unit: "hari" } },
    { name: "Beresin mainan", interval: { value: 1, unit: "hari" } },
    { name: "Rapikan tempat tidur", interval: { value: 1, unit: "hari" } },
    { name: "Buang sampah kamar", interval: { value: 3, unit: "hari" } },
    { name: "Bersihkan kandang/akuarium peliharaan", interval: { value: 7, unit: "hari" } },
  ],
};
