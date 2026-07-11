/**
 * Joystick flottant : tactile multi-touch (un seul identifiant de pointeur
 * suivi à la fois), souris, et clavier ZQSD/WASD/flèches en secours.
 */

export interface JoystickState {
  on: boolean;
  id: string | number | null;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  used: boolean;
}

const JOYSTICK_RADIUS = 52;

export const joy: JoystickState = { on: false, id: null, cx: 0, cy: 0, dx: 0, dy: 0, used: false };

const keys: Record<string, boolean> = {};

function isExcludedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest('#adBtn,#adOv') !== null;
}

function pointerDown(x: number, y: number, id: string | number, target: EventTarget | null): void {
  if (isExcludedTarget(target)) return;
  joy.on = true;
  joy.id = id;
  joy.cx = x;
  joy.cy = y;
  joy.dx = 0;
  joy.dy = 0;
  joy.used = true;
}

function pointerMove(x: number, y: number, id: string | number): void {
  if (!joy.on || id !== joy.id) return;
  let dx = x - joy.cx;
  let dy = y - joy.cy;
  const d = Math.hypot(dx, dy);
  if (d > JOYSTICK_RADIUS) {
    dx = (dx / d) * JOYSTICK_RADIUS;
    dy = (dy / d) * JOYSTICK_RADIUS;
    // La base du joystick suit le doigt une fois le rayon dépassé (feel moderne).
    joy.cx = x - dx;
    joy.cy = y - dy;
  }
  joy.dx = dx;
  joy.dy = dy;
}

function pointerUp(id: string | number): void {
  if (joy.on && id === joy.id) {
    joy.on = false;
    joy.dx = 0;
    joy.dy = 0;
  }
}

export function setupInput(): void {
  window.addEventListener(
    'touchstart',
    (e) => {
      if (isExcludedTarget(e.target)) return;
      e.preventDefault();
      const t = e.changedTouches[0];
      if (t) pointerDown(t.clientX, t.clientY, t.identifier, e.target);
    },
    { passive: false },
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      for (const t of Array.from(e.changedTouches)) pointerMove(t.clientX, t.clientY, t.identifier);
    },
    { passive: false },
  );
  window.addEventListener('touchend', (e) => {
    for (const t of Array.from(e.changedTouches)) pointerUp(t.identifier);
  });
  window.addEventListener('touchcancel', (e) => {
    for (const t of Array.from(e.changedTouches)) pointerUp(t.identifier);
  });
  window.addEventListener('mousedown', (e) => pointerDown(e.clientX, e.clientY, 'm', e.target));
  window.addEventListener('mousemove', (e) => pointerMove(e.clientX, e.clientY, 'm'));
  window.addEventListener('mouseup', () => pointerUp('m'));
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    joy.used = true;
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
}

/** Renvoie le vecteur de déplacement normalisé (-1..1) issu du joystick et/ou du clavier. */
export function readMoveVector(): { ux: number; uy: number } {
  let ux = joy.dx / JOYSTICK_RADIUS;
  let uy = joy.dy / JOYSTICK_RADIUS;
  if (keys['ArrowLeft'] || keys['q'] || keys['a']) ux = -1;
  if (keys['ArrowRight'] || keys['d']) ux = 1;
  if (keys['ArrowUp'] || keys['z'] || keys['w']) uy = -1;
  if (keys['ArrowDown'] || keys['s']) uy = 1;
  const m = Math.hypot(ux, uy);
  if (m > 1) {
    ux /= m;
    uy /= m;
  }
  return { ux, uy };
}

export function drawJoystick(ctx: CanvasRenderingContext2D, W: number, H: number): void {
  let cx: number, cy: number, dx: number, dy: number, alpha: number;
  if (joy.on) {
    cx = joy.cx;
    cy = joy.cy;
    dx = joy.dx;
    dy = joy.dy;
    alpha = 1;
  } else if (!joy.used) {
    cx = W / 2;
    cy = H - 110;
    dx = 0;
    dy = 0;
    alpha = 0.6;
  } else {
    return;
  }
  ctx.globalAlpha = alpha * 0.35;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx, cy, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.arc(cx + dx, cy + dy, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}
