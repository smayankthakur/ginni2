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

## This revision

- Button copy: "Enter the counsel" → "Start your reading".
- The 12-month topic ("Aapka Pura Saal Kaisa Rahega") now holds all readings
  back until all 12 cards are drawn — you pick your way through January to
  December first, then the full year appears together, instead of each
  month's reading popping up as you go.
- Added a lightweight "Ginni" voice around the readings: a warm greeting
  (using your name) before the spread, and a supportive closing line after
  the reveal — see `lib/ginni.js`.

### About the Ginni voice — what this is and isn't

`lib/ginni.js` adds static, per-language greeting/closing lines in Ginni's
tone (warm, name-using, non-scary, best-friend register) — templated text
chosen from a small rotating set, not generated per card or per question.

**The actual tarot interpretation text is untouched** — it still comes
directly from the JSON files, unmodified, exactly as required. Ginni's voice
only wraps around it (before the spread, after the reveal).

What this does *not* do yet: react specifically to which card came up, echo
back the user's actual question, or vary its language turn by turn the way
the persona brief describes ("acknowledge their feelings," "interpret tarot
cards symbolically" in the moment). That level of dynamic, context-aware
response needs an LLM call at read time — e.g. a server route that sends the
card + question + user's name to the Claude API and streams back a
generated response — which is real additional scope: an API key, a backend
route, and a per-reading cost. Happy to build that next if you want the
fully dynamic version; this revision ships the static version so the app
keeps working with zero backend and zero per-reading cost in the meantime.

## Card art

`public/cards/` now has all 78 card images, named to match `cardSlug()` in
`lib/topics.js` (e.g. `the-fool.jpg`, `ace-of-cups.jpg`). `TarotCard.jsx`
shows the matching image on flip, with a plain-text fallback if a specific
file is ever missing.

What's shipped right now are placeholders — original geometric designs in
the app's own palette, not artwork from any existing tarot deck. See
`public/cards/README.md` for the full filename list and how to swap in your
own art (same filenames, no code changes needed).

## Theme + animation pass (this revision)

Analysed `thedivinetarotonline.com` (the only page that returned real
content — `/reading` and the `chat.` subdomain are pure client-rendered SPAs
with no usable static HTML from a fetch). Pulled its theme color
(`#6d28d9`, a rich violet) and worked it in as a second brand accent
alongside the existing gold, rather than replacing it — the app now reads
as gold *and* violet rather than gold-only, matching the parent site more
closely while keeping what already worked.

Where violet shows up: the ambient background aurora, hover/selection glow
on cards, the selected topic's left-edge accent, the active language pill,
the "current" progress dot, and the card-back's inner glow.

**Card selection page specifically** (the main ask):

- Cards now "deal" in — scaled down, slightly rotated, sliding into place
  with a per-position stagger — instead of a plain fade.
- Hovering an unflipped card lifts and tilts it with a violet glow ring.
- Picking a card now bursts a small sparkle bloom (alternating gold/violet)
  outward from the card at the moment it flips, on top of the existing
  glow-pulse and grow animation.
- The card back got a richer treatment: a soft violet radial glow layered
  under the existing gold diagonal pattern, plus an inset double-border
  glow, instead of a flat pattern.

All of this still respects `prefers-reduced-motion: reduce` via the
existing global rule.

## Reveal page + spread animation pass (this revision)

**The reveal ("reading page") is now built around the actual card image**,
not just text:

- Each drawn card shows in a glowing framed portrait (violet-gold border,
  a slow ambient pulse) next to its reading, with a small emoji badge in
  the corner (✨ Major Arcana, 💧 Cups, 🪙 Pentacles, ⚔️ Swords, 🔥 Wands —
  see `cardEmoji()` in `lib/topics.js`) that pops in with a little bounce.
- New `components/RevealCard.jsx` holds this — one card's full presentation
  (image, badge, name, reading, language-availability note) in one place.

**The spread now reads as an actual scattered tarot spread** instead of a
neat grid — each card position gets a slightly different rest tilt and
vertical drift (`--rest-rot` / `--rest-y`, cycled over 7 variants), cards
deal in from a shuffle point, and hovering straightens + lifts a card back
out of the scatter.

### Two real bugs found and fixed while verifying this against a live browser

I don't just eyeball CSS for this kind of change — I drove the actual app
with Playwright (fill the form, click a topic, click a card, screenshot at
precise moments) to check the animation actually looks right, and caught
two genuine bugs that would never show up from reading the CSS alone:

1. **The picked card was invisible during its own flip.** The base
   `.tarot-card` rule starts every card at `opacity:0` and relies on the
   `dealIn` entrance animation to bring it to 1. But the moment a card is
   picked, `.tarot-card.flipped` swaps the element's `animation` to
   `flipGlow` — which never touches opacity — so `dealIn` never got to run
   and the card sat at `opacity:0` for its entire flip. Fixed by setting
   `opacity:1` directly on `.tarot-card.flipped`.
2. **The picked card jumped to the top-left corner instead of growing in
   place.** The flipping card was rendered as a separate element inserted
   at the start of the list, rather than the same element that was already
   in its grid position. Fixed by restructuring `ReadingPanel.jsx` so the
   same card (same React key) just gets `flipped={true}` in place, so it
   grows and glows exactly where you clicked it.

Both were confirmed fixed via computed-style checks (`opacity`, bounding
box position before/after) as well as visually, not just inferred from the
code.

## Theme match + brand + language fix (this revision)

**Rebranded to The Divine Tarot.** Onboarding and sidebar now use the
provided logo (`public/logo.png`), the app title/metadata read "The Divine
Tarot", and favicons were generated from the logo at all standard sizes
(16/32/192px PNG, .ico, 180px apple-touch-icon) — wired into `app/layout.js`
metadata and the App Router's auto-detected icon files
(`app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`). Ginni stays as
the in-app reading voice/persona; she's just not the top-level app name
anymore.

**Violet (`#6d28d9`) is now the dominant brand color**, matched from
thedivinetarotonline.com's actual `theme-color` meta tag (the only concrete
brand value I could pull from that site — everything past the homepage is a
client-rendered SPA my fetch tools can't execute, confirmed again this
session). Violet now runs through hairlines/borders, selected states,
eyebrow labels, and focus rings throughout the app. Gold is kept
specifically for the tarot card frame/trim (`--card-border`) — a deliberate
two-tone choice that matches the gold-bordered badge in the provided logo,
rather than a full swap.

Added a small trust-badge line to the sidebar footer ("🔒 Secure & Private"
/ "💖 Trusted by 7L+ Seekers") echoing the trust signals on the homepage.

**Fixed the topic 2 & 4 language bug** (`your_partner_action_done.json`,
i.e. `data/partner-action.json`). This file has no language labels at all —
just an English block, then a Hindi block, then a Hinglish block, back to
back with no markers — so the old parser couldn't split it and fell back to
showing the *entire* blob (all three languages concatenated) regardless of
which language was selected. Added a dedicated fallback parser
(`splitByScript` in `lib/parseReading.js`) that finds the Hindi block by
its Devanagari script and uses that as the anchor to split English (before
it) from Hinglish (after it). Verified against all 77 cards in the file —
every one now resolves cleanly to its own English/Hindi/Hinglish text with
no cross-language bleed, confirmed both programmatically and visually
(screenshots of the same card in all three languages).

**Topic 7's `dataKey` renamed** from `dailyPlaceholder` to `daily` to match
the naming you specified — still pointing at the universe-guidance content
as a placeholder (flagged in the UI) until its real source document is
re-supplied.

**Cleanup**: removed the unused create-next-app scaffold SVGs
(`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) and two
favicon sizes that weren't referenced anywhere (48px, 512px — no manifest.
json exists to use them). All 7 files in `/data` are genuinely in use
across the 10 topics per your exact mapping — nothing to remove there.
