import { drawBox } from './engine/draw';
import { viewport } from './engine/viewport';
import {
  drawFieldPlot,
  drawFlowers,
  drawGround,
  drawTree,
  drawEnclosureSand,
} from './world/scenery';
import { TREES } from './world/layout';
import { drawPlant } from './world/plant';
import { drawHorse, drawFeeder } from './world/horse';
import { fenceSegs } from './world/layout';
import { drawPlayer } from './world/player';
import { drawCoin } from './world/coin';
import { drawBuyZone } from './world/buyzoneRender';
import { drawFlyers, drawParticles, drawPopups } from './world/effects';
import { drawTutoMarker } from './world/tutoMarker';
import { getTutoMarkerTarget } from './systems/tuto';
import { drawJoystick } from './input/joystick';
import type { GameState } from './world/state';

interface DepthItem {
  z: number;
  draw: () => void;
}

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  drawGround(ctx);
  drawFlowers(ctx, state.flowers);
  drawFieldPlot(ctx);
  for (const h of state.horses) {
    if (h.unlocked) drawEnclosureSand(ctx, h.x, h.z);
  }
  for (const z of state.buyZones) drawBuyZone(ctx, z);

  const layers: DepthItem[] = [];
  for (const p of state.plants) layers.push({ z: p.z, draw: () => drawPlant(ctx, p) });
  for (const h of state.horses) {
    if (!h.unlocked) continue;
    for (const seg of fenceSegs(h)) {
      layers.push({
        z: seg.z + seg.d / 2,
        draw: () => drawBox(ctx, seg.x, seg.z, 0, seg.w, seg.d, 19, '#b07b3f', '#8a5a28', 4),
      });
    }
    layers.push({ z: h.z + 2, draw: () => drawHorse(ctx, h) });
    layers.push({ z: h.z + 88, draw: () => drawFeeder(ctx, h) });
  }
  for (const [tx, tz] of TREES) layers.push({ z: tz, draw: () => drawTree(ctx, tx, tz, tx | 0) });
  layers.push({ z: state.player.z + 1, draw: () => drawPlayer(ctx, state.player) });
  for (const c of state.coins) layers.push({ z: c.z, draw: () => drawCoin(ctx, c) });
  layers.sort((a, b) => a.z - b.z);
  for (const item of layers) item.draw();

  drawFlyers(ctx, state.flyers, state.player.x, state.player.z);
  drawParticles(ctx, state.parts);
  drawPopups(ctx, state.pops);
  drawTutoMarker(ctx, getTutoMarkerTarget(state));
  drawJoystick(ctx, viewport.w, viewport.h);
}
