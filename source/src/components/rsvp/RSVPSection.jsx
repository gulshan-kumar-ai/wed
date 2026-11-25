import { useId, useMemo, useState } from 'react';
import { useLanguage } from '../../i18n';
import { AnimatePresence, motion } from 'framer-motion';
import RoyalScroll from './RoyalScroll';
import SectionHeading from '../ui/SectionHeading';
import { OmMedallion } from '../ui/SacredEmblem';
import Ornament from '../ui/Ornament';
import { readRsvp, saveRsvp } from '../../guest';

const labelCls = 'block font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-crimson';
const inputCls =
  'mt-2 w-full rounded-xl border border-gold/70 bg-white/70 px-4 py-3 font-sans text-base text-charcoal placeholder:text-charcoal-soft/60 transition focus:border-saffron focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron/30 aria-[invalid=true]:border-crimson';

function FieldError({ id, children }) {
  return children ? (
    <p id={id} className="mt-1.5 font-sans text-sm font-medium text-crimson">
      {children}
    </p>
  ) : null;
}

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.';
  const digits = v.phone.replace(/[^\d]/g, '');
  if (digits.length < 10 || digits.length > 15 || !/^[+\d\s()-]+$/.test(v.phone)) e.phone = 'Please enter a valid phone / WhatsApp number.';
  if (v.events.length === 0) e.events = 'Please choose at least one celebration.';
  if (!v.side) e.side = 'Please let us know whose guest you are.';
  return e;
}

/** Marigold & rose petals bursting outward from the centre. */
function PetalBurst() {
  const petals = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2 + (i % 3) * 0.2;
        const d = 120 + (i % 5) * 40;
        return { x: Math.cos(a) * d, y: Math.sin(a) * d - 40, r: (i * 47) % 360, c: ['#E67E22', '#F4B400', '#A93226', '#D4AF37'][i % 4] };
      }),
    [],
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-24" aria-hidden="true">
      {petals.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block h-3.5 w-2.5 rounded-[60%_60%_50%_50%]"
          style={{ background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 160], opacity: [1, 1, 0], rotate: p.r + 360, scale: 1 }}
          transition={{ duration: 2.4, ease: 'easeOut', delay: (i % 6) * 0.03 }}
        />
      ))}
    </div>
  );
}

function Confirmation({ response, wedding, onEdit }) {
  // "Sharma Family" reads better in full; long personal names just use the first word
  const name = response.name.trim().replace(/\s+/g, ' ');
  const greetName = name.length <= 24 ? name : name.split(' ')[0];
  const chosen = wedding.events.filter((e) => response.events.includes(e.id)).map((e) => e.short);
  const { whatsapp } = wedding.rsvp;
  const waText = [
    `RSVP: ${response.name}`,
    `Guests: ${response.guests}`,
    `Attending: ${chosen.join(', ')}`,
    `Side: ${response.side}`,
    response.note && `Blessing: ${response.note}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <motion.div
      key="thanks"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center text-center"
      role="status"
      aria-live="polite"
    >
      <PetalBurst />
      <OmMedallion className="h-20 w-20" />
      <p className="mt-5 font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-saffron-dark">Shubh Swagatam</p>
      <h3 className="mt-3 font-display text-[clamp(2.2rem,5vw,3rem)] font-semibold leading-tight text-crimson">
        Dhanyavaad, {greetName}!
      </h3>
      <p className="mt-4 max-w-md font-display text-xl leading-relaxed text-charcoal">
        Your presence has been noted with joy. The dhol is tuned and the marigolds are strung. We can’t wait to celebrate with you in Kunri.
      </p>
      <Ornament className="mt-6 h-3 w-48" />
      <dl className="mt-6 grid w-full max-w-sm gap-2 text-left font-sans text-[15px] text-charcoal">
        <div className="flex justify-between gap-4 border-b border-gold/40 pb-2">
          <dt className="font-semibold text-crimson">Guests</dt>
          <dd>{response.guests}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-gold/40 pb-2">
          <dt className="font-semibold text-crimson">Attending</dt>
          <dd className="text-right">{chosen.join(' · ')}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-semibold text-crimson">On behalf of</dt>
          <dd className="text-right">{response.side}</dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1F7A4D] px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-md transition hover:brightness-110"
          >
            Send on WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-gold px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-crimson transition hover:bg-gold-pale focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          Edit my response
        </button>
      </div>
    </motion.div>
  );
}

/** "Confirm Your Presence" RSVP form on a royal scroll, with an instant festive confirmation. */
export default function RSVPSection({ wedding, guest }) {
  const { events, couples, rsvp } = wedding;
  const { t } = useLanguage();
  const uid = useId();
  const sides = [`${couples[0].groom}'s Side`, `${couples[1].groom}'s Side`, 'Both Twins / Family Friend'];

  const saved = useMemo(() => readRsvp(), []);

  const [values, setValues] = useState(
    // A personal link (?to=…&n=…) pre-fills the name and party size
    saved ?? { name: guest?.to ?? '', phone: '', guests: guest?.n ?? 1, events: [], side: '', note: '' },
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(saved ? 'done' : 'idle'); // idle | sending | done | error

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const toggleEvent = (id) =>
    setValues((v) => ({ ...v, events: v.events.includes(id) ? v.events.filter((x) => x !== id) : [...v.events, id] }));
  const setGuests = (n) => setValues((v) => ({ ...v, guests: Math.max(1, Math.min(rsvp.maxGuests, n)) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus('sending');
    const payload = { ...values, submittedAt: new Date().toISOString() };
    try {
      if (rsvp.endpoint) {
        const res = await fetch(rsvp.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`RSVP failed: ${res.status}`);
      }
      saveRsvp(payload);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const describedBy = (key) => (errors[key] ? `${uid}-${key}-error` : undefined);

  return (
    <section id="rsvp" className="relative overflow-hidden bg-ivory px-5 py-24 sm:px-8 sm:py-28" aria-labelledby="rsvp-heading">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading id="rsvp-heading" eyebrow={t('rsvpEyebrow')} title={t('rsvpTitle')} intro={rsvp.deadline} />

        <RoyalScroll className="mt-14">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'done' ? (
              <Confirmation key="thanks" response={values} wedding={wedding} onEdit={() => setStatus('idle')} />
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-7"
              >
                <p className="text-center font-display text-xl italic text-charcoal">
                  Kindly grace us with your reply for the double wedding of {couples[0].groom} &amp; {couples[0].bride} and {couples[1].groom} &amp;{' '}
                  {couples[1].bride}.
                </p>

                <div>
                  <label htmlFor={`${uid}-name`} className={labelCls}>
                    Guest full name
                  </label>
                  <input
                    id={`${uid}-name`}
                    className={inputCls}
                    value={values.name}
                    onChange={set('name')}
                    autoComplete="name"
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                    aria-describedby={describedBy('name')}
                  />
                  <FieldError id={`${uid}-name-error`}>{errors.name}</FieldError>
                </div>

                <div className="grid gap-7 sm:grid-cols-[1.4fr_1fr]">
                  <div>
                    <label htmlFor={`${uid}-phone`} className={labelCls}>
                      Phone / WhatsApp number
                    </label>
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      inputMode="tel"
                      className={inputCls}
                      value={values.phone}
                      onChange={set('phone')}
                      autoComplete="tel"
                      placeholder="+92 3XX XXXXXXX"
                      aria-invalid={!!errors.phone}
                      aria-describedby={describedBy('phone')}
                    />
                    <FieldError id={`${uid}-phone-error`}>{errors.phone}</FieldError>
                  </div>
                  <div>
                    <span id={`${uid}-guests-label`} className={labelCls}>
                      Number of guests
                    </span>
                    <div className="mt-2 flex items-center justify-between rounded-xl border border-gold/70 bg-white/70 p-1.5" role="group" aria-labelledby={`${uid}-guests-label`}>
                      <button
                        type="button"
                        onClick={() => setGuests(values.guests - 1)}
                        disabled={values.guests <= 1}
                        aria-label="Fewer guests"
                        className="h-10 w-10 rounded-lg font-display text-2xl text-crimson transition hover:bg-gold-pale disabled:opacity-30"
                      >
                        −
                      </button>
                      <output aria-live="polite" className="font-sans text-xl font-semibold tabular-nums text-charcoal">
                        {values.guests}
                      </output>
                      <button
                        type="button"
                        onClick={() => setGuests(values.guests + 1)}
                        disabled={values.guests >= rsvp.maxGuests}
                        aria-label="More guests"
                        className="h-10 w-10 rounded-lg font-display text-2xl text-crimson transition hover:bg-gold-pale disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <fieldset aria-describedby={describedBy('events')}>
                  <legend className={labelCls}>Which events are you attending?</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2" id={`${uid}-events`} tabIndex={-1}>
                    {events.map((ev) => {
                      const checked = values.events.includes(ev.id);
                      return (
                        <label
                          key={ev.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 font-sans text-[15px] font-medium transition ${
                            checked ? 'border-saffron bg-saffron/10 text-charcoal' : 'border-gold/60 bg-white/60 text-charcoal hover:border-saffron'
                          }`}
                        >
                          <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggleEvent(ev.id)} />
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-saffron ${
                              checked ? 'border-saffron bg-saffron text-white' : 'border-gold'
                            }`}
                            aria-hidden="true"
                          >
                            {checked && (
                              <svg viewBox="0 0 16 16" className="h-3 w-3"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            )}
                          </span>
                          {ev.short}
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id={`${uid}-events-error`}>{errors.events}</FieldError>
                </fieldset>

                <fieldset aria-describedby={describedBy('side')}>
                  <legend className={labelCls}>Attending on behalf of</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3" id={`${uid}-side`} tabIndex={-1}>
                    {sides.map((s) => {
                      const checked = values.side === s;
                      return (
                        <label
                          key={s}
                          className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center font-sans text-[14px] font-semibold transition ${
                            checked ? 'border-crimson bg-crimson text-white shadow-md' : 'border-gold/60 bg-white/60 text-charcoal hover:border-crimson'
                          } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-saffron`}
                        >
                          <input type="radio" name={`${uid}-side-radio`} value={s} className="sr-only" checked={checked} onChange={set('side')} />
                          {s}
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id={`${uid}-side-error`}>{errors.side}</FieldError>
                </fieldset>

                <div>
                  <label htmlFor={`${uid}-note`} className={labelCls}>
                    A blessing for the couples <span className="normal-case tracking-normal text-charcoal-soft">(optional)</span>
                  </label>
                  <textarea
                    id={`${uid}-note`}
                    rows={4}
                    data-lenis-prevent
                    className={`${inputCls} resize-y`}
                    value={values.note}
                    onChange={set('note')}
                    maxLength={600}
                    placeholder={`Share your wishes for ${couples[0].groom} & ${couples[0].bride} and ${couples[1].groom} & ${couples[1].bride}…`}
                  />
                </div>

                {status === 'error' && (
                  <p className="rounded-xl bg-crimson/10 px-4 py-3 font-sans text-sm font-medium text-crimson-dark" role="alert">
                    We couldn’t send your reply just now. Please check your connection and try again.
                  </p>
                )}

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group relative inline-flex max-w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-crimson via-crimson-light to-saffron px-5 py-4 text-center font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(169,50,38,0.35)] transition hover:brightness-110 disabled:opacity-70 sm:px-10 sm:text-[13px] sm:tracking-[0.24em] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                  >
                    {status === 'sending' ? 'Sending blessings…' : 'Confirm my presence'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </RoyalScroll>
      </div>
    </section>
  );
}
