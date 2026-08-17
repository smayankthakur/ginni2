# Ginni Ki Baatein — Tarot Chat (Next.js)

A private tarot counsel web app, themed to match thedivinetarotonline.com:
email/password accounts, name + language onboarding, a mobile-friendly
chip-bar / sidebar menu of 15 questions, a real 78-card spread with official
card art, and readings pulled from the JSON source files in `/data` —
original entries are never rewritten, only appended to or added when a card
was genuinely missing.

3 readings are free per account; after that, a ₹199/month paywall unlocks
unlimited access via Razorpay. Access is enforced server-side against a
real database — see "Accounts & server-side enforcement" below for exactly
what that means and what it doesn't.

## Run locally

```bash
npm install                          # also runs `prisma generate`
cp .env.local.example .env.local     # then fill in DATABASE_URL, SESSION_SECRET, Razorpay keys
npx prisma migrate dev --name init   # creates the User/Order tables
npm run dev
```

Open http://localhost:3000. First run will ask you to create an account
(email + password) before showing the onboarding screen.

## Build for production

```bash
npm run build
npm run start
```

Make sure `DATABASE_URL`, `SESSION_SECRET`, `RAZORPAY_KEY_ID`, and
`RAZORPAY_KEY_SECRET` are set in your hosting provider's environment
variables (e.g. Vercel project settings) — `.env.local` is gitignored and
never gets deployed automatically. Run `npx prisma migrate deploy` against
your production database before the first deploy.

## Accounts & server-side enforcement

Every visitor now needs an account (email + password) before they can do
anything. This isn't just a login screen bolted on top — it's what makes
the paywall actually real:

- **Reading content never ships to the browser until it's been paid for or
  is within the free limit.** `lib/readings.js` (which imports every JSON
  file in `/data`) is only ever imported by server-side API routes
  (`app/api/reveal/route.js`) — no client component imports it anymore. A
  visitor's browser has no way to see interpretation text for a card they
  haven't picked and been authorized for, because it was never sent to
  them, not because it's merely hidden.
- **The free-reading count and subscription status live in the database**
  (`User.readingsUsed`, `User.subscriptionExpires`), keyed to the logged-in
  account — not in browser storage. Clearing cookies or switching devices
  doesn't reset anything; the same account still has the same usage.
- **The "charge" happens before content is served, not after.** Drawing a
  card calls `POST /api/reading/pick`, which checks access and — for
  free-tier users — increments `readingsUsed` in the database, *then*
  issues a short-lived signed token (`lib/auth.js: createPickToken`) that
  authorizes exactly that one card's reveal. `GET /api/reveal` only returns
  text if it receives a valid, unexpired token for that specific pick.
  Switching languages on an already-revealed card re-fetches with the same
  token (no re-charge); drawing a *new* card always goes through
  `/api/reading/pick` again, so the limit can't be bypassed by re-fetching.
- **Payments are verified server-side against a real database, tied to the
  logged-in user.** `/api/verify-payment` re-derives the Razorpay signature
  itself, confirms the order belongs to the current session's user, checks
  it hasn't already been credited, and only then extends
  `subscriptionExpires` — nothing about "is this user subscribed" is ever
  decided by trusting anything the client sends.

**What this still doesn't cover** (real, worth knowing before relying on
it):
- **No account recovery / "forgot password" flow yet.** If someone loses
  their password, there's currently no way for them to reset it — that's a
  straightforward addition (send a reset-token email) but isn't built.
- **No email verification.** Signup accepts any email address without
  confirming the person owns it.
- **"Monthly" is a 30-day unlock you pay for again, not true auto-recurring
  billing.** Real auto-debit (Razorpay Subscriptions API with UPI
  Autopay/eMandate) needs separate business KYC approval from Razorpay and
  more integration work.
- **Rate limiting isn't implemented.** Nothing currently stops someone from
  scripting repeated signups with throwaway emails to keep getting 3 fresh
  free readings. Real mitigation needs either email verification, phone
  verification, or IP/device-based rate limiting on `/api/auth/signup`.


## Structure

- `app/page.js` — top-level screen switcher (auth → onboarding → app)
- `app/layout.js` — fonts, global shell, Razorpay checkout script
- `app/globals.css` — all design tokens, styles, and animations
- `app/api/auth/signup/route.js`, `login/route.js`, `logout/route.js`,
  `me/route.js` — account creation, login, logout, and session check
- `app/api/reading/pick/route.js` — checks access, charges a free-tier
  credit if applicable, issues a one-time reveal token
- `app/api/reveal/route.js` — the only place reading text is ever read from
  `/data` and sent to a client, gated on a valid pick token
- `app/api/create-order/route.js` — creates a Razorpay order for the logged
  -in user (server-side)
- `app/api/verify-payment/route.js` — verifies a Razorpay payment signature
  and extends that user's subscription in the database
- `components/AuthGate.jsx` — login/signup screen shown before anything else
- `components/Onboarding.jsx` — name + language capture (after auth)
- `components/Sidebar.jsx` — desktop sidebar + mobile top bar/chip bar for
  the 15 questions, plus logout
- `components/ReadingPanel.jsx` — spread, draw (via `/api/reading/pick`),
  and paywall-gating logic
- `components/Paywall.jsx` — the ₹199/month upgrade screen + checkout flow
- `components/TarotCard.jsx` — the flippable card
- `components/RevealCard.jsx` — fetches and shows one revealed card's
  reading via `/api/reveal`
- `lib/topics.js` — the 78-card deck + the 15 topic definitions
- `lib/readings.js` — imports all 13 JSON reading files; **only imported by
  `app/api/reveal/route.js`**, never by client components
- `lib/parseReading.js` — language-aware parser for the raw reading text
- `lib/auth.js` — password hashing, session cookies, pick tokens
- `lib/db.js` — the shared Prisma client
- `prisma/schema.prisma` — `User` and `Order` table definitions
- `lib/ginni.js` — Ginni's greeting/closing voice lines
- `data/*.json` — the reading content itself, unmodified except where noted
  in chat history (a handful of genuinely missing cards/translations added)

## Payment module — ₹199/month after 3 free readings

**Setup:**
1. Create a Postgres database (Neon, Vercel Postgres, Supabase, Railway —
   any of them work) and get its connection string.
2. Get API keys from your [Razorpay dashboard](https://dashboard.razorpay.com/app/keys)
   (start in test mode).
3. Copy `.env.local.example` to `.env.local` and fill in `DATABASE_URL`,
   `SESSION_SECRET` (any long random string), and the two Razorpay keys.
4. Run `npx prisma migrate dev --name init` to create the tables.
5. Add all four variables in your hosting provider's environment variable
   settings before deploying — `.env.local` is gitignored and never gets
   deployed automatically. Run `npx prisma migrate deploy` against the
   production database too.
6. Test with [Razorpay's test cards](https://razorpay.com/docs/payments/payments/test-card-details/)
   before switching to live keys.

**How it works:** see "Accounts & server-side enforcement" above — the
short version is that access is checked and charged in the database before
any reading content is served, and payments are verified server-side before
a subscription is granted. The two honest limitations (30-day unlock
instead of true auto-billing, and no rate limiting on signups yet) are also
listed there.

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
