export interface Player {
  x: number;
  z: number;
  face: 1 | -1;
  walk: number;
  stack: number;
  max: number;
  leanX: number;
  leanZ: number;
  hCd: number;
  dCd: number;
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

export interface BuyZone {
  x: number;
  z: number;
  r: number;
  cost: number;
  left: number;
  icon: string;
  label: string;
  horseIndex?: number;
  /** Accumulateur de temps pour cadencer les flyers visuels pendant le drainage. */
  flyerAccum: number;
  active: () => boolean;
  onBuy: () => void;
}

export type Flyer =
  | { type: 'hay'; t: number; x: number; z: number; y: number }
  | { type: 'hay2'; t: number; x: number; z: number; y: number; tx: number; tz: number }
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
