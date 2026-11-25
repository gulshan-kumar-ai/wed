/**
 * RSVP data and delivery.
 *
 *  · Google Sheet (rsvp.endpoint): the reply is POSTed to the Apps Script in
 *    rsvp/google-apps-script.gs. Each reply carries an id, so an edited reply
 *    updates its row instead of adding a second one.
 *  · WhatsApp (always available): the reply is written out as a message, either
 *    to the family number (rsvp.whatsapp) or for the guest to send to whoever
 *    invited them.
 */
import { wedding as english } from './config/wedding';
import { formatShortDay } from './components/events/calendar';

export const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const emptyValues = (guest) => ({
  attending: null, // 'yes' | 'no'
  name: guest?.to ?? '',
  phone: '',
  guests: guest?.n ?? 1,
  events: [],
  side: '', // 'groom1' | 'groom2' | 'both'
  outstation: null, // true | false
  arrivalDate: '',
  arrivalTime: '',
  pickup: 'none', // 'none' | a pickupFrom id
  room: false,
  note: '',
});

/**
 * Bring a reply saved by an earlier version of the page into today's shape.
 * Those replies were only ever stored on the guest's phone, so they are marked
 * undelivered and the guest is asked to send them.
 */
export function normalizeSaved(saved, guest) {
  if (!saved) return null;
  if (saved.values) return saved;
  const [a, b] = english.couples;
  const side = typeof saved.side === 'string' ? saved.side : '';
  return {
    id: newId(),
    delivered: null,
    values: {
      ...emptyValues(guest),
      attending: 'yes',
      name: saved.name ?? '',
      phone: saved.phone ?? '',
      guests: saved.guests ?? 1,
      events: Array.isArray(saved.events) ? saved.events : [],
      side: side.startsWith(a.groom) ? 'groom1' : side.startsWith(b.groom) ? 'groom2' : side.startsWith('Both') ? 'both' : '',
      note: saved.note ?? '',
    },
  };
}

const PHONE_OK = (phone) => {
  const digits = phone.replace(/[^\d]/g, '');
  return digits.length >= 10 && digits.length <= 15 && /^[+\d\s()-]+$/.test(phone.trim());
};

/** Field errors in the order the fields appear, so the first one can be focused. */
export function validate(v, t) {
  const e = {};
  if (!v.attending) e.attending = t('errAttending');
  if (v.name.trim().length < 2) e.name = t('errName');
  // A phone number is needed to accept; when declining it is optional, but must be valid if given
  if ((v.attending !== 'no' || v.phone.trim()) && !PHONE_OK(v.phone)) e.phone = t('errPhone');
  if (v.attending === 'yes' && v.events.length === 0) e.events = t('errEvents');
  if (!v.side) e.side = t('errSide');
  if (v.attending === 'yes' && v.outstation === true && !v.arrivalDate) e.arrivalDate = t('errArrival');
  return e;
}

export function sideLabel(side, couples, t) {
  if (side === 'groom1') return t('sideOf', { name: couples[0].groom });
  if (side === 'groom2') return t('sideOf', { name: couples[1].groom });
  if (side === 'both') return t('sideBoth');
  return '';
}

const travelling = (v) => v.attending === 'yes' && v.outstation === true;

/** One row for the Google Sheet, always in English so the sheet stays consistent. */
export function sheetPayload({ id, values: v, guest, language, honeypot = '' }) {
  const yes = v.attending === 'yes';
  const englishT = (key, vars) =>
    ({
      sideOf: `${vars?.name}'s side`,
      sideBoth: 'Both twins / Family friend',
    })[key];
  const pickup = english.rsvp.pickupFrom.find((p) => p.id === v.pickup);
  return {
    id,
    submittedAt: new Date().toISOString(),
    attending: yes ? 'Yes' : 'No',
    name: v.name.trim(),
    phone: v.phone.trim(),
    guests: yes ? v.guests : 0,
    events: yes ? english.events.filter((e) => v.events.includes(e.id)).map((e) => e.short).join(', ') : '',
    side: sideLabel(v.side, english.couples, englishT),
    outstation: yes ? (v.outstation ? 'Yes' : 'No') : '',
    arrivalDate: travelling(v) ? formatShortDay(v.arrivalDate, 'en') : '',
    arrivalTime: travelling(v) ? v.arrivalTime : '',
    pickup: travelling(v) ? (pickup ? `From ${pickup.label}` : 'Not needed') : '',
    room: travelling(v) ? (v.room ? 'Yes' : 'No') : '',
    note: v.note.trim(),
    invitedAs: guest?.to ?? '',
    language,
    website: honeypot,
  };
}

/** The reply as a WhatsApp message, in the guest's language. */
export function whatsAppText({ values: v, wedding, t, language }) {
  const yes = v.attending === 'yes';
  const events = wedding.events.filter((e) => v.events.includes(e.id)).map((e) => e.short);
  const pickup = wedding.rsvp.pickupFrom.find((p) => p.id === v.pickup);
  return [
    `*${t('waTitle')}*`,
    `${t('waName')}: ${v.name.trim()}`,
    `${t('sumAttending')}: ${yes ? t('accept') : t('decline')}`,
    v.phone.trim() && `${t('waPhone')}: ${v.phone.trim()}`,
    yes && `${t('sumGuests')}: ${v.guests}`,
    yes && `${t('sumEvents')}: ${events.join(t('comma'))}`,
    v.side && `${t('sumSide')}: ${sideLabel(v.side, wedding.couples, t)}`,
    travelling(v) && v.arrivalDate && `${t('sumArrival')}: ${formatShortDay(v.arrivalDate, language)}${v.arrivalTime ? ` · ${v.arrivalTime}` : ''}`,
    travelling(v) && `${t('sumPickup')}: ${pickup ? t('pickupFrom', { city: pickup.label }) : t('pickupNone')}`,
    travelling(v) && `${t('sumRoom')}: ${v.room ? t('yes') : t('no')}`,
    v.note.trim() && `${t('waBlessing')}: ${v.note.trim()}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** wa.me link: to the family number if there is one, otherwise WhatsApp asks the guest whom to send it to. */
export const whatsAppLink = (number, text) => `https://wa.me/${number ? String(number).replace(/\D/g, '') : ''}?text=${encodeURIComponent(text)}`;

/**
 * POST a reply to the configured endpoint. Resolves only when the endpoint
 * confirms it; anything else (offline, timeout, a sign-in page because the
 * script was deployed for "Only myself") rejects, so the guest is offered WhatsApp.
 */
export async function postToEndpoint(endpoint, payload) {
  const appsScript = /script\.google(usercontent)?\.com/.test(endpoint);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      credentials: 'omit',
      // Apps Script cannot answer a CORS preflight, so send it a "simple" text/plain request
      headers: appsScript ? { 'Content-Type': 'text/plain;charset=utf-8' } : { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`RSVP failed: ${res.status}`);
    if (appsScript) {
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || 'RSVP was not accepted');
    }
  } finally {
    clearTimeout(timer);
  }
}
