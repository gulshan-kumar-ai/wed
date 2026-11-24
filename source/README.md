# A Double Royal Union: wedding invitation

A vertical parallax wedding invitation built with React, Tailwind CSS and Framer Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Personalise

| What | Where |
| --- | --- |
| Names, parents, invitation wording, stories, galleries, events, venues, RSVP settings | `src/config/wedding.js` |
| Swap placeholder art for illustrations | `src/config/artwork.js` (+ files in `public/art/`) |
| Colours & fonts | `tailwind.config.js`, Google Fonts link in `index.html` |

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

## Music

The toggle never auto-plays. It looks for `public/audio/ambient.mp3`. If the file is missing,
it plays a gentle synthesized tanpura drone instead (`hooks/useAmbientAudio.js`).

## Page journey

1. **Temple courtyard** (`components/hero`): walk-in through the temple doorway.
2. **Garden courtyard** (`components/garden`): mehrab arcade, peacocks on the balustrade, with the
   formal invitation card (`components/invitation`) scrolling over it.
3. **Floral mandap passage** (`components/mandap`): a flower wall with a scalloped arch you zoom through.
4. **Meet the Couples** (`components/couples`): twin story, couple toggle, arch portraits, swipeable gallery.
5. **Wedding Festivities** (`components/events`): 2 × 2 scalloped cards, each with Save to Calendar
   (Google Calendar link or downloadable `.ics`).
6. **Venues & Directions** (`components/venues`): tabbed locations with Google Maps embed and directions.
7. **Confirm Your Presence** (`components/rsvp`): RSVP on a royal scroll, with a festive confirmation.
8. **Things to Know** (`components/guide`): travel, dress code & weather, coordinator contacts.
9. **Grand finale** (`components/finale`): lit pavilion over a lotus pond at dusk, floating diyas,
   elephants, a live countdown to `finale.countdownTo` and the family blessing.

## Photos

Put files in `public/photos/` and reference them in `wedding.js` (`groomPhoto`, `bridePhoto`,
`gallery[].src`), e.g. `'/photos/vikram.jpg'`. Without photos, tasteful placeholders are shown.

## Maps

Each venue's `mapQuery` drives both the embedded map and the Get Directions button. Use exact
coordinates (`'25.1780,69.5660'`) once you have them; the sample entries all point at Kunri town.

## RSVP delivery

By default an RSVP is only saved in the guest's own browser. To actually receive responses, set
`rsvp.endpoint` to a URL that accepts a JSON POST (a Google Apps Script web app writing to a Sheet,
Formspree, etc.) and/or `rsvp.whatsapp` to show a "Send on WhatsApp" button after submitting.

## Sharing on WhatsApp

1. Copy `.env.example` to `.env.production` and set `VITE_SITE_URL` to the address where the site
   will live (e.g. `https://our-wedding.netlify.app`). WhatsApp only shows the thumbnail when the
   image URL is absolute.
2. After changing names or dates, run `npm run og` to regenerate `public/og-image.jpg` (the
   1200 × 630 preview) from the hero scene, then deploy `dist/`.
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
