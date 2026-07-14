// Core types for ChipAway golf scoring app

export interface Hole {
    holeNumber: number; // 1-18
    parValue?: number; // Par value (entered by user during scoring)
    score?: number; // Strokes taken (entered by user during scoring)
    putts?: number; // Number of putts (entered by user during scoring)
    isComplete: boolean; // Marker for hole being complete to track ongoing round
}

export interface Round {
    id: string; // Unique identifier (timestamp-based)
    courseName: string; // Name of the course
    courseRating: number; // Rating of the course
    courseSlope: number; // Slope of the course
    date: number; // Timestamp when round was started
    holes: Hole[]; // Array of 18 holes
    completed: boolean; // Whether the full 18 holes have been scored
}

// Helper function to create a new round
// Initializes all 18 holes with empty data (user fills par/score/putts progressively), isComplete will be updated on next hole click
export function createRound(
    courseName: string,
    courseRating: number,
    courseSlope: number,
    date: number = Date.now(),
): Round {
    return {
        id: `round-${date}`,
        courseName,
        courseRating,
        courseSlope,
        date,
        holes: Array.from({ length: 18 }, (_, index) => ({
            holeNumber: index + 1,
            isComplete: false,
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
    const front9Score = front9.reduce((sum, hole) => sum + (hole.score !== undefined ? hole.score : 0), 0);
    const back9Score = back9.reduce((sum, hole) => sum + (hole.score !== undefined ? hole.score : 0), 0);
    const totalScore = front9Score + back9Score;

    const front9Par = front9.reduce((sum, hole) => sum + (hole.parValue !== undefined ? hole.parValue : 0), 0);
    const back9Par = back9.reduce((sum, hole) => sum + (hole.parValue !== undefined ? hole.parValue : 0), 0);

    const totalPar = front9Par + back9Par;

    return {
        front9Score,
        back9Score,
        totalScore,
        front9Par,
        back9Par,
        totalPar,
    };
}

export interface ScoringStats {
    threePuttPercentage: number | null;
    greensInRegulationPercentage: number | null;
    threePuttHoles: number;
    eligibleThreePuttHoles: number;
    greensInRegulationHoles: number;
    eligibleGreensInRegulationHoles: number;
}

// Calculate a simple handicap index from completed rounds.
// This uses the course handicap differential formula based on the adjusted
// gross score, course rating, and slope.
export function calculateHandicap(rounds: Round[]): number | null {
    const usableRounds = rounds
        .filter((round) => {
            const hasScoredHoles = round.holes.some((hole) => hole.score !== undefined && hole.parValue !== undefined);
            return round.completed && hasScoredHoles && round.courseRating > 0 && round.courseSlope > 0;
        })
        .sort((a, b) => b.date - a.date)
        .slice(0, 20);

    if (usableRounds.length < 3) {
        return null;
    }

    const differentials = usableRounds
        .map((round) => {
            const totals = getRoundTotals(round);
            const grossScore = totals.totalScore;

            if (grossScore === 0 || round.courseRating <= 0 || round.courseSlope <= 0) {
                return null;
            }

            return Number((((grossScore - round.courseRating) * 113) / round.courseSlope).toFixed(1));
        })
        .filter((value): value is number => value !== null)
        .sort((a, b) => a - b);

    if (differentials.length < 3) {
        return null;
    }

    const bestDifferentials = differentials.slice(0, Math.min(8, differentials.length));
    const averageDifferential =
        bestDifferentials.reduce((sum, differential) => sum + differential, 0) / bestDifferentials.length;

    return Number(averageDifferential.toFixed(1));
}

export function calculateScoringStats(rounds: Round[]): ScoringStats {
    const completedRounds = rounds.filter((round) => round.completed);

    const threePuttHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter(
                (hole) =>
                    hole.putts !== undefined &&
                    hole.score !== undefined &&
                    hole.parValue !== undefined &&
                    hole.putts >= 3,
            ).length
        );
    }, 0);

    const eligibleThreePuttHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter(
                (hole) => hole.putts !== undefined && hole.score !== undefined && hole.parValue !== undefined,
            ).length
        );
    }, 0);

    const greensInRegulationHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter(
                (hole) =>
                    hole.putts !== undefined &&
                    hole.score !== undefined &&
                    hole.parValue !== undefined &&
                    (hole.score - hole.putts) <= (hole.parValue - 2),
            ).length
        );
    }, 0);

    const eligibleGreensInRegulationHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter((hole) => hole.score !== undefined && hole.parValue !== undefined && hole.parValue >= 3)
                .length
        );
    }, 0);

    return {
        threePuttPercentage:
            eligibleThreePuttHoles > 0 ? Number(((threePuttHoles / eligibleThreePuttHoles) * 100).toFixed(1)) : null,
        greensInRegulationPercentage:
            eligibleGreensInRegulationHoles > 0
                ? Number(((greensInRegulationHoles / eligibleGreensInRegulationHoles) * 100).toFixed(1))
                : null,
        threePuttHoles,
        eligibleThreePuttHoles,
        greensInRegulationHoles,
        eligibleGreensInRegulationHoles,
    };
}
