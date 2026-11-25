import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useElementSize } from '../../hooks/useElementSize';
import { useLanguage } from '../../i18n';

const GAP = 20;

/**
 * Draggable, swipeable horizontal photo carousel with arrow buttons,
 * keyboard support (← →) and position dots. Only given items that have a photo.
 */
export default function GalleryCarousel({ items, label }) {
  const { t } = useLanguage();
  const viewportRef = useRef(null);
  const { width: vw } = useElementSize(viewportRef);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);

  const itemW = vw ? (vw < 640 ? vw * 0.78 : Math.min(340, (vw - GAP * 2) / 3)) : 300;
  const step = itemW + GAP;
  const maxShift = Math.max(0, items.length * step - GAP - vw);
  const lastIndex = vw ? Math.min(items.length - 1, Math.ceil(maxShift / step)) : items.length - 1;

  const offsetFor = useCallback((i) => -Math.min(i * step, maxShift), [step, maxShift]);

  const goTo = useCallback(
    (i) => {
      const next = Math.max(0, Math.min(lastIndex, i));
      setIndex(next);
      animate(x, offsetFor(next), { type: 'spring', stiffness: 260, damping: 34 });
    },
    [lastIndex, offsetFor, x],
  );

  // Re-snap when the viewport resizes
  useEffect(() => {
    x.set(offsetFor(Math.min(index, lastIndex)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vw]);

  const onDragEnd = (_, info) => {
    const projected = -(x.get() + info.velocity.x * 0.25);
    goTo(Math.round(projected / step));
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  const arrow =
    'flex h-11 w-11 items-center justify-center rounded-full border border-gold/70 bg-ivory text-crimson shadow-sm transition hover:bg-gold-pale disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron';

  return (
    // The drag maths runs left to right, so the strip stays LTR in Urdu and Sindhi too
    <div role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown} dir="ltr">
      {/* `relative` so absolutely positioned children (e.g. sr-only captions) are clipped too */}
      <div ref={viewportRef} className="relative overflow-hidden rounded-b-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron" tabIndex={0} aria-live="polite">
        <motion.ul
          className="flex cursor-grab touch-pan-y active:cursor-grabbing"
          style={{ x, gap: GAP }}
          drag="x"
          dragConstraints={{ left: -maxShift, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={onDragEnd}
        >
          {items.map((item, i) => (
            <li
              key={i}
              className="shrink-0"
              style={{ width: itemW }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}: ${item.caption}`}
            >
              <figure>
                <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl border-2 border-gold/80 bg-ivory p-1.5 shadow-[0_12px_30px_rgba(80,30,10,0.15)]">
                  <div className="h-full w-full overflow-hidden rounded-t-[999px] rounded-b-xl">
                    <img src={item.src} alt={item.caption} className="pointer-events-none h-full w-full select-none object-cover" draggable="false" loading="lazy" />
                  </div>
                </div>
                <figcaption dir="auto" className="mt-3 text-center font-display text-lg italic text-charcoal">{item.caption}</figcaption>
              </figure>
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button type="button" className={arrow} onClick={() => goTo(index - 1)} disabled={index === 0} aria-label={t('prevPhoto')}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: lastIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t('goToPhoto', { n: i + 1 })}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-7 bg-crimson' : 'w-2 bg-gold/60 hover:bg-gold'}`}
            />
          ))}
        </div>
        <button type="button" className={arrow} onClick={() => goTo(index + 1)} disabled={index >= lastIndex} aria-label={t('nextPhoto')}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}
