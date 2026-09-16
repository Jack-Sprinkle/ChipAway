import { Metadata } from "next";

const sections = [
    {
        title: "Information We Collect",
        content: [
            "You may voluntarily provide information when using certain features of Chip Away Golf, including your email address when subscribing to the newsletter and details you provide when contacting us.",
            "You do not need an account to read the website or use the scorecard.",
            "The scorecard currently does not require an account and does not use a dedicated Chip Away Golf backend to store your golf rounds. The information you enter is stored locally on the device and browser you use to access the application. Chip Away Golf does not currently receive, store, or have access to this data.",
            "Because this information is stored locally, clearing browser site data or deleting application storage may result in the loss of saved rounds. If the app adds accounts, cloud storage, or sync features, this policy will be updated accordingly.",
        ],
    },
    {
        title: "Information Collected Automatically",
        content: [
            "When you visit Chip Away Golf, our hosting, analytics, and performance services may process limited technical information associated with your visit.",
            "This may include pages visited, referrer information, browser and operating system details, device information, approximate geographic information such as country, date and time of the visit, website performance and load details, and technical request information.",
            "Chip Away Golf uses Vercel for hosting, Vercel Web Analytics for website analytics, and Vercel Speed Insights for website performance monitoring.",
            "Vercel Web Analytics is designed to provide traffic information without relying on cookies and uses request-derived identifiers that Vercel states are discarded after 24 hours. Vercel Speed Insights helps measure real-world website performance and Core Web Vitals.",
        ],
    },
    {
        title: "Cookies and Cross-Site Tracking",
        content: [
            "Chip Away Golf does not use cookies to identify individual visitors, track browsing activity across unrelated websites, or create advertising profiles.",
            "We do not use advertising trackers or third-party advertising cookies. Our use of Vercel Web Analytics does not require cookie-based visitor tracking.",
            "Vercel, as our hosting and infrastructure provider, may process technical information associated with requests to websites hosted on its platform in accordance with its own privacy practices.",
        ],
    },
    {
        title: "How We Use Information",
        list: [
            "Operate and maintain Chip Away Golf.",
            "Send newsletters to people who voluntarily subscribe.",
            "Respond to questions and communications.",
            "Understand which pages and content are being used.",
            "Improve the website and its features.",
            "Monitor website performance and reliability.",
            "Identify and address technical or security problems.",
            "Comply with applicable legal obligations.",
        ],
    },
    {
        title: "Newsletter",
        content: [
            "If you subscribe to the Chip Away Golf newsletter, we use the email address you provide to send updates and communications related to the brand and content.",
            "You may unsubscribe at any time using the unsubscribe method included in each email. Our newsletter provider may process your email address on our behalf for delivery and related operational support.",
            "We will not sell your newsletter email address. Commercial email communications are subject to applicable laws, including the federal CAN-SPAM Act.",
        ],
    },
    {
        title: "Third-Party Services",
        content: [
            "Chip Away Golf currently uses third-party services to help operate the website, including Vercel for hosting and infrastructure, Vercel Web Analytics for general traffic insights, and Vercel Speed Insights for performance monitoring.",
            "As part of providing its hosting services, Vercel may process information associated with requests to our website, including IP addresses, information derived from IP addresses, system configuration details, traffic information, and technical logs.",
            "We may also use a newsletter provider to manage subscriptions and email delivery.",
        ],
    },
    {
        title: "Information Sharing",
        content: [
            "We may share information with service providers that help us operate Chip Away Golf, such as hosting and infrastructure providers, analytics providers, and email delivery providers.",
            "We may also disclose information when reasonably necessary to comply with legal process, protect rights and safety, or detect and address fraud, abuse, security issues, and technical problems.",
            "We do not sell personal information.",
        ],
    },
    {
        title: "Your Choices and Rights",
        content: [
            "You may unsubscribe from the newsletter at any time, contact us about personal information you have voluntarily provided, or request correction or deletion of personal information you have provided, subject to applicable law.",
            "Because scorecard data is stored locally on your device rather than on Chip Away Golf's servers, we generally cannot retrieve or delete locally stored scorecard information for you. You can manage or remove this data through your browser or device settings.",
        ],
    },
    {
        title: "Data Security",
        content: [
            "We take reasonable measures to protect information we process. However, no website, application, or internet transmission can be guaranteed to be completely secure.",
        ],
    },
    {
        title: "Children's Privacy",
        content: [
            "Chip Away Golf is intended for a general audience and is not directed toward children under 13. We do not knowingly collect personal information from children under 13.",
        ],
    },
    {
        title: "Third-Party Websites",
        content: [
            "Chip Away Golf may contain links to third-party websites or services. We do not control those websites and are not responsible for their content, security, or privacy practices. We encourage you to review their policies before providing them with personal information.",
        ],
    },
    {
        title: "Changes to This Privacy Policy",
        content: [
            "Chip Away Golf may update this Privacy Policy as the website, scorecard, newsletter, or other services develop. When we make changes, we will update the Last updated date at the top of this page.",
        ],
    },
    {
        title: "Contact",
        content: [
            "Questions about this Privacy Policy or Chip Away Golf's information practices can be directed to:",
            "Chip Away Golf",
            "Email: contact@chipawaygolf.com",
        ],
    },
];

export const metadata: Metadata = {
    alternates: {
        canonical: "/privacy-policy",
    },
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-cream text-text-dark">
            <div className="mx-auto max-w-4xl px-6 py-12 md:py-20">
                <header className="mb-10 rounded-2xl border border-fairway-green/15 bg-white p-8 shadow-[0_10px_30px_rgba(45,80,22,0.08)] md:p-10">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-vibrant-green">Legal</p>
                    <h1 className="text-4xl font-black tracking-tight text-fairway-green md:text-5xl">Privacy Policy</h1>
                    <p className="mt-4 text-sm text-text-dark/70">Last updated: September 16, 2026</p>
                </header>

                <article className="rounded-2xl border border-fairway-green/15 bg-white p-6 shadow-[0_10px_30px_rgba(45,80,22,0.06)] md:p-10">
                    <div className="space-y-7 text-base leading-8 text-text-dark/90">
                        <p>
                            Chip Away Golf (&ldquo;Chip Away Golf,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates
                            chipawaygolf.com and provides golf-related articles, tools, and a golf scorekeeping application.
                        </p>
                        <p>
                            This Privacy Policy explains what information may be collected when you use Chip Away Golf, how that information is used,
                            and the choices available to you.
                        </p>

                        {sections.map((section) => {
                            if (section.title === "Contact") {
                                return (
                                    <section key={section.title} className="border-t border-fairway-green/10 pt-6 first:border-t-0 first:pt-0">
                                        <h2 className="mb-4 text-2xl font-bold text-fairway-green">{section.title}</h2>
                                        <div className="space-y-4">
                                            <p>
                                                Questions about this Privacy Policy or Chip Away Golf&apos;s information practices can be directed to:
                                            </p>
                                            <p>Chip Away Golf</p>
                                            <p>
                                                Email:{" "}
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

                                    {section.content && (
                                        <div className="space-y-4">
                                            {section.content.map((paragraph, index) => (
                                                <p key={`${section.title}-${index}`}>{paragraph}</p>
                                            ))}
                                        </div>
                                    )}

                                    {section.list && (
                                        <ul className="ml-6 list-disc space-y-2 text-text-dark/90">
                                            {section.list.map((item, index) => (
                                                <li key={`${section.title}-item-${index}`}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                </article>
            </div>
        </main>
    );
}
