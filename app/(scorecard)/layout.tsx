import { RoundProvider } from "./scorecard/context/RoundContext";

export default function ScorecardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <RoundProvider>{children}</RoundProvider>;
}
