# Ginni Ki Baatein — Tarot Chat (Next.js)

A private tarot counsel web app, themed to match thedivinetarotonline.com:
name + language onboarding, a mobile-friendly chip-bar / sidebar menu of 15
questions, a real 78-card spread with official card art, and readings pulled
from the JSON source files in `/data` — original entries are never rewritten,
only appended to or added when a card was genuinely missing.

3 readings are free; after that, a ₹199/month paywall unlocks unlimited
access via Razorpay.

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in your Razorpay keys
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
- `app/layout.js` — fonts, global shell, Razorpay checkout script
- `app/globals.css` — all design tokens, styles, and animations
- `app/api/create-order/route.js` — creates a Razorpay order (server-side)
- `app/api/verify-payment/route.js` — verifies a Razorpay payment signature
- `components/Onboarding.jsx` — name + language capture
- `components/Sidebar.jsx` — desktop sidebar + mobile top bar/chip bar for
  the 15 questions
- `components/ReadingPanel.jsx` — spread, draw, reveal, and paywall-gating
  logic
- `components/Paywall.jsx` — the ₹199/month upgrade screen + checkout flow
- `components/TarotCard.jsx` — the flippable card
- `components/RevealCard.jsx` — one revealed card's image + reading
- `lib/topics.js` — the 78-card deck + the 15 topic definitions
- `lib/readings.js` — imports all 13 JSON reading files topics draw from
- `lib/parseReading.js` — language-aware parser for the raw reading text
- `lib/access.js` — free-reading counter + subscription state (localStorage)
- `lib/ginni.js` — Ginni's greeting/closing voice lines
- `data/*.json` — the reading content itself, unmodified except where noted
  in chat history (a handful of genuinely missing cards/translations added)

## Payment module — ₹199/month after 3 free readings

**Setup:**
1. Get API keys from your [Razorpay dashboard](https://dashboard.razorpay.com/app/keys)
   (start in test mode).
2. Copy `.env.local.example` to `.env.local` and fill in
   `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
3. Add the same two variables in your hosting provider's environment
   variable settings (e.g. Vercel project settings) before deploying —
   `.env.local` is gitignored and never gets deployed automatically.
4. Test with [Razorpay's test cards](https://razorpay.com/docs/payments/payments/test-card-details/)
   before switching to live keys.

**How it works:**
- `lib/access.js` tracks a free-reading count and subscription expiry in
  the browser's `localStorage`. After 3 completed readings, `hasAccess()`
  returns false and `ReadingPanel` shows `Paywall` instead of a new spread
  (a reading already in progress is never interrupted).
- Clicking "Unlock" calls `/api/create-order`, which creates a ₹199 INR
  order via the Razorpay SDK, then opens Razorpay's checkout modal
  client-side.
- On successful payment, the client sends the payment ID/order ID/signature
  to `/api/verify-payment`, which re-derives the signature server-side with
  the key secret and compares — this is the step that actually confirms the
  payment is real. Only then does `activateSubscription()` grant 30 days
  of access.

**Two limitations worth knowing before this goes live with real money:**
1. **This is client-side state, not a server-enforced paywall.** There's no
   backend database in this app — access state lives in localStorage. A
   determined user could clear their browser storage to reset the free
   count, or edit localStorage to fake a subscription. Real enforcement
   needs a backend that tracks this per logged-in user (e.g. a database
   keyed by phone number/email + real auth), which is a separate, larger
   piece of work.
2. **"Monthly" here means a 30-day unlock you pay for again, not true
   auto-recurring billing.** Real auto-debit (Razorpay Subscriptions API
   with UPI Autopay/eMandate) needs separate business KYC approval from
   Razorpay and more integration work. This version works with a standard
   Razorpay account today; upgrading to true autopay is a future step.

## Language parsing

`lib/parseReading.js` recognises every language-label style found across the
13 source files — inline colon labels (`Hinglish:`, `English:`, `HINDI:`,
`Devanagari Hinglish:`, common misspellings like `Hinid:`/`HINDIN:`), and
whole-line labels with no colon (`ENGLISH`, `हिंदी`, etc.). For a handful of
cards that stacked all three languages back-to-back with no labels at all,
it splits them by detecting Devanagari vs. Latin script rather than relying
on wording. As of the last content pass, every card in every one of the 15
questions resolves to real text in all three languages — verified by running
the parser against every file, not by inspection.

## Spread & draw behaviour

- The full 78-card deck is shown, reshuffled on every topic open and on
  every "Draw again." Cards fade in with a staggered, scattered-spread
  entrance animation.
- Picking a card flips it in place with a glow-pulse and grow animation,
  then reveals its real card art alongside the reading.
- All animation respects `prefers-reduced-motion: reduce`.

## Card art

`public/cards/` has all 78 official card images (from the same source as
the parent site's live deck), named to match `cardSlug()` in `lib/topics.js`
(e.g. `the-fool.png`). `RevealCard.jsx` and `TarotCard.jsx` show the
matching image, with a plain-text fallback if a specific file is ever
missing.

## Mobile layout

Under 820px, the sidebar becomes a sticky top bar plus a horizontally
scrollable chip bar listing all 15 questions — nothing is hidden behind a
hamburger menu. The "choose a question" empty state also renders the full
question list as tappable cards, so it's visible without relying on the
chip bar alone. Language switching and "start over" live behind a small
avatar-icon popover in the top-right, since those are secondary controls.
