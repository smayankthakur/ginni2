# The Divine Tarot Online

A production-ready, fully functional Tarot Reading web application built with React + Vite, Tailwind CSS, and Node.js/Express.

![Tarot Reading App](https://img.shields.io/badge/Tarot-Full%20Stack-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)

## Overview

This application conducts interactive tarot readings in a strict 3-step flow:

1. **Question Selection** — User chooses from 10 reading types (feelings, actions, yes/no, daily, monthly, yearly, etc.)
2. **Card Drawing** — A virtual 78-card Rider-Waite-Smith deck is shuffled and cards are drawn with smooth animations (including upright/reversed orientation)
3. **Interpretation & Analysis** — The backend reads from a local knowledge base (`ginni-kb/` folder containing JSON files) to provide deep, intuitive interpretations tailored to the selected question and drawn card(s)

## Features

- **78-card Rider-Waite-Smith deck** with full shuffling and orientation support (upright/reversed)
- **10 reading types** covering feelings, actions, yes/no, daily, monthly, and yearly forecasts
- **Local knowledge base** — All interpretations served from JSON files in `ginni-kb/`
- **Card drawing animations** with shuffling, reveal, and flip sequences
- **Multi-language interpretations** (English, Hinglish, Hindi) from the KB
- **Responsive mystical UI** — Deep slate backgrounds with neon purple, pink, and gold gradients
- **RESTful API** with endpoints for deck, questions, card interpretations, and full readings
- **Vite dev server** with proxy to backend for seamless development

## Project Structure

```
TDT-ginni2/
├── ginni-kb/                    # Knowledge base JSON files
│   ├── index.json               # Deck list + topic mappings
│   ├── partner_feelings.json    # Readings on feelings
│   ├── partner_action.json      # Readings on next actions
│   ├── yes_no.json              # Yes/No readings
│   ├── third_party_end.json     # Third party situations
│   ├── daily.json               # Daily readings
│   ├── monthly.json             # Monthly/yearly readings
│   ├── universe_guidance.json   # Spiritual guidance
│   └── ... (more topic files)
├── backend/
│   ├── server.js                # Express server
│   ├── package.json
│   ├── utils/
│   │   ├── tarotDeck.js         # Deck, shuffle, draw logic
│   │   └── kbReader.js          # KB file loader + topic mapping
│   └── routes/
│       └── api.js               # API endpoints
├── frontend/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   ├── QuestionSelection.jsx
│       │   ├── CardDrawing.jsx
│       │   ├── TarotCard.jsx
│       │   └── CardInterpretation.jsx
│       ├── data/
│       │   └── questions.js
│       └── utils/
│           └── tarotDeck.js
├── README.md
└── AGENTS.md
```

## Quick Start

### Prerequisites
- Node.js v20+
- npm

### Installation

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
npm start
```

## API Reference

### `GET /api/questions`
Returns the 10 reading options.

### `GET /api/deck`
Returns the full 78-card deck list and topic metadata from the KB index.

### `POST /api/reading`
Draws cards and returns interpretations from the KB.

**Request body:**
```json
{
  "questionNumber": 7
}
```

**Response:**
```json
{
  "questionNumber": 7,
  "questionTitle": "Aapka aaj ka din kaisa rahega",
  "topicKey": "daily",
  "topicLabel": "Daily guidance",
  "totalCards": 1,
  "reading": [
    {
      "card": "The Sun",
      "type": "trump",
      "suit": null,
      "rank": null,
      "reversed": false,
      "interpretation": "The Sun – BIG YES ...",
      "kbFound": true
    }
  ]
}
```

## Knowledge Base

The `ginni-kb/` folder contains JSON files mapping tarot card names to multi-language interpretations:

| File | Topic | Description |
|------|-------|-------------|
| `partner_feelings.json` | partner_feelings | Partner's current emotions |
| `partner_action.json` | partner_action | Partner's next actions |
| `yes_no.json` | yes_no | Yes/No answers with guidance |
| `third_party_end.json` | third_party_end | Third party situation resolution |
| `daily.json` | daily | Daily guidance and predictions |
| `monthly.json` | monthly | Monthly/yearly predictions |
| `universe_guidance.json` | universe_guidance | Spiritual/universal guidance |
| `baby.json` | baby | Timing for conception/baby |
| `soulmate.json` | soulmate | Soulmate encounter timing |
| `life_partner.json` | life_partner | Life partner timing |
| `shaadi.json` | shaadi | Marriage timing |
| `union.json` | union | Union/twin flame timing |
| `connection.json` | connection | Connection type classification |
| `relationship_ppf.json` | relationship_ppf | Relationship PPF (past/present/future) |

See `index.json` for the complete deck list and topic metadata.
