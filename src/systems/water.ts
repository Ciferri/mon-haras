import { WATER } from '../data/balance';
import { troughOf } from '../world/layout';
import type { GameState } from '../world/state';
import type { GameEvent } from './events';

const dist = (ax: number, az: number, bx: number, bz: number): number =>
  Math.hypot(ax - bx, az - bz);

/** Le joueur remplit sa réserve d'eau en restant près du puits. */
export function updateWaterFill(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  const player = state.player;
  if (player.waterStack < player.maxWaterStack && player.wCd <= 0) {
    if (dist(player.x, player.z, WATER.wellX, WATER.wellZ) < WATER.wellRadius) {
      player.waterStack++;
      player.wCd = WATER.fillCooldown;
      state.flyers.push({ x: WATER.wellX, z: WATER.wellZ, y: 10, t: 0, type: 'water' });
      events.push({ type: 'waterCollected' });
    }
  }
  return events;
}

/** Le joueur verse de l'eau dans l'abreuvoir d'un cheval débloqué, s'il en transporte. */
export function updateWaterDeliver(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  const player = state.player;
  state.horses.forEach((h, i) => {
    if (!h.unlocked) return;
    const t = troughOf(h);
    if (
      player.waterStack > 0 &&
      h.water < h.maxWater &&
      player.wdCd <= 0 &&
      dist(player.x, player.z, t.x, t.z) < WATER.troughRadius
    ) {
      player.waterStack--;
      h.water++;
      player.wdCd = WATER.fillCooldown * 0.5;
      state.flyers.push({
        x: player.x,
        z: player.z,
        y: 46,
        t: 0,
        type: 'water2',
        tx: t.x,
        tz: t.z,
      });
      events.push({ type: 'waterDelivered', horseIndex: i });
    }
  });
  return events;
}
