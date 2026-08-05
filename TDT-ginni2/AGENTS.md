# AGENTS.md

## Build Commands

### Development
- Start backend: `cd backend && npm run dev` (runs on http://localhost:5000)
- Start frontend: `cd frontend && npm run dev` (runs on http://localhost:3000, proxies to backend)
- Start both: run both commands in separate terminals

### Production Build
- Build frontend: `cd frontend && npm run build`
- Frontend preview: `cd frontend && npm run preview`
- Lint: `cd frontend && npm run lint`
- Typecheck: `cd frontend && npm run typecheck`

### Testing
- Backend API test: `node backend/test-api.js`
- Verify KB files: `node backend/test-kb.js`

## Architecture

### Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Knowledge Base**: Local JSON files in `ginni-kb/`

### Project Structure
```
TDT-ginni2/
├── ginni-kb/                    # Knowledge base (JSON tarot interpretations)
├── backend/
│   ├── server.js                # Express server
│   ├── package.json
│   ├── utils/
│   │   ├── tarotDeck.js         # 78-card deck, shuffle, draw logic
│   │   └── kbReader.js          # Reads ginni-kb JSON files
│   └── routes/
│       └── api.js               # REST API endpoints
├── frontend/
│   ├── vite.config.js           # Vite config with proxy
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx              # Main app with routes
│       ├── main.jsx             # Entry point
│       ├── index.css            # Mystical theme styles
│       ├── components/
│       │   ├── QuestionSelection.jsx  # Step 1: 10-question menu
│       │   ├── CardDrawing.jsx        # Step 2: Draw + animate
│       │   ├── TarotCard.jsx          # Card component
│       │   └── CardInterpretation.jsx # Step 3: KB interpretation
│       ├── data/
│       │   └── questions.js           # Question definitions
│       └── utils/
│           └── tarotDeck.js           # Deck constants
├── README.md
└── AGENTS.md                    # This file
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | List 10 reading options |
| GET | `/api/deck` | Full deck + topic metadata |
| GET | `/api/topics` | All KB topics |
| GET | `/api/card/:name/:topic` | Single card interpretation |
| POST | `/api/reading` | Draw cards + get interpretations |

## Reading Flow
1. User selects a question (1-10) on the frontend
2. `CardDrawing` component animates card shuffling and drawing
3. Frontend calls `POST /api/reading` with `questionNumber`
4. Backend draws randomized cards from 78-card RWS deck (with orientation)
5. Backend reads matching KB JSON file for each card's interpretation
6. Backend returns cards with KB-sourced interpretations
7. `CardInterpretation` displays the full reading
