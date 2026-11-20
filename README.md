# ChipAway

Chip Away Golf is a lightweight golf scorekeeper and journal built with Next.js, React, TypeScript, and Tailwind CSS.

The app is designed for golfers who want a simple, privacy-focused way to track rounds and practice. It does not require an account, collect location data, or send golf data to a cloud service. All round and practice data is stored locally on the user's device.

## Current Status

ChipAway is an in-progress personal project built around a local-first, offline-capable PWA architecture.

- Built with the Next.js App Router
- Uses React context for in-memory round state while scoring
- Persists rounds and practice sessions in IndexedDB
- Uses Serwist for PWA registration, precaching, runtime caching, and offline fallbacks
- Includes an installable mobile experience and mobile-friendly navigation
- Includes a journal with RSS and newsletter support

## Features

### Round Tracking

- Create a round with a course name, course rating, and course slope
- Track par, score, putts, tee club, fairway outcome, GIR miss direction, and penalties
- Move forward and backward through all 18 holes
- View running score and score relative to par during a round
- Automatically save in-progress rounds to IndexedDB
- Resume an unfinished round from the saved rounds page
- Complete a round and mark it as finished
- Review completed rounds with front-nine and back-nine scorecards
- View conventional golf score markers for birdies, eagles, pars, bogeys, and double bogeys
- Delete saved rounds

### Stats

- Calculate a basic handicap index from recent completed rounds
- Track three-putt percentage
- Track greens in regulation
- Track scrambling
- Track fairways hit
- Display performance ratings and supporting hole counts
- Show rounds analyzed, completed rounds, and the latest round

### Practice

- Start, extend, and end local practice sessions
- Log shots by club
- Record fat, thin, or good contact
- Record left, right, or straight starts
- Record left, right, or straight shot curves
- Review overall practice tendencies across all sessions
- Review contact, start, and curve breakdowns by club

### Yardage Books

- Create and catalogue course-specific yardage books
- Add and edit notes for each of the 18 holes
- See when each course yardage book was last updated
- Store yardage books locally in IndexedDB

### PWA and Offline Support

- Installable PWA metadata and app icons
- Offline fallback for navigation requests
- Cached round-scoring routes and saved-round pages
- Local IndexedDB storage for continued use without a network connection

### Site and Content

- Chip Away Golf journal with MDX articles
- Journal RSS feed
- Newsletter signup through Buttondown
- About, privacy policy, terms of use, robots, and sitemap pages
- Responsive desktop and mobile navigation
- Vercel Analytics and Speed Insights

## Planned Next Steps

- Show course yardage-book notes during matching rounds and support in-round editing
- Combine richer round data, yardage notes, and recent practice tendencies for an AI-generated pre-round game plan
- Better round recovery and persistence behavior
- Course templates and reusable course setup
- Additional handicap and scoring insights
- Longer-term practice trends
- Social features, leaderboards, and accounts

## Tech Stack

- Next.js 16.2
- React 19
- TypeScript
- Tailwind CSS 4
- Native IndexedDB through `idb`
- Serwist PWA tooling
- MDX and `next-mdx-remote`
- Vercel Analytics and Speed Insights

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

- Round and practice data are device- and browser-specific.
- Clearing browser storage or using another browser will not transfer existing local data.
