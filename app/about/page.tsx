import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    alternates: {
        canonical: "/about",
    }
};

export default function AboutPage() {
    return (
        <main className="bg-cream px-6 py-16 text-text-dark">
            <section className="max-w-4xl mx-auto">
                <p className="text-sm uppercase tracking-[0.18em] text-vibrant-green font-bold mb-5">About Chip Away Golf</p>

                <h1 className="text-4xl md:text-6xl font-bold text-fairway-green mb-6">Built for the golfers still learning to love the work.</h1>

                <p className="text-lg leading-relaxed mb-5">
                    Chip Away Golf exists to help golfers improve without losing sight of why they started playing. It&apos;s a home for thoughtful
                    writing, practical tools, and honest reflections from the never-ending journey of getting better.
                </p>

                <p className="text-lg leading-relaxed mb-5">
                    Golf has a way of both humbling us and teaching us patience. Some days everything clicks. Other days, it feels like we&apos;ve
                    forgotten how to swing a club. Most of us spend years chasing lower scores, only to realize that the rounds where we learn the
                    most had very little to do with the number on the scorecard.
                </p>

                <p className="text-lg leading-relaxed mb-5">
                    Chip Away Golf was born from that realization. Improvement is, of course, worth pursuing but enjoying the game shouldn&apos;t
                    depend on playing your best golf. The goal is to build tools, share stories, and create useful resources that help golfers get a
                    little more out of every round.
                </p>

                <p className="text-lg leading-relaxed mb-5">
                    Hi, I&apos;m <span className="font-semibold text-fairway-green">Jack</span>. I&apos;m a software developer and an everyday golfer
                    who loves to tinker. I&apos;m always looking to learn and grow, and add my flair to the golf world. Chip Away Golf is where those
                    two worlds collide. As I continue chasing better golf, I&apos;ll be sharing what I&apos;m learning along the way, with the hope
                    that it helps you enjoy your own journey just a little more.
                </p>

                <div className="border-l-4 border-warm-gold pl-6 mt-12">
                    <p className="text-2xl md:text-3xl font-bold text-fairway-green italic">&quot;Golf is hard. Enjoy it anyway.&quot;</p>
                    <p className="mt-2 text-sm uppercase tracking-widest text-text-dark/70">— Chip Away Golf</p>
                </div>
                <div className="mt-16 rounded-xl border border-light-sand bg-white/50 p-8 text-center">
                    <h2 className="text-2xl font-bold text-fairway-green mb-3">Follow the Journey</h2>

                    <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-8">
                        We&apos;re just getting started. I&apos;ll be sharing stories from my own game, lessons I&apos;m learning, updates on the
                        software I&apos;m building, and honest reflections from the journey. I&apos;d love to have you along for the walk.
                    </p>

                    <Link
                        href="/journal"
                        className="inline-flex items-center rounded-lg bg-fairway-green px-6 py-3 font-medium text-cream transition-colors hover:bg-vibrant-green"
                    >
                        Read the Journal →
                    </Link>
                </div>
            </section>
        </main>
    );
}
