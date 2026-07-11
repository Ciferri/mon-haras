import { updateCamera } from './engine/camera';
import { readMoveVector } from './input/joystick';
import { updatePlayerMovement } from './world/player';
import { updateHorseAnim } from './world/horse';
import { updatePlantsRegrowth } from './world/plant';
import { updateFlyers, updateParticles, updatePopups } from './world/effects';
import { updateHarvest } from './systems/harvest';
import { updateDeliver } from './systems/deliver';
import { updateProduce } from './systems/produce';
import { updateCoinCollection } from './systems/collect';
import { updateBuyZones } from './systems/buyzones';
import { updateAdBoost } from './systems/adBoost';
import { updateTutoMoveTrigger } from './systems/tuto';
import type { GameState } from './world/state';
import type { GameEvent } from './systems/events';

/** Exécute un pas de simulation complet et renvoie les événements survenus, pour la présentation. */
export function updateGame(state: GameState, dt: number): GameEvent[] {
  const { ux, uy } = readMoveVector();
  updatePlayerMovement(state.player, dt, ux, uy);

  const events: GameEvent[] = [
    ...updateTutoMoveTrigger(state),
    ...updateHarvest(state),
    ...updateDeliver(state),
    ...updateProduce(state, dt),
    ...updateCoinCollection(state, dt),
    ...updateBuyZones(state, dt),
    ...updateAdBoost(state, dt),
  ];

  updatePlantsRegrowth(state.plants, dt);
  for (const h of state.horses) updateHorseAnim(h, dt);
  updateFlyers(state.flyers, dt);
  updateParticles(state.parts, dt);
  updatePopups(state.pops, dt);
  updateCamera(dt, state.player.x, state.player.z);

  return events;
}
