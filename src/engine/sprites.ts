/** Charge une image depuis une URL (gérée par Vite) sans bloquer : le navigateur la décode en tâche de fond. */
export function loadSprite(url: string): HTMLImageElement {
  const img = new Image();
  img.src = url;
  return img;
}
