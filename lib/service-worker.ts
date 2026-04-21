type UrlToCache = string | [string, RequestInit?];

export async function cacheUrls(urls: UrlToCache[]): Promise<boolean> {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        return false;
    }

    const registration = await navigator.serviceWorker.ready.catch(() => undefined);
    const worker = navigator.serviceWorker.controller ?? registration?.active;

    if (!worker) {
        return false;
    }

    return await new Promise<boolean>((resolve) => {
        const channel = new MessageChannel();
        const timeoutId = window.setTimeout(() => resolve(false), 3000);

        channel.port1.onmessage = () => {
            window.clearTimeout(timeoutId);
            resolve(true);
        };

        worker.postMessage(
            {
                type: "CACHE_URLS",
                payload: {
                    urlsToCache: urls,
                },
            },
            [channel.port2],
        );
    });
}
