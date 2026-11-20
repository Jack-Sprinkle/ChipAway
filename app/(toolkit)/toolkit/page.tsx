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

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-cream flex flex-col">
            <section className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-fairway-green mb-3">Golf Toolkit</h1>
                        <p className="text-xl text-vibrant-green font-semibold">Your game, all in one place</p>
                    </div>
                    <p className="text-lg text-text-dark mb-8 leading-relaxed">
                        Track more than your score. Record the details of each round, review your game and practice tendencies, and keep useful notes
                        for the courses you play.
                    </p>
                    <div className="mx-auto mb-4 w-full max-w-sm">
                        <Link
                            href="/toolkit/round/new"
                            className="flex min-h-14 items-center justify-center rounded-lg bg-vibrant-green px-8 py-3 font-semibold text-white transition-colors hover:bg-fairway-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fairway-green"
                        >
                            Start New Round
                        </Link>
                    </div>
                    <div className="mx-auto mb-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                        <Link
                            href="/toolkit/scores"
                            className="flex min-h-28 flex-col items-center justify-center rounded-lg border-2 border-vibrant-green px-5 py-4 text-vibrant-green transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fairway-green"
                        >
                            <span className="text-lg font-semibold">View Scores</span>
                            <span className="mt-1 text-sm">Review and resume rounds</span>
                        </Link>
                        <Link
                            href="/toolkit/stats"
                            className="flex min-h-28 flex-col items-center justify-center rounded-lg border-2 border-vibrant-green px-5 py-4 text-vibrant-green transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fairway-green"
                        >
                            <span className="text-lg font-semibold">Stats</span>
                            <span className="mt-1 text-sm">See trends from your rounds</span>
                        </Link>
                        <Link
                            href="/toolkit/practice"
                            className="flex min-h-28 flex-col items-center justify-center rounded-lg border-2 border-vibrant-green px-5 py-4 text-vibrant-green transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fairway-green"
                        >
                            <span className="text-lg font-semibold">Practice</span>
                            <span className="mt-1 text-sm">Log practice shot tendencies</span>
                        </Link>
                        <Link
                            href="/toolkit/yardage-books"
                            className="flex min-h-28 flex-col items-center justify-center rounded-lg border-2 border-vibrant-green px-5 py-4 text-vibrant-green transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fairway-green"
                        >
                            <span className="text-lg font-semibold">Yardage Books</span>
                            <span className="mt-1 text-sm">Keep notes for each course</span>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="bg-white px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-fairway-green mb-12 text-center">A toolkit for the whole game</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-cream p-6 rounded-lg">
                            <div className="flex gap-2">
                                <FlagIcon />
                                <h3 className="text-xl font-semibold text-fairway-green mt-4 mb-3">Richer Round Tracking</h3>
                            </div>
                            <p className="text-text-dark">
                                Along with score and putts, record tee club, fairway results, green miss direction, and penalties hole by hole.
                            </p>
                        </div>
                        <div className="bg-cream p-6 rounded-lg">
                            <div className="flex gap-2">
                                <ChartBarIcon />
                                <h3 className="text-xl font-semibold text-fairway-green mt-4 mb-3">Understand Your Tendencies</h3>
                            </div>
                            <p className="text-text-dark">
                                Review handicap, fairway and green-in-regulation rates, three-putts, scrambling, and practice-shot patterns by club.
                            </p>
                        </div>
                        <div className="bg-cream p-6 rounded-lg">
                            <div className="flex gap-2">
                                <MapPinIcon />
                                <h3 className="text-xl font-semibold text-fairway-green mt-4 mb-3">Learn Each Course</h3>
                            </div>

                            <p className="text-text-dark">
                                Build an 18-hole yardage book and revisit your notes the next time you play that course.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-cream px-6 py-16">
                <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center md:p-12">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-vibrant-green">What we&apos;re building toward</p>
                    <h2 className="text-3xl font-bold text-fairway-green md:text-4xl">Turn what you learn into a game plan.</h2>
                    <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-text-dark">
                        Your round history, practice tendencies, and course notes can tell a bigger story together. We&apos;re working toward
                        personalized pre-round plans that bring those pieces together to help you prepare for the course ahead.
                    </p>
                    <p className="mt-5 text-sm font-semibold text-vibrant-green">Pre-round game plans are in development.</p>
                </div>
            </section>
            <section className="bg-white px-6 py-12 text-center">
                <h3 className="text-2xl font-bold text-fairway-green mb-4">Ready for your next round?</h3>
                <Link
                    href="/toolkit/round/new"
                    className="inline-block px-8 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors"
                >
                    Start Your First Round
                </Link>
            </section>
        </main>
    );
}
