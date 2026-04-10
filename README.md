# ChipAway

ChipAway is a simple golf score tracker built with Next.js, React, TypeScript, and Tailwind CSS.

The app is focused on a lightweight round-tracking flow:

- Start a new round with a course name
- Record par, score, and putts hole by hole
- Save progress through the round
- Review completed or in-progress rounds later
- Delete rounds you no longer want to keep

Today, round data is stored locally in the browser. The next step for the project is turning ChipAway into an offline-capable PWA.

## Current Status

ChipAway is an in-progress personal project with a simple client-side architecture.

- Built with the Next.js App Router
- Uses React context for in-memory round state while scoring
- Persists rounds in the browser for local use
- Designed to stay small, focused, and easy to expand

## Features

- Create a new round
- Track all 18 holes
- Record par, score, and putts per hole
- View front nine, back nine, and total scoring summaries
- Review saved rounds
- Delete saved rounds

## Planned Next Steps

- Offline-capable PWA support
- Installable mobile-friendly experience
- Better round recovery and persistence behavior
- Expanded score insights and statistics

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- This project currently stores data locally in the browser, so rounds are device- and browser-specific.
- The current `README` reflects the score-tracking experience more than the placeholder home page content, which still needs to be updated.
