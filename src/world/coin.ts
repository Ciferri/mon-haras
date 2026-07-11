import { COIN } from '../data/balance';
import { cam, proj } from '../engine/camera';
import { drawShadow } from '../engine/draw';
import type { Coin } from './types';

const dist = (ax: number, az: number, bx: number, bz: number): number =>
  Math.hypot(ax - bx, az - bz);

/**
 * Fait évoluer la physique des pièces (gravité, rebond, magnétisme vers le
 * joueur) et retire du tableau celles qui atteignent le rayon de collecte.
 * Renvoie les pièces collectées pendant cette frame.
 */
export function updateCoins(coins: Coin[], dt: number, playerX: number, playerZ: number): Coin[] {
  const collected: Coin[] = [];
  for (let i = coins.length - 1; i >= 0; i--) {
    const c = coins[i]!;
    c.age += dt;
    if (!c.mag) {
      c.vy -= COIN.gravity * dt;
      c.y += c.vy * dt;
      if (c.y < 0) {
        c.y = 0;
        c.vy = Math.abs(c.vy) > COIN.bounceThreshold ? -c.vy * COIN.bounceRestitution : 0;
      }
      if (dist(playerX, playerZ, c.x, c.z) < COIN.magnetRadius) c.mag = true;
    } else {
      const k = Math.min(1, COIN.magnetLerpSpeed * dt);
      c.x += (playerX - c.x) * k;
      c.z += (playerZ - c.z) * k;
      c.y += (30 - c.y) * k;
      if (dist(playerX, playerZ, c.x, c.z) < COIN.pickupRadius) {
        coins.splice(i, 1);
        collected.push(c);
      }
    }
  }
  return collected;
}

export function drawCoin(ctx: CanvasRenderingContext2D, c: Coin): void {
  drawShadow(ctx, c.x, c.z, 7);
  const p = proj(c.x, c.z, c.y + 7);
  const s = cam.s;
  const sq = Math.abs(Math.cos(c.age * 5));
  ctx.fillStyle = '#d9971a';
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, 8.5 * s * Math.max(0.25, sq), 8.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f7c526';
  ctx.beginPath();
  ctx.ellipse(p.x, p.y - 1.2 * s, 7.4 * s * Math.max(0.22, sq), 7.4 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  ctx.beginPath();
  ctx.ellipse(p.x - 2 * s * sq, p.y - 3 * s, 2 * s * sq, 1.6 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}
