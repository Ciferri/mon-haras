import { DELIVERY, TUTORIAL_STEPS } from '../data/balance';
import { feederOf } from '../world/layout';
import type { GameState } from '../world/state';
import type { GameEvent } from './events';

const dist = (ax: number, az: number, bx: number, bz: number): number =>
  Math.hypot(ax - bx, az - bz);

export function updateDeliver(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  const player = state.player;
  state.horses.forEach((h, i) => {
    if (!h.unlocked) return;
    const f = feederOf(h);
    if (
      player.stack > 0 &&
      h.feed < h.maxFeed &&
      player.dCd <= 0 &&
      dist(player.x, player.z, f.x, f.z) < DELIVERY.radius
    ) {
      player.stack--;
      h.feed++;
      player.dCd = DELIVERY.cooldown;
      state.flyers.push({ x: player.x, z: player.z, y: 46, t: 0, type: 'hay2', tx: f.x, tz: f.z });
      events.push({ type: 'delivered', horseIndex: i });
      if (state.tuto === TUTORIAL_STEPS.feed) {
        state.tuto = TUTORIAL_STEPS.collect;
        events.push({ type: 'tutoAdvanced', step: state.tuto });
      }
    }
  });
  return events;
}
