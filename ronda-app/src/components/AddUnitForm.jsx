import { useState } from "react";
import { C } from "../theme";

const inputStyle = {
  width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
  padding: "10px 12px", color: C.text, fontSize: 14, margin: "6px 0 14px",
};

export default function AddUnitForm({ onSave }) {
  const [name, setName] = useState("");
  const [meta, setMeta] = useState("");

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Nama unit</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Motor Vario 2020" style={inputStyle} />
      <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Keterangan (opsional)</label>
      <input value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="mis. Plat DA 1234 XY" style={inputStyle} />
      <button
        onClick={() => name.trim() && onSave({ name: name.trim(), meta: meta.trim() })}
        disabled={!name.trim()}
        style={{
          width: "100%", background: name.trim() ? C.accent : "#2A2E38", border: "none", borderRadius: 10, padding: 13,
          color: "#fff", fontWeight: 700, fontSize: 14, cursor: name.trim() ? "pointer" : "not-allowed",
        }}
      >
        Simpan unit → lanjut tambah item
      </button>
    </div>
  );
}
