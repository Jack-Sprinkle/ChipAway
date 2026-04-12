import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-cream flex flex-col">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col justify-center items-center px-6 py-20 text-center">
                <div className="max-w-2xl mx-auto">
                    {/* Logo / Title */}
                    <div className="mb-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-fairway-green mb-3">ChipAway</h1>
                        <p className="text-xl text-vibrant-green font-semibold">Golf Score Tracking Made Simple</p>
                    </div>

                    {/* Hero Description */}
                    <p className="text-lg text-text-dark mb-8 leading-relaxed">
                        Track your golf round without the bloat. No GPS. No personal data collection. No accounts. Just
                        you, your score, and your phone.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            href="/round/new"
                            className="px-8 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors"
                        >
                            Start New Round
                        </Link>
                        <Link
                            href="/scores"
                            className="px-8 py-3 border-2 border-vibrant-green text-vibrant-green font-semibold rounded-lg hover:bg-cream transition-colors"
                        >
                            View Scores
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-fairway-green mb-12 text-center">Why ChipAway?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1: Simplicity */}
                        <div className="bg-cream p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-fairway-green mb-3">⛳ Simple & Fast</h3>
                            <p className="text-text-dark">
                                Enter your course name. Input par, score, and putts for each hole. That&apos;s it. No
                                signup forms, no complexity.
                            </p>
                        </div>

                        {/* Card 2: Privacy */}
                        <div className="bg-cream p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-fairway-green mb-3">🔒 Your Data, Your Device</h3>
                            <p className="text-text-dark">
                                All data stored locally on your phone. No cloud. No GPS tracking. No personal
                                information collected or sold.
                            </p>
                        </div>

                        {/* Card 3: Offline */}
                        <div className="bg-cream p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-fairway-green mb-3">📱 Works Offline</h3>
                            <p className="text-text-dark">
                                No internet? No problem. Your round works perfectly offline. Data syncs to your device
                                when you&apos;re back online.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Not Other Apps Section */}
            <section className="bg-cream px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-fairway-green mb-8 text-center">
                        The Problem with Other Apps
                    </h2>

                    <div className="space-y-4 text-text-dark">
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 text-center text-2xl">📍</span>
                            <div>
                                <p className="font-semibold">GPS Tracking</p>
                                <p className="text-sm">Constantly tracking your location and course data.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 text-center text-2xl">📊</span>
                            <div>
                                <p className="font-semibold">Data Collection</p>
                                <p className="text-sm">
                                    Selling your scores, locations, and behavioral data to third parties.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 text-center text-2xl">🔑</span>
                            <div>
                                <p className="font-semibold">Account Requirements</p>
                                <p className="text-sm">
                                    Forced to create accounts, remember passwords, manage profiles.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 text-center text-2xl">💸</span>
                            <div>
                                <p className="font-semibold">Ads & Upsells</p>
                                <p className="text-sm">Bombarded with ads, premium tiers, and in-app purchases.</p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-vibrant-green font-semibold">
                        ChipAway takes a different approach: just scoring, no fuss, no surveillance.
                    </p>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-white px-6 py-12 text-center">
                <h3 className="text-2xl font-bold text-fairway-green mb-4">Ready to score?</h3>
                <Link
                    href="/round/new"
                    className="inline-block px-8 py-3 bg-vibrant-green text-white font-semibold rounded-lg hover:bg-fairway-green transition-colors"
                >
                    Start Your First Round
                </Link>
            </section>
        </main>
    );
}
