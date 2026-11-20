// Imports for idb
import { IDBPDatabase, openDB } from "idb";
import type { PracticeSession, Round, YardageBook, YardageBookHole } from "./types";

// Initialize db name, version, and store
const DB_NAME = "chipaway-golf";
const DB_VERSION = 3;
const STORE_NAME = "rounds";
const PRACTICE_STORE_NAME = "practiceSessions";
const YARDAGE_BOOK_STORE_NAME = "yardageBooks";

// Database schema
interface ChipAwayDB {
    rounds: {
        key: string;
        value: Round;
    };
    practiceSessions: {
        key: string;
        value: PracticeSession;
    };
    yardageBooks: {
        key: string;
        value: YardageBook;
    };
}

let db: IDBPDatabase<ChipAwayDB> | null = null;

// Initialize database connection
export async function initDB(): Promise<IDBPDatabase<ChipAwayDB>> {
    if (db) {
        return db;
    }

    db = await openDB<ChipAwayDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Create object store for rounds if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(PRACTICE_STORE_NAME)) {
                db.createObjectStore(PRACTICE_STORE_NAME, { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains(YARDAGE_BOOK_STORE_NAME)) {
                db.createObjectStore(YARDAGE_BOOK_STORE_NAME, { keyPath: "courseKey" });
            }
        },
    });

    return db;
}

export async function savePracticeSession(session: PracticeSession): Promise<string> {
    const database = await getDB();
    return (await database.put(PRACTICE_STORE_NAME, session)) as string;
}

export async function getPracticeSession(id: string): Promise<PracticeSession | undefined> {
    const database = await getDB();
    return database.get(PRACTICE_STORE_NAME, id);
}

export async function getAllPracticeSessions(): Promise<PracticeSession[]> {
    const database = await getDB();
    const sessions = await database.getAll(PRACTICE_STORE_NAME);
    return sessions.sort((a, b) => b.startedAt - a.startedAt);
}

export async function getActivePracticeSession(): Promise<PracticeSession | undefined> {
    const sessions = await getAllPracticeSessions();
    return sessions.find((session) => session.endedAt === undefined);
}

export function normalizeCourseName(courseName: string): string {
    const normalizedName = courseName.trim().replace(/\s+/g, " ").toLowerCase();
    if (!normalizedName) {
        throw new Error("Course name is required");
    }
    return normalizedName;
}

function getCourseDisplayName(courseName: string): string {
    const displayName = courseName.trim().replace(/\s+/g, " ");
    if (!displayName) {
        throw new Error("Course name is required");
    }
    return displayName;
}

function validateYardageBookHoleNumber(holeNumber: number): void {
    if (!Number.isInteger(holeNumber) || holeNumber < 1 || holeNumber > 18) {
        throw new Error("Hole number must be between 1 and 18");
    }
}

export async function getYardageBook(courseName: string): Promise<YardageBook | undefined> {
    const database = await getDB();
    return database.get(YARDAGE_BOOK_STORE_NAME, normalizeCourseName(courseName));
}

export async function getAllYardageBooks(): Promise<YardageBook[]> {
    const database = await getDB();
    const yardageBooks = await database.getAll(YARDAGE_BOOK_STORE_NAME);
    return yardageBooks.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getYardageBookHoleNote(courseName: string, holeNumber: number): Promise<YardageBookHole | undefined> {
    validateYardageBookHoleNumber(holeNumber);
    const yardageBook = await getYardageBook(courseName);
    return yardageBook?.holes.find((hole) => hole.holeNumber === holeNumber);
}

export async function saveYardageBookHoleNote(
    courseName: string,
    holeNumber: number,
    note: string,
): Promise<YardageBook> {
    validateYardageBookHoleNumber(holeNumber);
    const courseKey = normalizeCourseName(courseName);
    const displayName = getCourseDisplayName(courseName);
    const database = await getDB();
    const transaction = database.transaction(YARDAGE_BOOK_STORE_NAME, "readwrite");
    const store = transaction.objectStore(YARDAGE_BOOK_STORE_NAME);
    const existingBook = await store.get(courseKey);
    const now = Date.now();
    const holes: YardageBookHole[] =
        existingBook?.holes ??
        Array.from({ length: 18 }, (_, index) => ({
            holeNumber: index + 1,
            note: "",
        }));

    holes[holeNumber - 1] = {
        holeNumber,
        note,
        updatedAt: now,
    };

    const yardageBook: YardageBook = {
        courseKey,
        courseName: existingBook?.courseName ?? displayName,
        holes,
        updatedAt: now,
    };

    await store.put(yardageBook);
    await transaction.done;
    return yardageBook;
}

export async function deleteYardageBook(courseName: string): Promise<void> {
    const database = await getDB();
    await database.delete(YARDAGE_BOOK_STORE_NAME, normalizeCourseName(courseName));
}

// Get database connection
// Initializes if not already connected
async function getDB(): Promise<IDBPDatabase<ChipAwayDB>> {
    if (!db) {
        await initDB();
    }
    return db as IDBPDatabase<ChipAwayDB>;
}

// Save a round to the database
export async function saveRound(round: Round): Promise<string> {
    const database = await getDB();
    const id = await database.put(STORE_NAME, round);
    return id as string;
}

// Get a single round by ID
export async function getRound(id: string): Promise<Round | undefined> {
    const database = await getDB();
    return database.get(STORE_NAME, id);
}

// Get all rounds from the database
// Returns sorted by date
export async function getAllRounds(): Promise<Round[]> {
    const database = await getDB();
    const rounds = await database.getAll(STORE_NAME);
    return rounds.sort((a, b) => b.date - a.date);
}

// Delete a round by ID
export async function deleteRound(id: string): Promise<void> {
    const database = await getDB();
    await database.delete(STORE_NAME, id);
}

// Update a specific hole in a round
export async function updateRoundHole(roundId: string, holeIndex: number, holeData: Partial<Round["holes"][0]>): Promise<void> {
    // Get the round
    const round = await getRound(roundId);

    // Handle any errors
    if (!round) {
        throw new Error(`Round with ID ${roundId} not found`);
    }

    if (holeIndex < 0 || holeIndex >= 18) {
        throw new Error("Hole index must be between 0 and 17");
    }

    // create shallow copy and update
    round.holes[holeIndex] = {
        ...round.holes[holeIndex],
        ...holeData,
    };

    await saveRound(round);
}

// Clear all rounds from the database
export async function clearAllRounds(): Promise<void> {
    const database = await getDB();
    await database.clear(STORE_NAME);
}
