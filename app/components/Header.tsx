"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/journal", label: "Journal" },
    { href: "/scorecard", label: "Scorecard" },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-cream/95 border-b border-light-sand">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/" className="inline-flex items-center" aria-label="Chip Away Golf home">
                    <Image src="/brand/CAG_mono_logo.svg" alt="Chip Away Golf" width={100} height={100} className="rounded-lg" priority />
                </Link>

                <div className="flex items-center flex-row-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-light-sand bg-white text-sm font-semibold text-fairway-green sm:hidden"
                        aria-expanded={isMenuOpen}
                        aria-controls="primary-navigation"
                        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    >
                        {isMenuOpen ? "✕" : "☰"}
                    </button>

                    <nav
                        id="primary-navigation"
                        className={`${isMenuOpen ? "flex" : "hidden"} w-full flex-col gap-2 sm:flex sm:w-auto sm:flex-row sm:items-center sm:justify-end`}
                        aria-label="Primary navigation"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-2 text-sm font-semibold text-fairway-green rounded-lg hover:bg-white transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
