"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathName = usePathname();

    return (
        <header className="container-sm bg-blue-500">
            <nav>
                <ul className="flex flex-col sm:flex-row sm:gap-4">
                    <li
                        className={
                            pathName === "/"
                                ? "text-white underline"
                                : "text-white"
                        }
                    >
                        <Link href="/">Home</Link>
                    </li>
                    <li
                        className={
                            pathName === "/current"
                                ? "text-white underline"
                                : "text-white"
                        }
                    >
                        <Link href="/current">Current Round</Link>
                    </li>
                    <li
                        className={
                            pathName === "/bag"
                                ? "text-white underline"
                                : "text-white"
                        }
                    >
                        <Link href="/bag">My Bag</Link>
                    </li>
                    <li
                        className={
                            pathName === "/previous"
                                ? "text-white underline"
                                : "text-white"
                        }
                    >
                        <Link href="/previous">Previous Rounds</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
