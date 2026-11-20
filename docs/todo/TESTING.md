# Automated Testing TO-DO

## Testing goals

- Protect scoring and data-persistence behavior as the app grows.
- Test observable behavior and domain rules rather than implementation details or styling classes.
- Keep tests deterministic and isolated from real browser storage and external services.
- Add tests in layers: pure logic first, then storage and UI, then critical end-to-end flows.

## 1. Set up the test stack

- [ ] Add Vitest as the unit/component test runner.
- [ ] Add React Testing Library, `user-event`, `jest-dom`, and `jsdom` for accessible component behavior tests.
- [ ] Add a Vitest config with the `@/` path alias and a test setup file for DOM matchers.
- [ ] Add `test` and `test:watch` package scripts; add `typecheck` if useful for local and CI consistency.
- [ ] Add coverage reporting after the initial suite exists; do not set arbitrary coverage thresholds before a baseline.
- [ ] Keep build output, generated files, and end-to-end tests out of the unit-test run.

## 2. Test pure round and scoring logic

- [ ] Test `createRound` creates 18 numbered, incomplete holes and preserves course metadata.
- [ ] Test round totals for complete and partially scored front/back nines.
- [ ] Test GIR boundaries for par 3, 4, and 5 holes using score minus putts.
- [ ] Test three-putt, GIR, scrambling, and fairway statistics, including incomplete/missing data and zero eligible holes.
- [ ] Test that a fairway hit counts as hit and left/right misses count as eligible misses.
- [ ] Test performance-rating thresholds at, above, and below each boundary, plus the no-data case.
- [ ] Test handicap eligibility, recent-round selection, differential selection, and rounding after confirming the intended handicap rules.
- [ ] Add focused tests for hole completion, input validation, and clearing dependent FIR/GIR fields when those rules are extracted into pure helpers.

## 3. Test round state and IndexedDB storage

- [ ] Add `fake-indexeddb` so storage tests never touch a developer's real browser database.
- [ ] Isolate the database between tests and ensure asynchronous transactions finish before assertions.
- [ ] Test round create/read/update/delete and hole updates, including missing rounds and invalid hole indexes.
- [ ] Test yardage-book normalization, initial 18-hole shape, note create/update/read/delete, per-hole timestamps, and invalid hole numbers.
- [ ] Test that updating one yardage-book note does not change other holes' notes.
- [ ] Test the version-2-to-version-3 database upgrade creates the yardage-book store while preserving existing round and practice stores.
- [ ] Test `RoundContext` updates a hole immutably, persists the latest round, marks completion correctly, and surfaces save failures.

## 4. Test scoring and yardage-book components

- [ ] After extracting the form, test that par, score, and putts remain the only fields required to advance.
- [ ] Test FIR is offered only for par 4 and par 5.
- [ ] Test GIR miss direction appears when scoring data indicates a missed green and disappears/clears when the result changes to GIR.
- [ ] Test penalty counts reject negative and fractional values.
- [ ] Test the yardage editor shows a saved course note or a clear no-note state.
- [ ] Test editing and saving a note calls the yardage-book storage path without modifying the current round.
- [ ] Test loading and saving errors, retry behavior, and visible success feedback.
- [ ] Test accessible names, keyboard operation, and disabled/loading states for the scoring controls.

## 5. Add end-to-end coverage for critical journeys

- [ ] Add Playwright for browser-level workflows once the domain and component tests are established.
- [ ] Test creating a round, scoring holes, moving backward/forward, and resuming after a reload.
- [ ] Test selecting a saved yardage book at round setup and seeing the matching note on the correct hole.
- [ ] Test editing a note during a round and confirming the change appears in the course yardage book and a later round.
- [ ] Test an unknown course starts with no note and creates a yardage book only after the user saves a note.
- [ ] Add an offline scoring/resume test for the PWA's essential cached route and local IndexedDB behavior.
- [ ] Keep test data isolated and clean up created rounds, practice sessions, and yardage books after each run.

## 6. Run tests reliably

- [ ] Ensure unit, storage, and component tests run without network access or external API calls.
- [ ] Add CI checks for lint, unit tests, TypeScript, and production build when GitHub Actions or another CI workflow is introduced.
- [ ] Keep test fixtures small and explicit; use builders for repeated round/hole setup only when they reduce duplication.
- [ ] Prefer assertions on rendered behavior, calculated values, and persisted records over snapshots or CSS implementation details.
- [ ] Document any browser-only or manual validation that cannot yet be reliably automated.

## Recommended order

1. Add Vitest and test pure utilities.
2. Extract shared scoring rules and add boundary tests.
3. Add isolated IndexedDB tests with `fake-indexeddb`.
4. Extract and test the scoring form and yardage-note editor.
5. Add Playwright tests for round recovery, yardage reuse, and offline play.
6. Run the appropriate checks locally and in CI.
