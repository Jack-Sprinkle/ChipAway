"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getRound } from "@/lib/db";
import type { Round } from "@/lib/types";
import { getRoundTotals } from "@/lib/types";

export default function RoundViewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [round, setRound] = useState<Round | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Unwrap params promise
    const { id: roundId } = use(params);

    /**
     * Load round from IndexedDB on mount
     */
    useEffect(() => {
        const loadRound = async () => {
            try {
                const loadedRound = await getRound(roundId);
                if (!loadedRound) {
                    setError("Round not found");
                    return;
                }
                setRound(loadedRound);
            } catch (err) {
                setError("Failed to load round");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadRound();
    }, [roundId]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white py-12 px-6 flex items-center justify-center">
                <p className="text-text-dark">Loading round...</p>
            </main>
        );
    }

    if (!round || error) {
        return (
            <main className="min-h-screen bg-white py-12 px-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-700 font-semibold mb-4">
                        {error || "Round not found"}
                    </p>
                    <Link
                        href="/scores"
                        className="px-4 py-2 bg-vibrant-green text-white rounded-lg hover:bg-fairway-green"
                    >
                        Back to Rounds
                    </Link>
                </div>
            </main>
        );
    }

    const { totalScore, front9Score, back9Score } = getRoundTotals(round);
    const roundDate = new Date(round.date);
    const formattedDate = roundDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <main className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/scores"
                        className="text-vibrant-green font-semibold mb-4 inline-block hover:text-fairway-green"
                    >
                        ← Back to Rounds
                    </Link>
                    <h1 className="text-3xl font-bold text-fairway-green mb-2">
                        {round.courseName}
                    </h1>
                    <p className="text-text-dark text-sm">{formattedDate}</p>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-cream border-2 border-fairway-green rounded-lg text-center">
                        <p className="text-text-dark text-xs font-semibold mb-1">
                            TOTAL SCORE
                        </p>
                        <p className="text-4xl font-bold text-fairway-green">
                            {totalScore}
                        </p>
                    </div>
                    <div className="p-4 bg-cream border-2 border-vibrant-green rounded-lg text-center">
                        <p className="text-text-dark text-xs font-semibold mb-1">
                            FRONT 9
                        </p>
                        <p className="text-4xl font-bold text-vibrant-green">
                            {front9Score}
                        </p>
                    </div>
                    <div className="p-4 bg-cream border-2 border-vibrant-green rounded-lg text-center">
                        <p className="text-text-dark text-xs font-semibold mb-1">
                            BACK 9
                        </p>
                        <p className="text-4xl font-bold text-vibrant-green">
                            {back9Score}
                        </p>
                    </div>
                </div>

                {/* Scorecard */}
                <div className="mb-8">
                    <h2 className="font-bold text-fairway-green text-lg mb-4">
                        Scorecard
                    </h2>

                    {/* Front 9 */}
                    <div className="mb-8">
                        <h3 className="font-semibold text-vibrant-green text-md mb-3">
                            Front Nine
                        </h3>
                        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-5 gap-0 bg-cream">
                                <div className="p-3 text-center font-semibold text-xs text-text-dark border-r border-gray-200">
                                    Hole
                                </div>
                                <div className="p-3 text-center font-semibold text-xs text-text-dark border-r border-gray-200">
                                    Par
                                </div>
                                <div className="p-3 text-center font-semibold text-xs text-text-dark border-r border-gray-200">
                                    Score
                                </div>
                                <div className="p-3 text-center font-semibold text-xs text-text-dark border-r border-gray-200">
                                    Putts
                                </div>
                                <div className="p-3 text-center font-semibold text-xs text-text-dark">
                                    +/-
                                </div>
                            </div>

                            {round.holes.slice(0, 9).map((hole) => {
                                const vs_par =
                                    hole.score !== undefined &&
                                    hole.parValue !== undefined
                                        ? hole.score - hole.parValue
                                        : null;
                                return (
                                    <div
                                        key={hole.holeNumber}
                                        className="grid grid-cols-5 gap-0 border-t border-gray-200"
                                    >
                                        <div className="p-3 text-center font-semibold text-text-dark border-r border-gray-200">
                                            {hole.holeNumber}
                                        </div>
                                        <div className="p-3 text-center text-text-dark border-r border-gray-200">
                                            {hole.parValue ?? "—"}
                                        </div>
                                        <div className="p-3 text-center font-semibold text-vibrant-green border-r border-gray-200">
                                            {hole.score ?? "—"}
                                        </div>
                                        <div className="p-3 text-center text-text-dark border-r border-gray-200">
                                            {hole.putts ?? "—"}
                                        </div>
                                        <div className="p-3 text-center font-semibold text-text-dark">
                                            {vs_par !== null
                                                ? vs_par > 0
                                                    ? `+${vs_par}`
                                                    : vs_par === 0
                                                      ? "E"
                                                      : vs_par
                                                : "—"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Back 9 */}
                    <div>
                        <h3 className="font-semibold text-vibrant-green text-md mb-3">
                            Back Nine
                        </h3>
                        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-5 gap-0 bg-cream">
                                <div className="p-3 text-center font-semibold text-xs text-text-dark border-r border-gray-200">
                                    Hole
                                </div>
                                <div className="p-3 text-center font-semibold text-xs text-text-dark border-r border-gray-200">
                                    Par
                                </div>
                                <div className="p-3 text-center font-semibold text-xs text-text-dark border-r border-gray-200">
                                    Score
                                </div>
                                <div className="p-3 text-center font-semibold text-xs text-text-dark border-r border-gray-200">
                                    Putts
                                </div>
                                <div className="p-3 text-center font-semibold text-xs text-text-dark">
                                    +/-
                                </div>
                            </div>

                            {round.holes.slice(9, 18).map((hole) => {
                                const vs_par =
                                    hole.score !== undefined &&
                                    hole.parValue !== undefined
                                        ? hole.score - hole.parValue
                                        : null;
                                return (
                                    <div
                                        key={hole.holeNumber}
                                        className="grid grid-cols-5 gap-0 border-t border-gray-200"
                                    >
                                        <div className="p-3 text-center font-semibold text-text-dark border-r border-gray-200">
                                            {hole.holeNumber}
                                        </div>
                                        <div className="p-3 text-center text-text-dark border-r border-gray-200">
                                            {hole.parValue ?? "—"}
                                        </div>
                                        <div className="p-3 text-center font-semibold text-vibrant-green border-r border-gray-200">
                                            {hole.score ?? "—"}
                                        </div>
                                        <div className="p-3 text-center text-text-dark border-r border-gray-200">
                                            {hole.putts ?? "—"}
                                        </div>
                                        <div className="p-3 text-center font-semibold text-text-dark">
                                            {vs_par !== null
                                                ? vs_par > 0
                                                    ? `+${vs_par}`
                                                    : vs_par === 0
                                                      ? "E"
                                                      : vs_par
                                                : "—"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/round/new"
                        className="inline-block px-6 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors"
                    >
                        Start a New Round
                    </Link>
                </div>
            </div>
        </main>
    );
}
