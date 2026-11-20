import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Digital Golf Toolkit | Chip Away Golf",
    description:
        "Track rounds, understand your game, and keep notes for the courses you play. Chip Away Golf is building a thoughtful digital toolkit for golfers.",
    alternates: {
        canonical: "/",
    },
};

const toolkitFeatures = [
    {
        title: "Track your rounds",
        status: "Available",
        description: "Keep score hole by hole, record the details that matter, and pick up an in-progress round later.",
        href: "/toolkit/round/new",
        linkLabel: "Start a round",
    },
    {
        title: "Learn your tendencies",
        status: "Available",
        description: "Review scoring stats and practice-shot patterns to notice where your game is trending.",
        href: "/toolkit/stats",
        linkLabel: "Explore your stats",
    },
    {
        title: "Get to know the course",
        status: "Available",
        description: "Keep a yardage book with hole-by-hole notes you can return to the next time you play.",
        href: "/toolkit/yardage-books",
        linkLabel: "Open yardage books",
    },
    {
        title: "Build a plan before you play",
        status: "In development",
        description: "We’re working toward a pre-round plan informed by your recent rounds, practice tendencies, and course notes.",
    },
];

const principles = [
    {
        title: "Progress over perfection",
        description: "Use your history to notice patterns, not to judge yourself by one score or one swing.",
    },
    {
        title: "Learn from every course",
        description: "Keep the small details you discover so the next round at a familiar course feels a little less unfamiliar.",
    },
    {
        title: "Tools that stay out of the way",
        description: "Round, practice, and course data stays in your browser. No account or GPS tracking required.",
    },
];

export default function HomePage() {
    return (
        <main className="min-h-screen bg-cream text-text-dark">
            <section className="px-6 pt-4 pb-20 md:pt-7 md:pb-28">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col items-center">
                        <Image
                            src="/brand/CAG_full_logo_simple.svg"
                            alt="Chip Away Golf"
                            width={750}
                            height={500}
                            className="mb-8 rounded-lg"
                            priority
                        />
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-vibrant-green">Tools to play, learn, and plan</p>
                        <h1 className="mb-4 max-w-4xl text-center text-3xl font-bold text-fairway-green md:text-5xl">
                            A digital golf toolkit, built one useful tool at a time.
                        </h1>
                        <p className="mb-5 text-lg font-semibold text-fairway-green md:text-xl">Golf is hard. Enjoy it anyway.</p>
                        <p className="mb-8 max-w-2xl text-center text-lg leading-relaxed md:text-xl">
                            Track your rounds, understand patterns in your game, and keep the notes that make each course more familiar. We&apos;re
                            building tools to help you bring what you learn into your next round.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/toolkit"
                                className="rounded-lg bg-fairway-green px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-vibrant-green"
                            >
                                Explore the Toolkit
                            </Link>
                            <Link
                                href="/journal"
                                className="rounded-lg border-2 border-fairway-green px-8 py-3 text-center font-semibold text-fairway-green transition-colors hover:bg-white"
                            >
                                Read the Journal
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="toolkit" className="bg-white px-6 py-18 md:py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-3xl mb-10">
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-vibrant-green">Your digital golf toolkit</p>
                        <h2 className="mb-5 text-3xl font-bold text-fairway-green md:text-4xl">Useful on the course, between rounds, and at practice.</h2>
                        <p className="text-lg leading-relaxed">
                            Start with the tool you need today. Over time, these pieces are designed to work together and help you learn more about
                            your game.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {toolkitFeatures.map((feature) => (
                            <article key={feature.title} className="flex flex-col rounded-xl border border-light-sand bg-cream p-6">
                                <span
                                    className={`mb-4 self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                        feature.href ? "bg-white text-vibrant-green" : "bg-warm-gold/30 text-fairway-green"
                                    }`}
                                >
                                    {feature.status}
                                </span>
                                <h3 className="mb-3 text-xl font-bold text-fairway-green">{feature.title}</h3>
                                <p className="flex-1 leading-relaxed">{feature.description}</p>
                                {feature.href && (
                                    <Link href={feature.href} className="mt-5 inline-flex font-semibold text-vibrant-green underline underline-offset-4">
                                        {feature.linkLabel} →
                                    </Link>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-18 md:py-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1fr] gap-10 items-start">
                    <div>
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-vibrant-green">The approach</p>
                        <h2 className="mb-5 text-3xl font-bold text-fairway-green md:text-4xl">Make the game easier to learn, not harder to enjoy.</h2>
                        <p className="text-lg leading-relaxed">
                            A score tells part of the story. Your practice and course notes add context. We believe good tools can help you connect
                            those pieces without adding noise to the game.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {principles.map((principle) => (
                            <div key={principle.title} className="border-l-4 border-warm-gold py-1 pl-5">
                                <h3 className="text-xl font-bold text-fairway-green mb-2">{principle.title}</h3>
                                <p className="leading-relaxed">{principle.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-fairway-green px-6 py-16 text-text-light">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] gap-8 items-center">
                    <div>
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-warm-gold">Start with your next round</p>
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Build your game, one shot at a time.</h2>
                        <p className="max-w-2xl text-lg leading-relaxed">
                            Open the toolkit to track a round, explore your stats, practice with purpose, or add notes to a course you know.
                        </p>
                    </div>

                    <Link
                        href="/toolkit"
                        className="rounded-lg bg-warm-gold px-8 py-3 text-center font-bold text-text-dark transition-colors hover:bg-light-sand"
                    >
                        Open the Toolkit
                    </Link>
                </div>
            </section>
        </main>
    );
}
