# Mon Grand Haras — Idle Arcade

Jeu mobile web idle arcade : déplace ton personnage au joystick, récolte de la
paille, nourris les chevaux, ramasse l'or qu'ils produisent, et dépense-le sur
des cercles au sol pour agrandir ton haras.

Phase 1 (fondations) : port complet du prototype (`reference/prototype.html`)
dans une architecture Vite + TypeScript strict, avec sauvegarde locale et
gains hors ligne.

## Lancer en développement

```bash
npm install
npm run dev
```

Ouvre l'URL affichée (par défaut `http://localhost:5173`). Le jeu se joue au
doigt (joystick flottant) sur mobile, ou au clavier (ZQSD / WASD / flèches)
sur desktop pour le développement.

## Builder

```bash
npm run build
```

Produit un bundle statique optimisé dans `dist/`. `npm run preview` sert ce
build localement pour vérification avant déploiement.

## Qualité

```bash
npm run lint     # ESLint, zéro warning toléré
npm run format   # Prettier
```

`tsc -b` (exécuté par `npm run build`) doit passer sans erreur en TypeScript
strict.

## Déployer sur Netlify

Le dépôt contient un `netlify.toml` prêt à l'emploi :

- **Build command** : `npm run build`
- **Publish directory** : `dist`
- Une redirection SPA (`/*` → `/index.html`, 200) est configurée pour que le
  rechargement de page fonctionne quelle que soit l'URL.

Étapes :

1. Connecter le dépôt GitHub à un nouveau site Netlify (« Import from Git »).
2. Netlify détecte automatiquement `netlify.toml` — aucune configuration
   manuelle n'est nécessaire.
3. Chaque push sur la branche déployée déclenche un nouveau build.
4. Pour un déploiement manuel : `npx netlify deploy --prod --dir=dist` (après
   `npm run build` et authentification `netlify login`).

## Sauvegarde

La progression est stockée dans `localStorage` sous la clé
`mon-grand-haras-save`, versionnée (`systems/save.ts`). À la reconnexion, si
plus de quelques secondes se sont écoulées, le jeu estime la production hors
ligne (chevaux déjà nourris continuant de mâcher leur réserve, plafonnée à 2h)
et propose de la doubler via une publicité récompensée simulée.

## Architecture

```
src/
  main.ts              boot, boucle rAF, resize par frame, bandeau d'erreurs
  game.ts               orchestration des systèmes à chaque frame
  render.ts             orchestration du rendu (tri en profondeur)
  engine/                projection pseudo-3D, caméra, primitives de dessin
  input/joystick.ts      joystick tactile/souris/clavier
  world/                 entités (player, horse, plant, coin), layout, effets
  systems/               harvest, deliver, produce, buyzones, collect, tuto,
                         offline, save, adBoost — logique de jeu pure
  data/balance.ts        TOUTES les constantes d'équilibrage
  data/tiers.ts          paliers visuels (structure prête, contenu Phase 2)
  ui/                    HUD DOM, toasts, tutoriel, overlays
  monetization/          interfaces AdsProvider + implémentation simulée
```

Principe directeur : les systèmes (`systems/`) sont des fonctions qui lisent
et modifient l'état du jeu (`world/state.ts`) et renvoient une liste
d'événements (`systems/events.ts`). La couche de présentation
(`ui/presentation.ts`) traduit ces événements en effets sensibles (toasts,
vibrations, particules) sans que la logique de jeu ne connaisse le DOM.

## Ajouter un nouveau bâtiment en 5 étapes

Exemple : ajouter un poulailler qui produit des œufs.

1. **Équilibrage** — ajouter toutes les constantes dans `data/balance.ts`
   (coût de déblocage, capacité, vitesse de production…). Aucune valeur ne
   doit être écrite en dur ailleurs.
2. **Entité** — créer `world/henhouse.ts` : une interface de données (position,
   niveau, stock…), une fonction `createHenhouse()`, et des fonctions de
   dessin (`drawHenhouse`) en réutilisant les primitives de `engine/draw.ts`.
   Si le bâtiment a des paliers visuels, ajouter ses définitions dans
   `data/tiers.ts`.
3. **Système** — créer `systems/henhouse.ts` avec une fonction
   `updateHenhouse(state, dt): GameEvent[]` qui contient la logique (ponte,
   collecte…). Ajouter les types d'événements nécessaires dans
   `systems/events.ts`, et une zone d'achat le cas échéant (voir
   `systems/buyzones.ts` pour le modèle : `active()`, `onBuy()`, drainage
   d'or au sol).
4. **Câblage** — instancier l'entité dans `world/state.ts`
   (`createInitialState`), appeler `updateHenhouse` depuis `game.ts`, et gérer
   ses événements dans `ui/presentation.ts` (toast, particules, son…).
5. **Rendu et sauvegarde** — ajouter son dessin dans `render.ts` (avec la
   bonne position `z` pour le tri en profondeur), et étendre
   `systems/save.ts` (`SaveDataV1`, `serialize`, `applySave`) pour persister
   son état. Si le format change de forme, incrémenter
   `SAVE.schemaVersion` et ajouter une migration.

## Contraintes de qualité

- Portrait, zone du pouce, cibles tactiles ≥ 44 pt, aucun texte < 12 pt.
- Bundle < 300 ko gzippé hors sons (actuellement ~11 ko gzippé JS+CSS).
- TypeScript strict, zéro `any`, zéro warning ESLint.
- Aucune dépendance de moteur externe (canvas 2D natif uniquement).

## Capacitor (préparation future)

Toute la monétisation est déjà derrière des interfaces
(`monetization/ads.ts`) pour permettre un remplacement par un fournisseur
natif (AdMob) sans toucher au reste du jeu. Le guide d'encapsulation
Capacitor Android complet sera ajouté en Phase 4.
