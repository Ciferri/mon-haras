import { AD } from '../data/balance';
import type { AdsProvider } from './ads';

/**
 * Fournisseur de publicité simulé : affiche un décompte factice via la
 * fonction fournie par la couche UI, puis résout toujours à `true`.
 * À remplacer en Phase 4 par un fournisseur AdMob réel derrière la même interface.
 */
export class SimulatedAdsProvider implements AdsProvider {
  constructor(private readonly showCountdown: (seconds: number) => Promise<void>) {}

  async showRewarded(): Promise<boolean> {
    await this.showCountdown(AD.simulatedWatchSeconds);
    return true;
  }
}
