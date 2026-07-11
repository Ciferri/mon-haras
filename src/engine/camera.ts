import { CAMERA, WORLD } from '../data/balance';
import { viewport } from './viewport';

export interface ScreenPoint {
  x: number;
  y: number;
}

export const cam = { x: WORLD.w / 2, z: WORLD.h / 2, s: 1 };

/** Projette une position monde (x,z,y) vers un point écran. */
export function proj(x: number, z: number, y = 0): ScreenPoint {
  return {
    x: (x - cam.x) * cam.s + viewport.w / 2,
    y: (z - cam.z) * CAMERA.kz * cam.s + viewport.h * 0.5 - y * cam.s,
  };
}

/** Fait suivre la caméra au joueur avec un clamp aux bords du monde. */
export function updateCamera(dt: number, targetX: number, targetZ: number): void {
  const { w: W, h: H } = viewport;
  cam.s = Math.max(CAMERA.zoomMin, Math.min(W / CAMERA.zoomReferenceWidth, CAMERA.zoomMax));
  const hx = W / (2 * cam.s);
  const hz = H / (2 * CAMERA.kz * cam.s);
  const tx = hx >= WORLD.w / 2 ? WORLD.w / 2 : Math.max(hx, Math.min(WORLD.w - hx, targetX));
  const tz = hz >= WORLD.h / 2 ? WORLD.h / 2 : Math.max(hz, Math.min(WORLD.h - hz, targetZ));
  cam.x += (tx - cam.x) * Math.min(1, CAMERA.followSpeed * dt);
  cam.z += (tz - cam.z) * Math.min(1, CAMERA.followSpeed * dt);
}
