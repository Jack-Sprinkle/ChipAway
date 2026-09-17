import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chipawaygolf.com";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: "Chip Away Golf | Golf Journal & Scorekeeper",
    description: "Thoughtful golf writing, a free scorekeeper, and practical tools for golfers who believe progress matters more than perfection.",
    applicationName: "Chip Away Golf",
    keywords: ["golf", "golf scorekeeper", "golf blog", "golf app", "golf journal", "golf improvement", "everyday golfers"],
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "ChipAway",
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
    alternates: {
        types: {
            "application/rss+xml": `${siteUrl}/rss.xml`,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={GeistSans.className}>
            <body className="bg-cream text-text-dark antialiased">
                <Header />
                {children}
                <Footer />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
