import { CAMERA, PLAYER, WORLD } from '../data/balance';
import { drawBox, drawShadow } from '../engine/draw';
import type { Player } from './types';

export function createPlayer(): Player {
  return {
    x: PLAYER.startX,
    z: PLAYER.startZ,
    face: 1,
    walk: 0,
    stack: 0,
    max: PLAYER.maxStack,
    leanX: 0,
    leanZ: 0,
    hCd: 0,
    dCd: 0,
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
}

export function drawPlayer(ctx: CanvasRenderingContext2D, P: Player): void {
  const bob = P.moving ? Math.abs(Math.sin(P.walk)) * 2 : 0;
  drawShadow(ctx, P.x, P.z, 15);
  const sw = Math.sin(P.walk) * 3.5;
  drawBox(ctx, P.x - 5, P.z, 0, 6, 6, 11 + (P.moving ? sw : 0), '#35415c', '#28324a', 2);
  drawBox(ctx, P.x + 5, P.z, 0, 6, 6, 11 - (P.moving ? sw : 0), '#35415c', '#28324a', 2);
  drawBox(ctx, P.x, P.z, 10 + bob, 17, 11, 15, '#3f8fdd', '#2e6fb4', 5);
  drawBox(ctx, P.x - 11, P.z, 13 + bob, 5, 5, 10, '#3f8fdd', '#2e6fb4', 2);
  drawBox(ctx, P.x + 11, P.z, 13 + bob, 5, 5, 10, '#3f8fdd', '#2e6fb4', 2);
  drawBox(ctx, P.x, P.z, 25 + bob, 13, 11, 11, '#f2c9a0', '#d6a87d', 4);
  drawBox(ctx, P.x, P.z, 35 + bob, 15, 12, 4.5, '#e0552e', '#b83e1d', 3);
  drawBox(ctx, P.x + 5 * P.face, P.z + 3, 35 + bob, 9, 7, 2.5, '#e0552e', '#b83e1d', 2);
  for (let i = 0; i < P.stack; i++) {
    const lx = P.x + P.leanX * (i + 1) * 0.45;
    const lz = P.z + P.leanZ * (i + 1) * 0.35;
    drawBox(ctx, lx, lz, 41 + bob + i * 7.2, 18, 13, 6.4, '#f6cf5a', '#d9a83c', 3);
    drawBox(ctx, lx, lz + 0.1, 43.6 + bob + i * 7.2, 18.6, 4, 1.6, '#b3812a', '#b3812a', 1);
  }
}
