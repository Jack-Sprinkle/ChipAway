import Link from "next/link";

const scoreRows = [
    { hole: 1, par: 4, score: 4 },
    { hole: 2, par: 3, score: 3 },
    { hole: 3, par: 5, score: 6 },
    { hole: 4, par: 4, score: 4 },
];

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-cream text-text-dark">
            <section className="px-6 py-6">
                <nav className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-fairway-green"
                    >
                        ChipAway
                    </Link>

                    <Link
                        href="/scorecard"
                        className="px-4 py-2 bg-vibrant-green text-white text-sm font-semibold rounded-lg hover:bg-fairway-green transition-colors"
                    >
                        Open Scorecard
                    </Link>
                </nav>
            </section>

            <section className="px-6 py-16 md:py-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_420px] gap-12 items-center">
                    <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-vibrant-green font-bold mb-4">
                            Simple golf notes and scoring
                        </p>
                        <h1 className="text-5xl md:text-6xl font-bold text-fairway-green mb-6">
                            A quieter home for your golf rounds.
                        </h1>
                        <p className="text-lg leading-relaxed mb-8 max-w-2xl">
                            ChipAway is built around the parts of golf worth remembering: the round you played, the
                            shots that taught you something, and a scorecard that stays out of the way.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/scorecard"
                                className="px-8 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors text-center"
                            >
                                Launch Scorecard App
                            </Link>
                            <Link
                                href="#about"
                                className="px-8 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-white transition-colors text-center"
                            >
                                About ChipAway
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-light-sand">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-vibrant-green font-semibold">Today&apos;s Card</p>
                                <h2 className="text-2xl font-bold text-fairway-green">Front Nine</h2>
                            </div>
                            <span className="bg-cream text-fairway-green px-3 py-1 rounded-lg text-sm font-bold">
                                +1
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-sm font-bold text-fairway-green mb-3">
                            <span>Hole</span>
                            <span>Par</span>
                            <span>Score</span>
                            <span>Result</span>
                        </div>

                        <div className="space-y-2">
                            {scoreRows.map((row) => (
                                <div
                                    key={row.hole}
                                    className="grid grid-cols-4 gap-2 bg-cream rounded-lg px-3 py-3 text-sm"
                                >
                                    <span className="font-semibold">{row.hole}</span>
                                    <span>{row.par}</span>
                                    <span>{row.score}</span>
                                    <span className="font-semibold text-vibrant-green">
                                        {row.score - row.par === 0 ? "E" : `+${row.score - row.par}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="about"
                className="bg-white px-6 py-16"
            >
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold text-fairway-green mb-5">Built for the walk between shots.</h2>
                        <p className="text-lg leading-relaxed">
                            This site will grow into a place for golf reflections, course notes, and small lessons from
                            ordinary rounds. For now, it keeps things focused: a clean welcome page and a direct path
                            into the scorecard app.
                        </p>
                    </div>

                    <div className="bg-cream rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-fairway-green mb-3">Score without clutter</h3>
                        <p className="leading-relaxed mb-5">
                            Start a round, enter each hole, and keep your scores local to your device.
                        </p>
                        <Link
                            href="/scorecard"
                            className="text-vibrant-green font-semibold hover:text-fairway-green transition-colors"
                        >
                            Go to the scorecard
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
