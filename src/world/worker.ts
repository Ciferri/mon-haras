import { EMPLOYEE } from '../data/balance';
import { drawBox, drawShadow } from '../engine/draw';
import type { Worker } from './types';

export function createWorker(): Worker {
  return { x: EMPLOYEE.hireX, z: EMPLOYEE.hireZ, dir: 1, carrying: false, walk: 0 };
}

/** Employé automatique : mêmes proportions que le joueur, tenue distincte. */
export function drawWorker(ctx: CanvasRenderingContext2D, w: Worker): void {
  const bob = Math.abs(Math.sin(w.walk)) * 2;
  const sw = Math.sin(w.walk) * 3.5;
  const D = w.dir;
  drawShadow(ctx, w.x, w.z, 15);
  drawBox(ctx, w.x - 5, w.z, 0, 6, 6, 11 + sw, '#3c5c3a', '#2c4a2a', 2);
  drawBox(ctx, w.x + 5, w.z, 0, 6, 6, 11 - sw, '#3c5c3a', '#2c4a2a', 2);
  drawBox(ctx, w.x, w.z, 10 + bob, 17, 11, 15, '#6b8f4e', '#52713a', 5);
  drawBox(ctx, w.x - 11, w.z, 13 + bob, 5, 5, 10, '#6b8f4e', '#52713a', 2);
  drawBox(ctx, w.x + 11, w.z, 13 + bob, 5, 5, 10, '#6b8f4e', '#52713a', 2);
  drawBox(ctx, w.x, w.z, 25 + bob, 13, 11, 11, '#f2c9a0', '#d6a87d', 4);
  drawBox(ctx, w.x, w.z, 35 + bob, 17, 16, 3, '#d9a83c', '#b3812a', 7);
  drawBox(ctx, w.x + 5 * D, w.z + 3, 35 + bob, 9, 7, 2.5, '#d9a83c', '#b3812a', 2);
  if (w.carrying) {
    drawBox(ctx, w.x, w.z, 41 + bob, 18, 13, 6.4, '#f6cf5a', '#d9a83c', 3);
  }
}
