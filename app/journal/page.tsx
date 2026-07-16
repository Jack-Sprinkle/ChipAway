import Link from "next/link";
import { getAllEntries } from "@/lib/journal";
import NewsletterSignup from "../components/NewsletterSignup";

export default function JournalPage() {
    const posts = getAllEntries();
    const pageType: string = "journal";

    return (
        <main className="bg-white px-6 py-16 text-text-dark">
            <section className="max-w-4xl mx-auto">
                <p className="text-sm uppercase tracking-[0.18em] text-vibrant-green font-bold mb-5">Journal</p>
                <h1 className="text-4xl md:text-6xl font-bold text-fairway-green mb-6">Notes from the ongoing work.</h1>
                <p className="text-lg leading-relaxed max-w-2xl">
                    The journal will collect reflections, course notes, practice ideas, and useful lessons from the ongoing work of improving one shot
                    at a time.
                </p>

                <div className="mt-12 space-y-6">
                    {posts.map((post) => (
                        <article key={post.meta.id} className="border-t border-light-sand pt-6">
                            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-vibrant-green">
                                <time dateTime={post.meta.date}>{post.meta.date}</time>
                                <span aria-hidden="true">/</span>
                                <span>{post.meta.author}</span>
                            </div>
                            <h2 className="mb-3 text-2xl font-bold text-fairway-green">
                                <Link href={`/journal/${post.slug}`} className="hover:text-vibrant-green">
                                    {post.meta.title}
                                </Link>
                            </h2>
                            <p className="mb-4 max-w-2xl leading-relaxed">{post.meta.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {post.meta.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-fairway-green"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
                <NewsletterSignup pageType={pageType} />
            </section>
        </main>
    );
}
