import { useState, useMemo } from "react";
import { Wrench } from "lucide-react";
import { PRESETS, CATEGORY_META } from "../data/presets";
import { addInterval, todayISO, formatDateID } from "../utils/status";
import { C } from "../theme";

const inputStyle = {
  width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
  padding: "10px 12px", color: C.text, fontSize: 14, margin: "6px 0 14px",
};

export default function AddItemForm({ category, contextLabel, members, onSave }) {
  const [name, setName] = useState("");
  const [lastDone, setLastDone] = useState(todayISO());
  const [value, setValue] = useState(3);
  const [unit, setUnit] = useState("bulan");
  const [assigneeId, setAssigneeId] = useState(null);

  const presets = PRESETS[category] || [];
  const dueDate = useMemo(() => addInterval(lastDone, { value, unit }), [lastDone, value, unit]);

  function applyPreset(p) {
    setName(p.name);
    setValue(p.interval.value);
    setUnit(p.interval.unit);
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, color: C.dim, fontSize: 12.5 }}>
        <Wrench size={14} /> {CATEGORY_META[category].label}{contextLabel ? ` · ${contextLabel}` : ""}
      </div>

      {presets.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              style={{
                background: name === p.name ? C.accent : C.bg, color: name === p.name ? "#fff" : C.dim,
                border: `1px solid ${name === p.name ? C.accent : C.border}`, borderRadius: 999,
                padding: "5px 10px", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Nama item / tugas</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Ganti oli mesin" style={inputStyle} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 6 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Terakhir dilakukan</label>
          <input
            type="date" value={lastDone} onChange={(e) => setLastDone(e.target.value)}
            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 10px", color: C.text, fontSize: 13, marginTop: 6 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Ulangi setiap</label>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <input
              type="number" min={1} value={value} onChange={(e) => setValue(e.target.value)}
              style={{ width: 55, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 8px", color: C.text, fontSize: 13 }}
            />
            <select
              value={unit} onChange={(e) => setUnit(e.target.value)}
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 6px", color: C.text, fontSize: 13 }}
            >
              <option value="hari">hari</option>
              <option value="bulan">bulan</option>
              <option value="tahun">tahun</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: C.dim, marginBottom: 18 }}>
        Jatuh tempo berikutnya: <span style={{ color: C.text, fontWeight: 600 }}>{formatDateID(dueDate)}</span>
      </div>

      {members && members.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Ditugaskan ke</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            <button
              onClick={() => setAssigneeId(null)}
              style={{
                display: "flex", alignItems: "center", gap: 5, background: assigneeId === null ? C.accent : C.bg,
                color: assigneeId === null ? "#fff" : C.dim, border: `1px solid ${assigneeId === null ? C.accent : C.border}`,
                borderRadius: 999, padding: "5px 10px", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
              }}
            >
              👨‍👩‍👧‍👦 Semua
            </button>
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setAssigneeId(m.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 5, background: assigneeId === m.id ? C.accent : C.bg,
                  color: assigneeId === m.id ? "#fff" : C.dim, border: `1px solid ${assigneeId === m.id ? C.accent : C.border}`,
                  borderRadius: 999, padding: "5px 10px", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                }}
              >
                {m.avatar} {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => name.trim() && onSave({ name: name.trim(), lastDone, interval: { value: Number(value), unit }, assigneeId })}
        disabled={!name.trim()}
        style={{
          width: "100%", background: name.trim() ? C.accent : "#2A2E38", border: "none", borderRadius: 10, padding: 13,
          color: "#fff", fontWeight: 700, fontSize: 14, cursor: name.trim() ? "pointer" : "not-allowed",
        }}
      >
        Simpan item
      </button>
    </div>
  );
}
