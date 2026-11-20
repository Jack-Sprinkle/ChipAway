"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRound } from "@/app/(scorecard)/scorecard/context/RoundContext";
import { getRound } from "@/lib/db";
import { GOLF_CLUBS } from "@/lib/types";

export default function ScoringPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Unwrap params promise
    const { id: roundId } = use(params);
    const { currentRound, setCurrentRound, updateHole, saveToDatabase } = useRound();

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
            router.replace(`/scorecard/round/${roundId}/score?hole=1`);
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
                    <button onClick={() => router.push("/")} className="px-4 py-2 bg-vibrant-green text-white rounded-lg hover:bg-fairway-green">
                        Return Home
                    </button>
                </div>
            </main>
        );
    }

    const currentHole = currentRound.holes[currentHoleIndex];
    const isFirstHole = currentHoleNum === 1;
    const isLastHole = currentHoleNum === 18;

    // Calculate running totals for the round
    const runningScore = currentRound.holes.reduce((sum, hole) => {
        if (hole.isComplete) {
            return sum + (hole.score ?? 0);
        }
        return sum;
    }, 0);

    const runningPar = currentRound.holes.reduce((sum, hole) => {
        if (hole.isComplete) {
            return sum + (hole.parValue ?? 0);
        }
        return sum;
    }, 0);

    const scoredHoles = currentRound.holes.filter((hole) => hole.isComplete).length;
    const vsPar = runningScore - runningPar;
    const missedGreen =
        currentHole.parValue !== undefined &&
        currentHole.score !== undefined &&
        currentHole.putts !== undefined &&
        currentHole.score - currentHole.putts > currentHole.parValue - 2;

    // Validate that a hole has all required data before saving
    const isHoleComplete = (hole: typeof currentHole) => {
        return hole.parValue !== undefined && hole.score !== undefined && hole.putts !== undefined;
    };

    // Keep dependent scoring details consistent when par, score, or putts change.
    const updateScoringFields = (holeData: Partial<typeof currentHole>) => {
        const updatedHole = { ...currentHole, ...holeData };
        const isMissedGreen =
            updatedHole.parValue !== undefined &&
            updatedHole.score !== undefined &&
            updatedHole.putts !== undefined &&
            updatedHole.score - updatedHole.putts > updatedHole.parValue - 2;

        updateHole(currentHoleIndex, {
            ...holeData,
            ...(updatedHole.parValue === 3 ? { fairway: undefined } : {}),
            ...(!isMissedGreen ? { girMissDirection: undefined } : {}),
        });
    };

    // Save this hole before moving away so partial scoring details are retained.
    const handlePrevious = async () => {
        if (currentHoleNum > 1) {
            setIsSaving(true);
            setError(null);
            const targetHole = currentHoleNum - 1;
            try {
                await saveToDatabase({
                    holeIndex: currentHoleIndex,
                    holeData: { isComplete: isHoleComplete(currentHole) },
                });
                router.push(`/scorecard/round/${roundId}/score?hole=${targetHole}`);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to save round progress");
            } finally {
                setIsSaving(false);
            }
        }
    };

    // Save the current hole and move to the next one.
    const handleNext = async () => {
        if (!isHoleComplete(currentHole)) {
            setError("Please enter Par, Score, and Putts before moving to the next hole");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await saveToDatabase({
                holeIndex: currentHoleIndex,
                holeData: { isComplete: true },
            });
            router.push(`/scorecard/round/${roundId}/score?hole=${currentHoleNum + 1}`);
            setIsSaving(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save round progress");
            setIsSaving(false);
        }
    };

    // Handle par input change
    const handleParChange = (value: string) => {
        const parValue = parseInt(value, 10);
        if (!isNaN(parValue) && parValue >= 3 && parValue <= 5) {
            updateScoringFields({ parValue });
        }
    };

    // Handle fairway input change
    const handleFairwayChange = (value: string) => {
        if (value === "") {
            updateHole(currentHoleIndex, { fairway: undefined });
        } else if (value === "hit" || value === "left" || value === "right") {
            updateHole(currentHoleIndex, { fairway: value });
        }
    };

    const handleTeeClubChange = (value: string) => {
        if (value === "") {
            updateHole(currentHoleIndex, { teeClub: undefined });
            return;
        }

        const teeClub = GOLF_CLUBS.find((club) => club === value);
        if (teeClub) {
            updateHole(currentHoleIndex, { teeClub });
        }
    };

    const handleGIRMissDirectionChange = (value: string) => {
        if (value === "") {
            updateHole(currentHoleIndex, { girMissDirection: undefined });
        } else if (value === "left" || value === "right" || value === "short" || value === "long") {
            updateHole(currentHoleIndex, { girMissDirection: value });
        }
    };

    const handlePenaltyCountChange = (value: string) => {
        if (value === "") {
            updateHole(currentHoleIndex, { penaltyCount: undefined });
            return;
        }

        const penaltyCount = Number(value);
        if (Number.isInteger(penaltyCount) && penaltyCount >= 0) {
            updateHole(currentHoleIndex, { penaltyCount });
        }
    };

    // Handle score input change
    const handleScoreChange = (value: string) => {
        if (value === "") {
            updateScoringFields({ score: undefined });
            return;
        }
        const score = parseInt(value, 10);
        if (!isNaN(score) && score > 0) {
            updateScoringFields({ score });
        }
    };

    // Handle putts input change
    const handlePuttsChange = (value: string) => {
        if (value === "") {
            updateScoringFields({ putts: undefined });
            return;
        }
        const putts = parseInt(value, 10);
        if (!isNaN(putts) && putts >= 0) {
            updateScoringFields({ putts });
        }
    };

    // Handle complete round at hole 18
    const handleCompleteRound = async () => {
        if (!isHoleComplete(currentHole)) {
            setError("Please enter Par, Score, and Putts before completing the round");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await saveToDatabase({
                holeIndex: currentHoleIndex,
                holeData: { isComplete: true },
            });
            // Navigate to past rounds or home
            router.push("/scorecard/scores");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to complete round");
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-md mx-auto">
                <div className="mb-8 flex justify-between text-sm">
                    <button onClick={() => router.push("/")} className="text-fairway-green hover:text-vibrant-green font-medium transition-colors">
                        ← Home
                    </button>
                    <button
                        onClick={() => router.push("/scorecard/scores")}
                        className="text-fairway-green hover:text-vibrant-green font-medium transition-colors"
                    >
                        View Scores
                    </button>
                </div>
                <div className="mb-8 text-center">
                    <p className="text-text-dark mb-1">{currentRound.courseName}</p>
                    <h1 className="text-4xl font-bold text-fairway-green mb-2">Hole {currentHoleNum}</h1>
                    <p className="text-text-dark text-sm">{currentHoleNum} of 18</p>
                </div>
                {scoredHoles > 0 && (
                    <div className="mb-8 p-6 bg-fairway-green text-white rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs font-semibold opacity-90 mb-1">SCORE</p>
                                <p className="text-5xl font-bold">{runningScore}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-5xl font-bold ${vsPar > 0 ? "text-red-300" : vsPar < 0 ? "text-green-300" : "text-white"}`}>
                                    {vsPar > 0 ? "+" : ""}
                                    {vsPar === 0 ? "E" : vsPar}
                                </p>
                                <p className="text-xs font-semibold opacity-90 mt-2">THRU {scoredHoles}</p>
                            </div>
                        </div>
                    </div>
                )}
                {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">{error}</div>}
                <form className="space-y-6 mb-8">
                    <div>
                        <label htmlFor="par" className="block font-semibold text-fairway-green mb-2">
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
                    <div>
                        <label htmlFor="teeClub" className="block font-semibold text-fairway-green mb-2">
                            Tee Club
                        </label>
                        <select
                            id="teeClub"
                            value={currentHole.teeClub ?? ""}
                            onChange={(e) => handleTeeClubChange(e.target.value)}
                            disabled={isSaving}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-vibrant-green focus:outline-none transition-colors"
                        >
                            <option value="">Select club</option>
                            {GOLF_CLUBS.map((club) => (
                                <option key={club} value={club}>
                                    {club}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="score" className="block font-semibold text-fairway-green mb-2">
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
                    <div>
                        <label htmlFor="putts" className="block font-semibold text-fairway-green mb-2">
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
                    {currentHole.parValue === 4 || currentHole.parValue === 5 ? (
                        <div>
                            <label htmlFor="fairway" className="block font-semibold text-fairway-green mb-2">
                                Fairway
                            </label>
                            <select
                                id="fairway"
                                value={currentHole.fairway ?? ""}
                                onChange={(e) => handleFairwayChange(e.target.value)}
                                disabled={isSaving}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-vibrant-green focus:outline-none transition-colors"
                            >
                                <option value="">Not recorded</option>
                                <option value="hit">Hit</option>
                                <option value="left">Missed left</option>
                                <option value="right">Missed right</option>
                            </select>
                        </div>
                    ) : null}
                    {missedGreen ? (
                        <div>
                            <label htmlFor="girMissDirection" className="block font-semibold text-fairway-green mb-2">
                                Green miss direction
                            </label>
                            <select
                                id="girMissDirection"
                                value={currentHole.girMissDirection ?? ""}
                                onChange={(e) => handleGIRMissDirectionChange(e.target.value)}
                                disabled={isSaving}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-vibrant-green focus:outline-none transition-colors"
                            >
                                <option value="">Not recorded</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                                <option value="short">Short</option>
                                <option value="long">Long</option>
                            </select>
                        </div>
                    ) : null}
                    <div>
                        <label htmlFor="penaltyCount" className="block font-semibold text-fairway-green mb-2">
                            Penalties
                        </label>
                        <input
                            id="penaltyCount"
                            type="number"
                            value={currentHole.penaltyCount ?? ""}
                            onChange={(e) => handlePenaltyCountChange(e.target.value)}
                            placeholder="0"
                            disabled={isSaving}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-vibrant-green focus:outline-none transition-colors"
                            min={0}
                            step={1}
                        />
                    </div>
                </form>
                <div className="space-y-3">
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
                            onClick={() => void handleNext()}
                            disabled={isLastHole || isSaving || !isHoleComplete(currentHole)}
                            className="flex-1 px-4 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>

                    {isLastHole && (
                        <button
                            type="button"
                            onClick={handleCompleteRound}
                            disabled={isSaving || !isHoleComplete(currentHole)}
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
