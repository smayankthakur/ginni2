# Ginni Ki Baatein — Tarot Chat (Next.js)

A private tarot counsel web app: name + language onboarding, a left-hand menu
of 10 questions, a random card spread, and readings pulled unmodified from the
JSON source files.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm run start
```

## Structure

- `app/page.js` — top-level screen switcher (onboarding → app)
- `app/layout.js` — fonts + global shell
- `app/globals.css` — all design tokens and styles
- `components/Onboarding.jsx` — name + language capture
- `components/Sidebar.jsx` — the 10-question menu
- `components/ReadingPanel.jsx` — spread, draw, and reveal logic
- `components/TarotCard.jsx` — the flippable card
- `lib/topics.js` — the 78-card deck + the 10 topic definitions
- `lib/readings.js` — imports the 7 JSON reading files topics draw from
- `lib/parseReading.js` — language-aware parser for the raw reading text
- `data/*.json` — the reading content itself (unmodified from source docs)

## Known data gaps (carried over from the source documents, not bugs)

- Topics 1&3 and 2&4 share one reading file each — no separate "crush"
  version exists yet.
- Topic 7 ("Aapka Aaj Ka Din Kaisa Rahega") temporarily reuses the
  universe-guidance file (`data/daily-placeholder.json`) — its own source
  document uploaded empty and needs to be re-supplied and swapped into
  `lib/readings.js` / `lib/topics.js`.
- Some individual cards don't have a version in every language (e.g.
  `data/monthly.json` only has an English section for 14 of 78 cards). The
  reading is shown strictly in the language selected at onboarding — if that
  card has no version in that language, the app shows a short "not available
  in this language yet" message instead of silently falling back to another
  language.

## Spread & draw behaviour

- The full 78-card deck is shown, reshuffled on every topic open and on every
  "Draw again". Cards fade in with a staggered entrance animation
  (`prefers-reduced-motion` disables it).
- For the 12-month topic, cards are drawn one at a time and assigned to
  January → December in the order picked; the hint line above the spread
  names which month you're currently drawing for.

## Swapping the placeholder file later

1. Convert the real "aaj ka din" docx to JSON (same 78-card-keyed shape as
   the others).
2. Drop it in `data/`, e.g. `data/daily.json`.
3. In `lib/readings.js`, import it and add it to the `READINGS` map under a
   new key, e.g. `daily`.
4. In `lib/topics.js`, change topic 7's `dataKey` to `"daily"` and drop the
   `placeholder: true` flag.
