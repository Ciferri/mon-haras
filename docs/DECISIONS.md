# Journal des décisions de game design

Ce document consigne les choix faits en cas d'ambiguïté, avec leur
justification, conformément à la méthode de travail définie dans le brief.

## Phase 1

### Modèle de gains hors ligne

Le brief demande une « production estimée » plafonnée à 2 h, sans préciser de
formule (les employés automatiques, qui justifieraient naturellement une
production hors ligne en Phase 2, n'existent pas encore en Phase 1).

**Décision** : seuls les chevaux déjà nourris au moment de la déconnexion
continuent de mâcher leur réserve de paille pendant l'absence, au même rythme
qu'en jeu (`chewBase`/niveau), jusqu'à épuisement du stock ou du plafond de
2 h. C'est le modèle le plus proche du fonctionnement déjà établi en jeu
(cohérent avec les références du genre : la production hors ligne prolonge
ce que le joueur avait déjà mis en route, elle ne simule pas une activité que
le joueur n'aurait pas déclenchée). Voir `systems/offline.ts`.

### Architecture événementielle des systèmes

Le brief demande que « chaque système [soit] testable isolément ». Les
systèmes de gameplay (`systems/harvest.ts`, `deliver.ts`, `produce.ts`,
`collect.ts`, `buyzones.ts`) sont donc des fonctions pures de l'état du jeu
qui renvoient une liste d'événements typés (`systems/events.ts`), plutôt que
d'appeler directement des effets DOM (toasts, vibrations). La couche
`ui/presentation.ts` traduit ces événements en effets sensibles. Ce choix
permet de tester la logique de jeu sans DOM ni timers, et prépare le terrain
pour un mode debug ou des tests automatisés en Phase 3.

### Repère de débogage en développement

Un objet `window.__debugState` exposant l'état du jeu est activé uniquement
en mode développement (`import.meta.env.DEV`), sur le modèle du
`window.__G` du prototype. Il est éliminé du bundle de production par le
tree-shaking de Vite (vérifié : absent de `dist/`). Il est distinct du futur
mode `?debug=1` de la Phase 3 (or infini, téléportation, vitesse ×5, FPS),
qui sera une fonctionnalité utilisateur documentée, pas un outil interne.

### Favicon

Un favicon minimal (emoji cheval en SVG inline, data URI) a été ajouté —
absent du prototype — pour éviter une requête 404 au chargement, sans
introduire de dépendance à un asset externe.
