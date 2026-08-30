import { dueDateOf } from "./status";
import { CATEGORY_META } from "../data/presets";

// Google Calendar "quick add" URL — no OAuth/API key needed. Opens a
// pre-filled event on calendar.google.com; user reviews and saves it
// themselves (one tap). All-day event on the due date.
export function googleCalendarUrl(item, contextLabel) {
  const due = dueDateOf(item);
  const start = formatYmd(due);
  const end = formatYmd(addDays(due, 1)); // Google's end date is exclusive

  const title = `${item.name} — Ronda`;
  const parts = [CATEGORY_META[item.category]?.label, contextLabel].filter(Boolean);
  const details = parts.length ? `Pengingat dari app Ronda · ${parts.join(" · ")}` : "Pengingat dari app Ronda";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}
