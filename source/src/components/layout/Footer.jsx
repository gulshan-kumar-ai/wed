import { OmMedallion, Swastika } from '../ui/SacredEmblem';

/** Slim closing strip under the finale. */
export default function Footer({ wedding }) {
  const { couples, location, dates, footer } = wedding;
  return (
    <footer className="bg-[#12132E] px-6 pb-10 pt-8 text-center text-ivory">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="flex items-center gap-4">
          <Swastika className="h-4 w-4 text-gold" />
          <OmMedallion className="h-12 w-12" />
          <Swastika className="h-4 w-4 text-gold" />
        </div>
        <p className="mt-4 font-display text-[clamp(1.3rem,3.5vw,1.8rem)] font-semibold leading-tight text-gold-light">
          {couples[0].groom} &amp; {couples[0].bride} <span className="text-ivory/70">·</span> {couples[1].groom} &amp; {couples[1].bride}
        </p>
        <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-ivory/90">
          {location} · {dates}
        </p>
        {footer.hashtag && <p className="mt-3 font-sans text-sm font-semibold tracking-[0.18em] text-saffron-light">{footer.hashtag}</p>}
      </div>
    </footer>
  );
}
