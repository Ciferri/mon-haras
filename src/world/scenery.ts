import { cam, proj } from '../engine/camera';
import { drawBox, drawShadow, roundRect } from '../engine/draw';
import { CAMERA } from '../data/balance';
import { viewport } from '../engine/viewport';
import type { Flower } from './layout';
import { FIELD } from './layout';

export function drawTree(ctx: CanvasRenderingContext2D, x: number, z: number, i: number): void {
  drawShadow(ctx, x, z + 4, 22);
  drawBox(ctx, x, z, 0, 10, 10, 12, '#9b6b3a', '#7c4f26', 3);
  const g1 = i % 2 ? '#4e9e3c' : '#57aa42';
  const g2 = i % 2 ? '#63b64d' : '#6cc054';
  drawBox(ctx, x, z, 10, 42, 40, 26, g2, g1, 12);
  drawBox(ctx, x, z - 4, 34, 28, 26, 18, '#7ccb60', g2, 10);
}

export function drawGround(ctx: CanvasRenderingContext2D): void {
  const s = cam.s;
  const W = viewport.w;
  const H = viewport.h;
  ctx.fillStyle = '#79c14e';
  ctx.fillRect(0, 0, W, H);
  const T = 46;
  const x0 = Math.floor((cam.x - W / (2 * s)) / T) - 1;
  const x1 = Math.ceil((cam.x + W / (2 * s)) / T) + 1;
  const z0 = Math.floor((cam.z - H / (2 * CAMERA.kz * s)) / T) - 1;
  const z1 = Math.ceil((cam.z + H / (2 * CAMERA.kz * s)) / T) + 1;
  ctx.fillStyle = '#80c855';
  for (let gx = x0; gx <= x1; gx++) {
    for (let gz = z0; gz <= z1; gz++) {
      if ((gx + gz) % 2) continue;
      const a = proj(gx * T, gz * T);
      const b = proj((gx + 1) * T, (gz + 1) * T);
      ctx.fillRect(a.x, a.y, b.x - a.x + 0.5, b.y - a.y + 0.5);
    }
  }
}

export function drawFlowers(ctx: CanvasRenderingContext2D, flowers: Flower[]): void {
  const s = cam.s;
  for (const f of flowers) {
    const p = proj(f.x, f.z);
    ctx.fillStyle = ['#fff', '#ffe08a', '#ffb3c8'][f.c]!;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.1 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawFieldPlot(ctx: CanvasRenderingContext2D): void {
  const s = cam.s;
  const fa = proj(FIELD.x - FIELD.w / 2, FIELD.z - FIELD.d / 2);
  const fb = proj(FIELD.x + FIELD.w / 2, FIELD.z + FIELD.d / 2);
  ctx.fillStyle = '#d9b46a';
  roundRect(ctx, fa.x, fa.y, fb.x - fa.x, fb.y - fa.y, 14 * s);
  ctx.fill();
  ctx.fillStyle = '#cba158';
  for (let i = 0; i < FIELD.rows; i++) {
    const ra = proj(FIELD.x - FIELD.w / 2 + 14, FIELD.z - 62 + i * 62 - 9);
    const rb = proj(FIELD.x + FIELD.w / 2 - 14, FIELD.z - 62 + i * 62 + 9);
    roundRect(ctx, ra.x, ra.y, rb.x - ra.x, rb.y - ra.y, 8 * s);
    ctx.fill();
  }
}

export function drawEnclosureSand(ctx: CanvasRenderingContext2D, x: number, z: number): void {
  const s = cam.s;
  const a = proj(x - 72, z - 64);
  const b = proj(x + 72, z + 52);
  ctx.fillStyle = '#ecd9ad';
  roundRect(ctx, a.x, a.y, b.x - a.x, b.y - a.y, 16 * s);
  ctx.fill();
}
