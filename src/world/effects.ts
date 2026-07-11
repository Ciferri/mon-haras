import { cam, proj } from '../engine/camera';
import { roundRect } from '../engine/draw';
import type { Flyer, Particle, Popup } from './types';

export function burst(parts: Particle[], x: number, z: number, n: number, c?: string): void {
  const palette = ['#ffd23f', '#8fd45f', '#ff8b5e', '#7fc7ff'];
  for (let i = 0; i < n; i++) {
    parts.push({
      x,
      z,
      y: 14,
      vx: (Math.random() - 0.5) * 160,
      vz: (Math.random() - 0.5) * 120,
      vy: 120 + Math.random() * 140,
      t: 0.9 + Math.random() * 0.4,
      c: c || palette[i % palette.length]!,
    });
  }
}

export function popText(
  pops: Popup[],
  x: number,
  z: number,
  y: number,
  txt: string,
  c = '#fff',
): void {
  pops.push({ x, z, y, t: 1, txt, c });
}

export function updateFlyers(flyers: Flyer[], dt: number): void {
  for (let i = flyers.length - 1; i >= 0; i--) {
    const f = flyers[i]!;
    f.t += dt * 3.2;
    if (f.t >= 1) flyers.splice(i, 1);
  }
}

export function updateParticles(parts: Particle[], dt: number): void {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]!;
    p.t -= dt;
    p.x += p.vx * dt;
    p.z += p.vz * dt;
    p.vy -= 420 * dt;
    p.y += p.vy * dt;
    if (p.y < 0) {
      p.y = 0;
      p.vy *= -0.4;
    }
    if (p.t <= 0) parts.splice(i, 1);
  }
}

export function updatePopups(pops: Popup[], dt: number): void {
  for (let i = pops.length - 1; i >= 0; i--) {
    const p = pops[i]!;
    p.t -= dt * 1.1;
    p.y += 46 * dt;
    if (p.t <= 0) pops.splice(i, 1);
  }
}

function hayIcon(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const s = cam.s;
  ctx.fillStyle = '#f6cf5a';
  roundRect(ctx, x - 9 * s, y - 4 * s, 18 * s, 9 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = '#b3812a';
  ctx.fillRect(x - 9 * s, y - 1 * s, 18 * s, 2 * s);
}

export function drawFlyers(
  ctx: CanvasRenderingContext2D,
  flyers: Flyer[],
  playerX: number,
  playerZ: number,
): void {
  const s = cam.s;
  for (const f of flyers) {
    const e = f.t * f.t * (3 - 2 * f.t);
    if (f.type === 'hay') {
      const p1 = proj(f.x, f.z, f.y);
      const p2 = proj(playerX, playerZ, 50);
      hayIcon(
        ctx,
        p1.x + (p2.x - p1.x) * e,
        p1.y + (p2.y - p1.y) * e - Math.sin(e * Math.PI) * 30 * s,
      );
    } else if (f.type === 'hay2') {
      const p1 = proj(f.x, f.z, f.y);
      const p2 = proj(f.tx, f.tz, 14);
      hayIcon(
        ctx,
        p1.x + (p2.x - p1.x) * e,
        p1.y + (p2.y - p1.y) * e - Math.sin(e * Math.PI) * 36 * s,
      );
    } else {
      const p2 = proj(f.tx, f.tz, 4);
      const x = f.sx + (p2.x - f.sx) * e;
      const y = f.sy + (p2.y - f.sy) * e;
      ctx.fillStyle = '#f7c526';
      ctx.strokeStyle = '#b57e0a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, parts: Particle[]): void {
  const s = cam.s;
  for (const p of parts) {
    const q = proj(p.x, p.z, p.y);
    ctx.fillStyle = p.c;
    ctx.globalAlpha = Math.min(1, p.t * 2);
    ctx.fillRect(q.x - 3 * s, q.y - 3 * s, 6 * s, 6 * s);
    ctx.globalAlpha = 1;
  }
}

export function drawPopups(ctx: CanvasRenderingContext2D, pops: Popup[]): void {
  const s = cam.s;
  ctx.textAlign = 'center';
  for (const p of pops) {
    const q = proj(p.x, p.z, p.y);
    ctx.globalAlpha = Math.min(1, p.t * 1.6);
    ctx.font = '800 ' + 17 * s + 'px Nunito,Arial';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(30,25,15,.7)';
    ctx.lineJoin = 'round';
    ctx.strokeText(p.txt, q.x, q.y);
    ctx.fillStyle = p.c;
    ctx.fillText(p.txt, q.x, q.y);
    ctx.globalAlpha = 1;
  }
}
