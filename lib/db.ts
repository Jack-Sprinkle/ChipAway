// Imports for idb
import { IDBPDatabase, openDB } from "idb";
import { PracticeSession, Round } from "./types";

// Initialize db name, version, and store
const DB_NAME = "chipaway-golf";
const DB_VERSION = 2;
const STORE_NAME = "rounds";
const PRACTICE_STORE_NAME = "practiceSessions";

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
