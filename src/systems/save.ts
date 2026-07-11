import { SAVE } from '../data/balance';
import type { GameState } from '../world/state';

export interface SaveDataV1 {
  version: 1;
  gold: number;
  tuto: number;
  horses: { lvl: number; unlocked: boolean; feed: number; chew: number }[];
  buyZones: { cost: number; left: number }[];
  savedAt: number;
}

function isSaveDataV1(data: unknown): data is SaveDataV1 {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    d.version === 1 &&
    typeof d.gold === 'number' &&
    typeof d.tuto === 'number' &&
    typeof d.savedAt === 'number' &&
    Array.isArray(d.horses) &&
    Array.isArray(d.buyZones)
  );
}

export function serialize(state: GameState): SaveDataV1 {
  return {
    version: SAVE.schemaVersion as 1,
    gold: state.gold,
    tuto: state.tuto,
    horses: state.horses.map((h) => ({
      lvl: h.lvl,
      unlocked: h.unlocked,
      feed: h.feed,
      chew: h.chew,
    })),
    buyZones: state.buyZones.map((z) => ({ cost: z.cost, left: z.left })),
    savedAt: Date.now(),
  };
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE.storageKey, JSON.stringify(serialize(state)));
  } catch {
    // Stockage indisponible (navigation privée, quota dépassé) : on ignore silencieusement.
  }
}

/**
 * Charge la sauvegarde brute depuis le localStorage. Emplacement prévu pour
 * les migrations de schéma futures (Phase 2+) : ajouter un cas par version.
 */
export function loadRawSave(): SaveDataV1 | null {
  try {
    const raw = localStorage.getItem(SAVE.storageKey);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    return isSaveDataV1(data) ? data : null;
  } catch {
    return null;
  }
}

export function applySave(state: GameState, data: SaveDataV1): void {
  state.gold = data.gold;
  state.tuto = data.tuto;
  data.horses.forEach((hs, i) => {
    const h = state.horses[i];
    if (!h) return;
    h.lvl = hs.lvl;
    h.unlocked = hs.unlocked;
    h.feed = hs.feed;
    h.chew = hs.chew;
  });
  data.buyZones.forEach((zs, i) => {
    const z = state.buyZones[i];
    if (!z) return;
    z.cost = zs.cost;
    z.left = zs.left;
  });
}
