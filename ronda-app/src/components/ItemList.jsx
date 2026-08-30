import { Plus, CalendarPlus } from "lucide-react";
import { statusOf, statusText, daysUntilItem } from "../utils/status";
import { googleCalendarUrl } from "../utils/calendar";
import { C, STATUS_BADGE } from "../theme";

export default function ItemList({ items, contextLabel, members, onComplete, onAddItem }) {
  const sorted = [...items].sort((a, b) => daysUntilItem(a) - daysUntilItem(b));
  const memberOf = (id) => (members || []).find((m) => m.id === id);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {sorted.length === 0 && (
          <p style={{ color: C.dim, fontSize: 13 }}>Belum ada item. Tambah item pertama di bawah.</p>
        )}
        {sorted.map((it) => {
          const dl = daysUntilItem(it);
          const st = statusOf(dl);
          const badge = STATUS_BADGE[st];
          return (
            <div
              key={it.id}
              style={{
                background: C.panel, borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center",
                justifyContent: "space-between", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                {memberOf(it.assigneeId) && (
                  <span
                    title={memberOf(it.assigneeId).name}
                    aria-label={`Ditugaskan ke ${memberOf(it.assigneeId).name}`}
                    style={{
                      fontSize: 16, width: 26, height: 26, borderRadius: "50%", background: "#0000000F",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    {memberOf(it.assigneeId).avatar}
                  </span>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.textDark }}>{it.name}</div>
                  <div style={{ fontSize: 11.5, color: "#8A7F63", marginTop: 2 }}>{statusText(dl)}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ background: badge[0], color: badge[1], fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}>
                  {badge[2]}
                </span>
                <a
                  href={googleCalendarUrl(it, contextLabel)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Tambah ${it.name} ke Google Calendar`}
                  title="Tambah ke Google Calendar"
                  style={{
                    background: "#fff", border: `1px solid ${C.border}`, width: 30, height: 30, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <CalendarPlus size={14} color={C.textDark} />
                </a>
                <button
                  onClick={() => onComplete(it.id)}
                  aria-label={`Tandai ${it.name} selesai`}
                  style={{ background: "#FBBF24", border: "none", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 15, flexShrink: 0 }}
                >
                  ✓
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onAddItem}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent",
          border: `1.5px dashed ${C.border}`, borderRadius: 12, padding: 14, color: C.accent, fontWeight: 700, fontSize: 13.5, cursor: "pointer",
        }}
      >
        <Plus size={16} /> Tambah item
      </button>
    </div>
  );
}
