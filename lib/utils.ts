import { Hole, Round, ScoringStats } from "./types";

// Helper function to create a new round
// Initialize all holes, but with a isComplete, updated once user goes to next hole. This is for the running scoreboard
export function createRound(courseName: string, courseRating: number, courseSlope: number, date: number = Date.now()): Round {
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
export function getRoundTotals(round: Round) {
    // Split to Front 9 and Back 9
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

// Calculate a simple handicap index from completed rounds.
// Uses the course handicap differential formula based on the adjusted
// gross score, course rating, and slope.
export function calculateHandicap(rounds: Round[]): number | null {
    const usableRounds = rounds
        .filter((round) => {
            // ensure all holes have a score and a par listed
            const hasScoredHoles = round.holes.some((hole) => hole.score !== undefined && hole.parValue !== undefined);
            // return if the round is complete, we have scored holes, course rating, and slope
            return round.completed && hasScoredHoles && round.courseRating > 0 && round.courseSlope > 0;
        })
        // sort by date, we need the most recent 20
        .sort((a, b) => b.date - a.date)
        .slice(0, 19);

    // need a min of 54 holes for a handicap, cannot continue if we don't
    if (usableRounds.length < 3) {
        return null;
    }

    // get the differentials on the specific round
    const differentials = usableRounds
        .map((round) => {
            // get our total gross score
            const totals = getRoundTotals(round);
            const grossScore = totals.totalScore;

            // safeguard
            if (grossScore === 0 || round.courseRating <= 0 || round.courseSlope <= 0) {
                return null;
            }

            // use USGA formula (gross - rating) * 113 / slope
            // cannot factor in 'conditions' so this is fine, assume conditions at 0.
            return Number((((grossScore - round.courseRating) * 113) / round.courseSlope).toFixed(1));
        })
        // safeguard, make sure we actually returned a number
        .filter((value): value is number => value !== null)
        // sort by our best 8 of 20 rounds
        .sort((a, b) => a - b);

    // get just the best
    const bestDifferentials = differentials.slice(0, 8);
    // average those bad boys
    const averageDifferential = bestDifferentials.reduce((sum, differential) => sum + differential, 0) / bestDifferentials.length;

    // return only to 1 decimal point
    return Number(averageDifferential.toFixed(1));
}

function hasScoringData(hole: Hole): hole is Hole & Required<Pick<Hole, "putts" | "score" | "parValue">> {
    return hole.putts !== undefined && hole.score !== undefined && hole.parValue !== undefined;
}

function isGreenInRegulation(hole: Hole & Required<Pick<Hole, "putts" | "score" | "parValue">>) {
    // A GIR leaves at most two putts to make par.
    return hole.score - hole.putts <= hole.parValue - 2;
}

function toPercentage(numerator: number, denominator: number): number | null {
    return denominator > 0 ? Number(((numerator / denominator) * 100).toFixed(1)) : null;
}

export function calculateScoringStats(rounds: Round[]): ScoringStats {
    const counts = {
        eligibleHoles: 0,
        threePuttHoles: 0,
        GIRHoles: 0,
        scramblingEligibleHoles: 0,
        scramblingHoles: 0,
        fairwayEligibleHoles: 0,
        fairwaysHit: 0,
    };

    for (const round of rounds) {
        if (!round.completed) continue;

        for (const hole of round.holes) {
            if (!hasScoringData(hole) || hole.parValue < 3) continue;

            counts.eligibleHoles++;

            if (hole.putts >= 3) counts.threePuttHoles++;

            const hitGreenInRegulation = isGreenInRegulation(hole);
            if (hitGreenInRegulation) {
                counts.GIRHoles++;
            } else {
                // Scrambling means saving par (or better) after missing the GIR.
                counts.scramblingEligibleHoles++;
                if (hole.score <= hole.parValue) counts.scramblingHoles++;
            }

            // Fairways are only tracked on holes longer than par 3.
            if (hole.parValue > 3 && hole.fairway !== undefined) {
                counts.fairwayEligibleHoles++;
                if (hole.fairway === 0) counts.fairwaysHit++;
            }
        }
    }

    return {
        threePuttPercentage: toPercentage(counts.threePuttHoles, counts.eligibleHoles),
        GIRPercentage: toPercentage(counts.GIRHoles, counts.eligibleHoles),
        scramblingPercentage: toPercentage(counts.scramblingHoles, counts.scramblingEligibleHoles),
        fairwayPercentage: toPercentage(counts.fairwaysHit, counts.fairwayEligibleHoles),
        ...counts,
    };
}

type PerformanceMetric = "three-putt" | "gir" | "scrambling" | "fairways";
type ToneName = "pro" | "excellent" | "good" | "needsImprovement";

const PERFORMANCE_TONES: Record<ToneName | "needsData", { label: string; badgeClass: string; textClass: string }> = {
    needsData: {
        label: "Needs data",
        badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
        textClass: "text-slate-700",
    },
    pro: {
        label: "Pro",
        badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-800",
        textClass: "text-emerald-800",
    },
    excellent: {
        label: "Excellent",
        badgeClass: "border-green-200 bg-green-50 text-green-700",
        textClass: "text-green-700",
    },
    good: {
        label: "Good",
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
        textClass: "text-amber-700",
    },
    needsImprovement: {
        label: "Needs Improvement",
        badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
        textClass: "text-rose-700",
    },
};

const PERFORMANCE_TONE_RULES: Record<
    PerformanceMetric,
    { higherIsBetter: boolean; thresholds: ReadonlyArray<{ value: number; tone: ToneName }> }
> = {
    "three-putt": {
        higherIsBetter: false,
        thresholds: [
            { value: 3, tone: "pro" },
            { value: 6, tone: "excellent" },
            { value: 11, tone: "good" },
        ],
    },
    gir: {
        higherIsBetter: true,
        thresholds: [
            { value: 65, tone: "pro" },
            { value: 50, tone: "excellent" },
            { value: 33, tone: "good" },
        ],
    },
    scrambling: {
        higherIsBetter: true,
        thresholds: [
            { value: 57, tone: "pro" },
            { value: 50, tone: "excellent" },
            { value: 35, tone: "good" },
        ],
    },
    fairways: {
        higherIsBetter: true,
        thresholds: [
            { value: 59, tone: "pro" },
            { value: 56, tone: "excellent" },
            { value: 49, tone: "good" },
        ],
    },
};

export function getPerformanceTone(value: number | null, metric: PerformanceMetric) {
    if (value === null) return PERFORMANCE_TONES.needsData;

    const rules = PERFORMANCE_TONE_RULES[metric];
    const matchingThreshold = rules.thresholds.find(({ value: threshold }) =>
        rules.higherIsBetter ? value >= threshold : value <= threshold,
    );

    return PERFORMANCE_TONES[matchingThreshold?.tone ?? "needsImprovement"];
}

// force deployment on main
