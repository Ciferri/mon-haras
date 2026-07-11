import { TUTORIAL_STEPS } from '../data/balance';
import { createPlayer } from './player';
import { createHorse } from './horse';
import { createField, createFlowers, type Flower } from './layout';
import { createBuyZones } from '../systems/buyzones';
import type { BuyZone, Coin, Flyer, Horse, Particle, Player, Plant, Popup } from './types';

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
}

export function createInitialState(): GameState {
  const horses = [createHorse(120, 170, 1, true), createHorse(340, 170, -1, false)];
  return {
    gold: 0,
    adMult: 1,
    adLeft: 0,
    tuto: TUTORIAL_STEPS.move,
    player: createPlayer(),
    horses,
    plants: createField(),
    coins: [],
    buyZones: createBuyZones(horses),
    flyers: [],
    parts: [],
    pops: [],
    flowers: createFlowers(),
  };
}
