import { TUTORIAL_STEPS } from '../data/balance';
import { createPlayer } from './player';
import { createHorse } from './horse';
import { createField, createFlowers, FIELD, type Flower } from './layout';
import { createBuyZones } from '../systems/buyzones';
import type { BuyZone, Coin, Flyer, Horse, Particle, Player, Plant, Popup, Worker } from './types';

export interface GameState {
  gold: number;
  adMult: number;
  adLeft: number;
  tuto: number;
  player: Player;
  horses: Horse[];
  plants: Plant[];
  coins: Coin[];
  buyZones: BuyZone[];
  flyers: Flyer[];
  parts: Particle[];
  pops: Popup[];
  flowers: Flower[];
  /** Nombre de rangées du champ actuellement plantées (3 à l'origine, 4 après extension). */
  fieldRows: number;
  /** Employés automatiques embauchés (Phase 2). */
  workers: Worker[];
  /** Affiché une seule fois, la première fois qu'un cheval reçoit de l'eau. */
  waterToastShown: boolean;
}

export function createInitialState(): GameState {
  const horses = [createHorse(120, 170, 1, true), createHorse(340, 170, -1, false)];
  const state: GameState = {
    gold: 0,
    adMult: 1,
    adLeft: 0,
    tuto: TUTORIAL_STEPS.move,
    player: createPlayer(),
    horses,
    plants: createField(),
    coins: [],
    buyZones: [],
    flyers: [],
    parts: [],
    pops: [],
    flowers: createFlowers(),
    fieldRows: FIELD.rows,
    workers: [],
    waterToastShown: false,
  };
  state.buyZones = createBuyZones(state);
  return state;
}
