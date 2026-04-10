// Core types for ChipAway golf scoring app

export interface Hole {
    holeNumber: number; // 1-18
    parValue?: number; // Par value (entered by user during scoring)
    score?: number; // Strokes taken (entered by user during scoring)
    putts?: number; // Number of putts (entered by user during scoring)
}

export interface Round {
    id: string; // Unique identifier (timestamp-based)
    courseName: string; // Name of the course
    date: number; // Timestamp when round was started
    holes: Hole[]; // Array of 18 holes
    completed: boolean; // Whether the full 18 holes have been scored
}

// Helper function to create a new round
// Initializes all 18 holes with empty data (user fills par/score/putts progressively)

export function createRound(
    courseName: string,
    date: number = Date.now(),
): Round {
    return {
        id: `round-${date}`,
        courseName,
        date,
        holes: Array.from({ length: 18 }, (_, index) => ({
            holeNumber: index + 1,
        })),
        completed: false,
    };
}

// Helper function to calculate totals from a round
// Only includes holes that have been scored (have parValue and score)

export function getRoundTotals(round: Round) {
    const front9 = round.holes.slice(0, 9);
    const back9 = round.holes.slice(9, 18);

    // Calculate totals only for holes with complete data
    const front9Score = front9.reduce(
        (sum, hole) => sum + (hole.score !== undefined ? hole.score : 0),
        0,
    );
    const back9Score = back9.reduce(
        (sum, hole) => sum + (hole.score !== undefined ? hole.score : 0),
        0,
    );
    const totalScore = front9Score + back9Score;

    const front9Par = front9.reduce(
        (sum, hole) => sum + (hole.parValue !== undefined ? hole.parValue : 0),
        0,
    );
    const back9Par = back9.reduce(
        (sum, hole) => sum + (hole.parValue !== undefined ? hole.parValue : 0),
        0,
    );

    return {
        front9Score,
        back9Score,
        totalScore,
        front9Par,
        back9Par,
        totalPar: front9Par + back9Par,
    };
}
