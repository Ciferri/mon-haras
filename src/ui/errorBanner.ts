/** Bandeau d'erreur visible, hérité du prototype : indispensable pour du debug sur mobile. */
export function setupErrorBanner(): void {
  window.onerror = (message, _source, line): void => {
    const el = document.getElementById('err');
    if (!el) return;
    el.style.display = 'block';
    const text = typeof message === 'string' ? message : message.type;
    el.textContent = 'Erreur : ' + text + ' (ligne ' + String(line) + ')';
  };
}
