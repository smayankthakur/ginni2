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
- `app/globals.css` — all design tokens, styles, and animations
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
- A few cards are genuinely missing a language version in the source (e.g.
  ~18 of 77 cards in `data/monthly.json` have no Hindi section, and one card
  in `data/third-party.json` is missing Hindi) — see below for how this is
  now distinguished from a parsing bug.

## Language parsing fix (this revision)

The previous revision was too aggressive about what counted as "this
language isn't available," because the parser only recognised one exact
label spelling per language. The source documents actually use several:

- inline colon labels: `Hinglish:`, `English:`, `HINDI:`, and even
  `Hinglish (Latin Script):` on a handful of cards
- whole-line labels with no colon: `ENGLISH`, `ENGLISH VERSION`, `English`,
  `English Version`, and `हिंदी` (Hindi written in Devanagari, not the
  Latin word "Hindi")
- no label at all in some files — the whole card is one single-language block

`lib/parseReading.js` now recognises all of these. Concretely, this fixed:

- `data/third-party.json` — 8 cards were wrongly showing "not available in
  Hinglish" because their label was `Hinglish (Latin Script):`, not
  `Hinglish:`. All 78 cards now resolve correctly in Hinglish and English,
  77/78 in Hindi (the one gap is a genuine content gap from the source docx,
  not a parser issue).
- `data/monthly.json` — English coverage went from 14/77 cards to 77/77
  (most cards used the label `English` or `ENGLISH`, not the one exact
  string `ENGLISH VERSION` the old parser looked for). Hindi coverage went
  from 0/77 to 59/77 — the old parser was searching for a Latin `HINDI
  VERSION` marker that never actually appears; the real marker is `हिंदी`.

For files that never distinguish languages at all (`partner-feelings.json`,
`partner-action.json`, `yes-no.json`, `daily-placeholder.json`,
`spiritual-journey.json`), the app now shows that single version regardless
of which language is selected — flagged with a small inline note — instead
of blocking the reading outright. A hard "not available" message is now
reserved for cards where the source *does* distinguish languages but is
genuinely missing the one you picked.

## Spread & draw behaviour

- The full 78-card deck is shown, reshuffled on every topic open and on every
  "Draw again". Cards fade in with a staggered entrance animation.
- For the 12-month topic, cards are drawn one at a time and assigned to
  January → December in the order picked; the hint line above the spread
  names which month you're currently drawing for.

## Animation pass (this revision)

- Ambient background: a slow star twinkle and a drifting gold aurora glow
  behind both the onboarding and app screens.
- Onboarding: card and glyph entrance, staggered field/button reveal, a
  pulse on the selected language pill.
- Sidebar: topics fade in staggered on load; selecting one gives a soft
  gold pulse.
- Reading panel: header, progress dots, and each revealed month fade/rise in;
  the current progress dot pulses gently.
- Cards: staggered entrance across the full spread, a gold glow sweep on
  flip, and a size-grow transition as the flipped card enlarges.
- All of the above respect `prefers-reduced-motion: reduce` (animations and
  transitions collapse to near-instant, nothing left spinning/pulsing).

Note: I wasn't able to render `chat.thedivinetarotonline.com` directly (it's
a client-rendered SPA and my tools only fetch static HTML), so this pass is
a from-scratch animation treatment in the same visual language rather than a
pixel match to that site. Point out anything you want adjusted or matched
more closely once you've seen it live.

## Swapping the placeholder file later

1. Convert the real "aaj ka din" docx to JSON (same 78-card-keyed shape as
   the others).
2. Drop it in `data/`, e.g. `data/daily.json`.
3. In `lib/readings.js`, import it and add it to the `READINGS` map under a
   new key, e.g. `daily`.
4. In `lib/topics.js`, change topic 7's `dataKey` to `"daily"` and drop the
   `placeholder: true` flag.
