import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Welcome",
    description: "Next.js app with Tailwind",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
