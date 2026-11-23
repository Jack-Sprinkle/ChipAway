"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRound } from "@/app/(toolkit)/toolkit/context/RoundContext";
import { getRound, getYardageBookHoleNote, saveYardageBookHoleNote } from "@/lib/db";
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
    const [yardageNote, setYardageNote] = useState("");
    const [savedYardageNote, setSavedYardageNote] = useState("");
    const [yardageNoteUpdatedAt, setYardageNoteUpdatedAt] = useState<number | undefined>();
    const [isLoadingYardageNote, setIsLoadingYardageNote] = useState(true);
    const [isSavingYardageNote, setIsSavingYardageNote] = useState(false);
    const [yardageNoteError, setYardageNoteError] = useState<string | null>(null);
    const [yardageNoteLoadError, setYardageNoteLoadError] = useState<string | null>(null);
    const [yardageNoteStatus, setYardageNoteStatus] = useState<string | null>(null);
    const [yardageNoteReloadKey, setYardageNoteReloadKey] = useState(0);

    const yardageCourseName = currentRound?.id === roundId ? currentRound.courseName : null;

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
            router.replace(`/toolkit/round/${roundId}/score?hole=1`);
        }
    }, [holeParam, roundId, router]);

    useEffect(() => {
        if (!yardageCourseName) {
            setIsLoadingYardageNote(false);
            return;
        }

        const courseName = yardageCourseName;
        let isCurrent = true;
        setIsLoadingYardageNote(true);
        setYardageNoteError(null);
        setYardageNoteLoadError(null);
        setYardageNoteStatus(null);
        setYardageNote("");
        setSavedYardageNote("");
        setYardageNoteUpdatedAt(undefined);

        async function loadYardageNote() {
            try {
                const holeNote = await getYardageBookHoleNote(courseName, currentHoleNum);
                if (!isCurrent) return;
                const savedNote = holeNote?.note ?? "";
                setYardageNote(savedNote);
                setSavedYardageNote(savedNote);
                setYardageNoteUpdatedAt(holeNote?.updatedAt);
            } catch (yardageError) {
                console.error(yardageError);
                if (isCurrent) {
                    const message = "Could not load this course's yardage-book note.";
                    setYardageNoteError(message);
                    setYardageNoteLoadError(message);
                }
            } finally {
                if (isCurrent) setIsLoadingYardageNote(false);
            }
        }

        void loadYardageNote();
        return () => {
            isCurrent = false;
        };
    }, [yardageCourseName, currentHoleNum, yardageNoteReloadKey]);

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
                router.push(`/toolkit/round/${roundId}/score?hole=${targetHole}`);
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
            router.push(`/toolkit/round/${roundId}/score?hole=${currentHoleNum + 1}`);
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
        } else if (value === "hit" || value === "left" || value === "right" || value === "bunker") {
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
        } else if (value === "left" || value === "right" || value === "short" || value === "long" || value === "bunker") {
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

    const handleYardageNoteChange = (value: string) => {
        setYardageNote(value);
        setYardageNoteError(null);
        setYardageNoteStatus(null);
    };

    const handleSaveYardageNote = async () => {
        if (!yardageCourseName || yardageNote === savedYardageNote) return;

        setIsSavingYardageNote(true);
        setYardageNoteError(null);
        setYardageNoteStatus(null);

        try {
            const updatedBook = await saveYardageBookHoleNote(yardageCourseName, currentHoleNum, yardageNote);
            const updatedHoleNote = updatedBook.holes.find((hole) => hole.holeNumber === currentHoleNum);
            setSavedYardageNote(updatedHoleNote?.note ?? yardageNote);
            setYardageNoteUpdatedAt(updatedHoleNote?.updatedAt);
            setYardageNoteStatus("Saved to this course's yardage book.");
        } catch (yardageError) {
            console.error(yardageError);
            setYardageNoteError(yardageError instanceof Error ? yardageError.message : "Could not save this yardage-book note.");
        } finally {
            setIsSavingYardageNote(false);
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
            router.push(`/toolkit/round/${roundId}/review`);
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
                        onClick={() => router.push("/toolkit/scores")}
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
                {savedYardageNote && (
                    <aside className="mb-6 rounded-xl border border-light-sand bg-cream p-4" aria-label={`Saved course note for hole ${currentHoleNum}`}>
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="font-semibold text-fairway-green">Saved course note</h2>
                            <a href="#yardage-note-section" className="shrink-0 text-sm font-semibold text-vibrant-green underline">
                                Edit note
                            </a>
                        </div>
                        <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-text-dark">{savedYardageNote}</p>
                    </aside>
                )}
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
                    <fieldset disabled={isSaving}>
                        <legend className="block font-semibold text-fairway-green mb-2">Par</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {[3, 4, 5].map((par) => (
                                <label key={par} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="par"
                                        value={par}
                                        checked={currentHole.parValue === par}
                                        onChange={(event) => handleParChange(event.target.value)}
                                        className="peer sr-only"
                                    />
                                    <span className="flex min-h-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-2xl font-bold text-fairway-green transition-colors peer-checked:border-vibrant-green peer-checked:bg-vibrant-green peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-vibrant-green">
                                        {par}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
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
                        <fieldset disabled={isSaving}>
                            <legend className="block font-semibold text-fairway-green mb-2">Fairway</legend>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: "hit", label: "Hit" },
                                    { value: "left", label: "Missed left" },
                                    { value: "right", label: "Missed right" },
                                    { value: "bunker", label: "Fairway bunker" },
                                ].map((option) => (
                                    <label key={option.value} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="fairway"
                                            value={option.value}
                                            checked={currentHole.fairway === option.value}
                                            onChange={(event) => handleFairwayChange(event.target.value)}
                                            className="peer sr-only"
                                        />
                                        <span className="flex min-h-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-2 text-center text-sm font-semibold text-fairway-green transition-colors peer-checked:border-vibrant-green peer-checked:bg-vibrant-green peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-vibrant-green">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    ) : null}
                    {missedGreen ? (
                        <fieldset disabled={isSaving}>
                            <legend className="block font-semibold text-fairway-green mb-2">Green miss direction</legend>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: "left", label: "Left" },
                                    { value: "right", label: "Right" },
                                    { value: "short", label: "Short" },
                                    { value: "long", label: "Long" },
                                    { value: "bunker", label: "Greenside bunker" },
                                ].map((option) => (
                                    <label key={option.value} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="girMissDirection"
                                            value={option.value}
                                            checked={currentHole.girMissDirection === option.value}
                                            onChange={(event) => handleGIRMissDirectionChange(event.target.value)}
                                            className="peer sr-only"
                                        />
                                        <span className="flex min-h-12 items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-2 text-center text-sm font-semibold text-fairway-green transition-colors peer-checked:border-vibrant-green peer-checked:bg-vibrant-green peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-vibrant-green">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
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
                <section
                    id="yardage-note-section"
                    className="mb-8 scroll-mt-4 rounded-xl border border-light-sand bg-cream p-5"
                    aria-labelledby="yardage-note-heading"
                >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h2 id="yardage-note-heading" className="font-semibold text-fairway-green">
                                Course note · Hole {currentHoleNum}
                            </h2>
                            <p className="mt-1 text-sm text-text-dark">
                                {isLoadingYardageNote
                                    ? "Loading saved course note..."
                                    : savedYardageNote
                                      ? `Saved yardage-book note for ${currentRound.courseName}.`
                                      : `No saved yardage-book note for this hole at ${currentRound.courseName} yet.`}
                            </p>
                        </div>
                        <Link href="/toolkit/yardage-books" className="text-sm font-semibold text-vibrant-green underline">
                            All yardage books
                        </Link>
                    </div>
                    <label htmlFor="yardageNote" className="sr-only">
                        Yardage-book note for hole {currentHoleNum}
                    </label>
                    <textarea
                        id="yardageNote"
                        rows={3}
                        value={yardageNote}
                        onChange={(event) => handleYardageNoteChange(event.target.value)}
                        placeholder="Add a note about this hole..."
                        disabled={isLoadingYardageNote || yardageNoteLoadError !== null || isSavingYardageNote}
                        className="mt-4 w-full resize-y rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-text-dark focus:border-vibrant-green focus:outline-none disabled:bg-gray-100"
                    />
                    {yardageNoteUpdatedAt !== undefined && savedYardageNote && (
                        <p className="mt-2 text-xs text-text-dark/70">
                            Last updated {new Date(yardageNoteUpdatedAt).toLocaleString()}
                        </p>
                    )}
                    {yardageNoteError && (
                        <p role="alert" className="mt-3 text-sm text-red-700">
                            {yardageNoteError}
                        </p>
                    )}
                    {yardageNoteLoadError && (
                    <button
                        type="button"
                        onClick={() => setYardageNoteReloadKey((key) => key + 1)}
                        className="mt-3 text-sm font-semibold text-vibrant-green underline"
                    >
                        Retry loading note
                    </button>
                    )}
                    {yardageNoteStatus && (
                        <p role="status" className="mt-3 text-sm text-green-800">
                            {yardageNoteStatus}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={() => void handleSaveYardageNote()}
                        disabled={
                            isLoadingYardageNote ||
                            yardageNoteLoadError !== null ||
                            isSavingYardageNote ||
                            yardageNote === savedYardageNote
                        }
                        className="mt-4 rounded-lg bg-vibrant-green px-5 py-3 font-semibold text-white transition-colors hover:bg-fairway-green disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSavingYardageNote ? "Saving note..." : "Save course note"}
                    </button>
                </section>
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={isFirstHole || isSaving || isSavingYardageNote}
                            className="flex-1 px-4 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleNext()}
                            disabled={isLastHole || isSaving || isSavingYardageNote || !isHoleComplete(currentHole)}
                            className="flex-1 px-4 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>

                    {isLastHole && (
                        <button
                            type="button"
                            onClick={handleCompleteRound}
                            disabled={isSaving || isSavingYardageNote || !isHoleComplete(currentHole)}
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
