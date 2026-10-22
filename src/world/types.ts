export interface Player {
  x: number;
  z: number;
  face: 1 | -1;
  /** true quand le joueur s'éloigne de la caméra (vers le haut de l'écran) : sprite de dos. */
  facingBack: boolean;
  walk: number;
  stack: number;
  max: number;
  /** Eau transportée sur la pile, séparément de la paille. */
  waterStack: number;
  maxWaterStack: number;
  leanX: number;
  leanZ: number;
  hCd: number;
  dCd: number;
  /** Cooldowns du puits (remplissage) et de l'abreuvoir (livraison). */
  wCd: number;
  wdCd: number;
  moving: boolean;
}

export interface Horse {
  x: number;
  z: number;
  dir: 1 | -1;
  lvl: number;
  feed: number;
  maxFeed: number;
  chew: number;
  unlocked: boolean;
  pop: number;
  bob: number;
  /** Réserve d'eau : accélère la mastication quand elle n'est pas vide (Phase 2). */
  water: number;
  maxWater: number;
}

/** Employé automatique qui récolte la paille et nourrit les chevaux sans intervention. */
export interface Worker {
  x: number;
  z: number;
  dir: 1 | -1;
  carrying: boolean;
  walk: number;
}

export interface Plant {
  x: number;
  z: number;
  /** Croissance 0..1 ; 1 = prête à être récoltée, 0 = vient d'être récoltée. */
  g: number;
}

export interface Coin {
  x: number;
  z: number;
  y: number;
  vy: number;
  val: number;
  age: number;
  mag: boolean;
}

export type BuyZoneKind = 'unlockHorse' | 'upgradeHorse' | 'extendField' | 'hireEmployee';

export interface BuyZone {
  x: number;
  z: number;
  r: number;
  cost: number;
  left: number;
  icon: string;
  label: string;
  kind: BuyZoneKind;
  horseIndex?: number;
  /** Accumulateur de temps pour cadencer les flyers visuels pendant le drainage. */
  flyerAccum: number;
  active: () => boolean;
  onBuy: () => void;
}

export type Flyer =
  | { type: 'hay'; t: number; x: number; z: number; y: number }
  | { type: 'hay2'; t: number; x: number; z: number; y: number; tx: number; tz: number }
  | { type: 'water'; t: number; x: number; z: number; y: number }
  | { type: 'water2'; t: number; x: number; z: number; y: number; tx: number; tz: number }
  | { type: 'coinHud'; t: number; sx: number; sy: number; tx: number; tz: number };

export interface Particle {
  x: number;
  z: number;
  y: number;
  vx: number;
  vz: number;
  vy: number;
  t: number;
  c: string;
}

export interface Popup {
  x: number;
  z: number;
  y: number;
  t: number;
  txt: string;
  c: string;
}
