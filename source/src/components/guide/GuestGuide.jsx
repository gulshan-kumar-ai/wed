import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n';
import SectionHeading from '../ui/SectionHeading';

const iconProps = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'url(#guide-gold)',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  className: 'h-14 w-14',
};

function GuideGold() {
  return (
    <defs>
      <linearGradient id="guide-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E3C25C" />
        <stop offset="1" stopColor="#9C7A1E" />
      </linearGradient>
    </defs>
  );
}

function TravelIcon() {
  return (
    <svg {...iconProps}>
      <GuideGold />
      <path d="M8 44 H56" />
      <path d="M12 44 V30 a4 4 0 0 1 4 -4 H40 l8 8 h4 a4 4 0 0 1 4 4 V44" fill="#E67E22" fillOpacity="0.12" />
      <circle cx="20" cy="46" r="5" fill="#FDF8F0" />
      <circle cx="46" cy="46" r="5" fill="#FDF8F0" />
      <path d="M18 26 V20 M30 26 V20 M14 20 H34" stroke="#A93226" />
      <path d="M40 18 l6 -6 m0 0 l2 8 m-2 -8 l-8 2" stroke="#A93226" strokeWidth="1.6" />
    </svg>
  );
}

function AttireIcon() {
  return (
    <svg {...iconProps}>
      <GuideGold />
      <circle cx="48" cy="14" r="6" stroke="#E67E22" />
      <path d="M48 4 v2 M48 22 v2 M38 14 h2 M56 14 h2" stroke="#E67E22" strokeWidth="1.6" />
      <path d="M24 10 h12 l4 8 l-6 4 v32 H26 V22 l-6 -4 z" fill="#A93226" fillOpacity="0.12" />
      <path d="M26 30 h8 M26 38 h8 M26 46 h8" strokeWidth="1.4" />
      <path d="M14 24 l6 -6 M46 24 l-6 -6" strokeWidth="1.4" />
    </svg>
  );
}

function HospitalityIcon() {
  return (
    <svg {...iconProps}>
      <GuideGold />
      <path d="M12 34 c0 -10 8 -18 20 -18 s20 8 20 18" fill="#E67E22" fillOpacity="0.12" />
      <path d="M8 34 H56" />
      <path d="M32 16 v-4 M28 12 h8" stroke="#A93226" />
      <path d="M18 44 c4 6 10 8 14 8 s10 -2 14 -8" />
      <path d="M24 34 v4 a8 8 0 0 0 16 0 v-4" stroke="#A93226" strokeWidth="1.6" />
    </svg>
  );
}

const isRealNumber = (phone) => !/x/i.test(phone) && phone.replace(/\D/g, '').length >= 10;

function Coordinator({ c }) {
  const digits = c.phone.replace(/\D/g, '');
  const real = isRealNumber(c.phone);
  return (
    <li className="rounded-xl border border-gold/50 bg-ivory px-4 py-3 text-left">
      <p className="font-sans text-[15px] font-semibold text-charcoal">{c.name}</p>
      <p className="font-sans text-[13px] text-charcoal-soft">{c.role}</p>
      {real ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="rounded-full bg-crimson px-3 py-1.5 font-sans text-[12px] font-semibold text-white hover:bg-crimson-dark">
            Call {c.phone}
          </a>
          <a
            href={`https://wa.me/${digits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1F7A4D] px-3 py-1.5 font-sans text-[12px] font-semibold text-white hover:brightness-110"
          >
            WhatsApp
          </a>
        </div>
      ) : (
        <p className="mt-1 font-sans text-[13px] font-medium text-crimson">{c.phone}</p>
      )}
    </li>
  );
}

function Column({ icon, title, children, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center rounded-[1.75rem] border border-gold/60 bg-white/55 px-6 py-9 text-center shadow-[0_16px_40px_rgba(80,30,10,0.08)] sm:px-8"
    >
      <span className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/60 bg-ivory shadow-inner">{icon}</span>
      <h3 className="mt-5 font-display text-[1.9rem] font-semibold leading-tight text-crimson">{title}</h3>
      <div className="mt-4 w-full">{children}</div>
    </motion.article>
  );
}

function Points({ points }) {
  return (
    <ul className="space-y-3 text-left">
      {points.map((p) => (
        <li key={p} className="flex gap-3 font-sans text-[15px] leading-relaxed text-charcoal">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron" aria-hidden="true" />
          {p}
        </li>
      ))}
    </ul>
  );
}

/** "Things to Know": travel, dress code & weather, and hospitality contacts for out-of-town guests. */
export default function GuestGuide({ wedding }) {
  const { travel, attire, hospitality } = wedding.guide;
  const { t } = useLanguage();
  return (
    <section className="relative bg-ivory-deep px-5 py-24 sm:px-8 sm:py-28" aria-labelledby="guide-heading">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="guide-heading" eyebrow="For our travelling guests" title="Things to Know" intro="A few notes to make your journey to Kunri easy and comfortable." />
        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          <Column icon={<TravelIcon />} title={travel.title} index={0}>
            <Points points={travel.points} />
          </Column>
          <Column icon={<AttireIcon />} title={attire.title} index={1}>
            <Points points={attire.points} />
          </Column>
          <Column icon={<HospitalityIcon />} title={hospitality.title} index={2}>
            <p className="font-sans text-[15px] leading-relaxed text-charcoal">{hospitality.intro}</p>
            <ul className="mt-4 space-y-3">
              {hospitality.coordinators.map((c) => (
                <Coordinator key={c.name} c={c} />
              ))}
            </ul>
          </Column>
        </div>
      </div>
    </section>
  );
}
