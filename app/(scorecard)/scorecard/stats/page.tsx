"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllRounds } from "@/lib/db";
import { calculateHandicap, type Round } from "@/lib/types";

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
