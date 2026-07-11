import { cam, proj } from './camera';
import { CAMERA } from '../data/balance';

/** Rectangle aux coins arrondis, tracé dans le chemin courant du contexte. */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/**
 * Dessine un pavé pseudo-3D (empilement de boîtes) : une face dessus et une
 * face devant, projetées à partir d'une position monde (x,z,y).
 */
export function drawBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  z: number,
  y: number,
  w: number,
  d: number,
  h: number,
  top: string,
  side: string,
  r = 3,
): void {
  const s = cam.s;
  const px = proj(x, z).x;
  const tb = proj(x, z - d / 2, y + h).y;
  const tf = proj(x, z + d / 2, y + h).y;
  const bf = proj(x, z + d / 2, y).y;
  ctx.fillStyle = side;
  roundRect(ctx, px - (w / 2) * s, tf, w * s, bf - tf, r * s);
  ctx.fill();
  ctx.fillStyle = top;
  roundRect(ctx, px - (w / 2) * s, tb, w * s, tf - tb, r * s);
  ctx.fill();
}

/** Ombre elliptique projetée au sol sous une entité. */
export function drawShadow(ctx: CanvasRenderingContext2D, x: number, z: number, rx: number): void {
  const p = proj(x, z, 0);
  const s = cam.s;
  ctx.fillStyle = 'rgba(40,60,25,.22)';
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, rx * s, rx * CAMERA.kz * s, 0, 0, Math.PI * 2);
  ctx.fill();
}
