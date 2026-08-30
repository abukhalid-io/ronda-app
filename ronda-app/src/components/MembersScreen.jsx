import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AVATARS } from "../data/avatars";
import { C } from "../theme";

export default function MembersScreen({ members, onAdd, onRemove }) {
  const [showForm, setShowForm] = useState(members.length === 0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  function save() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), avatar });
    setName("");
    setAvatar(AVATARS[0]);
    setShowForm(false);
  }

  return (
    <div>
      {members.length === 0 && !showForm ? null : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {members.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex", alignItems: "center", gap: 12, background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: "12px 14px",
              }}
            >
              <div style={{ fontSize: 26, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, borderRadius: "50%" }}>
                {m.avatar}
              </div>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{m.name}</div>
              <button
                onClick={() => onRemove(m.id)}
                aria-label={`Hapus ${m.name}`}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: C.dim, padding: 6 }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {members.length === 0 && !showForm && (
        <p style={{ color: C.dim, fontSize: 13, marginBottom: 14 }}>
          Belum ada anggota keluarga. Tambah dulu biar bisa nge-assign tugas ke orang tertentu.
        </p>
      )}

      {showForm ? (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Nama</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mis. Kayla"
            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 14, margin: "6px 0 14px" }}
          />
          <label style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>Pilih avatar</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, margin: "8px 0 18px" }}>
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                aria-label={`Pilih avatar ${a}`}
                style={{
                  fontSize: 20, padding: "6px 0", borderRadius: 10, cursor: "pointer",
                  background: avatar === a ? C.accent + "33" : C.bg, border: `1.5px solid ${avatar === a ? C.accent : C.border}`,
                }}
              >
                {a}
              </button>
            ))}
          </div>
          <button
            onClick={save}
            disabled={!name.trim()}
            style={{
              width: "100%", background: name.trim() ? C.accent : "#2A2E38", border: "none", borderRadius: 10, padding: 13,
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: name.trim() ? "pointer" : "not-allowed",
            }}
          >
            Simpan anggota
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent",
            border: `1.5px dashed ${C.border}`, borderRadius: 12, padding: 14, color: C.accent, fontWeight: 700, fontSize: 13.5, cursor: "pointer",
          }}
        >
          <Plus size={16} /> Tambah anggota keluarga
        </button>
      )}
    </div>
  );
}
