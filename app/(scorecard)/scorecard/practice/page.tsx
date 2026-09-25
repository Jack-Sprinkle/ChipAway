"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getActivePracticeSession, savePracticeSession } from "@/lib/db";
import type { PracticeContact, PracticeDirection, PracticeSession } from "@/lib/types";

const clubs = ["Driver", "3 Wood", "5 Wood", "Hybrid", "4 Iron", "5 Iron", "6 Iron", "7 Iron", "8 Iron", "9 Iron", "Pitching Wedge", "Gap Wedge", "Sand Wedge", "Lob Wedge", "Putter"];
const contacts: { value: PracticeContact; label: string }[] = [
    { value: "fat", label: "Fat" },
    { value: "thin", label: "Thin" },
    { value: "good", label: "Good" },
];
const directions: { value: PracticeDirection; label: string }[] = [
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "straight", label: "Straight" },
];

export default function PracticePage() {
    const [session, setSession] = useState<PracticeSession | null>(null);
    const [club, setClub] = useState(clubs[0]);
    const [contact, setContact] = useState<PracticeContact>("good");
    const [startDirection, setStartDirection] = useState<PracticeDirection>("straight");
    const [curve, setCurve] = useState<PracticeDirection>("straight");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadSession = useCallback(async () => {
        try {
            const activeSession = await getActivePracticeSession();
            setSession(activeSession ?? null);
        } catch (err) {
            console.error(err);
            setError("Could not load your practice session from this device.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSession();
    }, [loadSession]);

    async function startSession() {
        setError(null);
        setIsSaving(true);
        const newSession: PracticeSession = { id: crypto.randomUUID(), startedAt: Date.now(), shots: [] };
        try {
            await savePracticeSession(newSession);
            setSession(newSession);
        } catch (err) {
            console.error(err);
            setError("Could not start a practice session. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    async function logShot() {
        if (!session) return;
        setError(null);
        setIsSaving(true);
        const updated: PracticeSession = {
            ...session,
            shots: [...session.shots, { id: crypto.randomUUID(), club, contact, startDirection, curve, recordedAt: Date.now() }],
        };
        try {
            await savePracticeSession(updated);
            setSession(updated);
        } catch (err) {
            console.error(err);
            setError("Could not save that shot. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    async function endSession() {
        if (!session) return;
        setError(null);
        setIsSaving(true);
        const completed: PracticeSession = { ...session, endedAt: Date.now() };
        try {
            await savePracticeSession(completed);
            setSession(null);
        } catch (err) {
            console.error(err);
            setError("Could not end the practice session. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return <main className="min-h-screen bg-white px-6 py-12 text-center text-text-dark">Loading practice...</main>;
    }

    return (
        <main className="min-h-screen bg-white px-6 py-12">
            <div className="mx-auto max-w-xl">
                <Link href="/scorecard" className="font-semibold text-vibrant-green hover:underline">← Back to Scorecard</Link>
                <h1 className="mt-4 text-4xl font-bold text-fairway-green">Practice</h1>
                <p className="mt-2 text-text-dark">Record your shot misses as you practice. Your data stays on this device.</p>

                {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error}</p>}

                {!session ? (
                    <section className="mt-8 rounded-2xl border border-light-sand bg-cream p-6">
                        <h2 className="text-xl font-semibold text-fairway-green">Ready to practice?</h2>
                        <p className="mt-2 text-sm text-text-dark">Start a session, then choose a club and log misses. You can switch clubs at any time.</p>
                        <button type="button" onClick={() => void startSession()} disabled={isSaving} className="mt-5 w-full rounded-lg bg-vibrant-green px-5 py-3 font-semibold text-white transition-colors hover:bg-fairway-green disabled:opacity-60">
                            {isSaving ? "Starting..." : "Start Practice Session"}
                        </button>
                    </section>
                ) : (
                    <>
                        <section className="mt-8 rounded-2xl border border-light-sand bg-cream p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-fairway-green">Session in progress</h2>
                                    <p className="mt-1 text-sm text-text-dark">Started {new Date(session.startedAt).toLocaleString()}</p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-fairway-green">{session.shots.length} logged</span>
                            </div>
                            <label htmlFor="practice-club" className="mt-6 block font-semibold text-fairway-green">Club</label>
                            <select id="practice-club" value={club} onChange={(event) => setClub(event.target.value)} disabled={isSaving} className="mt-2 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-vibrant-green focus:outline-none">
                                {clubs.map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                            <h3 className="mt-6 font-semibold text-fairway-green">Shot details</h3>
                            <ChoiceGroup label="Contact" value={contact} choices={contacts} onChange={setContact} />
                            <ChoiceGroup label="Start direction" value={startDirection} choices={directions} onChange={setStartDirection} />
                            <ChoiceGroup label="Curve" value={curve} choices={directions} onChange={setCurve} />
                            <button type="button" onClick={() => void logShot()} disabled={isSaving} className="mt-6 w-full rounded-lg bg-vibrant-green px-5 py-3 font-semibold text-white transition-colors hover:bg-fairway-green disabled:opacity-60">
                                {isSaving ? "Saving..." : "Log Shot"}
                            </button>
                            <button type="button" onClick={() => void endSession()} disabled={isSaving} className="mt-6 w-full rounded-lg border border-fairway-green px-5 py-3 font-semibold text-fairway-green hover:bg-white disabled:opacity-60">
                                End Session
                            </button>
                        </section>
                        {session.shots.length > 0 && (
                            <section className="mt-6 rounded-2xl border border-light-sand p-6">
                                <h2 className="font-semibold text-fairway-green">Recent shots</h2>
                                <ul className="mt-3 divide-y divide-light-sand">
                                    {[...session.shots].reverse().slice(0, 10).map((shot) => (
                                        <li key={shot.id} className="flex justify-between gap-4 py-3 text-sm">
                                            <span className="font-medium text-text-dark">{shot.club} · {shot.contact} contact, {shot.startDirection} start, {shot.curve} curve</span>
                                            <time className="text-text-dark/70">{new Date(shot.recordedAt).toLocaleTimeString()}</time>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

function ChoiceGroup<T extends string>({
    label,
    value,
    choices,
    onChange,
}: {
    label: string;
    value: T;
    choices: { value: T; label: string }[];
    onChange: (value: T) => void;
}) {
    return (
        <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-fairway-green">{label}</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
                {choices.map((choice) => {
                    const selected = value === choice.value;
                    return (
                        <button
                            key={choice.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onChange(choice.value)}
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${selected ? "border-vibrant-green bg-vibrant-green text-white" : "border-gray-300 bg-white text-fairway-green hover:border-vibrant-green"}`}
                        >
                            {choice.label}
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}
