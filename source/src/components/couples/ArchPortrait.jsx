import { useId } from 'react';
import { mehrabPath } from '../layout/mehrab';
import { LotusIcon, MarigoldIcon } from '../ui/MotifIcons';

const W = 200;
const H = 280;
const OPTS = { spring: 0.42, lobes: 3, depth: 0.6 };

function Caption({ title, name, role }) {
  return (
    <figcaption className="mt-4 text-center">
      {title && (
        <span dir="ltr" className="block font-display text-xl font-medium leading-none text-saffron-dark">
          {title}
        </span>
      )}
      <span dir="ltr" className="mt-1 block font-display text-[clamp(1.35rem,3.2vw,1.9rem)] font-semibold leading-tight text-crimson">
        {name}
      </span>
      <span className="mt-2 block font-sans text-xs font-semibold uppercase tracking-[0.24em] text-saffron-dark">{role}</span>
    </figcaption>
  );
}

/**
 * Portrait inside a scalloped royal arch with a double gold border.
 * Until a photo is added it shows a small gilded mehrab with a lotus (bride) or
 * marigold (groom) motif, which reads as ornament rather than a missing photo.
 */
export default function ArchPortrait({ name, title, role, photo, alt, tone = 'saffron', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const inner = mehrabPath(W - 16, H - 12, { ...OPTS, x: 8, y: 8 });
  const outer = mehrabPath(W, H, OPTS);

  if (!photo) {
    const Motif = tone === 'crimson' ? LotusIcon : MarigoldIcon;
    return (
      <figure className={`flex flex-col items-center ${className}`}>
        <div className="relative w-[min(9.5rem,70%)]" aria-hidden="true">
          <svg viewBox={`-6 -10 ${W + 12} ${H + 16}`} className="w-full">
            <path d={outer} fill="#FFFCF5" stroke="#D4AF37" strokeWidth="2.5" />
            <path d={inner} fill={tone === 'crimson' ? '#A93226' : '#E67E22'} fillOpacity="0.07" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="2 5" />
          </svg>
          <Motif className="absolute left-1/2 top-[56%] h-[42%] w-[60%] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <Caption title={title} name={name} role={role} />
      </figure>
    );
  }

  return (
    <figure className={`flex flex-col items-center ${className}`}>
      <svg viewBox={`-22 -26 ${W + 44} ${H + 30}`} className="w-full drop-shadow-[0_16px_28px_rgba(80,30,10,0.22)]" role="img" aria-label={alt}>
        <defs>
          <clipPath id={`clip-${uid}`}>
            <path d={inner} />
          </clipPath>
        </defs>
        <path d={outer} fill="#FFFCF5" stroke="#D4AF37" strokeWidth="2" />
        <g clipPath={`url(#clip-${uid})`}>
          <image href={photo} x="-30" y="-30" width={W + 60} height={H + 60} preserveAspectRatio="xMidYMid slice" />
        </g>
        <path d={inner} fill="none" stroke="#D4AF37" strokeWidth="3" />
        <path d={inner} fill="none" stroke="#FFF3C4" strokeWidth="0.8" />
      </svg>
      <Caption title={title} name={name} role={role} />
    </figure>
  );
}
