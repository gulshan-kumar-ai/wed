/**
 * Shared 1440 × 900 SVG artboard for full-scene layers.
 * `xMidYMax slice` = cover the viewport, anchored bottom-centre, so every
 * layer using it lines up with every other one at any screen size.
 */
export const ART_W = 1440;
export const ART_H = 900;

export default function ArtBoard({ children, className = '', overflowVisible = false }) {
  return (
    <svg
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      overflow={overflowVisible ? 'visible' : undefined}
    >
      {children}
    </svg>
  );
}
