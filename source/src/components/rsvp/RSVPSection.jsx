import { useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../../i18n';
import RoyalScroll from './RoyalScroll';
import SectionHeading from '../ui/SectionHeading';
import { OmMedallion } from '../ui/SacredEmblem';
import Ornament from '../ui/Ornament';
import { readRsvp, saveRsvp } from '../../guest';
import { emptyValues, newId, normalizeSaved, postToEndpoint, sheetPayload, sideLabel, validate, whatsAppLink, whatsAppText } from '../../rsvp';
import { formatShortDay } from '../events/calendar';

const labelCls = 'block font-sans text-xs font-semibold uppercase tracking-[0.18em] text-crimson sm:text-[13px]';
const inputCls =
  'mt-2 w-full rounded-xl border border-gold/70 bg-white/70 px-4 py-3 font-sans text-base text-charcoal placeholder:text-charcoal-soft/60 transition focus:border-saffron focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron/30 aria-[invalid=true]:border-crimson';
const WHATSAPP_GREEN = 'bg-[#1F7A4D]';

function FieldError({ id, children }) {
  return children ? (
    <p id={id} className="mt-1.5 font-sans text-sm font-medium text-crimson">
      {children}
    </p>
  ) : null;
}

function Optional() {
  const { t } = useLanguage();
  return <span className="normal-case tracking-normal text-charcoal-soft"> ({t('optional')})</span>;
}

/** A radio button drawn as a tappable card. */
function Choice({ name, checked, onChange, children, strong = false }) {
  const on = strong ? 'border-crimson bg-crimson text-white shadow-md' : 'border-saffron bg-saffron/15 text-charcoal shadow-sm';
  return (
    <label
      className={`flex min-h-[3rem] cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center font-sans text-[15px] font-semibold leading-snug transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-saffron ${
        checked ? on : 'border-gold/60 bg-white/60 text-charcoal hover:border-saffron'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

function ChoiceGroup({ id, legend, hint, error, className = '', children }) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className={labelCls}>{legend}</legend>
      {hint && <p className="mt-1 font-sans text-sm text-charcoal-soft">{hint}</p>}
      <div id={id} tabIndex={-1} className={`mt-3 grid gap-3 focus:outline-none ${className}`}>
        {children}
      </div>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </fieldset>
  );
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

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.9 12.6c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1a14 14 0 0 1-1.5-.6 11.6 11.6 0 0 1-4.4-3.9c-.3-.5-1-1.4-1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.2z"
      fill="currentColor"
    />
  </svg>
);

function Confirmation({ values, delivered, justSent, popupBlocked, waLink, familyNumber, wedding, onEdit }) {
  const { t, language } = useLanguage();
  const yes = values.attending === 'yes';
  const full = values.name.trim().replace(/\s+/g, ' ');
  // "Sharma Family" reads better in full; long personal names just use the first word
  const name = full.length <= 24 ? full : full.split(' ')[0];
  const side = sideLabel(values.side, wedding.couples, t);
  const pickup = wedding.rsvp.pickupFrom.find((p) => p.id === values.pickup);
  const rows = yes
    ? [
        [t('sumGuests'), values.guests],
        [t('sumEvents'), wedding.events.filter((e) => values.events.includes(e.id)).map((e) => e.short).join(' · ')],
        side && [t('sumSide'), side],
        values.outstation && [t('sumArrival'), `${formatShortDay(values.arrivalDate, language)}${values.arrivalTime ? ` · ${values.arrivalTime}` : ''}`],
        values.outstation && [t('sumPickup'), pickup ? t('pickupFrom', { city: pickup.label }) : t('pickupNone')],
        values.outstation && [t('sumRoom'), values.room ? t('yes') : t('no')],
      ].filter(Boolean)
    : [[t('sumAttending'), t('decline')], side && [t('sumSide'), side]].filter(Boolean);

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
      {yes && justSent && <PetalBurst />}
      <OmMedallion className="h-20 w-20" />
      {yes && <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-saffron-dark sm:text-[13px]">{t('swagatam')}</p>}
      <h3 className="mt-3 font-display text-[clamp(2rem,5vw,2.8rem)] font-semibold leading-tight text-crimson">
        {yes ? t('thanks', { name }) : t('declineTitle', { name })}
      </h3>
      <p className="mt-4 max-w-md font-display text-xl leading-relaxed text-charcoal">{yes ? t('acceptBody') : t('declineBody')}</p>

      {delivered === 'whatsapp' ? (
        <div className="mt-6 w-full max-w-md rounded-2xl border border-[#1F7A4D]/30 bg-[#1F7A4D]/10 px-5 py-4 text-start">
          {justSent ? (
            <>
              <p className="font-display text-xl font-semibold text-[#1F7A4D]">{t('waStepTitle')}</p>
              {!popupBlocked && <p className="mt-1 font-sans text-[15px] leading-relaxed text-charcoal">{familyNumber ? t('waStepFamily') : t('waStepChoose')}</p>}
            </>
          ) : (
            <p className="font-sans text-[15px] leading-relaxed text-charcoal">{t('waSent')}</p>
          )}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 inline-flex items-center gap-2 rounded-full ${WHATSAPP_GREEN} px-5 py-2.5 font-sans text-[13px] font-semibold text-white shadow-md transition hover:brightness-110`}
          >
            <WhatsAppIcon />
            {popupBlocked ? t('submitWa') : t('openWaAgain')}
          </a>
        </div>
      ) : (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1F7A4D]/10 px-4 py-2 font-sans text-[15px] font-semibold text-[#1F7A4D]">
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('received')}
        </p>
      )}

      <Ornament className="mt-6 h-3 w-48" />
      <dl className="mt-6 grid w-full max-w-sm gap-2 text-start font-sans text-[15px] text-charcoal">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-gold/40 pb-2 last:border-b-0">
            <dt className="font-semibold text-crimson">{label}</dt>
            <dd className="text-end">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {delivered === 'sheet' && familyNumber && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full ${WHATSAPP_GREEN} px-6 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-md transition hover:brightness-110`}
          >
            <WhatsAppIcon />
            {t('alsoWa')}
          </a>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-gold px-6 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-crimson transition hover:bg-gold-pale focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          {t('editResponse')}
        </button>
      </div>
    </motion.div>
  );
}

/** "Confirm Your Presence": accept or decline, travel details, delivered to the family's Sheet or WhatsApp. */
export default function RSVPSection({ wedding, guest }) {
  const { events, couples, rsvp } = wedding;
  const { t, language } = useLanguage();
  const uid = useId();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initial = useMemo(() => normalizeSaved(readRsvp(), guest), []);
  const idRef = useRef(initial?.id ?? newId());
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initial?.values ?? emptyValues(guest));
  const [delivered, setDelivered] = useState(initial?.delivered ?? null);
  const [status, setStatus] = useState(initial?.delivered ? 'done' : 'idle'); // idle | sending | error | done
  const [justSent, setJustSent] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [errors, setErrors] = useState({});
  const [honeypot, setHoneypot] = useState('');
  const undelivered = !!initial && !initial.delivered && status !== 'done';

  const yes = values.attending === 'yes';
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const setValue = (key, value) => setValues((v) => ({ ...v, [key]: value }));
  const toggleEvent = (id) =>
    setValues((v) => ({ ...v, events: v.events.includes(id) ? v.events.filter((x) => x !== id) : [...v.events, id] }));
  const setGuests = (n) => setValue('guests', Math.max(1, Math.min(rsvp.maxGuests, n)));

  const waLink = whatsAppLink(rsvp.whatsapp, whatsAppText({ values, wedding, t, language }));
  const c1 = `${couples[0].groom} & ${couples[0].bride}`;
  const c2 = `${couples[1].groom} & ${couples[1].bride}`;
  const sides = [
    ['groom1', sideLabel('groom1', couples, t)],
    ['groom2', sideLabel('groom2', couples, t)],
    ['both', sideLabel('both', couples, t)],
  ];

  const finish = (how, blocked = false) => {
    saveRsvp({ id: idRef.current, values, delivered: how, submittedAt: new Date().toISOString() });
    setDelivered(how);
    setJustSent(true);
    setPopupBlocked(blocked);
    setStatus('done');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return; // a bot filled the hidden field
    const errs = validate(values, t);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    if (!rsvp.endpoint) {
      // Open WhatsApp straight from the tap (nothing async first), so it is never blocked as a pop-up
      const win = window.open(waLink, '_blank');
      if (win) win.opener = null;
      finish('whatsapp', !win);
      return;
    }

    setStatus('sending');
    try {
      await postToEndpoint(rsvp.endpoint, sheetPayload({ id: idRef.current, values, guest, language, honeypot }));
      finish('sheet');
    } catch {
      setStatus('error');
    }
  };

  const describedBy = (key) => (errors[key] ? `${uid}-${key}-error` : undefined);
  const submitLabel = status === 'sending' ? t('sending') : !rsvp.endpoint ? t('submitWa') : yes || !values.attending ? t('submit') : t('submitDecline');

  return (
    <section id="rsvp" className="relative overflow-hidden bg-ivory px-5 py-24 sm:px-8 sm:py-28" aria-labelledby="rsvp-heading">
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading id="rsvp-heading" eyebrow={t('rsvpEyebrow')} title={t('rsvpTitle')} intro={rsvp.deadline} />

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="rsvp-form-panel"
            className="inline-flex items-center gap-2 rounded-full border border-gold bg-crimson px-8 py-3.5 font-caps text-[13px] font-semibold tracking-[0.18em] text-white shadow-lg transition hover:bg-crimson/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            {open ? t('rsvpTitle') : t('rsvpTitle')}
            <svg viewBox="0 0 16 16" className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
              <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <AnimatePresence initial={false}>
        {open && (
        <motion.div
          id="rsvp-form-panel"
          key="rsvp-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        >
        <RoyalScroll className="mt-14">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'done' ? (
              <Confirmation
                key="thanks"
                values={values}
                delivered={delivered}
                justSent={justSent}
                popupBlocked={popupBlocked}
                waLink={waLink}
                familyNumber={rsvp.whatsapp}
                wedding={wedding}
                onEdit={() => {
                  setJustSent(false);
                  setStatus('idle');
                }}
              />
            ) : (
              <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-7">
                <p className="text-center font-display text-xl italic text-charcoal">{t('rsvpIntro', { c1, c2 })}</p>

                {undelivered && (
                  <p className="rounded-xl border border-saffron/50 bg-saffron/10 px-4 py-3 font-sans text-[15px] font-medium leading-relaxed text-charcoal" role="alert">
                    {t('undelivered')}
                  </p>
                )}

                <ChoiceGroup id={`${uid}-attending`} legend={t('attendingQ')} error={errors.attending} className="sm:grid-cols-2">
                  <Choice name={`${uid}-attending-radio`} checked={values.attending === 'yes'} onChange={() => setValue('attending', 'yes')} strong>
                    {t('accept')}
                  </Choice>
                  <Choice name={`${uid}-attending-radio`} checked={values.attending === 'no'} onChange={() => setValue('attending', 'no')} strong>
                    {t('decline')}
                  </Choice>
                </ChoiceGroup>

                <div>
                  <label htmlFor={`${uid}-name`} className={labelCls}>
                    {t('fullName')}
                  </label>
                  <input
                    id={`${uid}-name`}
                    dir="auto"
                    className={inputCls}
                    value={values.name}
                    onChange={set('name')}
                    autoComplete="name"
                    placeholder={t('namePh')}
                    aria-invalid={!!errors.name}
                    aria-describedby={describedBy('name')}
                  />
                  <FieldError id={`${uid}-name-error`}>{errors.name}</FieldError>
                </div>

                <div className={`grid gap-7 ${yes ? 'sm:grid-cols-[1.4fr_1fr]' : ''}`}>
                  <div>
                    <label htmlFor={`${uid}-phone`} className={labelCls}>
                      {t('phone')}
                      {values.attending === 'no' && <Optional />}
                    </label>
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      inputMode="tel"
                      dir="ltr"
                      className={`${inputCls} text-start`}
                      value={values.phone}
                      onChange={set('phone')}
                      autoComplete="tel"
                      placeholder="+92 3XX XXXXXXX"
                      aria-invalid={!!errors.phone}
                      aria-describedby={describedBy('phone')}
                    />
                    <FieldError id={`${uid}-phone-error`}>{errors.phone}</FieldError>
                  </div>
                  {yes && (
                    <div>
                      <span id={`${uid}-guests-label`} className={labelCls}>
                        {t('guests')}
                      </span>
                      <div className="mt-2 flex items-center justify-between rounded-xl border border-gold/70 bg-white/70 p-1.5" role="group" aria-labelledby={`${uid}-guests-label`}>
                        <button
                          type="button"
                          onClick={() => setGuests(values.guests - 1)}
                          disabled={values.guests <= 1}
                          aria-label={t('fewer')}
                          className="h-11 w-11 rounded-lg font-display text-2xl text-crimson transition hover:bg-gold-pale disabled:opacity-30"
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
                          aria-label={t('more')}
                          className="h-11 w-11 rounded-lg font-display text-2xl text-crimson transition hover:bg-gold-pale disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {yes && (
                  <fieldset aria-describedby={describedBy('events')}>
                    <legend className={labelCls}>{t('eventsQ')}</legend>
                    <div className="mt-3 grid gap-3 focus:outline-none sm:grid-cols-2" id={`${uid}-events`} tabIndex={-1}>
                      {events.map((ev) => {
                        const checked = values.events.includes(ev.id);
                        return (
                          <label
                            key={ev.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 font-sans text-[15px] font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-saffron ${
                              checked ? 'border-saffron bg-saffron/10 text-charcoal' : 'border-gold/60 bg-white/60 text-charcoal hover:border-saffron'
                            }`}
                          >
                            <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleEvent(ev.id)} />
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${checked ? 'border-saffron bg-saffron text-white' : 'border-gold'}`}
                              aria-hidden="true"
                            >
                              {checked && (
                                <svg viewBox="0 0 16 16" className="h-3 w-3">
                                  <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            {ev.short}
                          </label>
                        );
                      })}
                    </div>
                    <FieldError id={`${uid}-events-error`}>{errors.events}</FieldError>
                  </fieldset>
                )}

                <ChoiceGroup id={`${uid}-side`} legend={t('sideQ')} error={errors.side} className="sm:grid-cols-3">
                  {sides.map(([value, label]) => (
                    <Choice key={value} name={`${uid}-side-radio`} checked={values.side === value} onChange={() => setValue('side', value)}>
                      {label}
                    </Choice>
                  ))}
                </ChoiceGroup>

                {yes && (
                  <ChoiceGroup id={`${uid}-outstation`} legend={t('travelQ')} hint={t('travelHint')} className="grid-cols-2">
                    <Choice name={`${uid}-outstation-radio`} checked={values.outstation === true} onChange={() => setValue('outstation', true)}>
                      {t('yes')}
                    </Choice>
                    <Choice name={`${uid}-outstation-radio`} checked={values.outstation === false} onChange={() => setValue('outstation', false)}>
                      {t('no')}
                    </Choice>
                  </ChoiceGroup>
                )}

                {yes && values.outstation === true && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-7 rounded-2xl border border-gold/50 bg-gold-pale/30 p-4 sm:p-6"
                  >
                    <ChoiceGroup id={`${uid}-arrivalDate`} legend={t('arrivalDate')} error={errors.arrivalDate} className="grid-cols-2 sm:grid-cols-4">
                      {rsvp.arrivalDates.map((d) => (
                        <Choice key={d} name={`${uid}-arrival-radio`} checked={values.arrivalDate === d} onChange={() => setValue('arrivalDate', d)}>
                          {formatShortDay(d, language)}
                        </Choice>
                      ))}
                    </ChoiceGroup>

                    <div>
                      <label htmlFor={`${uid}-arrivalTime`} className={labelCls}>
                        {t('arrivalTime')}
                        <Optional />
                      </label>
                      <input
                        id={`${uid}-arrivalTime`}
                        type="time"
                        dir="ltr"
                        className={`${inputCls} max-w-[12rem] text-start`}
                        value={values.arrivalTime}
                        onChange={set('arrivalTime')}
                      />
                    </div>

                    <ChoiceGroup id={`${uid}-pickup`} legend={t('pickupQ')} className="sm:grid-cols-3">
                      <Choice name={`${uid}-pickup-radio`} checked={values.pickup === 'none'} onChange={() => setValue('pickup', 'none')}>
                        {t('pickupNone')}
                      </Choice>
                      {rsvp.pickupFrom.map((p) => (
                        <Choice key={p.id} name={`${uid}-pickup-radio`} checked={values.pickup === p.id} onChange={() => setValue('pickup', p.id)}>
                          {t('pickupFrom', { city: p.label })}
                        </Choice>
                      ))}
                    </ChoiceGroup>

                    <ChoiceGroup id={`${uid}-room`} legend={t('roomQ')} className="grid-cols-2">
                      <Choice name={`${uid}-room-radio`} checked={values.room === true} onChange={() => setValue('room', true)}>
                        {t('yes')}
                      </Choice>
                      <Choice name={`${uid}-room-radio`} checked={values.room === false} onChange={() => setValue('room', false)}>
                        {t('no')}
                      </Choice>
                    </ChoiceGroup>
                  </motion.div>
                )}

                <div>
                  <label htmlFor={`${uid}-note`} className={labelCls}>
                    {t('blessing')}
                    <Optional />
                  </label>
                  <textarea
                    id={`${uid}-note`}
                    rows={4}
                    dir="auto"
                    data-lenis-prevent
                    className={`${inputCls} resize-y`}
                    value={values.note}
                    onChange={set('note')}
                    maxLength={600}
                    placeholder={t('blessingPh', { c1, c2 })}
                  />
                </div>

                {/* Left empty by people; bots that fill every field are ignored */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </label>
                </div>

                {status === 'error' && (
                  <div className="rounded-xl bg-crimson/10 px-4 py-3 font-sans text-[15px] font-medium leading-relaxed text-crimson-dark" role="alert">
                    <p>{t('sendError')}</p>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => finish('whatsapp')}
                      className={`mt-3 inline-flex items-center gap-2 rounded-full ${WHATSAPP_GREEN} px-5 py-2.5 text-[13px] font-semibold text-white shadow-md hover:brightness-110`}
                    >
                      <WhatsAppIcon />
                      {t('sendWaInstead')}
                    </a>
                  </div>
                )}

                <div className="flex flex-col items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group relative inline-flex max-w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-crimson via-crimson-light to-saffron px-6 py-4 text-center font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(169,50,38,0.35)] transition hover:brightness-110 disabled:opacity-70 sm:px-10 sm:text-sm sm:tracking-[0.18em] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                  >
                    {!rsvp.endpoint && <WhatsAppIcon />}
                    {submitLabel}
                  </button>
                  {!rsvp.endpoint && <p className="max-w-sm text-center font-sans text-sm text-charcoal-soft">{t('waNote')}</p>}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </RoyalScroll>
        </motion.div>
        )}
        </AnimatePresence>
      </div>
    </section>
  );
}
