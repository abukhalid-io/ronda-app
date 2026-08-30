import { todayISO, statusOf, daysUntilItem } from "./status";

// Streak dicek sekali per hari saat app dibuka: kalau hari ini tidak ada item
// overdue, streak nambah 1. Kalau ada yang overdue, streak reset ke 0.
// Ini bukan pelacakan historis penuh (butuh log harian) — cukup untuk MVP,
// sesuai catatan spec "jangan over-engineer gamifikasi di awal".
export function checkStreak(stats, items) {
  const today = todayISO();
  if (stats.lastStreakCheckDate === today) return stats;

  const anyOverdue = items.some((it) => statusOf(daysUntilItem(it)) === "overdue");
  const isConsecutiveDay = isYesterday(stats.lastStreakCheckDate, today);

  let streakCount;
  if (anyOverdue) streakCount = 0;
  else if (isConsecutiveDay || !stats.lastStreakCheckDate) streakCount = stats.streakCount + 1;
  else streakCount = 1; // ada jeda hari tanpa buka app — mulai lagi dari hari ini

  return {
    ...stats,
    streakCount,
    bestStreak: Math.max(stats.bestStreak || 0, streakCount),
    lastStreakCheckDate: today,
  };
}

function isYesterday(dateISO, todayISOStr) {
  if (!dateISO) return false;
  const d = new Date(dateISO);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10) === todayISOStr;
}

export function earnedBadges(stats, badges) {
  return badges.filter((b) => {
    const value = b.type === "streak" ? stats.bestStreak || 0 : stats.totalCompletions || 0;
    return value >= b.threshold;
  });
}
