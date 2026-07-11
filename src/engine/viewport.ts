import { CAMERA } from '../data/balance';

export interface Viewport {
  w: number;
  h: number;
  dpr: number;
}

export const viewport: Viewport = { w: 0, h: 0, dpr: 1 };

/**
 * Re-mesure la taille d'écran à chaque appel (donc à chaque frame).
 * Protège contre un canvas de taille zéro au chargement (avant que le
 * layout ne soit stabilisé) en réappliquant la taille tant qu'elle diffère.
 */
export function ensureViewportSize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  const dpr = Math.min(window.devicePixelRatio || 1, CAMERA.maxDPR);
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w === viewport.w && h === viewport.h && dpr === viewport.dpr && canvas.width > 0) {
    return;
  }
  viewport.w = w;
  viewport.h = h;
  viewport.dpr = dpr;
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
