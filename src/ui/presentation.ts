import { buzz } from './haptics';
import { toast } from './toast';
import { updateTutorialText } from './tutorial';
import { burst, popText } from '../world/effects';
import type { GameState } from '../world/state';
import type { GameEvent } from '../systems/events';

/** Traduit les événements de gameplay en effets sensibles : toasts, vibrations, particules. */
export function presentEvents(state: GameState, events: GameEvent[]): void {
  for (const ev of events) {
    switch (ev.type) {
      case 'harvested':
        buzz(8);
        break;
      case 'coinCollected':
        popText(state.pops, ev.x, ev.z, 64, '+' + ev.value, state.adMult > 1 ? '#ffd23f' : '#fff');
        buzz(6);
        break;
      case 'horseUpgraded':
        burst(state.parts, ev.x, ev.z, 26, '#ffd23f');
        toast('⬆️ Cheval niveau ' + ev.level + ' : pièces de ' + ev.level + ' or !');
        break;
      case 'horseUnlocked':
        burst(state.parts, ev.x, ev.z, 20);
        buzz([15, 30, 15]);
        toast('🐴 Un nouveau cheval rejoint le haras !');
        break;
      case 'tutoAdvanced':
        updateTutorialText(ev.step);
        break;
      case 'adBoostStarted':
        toast('📺 Gains ×2 pendant 30 s !');
        buzz(20);
        break;
      case 'adBoostEnded':
        toast('Le bonus ×2 est terminé');
        break;
      case 'delivered':
      case 'coinsEjected':
        break;
    }
  }
}
