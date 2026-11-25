/**
 * Counts how often the invitation is opened, in the family's Google Sheet
 * (the same Apps Script web app that receives RSVPs, see rsvp/google-apps-script.gs).
 *
 * One row per visit (a browser session, so reloading does not count twice):
 * when, which personal link (if any), new or returning device, language, and
 * phone or computer. The device id is a random number kept on that phone; no
 * name is recorded unless the guest's personal link carried one.
 */
import { wedding } from './config/wedding';
import { newId } from './rsvp';

const VISITOR_KEY = 'pamoora-visitor';
const LOGGED_KEY = 'pamoora-visit-logged';

const read = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};
const write = (storage, key, value) => {
  try {
    storage.setItem(key, value);
  } catch {
    /* private browsing: still counted, just not de-duplicated */
  }
};

const host = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

export function logVisit({ guest, language }) {
  const { endpoint, countVisits = true } = wedding.rsvp;
  if (!endpoint || !countVisits) return;
  // Opening the downloaded file on the family's own computer is a preview, not a guest's visit
  if (window.location.protocol === 'file:') return;
  if (read(sessionStorage, LOGGED_KEY)) return;
  write(sessionStorage, LOGGED_KEY, '1');

  let visitor = read(localStorage, VISITOR_KEY);
  const returning = !!visitor;
  if (!visitor) {
    visitor = newId();
    write(localStorage, VISITOR_KEY, visitor);
  }

  const body = JSON.stringify({
    type: 'visit',
    at: new Date().toISOString(),
    visitor,
    returning,
    invitedAs: guest?.to ?? '',
    language,
    device: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Phone' : 'Computer',
    from: document.referrer ? host(document.referrer) : '',
  });

  // Fire and forget. A plain-text POST needs no CORS preflight (Apps Script cannot answer one),
  // and keepalive lets it finish even if the guest closes the page straight away.
  fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'omit',
    keepalive: true,
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  }).catch(() => {});
}
