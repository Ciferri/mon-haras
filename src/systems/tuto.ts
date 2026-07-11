import { TUTORIAL_STEPS } from '../data/balance';
import { FIELD, feederOf } from '../world/layout';
import type { GameState } from '../world/state';
import type { GameEvent } from './events';

export const TUTORIAL_TEXT: Record<number, string> = {
  [TUTORIAL_STEPS.move]: 'Maintiens et glisse pour te déplacer',
  [TUTORIAL_STEPS.harvest]: '🌾 Récolte la paille dans le champ',
  [TUTORIAL_STEPS.feed]: '🐴 Nourris le cheval (mangeoire)',
  [TUTORIAL_STEPS.collect]: '🪙 Ramasse les pièces d’or',
  [TUTORIAL_STEPS.spend]: '⭕ Reste sur un cercle pour dépenser ton or',
};

/** Déclenche le passage de l'étape 0 (déplacement) à 1 (récolte) dès le premier mouvement. */
export function updateTutoMoveTrigger(state: GameState): GameEvent[] {
  if (state.player.moving && state.tuto === TUTORIAL_STEPS.move) {
    state.tuto = TUTORIAL_STEPS.harvest;
    return [{ type: 'tutoAdvanced', step: state.tuto }];
  }
  return [];
}

/** Cible monde du marqueur flèche flottant, selon l'étape de tutoriel courante. */
export function getTutoMarkerTarget(state: GameState): { x: number; z: number } | null {
  switch (state.tuto) {
    case TUTORIAL_STEPS.harvest:
      return { x: FIELD.x, z: FIELD.z };
    case TUTORIAL_STEPS.feed:
      return feederOf(state.horses[0]!);
    case TUTORIAL_STEPS.collect:
      return state.coins[0] ? { x: state.coins[0].x, z: state.coins[0].z } : null;
    case TUTORIAL_STEPS.spend:
      return { x: state.buyZones[1]!.x, z: state.buyZones[1]!.z };
    default:
      return null;
  }
}
