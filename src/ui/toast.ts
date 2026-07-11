let hideTimer: number | undefined;

export function toast(message: string): void {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => el.classList.remove('show'), 2100);
}
