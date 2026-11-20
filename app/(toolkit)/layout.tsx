import { RoundProvider } from "./toolkit/context/RoundContext";

export default function ToolkitLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <RoundProvider>{children}</RoundProvider>;
}
