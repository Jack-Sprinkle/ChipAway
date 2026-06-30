import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-fairway-green px-6 py-10 text-text-light">
            <div className="max-w-6xl mx-auto flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-3"
                    aria-label="Chip Away Golf home"
                >
                    <Image
                        src="/brand/cag_simple_logo_alt.svg"
                        alt="Chip Away Golf Simple Logo"
                        width={44}
                        height={44}
                        className="rounded-lg border border-warm-gold/60"
                    />
                    <span className="text-xl font-bold">Chip Away Golf</span>
                </Link>

                <p className="max-w-md text-sm leading-relaxed text-text-light/85 sm:text-right">
                    Play. Breathe. Enjoy.
                </p>
            </div>
        </footer>
    );
}
