import React, { useState, useMemo } from "react";
import { Home, Car, Cpu, Sparkles, CloudRain, Shield, Check } from "lucide-react";

const CATS = {
  rumah: { label: "Rumah", icon: Home, emoji: "🏠" },
  kendaraan: { label: "Kendaraan", icon: Car, emoji: "🚗" },
  elektronik: { label: "Elektronik", icon: Cpu, emoji: "🔌" },
};

const SAMPLE = [
  { id: 1, category: "rumah", name: "Servis AC Ruang Tamu", lastDone: "20 Mei 2026", dl: -3 },
  { id: 2, category: "kendaraan", name: "Pajak STNK Motor", lastDone: "18 Agu 2025", dl: -1 },
  { id: 3, category: "elektronik", name: "Baterai Smoke Detector", lastDone: "10 Feb 2026", dl: 4 },
  { id: 4, category: "rumah", name: "Cek Talang Air", lastDone: "3 Mar 2026", dl: 6 },
  { id: 5, category: "kendaraan", name: "Ganti Oli Mesin Mobil", lastDone: "1 Agu 2026", dl: 22 },
  { id: 6, category: "elektronik", name: "Bersihkan Filter AC Indoor", lastDone: "15 Jul 2026", dl: 45 },
];

function statusOf(dl) {
  if (dl < 0) return "overdue";
  if (dl <= 7) return "soon";
  return "ok";
}
function statusText(dl) {
  if (dl < 0) return `Terlambat ${Math.abs(dl)} hari`;
  if (dl === 0) return "Hari ini";
  if (dl <= 60) return `${dl} hari lagi`;
  return `${Math.round(dl / 30)} bulan lagi`;
}
function catStatus(items, cat) {
  const list = items.filter((i) => i.category === cat);
  if (list.some((i) => statusOf(i.dl) === "overdue")) return "overdue";
  if (list.some((i) => statusOf(i.dl) === "soon")) return "soon";
  return "ok";
}

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Quicksand:wght@500;600;700&family=Cinzel:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');";

const STYLES = [
  { key: "map", label: "🗺️ Peta Petualangan" },
  { key: "pet", label: "🏡 Rumah Piaraan" },
  { key: "rpg", label: "⚔️ Papan Quest" },
];

export default function StyleExplorer() {
  const [style, setStyle] = useState("map");
  const [items, setItems] = useState(SAMPLE);
  const [selectedCat, setSelectedCat] = useState("rumah");

  function complete(id) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, dl: 120 } : it)));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F1115" }}>
      <style>{`${FONT_IMPORT}
        * { box-sizing: border-box; }
        @keyframes bob { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-6px); } }
        @keyframes floatUp { 0%{ transform: translateY(0); opacity:1; } 100%{ transform: translateY(-16px); opacity:0; } }
        .bob { animation: bob 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .bob { animation: none; } }
      `}</style>

      {/* Style switcher */}
      <div style={{ display: "flex", gap: 8, padding: 14, background: "#0F1115", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #23262E", overflowX: "auto" }}>
        {STYLES.map((s) => (
          <button
            key={s.key}
            onClick={() => setStyle(s.key)}
            style={{
              padding: "9px 14px",
              borderRadius: 999,
              border: "1px solid " + (style === s.key ? "#F5F4F0" : "#2A2E38"),
              background: style === s.key ? "#F5F4F0" : "#181B22",
              color: style === s.key ? "#0F1115" : "#9CA5B5",
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {style === "map" && <AdventureMap items={items} selectedCat={selectedCat} setSelectedCat={setSelectedCat} complete={complete} />}
      {style === "pet" && <HousePet items={items} complete={complete} />}
      {style === "rpg" && <QuestBoard items={items} complete={complete} />}
    </div>
  );
}

/* ============ STYLE 1: ADVENTURE MAP ============ */
function AdventureMap({ items, selectedCat, setSelectedCat, complete }) {
  const positions = { rumah: { left: "16%", top: "60%" }, kendaraan: { left: "50%", top: "18%" }, elektronik: { left: "82%", top: "56%" } };
  const nodeColor = { overdue: "#EF4444", soon: "#F59E0B", ok: "#22C55E" };

  const worst = ["rumah", "kendaraan", "elektronik"].find((c) => catStatus(items, c) === "overdue")
    || ["rumah", "kendaraan", "elektronik"].find((c) => catStatus(items, c) === "soon")
    || "rumah";

  const catItems = items.filter((i) => i.category === selectedCat).sort((a, b) => a.dl - b.dl);

  return (
    <div style={{ fontFamily: "'Quicksand', sans-serif" }}>
      <div style={{
        position: "relative", height: 300, margin: "16px", borderRadius: 20, overflow: "hidden",
        background: "linear-gradient(180deg, #8FD9F0 0%, #BFEAA8 55%, #9ED97F 100%)",
      }}>
        {/* clouds */}
        <div style={{ position: "absolute", top: 16, left: 24, fontSize: 26, opacity: 0.9 }}>☁️</div>
        <div style={{ position: "absolute", top: 34, right: 40, fontSize: 20, opacity: 0.8 }}>☁️</div>

        {/* dashed path */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <path d="M 16% 60% Q 33% 30%, 50% 18% T 82% 56%" fill="none" stroke="#FFFFFFB0" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />
        </svg>

        {Object.entries(CATS).map(([key, cfg]) => {
          const st = catStatus(items, key);
          const alerts = items.filter((i) => i.category === key && statusOf(i.dl) !== "ok").length;
          const isSelected = selectedCat === key;
          return (
            <div key={key} style={{ position: "absolute", ...positions[key], transform: "translate(-50%,-50%)", textAlign: "center" }}>
              {worst === key && (
                <div className="bob" style={{ fontSize: 26, marginBottom: -6 }}>🧑‍🔧</div>
              )}
              <button
                onClick={() => setSelectedCat(key)}
                style={{
                  width: 68, height: 68, borderRadius: "50%", border: isSelected ? "4px solid #FFF" : "3px solid " + nodeColor[st],
                  background: nodeColor[st], display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isSelected ? "0 0 0 5px #FFFFFF66, 0 6px 14px rgba(0,0,0,0.25)" : "0 4px 10px rgba(0,0,0,0.2)",
                  fontSize: 28, cursor: "pointer", position: "relative",
                }}
              >
                {cfg.emoji}
                {alerts > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, background: "#B91C1B", color: "#fff", fontSize: 10, fontWeight: 800, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                    {alerts}
                  </span>
                )}
              </button>
              <div style={{ marginTop: 6, background: "#FFFFFFE0", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700, color: "#2D3B29" }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Task list for selected zone */}
      <div style={{ padding: "0 16px 24px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F5F4F0", margin: "0 0 10px" }}>
          {CATS[selectedCat].emoji} Misi di {CATS[selectedCat].label}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {catItems.length === 0 && <p style={{ color: "#9CA5B5", fontSize: 13 }}>Tidak ada misi di zona ini.</p>}
          {catItems.map((it) => {
            const st = statusOf(it.dl);
            const badge = { overdue: ["#FCA5A5", "#7F1D1D", "Genting"], soon: ["#FDE68A", "#78350F", "Segera"], ok: ["#BBF7D0", "#14532D", "Aman"] }[st];
            return (
              <div key={it.id} style={{ background: "#FFF9EE", borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#2D2A20" }}>{it.name}</div>
                  <div style={{ fontSize: 11.5, color: "#8A7F63", marginTop: 2 }}>{statusText(it.dl)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: badge[0], color: badge[1], fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999 }}>{badge[2]}</span>
                  <button onClick={() => complete(it.id)} style={{ background: "#FBBF24", border: "none", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 15 }}>✓</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============ STYLE 2: HOUSE PET ============ */
function HousePet({ items, complete }) {
  const health = useMemo(() => {
    const score = items.reduce((sum, it) => sum + (statusOf(it.dl) === "ok" ? 1 : statusOf(it.dl) === "soon" ? 0.5 : 0), 0);
    return Math.round((score / items.length) * 100);
  }, [items]);

  const mood = health >= 75 ? "happy" : health >= 40 ? "neutral" : "sad";
  const moodCfg = {
    happy: { wall: "#FFE8B8", roof: "#FF8C69", text: "Rumahmu lagi seneng nih! Semua terurus baik 😊", face: "^_^" },
    neutral: { wall: "#F3E3B0", roof: "#E8A46E", text: "Rumahmu baik-baik aja, tapi ada yang butuh dicek.", face: "•_•" },
    sad: { wall: "#D9CBAE", roof: "#B0745A", text: "Rumahmu butuh perhatian kamu nih... 🥺", face: "T_T" },
  }[mood];

  const needsAttention = items.filter((i) => statusOf(i.dl) !== "ok").sort((a, b) => a.dl - b.dl);

  return (
    <div style={{ fontFamily: "'Quicksand', sans-serif", padding: 20, textAlign: "center" }}>
      <div style={{ position: "relative", maxWidth: 300, margin: "10px auto 0" }}>
        {mood === "happy" && <Sparkles size={22} color="#FBBF24" style={{ position: "absolute", top: -6, right: 30 }} />}
        {mood === "sad" && <CloudRain size={26} color="#93A5B8" style={{ position: "absolute", top: -18, left: 20 }} />}

        {/* house illustration */}
        <div className={mood === "happy" ? "bob" : ""} style={{ width: 220, height: 220, margin: "0 auto", position: "relative" }}>
          {/* roof */}
          <div style={{ width: 0, height: 0, borderLeft: "115px solid transparent", borderRight: "115px solid transparent", borderBottom: `70px solid ${moodCfg.roof}`, margin: "0 auto" }} />
          {/* body */}
          <div style={{ width: 170, height: 130, background: moodCfg.wall, margin: "-2px auto 0", borderRadius: "0 0 14px 14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#4A3B28", fontFamily: "monospace" }}>{moodCfg.face}</div>
            <div style={{ width: 26, height: 34, background: "#7A5233", borderRadius: "6px 6px 0 0", marginTop: 10 }} />
          </div>
        </div>

        <div style={{ background: "#1B1E26", color: "#F5F4F0", borderRadius: 14, padding: "10px 16px", marginTop: 16, fontSize: 13.5 }}>
          {moodCfg.text}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <div style={{ flex: 1, height: 12, background: "#2A2E38", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${health}%`, height: "100%", background: health >= 75 ? "#34D399" : health >= 40 ? "#FBBF24" : "#F87171", transition: "width .5s" }} />
          </div>
          <span style={{ color: "#F5F4F0", fontWeight: 800, fontSize: 15 }}>{health}%</span>
        </div>
      </div>

      <div style={{ textAlign: "left", maxWidth: 340, margin: "26px auto 0" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F5F4F0", margin: "0 0 10px" }}>
          {needsAttention.length > 0 ? "Rumahmu butuh ini:" : "Semua sudah dirawat! 🎉"}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {needsAttention.map((it) => (
            <div key={it.id} style={{ background: "#1B1E26", borderRadius: 14, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#F5F4F0", fontWeight: 600, fontSize: 13.5 }}>{CATS[it.category].emoji} {it.name}</div>
                <div style={{ color: "#8A93A3", fontSize: 11.5, marginTop: 2 }}>{statusText(it.dl)}</div>
              </div>
              <button onClick={() => complete(it.id)} style={{ background: "#F87171", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, padding: "7px 12px", borderRadius: 10, cursor: "pointer" }}>
                Rawat 💊
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ STYLE 3: RPG QUEST BOARD ============ */
function QuestBoard({ items, complete }) {
  const xp = items.filter((i) => statusOf(i.dl) === "ok").length * 20 + 40;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(180deg, #1A1029 0%, #120B1F 100%)", minHeight: "calc(100vh - 60px)", padding: 18 }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Level header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#241636", border: "1px solid #4C3A6B", borderRadius: 14, padding: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#D4AF37,#8A6D1E)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 14px #D4AF3766" }}>
            <Shield size={24} color="#1A1029" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cinzel', serif", color: "#F3E3B0", fontWeight: 700, fontSize: 15 }}>LV. {level} — Penjaga Rumah</div>
            <div style={{ height: 9, background: "#33224A", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
              <div style={{ width: `${xpInLevel}%`, height: "100%", background: "linear-gradient(90deg,#D4AF37,#F3E3B0)" }} />
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: "#9C8CB8", marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{xpInLevel} / 100 XP</div>
          </div>
        </div>

        {/* Quest cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
          {items.sort((a, b) => a.dl - b.dl).map((it) => {
            const st = statusOf(it.dl);
            const urgent = st === "overdue";
            return (
              <div key={it.id} style={{
                background: "#F3E3B0", borderRadius: 10, padding: "14px 16px", position: "relative",
                border: urgent ? "2px solid #B91C1B" : "2px solid #C4A85E",
                boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{
                      fontFamily: "'Cinzel', serif", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5,
                      color: urgent ? "#7F1D1D" : "#5A4522", background: urgent ? "#FCA5A5" : "#E4CE8E", padding: "2px 8px", borderRadius: 4,
                    }}>
                      {urgent ? "⚔ QUEST MENDESAK" : "QUEST"}
                    </span>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#2D2410", marginTop: 6 }}>
                      {CATS[it.category].emoji} {it.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#6B5A32", marginTop: 3 }}>
                      Terakhir {it.lastDone} · {statusText(it.dl)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <span className="mono" style={{ fontSize: 11, color: "#8A6D1E", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>+20 XP</span>
                  <button onClick={() => complete(it.id)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#3D2E1A", color: "#F3E3B0", border: "none", fontSize: 12, fontWeight: 700, padding: "7px 12px", borderRadius: 8, cursor: "pointer" }}>
                    <Check size={13} /> Selesaikan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
