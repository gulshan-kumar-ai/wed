/**
 * Scalloped (multifoil) Mughal / Rajasthani mehrab arch outline.
 *
 * Returns an SVG path for an arch opening inside a w × h box: straight jambs
 * from the bottom up to the springing line, then a pointed arch made of
 * outward-bulging lobes meeting at inward cusps, up to a point at the apex.
 *
 *   spring – height of the springing line as a fraction of h, from the top
 *   lobes  – number of lobes on each side of the arch
 *   depth  – lobe radius relative to its chord (0.5 = semicircle, larger = flatter)
 */
export function mehrabPath(w, h, { spring = 0.36, lobes = 4, depth = 0.62, x = 0, y = 0 } = {}) {
  const sy = h * spring;
  const p0 = [0, sy];
  const c = [w * 0.02, sy * 0.08];
  const p1 = [w / 2, 0];
  const bez = (t) => [
    (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0],
    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1],
  ];

  const left = Array.from({ length: lobes + 1 }, (_, i) => bez(i / lobes));
  const right = left
    .slice(0, -1)
    .reverse()
    .map(([px, py]) => [w - px, py]);

  const f = (n) => Math.round(n * 1000) / 1000;
  const P = ([px, py]) => `${f(px + x)} ${f(py + y)}`;

  let d = `M${P([0, h])} L${P(left[0])}`;
  const pts = [...left, ...right];
  for (let i = 1; i < pts.length; i += 1) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const r = Math.hypot(bx - ax, by - ay) * depth;
    d += ` A${f(r)} ${f(r)} 0 0 1 ${P(pts[i])}`;
  }
  d += ` L${P([w, h])} Z`;
  return d;
}
