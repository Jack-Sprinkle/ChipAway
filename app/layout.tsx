import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { RoundProvider } from "./context/RoundContext";
import "./globals.css";

export const metadata: Metadata = {
    title: "ChipAway | Golf Score Tracking",
    description:
        "Simple, offline golf score tracking. No accounts, no GPS, no data selling. Privacy-first golf app.",
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
