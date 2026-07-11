import { HORSE } from '../data/balance';
import type { GameState } from '../world/state';
import type { GameEvent } from './events';

/** Le cheval mâche sa paille au fil du temps et éjecte des pièces au sol. */
export function updateProduce(state: GameState, dt: number): GameEvent[] {
  const events: GameEvent[] = [];
  for (const h of state.horses) {
    if (!h.unlocked) continue;
    if (h.feed > 0 && state.coins.length < HORSE.maxCoinsOnScreen) {
      h.chew += dt;
      const need = Math.max(
        HORSE.chewFloor,
        HORSE.chewBase - HORSE.chewReductionPerLevel * (h.lvl - 1),
      );
      if (h.chew >= need) {
        h.chew = 0;
        h.feed--;
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
