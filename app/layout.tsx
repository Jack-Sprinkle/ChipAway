import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { RoundProvider } from "./context/RoundContext";
import "./globals.css";

export const metadata: Metadata = {
    title: "ChipAway | Golf Score Tracking",
    description: "Simple, offline golf score tracking. No accounts, no GPS, no data selling. Privacy-first golf app.",
    applicationName: "ChipAway",
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
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={GeistSans.className}>
            <body>
                <RoundProvider>
                    <main>{children}</main>
                </RoundProvider>
            </body>
        </html>
    );
}
