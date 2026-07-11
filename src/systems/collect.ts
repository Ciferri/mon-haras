import { TUTORIAL_STEPS } from '../data/balance';
import { updateCoins } from '../world/coin';
import type { GameState } from '../world/state';
import type { GameEvent } from './events';

/** Physique des pièces (gravité, rebond, magnétisme) puis conversion en or à la collecte. */
export function updateCoinCollection(state: GameState, dt: number): GameEvent[] {
  const events: GameEvent[] = [];
  const collected = updateCoins(state.coins, dt, state.player.x, state.player.z);
  for (const c of collected) {
    const value = c.val * state.adMult;
    state.gold += value;
    events.push({ type: 'coinCollected', value, x: state.player.x, z: state.player.z });
    if (state.tuto === TUTORIAL_STEPS.collect) {
      state.tuto = TUTORIAL_STEPS.spend;
      events.push({ type: 'tutoAdvanced', step: state.tuto });
    }
  }
  return events;
}
