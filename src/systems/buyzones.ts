import { BUY_ZONE, TUTORIAL_STEPS, UNLOCK_BOX2, UPGRADE } from '../data/balance';
import type { BuyZone, Horse } from '../world/types';
import type { GameState } from '../world/state';
import type { GameEvent } from './events';

const dist = (ax: number, az: number, bx: number, bz: number): number =>
  Math.hypot(ax - bx, az - bz);

function upgradeHorse(zone: BuyZone, horse: Horse): void {
  horse.lvl++;
  zone.cost = Math.round(UPGRADE.baseCost * Math.pow(UPGRADE.costGrowth, horse.lvl - 1));
  zone.left = zone.cost;
}

/** Construit les zones d'achat au sol de la Phase 1 : débloquer le box 2, améliorer chaque cheval. */
export function createBuyZones(horses: Horse[]): BuyZone[] {
  const boxZone: BuyZone = {
    x: 340,
    z: 226,
    r: 46,
    cost: UNLOCK_BOX2.cost,
    left: UNLOCK_BOX2.cost,
    icon: '🐴',
    label: 'Nouveau box',
    flyerAccum: 0,
    active: () => !horses[1]!.unlocked,
    onBuy: () => {
      horses[1]!.unlocked = true;
      horses[1]!.pop = 1;
    },
  };
  const upgradeZone0: BuyZone = {
    x: 38,
    z: 170,
    r: 38,
    cost: UPGRADE.baseCost,
    left: UPGRADE.baseCost,
    icon: '⬆️',
    label: 'Améliorer',
    horseIndex: 0,
    flyerAccum: 0,
    active: () => horses[0]!.unlocked,
    onBuy: () => upgradeHorse(upgradeZone0, horses[0]!),
  };
  const upgradeZone1: BuyZone = {
    x: 422,
    z: 170,
    r: 38,
    cost: UPGRADE.baseCost,
    left: UPGRADE.baseCost,
    icon: '⬆️',
    label: 'Améliorer',
    horseIndex: 1,
    flyerAccum: 0,
    active: () => horses[1]!.unlocked,
    onBuy: () => upgradeHorse(upgradeZone1, horses[1]!),
  };
  return [boxZone, upgradeZone0, upgradeZone1];
}

export function updateBuyZones(state: GameState, dt: number): GameEvent[] {
  const events: GameEvent[] = [];
  const player = state.player;
  for (const z of state.buyZones) {
    if (!z.active() || z.left <= 0) continue;
    if (dist(player.x, player.z, z.x, z.z) < z.r && state.gold >= 1) {
      const spend = Math.min(
        state.gold,
        z.left,
        Math.max(1, Math.round(BUY_ZONE.drainPerSecond * dt)),
      );
      state.gold -= spend;
      z.left -= spend;
      z.flyerAccum += dt;
      if (z.flyerAccum > 0.07) {
        z.flyerAccum = 0;
        state.flyers.push({ sx: 38, sy: 34, type: 'coinHud', tx: z.x, tz: z.z, t: 0 });
      }
      if (z.left <= 0) {
        const isUnlock = z.horseIndex === undefined;
        z.onBuy();
        const level = z.horseIndex !== undefined ? state.horses[z.horseIndex]!.lvl : 0;
        events.push(
          isUnlock
            ? { type: 'horseUnlocked', x: z.x, z: z.z }
            : { type: 'horseUpgraded', horseIndex: z.horseIndex!, level, x: z.x, z: z.z },
        );
        if (state.tuto === TUTORIAL_STEPS.spend) {
          state.tuto = TUTORIAL_STEPS.done;
          events.push({ type: 'tutoAdvanced', step: state.tuto });
        }
      }
    }
  }
  return events;
}
