import { HORSE, WATER } from '../data/balance';
import { drawBox, drawShadow, roundRect } from '../engine/draw';
import { cam, proj } from '../engine/camera';
import { feederOf, troughOf } from './layout';
import { horseTierFor } from '../data/tiers';
import { loadSprite } from '../engine/sprites';
import horseSpriteUrl from '../assets/sprites/horse.png';
import type { Horse } from './types';

const horseSprite = loadSprite(horseSpriteUrl);

export function createHorse(x: number, z: number, dir: 1 | -1, unlocked: boolean): Horse {
  return {
    x,
    z,
    dir,
    lvl: 1,
    feed: 0,
    maxFeed: HORSE.maxFeed,
    chew: 0,
    unlocked,
    pop: unlocked ? 0 : 0,
    bob: Math.random() * 9,
    water: 0,
    maxWater: WATER.maxInHorse,
  };
}

/** Anime le cheval (mastication, apparition, balancement) ; ne gère pas la production d'or. */
export function updateHorseAnim(h: Horse, dt: number): void {
  if (h.pop > 0) h.pop = Math.max(0, h.pop - dt * HORSE.popDecaySpeed);
  h.bob += dt;
}

export function drawFeeder(ctx: CanvasRenderingContext2D, h: Horse): void {
  const f = feederOf(h);
  drawShadow(ctx, f.x, f.z, 24);
  drawBox(ctx, f.x, f.z, 0, 52, 22, 11, '#b07b3f', '#8a5a28', 4);
  if (h.feed > 0) drawBox(ctx, f.x, f.z, 10, 42, 15, 5, '#f6cf5a', '#d9a83c', 3);
  const p = proj(f.x, f.z, 26);
  const s = cam.s;
  const w = 54 * s;
  ctx.fillStyle = 'rgba(30,25,15,.4)';
  roundRect(ctx, p.x - w / 2, p.y, w, 7 * s, 4 * s);
  ctx.fill();
  ctx.fillStyle = '#ffd23f';
  roundRect(ctx, p.x - w / 2 + 1.5, p.y + 1.5, (w - 3) * (h.feed / h.maxFeed), 7 * s - 3, 3 * s);
  ctx.fill();
}

export function drawTrough(ctx: CanvasRenderingContext2D, h: Horse): void {
  const t = troughOf(h);
  drawShadow(ctx, t.x, t.z, 15);
  drawBox(ctx, t.x, t.z, 0, 30, 20, 9, '#7d93a8', '#5f7488', 4);
  if (h.water > 0) drawBox(ctx, t.x, t.z, 9, 24, 14, 4, '#5fb6e0', '#3f93c0', 3);
  const p = proj(t.x, t.z, 20);
  const s = cam.s;
  const w = 36 * s;
  ctx.fillStyle = 'rgba(30,25,15,.4)';
  roundRect(ctx, p.x - w / 2, p.y, w, 6 * s, 3 * s);
  ctx.fill();
  ctx.fillStyle = '#5fb6e0';
  roundRect(
    ctx,
    p.x - w / 2 + 1.2,
    p.y + 1.2,
    (w - 2.4) * (h.water / h.maxWater),
    6 * s - 2.4,
    2.4 * s,
  );
  ctx.fill();
}

export function drawHorse(ctx: CanvasRenderingContext2D, h: Horse): void {
  const tier = horseTierFor(h.lvl);
  const yO = h.pop > 0 ? h.pop * h.pop * 140 : 0;
  const bob = Math.sin(h.bob * 2.2) * 1.4;
  drawShadow(ctx, h.x, h.z, 32);
  const ground = proj(h.x, h.z, 0);
  const sc = cam.s;
  if (horseSprite.complete && horseSprite.naturalWidth > 0) {
    const aspect = horseSprite.naturalWidth / horseSprite.naturalHeight;
    const hh = HORSE.spriteHeight * sc;
    const ww = hh * aspect;
    ctx.save();
    ctx.translate(ground.x, ground.y - (yO + bob * 0.4) * sc);
    ctx.scale(-h.dir, 1);
    ctx.drawImage(horseSprite, -ww / 2, -hh, ww, hh);
    ctx.restore();
  }
  if (tier.hasHarness) {
    drawBox(ctx, h.x, h.z, 24 + yO + bob * 0.4, 54, 5, 3, '#c0392b', '#962e21', 2);
  }
  const p = proj(h.x, h.z, 64 + yO);
  ctx.font = '800 ' + 12 * sc + 'px Nunito,Arial';
  ctx.textAlign = 'center';
  const t = 'Nv ' + h.lvl;
  const w = ctx.measureText(t).width + 16 * sc;
  ctx.fillStyle = 'rgba(30,25,15,.55)';
  roundRect(ctx, p.x - w / 2, p.y - 9 * sc, w, 18 * sc, 9 * sc);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(t, p.x, p.y + 4.5 * sc);
}
