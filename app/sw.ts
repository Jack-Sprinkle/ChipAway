import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, StaleWhileRevalidate } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const roundScorePath = /^\/round\/[^/]+\/score$/;

function isHtmlDocumentRequest(request: Request) {
    return request.mode === "navigate" || request.headers.get("accept")?.includes("text/html") === true;
}

const roundScoreRoute = {
    matcher: ({ sameOrigin, request, url }: { sameOrigin: boolean; request: Request; url: URL }) =>
        sameOrigin && request.method === "GET" && isHtmlDocumentRequest(request) && roundScorePath.test(url.pathname),
    handler: new StaleWhileRevalidate({
        cacheName: "round-score-pages",
        plugins: [
            {
                cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
                    const url = new URL(request.url);
                    url.search = "";

                    return new Request(url.toString(), {
                        method: request.method,
                        headers: request.headers,
                    });
                },
            },
        ],
    }),
} as const;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [roundScoreRoute, ...defaultCache],
    fallbacks: {
        entries: [
            {
                url: "/~offline",
                matcher({ request }) {
                    return request.destination === "document";
                },
            },
        ],
    },
});

serwist.addEventListeners();
