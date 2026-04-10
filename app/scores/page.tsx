"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllRounds } from "@/lib/db";
import type { Round } from "@/lib/types";
import { getRoundTotals } from "@/lib/types";

export default function ScoresPage() {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Load all rounds from IndexedDB on mount
     */
    useEffect(() => {
        const loadRounds = async () => {
            try {
                const allRounds = await getAllRounds();
                // Sort by date, newest first
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
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-fairway-green mb-2">
                        Past Rounds
                    </h1>
                    <p className="text-text-dark text-sm">
                        {rounds.length} round(s) recorded
                    </p>
                </div>

                {/* Empty State */}
                {rounds.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-dark mb-6">
                            No rounds recorded yet
                        </p>
                        <Link
                            href="/round/new"
                            className="inline-block px-6 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors"
                        >
                            Start a New Round
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rounds.map((round) => {
                            const { totalScore, front9Score, back9Score } =
                                getRoundTotals(round);
                            const roundDate = new Date(round.date);
                            const formattedDate = roundDate.toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                },
                            );

                            return (
                                <Link
                                    key={round.id}
                                    href={`/round/${round.id}/view`}
                                    className="block p-6 border-2 border-gray-200 rounded-lg hover:border-vibrant-green hover:bg-cream transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h2 className="font-bold text-fairway-green text-lg">
                                                {round.courseName}
                                            </h2>
                                            <p className="text-text-dark text-sm">
                                                {formattedDate}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-4xl font-bold text-vibrant-green">
                                                {totalScore}
                                            </p>
                                            <p className="text-text-dark text-xs">
                                                Total Score
                                            </p>
                                        </div>
                                    </div>

                                    {/* Front 9 / Back 9 Split */}
                                    <div className="flex justify-between pt-4 border-t border-gray-200 text-sm text-text-dark">
                                        <div>
                                            <span className="font-semibold">
                                                Front 9:
                                            </span>{" "}
                                            {front9Score}
                                        </div>
                                        <div>
                                            <span className="font-semibold">
                                                Back 9:
                                            </span>{" "}
                                            {back9Score}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="mt-2">
                                        <span
                                            className={`inline-block text-xs px-2 py-1 rounded font-semibold ${
                                                round.completed
                                                    ? "bg-vibrant-green text-white"
                                                    : "bg-warm-gold text-text-dark"
                                            }`}
                                        >
                                            {round.completed
                                                ? "Completed"
                                                : "In Progress"}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* CTA Button */}
                <div className="mt-12 text-center">
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
