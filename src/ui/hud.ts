import { AD } from '../data/balance';
import type { AdsProvider } from '../monetization/ads';
import type { GameState } from '../world/state';

let lastGold = -1;

export function refreshGoldHud(state: GameState): void {
  const g = Math.floor(state.gold);
  if (g === lastGold) return;
  lastGold = g;
  const txt = document.getElementById('goldTxt');
  const pill = document.getElementById('goldPill');
  if (txt) txt.textContent = String(g);
  if (pill) {
    pill.classList.remove('bump');
    void pill.offsetWidth;
    pill.classList.add('bump');
  }
}

export function updateAdButton(state: GameState): void {
  const b = document.getElementById('adBtn');
  if (!b) return;
  if (state.adLeft > 0) {
    b.classList.add('boost');
    b.classList.remove('off');
    b.innerHTML = '⚡ ×2<br>' + Math.ceil(state.adLeft) + ' s';
  } else {
    b.classList.remove('boost');
    b.innerHTML = '📺 Pub<br>gains ×2';
  }
}

/** Câble le bouton de publicité récompensée : lance le boost ×2 si la pub est vue. */
export function setupAdButton(
  state: GameState,
  ads: AdsProvider,
  onBoostStarted: () => void,
): void {
  const b = document.getElementById('adBtn');
  if (!b) return;
  b.addEventListener('click', () => {
    if (state.adLeft > 0) return;
    void ads.showRewarded().then((watched) => {
      if (!watched) return;
      state.adMult = AD.multiplier;
      state.adLeft = AD.boostDuration;
      onBoostStarted();
    });
  });
}
