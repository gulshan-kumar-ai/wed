/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING DETAILS — edit this file to personalise the invite.
 *  Lines marked TODO still hold placeholder or estimated details.
 * ─────────────────────────────────────────────────────────────
 */
export const wedding = {
  invocation: 'Om Shree Ganeshaye Namah', // hero line; set to '' to hide

  subtitle: 'A Double Royal Union',

  location: 'Kunri, Sindh, Pakistan',
  dates: '16 – 31 January 2027',

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
    hosts: 'Mr. & Mrs. Prem Kumar Pamoora',
    // Optional line above the hosts; set to '' to hide
    blessings: '',
  },

  invitation: {
    mantra: 'Om Shree Ganeshaye Namah',
    request: 'With the blessings of ancestors and grace of the Almighty, we cordially invite you to join us for the Wedding Ceremony of our beloved Sons.',
    dateLine: 'Monday, 18th January 2027',
    closing: 'Your presence will make the celebrations complete.',
    quote: 'Saj-dhaj kar aana, khushiyaan sang laana, mere judwa bhaiyon ki shaadi mein zaroor-zaroor aana.',
    quoteBy: 'Chohiet Pamoora',
    // Optional sign-off line at the bottom of the card; '' to hide
    compliments: 'With Warm Regards, The Pamoora & Ratnani Pariwar',
  },

  venue: {
    name: 'Alfateh Marriage Hall',
    address: 'Kunri, Sindh, Pakistan',
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
      groomName: 'Grouve Kumar (Gaurav)',
      groomTitle: 'Dr.',
      bride: 'Payal',
      brideName: 'Payal Kumari',
      brideTitle: 'Dr.',
      groomPrefix: '', // optional word before the title, e.g. 'Chi.' (Chiranjeevi)
      bridePrefix: '',
      brideParents: 'Seth Kelash Harani',
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
      brideParents: 'Seth Tarachand Dedha',
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
      id: 'lagan',
      motif: 'marigold',
      title: 'Lagan Rasam',
      short: 'Lagan',
      start: '2027-01-16T10:00:00+05:00',
      end: '2027-01-16T13:00:00+05:00',
      venueId: 'residence',
      dressCode: 'Traditional',
      description: 'The auspicious Lagan ceremony marks the formal beginning of the wedding rituals, with sacred rites and blessings from the family elders.',
    },
    {
      id: 'haldi',
      motif: 'marigold',
      title: 'Haldi',
      short: 'Haldi',
      start: '2027-01-16T14:00:00+05:00',
      end: '2027-01-16T17:00:00+05:00',
      venueId: 'residence',
      dressCode: 'Yellow & Marigold',
      description: 'Turmeric, blessings and laughter — the grooms are showered with haldi by family and friends.',
    },
    {
      id: 'dawat-general',
      motif: 'dhol',
      title: 'General Dawat',
      short: 'General Dawat',
      start: '2027-01-17T19:30:00+05:00',
      end: '2027-01-17T23:00:00+05:00',
      venueId: 'hall',
      dressCode: 'Festive',
      description: 'A joyful dinner gathering for family and guests to celebrate the beginning of the festivities.',
    },
    {
      id: 'mehndi',
      motif: 'dhol',
      title: 'Mehndi Night',
      short: 'Mehndi',
      start: '2027-01-18T00:00:00+05:00',
      end: '2027-01-18T03:00:00+05:00',
      venueId: 'hall',
      dressCode: 'Vibrant Festive',
      description: 'A midnight mehndi celebration with henna, dholki and Sindhi folk songs into the early hours.',
    },
    {
      id: 'binayak-grouve',
      motif: 'lotus',
      title: 'Gaurav Binayak',
      short: 'Gaurav Binayak',
      start: '2027-01-18T10:00:00+05:00',
      end: '2027-01-18T13:00:00+05:00',
      venueId: 'residence',
      dressCode: 'Traditional',
      description: 'The sacred Binayak (Vinayak Puja) ceremony for Dr. Grouve Kumar (Gaurav) — seeking Lord Ganesha\'s blessings before the baraat.',
    },
    {
      id: 'ghore',
      motif: 'lotus',
      title: 'Ghore',
      short: 'Ghore',
      start: '2027-01-18T16:00:00+05:00',
      end: '2027-01-18T18:00:00+05:00',
      venueId: 'residence',
      dressCode: 'Royal Traditional',
      description: 'The groom mounts the decorated horse to the sounds of the dhol — the royal baraat procession prepares to set out.',
    },
    {
      id: 'dawat-main',
      motif: 'fire',
      title: 'Main Dawat & Musical Night',
      short: 'Main Dawat',
      start: '2027-01-18T20:00:00+05:00',
      end: '2027-01-19T01:00:00+05:00',
      venueId: 'hall',
      dressCode: 'Traditional Formal',
      description: 'The grand wedding dinner followed by a spectacular musical night — celebrate with family and friends under the stars.',
    },
    {
      id: 'baraat-grouve',
      motif: 'lotus',
      title: 'Royal Baraat — Dr. Grouve Kumar (Gaurav)',
      short: 'Grouve Baraat',
      start: '2027-01-19T12:00:00+05:00',
      end: '2027-01-19T16:00:00+05:00',
      venueId: 'residence',
      route: { from: 'Kunri', to: 'Digree' },
      image: {
        webp: 'art/events/baraat.webp',
        fallback: 'art/events/baraat.jpg',
        width: 560,
        height: 216,
        alt: 'The baraat: the groom on a white horse, dhol players and dancing guests',
      },
      dressCode: 'Royal Traditional',
      description: 'Dr. Grouve Kumar (Gaurav)\'s royal baraat procession sets out from Kunri to Digree, bringing the family\'s joy and blessings to the bride\'s home.',
    },
    {
      id: 'binayak-gulshan',
      motif: 'lotus',
      title: 'Gulshan Binayak',
      short: 'Gulshan Binayak',
      start: '2027-01-30T15:00:00+05:00',
      end: '2027-01-30T18:00:00+05:00',
      venueId: 'residence',
      dressCode: 'Traditional',
      description: 'The sacred Binayak (Vinayak Puja) ceremony for Engr. Gulshan Kumar — seeking Lord Ganesha\'s blessings before the baraat to Karachi.',
    },
    {
      id: 'baraat-gulshan',
      motif: 'fire',
      title: 'Royal Baraat — Engr. Gulshan Kumar',
      short: 'Gulshan Baraat',
      start: '2027-01-31T12:00:00+05:00',
      end: '2027-01-31T16:00:00+05:00',
      venueId: 'residence',
      route: { from: 'Kunri', to: 'Karachi' },
      image: {
        webp: 'art/events/baraat.webp',
        fallback: 'art/events/baraat.jpg',
        width: 560,
        height: 216,
        alt: 'The baraat: the groom on a white horse, dhol players and dancing guests',
      },
      dressCode: 'Royal Traditional',
      description: 'Engr. Gulshan Kumar\'s royal baraat travels from Kunri to Karachi, bringing the family\'s love and blessings to celebrate with the bride\'s family.',
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
      tab: 'Alfateh Marriage Hall · Dawat',
      name: 'Alfateh Marriage Hall',
      address: 'Kunri, District Umerkot, Sindh',
      mapQuery: 'Alfateh Marriage Hall, Kunri, Sindh, Pakistan', // TODO: check the pin, or use coordinates
      landmarks: [
        'Venue for the Mehndi Night, General Dawat and Main Dawat & Musical Night',
        'Volunteers will guide cars to the parking area from 7:00 PM',
      ],
      hosts: 'Mehndi Night, General Dawat & Main Dawat',
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
    arrivalDates: ['2027-01-15', '2027-01-16', '2027-01-17', '2027-01-18'],
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
    countdownTo: '2027-01-18T12:00:00+05:00',
    arrivedMessage: 'The celebrations have begun. Welcome to Kunri!',
    regards: 'With warm regards,',
    family: 'The Pamoora & Ratnani Pariwar',
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
