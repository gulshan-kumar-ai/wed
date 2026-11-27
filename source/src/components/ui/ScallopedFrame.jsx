import { useMemo, useRef } from 'react';
import { useElementSize } from '../../hooks/useElementSize';

/** Rectangle whose edges are a run of outward semicircular scallops of radius ≈ r. */
function scallopPath(w, h, r) {
  const x0 = r;
  const y0 = r;
  const x1 = w - r;
  const y1 = h - r;
  const f = (n) => Math.round(n * 100) / 100;
  const edge = (ax, ay, bx, by) => {
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.round(len / (2 * r)));
    const rr = len / n / 2;
    let s = '';
    for (let i = 1; i <= n; i += 1) {
      s += ` A${f(rr)} ${f(rr)} 0 0 1 ${f(ax + ((bx - ax) * i) / n)} ${f(ay + ((by - ay) * i) / n)}`;
    }
    return s;
  };
  return `M${x0} ${y0}${edge(x0, y0, x1, y0)}${edge(x1, y0, x1, y1)}${edge(x1, y1, x0, y1)}${edge(x0, y1, x0, y0)} Z`;
}

/**
 * Ivory card with a scalloped edge, a thin gold outline and an inset double gold rule.
 * Pass `shimmer` to add a periodic gold-foil light-sweep across the border.
 */
export default function ScallopedFrame({
  children,
  className = '',
  contentClassName = '',
  radius = 9,
  inset = 16,
  fill = '#FFFCF5',
  stroke = '#D4AF37',
  corners = true,
  shimmer = false,
}) {
  const ref = useRef(null);
  const { width: w, height: h } = useElementSize(ref);
  const d = useMemo(() => (w && h ? scallopPath(w, h, radius) : ''), [w, h, radius]);

  /* Stable ID for SVG gradient references — based on rounded dimensions. */
  const uid = `sf-${Math.round(w)}-${Math.round(h)}`;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {d && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible md:drop-shadow-[0_18px_40px_rgba(80,30,10,0.16)]"
          viewBox={`0 0 ${w} ${h}`}
          aria-hidden="true"
        >
          <defs>
            {/* #2: Gold shimmer sweep — a narrow bright band that travels left → right */}
            {shimmer && (
              <linearGradient
                id={`${uid}-shimmer`}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2={w}
                y2="0"
              >
                <stop offset="0%"   stopColor={stroke} stopOpacity="0" />
                <stop offset="42%"  stopColor={stroke} stopOpacity="0" />
                <stop offset="50%"  stopColor="#FFF8C0" stopOpacity="0.95" />
                <stop offset="56%"  stopColor="#E8D060" stopOpacity="0.5" />
                <stop offset="66%"  stopColor={stroke} stopOpacity="0" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from={`${-w} 0`}
                  to={`${w * 2} 0`}
                  dur="4s"
                  begin="1.8s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            )}
          </defs>

          {/* Card fill */}
          <path d={d} fill={fill} stroke={stroke} strokeWidth="1.4" />

          {/* Double inset rule */}
          <rect x={inset} y={inset} width={w - inset * 2} height={h - inset * 2}
                fill="none" stroke={stroke} strokeWidth="1.2" />
          <rect
            x={inset + 5} y={inset + 5}
            width={w - (inset + 5) * 2} height={h - (inset + 5) * 2}
            fill="none" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.7"
          />

          {/* Corner ornaments */}
          {corners &&
            [
              [inset, inset, 0],
              [w - inset, inset, 90],
              [w - inset, h - inset, 180],
              [inset, h - inset, 270],
            ].map(([x, y, rot]) => (
              <g key={rot} transform={`translate(${x} ${y}) rotate(${rot})`}>
                <path d="M0 0 L22 0 Q12 4 8 8 Q4 12 0 22 Z" fill={stroke} opacity="0.9" />
                <circle cx="13" cy="13" r="2.2" fill="#A93226" />
              </g>
            ))}

          {/* #2: Shimmer layer drawn over the border path */}
          {shimmer && w > 0 && (
            <path
              d={d}
              fill="none"
              stroke={`url(#${uid}-shimmer)`}
              strokeWidth="3"
            />
          )}
        </svg>
      )}
      <div className={`relative ${contentClassName}`}>{children}</div>
    </div>
  );
}
