import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n';
import ScallopedFrame from '../ui/ScallopedFrame';
import SectionHeading from '../ui/SectionHeading';
import { MOTIFS } from '../ui/MotifIcons';
import CalendarMenu from './CalendarMenu';
import { formatDay, formatTimeRange } from './calendar';
import BaraatProcession from './BaraatProcession';

function Detail({ label, children }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-gold/35 py-2.5 text-start first:border-t-0 sm:grid-cols-[7.5rem_1fr]">
      <dt className="pt-0.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-crimson">{label}</dt>
      <dd className="font-sans text-[15px] font-medium leading-snug text-charcoal">{children}</dd>
    </div>
  );
}

function ProvisionalTag() {
  const { t } = useLanguage();
  return (
    <span className="ms-2 inline-block rounded-full bg-saffron/15 px-2 py-0.5 align-middle font-sans text-xs font-semibold text-saffron-dark">
      {t('provisional')}
    </span>
  );
}

function EventCard({ event, venue, timeZone, index, confirmed }) {
  const { t, language, rtl } = useLanguage();
  const Icon = MOTIFS[event.motif] ?? MOTIFS.lotus;
  const location = venue ? `${venue.name}${t('comma')}${venue.address}` : '';
  const muhurat =
    event.muhurat && (typeof event.muhurat === 'string' ? event.muhurat : formatTimeRange(event.muhurat.start, event.muhurat.end, timeZone, language));
  const calendarEvent = {
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    location,
    tentative: !confirmed,
    details: [
      event.description,
      event.dressCode && t('calDress', { v: event.dressCode }),
      muhurat && t('calMuhurat', { v: muhurat }),
      !confirmed && t('calProvisional'),
    ]
      .filter(Boolean)
      .join('\n'),
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <ScallopedFrame className="h-full" contentClassName="flex h-full flex-col items-center px-7 pb-10 pt-11 text-center sm:px-10">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-saffron-dark">
          {t('ceremony')} {String(index + 1).padStart(2, '0')}
        </span>
        <Icon className="mt-4 h-16 w-16" />
        <h3 className="mt-4 font-display text-[1.9rem] font-semibold leading-tight text-crimson sm:text-[2.1rem]">{event.title}</h3>
        {event.subtitle && <p className="font-display text-xl italic text-saffron-dark">({event.subtitle})</p>}
        <p className="mt-3 max-w-sm font-sans text-[15px] leading-relaxed text-charcoal">{event.description}</p>

        {event.id === 'baraat' && <BaraatProcession className="mt-5" label={t('baraatAria')} />}

        <dl className="mt-6 w-full max-w-sm">
          <Detail label={t('date')}>{formatDay(event.start, timeZone, language)}</Detail>
          <Detail label={t('time')}>
            {formatTimeRange(event.start, event.end, timeZone, language)}
            {!confirmed && <ProvisionalTag />}
          </Detail>
          {event.route ? (
            <Detail label={t('route')}>
              {event.route.from} <span className="text-saffron-dark">{rtl ? '←' : '→'}</span> {event.route.to}
              {t('comma')}
              {t('kunri')}
            </Detail>
          ) : (
            venue && (
              <Detail label={t('venue')}>
                {venue.name}
                {t('comma')}
                {t('kunri')}
              </Detail>
            )
          )}
          {muhurat && (
            <Detail label={t('muhurat')}>
              {t('phere')} · {muhurat}
              {!confirmed && <ProvisionalTag />}
            </Detail>
          )}
          {event.dressCode && <Detail label={t('dressCode')}>{event.dressCode}</Detail>}
        </dl>

        <div className="mt-auto pt-7">
          <CalendarMenu event={calendarEvent} />
        </div>
      </ScallopedFrame>
    </motion.li>
  );
}

/** Four ceremonies in a 2 × 2 grid (single column on mobile). */
export default function EventsSection({ wedding }) {
  const { events, venues, timeZone, timingsConfirmed } = wedding;
  const { t } = useLanguage();
  const venueById = Object.fromEntries(venues.map((v) => [v.id, v]));

  return (
    <section id="events" className="relative bg-ivory px-5 py-24 sm:px-8 sm:py-28" aria-labelledby="events-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(212,175,55,0.35)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading id="events-heading" eyebrow={t('celebrationsEyebrow')} title={t('celebrationsTitle')} intro={t('celebrationsIntro')} />
        {!timingsConfirmed && (
          <p className="mx-auto mt-6 flex max-w-xl items-start justify-center gap-2 rounded-2xl border border-saffron/40 bg-saffron/10 px-5 py-3 text-center font-sans text-[15px] font-medium leading-relaxed text-charcoal">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-saffron-dark" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {t('provisionalNote')}
          </p>
        )}
        <ol className="mt-14 grid gap-8 md:grid-cols-2 md:gap-10">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} venue={venueById[event.venueId]} timeZone={timeZone} index={i} confirmed={!!timingsConfirmed} />
          ))}
        </ol>
      </div>
    </section>
  );
}
