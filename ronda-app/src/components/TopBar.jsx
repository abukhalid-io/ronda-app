import { ChevronLeft } from "lucide-react";
import { C } from "../theme";

export default function TopBar({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Kembali"
          style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
          }}
        >
          <ChevronLeft size={16} color={C.text} />
        </button>
      )}
      <span style={{ fontSize: 12, color: C.dim, fontWeight: 700, letterSpacing: 0.4 }}>{title}</span>
    </div>
  );
}
