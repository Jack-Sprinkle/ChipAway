"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRound } from "@/app/context/RoundContext";
import { getRound } from "@/lib/db";

export default function ScoringPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Unwrap params promise
    const { id: roundId } = use(params);
    const { currentRound, setCurrentRound, updateHole, saveToDatabase, completeAndSave } = useRound();

    const holeParam = parseInt(searchParams.get("hole") || "1", 10);
    const currentHoleNum = Number.isNaN(holeParam) || holeParam < 1 || holeParam > 18 ? 1 : holeParam;
    const currentHoleIndex = currentHoleNum - 1;

    const [isLoading, setIsLoading] = useState(!currentRound || currentRound.id !== roundId);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load round from IndexedDB if not in context
    // This handles page refresh or direct URL access
    useEffect(() => {
        if (!currentRound || currentRound.id !== roundId) {
            setIsLoading(true);
            const loadRound = async () => {
                try {
                    const round = await getRound(roundId);
                    if (!round) {
                        setError("Round not found");
                        router.push("/");
                        return;
                    }
                    setCurrentRound(round);
                } catch (err) {
                    setError("Failed to load round");
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };

            loadRound();
        } else {
            setIsLoading(false);
        }
    }, [roundId, currentRound, setCurrentRound, router]);

    useEffect(() => {
        if (Number.isNaN(holeParam) || holeParam < 1 || holeParam > 18) {
            router.replace(`/round/${roundId}/score?hole=1`);
        }
    }, [holeParam, roundId, router]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-text-dark">Loading round...</p>
            </main>
        );
    }

    if (!currentRound || error) {
        return (
            <main className="min-h-screen bg-white py-12 px-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-700 font-semibold mb-4">{error || "Round not found"}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-vibrant-green text-white rounded-lg hover:bg-fairway-green"
                    >
                        Return Home
                    </button>
                </div>
            </main>
        );
    }

    const currentHole = currentRound.holes[currentHoleIndex];
    const isFirstHole = currentHoleNum === 1;
    const isLastHole = currentHoleNum === 18;
    const isFront9Save = currentHoleNum === 9;
    const isBack9Save = currentHoleNum === 18;

    // Calculate running totals for the round
    const runningScore = currentRound.holes.reduce((sum, hole) => sum + (hole.score ?? 0), 0);
    const runningPar = currentRound.holes.reduce((sum, hole) => sum + (hole.parValue ?? 0), 0);
    const scoredHoles = currentRound.holes.filter(
        (hole) => hole.score !== undefined && hole.parValue !== undefined,
    ).length;
    const vsPar = runningScore - runningPar;

    // Handle general hole navigation
    // Separate it from buttons, ensure we're saving to database each time in case of updates
    const navigateToHole = async (targetHole: number) => {
        setIsSaving(true);
        setError(null);

        try {
            await saveToDatabase();
            router.push(`/round/${roundId}/score?hole=${targetHole}`);
            setIsSaving(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save round progress");
            setIsSaving(false);
        }
    };

    // Handle back hole button click
    const handlePrevious = () => {
        if (currentHoleNum > 1) {
            void navigateToHole(currentHoleNum - 1);
        }
    };

    // Handle next hole button click
    const handleNext = () => {
        if (currentHoleNum < 18) {
            void navigateToHole(currentHoleNum + 1);
        }
    };

    // Handle par input change
    const handleParChange = (value: string) => {
        const parValue = parseInt(value, 10);
        if (!isNaN(parValue) && parValue >= 3 && parValue <= 5) {
            updateHole(currentHoleIndex, { parValue });
        }
    };

    // Handle score input change
    const handleScoreChange = (value: string) => {
        if (value === "") {
            updateHole(currentHoleIndex, { score: undefined });
            return;
        }
        const score = parseInt(value, 10);
        if (!isNaN(score) && score > 0) {
            updateHole(currentHoleIndex, { score });
        }
    };

    // Handle putts input change
    const handlePuttsChange = (value: string) => {
        if (value === "") {
            updateHole(currentHoleIndex, { putts: undefined });
            return;
        }
        const putts = parseInt(value, 10);
        if (!isNaN(putts) && putts >= 0) {
            updateHole(currentHoleIndex, { putts });
        }
    };

    // Handle save at hole 9
    const handleSaveFront9 = async () => {
        setIsSaving(true);
        setError(null);

        try {
            await saveToDatabase();
            // Continue to hole 10
            router.push(`/round/${roundId}/score?hole=10`);
            setIsSaving(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save");
            setIsSaving(false);
        }
    };

    // Handle complete round at hole 18
    const handleCompleteRound = async () => {
        setIsSaving(true);
        setError(null);

        try {
            // Save all 18 holes first (context state)
            await saveToDatabase();
            // Then mark as complete
            await completeAndSave();
            // Navigate to past rounds or home
            router.push("/scores");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to complete round");
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <p className="text-text-dark mb-1">{currentRound.courseName}</p>
                    <h1 className="text-4xl font-bold text-fairway-green mb-2">Hole {currentHoleNum}</h1>
                    <p className="text-text-dark text-sm">{currentHoleNum} of 18</p>
                </div>

                {/* Running Score Stats - Leaderboard Style */}
                {scoredHoles > 0 && (
                    <div className="mb-8 p-6 bg-fairway-green text-white rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs font-semibold opacity-90 mb-1">SCORE</p>
                                <p className="text-5xl font-bold">{runningScore}</p>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`text-5xl font-bold ${
                                        vsPar > 0 ? "text-red-300" : vsPar < 0 ? "text-green-300" : "text-white"
                                    }`}
                                >
                                    {vsPar > 0 ? "+" : ""}
                                    {vsPar === 0 ? "E" : vsPar}
                                </p>
                                <p className="text-xs font-semibold opacity-90 mt-2">THRU {currentHoleNum}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{error}</div>
                )}

                {/* Input Form */}
                <form className="space-y-6 mb-8">
                    {/* Par Input */}
                    <div>
                        <label
                            htmlFor="par"
                            className="block font-semibold text-fairway-green mb-2"
                        >
                            Par
                        </label>
                        <select
                            id="par"
                            value={currentHole.parValue ?? ""}
                            onChange={(e) => handleParChange(e.target.value)}
                            disabled={isSaving}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl text-center font-bold focus:border-vibrant-green focus:outline-none transition-colors"
                        >
                            <option value="">--</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>

                    {/* Score Input */}
                    <div>
                        <label
                            htmlFor="score"
                            className="block font-semibold text-fairway-green mb-2"
                        >
                            Score
                        </label>
                        <input
                            id="score"
                            type="number"
                            value={currentHole.score ?? ""}
                            onChange={(e) => handleScoreChange(e.target.value)}
                            placeholder="Enter score"
                            disabled={isSaving}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl text-center font-bold focus:border-vibrant-green focus:outline-none transition-colors"
                            min={1}
                        />
                    </div>

                    {/* Putts Input */}
                    <div>
                        <label
                            htmlFor="putts"
                            className="block font-semibold text-fairway-green mb-2"
                        >
                            Putts
                        </label>
                        <input
                            id="putts"
                            type="number"
                            value={currentHole.putts ?? ""}
                            onChange={(e) => handlePuttsChange(e.target.value)}
                            placeholder="Enter putts"
                            disabled={isSaving}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl text-center font-bold focus:border-vibrant-green focus:outline-none transition-colors"
                            min={0}
                        />
                    </div>
                </form>

                {/* Navigation & Save Buttons */}
                <div className="space-y-3">
                    {/* Previous/Next Row */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={isFirstHole || isSaving}
                            className="flex-1 px-4 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isLastHole || isSaving}
                            className="flex-1 px-4 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Save/Complete Button */}
                    {isFront9Save && (
                        <button
                            type="button"
                            onClick={handleSaveFront9}
                            disabled={isSaving}
                            className="w-full px-4 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Saving..." : "Save Front 9"}
                        </button>
                    )}

                    {isBack9Save && (
                        <button
                            type="button"
                            onClick={handleCompleteRound}
                            disabled={isSaving}
                            className="w-full px-4 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Completing..." : "Complete Round"}
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
