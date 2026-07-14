"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllRounds } from "@/lib/db";
import { calculateHandicap, calculateScoringStats, type Round } from "@/lib/types";

function getPerformanceTone(value: number | null, metric: "three-putt" | "gir") {
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
    }

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
}

export default function StatsPage() {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRounds = async () => {
            try {
                const allRounds = await getAllRounds();
                allRounds.sort((a, b) => b.date - a.date);
                setRounds(allRounds);
            } catch (err) {
                setError("Failed to load past rounds");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadRounds();
    }, []);

    const handicap = calculateHandicap(rounds);
    const scoringStats = calculateScoringStats(rounds);
    const threePuttTone = getPerformanceTone(scoringStats.threePuttPercentage, "three-putt");
    const girTone = getPerformanceTone(scoringStats.greensInRegulationPercentage, "gir");
    const completedRounds = rounds.filter((round) => round.completed).length;
    const roundsWithScores = rounds.filter((round) =>
        round.holes.some((hole) => hole.score !== undefined && hole.parValue !== undefined),
    ).length;
    const eligibleRounds = rounds.filter(
        (round) => round.completed && round.courseRating > 0 && round.courseSlope > 0,
    ).length;
    const latestRound = rounds[0];

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white py-12 px-6 flex items-center justify-center">
                <p className="text-text-dark">Loading rounds...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-white py-12 px-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-700 font-semibold mb-4">{error}</p>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-vibrant-green text-white rounded-lg hover:bg-fairway-green"
                    >
                        Return Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-fairway-green mb-2">Stats</h1>
                        <p className="text-text-dark text-sm">{rounds.length} round(s) recorded</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/scorecard/scores"
                            className="inline-flex items-center rounded-full border border-fairway-green/15 bg-light-sand px-4 py-2 text-sm font-semibold text-fairway-green transition-colors hover:border-fairway-green/30 hover:bg-cream"
                        >
                            Rounds
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center rounded-full border border-fairway-green/15 bg-light-sand px-4 py-2 text-sm font-semibold text-fairway-green transition-colors hover:border-fairway-green/30 hover:bg-cream"
                        >
                            Home
                        </Link>
                    </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Handicap index</p>
                    <p className="mt-3 text-4xl font-semibold text-slate-900">
                        {handicap !== null ? handicap.toFixed(1) : "—"}
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                        {handicap !== null
                            ? `Based on your ${Math.min(8, eligibleRounds)} best rounds from your most recent 20.`
                            : "Record at least 3 completed rounds with scores to calculate your handicap."}
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">Rounds analyzed</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{roundsWithScores}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">Completed rounds</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{completedRounds}</p>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">3-putt percentage</p>
                        <p className={`mt-2 text-2xl font-semibold ${threePuttTone.textClass}`}>
                            {scoringStats.threePuttPercentage !== null
                                ? `${scoringStats.threePuttPercentage.toFixed(1)}%`
                                : "—"}
                        </p>
                        <span
                            className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${threePuttTone.badgeClass}`}
                        >
                            {threePuttTone.label}
                        </span>
                        <p className="mt-2 text-sm text-slate-600">
                            {scoringStats.eligibleThreePuttHoles > 0
                                ? `${scoringStats.threePuttHoles} of ${scoringStats.eligibleThreePuttHoles} eligible holes`
                                : "Add hole-by-hole putts to start tracking"}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">Greens in regulation</p>
                        <p className={`mt-2 text-2xl font-semibold ${girTone.textClass}`}>
                            {scoringStats.greensInRegulationPercentage !== null
                                ? `${scoringStats.greensInRegulationPercentage.toFixed(1)}%`
                                : "—"}
                        </p>
                        <span
                            className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${girTone.badgeClass}`}
                        >
                            {girTone.label}
                        </span>
                        <p className="mt-2 text-sm text-slate-600">
                            {scoringStats.eligibleGreensInRegulationHoles > 0
                                ? `${scoringStats.greensInRegulationHoles} of ${scoringStats.eligibleGreensInRegulationHoles} eligible holes`
                                : "Add scores to start tracking"}
                        </p>
                    </div>
                </div>
                {latestRound ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">Latest round</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{latestRound.courseName}</p>
                        <p className="text-sm text-slate-600">
                            {new Date(latestRound.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                ) : null}
            </div>
        </main>
    );
}
