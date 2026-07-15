import Link from "next/link";
import Image from "next/image";

const brandPillars = [
    {
        title: "Honest golf writing",
        description:
            "Stories, reflections, and practical notes from the ongoing work of getting better without letting the game become a grind.",
    },
    {
        title: "Stories & Conversations",
        description:
            "A future home for conversations, course thoughts, short-form clips, and longer videos that feel useful.",
    },
    {
        title: "Useful tools",
        description:
            "Simple software for rounds, practice, and course notes, built to support the way golfers actually play.",
    },
];

const principles = [
    { title: "Progress over perfection", description: "" },
    { title: "Teach through experience", description: "" },
    { title: "Build useful things", description: "" },
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
                        <h1 className="text-2xl md:text-4xl font-bold text-fairway-green mb-7 max-w-4xl text-center">
                            Golf is hard.
                            <hr />
                            Enjoy it anyway.
                        </h1>
                        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mb-8 text-center">
                            Built for golfers who want to improve with patience, enjoy the walk, and stay curious about
                            the game one shot at a time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/about"
                                className="px-8 py-3 bg-fairway-green text-white font-semibold rounded-lg hover:bg-vibrant-green transition-colors text-center"
                            >
                                The Story
                            </Link>
                            <Link
                                href="/scorecard"
                                className="px-8 py-3 border-2 border-fairway-green text-fairway-green font-semibold rounded-lg hover:bg-white transition-colors text-center"
                            >
                                Open Scorecard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="vision"
                className="bg-white px-6 py-18 md:py-20"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-3xl mb-10">
                        <p className="text-sm uppercase tracking-[0.18em] text-vibrant-green font-bold mb-4">
                            What Chip Away Golf is becoming
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-fairway-green mb-5">
                            A place golfers can trust.
                        </h2>
                        <p className="text-lg leading-relaxed">
                            Dedicated to helping everyday golfers improve through thoughtful content, useful software,
                            and a mindset that values progress over perfection.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {brandPillars.map((pillar, idx) => (
                            <article
                                key={idx}
                                className="bg-cream rounded-lg p-6"
                            >
                                <h3 className="text-xl font-bold text-fairway-green mb-3">{pillar.title}</h3>
                                <p className="leading-relaxed">{pillar.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-18 md:py-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1fr] gap-10 items-start">
                    <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-vibrant-green font-bold mb-4">
                            The approach
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-fairway-green mb-5">
                            Better golf, without losing the reason you started.
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {principles.map((principle, idx) => (
                            <div
                                key={idx}
                                className="border-l-4 border-warm-gold pl-5 py-1"
                            >
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
                        <p className="text-sm uppercase tracking-[0.18em] text-warm-gold font-bold mb-4">
                            First useful tool
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Keep score without the clutter.</h2>
                        <p className="text-lg leading-relaxed max-w-2xl">
                            The scorecard app is the first step: simple round tracking that keeps the focus on playing,
                            not managing another complicated golf app.
                        </p>
                    </div>

                    <Link
                        href="/scorecard"
                        className="px-8 py-3 bg-warm-gold text-text-dark font-bold rounded-lg hover:bg-light-sand transition-colors text-center"
                    >
                        Launch Scorecard
                    </Link>
                </div>
            </section>
        </main>
    );
}
