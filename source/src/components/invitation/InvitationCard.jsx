import { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import ScrollBanner from '../ui/ScrollBanner';
import GaneshaEmblem from '../ui/GaneshaEmblem';
import Ornament from '../ui/Ornament';
import { artwork } from '../../config/artwork';
import { brideFull, groomFull } from '../ui/names';
import { useLanguage } from '../../i18n';

const reveal = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const SHORT_SCREEN = '(orientation: landscape) and (max-height: 500px)';
const reserveFor = (short) => (short ? 24 : 100);
const MIN_FIT = 0.86;

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
    const schedule = () => { if (!frame) frame = requestAnimationFrame(fit); };
    fit();
    let lastW = window.innerWidth;
    let lastH = document.documentElement.clientHeight;
    const onResize = () => {
      const w = window.innerWidth;
      const h = document.documentElement.clientHeight;
      if (w === lastW && Math.abs(h - lastH) < 2) return;
      lastW = w; lastH = h; schedule();
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

/* ── Typography helpers ──────────────────────────────────────────── */
/* On the dark crimson scroll all text is ivory / gold — not dark charcoal */

function Lineage({ template, names, className = '', small = false }) {
  const [before, after = ''] = template.split('{name}');
  return (
    <p className={`font-display leading-snug text-ivory/65 ${small ? 'text-[12px]' : 'text-[13px]'} ${className}`}>
      {before}<bdi className="font-medium text-ivory/85">{names}</bdi>{after}
    </p>
  );
}

/* Letter-by-letter animated name.
   Each word's letters are wrapped in a nowrap span so the browser can only
   break at real spaces — never mid-word (e.g. "(Gaurav)" stays on one line). */
function AnimatedLetters({ text, className }) {
  const words = text.split(' ');
  let globalIndex = 0;

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      className={className}
    >
      {words.map((word, wi) => {
        const chars = [...word];
        const wordStart = globalIndex;
        globalIndex += chars.length + 1;
        return (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {chars.map((ch, ci) => (
              <motion.span
                key={wordStart + ci}
                variants={{
                  hidden: { opacity: 0, y: 7 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
                }}
                style={{ display: 'inline-block' }}
              >
                {ch}
              </motion.span>
            ))}
            {wi < words.length - 1 && ' '}
          </span>
        );
      })}
    </motion.span>
  );
}

function Name({ honorific, name }) {
  return (
    <div dir="ltr" className="flex min-w-0 flex-col items-center">
      {honorific && (
        <span className="font-caps font-semibold tracking-[0.2em] text-saffron-light"
              style={{ fontSize: 'max(12px, 0.75em)' }}>
          {honorific}
        </span>
      )}
      {/* Gold script name on the crimson scroll */}
      <AnimatedLetters
        text={name}
        className="font-script text-[2em] leading-[1.12] text-gold-light sm:text-[2.25em]"
      />
    </div>
  );
}

/* WEDS badge — dark medallion with gold lettering */
const WedsBadge = () => (
  <div className="my-[0.38em] flex w-full items-center gap-[0.5em] px-[0.4em]" aria-hidden="true">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
    <span
      className="flex items-center justify-center rounded-full border border-gold/70 px-[0.75em] py-[0.18em] font-caps font-bold tracking-[0.22em] text-gold-light"
      style={{ fontSize: 'max(10px, 0.6em)', background: 'rgba(0,0,0,0.30)' }}
    >
      WEDS
    </span>
    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
  </div>
);

const honorificOf = (prefix, title) => [prefix, title].filter(Boolean).join(' ');

/* Two vertical couple columns with a gold centre divider */
function Couples({ couples }) {
  const { t } = useLanguage();
  const [a, b] = couples;

  const CouplePair = ({ couple }) => (
    <div className="flex flex-col items-center">
      <Name honorific={honorificOf(couple.groomPrefix, couple.groomTitle)} name={groomFull(couple)} />
      <WedsBadge />
      <Name honorific={honorificOf(couple.bridePrefix, couple.brideTitle)} name={brideFull(couple)} />
      {couple.brideParents && (
        <Lineage template={t('daughterOf')} names={couple.brideParents} className="mt-[0.2em] text-center" small />
      )}
    </div>
  );

  return (
    <motion.div variants={reveal} className="w-full">
      <div className="grid grid-cols-[1fr_1px_1fr] items-start gap-x-[0.6em]">
        <CouplePair couple={a} />
        <div className="mt-[0.4em] self-stretch bg-gradient-to-b from-transparent via-gold/55 to-transparent" />
        <CouplePair couple={b} />
      </div>
    </motion.div>
  );
}

/** Formal invitation card styled as a hanging royal-red scroll. */
export default function InvitationCard({ wedding }) {
  const { family, invitation, couples } = wedding;
  const { t, language } = useLanguage();
  const cardRef = useRef(null);
  useFitToScreen(cardRef, language);

  /* 3-D tilt on cursor (desktop only) */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 180, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 180, damping: 28 });

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <div
      ref={cardRef}
      className="inv-card mx-auto w-full max-w-[520px] lg:max-w-[560px] short:max-w-[820px]"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <ScrollBanner contentClassName="px-[1.7em] py-[2em] sm:px-[2.6em] sm:py-[2.3em] short:px-[2.4em] short:py-[1.7em]">

          {/* Om watermark — subtly visible on the dark red */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
            <span className="select-none font-script leading-none text-gold opacity-[0.07]"
                  style={{ fontSize: 'min(9em, 38vw)' }}>ॐ</span>
          </div>

          <motion.article
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="inv-grid relative text-center"
            aria-label={t('invitationAria')}
          >
            {/* Header — hosts & request */}
            <motion.header variants={reveal} className="inv-head flex flex-col items-center">
              <GaneshaEmblem image={artwork.ganesha} label={t('ganesha')} className="h-[3.3em] w-[3.3em]" />
              <p dir="ltr" className="mt-[0.4em] font-caps text-[13px] font-semibold tracking-[0.16em] text-gold-light">
                {invitation.mantra}
              </p>
              {family.blessings && (
                <p className="mt-[0.8em] max-w-[26em] font-display text-[0.98em] italic leading-snug text-ivory/80">
                  {family.blessings}
                </p>
              )}
              <p dir="ltr" className="mt-[0.35em] font-display text-[1.3em] font-semibold leading-tight text-ivory">
                {family.hosts}
              </p>
              <p className="mt-[0.3em] max-w-[27em] font-display text-[1.02em] leading-snug text-ivory/90">
                {invitation.request}
              </p>
            </motion.header>

            <div className="inv-orn-1 flex justify-center py-[0.9em]" aria-hidden="true">
              <Ornament className="h-[0.7em] w-[11em]" />
            </div>

            <div className="inv-couples">
              <Couples couples={couples} />
            </div>

            <div className="inv-orn-2 flex justify-center py-[0.9em]" aria-hidden="true">
              <Ornament className="h-[0.7em] w-[11em]" />
            </div>

            {/* Closing */}
            <motion.div variants={reveal} className="inv-close mt-[0.8em] flex flex-col items-center">
              <p className="font-display text-[1em] italic text-ivory/90">{invitation.closing}</p>
              {invitation.quote && (
                <blockquote className="mt-[0.6em] w-full max-w-[28em] border-y border-gold/40 px-[0.6em] py-[0.55em]">
                  <p className="font-display text-[1.02em] italic leading-snug text-ivory/95">
                    "{invitation.quote}"
                  </p>
                  {invitation.quoteBy && (
                    <cite className="mt-[0.35em] block font-caps text-[12px] font-semibold not-italic tracking-[0.16em] text-saffron-light">
                      — <bdi>{invitation.quoteBy}</bdi>
                    </cite>
                  )}
                </blockquote>
              )}
              {invitation.compliments && (
                <p className="mt-[0.6em] font-caps text-[12px] font-semibold tracking-[0.12em] text-gold-light">
                  {invitation.compliments}
                </p>
              )}
            </motion.div>
          </motion.article>
        </ScrollBanner>
      </motion.div>
    </div>
  );
}
