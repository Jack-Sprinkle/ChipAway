# Refactoring and Reliability TO-DO

## Goals

- Keep the app local-first and usable offline.
- Make scoring behavior easier to understand, change, and test.
- Improve data safety before adding pre-round AI functionality.
- Avoid abstractions, caching, or memoization without a clear need.

## 1. Establish a safe baseline

- [ ] Record the current round, scoring, practice, yardage-book, resume, and offline flows before changing them.
- [ ] Add behavior tests for the scoring rules before moving them; see [TESTING.md](./TESTING.md).
- [ ] Keep refactors behavior-preserving unless a task explicitly calls out a bug fix.
- [ ] Keep user-facing changes and unrelated cleanup out of each refactor.

## 2. Extract scoring rules from the scoring page

- [ ] Create or extend a focused scoring-domain module for pure rules currently embedded in the scoring page and `lib/utils.ts`.
- [ ] Put GIR and missed-GIR calculations in one shared implementation.
- [ ] Put hole-completion validation, running totals, and score-relative-to-par calculations in reusable pure helpers where appropriate.
- [ ] Centralize dependent-field rules, such as clearing FIR on par 3 and clearing GIR miss direction when a hole becomes a GIR.
- [ ] Keep optional tee club, FIR, GIR direction, penalties, and yardage notes from becoming prerequisites for completing a hole.
- [ ] Keep input parsing and validation explicit; do not silently coerce invalid values into valid-looking scoring data.

## 3. Decompose the hole-scoring page

- [ ] Keep the route page responsible for route parameters, loading/resuming the round, and composing the scoring experience.
- [ ] Extract a focused hole-scoring form for par, score, putts, tee club, FIR, GIR miss direction, and penalties.
- [ ] Extract the yardage-note editor, including loading, editing, saving, retry, and status feedback.
- [ ] Extract the running-score summary if it meaningfully simplifies the route page.
- [ ] Keep previous/next/complete navigation behavior together and preserve its save/error behavior.
- [ ] Avoid creating a component for every individual input; extract by meaningful UI responsibility.
- [ ] Verify direct URL access, reload, resume, and hole-to-hole navigation after the refactor.

## 4. Clarify state and persistence boundaries

- [ ] Define when round edits are persisted: on field change, a short debounce, explicit navigation, or another deliberate policy.
- [ ] Prevent refresh, accidental navigation, or app suspension from silently losing the current hole's edits.
- [ ] Keep course yardage notes as course-level data; never duplicate them into a round record.
- [ ] Keep yardage-note load/save errors independent from round-scoring errors so a note failure does not block scoring.
- [ ] Handle stale async loads when the user changes holes or courses before a request completes.
- [ ] Ensure in-memory round state and IndexedDB stay consistent when saves fail or navigation happens quickly.
- [ ] Keep IndexedDB read-modify-write operations atomic where concurrent updates could otherwise overwrite each other.

## 5. Organize shared domain and storage code

- [ ] Review `lib/utils.ts`; separate round calculations, handicap/stat calculations, and unrelated general utilities when this improves discoverability.
- [ ] Move practice-stat aggregation out of the practice/stats UI if it is reused or difficult to test there.
- [ ] Keep IndexedDB initialization, schema versioning, and object-store names centralized.
- [ ] Split storage helpers by domain only if `lib/db.ts` becomes harder to navigate; avoid a repository abstraction that only forwards calls.
- [ ] Keep data types near the existing shared type definitions unless a domain grows enough to justify its own module.

## 6. Review correctness and performance

- [ ] Confirm the intended handicap-index rules before changing the implementation; its comments describe 20 recent rounds, while the current slice uses 19 and the best-differential logic needs validation for fewer than eight eligible rounds.
- [ ] Confirm course-name normalization and same-name course behavior remain acceptable; consider a stable course identifier only if real use requires it.
- [ ] Measure slow rendering, database access, or large-list behavior before optimizing.
- [ ] Avoid adding database indexes, caching, or `useMemo`/`useCallback` without a measured bottleneck.
- [ ] Check that the scoring page remains usable on mobile and offline after each structural change.

## Recommended order

1. Establish behavior tests and confirm domain rules.
2. Extract and test shared scoring helpers.
3. Extract the scoring form and yardage-note editor.
4. Clarify round autosave and error boundaries.
5. Organize utility/storage modules only where the new boundaries improve clarity.
6. Review handicap correctness and profile before performance optimization.

