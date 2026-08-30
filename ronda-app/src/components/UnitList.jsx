import { ChevronRight, Plus } from "lucide-react";
import { statusOf, daysUntilItem, worstStatus } from "../utils/status";
import { C, STATUS_COLOR } from "../theme";

export default function UnitList({ category, units, items, onOpenUnit, onAddUnit }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {units.length === 0 && (
          <p style={{ color: C.dim, fontSize: 13 }}>Belum ada unit. Tambah unit pertama kamu di bawah.</p>
        )}
        {units.map((u) => {
          const unitItems = items.filter((i) => i.unitId === u.id);
          const statuses = unitItems.map((i) => statusOf(daysUntilItem(i)));
          const st = worstStatus(statuses);
          const alerts = statuses.filter((s) => s !== "ok").length;
          return (
            <button
              key={u.id}
              onClick={() => onOpenUnit(u.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: "13px 16px", cursor: "pointer", textAlign: "left",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLOR[st], flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2 }}>
                  {u.meta ? `${u.meta} · ` : ""}{unitItems.length} item{alerts > 0 ? ` · ${alerts} butuh perhatian` : ""}
                </div>
              </div>
              <ChevronRight size={15} color={C.dim} />
            </button>
          );
        })}
      </div>
      <button
        onClick={onAddUnit}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent",
          border: `1.5px dashed ${C.border}`, borderRadius: 12, padding: 14, color: C.accent, fontWeight: 700, fontSize: 13.5, cursor: "pointer",
        }}
      >
        <Plus size={16} /> Tambah unit {category.toLowerCase()} baru
      </button>
    </div>
  );
}
