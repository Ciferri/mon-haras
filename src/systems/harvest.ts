import { HARVEST, TUTORIAL_STEPS } from '../data/balance';
import type { GameState } from '../world/state';
import type { Plant } from '../world/types';
import type { GameEvent } from './events';

const dist = (ax: number, az: number, bx: number, bz: number): number =>
  Math.hypot(ax - bx, az - bz);

export function updateHarvest(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  const player = state.player;
  if (player.stack < player.max && player.hCd <= 0) {
    let best: Plant | null = null;
    let bd = HARVEST.radius;
    for (const p of state.plants) {
      if (p.g < 1) continue;
      const d = dist(player.x, player.z, p.x, p.z);
      if (d < bd) {
        bd = d;
        best = p;
      }
    }
    if (best) {
      best.g = 0;
      player.stack++;
      player.hCd = HARVEST.cooldown;
      state.flyers.push({ x: best.x, z: best.z, y: 10, t: 0, type: 'hay' });
      events.push({ type: 'harvested' });
      if (state.tuto === TUTORIAL_STEPS.harvest) {
        state.tuto = TUTORIAL_STEPS.feed;
        events.push({ type: 'tutoAdvanced', step: state.tuto });
      }
    }
  }
  return events;
}
