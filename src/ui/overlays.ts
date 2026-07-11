import { AD } from '../data/balance';
import type { AdsProvider } from '../monetization/ads';

/** Overlay de publicité simulée avec décompte 3-2-1, façon prototype. */
export function showAdCountdownOverlay(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    const ov = document.getElementById('adOv');
    const cd = document.getElementById('adCd');
    if (!ov || !cd) {
      resolve();
      return;
    }
    ov.classList.add('open');
    let n = seconds;
    cd.textContent = String(n);
    const iv = window.setInterval(() => {
      n--;
      if (n > 0) {
        cd.textContent = String(n);
      } else {
        window.clearInterval(iv);
        ov.classList.remove('open');
        resolve();
      }
    }, 800);
  });
}

/**
 * Affiche l'écran de collecte des gains hors ligne, avec une option pour les
 * doubler via publicité récompensée. Résout avec l'or final à créditer.
 */
export function showOfflineGainsOverlay(baseGold: number, ads: AdsProvider): Promise<number> {
  return new Promise((resolve) => {
    const ov = document.getElementById('offlineOv');
    const goldEl = document.getElementById('offlineGold');
    const adBtn = document.getElementById('offlineAdBtn');
    const closeBtn = document.getElementById('offlineCloseBtn');
    if (!ov || !goldEl || !adBtn || !closeBtn) {
      resolve(baseGold);
      return;
    }
    let finalGold = baseGold;
    goldEl.textContent = String(Math.floor(finalGold));
    ov.classList.add('open');

    const cleanup = (amount: number): void => {
      ov.classList.remove('open');
      adBtn.removeEventListener('click', onAd);
      closeBtn.removeEventListener('click', onClose);
      resolve(amount);
    };
    const onClose = (): void => cleanup(finalGold);
    const onAd = (): void => {
      adBtn.setAttribute('disabled', 'true');
      void ads.showRewarded().then((watched) => {
        if (watched) {
          finalGold = baseGold * AD.multiplier;
          goldEl.textContent = String(Math.floor(finalGold));
        }
        cleanup(finalGold);
      });
    };
    adBtn.addEventListener('click', onAd);
    closeBtn.addEventListener('click', onClose);
  });
}
