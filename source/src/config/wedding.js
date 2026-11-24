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
    // Put a royalty-free shehnai / sitar loop at public/audio/ambient.mp3.
    // If the file is missing, a soft synthesized tanpura drone plays instead.
    src: 'audio/ambient.mp3', // relative, so it also works when the page is opened from disk
    volume: 0.32,
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
      groomPrefix: 'Chi.', // Chiranjeevi
      bridePrefix: '',
      brideParents: 'Shri Kailash Kumar Harani',
      brideHometown: '',
      // Portraits: put files in public/photos/ and set e.g. '/photos/grouve.jpg'
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
      groomPrefix: 'Chi.',
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
  // TODO: confirm the days and times of each ceremony.
  timeZone: 'Asia/Karachi',

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
      muhurat: '8:41 PM – 10:15 PM', // TODO: confirm the phere muhurat with the pandit ji
      dressCode: 'Traditional Formal',
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
        'Please call a coordinator on arrival and we will guide you to the door',
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
    {
      id: 'stay',
      tab: 'Guest Accommodation',
      name: 'Guest Stay (arranged by the family)',
      address: 'Kunri, District Umerkot, Sindh',
      mapQuery: 'Kunri, Umerkot, Sindh, Pakistan',
      landmarks: [
        'Rooms are reserved for outstation guests from 13 to 17 January',
        'Please share your arrival details in the RSVP so we can arrange pick-ups',
      ],
      hosts: 'Outstation guests travelling to Kunri',
    },
  ],

  /* ── RSVP ────────────────────────────────────────────────── */

  rsvp: {
    deadline: 'Kindly respond by 31 December 2026',
    // Optional: a URL that accepts a JSON POST (e.g. a Google Apps Script web
    // app or Formspree endpoint). If null, responses are kept in the guest's
    // browser only and the family is notified via the WhatsApp button below.
    endpoint: null,
    // Optional: family WhatsApp number in international format without '+'
    // (e.g. '923001234567'). Shows a "Send on WhatsApp" button after RSVP.
    whatsapp: null,
    maxGuests: 10,
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
        'Tell us your arrival time in the RSVP and we will arrange pick-ups from Mirpurkhas.',
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
      intro: 'Our coordinators are happy to help with travel, stays and anything you need.',
      // TODO: names and numbers. Use full international numbers, e.g. '+92 300 1234567'.
      // Numbers containing 'X' are treated as placeholders and are not linked.
      coordinators: [
        { name: 'Travel coordinator', role: 'Pick-ups from Mirpurkhas & Hyderabad', phone: '+92 3XX XXXXXXX' },
        { name: 'Stay coordinator', role: 'Guest rooms & accommodation', phone: '+92 3XX XXXXXXX' },
        { name: 'Ceremonies coordinator', role: 'Timings, rituals & ladies’ sangeet', phone: '+92 3XX XXXXXXX' },
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

  /* ── Link previews (WhatsApp / social) ───────────────────── */
  // Title and description are generated from this file at build time (vite.config.js).
  // The image's absolute URL comes from VITE_SITE_URL (see .env.example).
};
