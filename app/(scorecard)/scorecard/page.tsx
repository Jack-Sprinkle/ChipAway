import Link from "next/link";
import type { ReactNode } from "react";

function IconShell({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-vibrant-green">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-6 w-6"
            >
                {children}
            </svg>
        </span>
    );
}

function FlagIcon() {
    return (
        <IconShell>
            <path d="M6 21V4" />
            <path d="M6 4h11l-2 4 2 4H6" />
        </IconShell>
    );
}

function CircleStackIcon() {
    return (
        <IconShell>
            <path d="M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3Z" />
            <path d="M4 5v5c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
            <path d="M4 10v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5" />
        </IconShell>
    );
}

function BoltIcon() {
    return (
        <IconShell>
            <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
        </IconShell>
    );
}

function MapPinIcon() {
    return (
        <IconShell>
            <path d="M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z" />
            <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        </IconShell>
    );
}

function ChartBarIcon() {
    return (
        <IconShell>
            <path d="M4 20h16" />
            <path d="M7 16V9" />
            <path d="M12 16V5" />
            <path d="M17 16v-3" />
        </IconShell>
    );
}

function KeyIcon() {
    return (
        <IconShell>
            <path d="M15 7a4 4 0 1 1-2.1 3.5L4 19.4V22h2.6l1.1-1.1H10v-2.3l1.1-1.1h2.3l2.1-2.1A4 4 0 0 1 15 7Z" />
            <path d="M17 7h.01" />
        </IconShell>
    );
}

function BanknotesIcon() {
    return (
        <IconShell>
            <path d="M3 7h18v10H3z" />
            <path d="M7 7a4 4 0 0 1-4 4" />
            <path d="M17 7a4 4 0 0 0 4 4" />
            <path d="M7 17a4 4 0 0 0-4-4" />
            <path d="M17 17a4 4 0 0 1 4-4" />
            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </IconShell>
    );
}

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-cream flex flex-col">
            <section className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-fairway-green mb-3">Scorecard</h1>
                        <p className="text-xl text-vibrant-green font-semibold">Golf Score Tracking Made Simple</p>
                    </div>
                    <p className="text-lg text-text-dark mb-8 leading-relaxed">
                        Track your golf round without the bloat. All data lives on your phone. No GPS. No personal data collection. No accounts. Just
                        you, your score, and your phone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            href="/scorecard/round/new"
                            className="px-8 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors"
                        >
                            Start New Round
                        </Link>
                        <Link
                            href="/scorecard/scores"
                            className="px-8 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors"
                        >
                            View Scores
                        </Link>
                        <Link
                            href="/scorecard/stats"
                            className="px-8 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors"
                        >
                            View Stats
                        </Link>
                        <Link
                            href="/scorecard/practice"
                            className="px-8 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors"
                        >
                            Practice
                        </Link>
                    </div>
                </div>
            </section>
            <section className="bg-white px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-fairway-green mb-12 text-center">Why ChipAway?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-cream p-6 rounded-lg">
                            <div className="flex gap-2">
                                <FlagIcon />
                                <h3 className="text-xl font-semibold text-fairway-green mt-4 mb-3">Simple & Fast</h3>
                            </div>
                            <p className="text-text-dark">
                                Enter your course name. Input par, score, and putts for each hole. That&apos;s it. No signup forms, no complexity.
                            </p>
                        </div>
                        <div className="bg-cream p-6 rounded-lg">
                            <div className="flex gap-2">
                                <CircleStackIcon />
                                <h3 className="text-xl font-semibold text-fairway-green mt-4 mb-3">Local First</h3>
                            </div>
                            <p className="text-text-dark">
                                Every round, every score lives on your phone. No cloud. No GPS tracking. No personal information collected or sent
                                anywhere.
                            </p>
                        </div>
                        <div className="bg-cream p-6 rounded-lg">
                            <div className="flex gap-2">
                                <BoltIcon />
                                <h3 className="text-xl font-semibold text-fairway-green mt-4 mb-3">Uninterrupted Play</h3>
                            </div>

                            <p className="text-text-dark">
                                Start a round online, then play completely offline. Your scores stay on your phone. No internet needed during your
                                round.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-cream px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-fairway-green mb-8 text-center">The Problem with Other Apps</h2>

                    <div className="space-y-4 text-text-dark">
                        <div className="flex gap-4">
                            <MapPinIcon />
                            <div>
                                <p className="font-semibold">GPS Tracking</p>
                                <p className="text-sm">Constantly tracking your location and course data.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <ChartBarIcon />
                            <div>
                                <p className="font-semibold">Data Collection</p>
                                <p className="text-sm">Selling your scores, locations, and behavioral data to third parties.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <KeyIcon />
                            <div>
                                <p className="font-semibold">Account Requirements</p>
                                <p className="text-sm">Forced to create accounts, remember passwords, manage profiles.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <BanknotesIcon />
                            <div>
                                <p className="font-semibold">Ads & Upsells</p>
                                <p className="text-sm">Bombarded with ads, premium tiers, and in-app purchases.</p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-vibrant-green font-semibold">
                        We take a different approach: just scoring, no fuss, no problem.
                    </p>
                </div>
            </section>
            <section className="bg-white px-6 py-12 text-center">
                <h3 className="text-2xl font-bold text-fairway-green mb-4">Ready to score?</h3>
                <Link
                    href="/scorecard/round/new"
                    className="inline-block px-8 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors"
                >
                    Start Your First Round
                </Link>
            </section>
        </main>
    );
}
