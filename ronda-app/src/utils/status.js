// Semua status dihitung on-the-fly dari dueDate — tidak pernah disimpan sebagai field statis.

export function addInterval(date, interval) {
  const d = new Date(date);
  const { value, unit } = interval;
  if (unit === "hari") d.setDate(d.getDate() + Number(value));
  else if (unit === "bulan") d.setMonth(d.getMonth() + Number(value));
  else if (unit === "tahun") d.setFullYear(d.getFullYear() + Number(value));
  return d;
}

export function dueDateOf(item) {
  return addInterval(item.lastDone, item.interval);
}

export function daysUntil(dueDate) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  return Math.round((due - today) / 86400000);
}

export function daysUntilItem(item) {
  return daysUntil(dueDateOf(item));
}

export function statusOf(dl) {
  if (dl < 0) return "overdue";
  if (dl <= 7) return "soon";
  return "ok";
}

export function statusText(dl) {
  if (dl < 0) return `Terlambat ${Math.abs(dl)} hari`;
  if (dl === 0) return "Hari ini";
  if (dl <= 60) return `${dl} hari lagi`;
  return `${Math.round(dl / 30)} bulan lagi`;
}

export function healthScore(items) {
  if (items.length === 0) return 100;
  const weight = { ok: 1, soon: 0.5, overdue: 0 };
  const sum = items.reduce((acc, it) => acc + weight[statusOf(daysUntilItem(it))], 0);
  return Math.round((sum / items.length) * 100);
}

export function worstStatus(statuses) {
  if (statuses.includes("overdue")) return "overdue";
  if (statuses.includes("soon")) return "soon";
  return "ok";
}

export function formatDateID(date) {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
