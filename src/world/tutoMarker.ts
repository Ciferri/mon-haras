import { cam, proj } from '../engine/camera';

/** Flèche flottante qui pointe vers l'objectif du tutoriel en cours. */
export function drawTutoMarker(
  ctx: CanvasRenderingContext2D,
  target: { x: number; z: number } | null,
): void {
  if (!target) return;
  const s = cam.s;
  const bounce = Math.abs(Math.sin(performance.now() / 280)) * 12;
  const p = proj(target.x, target.z, 58 + bounce);
  ctx.fillStyle = '#ffd23f';
  ctx.strokeStyle = 'rgba(30,25,15,.6)';
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y + 14 * s);
  ctx.lineTo(p.x - 11 * s, p.y - 6 * s);
  ctx.lineTo(p.x + 11 * s, p.y - 6 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
