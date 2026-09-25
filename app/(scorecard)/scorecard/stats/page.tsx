"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPracticeSessions, getAllRounds } from "@/lib/db";
import { calculateHandicap, calculateScoringStats, getPerformanceTone } from "@/lib/utils";
import { PracticeDirection, PracticeSession, PracticeShot, Round } from "@/lib/types";

const contactOptions = ["fat", "thin", "good"] as const;
const directionOptions: PracticeDirection[] = ["left", "straight", "right"];

function getBreakdown<T extends string>(values: T[], options: readonly T[]) {
    return options.map((value) => {
        const count = values.filter((entry) => entry === value).length;
        return { value, count, percentage: values.length === 0 ? 0 : (count / values.length) * 100 };
    });
}

function CategoryBreakdown<T extends string>({ title, values, options }: { title: string; values: T[]; options: readonly T[] }) {
    return (
        <div>
            <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
            <ul className="mt-2 space-y-2">
                {getBreakdown(values, options).map(({ value, count, percentage }) => (
                    <li key={value} className="flex items-center justify-between gap-3 text-sm">
                        <span className="capitalize text-slate-600">{value}</span>
                        <span className="whitespace-nowrap font-medium text-slate-800">{count} ({percentage.toFixed(0)}%)</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function OverallTendencies({ shots }: { shots: PracticeShot[] }) {
    const tendencies = [
        { title: "Most common contact", ...getBreakdown(shots.map((shot) => shot.contact), contactOptions).sort((a, b) => b.count - a.count)[0] },
        { title: "Most common start", ...getBreakdown(shots.map((shot) => shot.startDirection), directionOptions).sort((a, b) => b.count - a.count)[0] },
        { title: "Most common curve", ...getBreakdown(shots.map((shot) => shot.curve), directionOptions).sort((a, b) => b.count - a.count)[0] },
    ];

    return (
        <div className="rounded-xl border border-vibrant-green/20 bg-cream p-4">
            <div className="mb-3">
                <h3 className="font-semibold text-fairway-green">Overall tendencies</h3>
                <p className="text-xs text-slate-600">Most common result in each category across all clubs</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
                {tendencies.map(({ title, value, count, percentage }) => (
                    <div key={title} className="rounded-lg bg-white p-3">
                        <p className="text-xs font-medium text-slate-500">{title}</p>
                        <p className="mt-1 text-lg font-semibold capitalize text-slate-900">{value}</p>
                        <p className="text-sm text-slate-600">{count} of {shots.length} ({percentage.toFixed(0)}%)</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PracticeStats({ sessions }: { sessions: PracticeSession[] }) {
    const shotsByClub = new Map<string, PracticeSession["shots"]>();
    for (const session of sessions) {
        for (const shot of session.shots) {
            const clubShots = shotsByClub.get(shot.club) ?? [];
            clubShots.push(shot);
            shotsByClub.set(shot.club, clubShots);
        }
    }
    const clubs = [...shotsByClub.entries()].sort(([clubA], [clubB]) => clubA.localeCompare(clubB));
    const shotCount = clubs.reduce((total, [, shots]) => total + shots.length, 0);
    const allShots = clubs.flatMap(([, shots]) => shots);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span>
                        <span className="block text-2xl font-bold text-fairway-green">Practice Stats</span>
                        <span className="mt-1 block text-sm text-slate-600">All sessions · {shotCount} shot(s) logged</span>
                    </span>
                    <span className="text-sm font-semibold text-vibrant-green">
                        <span className="group-open:hidden">Expand</span>
                        <span className="hidden group-open:inline">Collapse</span>
                    </span>
                </summary>
                <div className="space-y-4 border-t border-slate-200 p-5">
                    {clubs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                            <p className="font-semibold text-slate-800">No practice shots recorded yet</p>
                            <p className="mt-1 text-sm text-slate-600">Start a practice session to see your breakdown by club.</p>
                            <Link href="/scorecard/practice" className="mt-4 inline-flex rounded-lg bg-vibrant-green px-4 py-2 text-sm font-semibold text-white hover:bg-fairway-green">
                                Start Practicing
                            </Link>
                        </div>
                    ) : (
                        <>
                            <OverallTendencies shots={allShots} />
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-fairway-green">By club</h3>
                                {clubs.map(([club, shots]) => (
                                    <article key={club} className="rounded-xl border border-slate-200 p-5">
                                        <div className="mb-4 flex items-baseline justify-between gap-4">
                                            <h4 className="text-lg font-semibold text-slate-900">{club}</h4>
                                            <p className="text-sm text-slate-600">{shots.length} shot(s)</p>
                                        </div>
                                        <div className="grid gap-5 sm:grid-cols-3">
                                            <CategoryBreakdown title="Contact" values={shots.map((shot) => shot.contact)} options={contactOptions} />
                                            <CategoryBreakdown title="Start direction" values={shots.map((shot) => shot.startDirection)} options={directionOptions} />
                                            <CategoryBreakdown title="Curve" values={shots.map((shot) => shot.curve)} options={directionOptions} />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </details>
        </section>
    );
}

export default function StatsPage() {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRounds = async () => {
            try {
                const [allRounds, allPracticeSessions] = await Promise.all([getAllRounds(), getAllPracticeSessions()]);
                allRounds.sort((a, b) => b.date - a.date);
                setRounds(allRounds);
                setPracticeSessions(allPracticeSessions);
            } catch (err) {
                setError("Failed to load stats");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadRounds();
    }, []);

    const handicap = calculateHandicap(rounds);
    const scoringStats = calculateScoringStats(rounds);
    const threePuttTone = getPerformanceTone(scoringStats.threePuttPercentage, "three-putt");
    const girTone = getPerformanceTone(scoringStats.GIRPercentage, "gir");
    const scramblingTone = getPerformanceTone(scoringStats.scramblingPercentage, "scrambling");
    const fairwaysTone = getPerformanceTone(scoringStats.fairwayPercentage, "fairways");
    const completedRounds = rounds.filter((round) => round.completed).length;

    const roundsWithScores = rounds.filter((round) => round.holes.some((hole) => hole.score !== undefined && hole.parValue !== undefined)).length;

    const eligibleRounds = rounds.filter((round) => round.completed && round.courseRating > 0 && round.courseSlope > 0).length;

    const latestRound = rounds[0];

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white py-12 px-6 flex items-center justify-center">
                <p className="text-text-dark">Loading stats...</p>
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
                    <p className="mt-3 text-4xl font-semibold text-slate-900">{handicap !== null ? handicap.toFixed(1) : "—"}</p>
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
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">3-putt percentage</p>
                        <p className={`mt-2 text-2xl font-semibold ${threePuttTone?.textClass}`}>
                            {scoringStats.threePuttPercentage !== null ? `${scoringStats.threePuttPercentage.toFixed(1)}%` : "—"}
                        </p>
                        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${threePuttTone?.badgeClass}`}>
                            {threePuttTone?.label}
                        </span>
                        <p className="mt-2 text-sm text-slate-600">
                            {scoringStats.eligibleHoles > 0
                                ? `${scoringStats.threePuttHoles} of ${scoringStats.eligibleHoles} eligible holes`
                                : "Add hole-by-hole putts to start tracking"}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">Scrambling</p>
                        <p className={`mt-2 text-2xl font-semibold ${scramblingTone?.textClass}`}>
                            {scoringStats.scramblingPercentage !== null ? `${scoringStats.scramblingPercentage.toFixed(1)}%` : "—"}
                        </p>
                        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${scramblingTone?.badgeClass}`}>
                            {scramblingTone?.label}
                        </span>
                        <p className="mt-2 text-sm text-slate-600">
                            {scoringStats.scramblingEligibleHoles > 0
                                ? `${scoringStats.scramblingHoles} of ${scoringStats.scramblingEligibleHoles} eligible holes`
                                : "Add scores to start tracking"}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">Fairways</p>
                        <p className={`mt-2 text-2xl font-semibold ${fairwaysTone?.textClass}`}>
                            {scoringStats.fairwayPercentage !== null ? `${scoringStats.fairwayPercentage.toFixed(1)}%` : "—"}
                        </p>
                        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${fairwaysTone?.badgeClass}`}>
                            {fairwaysTone?.label}
                        </span>
                        <p className="mt-2 text-sm text-slate-600">
                            {scoringStats.fairwayEligibleHoles > 0
                                ? `${scoringStats.fairwaysHit} of ${scoringStats.fairwayEligibleHoles} eligible holes`
                                : "Add scores to start tracking"}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm font-medium text-slate-500">Greens in regulation</p>
                        <p className={`mt-2 text-2xl font-semibold ${girTone?.textClass}`}>
                            {scoringStats.GIRPercentage !== null ? `${scoringStats.GIRPercentage.toFixed(1)}%` : "—"}
                        </p>
                        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${girTone?.badgeClass}`}>
                            {girTone?.label}
                        </span>
                        <p className="mt-2 text-sm text-slate-600">
                            {scoringStats.eligibleHoles > 0
                                ? `${scoringStats.GIRHoles} of ${scoringStats.eligibleHoles} eligible holes`
                                : "Add scores to start tracking"}
                        </p>
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
                <PracticeStats sessions={practiceSessions} />
            </div>
        </main>
    );
}
