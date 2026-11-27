/**
 * Personal links, first-visit state and the RSVP "replied" flag.
 *
 *   ?to=Sharma+Family   greets the guest by name on the opening doors and pre-fills the RSVP
 *   &n=4                pre-fills the number of guests
 *   ?intro              always shows the opening doors (handy for previewing)
 *   #events #venues #rsvp #invitation   open straight at that section
 *
 * The guest details are remembered on the device, then removed from the address
 * bar so a link copied from the browser does not carry someone else's name.
 */

export const RSVP_KEY = 'double-royal-union-rsvp';
export const RSVP_EVENT = 'rsvp:change';
export const SECTION_IDS = ['invitation', 'events', 'venues', 'rsvp'];

const GUEST_KEY = 'pamoora-guest';
const OPENED_KEY = 'pamoora-opened';
const SESSION_KEY = 'pamoora-session';

const store = {
  get(key, storage = localStorage) {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value, storage = localStorage) {
    try {
      storage.setItem(key, value);
    } catch {
      /* private mode or storage disabled: the invite still works, it just won't remember */
    }
  },
};

const cleanName = (s) => s.replace(/\s+/g, ' ').trim().slice(0, 60);

function readGuest(maxGuests) {
  const params = new URLSearchParams(window.location.search);
  const to = cleanName(params.get('to') || '');
  const n = Number.parseInt(params.get('n') || '', 10);
  if (to) {
    const guest = { to, n: Number.isFinite(n) ? Math.max(1, Math.min(maxGuests, n)) : null };
    store.set(GUEST_KEY, JSON.stringify(guest));
    return guest;
  }
  try {
    const saved = JSON.parse(store.get(GUEST_KEY) || 'null');
    return saved?.to ? saved : null;
  } catch {
    return null;
  }
}

const openedKey = (guest) => `${OPENED_KEY}:${guest?.to ?? ''}`;

export function markOpened(guest) {
  store.set(openedKey(guest), '1');
}

let boot = null;

/**
 * Worked out once per page load (outside React, so StrictMode's double render
 * can't consume the "first load this session" flag twice).
 */
export function getBoot(maxGuests) {
  if (boot) return boot;
  const params = new URLSearchParams(window.location.search);
  const guest = readGuest(maxGuests);
  const force = params.has('intro');
  const seen = store.get(openedKey(guest)) === '1';
  const firstLoadThisSession = !store.get(SESSION_KEY, sessionStorage);
  store.set(SESSION_KEY, '1', sessionStorage);

  const hashId = window.location.hash.slice(1);
  const showGate = force; // gate shown only when ?intro is in the URL

  boot = {
    guest,
    showGate,
    // A returning guest opening the link again: skip the walk-in and start at the card
    returning: !showGate && firstLoadThisSession,
    hash: SECTION_IDS.includes(hashId) ? hashId : null,
  };

  if (['to', 'n', 'intro'].some((k) => params.has(k))) {
    ['to', 'n', 'intro'].forEach((k) => params.delete(k));
    const qs = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
  }
  return boot;
}

export function readRsvp() {
  try {
    return JSON.parse(store.get(RSVP_KEY) || 'null');
  } catch {
    return null;
  }
}

/** Saves { id, values, delivered: 'sheet' | 'whatsapp' | null, submittedAt } and tells the page. */
export function saveRsvp(record) {
  store.set(RSVP_KEY, JSON.stringify(record));
  window.dispatchEvent(new Event(RSVP_EVENT));
}

/** True once this guest's reply has been sent (not merely saved on the phone). */
export const hasReplied = () => !!readRsvp()?.delivered;
