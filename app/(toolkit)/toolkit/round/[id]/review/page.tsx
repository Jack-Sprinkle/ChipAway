"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getRound } from "@/lib/db";
import type { Round } from "@/lib/types";
import { calculateScoringStats, getRoundTotals } from "@/lib/utils";

export default function RoundReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: roundId } = use(params);
    const [round, setRound] = useState<Round | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCurrent = true;

        async function loadRound() {
            try {
                const loadedRound = await getRound(roundId);
                if (!isCurrent) return;
                if (!loadedRound) {
                    setError("Round not found");
                    return;
                }
                setRound(loadedRound);
            } catch (loadError) {
                console.error(loadError);
                if (isCurrent) setError("Failed to load round");
            } finally {
                if (isCurrent) setIsLoading(false);
            }
        }

        void loadRound();
        return () => {
            isCurrent = false;
        };
    }, [roundId]);

    if (isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-text-dark">Loading round recap...</p>
            </main>
        );
    }

    if (!round || error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
                <div className="text-center">
                    <p className="mb-4 font-semibold text-red-700">{error || "Round not found"}</p>
                    <Link href="/toolkit/scores" className="font-semibold text-vibrant-green underline">
                        Back to rounds
                    </Link>
                </div>
            </main>
        );
    }

    const { totalScore, totalPar, front9Score, back9Score, front9Par, back9Par } = getRoundTotals(round);
    const vsPar = totalScore - totalPar;
    const formattedDate = new Date(round.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const scoringStats = calculateScoringStats([round]);
    const penaltyTotal = round.holes.reduce((total, hole) => total + (hole.penaltyCount ?? 0), 0);

    return (
        <main className="min-h-screen bg-white px-6 py-12">
            <div className="mx-auto max-w-lg">
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-vibrant-green">Round complete</p>
                    <h1 className="text-3xl font-bold text-fairway-green">{round.courseName}</h1>
                    <p className="mt-1 text-sm text-text-dark">{formattedDate}</p>
                </div>

                <section className="mb-5 rounded-2xl bg-fairway-green p-6 text-center text-white" aria-label="Round score">
                    <p className="text-xs font-semibold tracking-widest opacity-90">TOTAL SCORE</p>
                    <p className="mt-1 text-6xl font-bold">{totalScore}</p>
                    <p className="mt-2 text-sm">
                        {totalPar} par
                        <span className="mx-2 opacity-70">·</span>
                        {vsPar > 0 ? "+" : ""}
                        {vsPar === 0 ? "Even par" : `${vsPar} vs par`}
                    </p>
                </section>

                <section className="mb-5 grid grid-cols-2 gap-3" aria-label="Nine-hole scores">
                    <div className="rounded-xl border border-light-sand bg-cream p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-text-dark">Front 9</p>
                        <p className="mt-1 text-3xl font-bold text-fairway-green">{front9Score}</p>
                        <p className="text-sm text-text-dark">Par {front9Par}</p>
                    </div>
                    <div className="rounded-xl border border-light-sand bg-cream p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-text-dark">Back 9</p>
                        <p className="mt-1 text-3xl font-bold text-fairway-green">{back9Score}</p>
                        <p className="text-sm text-text-dark">Par {back9Par}</p>
                    </div>
                </section>

                <section className="mb-8 grid grid-cols-2 gap-3" aria-label="Round highlights">
                    <div className="rounded-xl border border-gray-200 p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-text-dark">Fairways hit</p>
                        <p className="mt-1 text-2xl font-bold text-fairway-green">
                            {scoringStats.fairwayEligibleHoles > 0
                                ? `${scoringStats.fairwaysHit}/${scoringStats.fairwayEligibleHoles}`
                                : "—"}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-text-dark">Greens hit</p>
                        <p className="mt-1 text-2xl font-bold text-fairway-green">
                            {scoringStats.eligibleHoles > 0 ? `${scoringStats.GIRHoles}/${scoringStats.eligibleHoles}` : "—"}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-text-dark">3+ putt holes</p>
                        <p className="mt-1 text-2xl font-bold text-fairway-green">{scoringStats.threePuttHoles}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-text-dark">Penalty strokes</p>
                        <p className="mt-1 text-2xl font-bold text-fairway-green">{penaltyTotal}</p>
                    </div>
                </section>

                <div className="space-y-3">
                    <Link
                        href={`/toolkit/round/${round.id}/view`}
                        className="block rounded-lg bg-vibrant-green px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-fairway-green"
                    >
                        View full scorecard
                    </Link>
                    <Link
                        href="/toolkit/scores"
                        className="block rounded-lg border-2 border-vibrant-green px-5 py-3 text-center font-semibold text-vibrant-green transition-colors hover:bg-cream"
                    >
                        Back to rounds
                    </Link>
                </div>
            </div>
        </main>
    );
}
