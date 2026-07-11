import { HORSE, OFFLINE } from '../data/balance';
import type { Horse } from '../world/types';

export interface OfflineResult {
  /** Temps hors ligne effectivement pris en compte (plafonné). */
  seconds: number;
  /** Or produit pendant l'absence, avant tout multiplicateur publicitaire. */
  gold: number;
}

/**
 * Estime la production hors ligne : seuls les chevaux déjà nourris avant le
 * départ continuent de mâcher leur réserve de paille et de produire de l'or,
 * jusqu'à épuisement du stock ou du plafond de temps pris en compte.
 */
export function computeOfflineGains(horses: Horse[], elapsedSeconds: number): OfflineResult {
  const capped = Math.max(0, Math.min(elapsedSeconds, OFFLINE.capSeconds));
  let totalGold = 0;
  for (const h of horses) {
    if (!h.unlocked || h.feed <= 0) continue;
    const need = Math.max(
      HORSE.chewFloor,
      HORSE.chewBase - HORSE.chewReductionPerLevel * (h.lvl - 1),
    );
    let clock = capped + h.chew;
    let feed = h.feed;
    while (feed > 0 && clock >= need) {
      clock -= need;
      feed--;
      totalGold += HORSE.coinsPerChew * h.lvl;
    }
    h.feed = feed;
    h.chew = feed > 0 ? clock : 0;
  }
  return { seconds: capped, gold: totalGold };
}
