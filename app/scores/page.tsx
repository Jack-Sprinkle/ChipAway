"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllRounds, deleteRound } from "@/lib/db";
import type { Round } from "@/lib/types";
import { getRoundTotals } from "@/lib/types";

export default function ScoresPage() {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingRoundId, setDeletingRoundId] = useState<string | null>(null);

    // Load all rounds from IndexedDB on mount
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

    const handleDeleteRound = async (roundId: string) => {
        const shouldDelete = window.confirm("Delete this round? This action cannot be undone.");

        if (!shouldDelete) {
            return;
        }

        setDeletingRoundId(roundId);
        setError(null);
        try {
            await deleteRound(roundId);
            setRounds((currentRounds) => currentRounds.filter((round) => round.id !== roundId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete round");
        } finally {
            setDeletingRoundId(null);
        }
    };

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
                    <Link href="/" className="px-4 py-2 bg-vibrant-green text-white rounded-lg hover:bg-fairway-green">
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
                    <h1 className="text-3xl font-bold text-fairway-green mb-2">Past Rounds</h1>
                    <p className="text-text-dark text-sm">{rounds.length} round(s) recorded</p>
                </div>

                {/* Empty State */}
                {rounds.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-dark mb-6">No rounds recorded yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rounds.map((round) => {
                            const { totalScore, front9Score, back9Score, totalPar } = getRoundTotals(round);
                            const roundDate = new Date(round.date);
                            const formattedDate = roundDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            });
                            const vsPar = totalScore - totalPar;

                            return (
                                <div
                                    key={round.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-fairway-green">{round.courseName}</h2>
                                            <p className="text-sm text-text-dark">{formattedDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="mb-2 flex items-baseline justify-end gap-3">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.2em] text-text-dark font-semibold">
                                                        Score
                                                    </p>
                                                    <p className="text-3xl font-bold text-vibrant-green">
                                                        {totalScore}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.2em] text-text-dark font-semibold">
                                                        Par
                                                    </p>
                                                    <p className="text-3xl font-bold text-fairway-green">{totalPar}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.2em] text-text-dark font-semibold">
                                                        +/-
                                                    </p>
                                                    <p
                                                        className={`text-3xl font-bold ${
                                                            vsPar > 0
                                                                ? "text-red-600"
                                                                : vsPar < 0
                                                                  ? "text-green-600"
                                                                  : "text-fairway-green"
                                                        }`}
                                                    >
                                                        {vsPar > 0 ? "+" : ""}
                                                        {vsPar === 0 ? "E" : vsPar}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Front 9 / Back 9 Split */}
                                    <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 text-sm text-text-dark">
                                        <div className="rounded-xl bg-light-sand px-4 py-3">
                                            <span className="font-semibold text-fairway-green">Front 9:</span>{" "}
                                            {front9Score}
                                        </div>
                                        <div className="rounded-xl bg-light-sand px-4 py-3">
                                            <span className="font-semibold text-fairway-green">Back 9:</span>{" "}
                                            {back9Score}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                round.completed
                                                    ? "bg-vibrant-green text-white"
                                                    : "bg-warm-gold text-text-dark"
                                            }`}
                                        >
                                            {round.completed ? "Completed" : "In Progress"}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/round/${round.id}/view`}
                                                className="inline-flex items-center rounded-full border border-fairway-green px-3 py-2 text-sm font-semibold text-fairway-green transition-colors hover:bg-fairway-green hover:text-white"
                                            >
                                                View Round
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => void handleDeleteRound(round.id)}
                                                disabled={deletingRoundId === round.id}
                                                aria-label={`Delete round at ${round.courseName} from ${formattedDate}`}
                                                className="inline-flex items-center rounded-full bg-muted-red px-3 py-2 text-sm font-semibold text-text-light transition-colors hover:bg-muted-red-hover disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {deletingRoundId === round.id ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
