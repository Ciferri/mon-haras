export function buzz(pattern: number | number[]): void {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // API de vibration refusée ou indisponible : on ignore silencieusement.
    }
  }
}
