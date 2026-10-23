import { HARVEST } from '../data/balance';
import { drawBox, drawShadow } from '../engine/draw';
import { cam, proj } from '../engine/camera';
import { loadSprite } from '../engine/sprites';
import strawSpriteUrl from '../assets/sprites/straw.png';
import type { Plant } from './types';

const strawSprite = loadSprite(strawSpriteUrl);

export function updatePlantsRegrowth(plants: Plant[], dt: number): void {
  for (const p of plants) {
    if (p.g < 1) p.g = Math.min(1, p.g + dt / HARVEST.regrowTime);
  }
}

export function drawPlant(ctx: CanvasRenderingContext2D, p: Plant): void {
  if (p.g <= 0.05) return;
  const g = p.g;
  const grown = g >= 1;
  drawShadow(ctx, p.x, p.z, 7 * g);
  if (grown && strawSprite.complete && strawSprite.naturalWidth > 0) {
    const ground = proj(p.x, p.z, 0);
    const s = cam.s;
    const aspect = strawSprite.naturalWidth / strawSprite.naturalHeight;
    const h = HARVEST.spriteHeight * s;
    const w = h * aspect;
    ctx.drawImage(strawSprite, ground.x - w / 2, ground.y - h, w, h);
    return;
  }
  drawBox(ctx, p.x, p.z, 0, 12 * Math.max(0.5, g), 9, 4 + 13 * g, '#a9c95e', '#86a944', 3);
}
