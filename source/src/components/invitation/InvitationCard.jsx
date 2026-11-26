import { Fragment, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ScallopedFrame from '../ui/ScallopedFrame';
import GaneshaEmblem from '../ui/GaneshaEmblem';
import Ornament from '../ui/Ornament';
import { artwork } from '../../config/artwork';
import { brideFull, groomFull } from '../ui/names';
import { useLanguage } from '../../i18n';

const reveal = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* Room the card leaves on screen: a margin above it and the navigation dock below it. */
const SHORT_SCREEN = '(orientation: landscape) and (max-height: 500px)';
const reserveFor = (short) => (short ? 24 : 100);
/* Never shrink text below this share of its normal size: past it, a little scrolling reads better. */
const MIN_FIT = 0.86;

/**
 * Every size inside the card is in em, so one number (--fit) scales the whole card.
 * Shrinks it until it fits one screen, measuring against the stable viewport
 * (documentElement.clientHeight, which ignores a phone's URL bar sliding away) so it
 * never jumps while the guest scrolls. Runs again once the fonts arrive, on rotation
 * and on a language change.
 */
function useFitToScreen(ref, key) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;
    const fit = () => {
      frame = 0;
      const short = window.matchMedia(SHORT_SCREEN).matches;
      const avail = document.documentElement.clientHeight - reserveFor(short);
      let s = 1;
      el.style.setProperty('--fit', '1');
      for (let i = 0; i < 5; i += 1) {
        const h = el.offsetHeight;
        if (h <= avail || s <= MIN_FIT) break;
        s = Math.max(MIN_FIT, s * (avail / h) * 0.99);
        el.style.setProperty('--fit', s.toFixed(3));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(fit);
    };
    fit();
    let lastW = window.innerWidth;
    let lastH = document.documentElement.clientHeight;
    const onResize = () => {
      const w = window.innerWidth;
      const h = document.documentElement.clientHeight;
      if (w === lastW && Math.abs(h - lastH) < 2) return;
      lastW = w;
      lastH = h;
      schedule();
    };
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(schedule);
    document.fonts?.addEventListener?.('loadingdone', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      document.fonts?.removeEventListener?.('loadingdone', schedule);
    };
  }, [ref, key]);
}

/** "Sons of Smt. Vineeta & Shri Prem…" with the (English-lettered) names isolated from the sentence. */
function Lineage({ template, names, className = '' }) {
  const [before, after = ''] = template.split('{name}');
  return (
    <p className={`font-display text-[0.9em] leading-snug text-charcoal-soft ${className}`}>
      {before}
      <bdi className="font-medium text-charcoal">{names}</bdi>
      {after}
    </p>
  );
}

/** Honorific in small capitals over the full name in script, kept left-to-right in Urdu and Sindhi. */
function Name({ honorific, name }) {
  return (
    <div dir="ltr" className="flex min-w-0 flex-col items-center">
      {honorific && <span className="font-caps text-[0.72em] font-semibold tracking-[0.2em] text-saffron-dark">{honorific}</span>}
      <span className="font-script text-[2em] leading-[1.12] text-crimson sm:text-[2.25em]">{name}</span>
    </div>
  );
}

const Amp = () => (
  <span className="gold-foil self-center px-[0.1em] font-script text-[1.9em] leading-none" aria-hidden="true">
    &amp;
  </span>
);

const honorificOf = (prefix, title) => [prefix, title].filter(Boolean).join(' ');

/**
 * The twins and their brides as two columns: each groom stands over his bride, so the
 * pairs read down, and the shared parents are named once between them.
 */
function Couples({ couples, hosts }) {
  const { t } = useLanguage();
  const [a, b] = couples;
  const grooms = [a, b].map((c) => <Name key={c.groom} honorific={honorificOf(c.groomPrefix, c.groomTitle)} name={groomFull(c)} />);
  const brides = [a, b].map((c) => <Name key={c.bride} honorific={honorificOf(c.bridePrefix, c.brideTitle)} name={brideFull(c)} />);
  const withLine = <p className="my-[0.4em] font-display text-[0.95em] italic text-saffron-dark">— {t('with')} —</p>;

  return (
    <motion.div variants={reveal} className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-[0.5em]">
      {grooms[0]}
      <Amp />
      {grooms[1]}

      <Lineage template={t('sonsOf')} names={hosts} className="col-span-3 mt-[0.35em]" />

      {withLine}
      <span />
      {withLine}

      {brides[0]}
      <Amp />
      {brides[1]}

      {[a, b].map((c, i) => (
        <Fragment key={c.bride}>
          {i === 1 && <span />}
          <div className="mt-[0.2em]">
            {c.brideParents && <Lineage template={t('daughterOf')} names={c.brideParents} className="text-[0.84em]" />}
            {c.brideHometown && <p className="font-display text-[0.84em] text-charcoal-soft">{c.brideHometown}</p>}
          </div>
        </Fragment>
      ))}
    </motion.div>
  );
}

/** The formal invitation from the grooms' parents, on a scalloped ivory card sized to one screen. */
export default function InvitationCard({ wedding }) {
  const { family, invitation, venue, couples } = wedding;
  const { t, language } = useLanguage();
  const cardRef = useRef(null);
  useFitToScreen(cardRef, language);

  return (
    <div ref={cardRef} className="inv-card mx-auto w-full max-w-[600px] lg:max-w-[660px] short:max-w-[880px]">
      <ScallopedFrame contentClassName="px-[1.7em] py-[2em] sm:px-[2.6em] sm:py-[2.3em] short:px-[2.4em] short:py-[1.7em]">
        <motion.article
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="inv-grid text-center"
          aria-label={t('invitationAria')}
        >
          {/* Blessing and the hosts' request */}
          <motion.header variants={reveal} className="inv-head flex flex-col items-center">
            <GaneshaEmblem image={artwork.ganesha} label={t('ganesha')} className="h-[3.3em] w-[3.3em]" />
            <p dir="ltr" className="mt-[0.4em] font-caps text-[0.8em] font-semibold tracking-[0.16em] text-crimson">
              {invitation.mantra}
            </p>
            {family.blessings && (
              <p className="mt-[0.8em] max-w-[26em] font-display text-[0.98em] italic leading-snug text-charcoal-soft">{family.blessings}</p>
            )}
            <p dir="ltr" className="mt-[0.35em] font-display text-[1.3em] font-semibold leading-tight text-charcoal">
              {family.hosts}
            </p>
            <p className="mt-[0.3em] max-w-[27em] font-display text-[1.02em] leading-snug text-charcoal">{invitation.request}</p>
          </motion.header>

          <div className="inv-orn-1 flex justify-center py-[0.9em]" aria-hidden="true">
            <Ornament className="h-[0.7em] w-[11em]" />
          </div>

          <div className="inv-couples">
            <Couples couples={couples} hosts={family.hosts} />
          </div>

          <div className="inv-orn-2 flex justify-center py-[0.9em]" aria-hidden="true">
            <Ornament className="h-[0.7em] w-[11em]" />
          </div>

          {/* When and where */}
          <motion.div variants={reveal} className="inv-when flex flex-col items-center">
            <p className="font-caps text-[0.84em] font-semibold tracking-[0.12em] text-crimson">{invitation.dateLine}</p>
            <p className="mt-[0.25em] font-display text-[1.15em] leading-tight text-charcoal">
              <span className="italic text-charcoal-soft">{t('at')}</span> <span className="font-semibold">{venue.name}</span>
            </p>
            <p className="font-display text-[0.9em] text-charcoal-soft">{venue.address}</p>
          </motion.div>

          {/* Closing words, the family's couplet and their regards */}
          <motion.div variants={reveal} className="inv-close mt-[0.8em] flex flex-col items-center">
            <p className="font-display text-[1em] italic text-charcoal">{invitation.closing}</p>
            {invitation.quote && (
              <blockquote className="mt-[0.6em] w-full max-w-[28em] border-y border-gold/50 px-[0.6em] py-[0.55em]">
                <p className="font-display text-[1.02em] italic leading-snug text-crimson">“{invitation.quote}”</p>
                {invitation.quoteBy && (
                  <cite className="mt-[0.35em] block font-caps text-[0.7em] font-semibold not-italic tracking-[0.16em] text-saffron-dark">
                    — <bdi>{invitation.quoteBy}</bdi>
                  </cite>
                )}
              </blockquote>
            )}
            {invitation.compliments && (
              <p className="mt-[0.6em] font-caps text-[0.72em] font-semibold tracking-[0.12em] text-saffron-dark">{invitation.compliments}</p>
            )}
          </motion.div>
        </motion.article>
      </ScallopedFrame>
    </div>
  );
}
