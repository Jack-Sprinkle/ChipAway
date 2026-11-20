import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Chip Away Golf",
        short_name: "Chip Away Golf",
        description:
            "A digital golf toolkit to track rounds, understand your game, learn courses, and build toward personalized pre-round plans.",
        start_url: "/",
        display: "standalone",
        background_color: "#f5f1e8",
        theme_color: "#2d5016",
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
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    };
}
