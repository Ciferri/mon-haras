import { HORSE, WATER } from '../data/balance';
import type { GameState } from '../world/state';
import type { GameEvent } from './events';

/**
 * Le cheval mâche sa paille au fil du temps et éjecte des pièces au sol.
 * S'il a de l'eau en réserve, il mâche plus vite et consomme l'eau en même
 * temps que la paille (bonus optionnel, voir docs/DECISIONS.md).
 */
export function updateProduce(state: GameState, dt: number): GameEvent[] {
  const events: GameEvent[] = [];
  for (const h of state.horses) {
    if (!h.unlocked) continue;
    if (h.feed > 0 && state.coins.length < HORSE.maxCoinsOnScreen) {
      h.chew += dt;
      const baseNeed = Math.max(
        HORSE.chewFloor,
        HORSE.chewBase - HORSE.chewReductionPerLevel * (h.lvl - 1),
      );
      const need = h.water > 0 ? baseNeed * WATER.chewSpeedMultiplier : baseNeed;
      if (h.chew >= need) {
        h.chew = 0;
        h.feed--;
        if (h.water > 0) h.water--;
        for (let i = 0; i < HORSE.coinsPerChew; i++) {
          state.coins.push({
            x: h.x - 40 + Math.random() * 80,
            z: h.z + 62 + Math.random() * 54,
            y: 34,
            vy: 90 + Math.random() * 70,
            val: h.lvl,
            age: Math.random() * 6,
            mag: false,
          });
        }
        events.push({ type: 'coinsEjected', x: h.x, z: h.z, count: HORSE.coinsPerChew });
      }
    } else if (h.feed <= 0) {
      h.chew = 0;
    }
  }
  return events;
}
