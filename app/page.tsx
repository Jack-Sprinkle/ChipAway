import Link from "next/link";
import Image from "next/image";

const brandPillars = [
    {
        title: "Honest golf writing",
        description:
            "Stories, reflections, and practical notes from the ongoing work of getting better without letting the game become a grind.",
    },
    {
        title: "Audio and video",
        description:
            "A future home for conversations, course thoughts, short-form clips, and longer videos that feel useful rather than noisy.",
    },
    {
        title: "Useful tools",
        description:
            "Simple software for rounds, practice, and course notes, built to support the way golfers actually play.",
    },
];

const principles = ["Progress over perfection", "Teach through experience", "Build useful things"];

export default function HomePage() {
    return (
        <main className="min-h-screen bg-cream text-text-dark">
            <section className="px-6 pt-14 pb-20 md:pt-20 md:pb-28">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-12 items-center">
                    <div>
                        <Image
                            src="/brand/cag_full_logo.svg"
                            alt="Chip Away Golf"
                            width={688}
                            height={384}
                            className="mb-8 w-full max-w-[520px] rounded-lg"
                            priority
                        />
                        <p className="text-sm uppercase tracking-[0.18em] text-vibrant-green font-bold mb-5">
                            Play. Breathe. Enjoy.
                        </p>
                        <h1 className="text-5xl md:text-7xl font-bold text-fairway-green mb-7 max-w-4xl">
                            A thoughtful golf home for the long game.
                        </h1>
                        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                            Chip Away Golf is being built for golfers who want to improve with patience, enjoy the walk,
                            and stay curious about the game one shot at a time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="#vision"
                                className="px-8 py-3 bg-fairway-green text-white font-semibold rounded-lg hover:bg-vibrant-green transition-colors text-center"
                            >
                                See the Vision
                            </Link>
                            <Link
                                href="/scorecard"
                                className="px-8 py-3 border-2 border-fairway-green text-fairway-green font-semibold rounded-lg hover:bg-white transition-colors text-center"
                            >
                                Open Scorecard
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white border border-light-sand rounded-lg p-8">
                        <p className="text-sm uppercase tracking-[0.16em] text-vibrant-green font-bold mb-4">
                            Brand promise
                        </p>
                        <p className="text-2xl font-bold leading-snug text-fairway-green mb-5">
                            No perfect swing promises. No clickbait. Just useful things that make golfers excited to
                            tee it up again.
                        </p>
                        <p className="leading-relaxed">
                            Content, tools, and future products will all come back to the same idea: enjoy the game more
                            while improving one shot at a time.
                        </p>
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
                            The goal is not to become another loud golf content channel. It is to build a calm,
                            welcoming place for blog posts, future podcast conversations, video content, and small tools
                            that genuinely help golfers enjoy the game.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {brandPillars.map((pillar) => (
                            <article
                                key={pillar.title}
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
                        {principles.map((principle) => (
                            <div
                                key={principle}
                                className="border-l-4 border-warm-gold pl-5 py-1"
                            >
                                <h3 className="text-xl font-bold text-fairway-green mb-2">{principle}</h3>
                                <p className="leading-relaxed">
                                    Chip Away Golf will favor patient improvement, honest learning, and practical ideas
                                    that make rounds more enjoyable.
                                </p>
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
