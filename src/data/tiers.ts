/**
 * Paliers visuels des éléments du haras (enclos, cheval, champ).
 * Structure préparée dès la Phase 1 ; le contenu des paliers > 1 sera
 * rempli en Phase 2 (voir docs/DECISIONS.md).
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

/** Bois brut à tous les niveaux en Phase 1 ; les paliers suivants arrivent en Phase 2. */
export const ENCLOSURE_TIERS: EnclosureTier[] = [
  { level: 1, fenceTop: '#b07b3f', fenceSide: '#8a5a28', sandTop: '#ecd9ad' },
];

export const HORSE_TIERS: HorseTier[] = [
  {
    level: 1,
    coatTop: '#a5713f',
    coatSide: '#8a5a2e',
    hasHarness: false,
    hasOrnaments: false,
  },
];

export const FIELD_TIERS: FieldTier[] = [{ level: 1, rows: 3, hasScarecrow: false }];

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
