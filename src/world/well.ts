import { WATER } from '../data/balance';
import { drawBox, drawShadow } from '../engine/draw';

/** Puits fixe où le joueur remplit sa réserve d'eau (ressource de la Phase 2). */
export function drawWell(ctx: CanvasRenderingContext2D): void {
  const { wellX: x, wellZ: z } = WATER;
  drawShadow(ctx, x, z, 30);
  drawBox(ctx, x, z, 0, 54, 54, 8, '#9a8b74', '#7c6f5a', 6);
  drawBox(ctx, x, z, 8, 40, 40, 22, '#7d93a8', '#5f7488', 8);
  drawBox(ctx, x, z, 30, 44, 44, 4, '#5b6b78', '#44525c', 6);
  drawBox(ctx, x - 18, z, 30, 5, 5, 26, '#8a5a2e', '#6e4522', 2);
  drawBox(ctx, x + 18, z, 30, 5, 5, 26, '#8a5a2e', '#6e4522', 2);
  drawBox(ctx, x, z, 56, 50, 36, 6, '#b0462e', '#8a351f', 6);
}
