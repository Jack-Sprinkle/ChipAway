"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRound } from "@/app/context/RoundContext";
import { createRound } from "@/lib/types";
import { saveRound } from "@/lib/db";
import { cacheUrls } from "@/lib/service-worker";

export default function NewRoundPage() {
    const router = useRouter();
    const { setCurrentRound } = useRound();

    const [courseName, setCourseName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle form submission to create and start a round
    const handleStartRound = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!courseName.trim()) {
            setError("Please enter a course name");
            return;
        }

        setIsLoading(true);

        try {
            // Create round with just course name
            // Par values will be entered hole-by-hole during scoring
            const newRound = createRound(courseName.trim());

            // Save to IndexedDB
            await saveRound(newRound);

            // Set in context for scoring
            setCurrentRound(newRound);

            // cache hole 1 while online before going offline
            await cacheUrls([
                [
                    `/round/${newRound.id}/score?hole=1`,
                    {
                        headers: {
                            accept: "text/html",
                        },
                    },
                ],
                "/scores",
            ]);

            // Navigate to scoring page
            router.push(`/round/${newRound.id}/score?hole=1`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create round");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="text-vibrant-green font-semibold hover:underline"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-fairway-green mt-4 mb-2">New Round</h1>
                    <p className="text-text-dark">
                        Enter your course name. You&apos;ll input par, score, and putts for each hole as you go.
                    </p>
                </div>

                {/* Error Message */}
                {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>}

                <form
                    onSubmit={handleStartRound}
                    className="space-y-6"
                >
                    {/* Course Name */}
                    <div>
                        <label
                            htmlFor="courseName"
                            className="block font-semibold text-fairway-green mb-2"
                        >
                            Course Name
                        </label>
                        <input
                            id="courseName"
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="e.g., Pebble Beach Golf Links"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-vibrant-green focus:outline-none transition-colors text-lg"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Starting Round..." : "Start Scoring"}
                    </button>
                </form>
            </div>
        </main>
    );
}
