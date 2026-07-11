import { HARVEST } from '../data/balance';
import { drawBox, drawShadow } from '../engine/draw';
import type { Plant } from './types';

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
  drawBox(
    ctx,
    p.x,
    p.z,
    0,
    12 * Math.max(0.5, g),
    9,
    4 + 13 * g,
    grown ? '#f6cf5a' : '#a9c95e',
    grown ? '#d9a83c' : '#86a944',
    3,
  );
  if (grown) drawBox(ctx, p.x, p.z, 7, 13, 10, 3, '#b3812a', '#96691f', 2);
}
