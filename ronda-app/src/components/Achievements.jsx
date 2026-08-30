import { BADGES } from "../data/messages";
import { C } from "../theme";

export default function Achievements({ stats }) {
  const streak = stats.streakCount || 0;
  const best = stats.bestStreak || 0;
  const done = stats.totalCompletions || 0;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <StatCard emoji="🔥" value={streak} label="Streak sekarang" />
        <StatCard emoji="🏅" value={best} label="Streak terbaik" />
        <StatCard emoji="✅" value={done} label="Total selesai" />
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: C.dim, marginBottom: 10, letterSpacing: 0.3 }}>LENCANA</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {BADGES.map((b) => {
          const value = b.type === "streak" ? best : done;
          const unlocked = value >= b.threshold;
          return (
            <div
              key={b.key}
              style={{
                background: C.surface, border: `1px solid ${unlocked ? C.accent : C.border}`, borderRadius: 14,
                padding: "14px 12px", textAlign: "center", opacity: unlocked ? 1 : 0.45,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6, filter: unlocked ? "none" : "grayscale(1)" }}>{b.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: C.text }}>{b.label}</div>
              <div style={{ fontSize: 10.5, color: C.dim, marginTop: 3 }}>{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ emoji, value, label }) {
  return (
    <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
      <div style={{ fontSize: 18 }}>{emoji}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 17, color: C.text, marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{label}</div>
    </div>
  );
}
