import { TUTORIAL_STEPS } from '../data/balance';
import { TUTORIAL_TEXT } from '../systems/tuto';

export function initTutorialText(step: number): void {
  const el = document.getElementById('tuto');
  if (!el) return;
  if (step === TUTORIAL_STEPS.done) {
    el.classList.add('hide');
    return;
  }
  el.textContent = TUTORIAL_TEXT[step] ?? '';
}

export function updateTutorialText(step: number): void {
  const el = document.getElementById('tuto');
  if (!el) return;
  if (step === TUTORIAL_STEPS.done) {
    el.classList.add('hide');
    return;
  }
  const text = TUTORIAL_TEXT[step];
  if (text) el.textContent = text;
}
