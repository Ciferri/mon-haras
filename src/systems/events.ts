/** Événements de gameplay émis par les systèmes ; consommés par la couche de présentation (ui/). */
export type GameEvent =
  | { type: 'harvested' }
  | { type: 'delivered'; horseIndex: number }
  | { type: 'coinsEjected'; x: number; z: number; count: number }
  | { type: 'coinCollected'; value: number; x: number; z: number }
  | { type: 'horseUpgraded'; horseIndex: number; level: number; x: number; z: number }
  | { type: 'horseUnlocked'; x: number; z: number }
  | { type: 'tutoAdvanced'; step: number }
  | { type: 'adBoostStarted' }
  | { type: 'adBoostEnded' };
