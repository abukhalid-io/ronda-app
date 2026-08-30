import { get, set } from "idb-keyval";

const KEY = "ronda-data-v1";

const EMPTY_STATE = {
  units: [],
  items: [],
  members: [],
  stats: { streakCount: 0, bestStreak: 0, lastStreakCheckDate: null, totalCompletions: 0 },
};

export async function loadState() {
  const state = await get(KEY);
  // spread merge: fills in fields added after a user's first save (e.g. `stats`)
  return { ...EMPTY_STATE, ...state };
}

export async function saveState(state) {
  await set(KEY, state);
  return state;
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
