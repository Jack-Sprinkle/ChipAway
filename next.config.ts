import type { NextConfig } from "next";
// serwist initial setup
import { spawnSync } from "child_process";
import withSerwistInit from "@serwist/next";

// get revisions/versions of cached files
const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout ?? crypto.randomUUID();

// setup initial config. with addition precached directories and cache routes/pages on user navigation
const withSerwist = withSerwistInit({
    additionalPrecacheEntries: [
        { url: "/", revision },
		{ url: "/toolkit", revision },
        { url: "/toolkit/round/new", revision },
        { url: "/toolkit/scores", revision },
		{ url: "/toolkit/stats", revision },
        { url: "/toolkit/practice", revision },
        { url: "/toolkit/~offline", revision },
    ],
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    cacheOnNavigation: true,
});

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: "/scorecard",
                destination: "/toolkit",
                permanent: true,
            },
            {
                source: "/scorecard/:path*",
                destination: "/toolkit/:path*",
                permanent: true,
            },
        ];
    },
};

export default withSerwist(nextConfig);
