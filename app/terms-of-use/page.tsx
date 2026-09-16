import { Metadata } from "next";

const sections = [
    {
        title: "Acceptance of Terms",
        content: [
            "By accessing or using Chip Away Golf, you agree to be bound by these Terms of Use. If you do not agree, you should not use the website or any related services.",
        ],
    },
    {
        title: "Use of the Site",
        content: [
            "Chip Away Golf provides content, tools, and scorekeeping features for informational and personal use. You agree to use the site responsibly and not for unlawful, abusive, or harmful activities.",
            "We may update, modify, suspend, or discontinue any part of the site at any time without notice.",
        ],
    },
    {
        title: "Scorecard and Local Data",
        content: [
            "The scorecard is provided as a simple personal utility. Any round information entered into the app may be stored locally in your browser or device. We do not guarantee permanent storage or recovery of local data outside of your browser environment.",
            "It is your responsibility to maintain backups or avoid relying on local device storage for critical information.",
        ],
    },
    {
        title: "Intellectual Property",
        content: [
            "All content on Chip Away Golf, including text, graphics, branding, logos, and code, is owned by Chip Away Golf or its licensors and is protected by applicable intellectual property laws.",
            "You may not reproduce, distribute, or repurpose content without prior written permission, except for limited personal, non-commercial use.",
        ],
    },
    {
        title: "Third-Party Links",
        content: [
            "Chip Away Golf may link to third-party websites or services. We are not responsible for the content, accuracy, or practices of those external sites and do not endorse them unless explicitly stated.",
        ],
    },
    {
        title: "Disclaimers",
        content: [
            "The site and its content are provided on an 'as is' basis. We make no warranties, express or implied, regarding availability, accuracy, reliability, or fitness for a particular purpose.",
            "We do not guarantee that the website will be free from errors, interruptions, or security vulnerabilities.",
        ],
    },
    {
        title: "Limitation of Liability",
        content: [
            "To the fullest extent permitted by law, Chip Away Golf shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the website or related services.",
        ],
    },
    {
        title: "Changes to These Terms",
        content: [
            "We may update these Terms of Use from time to time. Continued use of the site after changes are posted indicates your acceptance of the revised terms.",
        ],
    },
    {
        title: "Contact",
        content: [
            "If you have questions about these Terms of Use, please contact Chip Away Golf at contact@chipawaygolf.com",
        ],
    },
];

export const metadata: Metadata = {
    alternates: {
        canonical: "/terms-of-use",
    },
};

export default function TermsOfUsePage() {
    return (
        <main className="min-h-screen bg-cream text-text-dark">
            <div className="mx-auto max-w-4xl px-6 py-12 md:py-20">
                <header className="mb-10 rounded-2xl border border-fairway-green/15 bg-white p-8 shadow-[0_10px_30px_rgba(45,80,22,0.08)] md:p-10">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-vibrant-green">Legal</p>
                    <h1 className="text-4xl font-black tracking-tight text-fairway-green md:text-5xl">Terms of Use</h1>
                    <p className="mt-4 text-sm text-text-dark/70">Last updated: September 16, 2026</p>
                </header>

                <article className="rounded-2xl border border-fairway-green/15 bg-white p-6 shadow-[0_10px_30px_rgba(45,80,22,0.06)] md:p-10">
                    <div className="space-y-7 text-base leading-8 text-text-dark/90">
                        {sections.map((section) => {
                            if (section.title === "Contact") {
                                return (
                                    <section key={section.title} className="border-t border-fairway-green/10 pt-6 first:border-t-0 first:pt-0">
                                        <h2 className="mb-4 text-2xl font-bold text-fairway-green">{section.title}</h2>
                                        <div className="space-y-4">
                                            <p>
                                                If you have questions about these Terms of Use, please contact Chip Away Golf at {" "}
                                                <a
                                                    href="mailto:contact@chipawaygolf.com"
                                                    className="font-medium text-vibrant-green underline decoration-2 underline-offset-4 transition-colors hover:text-fairway-green"
                                                >
                                                    contact@chipawaygolf.com
                                                </a>
                                            </p>
                                        </div>
                                    </section>
                                );
                            }

                            return (
                                <section key={section.title} className="border-t border-fairway-green/10 pt-6 first:border-t-0 first:pt-0">
                                    <h2 className="mb-4 text-2xl font-bold text-fairway-green">{section.title}</h2>
                                    <div className="space-y-4">
                                        {section.content.map((paragraph, index) => (
                                            <p key={`${section.title}-${index}`}>{paragraph}</p>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </article>
            </div>
        </main>
    );
}
