import { FIELD, SAVE } from '../data/balance';
import { addFieldRow } from '../world/layout';
import { createWorker } from '../world/worker';
import type { GameState } from '../world/state';

export interface SaveDataV1 {
  version: 1;
  gold: number;
  tuto: number;
  horses: { lvl: number; unlocked: boolean; feed: number; chew: number }[];
  buyZones: { cost: number; left: number }[];
  savedAt: number;
}

export interface SaveDataV2 {
  version: 2;
  gold: number;
  tuto: number;
  horses: { lvl: number; unlocked: boolean; feed: number; chew: number; water: number }[];
  buyZones: { cost: number; left: number }[];
  /** Nombre de rangées du champ (Phase 2 : extension). */
  fieldRows: number;
  /** Nombre d'employés automatiques embauchés (Phase 2). */
  workers: number;
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

function isSaveDataV2(data: unknown): data is SaveDataV2 {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    d.version === 2 &&
    typeof d.gold === 'number' &&
    typeof d.tuto === 'number' &&
    typeof d.savedAt === 'number' &&
    typeof d.fieldRows === 'number' &&
    typeof d.workers === 'number' &&
    Array.isArray(d.horses) &&
    Array.isArray(d.buyZones)
  );
}

/** Migration v1 -> v2 : l'eau, le champ étendu et les employés n'existaient pas encore. */
function migrateV1toV2(d: SaveDataV1): SaveDataV2 {
  return {
    version: 2,
    gold: d.gold,
    tuto: d.tuto,
    horses: d.horses.map((h) => ({ ...h, water: 0 })),
    buyZones: d.buyZones,
    fieldRows: FIELD.rows,
    workers: 0,
    savedAt: d.savedAt,
  };
}

export function serialize(state: GameState): SaveDataV2 {
  return {
    version: SAVE.schemaVersion as 2,
    gold: state.gold,
    tuto: state.tuto,
    horses: state.horses.map((h) => ({
      lvl: h.lvl,
      unlocked: h.unlocked,
      feed: h.feed,
      chew: h.chew,
      water: h.water,
    })),
    buyZones: state.buyZones.map((z) => ({ cost: z.cost, left: z.left })),
    fieldRows: state.fieldRows,
    workers: state.workers.length,
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
 * Charge la sauvegarde brute depuis le localStorage, en migrant une éventuelle
 * sauvegarde v1 (Phase 1) vers le format v2 (Phase 2 : eau, champ, employés).
 */
export function loadRawSave(): SaveDataV2 | null {
  try {
    const raw = localStorage.getItem(SAVE.storageKey);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (isSaveDataV2(data)) return data;
    if (isSaveDataV1(data)) return migrateV1toV2(data);
    return null;
  } catch {
    return null;
  }
}

export function applySave(state: GameState, data: SaveDataV2): void {
  state.gold = data.gold;
  state.tuto = data.tuto;
  data.horses.forEach((hs, i) => {
    const h = state.horses[i];
    if (!h) return;
    h.lvl = hs.lvl;
    h.unlocked = hs.unlocked;
    h.feed = hs.feed;
    h.chew = hs.chew;
    h.water = hs.water;
  });
  data.buyZones.forEach((zs, i) => {
    const z = state.buyZones[i];
    if (!z) return;
    z.cost = zs.cost;
    z.left = zs.left;
  });
  if (data.fieldRows > state.fieldRows) {
    for (let r = state.fieldRows; r < data.fieldRows; r++) addFieldRow(state.plants, r);
    state.fieldRows = data.fieldRows;
  }
  for (let i = 0; i < data.workers; i++) state.workers.push(createWorker());
}
