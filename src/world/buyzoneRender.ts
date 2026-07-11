import { cam, proj } from '../engine/camera';
import { CAMERA } from '../data/balance';
import type { BuyZone } from './types';

export function drawBuyZone(ctx: CanvasRenderingContext2D, z: BuyZone): void {
  if (!z.active() || z.left <= 0) return;
  const p = proj(z.x, z.z, 0);
  const s = cam.s;
  const R = z.r * s;
  ctx.fillStyle = 'rgba(255,255,255,.28)';
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, R, R * CAMERA.kz, 0, 0, Math.PI * 2);
  ctx.fill();
  const done = 1 - z.left / z.cost;
  if (done > 0) {
    ctx.fillStyle = 'rgba(255,210,63,.45)';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.ellipse(p.x, p.y, R, R * CAMERA.kz, 0, -Math.PI / 2, -Math.PI / 2 + done * Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3 * s;
  ctx.setLineDash([9 * s, 7 * s]);
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, R, R * CAMERA.kz, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.textAlign = 'center';
  ctx.font = 19 * s + 'px Nunito,Arial';
  ctx.fillText(z.icon, p.x, p.y - 2 * s);
  ctx.font = '800 ' + 13.5 * s + 'px Nunito,Arial';
  ctx.lineWidth = 3.5 * s;
  ctx.strokeStyle = 'rgba(30,25,15,.75)';
  ctx.lineJoin = 'round';
  const txt = '🪙 ' + Math.ceil(z.left);
  ctx.strokeText(txt, p.x, p.y + 15 * s);
  ctx.fillStyle = '#fff';
  ctx.fillText(txt, p.x, p.y + 15 * s);
  ctx.font = '800 ' + 10.5 * s + 'px Nunito,Arial';
  ctx.strokeText(z.label, p.x, p.y - 16 * s);
  ctx.fillText(z.label, p.x, p.y - 16 * s);
}
