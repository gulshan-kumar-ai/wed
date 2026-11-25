/**
 * Pamoora wedding · RSVP receiver
 * ─────────────────────────────────────────────────────────────────────────
 * Every reply sent from the invitation lands as a row in your Google Sheet.
 * If a guest edits their reply, their existing row is updated (no duplicates).
 *
 * SET UP (about 5 minutes, once):
 *   1. Create a new Google Sheet (e.g. "Pamoora wedding RSVPs").
 *   2. In the sheet: Extensions → Apps Script. Delete the sample code,
 *      paste this whole file, and click Save.
 *   3. Click Deploy → New deployment → the gear icon → Web app.
 *        Description:    RSVP
 *        Execute as:     Me
 *        Who has access: Anyone            ← required, or replies cannot arrive
 *      Click Deploy and allow the permissions Google asks for.
 *   4. Copy the "Web app URL" (it ends in /exec).
 *   5. Open that URL in your browser: it should say {"ok":true,"service":"Pamoora RSVP"}.
 *   6. Paste the URL into source/src/config/wedding.js → rsvp.endpoint, rebuild,
 *      and send yourself one test reply from the invitation.
 *
 * Optional: put an email address in NOTIFY_EMAIL to get an email for each reply.
 * If you later change this code, use Deploy → Manage deployments → edit → New version
 * (keeping the same URL).
 */

const SHEET_NAME = 'RSVPs';
const NOTIFY_EMAIL = ''; // e.g. 'family@example.com'

const COLUMNS = [
  ['submittedAt', 'Received'],
  ['attending', 'Attending'],
  ['name', 'Name'],
  ['phone', 'Phone / WhatsApp'],
  ['guests', 'Guests'],
  ['events', 'Events'],
  ['side', 'On behalf of'],
  ['outstation', 'From outside Kunri'],
  ['arrivalDate', 'Arriving'],
  ['arrivalTime', 'Arrival time'],
  ['pickup', 'Pick-up'],
  ['room', 'Room needed'],
  ['note', 'Blessing'],
  ['invitedAs', 'Invitation name'],
  ['language', 'Language'],
  ['id', 'Reply ID'],
];

function doGet() {
  return json_({ ok: true, service: 'Pamoora RSVP' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json_({ ok: true }); // hidden field filled in: a bot
    if (!data.id || !data.name) return json_({ ok: false, error: 'Missing reply id or name' });

    const sheet = sheet_();
    const row = COLUMNS.map(([key]) => clean_(data[key]));
    const idColumn = COLUMNS.findIndex(([key]) => key === 'id') + 1;
    const last = sheet.getLastRow();
    const ids = last > 1 ? sheet.getRange(2, idColumn, last - 1, 1).getValues().map((r) => r[0]) : [];
    const existing = ids.indexOf(data.id);

    if (existing >= 0) {
      sheet.getRange(existing + 2, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    if (NOTIFY_EMAIL) {
      const lines = COLUMNS.filter(([key]) => data[key] !== '' && data[key] != null).map(([key, label]) => `${label}: ${data[key]}`);
      MailApp.sendEmail(NOTIFY_EMAIL, `RSVP: ${data.name} (${data.attending})${existing >= 0 ? ' · updated' : ''}`, lines.join('\n'));
    }
    return json_({ ok: true, updated: existing >= 0 });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function sheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(([, label]) => label));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

/** Keep cells as plain text: a phone like +92… or a note starting with = must not become a formula. */
function clean_(value) {
  if (value == null) return '';
  if (typeof value === 'number') return value;
  const text = String(value).slice(0, 1000);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
