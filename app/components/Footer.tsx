import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-fairway-green px-6 py-10 text-text-light">
            <div className="max-w-6xl mx-auto flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/" className="inline-flex items-center gap-3" aria-label="Chip Away Golf home">
                    <Image
                        src="/brand/CAG_mono_logo_alt.svg"
                        alt="Chip Away Golf Simple Logo"
                        width={100}
                        height={100}
                        className="rounded-lg border border-warm-gold/60"
                    />
                    <span className="text-xl font-bold">Chip Away Golf</span>
                </Link>

                <p className="max-w-md text-sm leading-relaxed text-text-light/85 sm:text-right">Golf is hard. Enjoy it anyway.</p>
            </div>
            <div className="max-w-6xl mx-auto mt-6 border-t border-white/10 pt-5 text-center text-sm text-text-light/80 sm:text-left">
                <p>© 2026 ChipAway Golf</p>
                <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms-of-use" className="hover:text-white transition-colors">
                        Terms of Use
                    </Link>
                    <Link href="/rss.xml" className="hover:text-white transition-colors">
                        RSS
                    </Link>
                </div>
            </div>
        </footer>
    );
}
