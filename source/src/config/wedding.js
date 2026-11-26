/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING DETAILS — edit this file to personalise the invite.
 *  Lines marked TODO still hold placeholder or estimated details.
 * ─────────────────────────────────────────────────────────────
 */
export const wedding = {
  invocation: '॥ Shree Ganeshaya Namah ॥', // hero line; set to '' to hide

  subtitle: 'A Double Royal Union',

  location: 'Kunri, Sindh, Pakistan',
  dates: '14 – 16 January 2027', // TODO: confirm the festivity dates (Shubh Vivah on the 16th)

  // Auspicious emblem shown above the hero title
  emblem: {
    om: true,
    swastika: true, // the Hindu sathiya, drawn upright with four dots
  },

  music: {
    // A sitar & tabla raga, edited for the invitation (soft level, fades for a seamless loop):
    // audio/ambient.mp3 (and public/audio/ambient.mp3). Its licence (CC BY-SA 3.0) asks for the
    // credit below, which the footer shows. To use another track, replace both files and update
    // the credit. If the file is missing, a soft synthesized tanpura drone plays instead.
    src: 'audio/ambient.mp3', // relative, so it also works when the page is opened from disk
    volume: 0.8, // computers and Android; iPhones play the file at its own (soft) level
    credit: {
      title: 'Raga Kaushi Kanra',
      artist: 'Ranjit Makkuni (sitar) & Akram Khan (tabla)',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      source: 'https://commons.wikimedia.org/wiki/File:RanjitMakkuniRagaKaushiKanra.ogg',
    },
  },

  /* ── Formal invitation ───────────────────────────────────── */

  // The grooms' parents: the hosts of the invitation
  family: {
    hosts: 'Smt. Vineeta & Shri Prem Uttamchand, Pamoora',
    // Optional line above the hosts; set to '' to hide
    blessings: 'With the divine grace of Lord Ganesha and the blessings of our elders',
  },

  invitation: {
    mantra: '॥ Shree Ganeshaya Namah ॥',
    request: 'request the honour of your gracious presence and blessings at the auspicious double wedding of their beloved twin sons',
    dateLine: 'Thursday 14 to Saturday 16 January 2027',
    closing: 'Your presence will make the celebrations complete.',
    quote: 'Saj-dhaj kar aana, khushiyaan sang laana, mere judwa bhaiyon ki shaadi mein zaroor-zaroor aana.',
    quoteBy: 'Chohiet Pamoora',
    // Optional sign-off line at the bottom of the card; '' to hide
    compliments: 'With love & warm regards from the Pamoora Pariwar',
  },

  venue: {
    name: 'Pamoora House',
    address: 'Kunri, District Umerkot, Sindh, Pakistan',
  },

  /* ── Meet the couples ────────────────────────────────────── */

  twinStory:
    'Born together and raised together in Kunri, they have shared everything: a cradle, a classroom and countless dreams. One became a doctor, the other an engineer. Now, on the same auspicious day, each begins a new life beside the person who completes him.',

  // Couple order matters: [0] is Groom 1 / Bride 1, [1] is Groom 2 / Bride 2.
  //   groom / bride            short first names (toggle, footer, link preview)
  //   groomName / brideName    full names shown on the hero and the card
  //   groomTitle / brideTitle  honorifics shown before the full name
  couples: [
    {
      groom: 'Grouve',
      groomName: 'Grouve Kumar',
      groomTitle: 'Dr.',
      bride: 'Payal',
      brideName: 'Payal Kumari',
      brideTitle: 'Dr.',
      groomPrefix: '', // optional word before the title, e.g. 'Chi.' (Chiranjeevi)
      bridePrefix: '',
      brideParents: 'Shri Kailash Kumar Harani',
      brideHometown: '',
      // Portraits: put files in public/photos/ and set e.g. 'photos/grouve.jpg'
      // (no leading slash, so it also works from the GitHub Pages sub-folder)
      groomPhoto: null,
      bridePhoto: null,
      tagline: 'The doctor of the twins',
      // TODO: replace with their own story
      story:
        'Two doctors, one shared calling to care for others. Dr. Grouve and Dr. Payal bring together healing hands and kind hearts, and both families feel blessed to see them begin this journey together.',
      gallery: [
        { src: null, caption: 'Where it began' },
        { src: null, caption: 'Roka ceremony' },
        { src: null, caption: 'Festivals together' },
        { src: null, caption: 'Engagement' },
        { src: null, caption: 'Pre-wedding shoot' },
      ],
    },
    {
      groom: 'Gulshan',
      groomName: 'Gulshan Kumar',
      groomTitle: 'Engr.',
      bride: 'Prena',
      brideName: 'Prena Kumari',
      brideTitle: 'Dr.',
      groomPrefix: '',
      bridePrefix: '',
      brideParents: 'Shri Tarachand Dedha',
      brideHometown: '',
      groomPhoto: null,
      bridePhoto: null,
      tagline: 'The engineer of the twins',
      // TODO: replace with their own story
      story:
        'An engineer who builds and a doctor who heals. Engr. Gulshan and Dr. Prena make a partnership built on strong foundations and gentle care, and their families cannot wait to celebrate them.',
      gallery: [
        { src: null, caption: 'Where it began' },
        { src: null, caption: 'Roka ceremony' },
        { src: null, caption: 'Festivals together' },
        { src: null, caption: 'Engagement' },
        { src: null, caption: 'Pre-wedding shoot' },
      ],
    },
  ],

  /* ── Celebration timeline ────────────────────────────────── */

  // All times are Pakistan Standard Time (UTC+05:00, no daylight saving).
  timeZone: 'Asia/Karachi',

  // Set to false to mark the timings "provisional" on the cards (and save calendar
  // entries as tentative) if they are ever uncertain again.
  timingsConfirmed: true,

  events: [
    {
      id: 'haldi',
      motif: 'marigold', // lotus | dhol | marigold | fire
      title: 'Ganesh Sthapana & Haldi',
      short: 'Haldi', // label on the RSVP form
      subtitle: 'Pithi',
      start: '2027-01-14T10:00:00+05:00',
      end: '2027-01-14T14:00:00+05:00',
      venueId: 'residence',
      dressCode: 'Yellow & Marigold',
      description: 'We begin by seating Lord Ganesha, then shower both grooms with turmeric, blessings and plenty of laughter.',
    },
    {
      id: 'sangeet',
      motif: 'dhol',
      title: 'Mehendi & Sangeet Night',
      short: 'Mehendi & Sangeet',
      start: '2027-01-15T18:30:00+05:00',
      end: '2027-01-15T23:30:00+05:00',
      venueId: 'hall',
      dressCode: 'Vibrant Festive',
      description: 'Henna, dholki, Sindhi folk songs and two families competing on the dance floor. Bring your best moves.',
    },
    {
      id: 'baraat',
      motif: 'lotus',
      title: 'Royal Twin Baraat Procession',
      short: 'Baraat',
      start: '2027-01-16T16:30:00+05:00',
      end: '2027-01-16T18:30:00+05:00',
      venueId: 'hall',
      route: { from: 'Pamoora House', to: 'Alfateh Marriage Hall' },
      // Optional illustration on the card (files in public/art/events/; WebP with a JPEG fallback)
      image: {
        webp: 'art/events/baraat.webp',
        fallback: 'art/events/baraat.jpg',
        width: 560,
        height: 216,
        alt: 'The baraat: the groom on a white horse, the bride in a decorated doli, dhol players and dancing guests',
      },
      dressCode: 'Royal Traditional',
      description: 'Two grooms, two decorated mounts, one band. The twin baraat sets out from Pamoora House and dances its way to the mandap.',
    },
    {
      id: 'vivah',
      motif: 'fire',
      title: 'Shubh Vivah (Phere) & Reception',
      short: 'Wedding & Reception',
      start: '2027-01-16T19:00:00+05:00',
      end: '2027-01-17T00:30:00+05:00',
      venueId: 'hall',
      // Phere muhurat, shown in each language's time format. TODO: confirm with the pandit ji.
      muhurat: { start: '2027-01-16T20:41:00+05:00', end: '2027-01-16T22:15:00+05:00' },
      dressCode: 'Traditional Formal',
      image: {
        webp: 'art/events/phere.webp',
        fallback: 'art/events/phere.jpg',
        width: 529,
        height: 322,
        alt: 'The wedding ceremony under the flower mandap, with the family gathered around the couple',
      },
      description: 'The sacred seven vows around the holy fire, followed by dinner and the reception for both couples.',
    },
  ],

  /* ── Venues & maps ───────────────────────────────────────── */

  // `mapQuery` is what Google Maps searches for. For pin-point accuracy use
  // coordinates, e.g. '25.1780,69.5660' (right-click the spot in Google Maps to copy them).
  venues: [
    {
      id: 'residence',
      tab: 'Pamoora House · Haldi',
      name: 'Pamoora House',
      address: 'Kunri, District Umerkot, Sindh',
      mapQuery: 'Kunri, Umerkot, Sindh, Pakistan', // TODO: exact location of Pamoora House
      landmarks: [
        'The family residence of the Pamoora Pariwar in Kunri',
        'Message the family when you reach Kunri and we will guide you to the door',
      ],
      hosts: 'Ganesh Sthapana, Haldi and the Baraat departure',
    },
    {
      id: 'hall',
      tab: 'Alfateh Marriage Hall · Mandap',
      name: 'Alfateh Marriage Hall',
      address: 'Kunri, District Umerkot, Sindh',
      mapQuery: 'Alfateh Marriage Hall, Kunri, Sindh, Pakistan', // TODO: check the pin, or use coordinates
      landmarks: [
        'Venue for the Mehendi & Sangeet, the Baraat arrival, Phere and Reception',
        'Volunteers will guide cars to the parking area from 4:00 PM',
      ],
      hosts: 'Mehendi & Sangeet, the Baraat arrival, Phere and the Reception',
    },
  ],

  /* ── RSVP ────────────────────────────────────────────────── */

  rsvp: {
    deadline: 'Kindly respond by 31 December 2026',
    // Where replies go (see README, "RSVP delivery"):
    //   endpoint  the Google Apps Script web-app URL from rsvp/google-apps-script.gs;
    //             every reply is then written to your Google Sheet.
    //   whatsapp  a family WhatsApp number, international format without '+'
    //             (e.g. '923001234567'). Replies open in WhatsApp addressed to it.
    // With neither set, the reply opens in WhatsApp and the guest picks who to send
    // it to (usually whoever sent them the invitation), so it still reaches you.
    endpoint: null, // TODO: paste the Apps Script web-app URL here
    whatsapp: '923328209460', // Prem U. Pamoora (+92 332 8209460)
    // With an endpoint, also count how often the invitation is opened (Summary and Visits tabs)
    countVisits: true,
    maxGuests: 10,
    // Travel questions for guests coming from outside Kunri
    arrivalDates: ['2027-01-13', '2027-01-14', '2027-01-15', '2027-01-16'],
    pickupFrom: [
      { id: 'mirpurkhas', label: 'Mirpurkhas' },
      { id: 'hyderabad', label: 'Hyderabad' },
    ],
  },

  /* ── Guest guide ─────────────────────────────────────────── */

  // Travel times are approximate; check them before sharing.
  guide: {
    travel: {
      title: 'Travel & Arrival',
      points: [
        'Flying in? Land at Jinnah International, Karachi. Kunri is roughly 5–6 hours by road via Hyderabad and Mirpurkhas.',
        'From Hyderabad, allow about 3 hours by road via Mirpurkhas.',
        'By rail, travel to Mirpur Khas, then continue about 1½ hours by road to Kunri.',
        'Share your arrival details in the RSVP and we will arrange a pick-up from Mirpurkhas or Hyderabad.',
      ],
    },
    attire: {
      title: 'Dress Code & Weather',
      points: [
        'January in Sindh brings sunny days and chilly nights that can drop below 10 °C.',
        'Bring a warm shawl or jacket for the evening ceremonies.',
        'Haldi: yellow & marigold. Sangeet: vibrant festive. Wedding: traditional formal.',
        'Comfortable footwear helps: the baraat dances its way through the streets.',
      ],
    },
    hospitality: {
      title: 'Blessings & Hospitality',
      intro: 'For travel, stays or anything you need, please get in touch:',
      // Use full international numbers (+92 …), so the Call and WhatsApp buttons work from abroad too.
      // To add another contact, add a line here and its translated role in wedding.i18n.js (same position).
      coordinators: [
        { name: 'Prem U. Pamoora', role: 'Family contact · travel, stays and any help', phone: '+92 332 8209460' },
      ],
    },
  },

  /* ── Grand finale ────────────────────────────────────────── */

  finale: {
    eyebrow: 'The auspicious hour approaches',
    title: 'Counting Down to the Shubh Vivah',
    subtitle: 'Starts 16 January, 2027',
    // The moment the countdown runs to (with time zone offset): the Shubh Vivah start
    countdownTo: '2027-01-16T19:00:00+05:00',
    arrivedMessage: 'The celebrations have begun. Welcome to Kunri!',
    regards: 'With warm regards,',
    family: 'The Pamoora Pariwar, Kunri',
  },

  footer: {
    hashtag: '#JudwaaKiShaadi',
  },

  /* ── Website address & link previews (WhatsApp / social) ─── */
  // Where the invitation is published (no trailing slash). WhatsApp needs it to show
  // the preview picture, and the Share button uses it when the card is opened from a
  // file on your computer. Title and description are generated from this file at
  // build time (vite.config.js). A VITE_SITE_URL environment variable overrides it.
  siteUrl: 'https://gulshan-kumar-ai.github.io/wed',
};
