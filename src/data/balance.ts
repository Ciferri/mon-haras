/**
 * Toutes les constantes d'équilibrage du jeu, centralisées ici.
 * Aucune valeur de gameplay ne doit être écrite en dur ailleurs dans le code.
 */

export const WORLD = {
  /** Dimensions du monde en unités de jeu (pas des pixels écran). */
  w: 460,
  h: 900,
};

export const CAMERA = {
  /** Écrasement pseudo-3D appliqué à l'axe Z lors de la projection écran. */
  kz: 0.74,
  /** Zoom minimum/maximum de la caméra, et largeur de référence pour le calcul du zoom. */
  zoomMin: 0.72,
  zoomMax: 1.5,
  zoomReferenceWidth: 420,
  /** Vitesse de rattrapage de la caméra vers sa cible (par seconde). */
  followSpeed: 6,
  /** Ratio devicePixelRatio plafonné pour ne pas surcharger le rendu. */
  maxDPR: 2,
};

export const PLAYER = {
  startX: 230,
  startZ: 440,
  /** Vitesse de déplacement en unités/seconde. */
  speed: 165,
  /** Facteur additionnel appliqué à la vitesse sur l'axe Z (compense l'écrasement KZ). */
  zSpeedFactor: 0.9,
  /** Marges de bord de monde (clamp de position). */
  boundsMarginX: 24,
  boundsMarginZTop: 40,
  boundsMarginZBottom: 26,
  /** Nombre maximum de pailles empilées sur la tête. */
  maxStack: 8,
  /** Vitesse d'animation de marche. */
  walkSpeed: 11,
  /** Facteur de lissage de l'inclinaison (lean) de la pile. */
  leanSmoothing: 9,
  leanFactorX: 7,
  leanFactorZ: 5,
  /** Seuil de vitesse pour considérer le joueur "en mouvement". */
  movingThreshold: 0.12,
  /** Seuil d'input horizontal pour changer l'orientation du personnage. */
  faceThreshold: 0.15,
};

export const HARVEST = {
  /** Rayon de recherche de la plante la plus proche. */
  radius: 52,
  /** Cooldown entre deux récoltes (secondes). */
  cooldown: 0.2,
  /** Temps de repousse d'une plante récoltée (secondes). */
  regrowTime: 6,
};

export const FIELD = {
  x: 230,
  z: 660,
  w: 280,
  d: 190,
  rows: 3,
  cols: 4,
  rowSpacing: 62,
  colSpacing: 70,
};

export const DELIVERY = {
  /** Rayon de livraison à la mangeoire. */
  radius: 56,
  /** Cooldown entre deux livraisons (secondes). */
  cooldown: 0.12,
  /** Décalage de la mangeoire par rapport au centre de l'enclos. */
  feederOffsetZ: 86,
};

export const HORSE = {
  maxFeed: 10,
  /** Temps de mastication de base (secondes) avant d'éjecter des pièces. */
  chewBase: 2.4,
  /** Réduction du temps de mastication par niveau au-dessus de 1. */
  chewReductionPerLevel: 0.22,
  /** Plancher du temps de mastication, quel que soit le niveau. */
  chewFloor: 0.9,
  /** Nombre de pièces éjectées à chaque cycle de mastication. */
  coinsPerChew: 3,
  /** Nombre maximum de pièces simultanées à l'écran (perf). */
  maxCoinsOnScreen: 60,
  /** Vitesse de disparition de l'effet "pop" à l'arrivée d'un nouveau cheval. */
  popDecaySpeed: 1.6,
};

export const UPGRADE = {
  /** Coût de base d'amélioration d'un cheval. */
  baseCost: 50,
  /** Multiplicateur de coût par niveau (croissance géométrique). */
  costGrowth: 1.75,
};

export const UNLOCK_BOX2 = {
  cost: 150,
};

export const COIN = {
  /** Gravité appliquée aux pièces éjectées (unités/s²). */
  gravity: 380,
  /** Restitution au rebond ; en dessous de ce seuil de vitesse la pièce s'arrête. */
  bounceThreshold: 26,
  bounceRestitution: 0.42,
  /** Rayon de déclenchement du magnétisme vers le joueur. */
  magnetRadius: 46,
  /** Facteur de lissage du déplacement magnétique (par seconde). */
  magnetLerpSpeed: 11,
  /** Rayon de collecte effective (pièce absorbée par le joueur). */
  pickupRadius: 11,
};

export const BUY_ZONE = {
  /** Débit de dépense en or par seconde lorsque le joueur reste dans la zone. */
  drainPerSecond: 90,
};

export const AD = {
  /** Multiplicateur de gains pendant le boost publicitaire. */
  multiplier: 2,
  /** Durée du boost (secondes). */
  boostDuration: 30,
  /** Durée simulée du visionnage de la publicité (secondes, décompte 3-2-1). */
  simulatedWatchSeconds: 3,
};

export const OFFLINE = {
  /** Plafond de temps hors ligne pris en compte pour l'estimation des gains (secondes). */
  capSeconds: 2 * 60 * 60,
};

export const SAVE = {
  storageKey: 'mon-grand-haras-save',
  /** Version du schéma de sauvegarde ; incrémenter à chaque changement de forme. */
  schemaVersion: 1,
  /** Intervalle de sauvegarde automatique (secondes). */
  autosaveInterval: 5,
};

export const TUTORIAL_STEPS = {
  move: 0,
  harvest: 1,
  feed: 2,
  collect: 3,
  spend: 4,
  done: 5,
} as const;
