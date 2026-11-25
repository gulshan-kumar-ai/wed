/**
 * Pamoora wedding · RSVPs and visits in one Google Sheet
 * ─────────────────────────────────────────────────────────────────────────
 * The invitation website sends two kinds of records here:
 *   · every RSVP (accepted or declined), one row per guest; an edited reply
 *     updates its own row instead of adding a new one
 *   · every visit to the invitation (one row each time someone opens the link)
 * and the "Summary" tab counts them live: link opens, different phones,
 * replies, accepted, declined, head count per ceremony, pick-ups, rooms.
 * The "Invitations" tab lists each personal link: how often it was opened
 * and whether that guest has replied.
 *
 * SET UP (about 5 minutes, once):
 *   1. Create a new Google Sheet, e.g. "Pamoora wedding".
 *   2. In the sheet: Extensions → Apps Script. Delete the sample code, paste
 *      this whole file and click Save.
 *   3. In the toolbar choose the function "setup" and click Run. Allow the
 *      permissions Google asks for. The Summary, RSVPs, Visits and
 *      Invitations tabs appear in your sheet.
 *   4. Click Deploy → New deployment → the gear icon → Web app.
 *        Description:    Pamoora RSVP
 *        Execute as:     Me
 *        Who has access: Anyone            ← required, or nothing can arrive
 *      Click Deploy.
 *   5. Copy the "Web app URL" (it ends in /exec). Open it in your browser: it
 *      should say {"ok":true,"service":"Pamoora RSVP"}.
 *   6. Put that URL in source/src/config/wedding.js → rsvp.endpoint and
 *      rebuild the card (or send it to whoever maintains the site).
 *
 * Optional: put an email address in NOTIFY_EMAIL to get an email for each reply.
 * If you change this code later: Deploy → Manage deployments → edit (pencil) →
 * Version: New version → Deploy. The URL stays the same.
 */

const NOTIFY_EMAIL = ''; // e.g. 'family@example.com'

// The short English names of the ceremonies, exactly as in wedding.js (events[].short)
const EVENTS = ['Haldi', 'Mehendi & Sangeet', 'Baraat', 'Wedding & Reception'];

const SUMMARY_SHEET = 'Summary';
const RSVP_SHEET = 'RSVPs';
const VISIT_SHEET = 'Visits';
const INVITES_SHEET = 'Invitations';

const RSVP_COLUMNS = [
  ['receivedAt', 'Received'],
  ['updatedAt', 'Last updated'],
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

const VISIT_COLUMNS = [
  ['at', 'Opened at'],
  ['visitor', 'Device (anonymous id)'],
  ['invitedAs', 'Invitation name'],
  ['returning', 'New or returning'],
  ['language', 'Language'],
  ['device', 'Phone or computer'],
  ['from', 'Came from'],
];

const DATE_FORMAT = 'd mmm yyyy, h:mm am/pm';

/** Visiting the web-app URL in a browser shows this, which confirms it is live. */
function doGet() {
  return json_({ ok: true, service: 'Pamoora RSVP' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json_({ ok: true }); // the hidden form field was filled in: a spam bot
    return json_(data.type === 'visit' ? recordVisit_(data) : recordReply_(data));
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Run once from the Apps Script editor: creates the tabs and asks for permission. */
function setup() {
  ensureSheets_();
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUMMARY_SHEET).activate();
}

function recordVisit_(d) {
  const sheet = ensureSheets_()[VISIT_SHEET];
  const values = Object.assign({}, d, { at: toDate_(d.at) || new Date(), returning: d.returning ? 'Returning' : 'New' });
  sheet.appendRow(VISIT_COLUMNS.map(([key]) => (key === 'at' ? values.at : clean_(values[key]))));
  sheet.getRange(sheet.getLastRow(), 1).setNumberFormat(DATE_FORMAT);
  return { ok: true };
}

function recordReply_(d) {
  if (!d.id || !d.name) return { ok: false, error: 'Missing reply id or name' };
  const sheet = ensureSheets_()[RSVP_SHEET];
  const idColumn = column_(RSVP_COLUMNS, 'id');
  const last = sheet.getLastRow();
  const ids = last > 1 ? sheet.getRange(2, idColumn, last - 1, 1).getValues().map((r) => r[0]) : [];
  const existing = ids.indexOf(d.id);
  const rowNumber = existing >= 0 ? existing + 2 : last + 1;
  const now = new Date();
  const values = Object.assign({}, d, {
    receivedAt: existing >= 0 ? sheet.getRange(rowNumber, 1).getValue() : toDate_(d.submittedAt) || now,
    updatedAt: now,
  });
  const row = RSVP_COLUMNS.map(([key]) => (key === 'receivedAt' || key === 'updatedAt' ? values[key] : clean_(values[key])));

  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  sheet.getRange(rowNumber, 1, 1, 2).setNumberFormat(DATE_FORMAT);

  if (NOTIFY_EMAIL) {
    const lines = RSVP_COLUMNS.filter(([key]) => values[key] !== '' && values[key] != null).map(([key, label]) => `${label}: ${values[key]}`);
    MailApp.sendEmail(NOTIFY_EMAIL, `RSVP: ${d.name} (${d.attending})${existing >= 0 ? ' · updated' : ''}`, lines.join('\n'));
  }
  return { ok: true, updated: existing >= 0 };
}

/* ── Sheets ──────────────────────────────────────────────────────────── */

function ensureSheets_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = {};
  sheets[RSVP_SHEET] = table_(book, RSVP_SHEET, RSVP_COLUMNS);
  sheets[VISIT_SHEET] = table_(book, VISIT_SHEET, VISIT_COLUMNS);
  if (!book.getSheetByName(SUMMARY_SHEET)) buildSummary_(book);
  if (!book.getSheetByName(INVITES_SHEET)) buildInvitations_(book);
  return sheets;
}

function table_(book, name, columns) {
  const sheet = book.getSheetByName(name) || book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(columns.map(([, label]) => label));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, columns.length).setFontWeight('bold').setBackground('#F6EBC4');
  }
  return sheet;
}

const column_ = (columns, key) => columns.findIndex(([k]) => k === key) + 1;
const letter_ = (columns, key) => String.fromCharCode(64 + column_(columns, key));
const rsvpRange_ = (key) => `${RSVP_SHEET}!${letter_(RSVP_COLUMNS, key)}2:${letter_(RSVP_COLUMNS, key)}`;
const visitRange_ = (key) => `${VISIT_SHEET}!${letter_(VISIT_COLUMNS, key)}2:${letter_(VISIT_COLUMNS, key)}`;

/** Live counts. Formulas, so they update by themselves as rows arrive. */
function buildSummary_(book) {
  const sheet = book.insertSheet(SUMMARY_SHEET, 0);
  const attending = rsvpRange_('attending');
  const guests = rsvpRange_('guests');
  const rows = [
    ['Pamoora wedding · live summary', ''],
    ['', ''],
    ['Invitation opened (visits)', `=COUNTA(${visitRange_('at')})`],
    ['Different phones / computers', `=IFERROR(COUNTUNIQUE(${visitRange_('visitor')}),0)`],
    ['Personal links opened', `=IFERROR(COUNTUNIQUE(FILTER(${visitRange_('invitedAs')},${visitRange_('invitedAs')}<>"")),0)`],
    ['', ''],
    ['Replies received', `=COUNTA(${rsvpRange_('name')})`],
    ['Joyfully accepted', `=COUNTIF(${attending},"Yes")`],
    ['Regretfully declined', `=COUNTIF(${attending},"No")`],
    ['Guests coming (head count)', `=SUMIF(${attending},"Yes",${guests})`],
    ['', ''],
    ['Head count per ceremony', ''],
    ...EVENTS.map((ev) => [`    ${ev}`, `=SUMPRODUCT((${attending}="Yes")*ISNUMBER(SEARCH("${ev}",${rsvpRange_('events')}))*${guests})`]),
    ['', ''],
    ['Coming from outside Kunri', `=COUNTIF(${rsvpRange_('outstation')},"Yes")`],
    ['Need a pick-up', `=COUNTIF(${rsvpRange_('pickup')},"From*")`],
    ['Need a room', `=COUNTIF(${rsvpRange_('room')},"Yes")`],
    ['', ''],
    ['Last opened', `=IFERROR(1/(1/MAX(${visitRange_('at')})),"")`],
    ['Last reply', `=IFERROR(1/(1/MAX(${rsvpRange_('updatedAt')})),"")`],
  ];

  sheet.getRange(1, 1, rows.length, 1).setValues(rows.map(([label]) => [label]));
  rows.forEach(([, formula], i) => {
    if (formula) sheet.getRange(i + 1, 2).setFormula(formula);
  });
  sheet.getRange(1, 1).setFontWeight('bold').setFontSize(14);
  sheet.getRange(rows.length - 1, 2, 2, 1).setNumberFormat(DATE_FORMAT);
  sheet.getRange(3, 2, rows.length - 2, 1).setFontWeight('bold').setHorizontalAlignment('right');
  sheet.setColumnWidth(1, 260);
  sheet.setColumnWidth(2, 190);
}

/** One line per personal link (?to=…): how often it was opened and whether that guest replied. */
function buildInvitations_(book) {
  const sheet = book.insertSheet(INVITES_SHEET);
  const name = letter_(VISIT_COLUMNS, 'invitedAs');
  const at = letter_(VISIT_COLUMNS, 'at');
  const lastVisitColumn = letter_(VISIT_COLUMNS, VISIT_COLUMNS[VISIT_COLUMNS.length - 1][0]);
  const query =
    `select ${name}, count(${at}), max(${at}) where ${name} <> '' group by ${name} order by max(${at}) desc ` +
    `label ${name} 'Invitation', count(${at}) 'Times opened', max(${at}) 'Last opened'`;
  sheet.getRange('A1').setFormula(`=IFERROR(QUERY(${VISIT_SHEET}!A:${lastVisitColumn},"${query}",1),{"Invitation","Times opened","Last opened"})`);
  const invited = rsvpRange_('invitedAs');
  const attending = rsvpRange_('attending');
  sheet
    .getRange('D1')
    .setFormula(
      `={"Reply";ARRAYFORMULA(IF(A2:A="",,IFERROR(IF(VLOOKUP(A2:A,{${invited},${attending}},2,FALSE)="Yes","Accepted","Declined"),"No reply yet")))}`,
    );
  sheet.getRange('C:C').setNumberFormat(DATE_FORMAT);
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(3, 190);
  sheet.setColumnWidth(4, 140);
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function toDate_(iso) {
  const d = iso ? new Date(iso) : null;
  return d && !isNaN(d.getTime()) ? d : null;
}

/** Keep cells as plain text: a phone like +92… or a note starting with = must not become a formula. */
function clean_(value) {
  if (value == null) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  const text = String(value).slice(0, 1000);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
