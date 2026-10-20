import { FIELD as FIELD_BALANCE, DELIVERY, WATER } from '../data/balance';
import type { Horse, Plant } from './types';

export const FIELD = FIELD_BALANCE;

export function createField(): Plant[] {
  const plants: Plant[] = [];
  for (let r = 0; r < FIELD.rows; r++) {
    addFieldRow(plants, r);
  }
  return plants;
}

/** Ajoute une rangée de plants prêts à récolter (utilisé à la création et lors d'une extension du champ). */
export function addFieldRow(plants: Plant[], rowIndex: number): void {
  for (let c = 0; c < FIELD.cols; c++) {
    plants.push({
      x: FIELD.x - 105 + c * FIELD.colSpacing,
      z: FIELD.z - 62 + rowIndex * FIELD.rowSpacing,
      g: 1,
    });
  }
}

export const TREES: [number, number][] = [
  [36, 60],
  [150, 40],
  [310, 36],
  [424, 64],
  [28, 470],
  [432, 460],
  [38, 845],
  [425, 850],
  [230, 885],
];

export interface Flower {
  x: number;
  z: number;
  c: number;
}

/** Générateur pseudo-aléatoire déterministe (LCG) pour un placement stable des fleurs. */
export function createFlowers(): Flower[] {
  const flowers: Flower[] = [];
  let s = 7;
  for (let i = 0; i < 46; i++) {
    s = (s * 16807) % 2147483647;
    const x = 20 + (s % 420);
    s = (s * 16807) % 2147483647;
    const z = 30 + (s % 830);
    flowers.push({ x, z, c: s % 3 });
  }
  return flowers;
}

export function feederOf(h: Horse): { x: number; z: number } {
  return { x: h.x, z: h.z + DELIVERY.feederOffsetZ };
}

/** Abreuvoir à eau, posé juste à côté de la mangeoire dans le même enclos. */
export function troughOf(h: Horse): { x: number; z: number } {
  return { x: h.x + WATER.troughOffsetX, z: h.z + DELIVERY.feederOffsetZ };
}

export function fenceSegs(h: Horse): { x: number; z: number; w: number; d: number }[] {
  const { x, z } = h;
  return [
    { x, z: z - 56, w: 126, d: 8 },
    { x: x - 63, z: z - 9, w: 8, d: 86 },
    { x: x + 63, z: z - 9, w: 8, d: 86 },
  ];
}
