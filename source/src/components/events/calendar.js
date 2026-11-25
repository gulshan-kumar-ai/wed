/** Date formatting (English, Urdu, Sindhi) and calendar links (Google Calendar + downloadable .ics). */

/* Urdu and Sindhi names are written out here rather than left to the browser,
   which may not know Sindhi and words Urdu times inconsistently. */
const NAMES = {
  ur: {
    weekdays: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
    months: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
    periods: { morning: 'صبح', noon: 'دوپہر', evening: 'شام', night: 'رات' },
  },
  sd: {
    weekdays: ['آچر', 'سومر', 'اڱارو', 'اربع', 'خميس', 'جمعو', 'ڇنڇر'],
    months: ['جنوري', 'فيبروري', 'مارچ', 'اپريل', 'مئي', 'جون', 'جولاءِ', 'آگسٽ', 'سيپٽمبر', 'آڪٽوبر', 'نومبر', 'ڊسمبر'],
    periods: { morning: 'صبح', noon: 'منجهند', evening: 'شام', night: 'رات' },
  },
};

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Calendar fields of an instant as seen in `timeZone`, or of a bare YYYY-MM-DD date. */
function parts(iso, timeZone) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split('-').map(Number);
    return { year: y, month: m - 1, day: d, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay(), hour: 0, minute: 0 };
  }
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  });
  const p = Object.fromEntries(f.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return {
    year: Number(p.year),
    month: Number(p.month) - 1,
    day: Number(p.day),
    weekday: WEEKDAYS_EN.indexOf(p.weekday),
    hour: Number(p.hour) % 24,
    minute: Number(p.minute),
  };
}

/** Thursday, 14 January 2027 · جمعرات، 14 جنوری 2027 */
export function formatDay(iso, timeZone, lang = 'en') {
  const n = NAMES[lang];
  if (!n) {
    return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone }).format(new Date(iso));
  }
  const d = parts(iso, timeZone);
  return `${n.weekdays[d.weekday]}، ${d.day} ${n.months[d.month]} ${d.year}`;
}

/** Thu 14 Jan · جمعرات 14 جنوری (the arrival-date choices; takes YYYY-MM-DD) */
export function formatShortDay(isoDate, lang = 'en') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate || '')) return '';
  const d = parts(isoDate);
  const n = NAMES[lang];
  if (!n) {
    const month = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(d.year, d.month, 1)));
    return `${WEEKDAYS_EN[d.weekday]} ${d.day} ${month}`;
  }
  return `${n.weekdays[d.weekday]} ${d.day} ${n.months[d.month]}`;
}

/** 7:00 PM · شام 7:00 · رات 11:30 */
export function formatTime(iso, timeZone, lang = 'en') {
  const n = NAMES[lang];
  if (!n) {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone }).format(new Date(iso));
  }
  const { hour, minute } = parts(iso, timeZone);
  const period = hour >= 4 && hour < 12 ? 'morning' : hour >= 12 && hour < 16 ? 'noon' : hour >= 16 && hour < 20 ? 'evening' : 'night';
  return `${n.periods[period]} ${hour % 12 || 12}:${String(minute).padStart(2, '0')}`;
}

export const formatTimeRange = (start, end, timeZone, lang) => `${formatTime(start, timeZone, lang)} – ${formatTime(end, timeZone, lang)}`;

/** 2027-02-12T10:00:00+05:00 → 20270212T050000Z */
const toUtcStamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function googleCalendarUrl({ title, start, end, details, location }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const escapeIcs = (s = '') => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

/** Fold long lines at 75 octets as RFC 5545 requires (never splitting a UTF-8 character). */
const fold = (line) => {
  const enc = new TextEncoder();
  const out = [];
  let current = '';
  let bytes = 0;
  for (const ch of line) {
    const size = enc.encode(ch).length;
    const limit = out.length ? 74 : 75; // continuation lines start with a space
    if (bytes + size > limit) {
      out.push(current);
      current = '';
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join('\r\n ');
};

const vevent = ({ id, title, start, end, details, location, tentative = false }) => [
  'BEGIN:VEVENT',
  `UID:${id}@double-royal-union`,
  `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
  `DTSTART:${toUtcStamp(start)}`,
  `DTEND:${toUtcStamp(end)}`,
  `SUMMARY:${escapeIcs(title)}`,
  `DESCRIPTION:${escapeIcs(details)}`,
  `LOCATION:${escapeIcs(location)}`,
  `STATUS:${tentative ? 'TENTATIVE' : 'CONFIRMED'}`,
  'BEGIN:VALARM',
  'TRIGGER:-PT3H',
  'ACTION:DISPLAY',
  `DESCRIPTION:${escapeIcs(title)}`,
  'END:VALARM',
  'END:VEVENT',
];

/** One .ics calendar holding one or more events (e.g. all four ceremonies at once). */
export function buildIcs(events, calendarName = '') {
  const list = Array.isArray(events) ? events : [events];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//A Double Royal Union//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...(calendarName ? [`X-WR-CALNAME:${escapeIcs(calendarName)}`] : []),
    ...list.flatMap(vevent),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n');
}

/** Download a single event (`event`) or several (`[...]`, with a file name) as an .ics file. */
export function downloadIcs(events, fileName, calendarName) {
  const name = fileName ?? `${(Array.isArray(events) ? events[0] : events).id}.ics`;
  const blob = new Blob([buildIcs(events, calendarName)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
