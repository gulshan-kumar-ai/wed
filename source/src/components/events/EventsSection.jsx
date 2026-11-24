import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n';
import ScallopedFrame from '../ui/ScallopedFrame';
import SectionHeading from '../ui/SectionHeading';
import { MOTIFS } from '../ui/MotifIcons';
import CalendarMenu from './CalendarMenu';
import { formatDay, formatTime } from './calendar';

function Detail({ label, children }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-gold/35 py-2.5 text-left first:border-t-0 sm:grid-cols-[7.5rem_1fr]">
      <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-crimson">{label}</dt>
      <dd className="font-sans text-[15px] font-medium leading-snug text-charcoal">{children}</dd>
    </div>
  );
}

function EventCard({ event, venue, timeZone, index }) {
  const Icon = MOTIFS[event.motif] ?? MOTIFS.lotus;
  const location = venue ? `${venue.name}, ${venue.address}` : '';
  const calendarEvent = {
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    location,
    details: [event.description, event.dressCode && `Dress code: ${event.dressCode}`, event.muhurat && `Phere muhurat: ${event.muhurat}`].filter(Boolean).join('\n'),
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
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-saffron-dark">
          Ceremony {String(index + 1).padStart(2, '0')}
        </span>
        <Icon className="mt-4 h-16 w-16" />
        <h3 className="mt-4 font-display text-[1.9rem] font-semibold leading-tight text-crimson sm:text-[2.1rem]">{event.title}</h3>
        {event.subtitle && <p className="font-display text-xl italic text-saffron-dark">({event.subtitle})</p>}
        <p className="mt-3 max-w-sm font-sans text-[15px] leading-relaxed text-charcoal">{event.description}</p>

        <dl className="mt-6 w-full max-w-sm">
          <Detail label="Date">{formatDay(event.start, timeZone)}</Detail>
          <Detail label="Time">
            {formatTime(event.start, timeZone)} – {formatTime(event.end, timeZone)}
          </Detail>
          {event.route ? (
            <Detail label="Route">
              {event.route.from} <span className="text-saffron-dark">→</span> {event.route.to}, Kunri
            </Detail>
          ) : (
            venue && <Detail label="Venue">{venue.name}, Kunri</Detail>
          )}
          {event.muhurat && <Detail label="Muhurat">Phere · {event.muhurat}</Detail>}
          {event.dressCode && <Detail label="Dress code">{event.dressCode}</Detail>}
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
  const { events, venues, timeZone } = wedding;
  const { t } = useLanguage();
  const venueById = Object.fromEntries(venues.map((v) => [v.id, v]));

  return (
    <section className="relative bg-ivory px-5 py-24 sm:px-8 sm:py-28" aria-labelledby="events-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(212,175,55,0.35)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          id="events-heading"
          eyebrow={t('celebrationsEyebrow')}
          title={t('celebrationsTitle')}
          intro={t('celebrationsIntro')}
        />
        <ol className="mt-16 grid gap-8 md:grid-cols-2 md:gap-10">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} venue={venueById[event.venueId]} timeZone={timeZone} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
