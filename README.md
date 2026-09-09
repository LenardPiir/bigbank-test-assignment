# Dragons of Mugloar

A two-part solution for the [Dragons of Mugloar](https://dragonsofmugloar.com) game.

## Project structure

```
backend/    Java game bot (Gradle)
frontend/   React web app (Vite)
```

## Part 1 — Game Bot (Java)

An automated game bot that reliably scores 1000+ points by solving quests and managing resources.

### Architecture

The project follows a **ports-and-adapters** pattern:

- `ee.bigbank.mugloar.domain` — Core game logic (GameLoop, AdRanker, AdDecoder, GameRunner)
- `ee.bigbank.mugloar.infrastructure` — HTTP client implementation (HttpGameClient)

### Key features

- **Risk-adjusted scoring** — Ads are ranked by `(reward × successProbability − lifeCost × (1 − successProbability)) / urgency`, balancing reward against risk
- **Adaptive strategy** — The bot adjusts risk tolerance based on current lives and game level
- **Encrypted ad decoding** — Handles Base64 and ROT13 encrypted messages
- **Retry with backoff** — HTTP requests include retry logic with exponential backoff for rate limiting
- **Success rate tracking** — Learns actual success rates from game outcomes

### Running

```bash
cd backend
./gradlew run
```

### Testing

```bash
cd backend
./gradlew test
```

### Docker

```bash
docker build -t mugloar-bot .
docker run mugloar-bot
```

## Part 2 — Web App (React)

A browser-based frontend that lets players manually play the game through the API.

### Tech stack

- React 18 + TypeScript
- Vite (dev server and build)
- Zustand (state management)
- Tailwind CSS v4

### Features

- Start a new game
- View available quests sorted by risk-adjusted score
- Solve quests and track results
- Browse and purchase shop items
- Live player stats (score, gold, lives, level, turn)
- Color-coded risk badges with hover tooltips
- Local leaderboard tracking best runs
- Game log tracking all actions
- Responsive layout (mobile, tablet, desktop)

### Running

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server proxies API requests to `https://dragonsofmugloar.com`.

### Testing

```bash
cd frontend
npm test
```

### Building for production

```bash
cd frontend
npm run build
```

## Prerequisites

- Java 21+
- Node.js 20+
