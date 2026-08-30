import { useEffect, useState } from "react";
import { loadState, saveState, uid } from "./db";
import { CATEGORY_META } from "./data/presets";
import { todayISO } from "./utils/status";
import { checkStreak } from "./utils/streak";
import { randomMessage } from "./data/messages";
import { C } from "./theme";
import TopBar from "./components/TopBar";
import MapScreen from "./components/MapScreen";
import UnitList from "./components/UnitList";
import ItemList from "./components/ItemList";
import AddUnitForm from "./components/AddUnitForm";
import AddItemForm from "./components/AddItemForm";
import Achievements from "./components/Achievements";
import Celebration from "./components/Celebration";
import MembersScreen from "./components/MembersScreen";

// nav = { screen: 'map'|'units'|'items'|'addUnit'|'addItem'|'achievements'|'members', category, unitId }
const MAP_NAV = { screen: "map" };

export default function App() {
  const [ready, setReady] = useState(false);
  const [units, setUnits] = useState([]);
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({ streakCount: 0, bestStreak: 0, lastStreakCheckDate: null, totalCompletions: 0 });
  const [nav, setNav] = useState(MAP_NAV);
  const [celebration, setCelebration] = useState(null);

  useEffect(() => {
    loadState().then((s) => {
      const checkedStats = checkStreak(s.stats, s.items);
      setUnits(s.units);
      setItems(s.items);
      setMembers(s.members);
      setStats(checkedStats);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveState({ units, items, members, stats });
  }, [units, items, members, stats, ready]);

  function openCategory(category) {
    if (CATEGORY_META[category].needsUnit) setNav({ screen: "units", category });
    else setNav({ screen: "items", category, unitId: null });
  }

  function openUnit(unitId) {
    setNav((n) => ({ screen: "items", category: n.category, unitId }));
  }

  function saveUnit({ name, meta }) {
    const unit = { id: uid(), category: nav.category, name, meta };
    setUnits((prev) => [...prev, unit]);
    setNav({ screen: "items", category: nav.category, unitId: unit.id });
  }

  function saveItem({ name, lastDone, interval, assigneeId }) {
    const item = { id: uid(), category: nav.category, unitId: nav.unitId ?? null, name, lastDone, interval, assigneeId: assigneeId ?? null };
    setItems((prev) => [...prev, item]);
    setNav((n) => ({ screen: "items", category: n.category, unitId: n.unitId }));
  }

  function completeItem(id) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, lastDone: todayISO() } : it)));
    setStats((prev) => ({ ...prev, totalCompletions: (prev.totalCompletions || 0) + 1 }));
    setCelebration(randomMessage());
  }

  function addMember({ name, avatar }) {
    setMembers((prev) => [...prev, { id: uid(), name, avatar }]);
  }

  function removeMember(id) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    // lepas assignment item yang sebelumnya punya anggota ini, jangan hapus itemnya
    setItems((prev) => prev.map((it) => (it.assigneeId === id ? { ...it, assigneeId: null } : it)));
  }

  function back() {
    if (nav.screen === "units") setNav(MAP_NAV);
    else if (nav.screen === "items") setNav(CATEGORY_META[nav.category].needsUnit ? { screen: "units", category: nav.category } : MAP_NAV);
    else if (nav.screen === "addUnit") setNav({ screen: "units", category: nav.category });
    else if (nav.screen === "addItem") setNav({ screen: "items", category: nav.category, unitId: nav.unitId });
    else if (nav.screen === "achievements") setNav(MAP_NAV);
    else if (nav.screen === "members") setNav(MAP_NAV);
  }

  const title = {
    map: null,
    units: `${CATEGORY_META[nav.category]?.label.toUpperCase()} · DAFTAR UNIT`,
    items: nav.unitId
      ? units.find((u) => u.id === nav.unitId)?.name?.toUpperCase()
      : `${CATEGORY_META[nav.category]?.label.toUpperCase()} · DAFTAR ITEM`,
    addUnit: "TAMBAH UNIT BARU",
    addItem: "TAMBAH ITEM",
    achievements: "STREAK & LENCANA",
    members: "ANGGOTA KELUARGA",
  }[nav.screen];

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.dim, fontFamily: "'Inter', sans-serif" }}>
        Memuat…
      </div>
    );
  }

  const currentUnit = nav.unitId ? units.find((u) => u.id === nav.unitId) : null;
  const categoryUnits = units.filter((u) => u.category === nav.category);
  const scopedItems = items.filter((i) => i.category === nav.category && (i.unitId ?? null) === (nav.unitId ?? null));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Quicksand:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        button:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .bob { animation: bob 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .bob { animation: none; } }
      `}</style>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: 18 }}>
        {nav.screen !== "map" && <TopBar title={title} onBack={back} />}

        {nav.screen === "map" && (
          <MapScreen
            items={items}
            members={members}
            streak={stats.streakCount || 0}
            onOpenCategory={openCategory}
            onOpenAchievements={() => setNav({ screen: "achievements" })}
            onOpenMembers={() => setNav({ screen: "members" })}
            onComplete={completeItem}
          />
        )}

        {nav.screen === "units" && (
          <UnitList
            category={CATEGORY_META[nav.category].label}
            units={categoryUnits}
            items={items.filter((i) => i.category === nav.category)}
            onOpenUnit={openUnit}
            onAddUnit={() => setNav({ screen: "addUnit", category: nav.category })}
          />
        )}

        {nav.screen === "items" && (
          <ItemList
            items={scopedItems}
            contextLabel={currentUnit?.name}
            members={members}
            onComplete={completeItem}
            onAddItem={() => setNav({ screen: "addItem", category: nav.category, unitId: nav.unitId })}
          />
        )}

        {nav.screen === "addUnit" && <AddUnitForm onSave={saveUnit} />}

        {nav.screen === "addItem" && (
          <AddItemForm category={nav.category} contextLabel={currentUnit?.name} members={members} onSave={saveItem} />
        )}

        {nav.screen === "achievements" && <Achievements stats={stats} />}

        {nav.screen === "members" && <MembersScreen members={members} onAdd={addMember} onRemove={removeMember} />}
      </div>

      {celebration && <Celebration message={celebration} onDone={() => setCelebration(null)} />}
    </div>
  );
}
