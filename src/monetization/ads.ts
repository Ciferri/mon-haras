/**
 * Interface de publicité récompensée. L'implémentation réelle (AdMob via
 * Capacitor, Phase 4) et l'implémentation simulée (Phase 1-3) partagent ce
 * contrat, pour que le reste du jeu ne connaisse jamais le fournisseur réel.
 */
export interface AdsProvider {
  /** Affiche une publicité récompensée. Résout à `true` si elle a été vue jusqu'au bout. */
  showRewarded(): Promise<boolean>;
}
