/**
 * ─────────────────────────────────────────────────────────────
 *  ARTWORK SLOTS — swap placeholder SVG art for your illustrations.
 *
 *  Leave a slot as `null` to use the built-in placeholder art.
 *  Set it to an image path (e.g. '/art/temple.png' in /public/art)
 *  to replace that layer.
 *
 *  Full-scene layers are drawn on a shared 1440 × 900 artboard,
 *  anchored bottom-centre and scaled to cover the screen. Export your
 *  illustrations at 1440 × 900 (or 2880 × 1800 for retina) with
 *  transparent backgrounds so every layer lines up.
 *
 *  Framing pieces (urns, toran, peacocks) are sized to their own boxes.
 * ─────────────────────────────────────────────────────────────
 */
export const artwork = {
  /* Scene 1 · Temple courtyard (keep the doorway foot at x 720, y 700) */
  sky: null, //       backdrop: gradient sky, sun, clouds
  distant: null, //   far horizon: dunes, palms
  temple: null, //    temple silhouette (transparent PNG/WebP)
  courtyard: null, // floor + white marble pathway
  urnLeft: null, //   foreground floral urn (left)
  urnRight: null, //  foreground floral urn (right); mirrored from left if null and urnLeft set
  toran: null, //     hanging marigold garland across the top edge

  /* Scene 2 · Garden courtyard (balustrade top rail at y 640) */
  garden: {
    backdrop: null, //   sky + base lawn colour
    arcade: null, //     wall of scalloped mehrab arches
    balustrade: null, // stone railing
    foreground: null, // lawn, path, cypress trees, flower beds
    peacock: null, //    square image, bird perched at half height, facing right (mirrored for the right side)
  },

  /* Invitation card */
  ganesha: null, // gold Ganesha emblem (square, transparent)

  /* Scene 3 · Floral mandap passage */
  floralWall: null, // seamless tile for the flower wall around the arch

  /* Finale · Lotus pond at dusk (waterline at y 600) */
  finale: {
    sky: null, //        twilight sky, stars, moon (fill the full 1440 × 900)
    pavilion: null, //   lit temple pavilion + pond + reflection
    foreground: null, // lotus pads, blooms, floating diyas
    elephant: null, //   420 × 340 box, facing right, feet at the bottom (mirrored on the right)
  },
};
