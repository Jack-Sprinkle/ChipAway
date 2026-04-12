// IndexedDB wrapper for ChipAway using idb library
// Provides simple, promise-based CRUD operations for golf rounds

import { IDBPDatabase, openDB } from "idb";
import { Round } from "./types";

const DB_NAME = "chipaway-golf";
const DB_VERSION = 1;
const STORE_NAME = "rounds";

// Database schema for ChipAway
// Defines the structure of all object stores in IndexedDB

interface ChipAwayDB {
    rounds: {
        key: string;
        value: Round;
    };
}

let db: IDBPDatabase<ChipAwayDB> | null = null;

// Initialize database connection
// Creates the object store if it doesn't exist

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
        },
    });

    return db;
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
// Creates or updates an existing round

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
// Returns rounds sorted by date (newest first)

export async function getAllRounds(): Promise<Round[]> {
    const database = await getDB();
    const rounds = await database.getAll(STORE_NAME);
    // Sort by date descending (newest first)
    return rounds.sort((a, b) => b.date - a.date);
}

// Delete a round by ID

export async function deleteRound(id: string): Promise<void> {
    const database = await getDB();
    await database.delete(STORE_NAME, id);
}

// Update a specific hole in a round

export async function updateRoundHole(
    roundId: string,
    holeIndex: number,
    holeData: Partial<Round["holes"][0]>,
): Promise<void> {
    const round = await getRound(roundId);

    if (!round) {
        throw new Error(`Round with ID ${roundId} not found`);
    }

    if (holeIndex < 0 || holeIndex >= 18) {
        throw new Error("Hole index must be between 0 and 17");
    }

    round.holes[holeIndex] = {
        ...round.holes[holeIndex],
        ...holeData,
    };

    await saveRound(round);
}

// Mark a round as completed

export async function completeRound(roundId: string): Promise<void> {
    const round = await getRound(roundId);

    if (!round) {
        throw new Error(`Round with ID ${roundId} not found`);
    }

    round.completed = true;
    await saveRound(round);
}

// Clear all rounds from the database

export async function clearAllRounds(): Promise<void> {
    const database = await getDB();
    await database.clear(STORE_NAME);
}
