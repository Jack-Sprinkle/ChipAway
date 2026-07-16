import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { getEntry } from "@/lib/journal";
import Link from "next/link";
import Image from "next/image";
import NewsletterSignup from "@/app/components/NewsletterSignup";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { meta, content } = getEntry(slug);
    const pageType: string = "entry";

    const components: MDXRemoteProps["components"] = {
        img: (props) => (
            <Image
                src={props.src}
                alt={props.alt || "MDX Image"}
                width={800} // Set default or fallback width
                height={450} // Set default or fallback height
                sizes="100vw"
                style={{ width: "100%", height: "auto" }} // Keeps image responsive
            />
        ),
        h2: (props) => <h2 {...props} className="mt-12 text-3xl font-bold text-fairway-green border-b-2 border-light-sand" />,
        h3: (props) => <h3 {...props} className="mt-9 text-2xl font-bold text-fairway-green" />,
        p: (props) => <p {...props} className="my-6 text-lg leading-8" />,
        ul: (props) => <ul {...props} className="my-7 space-y-3 pl-6" />,
        li: (props) => <li {...props} className="list-disc leading-relaxed marker:text-warm-gold" />,
        a: (props) => (
            <a {...props} className="font-semibold text-vibrant-green underline decoration-warm-gold underline-offset-4 hover:text-fairway-green" />
        ),
        blockquote: (props) => (
            <blockquote
                {...props}
                className="my-8 border-l-4 border-warm-gold bg-cream px-5 py-4 text-lg font-semibold leading-relaxed text-fairway-green"
            />
        ),
        strong: (props) => <strong {...props} className="font-bold text-fairway-green" />,
    };

    return (
        <main className="bg-white px-6 py-16 text-text-dark">
            <article className="mx-auto max-w-3xl">
                <div className="border-b-2 border-light-sand">
                    <Link
                        href="/journal"
                        className="mb-10 inline-flex text-sm font-bold uppercase tracking-[0.18em] text-vibrant-green hover:text-fairway-green"
                    >
                        Back to journal
                    </Link>

                    <header className="border-b border-light-sand pb-8">
                        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-vibrant-green">
                            <time dateTime={meta.date}>{meta.date}</time>
                            <span aria-hidden="true">/</span>
                            <span>{meta.author}</span>
                        </div>
                        <h1 className="mb-5 text-4xl font-bold leading-tight text-fairway-green md:text-6xl">{meta.title}</h1>
                        <p className="text-xl leading-relaxed">{meta.description}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {meta.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-fairway-green"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    <MDXRemote source={content} components={components} />
                </div>
                <NewsletterSignup pageType={pageType} />
            </article>
        </main>
    );
}
