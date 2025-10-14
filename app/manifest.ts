import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "MyScorecard",
        short_name: "MyScorecard",
        description: "A Progressive Web App to keep track of your golf rounds",
        start_url: "/",
        display: "standalone",
        background_color: "#e5e7eb",
        theme_color: "#3b82f6",
        orientation: "portrait",
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
