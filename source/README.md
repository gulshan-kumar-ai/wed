# A Double Royal Union: wedding invitation

A vertical parallax wedding invitation built with React, Tailwind CSS and Framer Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Publish

The live site (https://gulshan-kumar-ai.github.io/wed/) is GitHub Pages serving the single-file card
in the repository root. After any change:

```bash
npm run release   # builds the card and copies it to ../index.html and "../Wedding Invitation.html"
git add -A && git commit -m "…" && git push
```

Committing only `source/` does not change the live site; the rebuilt `index.html` is what gets
deployed. Pages usually updates within a minute of the push.

## Personalise

| What | Where |
| --- | --- |
| Names, parents, invitation wording, stories, galleries, events, venues, RSVP settings | `src/config/wedding.js` |
| The same wording in Urdu and Sindhi | `src/config/wedding.i18n.js` |
| Buttons, labels and messages in all three languages | `src/strings.js` |
| Swap placeholder art for illustrations | `src/config/artwork.js` (+ files in `public/art/`) |
| Colours & fonts | `tailwind.config.js`, Google Fonts link in `index.html` |

## Languages

English, Urdu (اردو) and Sindhi (سنڌي). Guests choose on the opening doors or with the globe
button in the top bar; the choice is remembered, and a phone set to Urdu or Sindhi starts in that
language. Urdu and Sindhi lay
the page out right-to-left and use Noto Naskh Arabic. Personal names stay in English letters in every
language so nobody's name is misspelt. When you change wording in `wedding.js`, change it in
`wedding.i18n.js` too (anything missing there simply shows in English). Have a native reader check
the Urdu and Sindhi before sending.

## Timings still to confirm

While `timingsConfirmed` in `wedding.js` is `false`, the ceremony times and the phere muhurat are
marked "provisional", a note above the ceremonies says they will be updated, and calendar entries are
saved as tentative. Set it to `true` once the times are final.

## How the hero works

`HeroScene` is a 260vh section with a sticky, full-screen stage. Scroll progress
(`useScroll`) drives every layer through `useTransform`. Each layer zooms toward the
temple doorway at its own rate, which gives the depth:

| Layer | Component | Motion |
| --- | --- | --- |
| Sky, sun, clouds, birds | `art/SkyArt` | drifts down, 1.12× |
| Dunes & palms | `art/DistantArt` | 1.5× |
| Temple + flags | `art/TempleArt` | 3.2× |
| Mist veil | `layers/HazeLayer` | clears as you scroll |
| Courtyard, carpet, diyas | `art/CourtyardArt` | 3.6× |
| Floral urns, toran | `art/FloralUrn`, `art/Toran` | slide out of frame |
| Doorway light | in `HeroScene` | fades to ivory → next scene |

Full-scene layers share a 1440 × 900 artboard (`ArtBoard`, `xMidYMax slice`), so
replacement art lines up if it is exported at that size, bottom-centre aligned.
The zoom heads for artboard point (720, 700), the foot of the temple steps.

Smooth scrolling uses Lenis (`hooks/useSmoothScroll.js`). Reduced-motion users get native
scrolling and no ambient loops.

## Top bar & music

Language (globe), Share and Music sit together in the top corner (`components/ui/TopBar.jsx`). The bar
slides away while the guest scrolls down to read and returns as soon as they scroll up, so it never
sits on top of the content. On phones Share opens the phone's share sheet; on computers it opens a
menu (WhatsApp, Facebook, Instagram, Copy link). The music button pulses three times to invite a tap,
then stays still.

Music never auto-plays: it starts from the "Open the Invitation" tap or the music button. It looks
for `public/audio/ambient.mp3`; if the file is missing, it plays a gentle synthesized tanpura drone
instead (`hooks/useAmbientAudio.js`).

## Page journey

1. **Temple courtyard** (`components/hero`): walk-in through the temple doorway.
2. **Garden courtyard** (`components/garden`): mehrab arcade, peacocks on the balustrade, with the
   formal invitation card (`components/invitation`) scrolling over it.
3. **Floral mandap passage** (`components/mandap`): a flower wall with a scalloped arch you zoom through;
   the twins' story rises in beneath the heading as the wall clears.
4. **Meet the Couples** (`components/couples`): couple toggle, arch portraits, story, swipeable gallery.
5. **Wedding Festivities** (`components/events`): 2 × 2 scalloped cards, each with Save to Calendar
   (Google Calendar link or downloadable `.ics`), plus "Add all 4 events to my calendar": one
   `pamoora-wedding.ics` holding every ceremony (Apple Calendar, Outlook and most phones).
6. **Venues & Directions** (`components/venues`): tabbed locations with Google Maps embed and directions.
7. **Confirm Your Presence** (`components/rsvp`): RSVP on a royal scroll, with a festive confirmation.
8. **Things to Know** (`components/guide`): travel, dress code & weather, coordinator contacts.
9. **Grand finale** (`components/finale`): lit pavilion over a lotus pond at dusk, floating diyas,
   elephants, a live countdown to `finale.countdownTo` and the family blessing.

## Photos

Put files in `public/photos/` and reference them in `wedding.js` (`groomPhoto`, `bridePhoto`,
`gallery[].src`), e.g. `'photos/grouve.jpg'`. Until a portrait is added, the couple section shows a
small gilded arch with a marigold (groom) or lotus (bride) motif; the photo gallery only appears once
at least one gallery photo has a `src`, so guests never see "coming soon" tiles.

Coordinators whose number still contains `X` are hidden. If none have real numbers, the guide asks
guests to reply to whoever sent them the invitation (plus a "Message the family on WhatsApp" button
once `rsvp.whatsapp` is set).

## Maps

Each venue's `mapQuery` drives both the embedded map and the Get Directions button. Use exact
coordinates (`'25.1780,69.5660'`) once you have them; the sample entries all point at Kunri town.

## RSVP delivery

Guests accept or decline, choose events and say whose side they are on; guests coming from outside
Kunri add their arrival date and time and whether they need a pick-up (Mirpurkhas / Hyderabad, from
`rsvp.pickupFrom`) or a room. Every reply reaches the family by one of three routes:

| `rsvp.endpoint` | `rsvp.whatsapp` | What happens |
| --- | --- | --- |
| set | any | Posted to your Google Sheet; the guest sees "Your reply has reached the family". If the Sheet can't be reached, the guest is offered WhatsApp instead. |
| `null` | set | The reply opens in WhatsApp, addressed to that number, ready to send. |
| `null` | `null` | The reply opens in WhatsApp and the guest picks whom to send it to (whoever invited them). |

**Google Sheet setup:** follow the steps at the top of `rsvp/google-apps-script.gs` (create a Sheet →
Extensions → Apps Script → paste → run `setup` once → Deploy as a web app with access "Anyone" → copy
the `/exec` URL into `rsvp.endpoint`). The page sends a plain-text POST, which Apps Script accepts
without a CORS preflight. Each reply carries an id, so a guest who edits their reply updates their
row instead of adding one. Rows are written in English whatever language the guest used. Set
`NOTIFY_EMAIL` in the script to get an email per reply.

The same Sheet also counts visits (`src/analytics.js`, switch off with `rsvp.countVisits: false`):
one row each time someone opens the invitation (once per visit, so reloads don't count twice) with
the time, the personal-link name if there was one, new or returning device (a random id kept on the
phone), language and phone/computer. Opening the downloaded `.html` file on your own computer isn't
counted. The Sheet's tabs:

| Tab | What it shows |
| --- | --- |
| Summary | Live counts: invitation opens, different phones, personal links opened, replies, accepted, declined, guests coming, head count per ceremony, pick-ups, rooms, last open / reply |
| RSVPs | One row per guest reply |
| Visits | One row per visit |
| Invitations | Each personal link: how often it was opened, when, and whether that guest has replied |

The ceremony names in the script (`EVENTS`) must match `events[].short` in `wedding.js`.

A hidden form field catches spam bots. A reply saved by an older version of the page (which only
stored it on the guest's phone) is detected and the guest is asked to send it again.

## Personal links & the opening doors

Every first visit opens on a pair of carved doors. Tapping **Open the Invitation** swings them open
and starts the music (browsers only allow music after a tap); **Open without music** stays silent.

Add the guest's name (and party size) to the link to greet them personally:

```
https://your-site/?to=Sharma+Family&n=4
```

- `to`: shown as "Dear Sharma Family," on the doors and pre-filled as the RSVP name
- `n`: pre-fills the number of guests (capped at `rsvp.maxGuests`)
- `#invitation`, `#events`, `#venues`, `#rsvp`: open straight at that section
- `?intro`: always show the doors (for previewing)

The name is remembered on the guest's phone and then removed from the address bar, so a link they
copy and forward doesn't greet someone else by their name.

Returning guests skip the doors and the walk-in and land on the invitation card, with a
"Welcome back" note that can replay the entrance. Once past the opening scene, a dock at the
bottom (Invite · Events · Venue · RSVP) jumps between sections; RSVP stays a bright pill
until the guest has replied on that device.

## Sharing on WhatsApp

1. `siteUrl` in `wedding.js` is the address where the card is published
   (`https://gulshan-kumar-ai.github.io/wed`). WhatsApp only shows the thumbnail when the image URL
   is absolute, so keep it up to date if the card moves (a `VITE_SITE_URL` variable overrides it).
2. After changing names or dates, run `npm run og` to regenerate `public/og-image.jpg` (the
   1200 × 630 preview) from the hero scene, copy it to the repository root, then publish (below).
3. The page title, description and preview tags are generated from `src/config/wedding.js` at build
   time, so they always match the invitation.

WhatsApp caches previews per URL; if an old preview sticks, share the link with a harmless query
string such as `?v=2`.

## Mobile & performance notes

- Pinned scenes use `svh` units, so the pinned scenes don't jump when the phone's address bar shows or hides.
- Ambient loops (diya flames, garlands, petals, lanterns) pause while their scene is off screen,
  and are switched off entirely for visitors who prefer reduced motion.
- On phones, loops inside the large full-screen art layers are frozen and heavy SVG shadows are
  skipped. The loops on small pieces (urn diyas, garlands, petals) keep the scene feeling alive.
- The root uses `overflow-x: clip` as a safety net; the layout itself has no horizontal overflow
  at 320–1440 px.
