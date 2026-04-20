import type { NextConfig } from "next";
import { spawnSync } from "child_process";
import withSerwistInit from "@serwist/next";

const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout ?? crypto.randomUUID();

const withSerwist = withSerwistInit({
    additionalPrecacheEntries: [
        { url: "/", revision },
        { url: "/round/new", revision },
        { url: "/scores", revision },
        { url: "/~offline", revision },
    ],
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    cacheOnNavigation: true,
});

const nextConfig: NextConfig = {
    /* config options here */
};

export default withSerwist(nextConfig);
