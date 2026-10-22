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

## Phase 2

### L'eau comme bonus optionnel, pas comme ressource bloquante

Le brief demande une « deuxième ressource ». Deux options : (a) l'eau devient
obligatoire pour que les chevaux produisent (comme la paille), ou (b) elle
reste optionnelle et accélère simplement la production quand elle est
disponible.

**Décision** : option (b). Rendre l'eau obligatoire aurait cassé la boucle de
jeu déjà validée en Phase 1 (le tutoriel ne mentionne que paille → nourrir →
ramasser → dépenser) et forcé une refonte du tutoriel non demandée. En la
rendant optionnelle — un cheval avec de l'eau mâche 35 % plus vite et
consomme l'eau en même temps que la paille (`WATER.chewSpeedMultiplier`,
`systems/produce.ts`) — le joueur qui ignore le puits garde exactement
l'expérience de la Phase 1, et celui qui gère les deux ressources est
récompensé. Cohérent avec le principe additif de ce projet (voir
`README.md`, section « Ajouter un nouveau bâtiment »).

### Gains hors ligne : l'eau n'est pas simulée

`systems/offline.ts` n'a pas été modifié : la production hors ligne continue
d'utiliser le rythme de base (sans bonus eau), même si un cheval avait de
l'eau au moment de la déconnexion. Justification : l'eau est une mécanique
d'engagement en temps réel (le joueur doit revenir remplir l'abreuvoir) ; la
simuler hors ligne reviendrait à neutraliser l'intérêt de la ressource. Le
stock d'eau résiduel d'un cheval n'est donc ni consommé ni exploité pendant
l'absence — il attend simplement le retour du joueur.

### Employés automatiques : IA sans état, sans bruit sensoriel

`systems/employee.ts` ne mémorise pas la cible d'un employé d'une frame à
l'autre : à chaque frame, il recalcule le plant ou le cheval le plus proche
et avance vers lui. Plus simple à maintenir qu'une machine à états avec
cibles persistantes, et le léger risque de ré-orientation si un plant plus
proche repousse en cours de trajet est un détail invisible en jeu. Les
actions des employés (récolte, livraison) ne déclenchent ni vibration ni
toast — seul le joueur doit sentir ses propres actions ; les employés
restent un filet visuel en arrière-plan plutôt qu'une source de notifications
concurrentes.

### Paliers visuels : seul le niveau 4 est rempli

`data/tiers.ts` prévoyait des paliers à 1, 4, 8 et 12. Seul le niveau 4 est
rempli en Phase 2 (robe plus sombre + harnais pour le cheval, clôture
peinte en blanc pour l'enclos, 4e rangée + épouvantail pour le champ). Les
niveaux 8 et 12 retombent sur le palier 4 (`tierFor` prend le palier le plus
haut ≤ au niveau donné) en attendant une direction artistique dédiée — les
inventer sans retour client risquerait de produire des paliers à jeter.

### Extension du terrain : un seul achat, pas de redimensionnement du monde

Le champ passe de 3 à 4 rangées via un unique achat (`FIELD_EXTENSION`,
400 or), sans agrandir les dimensions du monde (`WORLD`) ni la caméra. Une
vraie extension de terrain (déplacer les limites, debloquer de nouvelles
zones) est un sujet de Phase 3 à part entière ; ce premier palier valide le
mécanisme (plants ajoutés dynamiquement, parcelle et épouvantail redessinés
en fonction du nombre de rangées réel) sans sur-ingénierer avant d'avoir du
retour.

### Sauvegarde : migration v1 → v2

Le format de sauvegarde passe en version 2 (`SAVE.schemaVersion`) pour
inclure l'eau par cheval, le nombre de rangées du champ et le nombre
d'employés. `systems/save.ts` détecte une sauvegarde v1 existante et la
migre silencieusement (eau à 0, champ à 3 rangées, 0 employé) plutôt que de
l'invalider — un joueur de la Phase 1 ne perd pas sa progression.

## Phase 3 (visuels dessinés à la main)

### Sprites "panneaux" plutôt que ré-angler le moteur

Le moteur affiche le monde en pseudo-3D (caméra inclinée, `CAMERA.kz`,
boîtes extrudées). Un sprite dessiné à la main en vue de face/3-4 légère
(comme la plupart des personnages de jeux top-down — Stardew Valley,
Zelda classiques) ne respecte pas cet angle de caméra à la lettre.

**Décision** : ne pas y toucher. Le sprite est simplement placé comme un
panneau ("billboard") au point projeté du monde (`proj(x,z,0)`, ancré par
les pieds), sans tenter de le dessiner "à plat" selon l'angle de la
caméra. C'est la convention standard de l'immense majorité des jeux
top-down 2D — le joueur ne la remarque pas — et elle évite de contraindre
chaque futur dessin à une perspective très spécifique et difficile à
respecter à la main. Seule règle : le sprite se retourne horizontalement
selon la direction de déplacement (`ctx.scale(face, 1)`), pas de rotation
3D.

### Rendu hybride : sprite pour le corps, procédural pour les accessoires

La pile de paille/eau transportée par le joueur reste dessinée en boîtes
procédurales (`drawBox`), pas en sprite. Ce sont de petits éléments
répétés et déjà lisibles tels quels ; leur demander un sprite dédié
n'apporterait rien et ajouterait du travail de dessin. Le même principe
guidera les prochains ajouts : un sprite pour chaque élément identifiable
(personnage, cheval, bâtiments), le procédural reste pour les éléments
génériques/répétés (pièces, particules, barres de progression).

### Compression des sprites

Les images sources (export d'IA générative ou dessin) arrivent en haute
résolution carrée (ex. 1024×1024, ~300 ko). Avant intégration, chaque
sprite est redimensionné à la taille réellement affichée en jeu (avec une
marge pour les écrans haute densité) et reconverti en PNG à palette
indexée (peu de couleurs, aplats francs — le style flat cartoon s'y prête
très bien). Le premier sprite (joueur) passe ainsi de 296 ko à 10 ko.

