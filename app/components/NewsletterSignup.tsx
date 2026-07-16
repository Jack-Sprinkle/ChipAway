"use client";

import { useState } from "react";

type NewsletterSignupProps = {
    pageType?: string;
};

export default function NewsletterSignup({ pageType }: NewsletterSignupProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("https://buttondown.com/api/emails/embed-subscribe/sprinkle", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ email }),
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    if (status === "success") {
        return (
            <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/80 p-4 text-sm text-stone-700">
                <p className="text-sm font-semibold text-stone-900">You&apos;re in</p>
                <p className="text-sm text-stone-600">Just one more step—check your inbox and click the confirmation link.</p>
                <p className="text-sm text-stone-600">
                    After that, I&apos;ll send the occasional journal entry, a few thoughts from the course, and updates on Chip Away Golf.
                </p>
                <p className="text-sm text-stone-600">See you on the first tee.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/80 p-4 shadow-sm">
            <div className="mb-3 space-y-1">
                <p className="text-sm font-semibold text-stone-900">The Chip Away Journal</p>
                {pageType === "entry" ? (
                    <div>
                        <p className="text-sm text-stone-600">Enjoyed this entry?</p>
                        <p className="text-sm text-stone-600">
                            Every couple of weeks I&apos;ll send a story from the course, lessons I&apos;m learning, and updates on the tools I&apos;m
                            building.
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-stone-600">Looking for more? Join the Journal.</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 justify-between sm:flex-row">
                <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="on"
                    className="w-full rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-500"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                    {status === "loading" ? "Joining…" : "Join"}
                </button>
            </div>

            {status === "error" && <p className="mt-2 text-sm text-red-600">Something went wrong — try again.</p>}
        </form>
    );
}
