import {
  BUY_ZONE,
  EMPLOYEE,
  FIELD_EXTENSION,
  TUTORIAL_STEPS,
  UNLOCK_BOX2,
  UPGRADE,
} from '../data/balance';
import { addFieldRow, FIELD } from '../world/layout';
import { createWorker } from '../world/worker';
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

/**
 * Construit les zones d'achat au sol : débloquer le box 2, améliorer chaque
 * cheval (Phase 1), agrandir le champ et embaucher des employés (Phase 2).
 * Les zones ferment sur `state` directement pour pouvoir muter les tableaux
 * (plants, workers) et le compteur `fieldRows` portés par l'état du jeu.
 */
export function createBuyZones(state: GameState): BuyZone[] {
  const horses = state.horses;
  const boxZone: BuyZone = {
    x: 340,
    z: 226,
    r: 46,
    cost: UNLOCK_BOX2.cost,
    left: UNLOCK_BOX2.cost,
    icon: '🐴',
    label: 'Nouveau box',
    kind: 'unlockHorse',
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
    kind: 'upgradeHorse',
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
    kind: 'upgradeHorse',
    horseIndex: 1,
    flyerAccum: 0,
    active: () => horses[1]!.unlocked,
    onBuy: () => upgradeHorse(upgradeZone1, horses[1]!),
  };
  const extendFieldZone: BuyZone = {
    x: FIELD.x,
    z: FIELD.z + FIELD.d / 2 + 45,
    r: 42,
    cost: FIELD_EXTENSION.cost,
    left: FIELD_EXTENSION.cost,
    icon: '🌾',
    label: 'Agrandir le champ',
    kind: 'extendField',
    flyerAccum: 0,
    active: () => state.fieldRows < FIELD_EXTENSION.rows,
    onBuy: () => {
      addFieldRow(state.plants, state.fieldRows);
      state.fieldRows = FIELD_EXTENSION.rows;
    },
  };
  const hireZone: BuyZone = {
    x: EMPLOYEE.hireX,
    z: EMPLOYEE.hireZ,
    r: EMPLOYEE.hireRadius,
    cost: EMPLOYEE.baseCost,
    left: EMPLOYEE.baseCost,
    icon: '👷',
    label: 'Employé',
    kind: 'hireEmployee',
    flyerAccum: 0,
    active: () => state.workers.length < EMPLOYEE.maxCount,
    onBuy: () => {
      state.workers.push(createWorker());
      const n = state.workers.length;
      hireZone.cost = Math.round(EMPLOYEE.baseCost * Math.pow(EMPLOYEE.costGrowth, n));
      hireZone.left = hireZone.cost;
    },
  };
  return [boxZone, upgradeZone0, upgradeZone1, extendFieldZone, hireZone];
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
        z.onBuy();
        switch (z.kind) {
          case 'unlockHorse':
            events.push({ type: 'horseUnlocked', x: z.x, z: z.z });
            break;
          case 'upgradeHorse':
            events.push({
              type: 'horseUpgraded',
              horseIndex: z.horseIndex!,
              level: state.horses[z.horseIndex!]!.lvl,
              x: z.x,
              z: z.z,
            });
            break;
          case 'extendField':
            events.push({ type: 'fieldExtended', x: z.x, z: z.z });
            break;
          case 'hireEmployee':
            events.push({ type: 'employeeHired', x: z.x, z: z.z });
            break;
        }
        if (state.tuto === TUTORIAL_STEPS.spend) {
          state.tuto = TUTORIAL_STEPS.done;
          events.push({ type: 'tutoAdvanced', step: state.tuto });
        }
      }
    }
  }
  return events;
}
