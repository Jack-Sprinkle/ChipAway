import Image from "next/image";
import Link from "next/link";

const navItems = [
	{ href: "/", label: "Home"},
    { href: "/about", label: "About" },
    { href: "/journal", label: "Journal" },
	{ href: "/scorecard", label: "Scorecard" }
];

export function Header() {
    return (
        <header className="bg-cream/95 border-b border-light-sand">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center"
                    aria-label="Chip Away Golf home"
                >
                    <Image
                        src="/brand/cag_simple_logo.svg"
                        alt="Chip Away Golf"
                        width={344}
                        height={192}
                        className="h-14 w-auto rounded-lg"
                        priority
                    />
                </Link>

                <nav
                    className="flex flex-wrap items-center gap-2 sm:justify-end"
                    aria-label="Primary navigation"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="px-4 py-2 text-sm font-semibold text-fairway-green rounded-lg hover:bg-white transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
