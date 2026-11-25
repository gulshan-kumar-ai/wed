import { motion } from 'framer-motion';
import ScallopedFrame from '../ui/ScallopedFrame';
import GaneshaEmblem from '../ui/GaneshaEmblem';
import Ornament from '../ui/Ornament';
import { artwork } from '../../config/artwork';
import { brideFull, groomFull } from '../ui/names';
import { useLanguage } from '../../i18n';

const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

/** Honorific + full name, kept left-to-right even inside Urdu or Sindhi text. */
function FullName({ honorific, name }) {
  return (
    <p dir="ltr" className="font-display text-[clamp(1.6rem,4.4vw,2.2rem)] font-semibold leading-tight text-crimson">
      {honorific && <span className="mr-2 text-[0.7em] font-medium text-saffron-dark">{honorific}</span>}
      {name}
    </p>
  );
}

/** "Son of Smt. Vineeta & Shri Prem…" with the (English-lettered) names isolated from the sentence. */
function Lineage({ template, names }) {
  const [before, after] = template.split('{name}');
  return (
    <p className="mt-1 font-sans text-[14px] leading-snug text-charcoal-soft sm:text-[15px]">
      {before}
      <bdi>{names}</bdi>
      {after}
    </p>
  );
}

function CoupleLines({ couple, hosts }) {
  const { t } = useLanguage();
  return (
    <motion.div variants={reveal} className="flex flex-col items-center">
      <FullName honorific={[couple.groomPrefix, couple.groomTitle].filter(Boolean).join(' ')} name={groomFull(couple)} />
      <Lineage template={t('sonOf')} names={hosts} />

      <p className="my-2 font-display text-lg italic text-saffron-dark">{t('with')}</p>

      <FullName honorific={[couple.bridePrefix, couple.brideTitle].filter(Boolean).join(' ')} name={brideFull(couple)} />
      {couple.brideParents && <Lineage template={t('daughterOf')} names={couple.brideParents} />}
      {couple.brideHometown && <p className="font-sans text-[14px] text-charcoal-soft">{couple.brideHometown}</p>}
    </motion.div>
  );
}

/** The formal invitation from the grooms' parents, on a scalloped ivory card. */
export default function InvitationCard({ wedding }) {
  const { family, invitation, venue, couples } = wedding;
  const { t } = useLanguage();

  return (
    <ScallopedFrame className="mx-auto w-full max-w-[640px]" contentClassName="px-7 py-14 sm:px-14 sm:py-16">
      <motion.article
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="flex flex-col items-center text-center"
        aria-label={t('invitationAria')}
      >
        <motion.div variants={reveal}>
          <GaneshaEmblem image={artwork.ganesha} className="h-20 w-20 sm:h-24 sm:w-24" />
        </motion.div>
        <motion.p variants={reveal} dir="ltr" className="mt-3 font-display text-lg font-semibold tracking-[0.12em] text-crimson sm:text-xl">
          {invitation.mantra}
        </motion.p>

        {family.blessings && (
          <motion.p variants={reveal} className="mt-6 max-w-md font-display text-lg italic text-charcoal-soft">
            {family.blessings}
          </motion.p>
        )}

        <motion.p variants={reveal} dir="ltr" className="mt-5 font-display text-2xl font-semibold text-charcoal sm:text-[1.7rem]">
          {family.hosts}
        </motion.p>
        <motion.p variants={reveal} className="mt-3 max-w-md font-display text-lg leading-relaxed text-charcoal sm:text-xl">
          {invitation.request}
        </motion.p>

        <motion.div variants={reveal} className="mt-8">
          <Ornament className="h-3 w-48" />
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <CoupleLines couple={couples[0]} hosts={family.hosts} />
          <motion.span variants={reveal} className="gold-foil font-display text-5xl italic leading-none" aria-hidden="true">
            &amp;
          </motion.span>
          <CoupleLines couple={couples[1]} hosts={family.hosts} />
        </div>

        <motion.div variants={reveal} className="mt-10">
          <Ornament className="h-3 w-48" />
        </motion.div>

        <motion.p variants={reveal} className="mt-8 font-sans text-[13px] font-semibold uppercase tracking-[0.24em] text-crimson sm:text-sm">
          {invitation.dateLine}
        </motion.p>
        <motion.div variants={reveal} className="mt-4">
          <p className="font-display text-lg italic text-charcoal-soft">{t('at')}</p>
          <p className="font-display text-2xl font-semibold text-charcoal">{venue.name}</p>
          <p className="mt-1 font-sans text-[15px] text-charcoal-soft">{venue.address}</p>
        </motion.div>

        <motion.p variants={reveal} className="mt-8 max-w-sm font-display text-lg italic text-charcoal">
          {invitation.closing}
        </motion.p>

        {invitation.quote && (
          <motion.blockquote variants={reveal} className="mt-6 max-w-md border-y border-gold/40 px-4 py-5 text-center">
            <p className="font-display text-[1.25rem] italic leading-relaxed text-crimson sm:text-[1.35rem]">“{invitation.quote}”</p>
            {invitation.quoteBy && (
              <cite className="mt-3 block font-sans text-xs font-semibold not-italic uppercase tracking-[0.22em] text-saffron-dark">
                — <bdi>{invitation.quoteBy}</bdi>
              </cite>
            )}
          </motion.blockquote>
        )}
        {invitation.compliments && (
          <motion.p variants={reveal} className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-saffron-dark">
            {invitation.compliments}
          </motion.p>
        )}
      </motion.article>
    </ScallopedFrame>
  );
}
