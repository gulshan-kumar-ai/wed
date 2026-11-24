import { seeded } from '../layout/random';
import { mehrabPath } from '../layout/mehrab';

/** Seamless 120 × 120 tile of red roses, marigolds, jasmine and leaves, as a CSS url(). */
export function floralTileUrl() {
  const rand = seeded(21);
  const parts = ['<rect width="120" height="120" fill="#3E5C27"/>'];
  // Leaves (drawn at wrapped offsets so the tile repeats seamlessly)
  const wrap = (x, y, svg) =>
    [-120, 0, 120].flatMap((dx) => [-120, 0, 120].map((dy) => svg(x + dx, y + dy))).join('');
  for (let i = 0; i < 16; i += 1) {
    const x = rand() * 120;
    const y = rand() * 120;
    const rot = rand() * 360;
    const c = rand() > 0.5 ? '#5E7A3A' : '#4C6B2E';
    parts.push(wrap(x, y, (px, py) => `<path d="M0 0 Q6 -11 0 -22 Q-6 -11 0 0Z" fill="${c}" transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${rot.toFixed(0)})"/>`));
  }
  const blooms = [
    [20, 22, 13, 'r'], [70, 14, 12, 'm', '#F4B400'], [104, 46, 13, 'r'], [46, 58, 14, 'm', '#E67E22'],
    [88, 88, 13, 'r'], [18, 92, 12, 'm', '#F39C12'], [60, 104, 11, 'r'], [112, 112, 9, 'j'],
    [36, 36, 6, 'j'], [82, 54, 6, 'j'], [10, 60, 6, 'j'], [96, 20, 6, 'j'],
  ];
  blooms.forEach(([x, y, r, kind, color]) => {
    parts.push(
      wrap(x, y, (px, py) => {
        if (kind === 'm')
          return `<circle cx="${px}" cy="${py}" r="${r}" fill="${color}"/><circle cx="${px}" cy="${py}" r="${r * 0.62}" fill="${color}" stroke="#B85F12" stroke-opacity=".35" stroke-width="${r * 0.14}"/><circle cx="${px - r * 0.3}" cy="${py - r * 0.3}" r="${r * 0.28}" fill="#FFE29A" opacity=".5"/>`;
        if (kind === 'r')
          return `<circle cx="${px}" cy="${py}" r="${r}" fill="#A93226"/><circle cx="${px}" cy="${py}" r="${r * 0.62}" fill="none" stroke="#7A1F17" stroke-width="${r * 0.16}"/><circle cx="${px}" cy="${py}" r="${r * 0.26}" fill="#7A1F17"/>`;
        return `<circle cx="${px}" cy="${py}" r="${r * 0.5}" fill="#FBF6EA"/><circle cx="${px}" cy="${py}" r="${r * 0.18}" fill="#F4B400"/>`;
      }),
    );
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">${parts.join('')}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const ARCH_BOX = { w: 200, h: 300 };
export const ARCH_OPTS = { spring: 0.42, lobes: 4, depth: 0.6 };
/* The lobes bulge outside the 200 × 300 box, so the mask image is padded
   symmetrically: it is 1.2 × as wide and 1.16 × as tall as the opening. */
export const MASK_PAD = { x: 20, y: 24 };

/** The mandap opening as a CSS url() (black shape on transparent) for use as a mask. */
export function archMaskUrl() {
  const d = mehrabPath(ARCH_BOX.w, ARCH_BOX.h, ARCH_OPTS);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-MASK_PAD.x} ${-MASK_PAD.y} ${ARCH_BOX.w + MASK_PAD.x * 2} ${ARCH_BOX.h + MASK_PAD.y * 2}" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
