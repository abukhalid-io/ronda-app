import React, { useState } from "react";
import { Home, Car, Cpu, Plus, ChevronLeft, ChevronRight, Wrench } from "lucide-react";

const CATS = {
  rumah: { label: "Rumah", icon: Home, needsUnit: false },
  kendaraan: { label: "Kendaraan", icon: Car, needsUnit: true },
  elektronik: { label: "Elektronik", icon: Cpu, needsUnit: true },
};

const SEED_UNITS = {
  kendaraan: [
    { id: "u1", name: "Motor Vario 2020", meta: "Plat DA 1234 XY", items: 3 },
    { id: "u2", name: "Mobil Avanza 2018", meta: "Plat DA 5678 ZZ", items: 4 },
  ],
  elektronik: [
    { id: "u3", name: "AC Kamar Utama", meta: "1 PK · Daikin", items: 2 },
    { id: "u4", name: "Kulkas Dapur", meta: "2 pintu · Sharp", items: 1 },
  ],
};

const C = { bg: "#0F1115", panel: "#181B22", border: "#262A33", text: "#EDEFF3", dim: "#8A93A3", accent: "#0F8B8D" };

export default function AddFlowMockup() {
  const [screen, setScreen] = useState("category"); // category -> units -> unitForm -> itemForm
  const [cat, setCat] = useState("kendaraan");
  const [units, setUnits] = useState(SEED_UNITS);
  const [unitName, setUnitName] = useState("");
  const [unitMeta, setUnitMeta] = useState("");
  const [itemName, setItemName] = useState("");

  function goCategory(k) {
    setCat(k);
    setScreen(CATS[k].needsUnit ? "units" : "itemForm");
  }

  function saveUnit() {
    if (!unitName.trim()) return;
    setUnits((prev) => ({
      ...prev,
      [cat]: [...(prev[cat] || []), { id: Date.now().toString(), name: unitName, meta: unitMeta, items: 0 }],
    }));
    setUnitName(""); setUnitMeta("");
    setScreen("units");
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600&display=swap'); *{box-sizing:border-box;} button:focus-visible{outline:2px solid ${C.accent};outline-offset:2px;}`}</style>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: 18 }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          {screen !== "category" && (
            <button onClick={() => setScreen(screen === "unitForm" || screen === "itemForm" ? (CATS[cat].needsUnit ? "units" : "category") : "category")}
              style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ChevronLeft size={16} color={C.text} />
            </button>
          )}
          <span style={{ fontSize: 12, color: C.dim, fontWeight: 600, letterSpacing: 0.3 }}>
            {screen === "category" && "PILIH KATEGORI"}
            {screen === "units" && `${CATS[cat].label.toUpperCase()} · DAFTAR UNIT`}
            {screen === "unitForm" && "TAMBAH UNIT BARU"}
            {screen === "itemForm" && "TAMBAH ITEM"}
          </span>
        </div>

        {/* SCREEN 1: Category */}
        {screen === "category" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(CATS).map(([k, v]) => {
              const Icon = v.icon;
              return (
                <button key={k} onClick={() => goCategory(k)} style={{ display: "flex", alignItems: "center", gap: 12, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: C.accent + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={C.accent} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{v.label}</div>
                    <div style={{ fontSize: 11.5, color: C.dim }}>{v.needsUnit ? `${(units[k] || []).length} unit terdaftar` : "Langsung ke daftar item"}</div>
                  </div>
                  <ChevronRight size={16} color={C.dim} />
                </button>
              );
            })}
          </div>
        )}

        {/* SCREEN 2: Unit list */}
        {screen === "units" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {(units[cat] || []).map((u) => (
                <button key={u.id} onClick={() => setScreen("itemForm")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "13px 16px", cursor: "pointer", textAlign: "left" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 11.5, color: C.dim, marginTop: 2 }}>{u.meta} · {u.items} item</div>
                  </div>
                  <ChevronRight size={15} color={C.dim} />
                </button>
              ))}
            </div>
            <button onClick={() => setScreen("unitForm")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", border: `1.5px dashed ${C.border}`, borderRadius: 12, padding: "14px", color: C.accent, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
              <Plus size={16} /> Tambah unit {CATS[cat].label.toLowerCase()} baru
            </button>
          </div>
        )}

        {/* SCREEN 3: Unit form */}
        {screen === "unitForm" && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Nama unit</label>
            <input value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="mis. Motor Vario 2020"
              style={{ width: "100%", background: "#0F1115", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 14, margin: "6px 0 14px" }} />
            <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Keterangan (opsional)</label>
            <input value={unitMeta} onChange={(e) => setUnitMeta(e.target.value)} placeholder="mis. Plat DA 1234 XY"
              style={{ width: "100%", background: "#0F1115", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 14, margin: "6px 0 18px" }} />
            <button onClick={saveUnit} disabled={!unitName.trim()} style={{ width: "100%", background: unitName.trim() ? C.accent : "#2A2E38", border: "none", borderRadius: 10, padding: 13, color: "#fff", fontWeight: 700, fontSize: 14, cursor: unitName.trim() ? "pointer" : "not-allowed" }}>
              Simpan unit → lanjut tambah item
            </button>
          </div>
        )}

        {/* SCREEN 4: Item form (reuses the same add-item form regardless of category/unit) */}
        {screen === "itemForm" && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, color: C.dim, fontSize: 12.5 }}>
              <Wrench size={14} /> {CATS[cat].label}{CATS[cat].needsUnit ? " · Motor Vario 2020" : ""}
            </div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Nama item / tugas</label>
            <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="mis. Ganti oli mesin"
              style={{ width: "100%", background: "#0F1115", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 14, margin: "6px 0 14px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Terakhir dilakukan</label>
                <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} style={{ width: "100%", background: "#0F1115", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px", color: C.text, fontSize: 13, marginTop: 6 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Ulangi setiap</label>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <input type="number" defaultValue={3} style={{ width: 55, background: "#0F1115", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 8px", color: C.text, fontSize: 13 }} />
                  <select defaultValue="bulan" style={{ flex: 1, background: "#0F1115", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 6px", color: C.text, fontSize: 13 }}>
                    <option>hari</option><option>bulan</option><option>tahun</option>
                  </select>
                </div>
              </div>
            </div>
            <button style={{ width: "100%", background: C.accent, border: "none", borderRadius: 10, padding: 13, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Simpan item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
