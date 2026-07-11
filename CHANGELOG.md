# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

## [0.1.0] — Phase 1 : fondations

### Ajouté
- Projet Vite + TypeScript strict, ESLint (flat config) + Prettier, `netlify.toml`.
- Moteur de rendu pseudo-3D (`engine/`) : projection écran, caméra suiveuse
  avec clamp aux bords du monde, primitives de dessin (boîtes empilées,
  ombres), gestion du `devicePixelRatio` (plafond 2) et re-mesure de la taille
  d'écran à chaque frame.
- Joystick flottant tactile multi-touch (un seul pointeur suivi), souris, et
  clavier ZQSD/WASD/flèches en secours (`input/joystick.ts`).
- Boucle de jeu core complète, portée à l'identique du prototype :
  - Champ de 12 plants de paille avec repousse (6 s).
  - Récolte avec empilement inertiel sur la tête (max 8).
  - Livraison automatique à la mangeoire.
  - Cheval qui mâche (2,4 s de base, −0,22 s/niveau, plancher 0,9 s) et éjecte
    3 pièces de valeur = niveau.
  - Magnétisme de collecte des pièces (rayon 46).
  - Deux zones d'achat au sol : amélioration de cheval
    (50 × 1,75^(niveau−1)) et déblocage du deuxième box (150 or).
  - Publicité récompensée simulée (×2 pendant 30 s), derrière l'interface
    `AdsProvider` pour permettre un remplacement futur par AdMob (Phase 4).
- Sauvegarde automatique versionnée dans `localStorage`
  (`systems/save.ts`) et gains de production hors ligne à la reconnexion,
  plafonnés à 2 h, avec écran de collecte proposant de les doubler via
  publicité (`ui/overlays.ts`).
- Tutoriel fléché en 4 étapes (déplacer → récolter → nourrir → ramasser →
  dépenser), piloté par une machine à états (`systems/tuto.ts`) et un marqueur
  canvas animé.
- Bandeau d'erreur visible (`window.onerror`), hérité du prototype.
- Structure `data/tiers.ts` préparée pour les paliers visuels de la Phase 2
  (contenu à niveau 1 uniquement pour l'instant).
- `docs/DECISIONS.md` pour tracer les choix de game design ambigus.

### Notes techniques
- Toutes les constantes d'équilibrage sont centralisées dans
  `data/balance.ts`.
- Les systèmes de jeu (`systems/`) sont des fonctions pures d'état qui
  renvoient des événements (`systems/events.ts`), consommés par la couche de
  présentation (`ui/presentation.ts`) pour les effets sensibles (toasts,
  vibrations, particules).
- Bundle de production : ~9,3 ko gzippé (JS) + ~1,3 ko gzippé (CSS), très
  loin sous le budget de 300 ko.

**Fin de la Phase 1 : en attente de session de test client avant d'attaquer
la Phase 2 (deuxième ressource eau, employés automatiques, paliers visuels,
extension du terrain).**
