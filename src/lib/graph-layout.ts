/**
 * Deterministic force-directed layout (Fruchterman–Reingold) for small graphs.
 *
 * Layout belongs to the *producer* of a trace, not the renderer: coordinates are part
 * of the trace's initial graph structure, so a replay always draws the same picture.
 * Deterministic initial positions (a circle in input order) and a fixed iteration
 * count make the result a pure function of the node and edge lists.
 */
export interface LayoutNode {
  id: string;
  x: number;
  y: number;
}

export function layoutGraph(
  nodeIds: readonly string[],
  edges: readonly { from: string; to: string }[],
  options: { iterations?: number; margin?: number } = {},
): LayoutNode[] {
  const n = nodeIds.length;
  const margin = options.margin ?? 0.08;
  if (n === 0) return [];
  if (n === 1) return [{ id: nodeIds[0]!, x: 0.5, y: 0.5 }];

  const index = new Map(nodeIds.map((id, i) => [id, i]));
  const pos = nodeIds.map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: 0.5 + 0.4 * Math.cos(angle), y: 0.5 + 0.4 * Math.sin(angle) };
  });
  const links = edges
    .map((e) => [index.get(e.from), index.get(e.to)] as const)
    .filter((l): l is readonly [number, number] => l[0] !== undefined && l[1] !== undefined && l[0] !== l[1]);

  const k = Math.sqrt(1 / n); // ideal edge length in the unit square
  const iterations = options.iterations ?? 300;
  let temperature = 0.1;
  const cooling = temperature / (iterations + 1);

  for (let it = 0; it < iterations; it++) {
    const disp = pos.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pos[i]!.x - pos[j]!.x;
        let dy = pos[i]!.y - pos[j]!.y;
        let dist = Math.hypot(dx, dy);
        if (dist < 1e-6) {
          // Coincident points: separate along a deterministic direction.
          dx = 1e-3 * (i - j);
          dy = 1e-3;
          dist = Math.hypot(dx, dy);
        }
        const force = (k * k) / dist;
        disp[i]!.x += (dx / dist) * force;
        disp[i]!.y += (dy / dist) * force;
        disp[j]!.x -= (dx / dist) * force;
        disp[j]!.y -= (dy / dist) * force;
      }
    }
    for (const [a, b] of links) {
      const dx = pos[a]!.x - pos[b]!.x;
      const dy = pos[a]!.y - pos[b]!.y;
      const dist = Math.max(Math.hypot(dx, dy), 1e-6);
      const force = (dist * dist) / k;
      disp[a]!.x -= (dx / dist) * force;
      disp[a]!.y -= (dy / dist) * force;
      disp[b]!.x += (dx / dist) * force;
      disp[b]!.y += (dy / dist) * force;
    }
    for (let i = 0; i < n; i++) {
      const d = disp[i]!;
      const len = Math.max(Math.hypot(d.x, d.y), 1e-9);
      const step = Math.min(len, temperature);
      pos[i]!.x += (d.x / len) * step;
      pos[i]!.y += (d.y / len) * step;
      // Gentle pull to the centre keeps disconnected components on screen.
      pos[i]!.x += (0.5 - pos[i]!.x) * 0.01;
      pos[i]!.y += (0.5 - pos[i]!.y) * 0.01;
    }
    temperature -= cooling;
  }

  // Normalise into [margin, 1 - margin], preserving aspect ratio.
  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const span = Math.max(Math.max(...xs) - minX, Math.max(...ys) - minY, 1e-9);
  const scale = (1 - 2 * margin) / span;
  const offX = (1 - 2 * margin - (Math.max(...xs) - minX) * scale) / 2;
  const offY = (1 - 2 * margin - (Math.max(...ys) - minY) * scale) / 2;
  return nodeIds.map((id, i) => ({
    id,
    x: round(margin + offX + (pos[i]!.x - minX) * scale),
    y: round(margin + offY + (pos[i]!.y - minY) * scale),
  }));
}

const round = (v: number) => Math.round(v * 1000) / 1000;
