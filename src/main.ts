import './style.css';
import { ensureViewportSize } from './engine/viewport';
import { setupInput } from './input/joystick';
import { setupErrorBanner } from './ui/errorBanner';
import { refreshGoldHud, setupAdButton, updateAdButton } from './ui/hud';
import { initTutorialText } from './ui/tutorial';
import { showAdCountdownOverlay, showOfflineGainsOverlay } from './ui/overlays';
import { presentEvents } from './ui/presentation';
import { SimulatedAdsProvider } from './monetization/simulatedAdsProvider';
import { createInitialState } from './world/state';
import { computeOfflineGains } from './systems/offline';
import { loadRawSave, applySave, saveGame } from './systems/save';
import { SAVE } from './data/balance';
import { updateGame } from './game';
import { render } from './render';

setupErrorBanner();

const canvas = document.getElementById('cv') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Contexte 2D indisponible');

const ads = new SimulatedAdsProvider(showAdCountdownOverlay);
const state = createInitialState();

const rawSave = loadRawSave();
let offlineElapsedSeconds = 0;
if (rawSave) {
  applySave(state, rawSave);
  offlineElapsedSeconds = Math.max(0, (Date.now() - rawSave.savedAt) / 1000);
}

if (import.meta.env.DEV) {
  (window as unknown as { __debugState?: unknown }).__debugState = state;
}

initTutorialText(state.tuto);
setupInput();
setupAdButton(state, ads, () => presentEvents(state, [{ type: 'adBoostStarted' }]));

async function boot(): Promise<void> {
  if (offlineElapsedSeconds > 5) {
    const offline = computeOfflineGains(state.horses, offlineElapsedSeconds);
    if (offline.gold > 0) {
      const credited = await showOfflineGainsOverlay(offline.gold, ads);
      state.gold += credited;
    }
  }
  startLoop();
}

function startLoop(): void {
  let last = 0;
  let saveAccum = 0;

  function loop(t: number): void {
    ensureViewportSize(canvas, ctx!);
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;

    const events = updateGame(state, dt);
    presentEvents(state, events);
    render(ctx!, state);
    refreshGoldHud(state);
    updateAdButton(state);

    saveAccum += dt;
    if (saveAccum >= SAVE.autosaveInterval) {
      saveAccum = 0;
      saveGame(state);
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') saveGame(state);
});
window.addEventListener('beforeunload', () => saveGame(state));

void boot();
