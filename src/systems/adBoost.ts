import type { GameState } from '../world/state';
import type { GameEvent } from './events';

/** Fait décompter le boost publicitaire ×2 et le désactive à expiration. */
export function updateAdBoost(state: GameState, dt: number): GameEvent[] {
  if (state.adLeft <= 0) return [];
  state.adLeft -= dt;
  if (state.adLeft <= 0) {
    state.adLeft = 0;
    state.adMult = 1;
    return [{ type: 'adBoostEnded' }];
  }
  return [];
}
