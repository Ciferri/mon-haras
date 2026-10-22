import { CAMERA, PLAYER, WATER, WORLD } from '../data/balance';
import { drawBox, drawShadow } from '../engine/draw';
import { cam, proj } from '../engine/camera';
import { loadSprite } from '../engine/sprites';
import playerSpriteUrl from '../assets/sprites/player.png';
import type { Player } from './types';

const playerSprite = loadSprite(playerSpriteUrl);

export function createPlayer(): Player {
  return {
    x: PLAYER.startX,
    z: PLAYER.startZ,
    face: 1,
    walk: 0,
    stack: 0,
    max: PLAYER.maxStack,
    waterStack: 0,
    maxWaterStack: WATER.maxCarry,
    leanX: 0,
    leanZ: 0,
    hCd: 0,
    dCd: 0,
    wCd: 0,
    wdCd: 0,
    moving: false,
  };
}

export function updatePlayerMovement(player: Player, dt: number, ux: number, uy: number): void {
  player.moving = Math.hypot(ux, uy) > PLAYER.movingThreshold;
  player.x += ux * PLAYER.speed * dt;
  player.z += uy * (PLAYER.speed / CAMERA.kz) * PLAYER.zSpeedFactor * dt;
  player.x = Math.max(PLAYER.boundsMarginX, Math.min(WORLD.w - PLAYER.boundsMarginX, player.x));
  player.z = Math.max(
    PLAYER.boundsMarginZTop,
    Math.min(WORLD.h - PLAYER.boundsMarginZBottom, player.z),
  );
  if (Math.abs(ux) > PLAYER.faceThreshold) player.face = ux > 0 ? 1 : -1;
  player.walk += player.moving ? dt * PLAYER.walkSpeed : 0;
  player.leanX +=
    (-ux * PLAYER.leanFactorX - player.leanX) * Math.min(1, PLAYER.leanSmoothing * dt);
  player.leanZ +=
    (-uy * PLAYER.leanFactorZ - player.leanZ) * Math.min(1, PLAYER.leanSmoothing * dt);
  player.hCd -= dt;
  player.dCd -= dt;
  player.wCd -= dt;
  player.wdCd -= dt;
}

/** Dessine le sprite du joueur, ancré par les pieds au point projeté, retourné selon la direction. */
function drawPlayerSprite(ctx: CanvasRenderingContext2D, P: Player, bob: number): void {
  const ground = proj(P.x, P.z, 0);
  const s = cam.s;
  if (!playerSprite.complete || playerSprite.naturalWidth === 0) return;
  const aspect = playerSprite.naturalWidth / playerSprite.naturalHeight;
  const h = PLAYER.spriteHeight * s;
  const w = h * aspect;
  ctx.save();
  ctx.translate(ground.x, ground.y - bob * s);
  ctx.scale(P.face, 1);
  ctx.drawImage(playerSprite, -w / 2, -h, w, h);
  ctx.restore();
}

export function drawPlayer(ctx: CanvasRenderingContext2D, P: Player): void {
  const bob = P.moving ? Math.abs(Math.sin(P.walk)) * 2 : 0;
  drawShadow(ctx, P.x, P.z, 15);
  drawPlayerSprite(ctx, P, bob);
  for (let i = 0; i < P.stack; i++) {
    const lx = P.x + P.leanX * (i + 1) * 0.45;
    const lz = P.z + P.leanZ * (i + 1) * 0.35;
    drawBox(ctx, lx, lz, 41 + bob + i * 7.2, 18, 13, 6.4, '#f6cf5a', '#d9a83c', 3);
    drawBox(ctx, lx, lz + 0.1, 43.6 + bob + i * 7.2, 18.6, 4, 1.6, '#b3812a', '#b3812a', 1);
  }
  for (let i = 0; i < P.waterStack; i++) {
    drawBox(ctx, P.x - 15, P.z + 4, 20 + bob + i * 7.5, 8, 8, 6.4, '#5fb6e0', '#3f93c0', 3);
  }
}
