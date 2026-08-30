import { Trophy, Users } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER } from "../data/presets";
import { statusOf, statusText, daysUntilItem, healthScore, worstStatus } from "../utils/status";
import { C, STATUS_COLOR } from "../theme";
import HealthRing from "./HealthRing";

// Layout: kendaraan/elektronik jadi "puncak" atas, rumah/dokumen/tugasRingan
// disebar di baris bawah — dua baris supaya 5 pulau punya jarak label yang
// aman (sempat ada 4 pulau berdesakan & kepotong tepi kartu sebelumnya).
const POSITIONS = {
  kendaraan: { left: "30%", top: "24%" },
  elektronik: { left: "70%", top: "24%" },
  rumah: { left: "12%", top: "70%" },
  dokumen: { left: "50%", top: "70%" },
  tugasRingan: { left: "88%", top: "70%" },
};

export default function MapScreen({ items, members, streak, onOpenCategory, onOpenAchievements, onOpenMembers, onComplete }) {
  const score = healthScore(items);

  const catInfo = {};
  for (const cat of CATEGORY_ORDER) {
    const list = items.filter((i) => i.category === cat);
    const statuses = list.map((i) => statusOf(daysUntilItem(i)));
    catInfo[cat] = {
      status: worstStatus(statuses),
      alerts: statuses.filter((s) => s !== "ok").length,
    };
  }

  const worst =
    CATEGORY_ORDER.find((c) => catInfo[c].status === "overdue") ||
    CATEGORY_ORDER.find((c) => catInfo[c].status === "soon") ||
    null;

  const urgent = [...items]
    .filter((i) => statusOf(daysUntilItem(i)) !== "ok")
    .sort((a, b) => daysUntilItem(a) - daysUntilItem(b))
    .slice(0, 5);

  const memberOf = (id) => (members || []).find((m) => m.id === id);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 20, color: C.text }}>Ronda</div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>Ronda rumah, kendaraan, elektronik, & dokumen kamu.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onOpenMembers}
            aria-label="Kelola anggota keluarga"
            title="Anggota keluarga"
            style={{
              display: "flex", alignItems: "center", background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: "50%", width: 32, height: 32, justifyContent: "center", cursor: "pointer", color: C.text,
            }}
          >
            <Users size={14} />
          </button>
          <button
            onClick={onOpenAchievements}
            aria-label="Lihat streak & lencana"
            style={{
              display: "flex", alignItems: "center", gap: 5, background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 999, padding: "6px 10px", cursor: "pointer", color: C.text,
            }}
          >
            <span style={{ fontSize: 14 }} aria-hidden="true">🔥</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12.5 }}>{streak}</span>
            <Trophy size={13} color={C.dim} />
          </button>
          <HealthRing score={score} />
        </div>
      </div>

      <div
        style={{
          position: "relative", height: 320, borderRadius: 20, overflow: "hidden",
          background: `linear-gradient(180deg, ${C.sky} 0%, ${C.grassTop} 55%, ${C.grassBottom} 100%)`,
        }}
      >
        <div style={{ position: "absolute", top: 16, left: 24, fontSize: 26, opacity: 0.9 }}>☁️</div>
        <div style={{ position: "absolute", top: 34, right: 40, fontSize: 20, opacity: 0.8 }}>☁️</div>

        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
          <path
            d="M 12 70 Q 20 40, 30 24 Q 50 10, 70 24 Q 80 40, 88 70 Q 70 62, 50 70"
            fill="none" stroke="#FFFFFFB0" strokeWidth="0.6" strokeDasharray="0.5 2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
          />
        </svg>

        {CATEGORY_ORDER.map((key) => {
          const cfg = CATEGORY_META[key];
          const info = catInfo[key];
          return (
            <div key={key} style={{ position: "absolute", ...POSITIONS[key], transform: "translate(-50%,-50%)", textAlign: "center" }}>
              {worst === key && (
                <div className="bob" style={{ fontSize: 22, marginBottom: -6 }} aria-hidden="true">🧑‍🔧</div>
              )}
              <button
                onClick={() => onOpenCategory(key)}
                style={{
                  width: 52, height: 52, borderRadius: "50%", border: `3px solid ${STATUS_COLOR[info.status]}`,
                  background: STATUS_COLOR[info.status], display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)", fontSize: 20, cursor: "pointer", position: "relative",
                }}
              >
                {cfg.emoji}
                {info.alerts > 0 && (
                  <span
                    style={{
                      position: "absolute", top: -4, right: -4, background: "#B91C1B", color: "#fff", fontSize: 10,
                      fontWeight: 800, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center",
                      justifyContent: "center", border: "2px solid #fff",
                    }}
                  >
                    {info.alerts}
                  </span>
                )}
              </button>
              <div style={{ marginTop: 5, background: "#FFFFFFE0", borderRadius: 999, padding: "2px 7px", fontSize: 9.5, fontWeight: 700, color: "#2D3B29", whiteSpace: "nowrap" }}>
                {cfg.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 10px" }}>
          ⚡ Perlu perhatian sekarang
        </h3>
        {urgent.length === 0 ? (
          <div
            style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 14px",
              textAlign: "center", color: C.dim, fontSize: 13,
            }}
          >
            Semua aman! Gak ada yang butuh perhatian sekarang. 🎉
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {urgent.map((it) => {
              const dl = daysUntilItem(it);
              const assignee = memberOf(it.assigneeId);
              return (
                <div
                  key={it.id}
                  style={{
                    background: C.panel, borderRadius: 14, padding: "10px 13px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }} aria-hidden="true">{CATEGORY_META[it.category].emoji}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {it.name}
                      </div>
                      <div style={{ fontSize: 10.5, color: "#8A7F63", marginTop: 1 }}>
                        {statusText(dl)}{assignee ? ` · ${assignee.avatar} ${assignee.name}` : ""}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onComplete(it.id)}
                    aria-label={`Tandai ${it.name} selesai`}
                    style={{ background: "#FBBF24", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 13, flexShrink: 0, marginLeft: 8 }}
                  >
                    ✓
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
