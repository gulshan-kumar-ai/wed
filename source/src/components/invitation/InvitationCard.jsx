import { motion } from 'framer-motion';
import ScallopedFrame from '../ui/ScallopedFrame';
import GaneshaEmblem from '../ui/GaneshaEmblem';
import Ornament from '../ui/Ornament';
import { artwork } from '../../config/artwork';
import { brideFull, groomFull } from '../ui/names';

const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

function CoupleLines({ couple, hosts }) {
  return (
    <motion.div variants={reveal} className="flex flex-col items-center">
      <p className="font-display text-[clamp(1.6rem,4.4vw,2.2rem)] font-semibold leading-tight text-crimson">
        <span className="mr-2 text-[0.55em] font-medium text-saffron-dark">
          {[couple.groomPrefix, couple.groomTitle].filter(Boolean).join(' ')}
        </span>
        {groomFull(couple)}
      </p>
      <p className="mt-1 font-sans text-[13px] leading-snug text-charcoal-soft sm:text-sm">Son of {hosts}</p>

      <p className="my-2 font-display text-lg italic text-saffron-dark">with</p>

      <p className="font-display text-[clamp(1.6rem,4.4vw,2.2rem)] font-semibold leading-tight text-crimson">
        <span className="mr-2 text-[0.55em] font-medium text-saffron-dark">
          {[couple.bridePrefix, couple.brideTitle].filter(Boolean).join(' ')}
        </span>
        {brideFull(couple)}
      </p>
      {(couple.brideParents || couple.brideHometown) && (
        <p className="mt-1 font-sans text-[13px] leading-snug text-charcoal-soft sm:text-sm">
          {couple.brideParents && <>Daughter of {couple.brideParents}</>}
          {couple.brideHometown && <span className="block">{couple.brideHometown}</span>}
        </p>
      )}
    </motion.div>
  );
}

/** The formal invitation from the grooms' parents, on a scalloped ivory card. */
export default function InvitationCard({ wedding }) {
  const { family, invitation, venue, couples } = wedding;

  return (
    <ScallopedFrame className="mx-auto w-full max-w-[640px]" contentClassName="px-8 py-14 sm:px-14 sm:py-16">
      <motion.article
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="flex flex-col items-center text-center"
        aria-label="Wedding invitation"
      >
        <motion.div variants={reveal}>
          <GaneshaEmblem image={artwork.ganesha} className="h-20 w-20 sm:h-24 sm:w-24" />
        </motion.div>
        <motion.p variants={reveal} className="mt-3 font-display text-lg font-semibold tracking-[0.12em] text-crimson sm:text-xl">
          {invitation.mantra}
        </motion.p>

        {family.blessings && (
          <motion.p variants={reveal} className="mt-6 max-w-md font-display text-base italic text-charcoal-soft sm:text-lg">
            {family.blessings}
          </motion.p>
        )}

        <motion.p variants={reveal} className="mt-5 font-display text-2xl font-semibold text-charcoal sm:text-[1.7rem]">
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

        <motion.p variants={reveal} className="mt-8 font-sans text-[12px] font-semibold uppercase tracking-[0.32em] text-crimson sm:text-[13px]">
          {invitation.dateLine}
        </motion.p>
        <motion.div variants={reveal} className="mt-4">
          <p className="font-display text-lg italic text-charcoal-soft">at</p>
          <p className="font-display text-2xl font-semibold text-charcoal">{venue.name}</p>
          <p className="mt-1 font-sans text-sm text-charcoal-soft">{venue.address}</p>
        </motion.div>

        <motion.p variants={reveal} className="mt-8 max-w-sm font-display text-lg italic text-charcoal">
          {invitation.closing}
        </motion.p>

        {invitation.quote && (
          <motion.blockquote variants={reveal} className="mt-6 max-w-md border-y border-gold/40 px-4 py-5 text-center">
            <p className="font-display text-[1.25rem] leading-relaxed italic text-crimson sm:text-[1.35rem]">
              “{invitation.quote}”
            </p>
            {invitation.quoteBy && (
              <cite className="mt-3 block font-sans text-[11px] not-italic font-semibold uppercase tracking-[0.28em] text-saffron-dark">
                — {invitation.quoteBy}
              </cite>
            )}
          </motion.blockquote>
        )}
        {invitation.compliments && (
          <motion.p variants={reveal} className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-dark">
            {invitation.compliments}
          </motion.p>
        )}
      </motion.article>
    </ScallopedFrame>
  );
}
