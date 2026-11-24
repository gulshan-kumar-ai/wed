import { useId } from 'react';
import { mehrabPath } from '../layout/mehrab';

const W = 200;
const H = 280;
const OPTS = { spring: 0.42, lobes: 3, depth: 0.6 };

/**
 * Portrait inside a scalloped royal arch with a double gold border.
 * Without a photo it shows a warm placeholder with the person's initial.
 */
export default function ArchPortrait({ name, title, role, photo, tone = 'saffron', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const inner = mehrabPath(W - 16, H - 12, { ...OPTS, x: 8, y: 8 });
  const outer = mehrabPath(W, H, OPTS);
  const grad = tone === 'crimson' ? ['#C8553F', '#7A1F17'] : ['#F3A65A', '#B85F12'];

  return (
    <figure className={`flex flex-col items-center ${className}`}>
      <svg viewBox={`-22 -26 ${W + 44} ${H + 30}`} className="w-full drop-shadow-[0_16px_28px_rgba(80,30,10,0.22)]" role="img" aria-label={photo ? `Portrait of ${name}` : `${name} (photo coming soon)`}>
        <defs>
          <clipPath id={`clip-${uid}`}>
            <path d={inner} />
          </clipPath>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={grad[0]} />
            <stop offset="1" stopColor={grad[1]} />
          </linearGradient>
          <pattern id={`pt-${uid}`} width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M11 3 L19 11 L11 19 L3 11 Z" fill="none" stroke="#FFFFFF" strokeOpacity="0.12" />
          </pattern>
        </defs>
        <path d={outer} fill="#FFFCF5" stroke="#D4AF37" strokeWidth="2" />
        <g clipPath={`url(#clip-${uid})`}>
          {photo ? (
            <image href={photo} x="-30" y="-30" width={W + 60} height={H + 60} preserveAspectRatio="xMidYMid slice" />
          ) : (
            <>
              <rect x="-30" y="-30" width={W + 60} height={H + 60} fill={`url(#bg-${uid})`} />
              <rect x="-30" y="-30" width={W + 60} height={H + 60} fill={`url(#pt-${uid})`} />
              <circle cx={W / 2} cy={H * 0.58} r="58" fill="#FFFFFF" opacity="0.08" />
              <text
                x={W / 2}
                y={H * 0.6}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="'Cormorant Garamond', serif"
                fontSize="88"
                fontWeight="600"
                fill="#FDF8F0"
                opacity="0.92"
              >
                {name.charAt(0)}
              </text>
            </>
          )}
        </g>
        <path d={inner} fill="none" stroke="#D4AF37" strokeWidth="3" />
        <path d={inner} fill="none" stroke="#FFF3C4" strokeWidth="0.8" />
        
      </svg>
      <figcaption className="mt-4 text-center">
        {title && <span className="block font-display text-lg font-medium leading-none text-saffron-dark">{title}</span>}
        <span className="mt-1 block font-display text-[clamp(1.35rem,3.2vw,1.9rem)] font-semibold leading-tight text-crimson">{name}</span>
        <span className="mt-2 block font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-saffron-dark">{role}</span>
      </figcaption>
    </figure>
  );
}
