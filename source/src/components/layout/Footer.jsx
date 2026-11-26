import { OmMedallion, Swastika } from '../ui/SacredEmblem';
import ShareButton from '../ui/ShareButton';
import { useLanguage } from '../../i18n';

/** Slim closing strip under the finale, with the music credit its licence asks for. */
export default function Footer({ wedding }) {
  const { couples, location, dates, footer, music } = wedding;
  const { t } = useLanguage();
  const credit = music?.credit;
  const link = 'underline decoration-ivory/30 underline-offset-2 hover:text-ivory';

  return (
    <footer className="bg-[#12132E] px-6 pb-28 pt-8 text-center text-ivory">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="flex items-center gap-4">
          <Swastika className="h-4 w-4 text-gold" />
          <OmMedallion className="h-12 w-12" />
          <Swastika className="h-4 w-4 text-gold" />
        </div>
        <p dir="ltr" className="mt-4 font-display text-[clamp(1.3rem,3.5vw,1.8rem)] font-semibold leading-tight text-gold-light">
          {couples[0].groom} &amp; {couples[0].bride} <span className="text-ivory/70">·</span> {couples[1].groom} &amp; {couples[1].bride}
        </p>
        <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-ivory/90 sm:text-[13px]">
          {location} · {dates}
        </p>
        {footer.hashtag && (
          <p dir="ltr" className="mt-3 font-sans text-sm font-semibold tracking-[0.14em] text-saffron-light">
            {footer.hashtag}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <ShareButton wedding={wedding} />
        </div>
        {credit && (
          <p className="mt-6 max-w-md font-sans text-xs leading-relaxed text-ivory/60">
            {t('musicCredit')}:{' '}
            <a href={credit.source} target="_blank" rel="noopener noreferrer" className={link}>
              <bdi>{credit.title}</bdi>
            </a>{' '}
            · <bdi>{credit.artist}</bdi> ·{' '}
            <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer license" className={link}>
              {credit.license}
            </a>{' '}
            ({t('edited')})
          </p>
        )}
      </div>
    </footer>
  );
}
