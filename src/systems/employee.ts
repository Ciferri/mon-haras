import { EMPLOYEE } from '../data/balance';
import { feederOf } from '../world/layout';
import type { GameState } from '../world/state';
import type { GameEvent } from './events';
import type { Horse, Plant, Worker } from '../world/types';

const dist = (ax: number, az: number, bx: number, bz: number): number =>
  Math.hypot(ax - bx, az - bz);

function nearestReadyPlant(plants: Plant[], x: number, z: number): Plant | null {
  let best: Plant | null = null;
  let bd = Infinity;
  for (const p of plants) {
    if (p.g < 1) continue;
    const d = dist(x, z, p.x, p.z);
    if (d < bd) {
      bd = d;
      best = p;
    }
  }
  return best;
}

function nearestHungryHorse(horses: Horse[], x: number, z: number): Horse | null {
  let best: Horse | null = null;
  let bd = Infinity;
  for (const h of horses) {
    if (!h.unlocked || h.feed >= h.maxFeed) continue;
    const f = feederOf(h);
    const d = dist(x, z, f.x, f.z);
    if (d < bd) {
      bd = d;
      best = h;
    }
  }
  return best;
}

/** Avance l'employé vers une cible ; renvoie true une fois arrivé (sans franchir la cible). */
function moveToward(w: Worker, tx: number, tz: number, dt: number): boolean {
  const d = dist(w.x, w.z, tx, tz);
  if (d < EMPLOYEE.arriveThreshold) return true;
  const step = Math.min(d, EMPLOYEE.speed * dt);
  w.x += ((tx - w.x) / d) * step;
  w.z += ((tz - w.z) / d) * step;
  w.dir = tx >= w.x ? 1 : -1;
  w.walk += dt * 11;
  return false;
}

/**
 * IA minimale des employés automatiques : va vers le plant de paille le plus
 * proche, le récolte, puis le livre au cheval affamé le plus proche, en boucle.
 * Pas d'événement de présentation (haptique/toast) pour ne pas noyer les actions du joueur.
 */
export function updateEmployees(state: GameState, dt: number): GameEvent[] {
  for (const w of state.workers) {
    if (!w.carrying) {
      const plant = nearestReadyPlant(state.plants, w.x, w.z);
      if (!plant) continue;
      const arrived = moveToward(w, plant.x, plant.z, dt);
      if (arrived && plant.g >= 1) {
        plant.g = 0;
        w.carrying = true;
        state.flyers.push({ x: plant.x, z: plant.z, y: 10, t: 0, type: 'hay' });
      }
    } else {
      const horse = nearestHungryHorse(state.horses, w.x, w.z);
      if (!horse) {
        moveToward(w, EMPLOYEE.hireX, EMPLOYEE.hireZ, dt);
        continue;
      }
      const f = feederOf(horse);
      const arrived = moveToward(w, f.x, f.z, dt);
      if (arrived && horse.feed < horse.maxFeed) {
        horse.feed++;
        w.carrying = false;
        state.flyers.push({ x: w.x, z: w.z, y: 46, t: 0, type: 'hay2', tx: f.x, tz: f.z });
      }
    }
  }
  return [];
}
