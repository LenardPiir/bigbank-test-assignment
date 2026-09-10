# Dragons of Mugloar

The backend is an automated bot that plays the [Dragons of Mugloar](https://dragonsofmugloar.com) game and scores 1000+ points per run. The frontend is a web app that lets you play the game manually through the browser.

## How to run

Requires Docker

```bash
docker compose up --build
```

The bot starts playing immediately and prints game progress to the console. The frontend is available at http://localhost:3000.

## Backend

### What to expect

The bot plays a full game autonomously. Each run prints the quests it solves, items it buys, and the final score. A typical game scores between 1000 and 6000+ points depending on quest availability.

### How it works

The bot starts a game, then loops through turns until it runs out of lives:

1. Fetches available quests and decodes any that are encrypted (Base64, ROT13)
2. Ranks quests by tracked success rate per difficulty tier, breaking ties by reward
3. Skips quests that are too risky for the current life count
4. Solves the best available quest
5. Buys healing potions when gold allows and lives are low
6. Repeats until game over

Success rates are learned from outcomes during the run — the bot starts with the advertised probabilities and adjusts as it sees real results.

### Tests

```bash
docker compose run --rm bot ./gradlew test
```

## Frontend

The game has an in-game guide that explains the interface. Turn on the music for the full experience.
