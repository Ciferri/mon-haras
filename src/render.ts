import { drawBox } from './engine/draw';
import { viewport } from './engine/viewport';
import {
  drawFieldPlot,
  drawFlowers,
  drawGround,
  drawTree,
  drawEnclosureSand,
  drawScarecrow,
} from './world/scenery';
import { TREES, FIELD, troughOf } from './world/layout';
import { drawPlant } from './world/plant';
import { drawHorse, drawFeeder, drawTrough } from './world/horse';
import { fenceSegs } from './world/layout';
import { drawPlayer } from './world/player';
import { drawCoin } from './world/coin';
import { drawBuyZone } from './world/buyzoneRender';
import { drawFlyers, drawParticles, drawPopups } from './world/effects';
import { drawTutoMarker } from './world/tutoMarker';
import { drawWell } from './world/well';
import { drawWorker } from './world/worker';
import { getTutoMarkerTarget } from './systems/tuto';
import { drawJoystick } from './input/joystick';
import { enclosureTierFor } from './data/tiers';
import { WATER, FIELD_EXTENSION } from './data/balance';
import type { GameState } from './world/state';

interface DepthItem {
  z: number;
  draw: () => void;
}

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  drawGround(ctx);
  drawFlowers(ctx, state.flowers);
  drawFieldPlot(ctx, state.fieldRows);
  for (const h of state.horses) {
    if (h.unlocked) drawEnclosureSand(ctx, h.x, h.z, enclosureTierFor(h.lvl).sandTop);
  }
  for (const z of state.buyZones) drawBuyZone(ctx, z);

  const layers: DepthItem[] = [];
  for (const p of state.plants) layers.push({ z: p.z, draw: () => drawPlant(ctx, p) });
  for (const h of state.horses) {
    if (!h.unlocked) continue;
    const tier = enclosureTierFor(h.lvl);
    for (const seg of fenceSegs(h)) {
      layers.push({
        z: seg.z + seg.d / 2,
        draw: () =>
          drawBox(ctx, seg.x, seg.z, 0, seg.w, seg.d, 19, tier.fenceTop, tier.fenceSide, 4),
      });
    }
    layers.push({ z: h.z + 2, draw: () => drawHorse(ctx, h) });
    layers.push({ z: h.z + 88, draw: () => drawFeeder(ctx, h) });
    layers.push({ z: troughOf(h).z, draw: () => drawTrough(ctx, h) });
  }
  layers.push({ z: WATER.wellZ + 30, draw: () => drawWell(ctx) });
  if (state.fieldRows >= FIELD_EXTENSION.rows) {
    const scarecrowZ = FIELD.z - 62 + (state.fieldRows - 1) * FIELD.rowSpacing;
    const scarecrowX = FIELD.x + FIELD.w / 2 - 20;
    layers.push({ z: scarecrowZ, draw: () => drawScarecrow(ctx, scarecrowX, scarecrowZ) });
  }
  for (const [tx, tz] of TREES) layers.push({ z: tz, draw: () => drawTree(ctx, tx, tz, tx | 0) });
  for (const w of state.workers) layers.push({ z: w.z + 1, draw: () => drawWorker(ctx, w) });
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
