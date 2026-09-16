import { Round, ScoringStats } from "./types";

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

export function calculateScoringStats(rounds: Round[]): ScoringStats {
    // get only our completed rounds
    const completedRounds = rounds.filter((round) => round.completed);

    // safeguard to only get holes that have the correct data
    const eligibleHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter((hole) => hole.putts !== undefined && hole.score !== undefined && hole.parValue !== undefined && hole.parValue >= 3)
                .length
        );
    }, 0);

    // get holes with data, and our putts are 3 or more
    const threePuttHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter((hole) => hole.putts !== undefined && hole.score !== undefined && hole.parValue !== undefined && hole.putts >= 3)
                .length
        );
    }, 0);

    // get GIR holes, (score - putts) must be less than par -2
    // assumed you get on green and two putt to make par
    const GIRHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter(
                (hole) =>
                    hole.putts !== undefined &&
                    hole.score !== undefined &&
                    hole.parValue !== undefined &&
                    hole.score - hole.putts <= hole.parValue - 2,
            ).length
        );
    }, 0);

    // Scrambling: made par or better while not making GIR
    const scramblingEligibleHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter((hole) => {
                if (hole.putts === undefined || hole.score === undefined || hole.parValue === undefined || hole.parValue < 3) {
                    return false;
                }

                const isGIR = hole.score - hole.putts <= hole.parValue - 2;
                return !isGIR;
            }).length
        );
    }, 0);

    const scramblingHoles = completedRounds.reduce((count, round) => {
        return (
            count +
            round.holes.filter((hole) => {
                if (hole.putts === undefined || hole.score === undefined || hole.parValue === undefined || hole.parValue < 3) {
                    return false;
                }

                const isGIR = hole.score - hole.putts <= hole.parValue - 2;
                const madeParOrBetter = hole.score <= hole.parValue;

                return !isGIR && madeParOrBetter;
            }).length
        );
    }, 0);

	const fairwayEligibleHoles = completedRounds.reduce((count, round) => {
		return (
			count + 
			round.holes.filter((hole) => {
				if (hole.putts === undefined || hole.score === undefined || hole.parValue === undefined || hole.fairway === undefined || hole.parValue <= 3) {
                    return false;
                }

				return true
			}).length
		)
	}, 0)

	const fairwaysHit = completedRounds.reduce((count, round) => {
		return (
			count +
			round.holes.filter((hole) => {
				if (hole.putts === undefined || hole.score === undefined || hole.parValue === undefined || hole.fairway === undefined || hole.parValue <= 3) {
                    return false;
                }

				const hitFairway = hole.fairway === 0;
				return hitFairway;
			}).length
		)
	}, 0)

    return {
        threePuttPercentage: eligibleHoles > 0 ? Number(((threePuttHoles / eligibleHoles) * 100).toFixed(1)) : null,
        GIRPercentage: eligibleHoles > 0 ? Number(((GIRHoles / eligibleHoles) * 100).toFixed(1)) : null,
        scramblingPercentage: eligibleHoles > 0 ? Number(((scramblingHoles / scramblingEligibleHoles) * 100).toFixed(1)) : null,
		fairwayPercentage: eligibleHoles > 0 ? Number(((fairwaysHit / fairwayEligibleHoles) * 100).toFixed(1)) : null,
        threePuttHoles,
        GIRHoles,
        scramblingHoles,
        eligibleHoles,
		scramblingEligibleHoles,
		fairwayEligibleHoles,
		fairwaysHit
    };
}

export function getPerformanceTone(value: number | null, metric: "three-putt" | "gir" | "scrambling" | "fairways") {
    if (value === null) {
        return {
            label: "Needs data",
            badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
            textClass: "text-slate-700",
        };
    }

    if (metric === "three-putt") {
        if (value <= 3) {
            return {
                label: "Pro",
                badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-800",
                textClass: "text-emerald-800",
            };
        }

        if (value <= 6) {
            return {
                label: "Excellent",
                badgeClass: "border-green-200 bg-green-50 text-green-700",
                textClass: "text-green-700",
            };
        }

        if (value <= 11) {
            return {
                label: "Good",
                badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
                textClass: "text-amber-700",
            };
        }

        return {
            label: "Needs Improvement",
            badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
            textClass: "text-rose-700",
        };
    } else if (metric === "gir") {
        if (value >= 65) {
            return {
                label: "Pro",
                badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-800",
                textClass: "text-emerald-800",
            };
        }

        if (value >= 50) {
            return {
                label: "Excellent",
                badgeClass: "border-green-200 bg-green-50 text-green-700",
                textClass: "text-green-700",
            };
        }

        if (value >= 33) {
            return {
                label: "Good",
                badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
                textClass: "text-amber-700",
            };
        }

        return {
            label: "Needs Improvement",
            badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
            textClass: "text-rose-700",
        };
    } else if (metric === "scrambling") {
        if (value >= 57) {
            return {
                label: "Pro",
                badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-800",
                textClass: "text-emerald-800",
            };
        }

        if (value >= 50) {
            return {
                label: "Excellent",
                badgeClass: "border-green-200 bg-green-50 text-green-700",
                textClass: "text-green-700",
            };
        }

        if (value >= 35) {
            return {
                label: "Good",
                badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
                textClass: "text-amber-700",
            };
        }

        return {
            label: "Needs Improvement",
            badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
            textClass: "text-rose-700",
        };
    } else if (metric === "fairways") {
		if (value >= 59) {
            return {
                label: "Pro",
                badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-800",
                textClass: "text-emerald-800",
            };
        }

        if (value >= 56) {
            return {
                label: "Excellent",
                badgeClass: "border-green-200 bg-green-50 text-green-700",
                textClass: "text-green-700",
            };
        }

        if (value >= 49) {
            return {
                label: "Good",
                badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
                textClass: "text-amber-700",
            };
        }

        return {
            label: "Needs Improvement",
            badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
            textClass: "text-rose-700",
        };
	}
}
