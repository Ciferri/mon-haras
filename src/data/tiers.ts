/**
 * Paliers visuels des éléments du haras (enclos, cheval, champ).
 * Structure préparée dès la Phase 1 ; le palier 4 est rempli en Phase 2.
 * Les paliers 8 et 12 restent à niveau 4 en attendant une direction
 * artistique dédiée (voir docs/DECISIONS.md).
 *
 * Chaque élément change d'apparence aux niveaux 1, 4, 8 et 12.
 */

export const TIER_LEVELS = [1, 4, 8, 12] as const;
export type TierLevel = (typeof TIER_LEVELS)[number];

export interface EnclosureTier {
  level: TierLevel;
  fenceTop: string;
  fenceSide: string;
  sandTop: string;
}

export interface HorseTier {
  level: TierLevel;
  coatTop: string;
  coatSide: string;
  hasHarness: boolean;
  hasOrnaments: boolean;
}

export interface FieldTier {
  level: TierLevel;
  rows: number;
  hasScarecrow: boolean;
}

export const ENCLOSURE_TIERS: EnclosureTier[] = [
  { level: 1, fenceTop: '#b07b3f', fenceSide: '#8a5a28', sandTop: '#ecd9ad' },
  { level: 4, fenceTop: '#f3efe4', fenceSide: '#8993a1', sandTop: '#f4e8c4' },
];

export const HORSE_TIERS: HorseTier[] = [
  {
    level: 1,
    coatTop: '#a5713f',
    coatSide: '#8a5a2e',
    hasHarness: false,
    hasOrnaments: false,
  },
  {
    level: 4,
    coatTop: '#6e4522',
    coatSide: '#55341a',
    hasHarness: true,
    hasOrnaments: false,
  },
];

export const FIELD_TIERS: FieldTier[] = [
  { level: 1, rows: 3, hasScarecrow: false },
  { level: 4, rows: 4, hasScarecrow: true },
];

function tierFor<T extends { level: TierLevel }>(tiers: T[], level: number): T {
  let best = tiers[0]!;
  for (const t of tiers) {
    if (level >= t.level) best = t;
  }
  return best;
}

export function enclosureTierFor(level: number): EnclosureTier {
  return tierFor(ENCLOSURE_TIERS, level);
}

export function horseTierFor(level: number): HorseTier {
  return tierFor(HORSE_TIERS, level);
}

export function fieldTierFor(level: number): FieldTier {
  return tierFor(FIELD_TIERS, level);
}
