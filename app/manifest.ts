import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Chip Away Golf",
        short_name: "Chip Away Golf",
        description:
            "Thoughtful golf writing, a free scorekeeper, and practical tools for golfers who believe progress matters more than perfection.",
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
