# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

## [0.3.5] — Sprite dessiné pour la paille mûre

### Ajouté
- La paille prête à récolter (`world/plant.ts`, `drawPlant`) est désormais
  un sprite PNG dessiné à la main (`assets/sprites/straw.png`,
  `HARVEST.spriteHeight`). L'état "en repousse" (pousse verte) reste en
  rendu procédural, faute de sprite dédié.

## [0.3.4] — Sprite dessiné pour l'abreuvoir

### Ajouté

- L'abreuvoir (`world/horse.ts`, `drawTrough`) est désormais un sprite PNG
  dessiné à la main (`assets/sprites/trough.png`), même principe que la
  mangeoire. La barre de remplissage d'eau reste procédurale et dynamique.
- L'enclos du cheval (Phase 3) est maintenant entièrement en sprites
  dessinés à la main : joueur (face/dos), cheval, mangeoire, abreuvoir.
  Restent en procédural : clôture, sable, champ, puits, arbres, pièces.

## [0.3.3] — Sprite dessiné pour la mangeoire

### Ajouté

- La mangeoire (`world/horse.ts`, `drawFeeder`) est désormais un sprite PNG
  dessiné à la main (`assets/sprites/feeder.png`), dimensionné en largeur
  (`HORSE.feederSpriteWidth`). La barre de remplissage procédurale reste
  inchangée en dessous.

### Notes techniques

- Le sprite montre toujours la mangeoire pleine de foin (pas de variante
  "vide") ; le niveau réel de paille reste communiqué par la barre de
  progression, qui reste dynamique.

## [0.3.2] — Sprite dessiné pour le cheval

### Ajouté

- Le cheval (`world/horse.ts`) est désormais un sprite PNG dessiné à la
  main (`assets/sprites/horse.png`), retourné horizontalement selon
  `dir` (comme avant, les deux box se font face). Le harnais du palier 4
  reste une fine bande procédurale dessinée par-dessus le sprite.

### Retiré

- L'animation des jambes pendant la mastication et le mouvement de tête
  vers la mangeoire (détails procéduraux) : un sprite statique ne peut pas
  les reproduire sans plusieurs images dédiées. À revisiter si une
  véritable animation (plusieurs poses) est produite plus tard.

## [0.3.1] — Sprite de dos pour le joueur

### Ajouté

- Deuxième sprite du joueur, vu de dos (`assets/sprites/player-back.png`),
  utilisé quand le joueur s'éloigne de la caméra (vers le haut de l'écran).
  `Player.facingBack` suit la direction verticale du dernier mouvement
  significatif, sur le même principe que `face` (gauche/droite). Le flip
  horizontal s'applique aux deux sprites : 2 images couvrent les 4
  directions.

## [0.3.0] — Premier sprite dessiné : le joueur

### Ajouté

- `engine/sprites.ts` : chargement d'image minimal (`loadSprite`), pensé
  pour être réutilisé à chaque nouvel asset dessiné.
- Le joueur (`world/player.ts`) est désormais un sprite PNG dessiné à la
  main (`assets/sprites/player.png`), ancré par les pieds au point projeté
  au sol, retourné horizontalement selon la direction de déplacement
  (`ctx.scale(P.face, 1)`). La pile de paille/eau transportée reste en
  rendu procédural (petits éléments, pas besoin d'un sprite dédié).
- Image compressée (palette indexée, redimensionnée à la taille réellement
  affichée en jeu) : 10 ko au lieu des 296 ko de l'export source — le jeu
  reste très loin sous le budget de 300 ko.

### Notes techniques

- Voir `docs/DECISIONS.md` pour le choix de garder le moteur de caméra
  identique (le sprite est un simple "panneau" placé dans le monde 3D
  simulé, pas besoin de ré-angler les futurs dessins).

## [0.2.1] — Correctif : personnage invisible sur écran haute densité

### Corrigé

- Le `<canvas>` n'avait pas de `width`/`height` CSS explicites. Sur tout
  écran avec `devicePixelRatio > 1` (quasi tous les mobiles), il gardait sa
  taille intrinsèque (celle du buffer interne, dimensionné en pixels
  physiques par `ensureViewportSize`) au lieu de se caler sur le viewport :
  le jeu se dessinait deux fois trop grand et sa moitié bas-droite sortait
  de l'écran — invisible, mais toujours simulée. En pratique, le
  personnage disparaissait dès qu'il s'éloignait du coin haut-gauche de la
  carte (typiquement en allant vers le champ). Fix : `canvas { width:
100%; height: 100%; }` dans `src/style.css`.

## [0.2.0] — Phase 2 : eau, employés, paliers visuels, extension du terrain

### Ajouté

- **Deuxième ressource : l'eau.** Un puits fixe (`world/well.ts`) où le
  joueur remplit sa réserve (`systems/water.ts`), un abreuvoir par cheval
  à côté de chaque mangeoire (`world/horse.ts`). Un cheval abreuvé mâche
  35 % plus vite et consomme son eau en même temps que sa paille — bonus
  optionnel, la boucle de la Phase 1 reste identique sans eau (voir
  `docs/DECISIONS.md`).
- **Employés automatiques.** Jusqu'à 2 employés embauchables (coût
  croissant géométriquement) qui récoltent la paille et nourrissent les
  chevaux en continu, sans intervention du joueur (`systems/employee.ts`,
  `world/worker.ts`).
- **Paliers visuels (niveau 4).** Cheval : robe plus sombre + harnais.
  Enclos : clôture peinte en blanc. Champ : 4e rangée + épouvantail
  (`data/tiers.ts`, désormais câblés dans `render.ts`/`world/horse.ts`).
- **Extension du terrain.** Nouvelle zone d'achat « Agrandir le champ »
  (400 or) qui ajoute une 4e rangée de plants.
- Sauvegarde migrée en version 2 (`systems/save.ts`) : eau par cheval,
  nombre de rangées du champ, nombre d'employés. Une sauvegarde v1
  existante est migrée automatiquement, sans perte de progression.

### Notes techniques

- `systems/buyzones.ts` ferme désormais sur `GameState` entier (plutôt que
  sur le seul tableau de chevaux) pour pouvoir muter les plants, les
  employés et le nombre de rangées depuis les zones d'achat.
- Les employés sont une IA sans état (recalcul de la cible à chaque frame,
  voir `docs/DECISIONS.md`) et n'émettent aucun événement de présentation
  (pas de vibration/toast) pour ne pas parasiter le retour sensoriel des
  actions du joueur.
- Bundle de production : ~11,2 ko gzippé (JS) + ~1,3 ko gzippé (CSS),
  toujours très loin sous le budget de 300 ko.

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
