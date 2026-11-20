# ChipAway TO-DO

## Primary feature: Pre-round AI game plans

Generate a personalized pre-round game plan from the user's:

- Recent hole-by-hole scoring data
- Fairway and green miss tendencies
- Tee club usage
- Penalty frequency
- Digital yardage book notes
- Recent practice shot tendencies

AI generation is the final step. The local data model, storage, interfaces, and aggregation work should be completed first. No golf data should be sent to an external service without an explicit future implementation decision and consent flow.

## 1. Extend the scoring data model

- [x] Add typed FIR outcomes: hit, missed left, or missed right.
- [x] Replace the current numeric fairway field with typed values.
- [x] Add typed GIR miss directions: left, right, short, or long.
- [x] Add a tee club field to each hole.
- [x] Add a penalty count to each hole.
- [x] Keep all richer fields optional until the user provides a value.
- [x] Confirm no IndexedDB version bump is needed for optional fields on existing round records; no data migration is included.

## 2. Add richer data capture to hole scoring

- [x] Add a tee club selector.
- [x] Add FIR controls for hit, missed left, and missed right.
- [x] Show FIR controls only for par 4 and par 5 holes.
- [x] Add GIR miss controls for left, right, short, and long.
- [x] Add a penalty count control.
- [x] Add accessible labels and mobile-friendly controls.
- [x] Add the same controls to direct round URL and resumed-round flows.
- [x] Save richer hole values as the user advances between holes.
- [x] Preserve the existing requirement that par, score, and putts are complete before advancing.

## 3. Create the digital yardage book data model

- [x] Define a `YardageBook` record stored separately from `Round` and `Hole`.
- [x] Store books by normalized course name.
- [x] Store one note per hole in the yardage book's 18-hole collection.
- [x] Support dates or timestamps for when a hole note was last updated.
- [x] Add a yardage-books object store through an IndexedDB schema version upgrade.
- [x] Add CRUD helpers for saving and loading a course yardage book.
- [x] Add a helper for loading the notes for one course and hole.

## 4. Build the yardage book catalogue

- [ ] Add a `/scorecard/yardage-books` route.
- [ ] List saved course yardage books with their course name and last-updated date.
- [ ] Provide an empty state for users with no saved books.
- [ ] Allow selecting a course from the catalogue.
- [ ] Display holes 1 through 18 for the selected course.
- [ ] Add a small text area for each hole note.
- [ ] Provide save feedback and error handling.
- [ ] Make the interface usable on mobile.

## 5. Reuse notes during rounds

- [ ] Add an option to open or select a yardage book when starting a round.
- [ ] Match a new or resumed round to prior notes using the course name.
- [ ] Load and display the matching course-book note for the current hole without copying it into the round.
- [ ] Allow the note to be edited during the round.
- [ ] Save any in-round edit directly to the course yardage book.
- [ ] Clearly show whether a hole has no saved note or is using a prior course note.
- [ ] Do not overwrite a course note accidentally when creating a new round.

## 6. Update round review

- [ ] Show tee club for each hole.
- [ ] Show FIR result and miss direction for par 4 and par 5 holes.
- [ ] Show GIR miss direction where applicable.
- [ ] Show penalty count for each hole.
- [ ] If notes are shown in round review, load them from the associated yardage book rather than the round record.

## 7. Expand scoring statistics

- [ ] Calculate FIR miss distribution: hit, left, and right.
- [ ] Calculate GIR miss distribution: left, right, short, and long.
- [ ] Calculate penalty counts and penalties per round.
- [ ] Calculate tee-club usage distributions.
- [ ] Reuse "needs data" states when no usable observations exist.
- [ ] Add the richer distributions to the stats page.
- [ ] Keep existing three-putt, GIR, scrambling, fairway, and handicap calculations working.

## 8. Prepare local AI game-plan data

- [ ] Define a typed pre-round input model.
- [ ] Aggregate recent completed rounds.
- [ ] Aggregate recent practice sessions and shot tendencies.
- [ ] Include the selected course's 18 hole notes.
- [ ] Include FIR, GIR, tee-club, and penalty trends.
- [ ] Limit aggregation to a clear recent-round window.
- [ ] Add a deterministic local summary that can be inspected before an AI request.
- [ ] Validate and redact or omit unavailable or incomplete values.
- [ ] Implement no external AI request yet.

## 9. Generate pre-round game plans

- [ ] Decide and document the AI provider and server/client boundary.
- [ ] Add explicit user consent before sending golf or practice data externally.
- [ ] Add a pre-round game-plan page or section.
- [ ] Send the validated local aggregation to the approved provider.
- [ ] Show loading, error, retry, and empty states.
- [ ] Save or clearly label whether a generated plan is temporary or persisted.
- [ ] Test that local data remains usable when AI generation fails.

## Recommended implementation order

1. Extend the data model and update the IndexedDB schema version without migrating existing rounds.
2. Capture richer hole data during scoring.
3. Persist and catalogue yardage-book notes.
4. Reuse prior notes in rounds.
5. Update round review and scoring statistics.
6. Build and test the local AI input aggregation.
7. Add a consent-aware AI provider integration and pre-round plan UI.
