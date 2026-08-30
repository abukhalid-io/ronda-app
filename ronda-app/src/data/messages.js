// Variasi kalimat reward — spec §6: "bukan notifikasi generik".

export const COMPLETE_MESSAGES = [
  "Mantap! Satu checkpoint aman lagi. 🎉",
  "Sip, rumah makin sehat nih!",
  "Kerja bagus! Lanjut ronda ke pos lain, yuk.",
  "Beres! Kamu penjaga rumah sejati.",
  "Nice! Zona ini aman terkendali.",
  "Keren, satu misi selesai!",
  "Top! Rumah makin nyaman ditinggali.",
  "Gaskeun terus, kamu on fire hari ini!",
];

export function randomMessage() {
  return COMPLETE_MESSAGES[Math.floor(Math.random() * COMPLETE_MESSAGES.length)];
}

export const BADGES = [
  { key: "streak-3", type: "streak", threshold: 3, emoji: "🌱", label: "Pemula Rajin", desc: "3 hari beruntun tanpa telat" },
  { key: "streak-7", type: "streak", threshold: 7, emoji: "🔥", label: "Seminggu Penuh", desc: "7 hari beruntun tanpa telat" },
  { key: "streak-14", type: "streak", threshold: 14, emoji: "⭐", label: "Dua Minggu Kompak", desc: "14 hari beruntun tanpa telat" },
  { key: "streak-30", type: "streak", threshold: 30, emoji: "🏆", label: "Sebulan Juara", desc: "30 hari beruntun tanpa telat" },
  { key: "done-10", type: "done", threshold: 10, emoji: "🥉", label: "Rajin Ronda", desc: "10 tugas selesai" },
  { key: "done-50", type: "done", threshold: 50, emoji: "🥈", label: "Penjaga Andal", desc: "50 tugas selesai" },
  { key: "done-100", type: "done", threshold: 100, emoji: "🥇", label: "Legenda Rumah", desc: "100 tugas selesai" },
];
