"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/journal", label: "Journal" },
];

const toolkitItems = [
    { href: "/toolkit", label: "Toolkit home", description: "Your golf dashboard" },
    { href: "/toolkit/round/new", label: "New round", description: "Start keeping score" },
    { href: "/toolkit/scores", label: "Your rounds", description: "View saved scorecards" },
    { href: "/toolkit/stats", label: "Stats", description: "Review your game" },
    { href: "/toolkit/practice", label: "Practice", description: "Log practice shot misses" },
    { href: "/toolkit/yardage-books", label: "Yardage books", description: "Keep course hole notes" },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isToolkitMenuOpen, setIsToolkitMenuOpen] = useState(false);

    const closeMenus = () => {
        setIsMenuOpen(false);
        setIsToolkitMenuOpen(false);
    };

    return (
        <header className="relative z-50 border-b border-light-sand bg-cream/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                <Link href="/" className="inline-flex items-center" aria-label="Chip Away Golf home" onClick={closeMenus}>
                    <Image src="/brand/CAG_mono_logo.svg" alt="Chip Away Golf" width={100} height={100} className="rounded-lg" priority />
                </Link>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-fairway-green/20 bg-white/70 text-fairway-green transition-colors hover:bg-white sm:hidden"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-primary-navigation"
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                    <span className="text-xl leading-none" aria-hidden="true">
                        {isMenuOpen ? "✕" : "☰"}
                    </span>
                </button>

                <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary navigation">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-fairway-green transition-colors hover:bg-white"
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div
                        className="relative flex items-center"
                        onMouseEnter={() => setIsToolkitMenuOpen(true)}
                        onMouseLeave={() => setIsToolkitMenuOpen(false)}
                    >
                        <Link
                            href="/toolkit"
                            className="rounded-l-lg py-2 pl-4 pr-1 text-sm font-semibold text-fairway-green transition-colors hover:bg-white"
                        >
                            Toolkit
                        </Link>
                        <button
                            type="button"
                            className="rounded-r-lg py-2 pl-1 pr-3 text-fairway-green transition-colors hover:bg-white"
                            onClick={() => setIsToolkitMenuOpen((open) => !open)}
                            aria-expanded={isToolkitMenuOpen}
                            aria-controls="toolkit-navigation"
                            aria-label="Toggle Toolkit navigation"
                        >
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                                <path d="m5 7.5 5 5 5-5" />
                            </svg>
                        </button>

                        {isToolkitMenuOpen ? (
                            <div
                                id="toolkit-navigation"
                                className="absolute right-0 top-full w-60 rounded-2xl border border-light-sand bg-cream/95 p-2 shadow-lg backdrop-blur-sm"
                            >
                                {toolkitItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block rounded-xl px-3 py-3 transition-colors hover:bg-white"
                                        onClick={() => setIsToolkitMenuOpen(false)}
                                    >
                                        <span className="block text-sm font-semibold text-fairway-green">{item.label}</span>
                                        <span className="mt-0.5 block text-xs text-text-dark/70">{item.description}</span>
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </nav>
            </div>

            {isMenuOpen ? (
                <nav
                    id="mobile-primary-navigation"
                    className="fixed inset-x-0 bottom-0 top-[133px] z-40 flex min-h-[calc(100dvh-133px)] flex-col overflow-y-auto bg-fairway-green px-6 py-8 sm:hidden"
                    aria-label="Mobile primary navigation"
                >
                    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-start gap-6 pt-2">
                        <div className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block rounded-2xl px-5 py-4 text-2xl font-semibold text-cream transition-colors hover:bg-white/10"
                                    onClick={closeMenus}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <section className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-sm" aria-labelledby="mobile-toolkit-heading">
                            <Link
                                id="mobile-toolkit-heading"
                                href="/toolkit"
                                className="text-xs font-bold uppercase tracking-[0.2em] text-sky-blue"
                                onClick={closeMenus}
                            >
                                Toolkit
                            </Link>
                            <div className="mt-3 divide-y divide-white/15">
                                {toolkitItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                        onClick={closeMenus}
                                    >
                                        <span>
                                            <span className="block text-lg font-semibold text-cream">{item.label}</span>
                                            <span className="mt-0.5 block text-sm text-cream/70">{item.description}</span>
                                        </span>
                                        <span className="text-xl text-sky-blue" aria-hidden="true">
                                            →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </nav>
            ) : null}
        </header>
    );
}
