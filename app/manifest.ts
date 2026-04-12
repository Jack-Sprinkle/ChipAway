import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "ChipAway",
        short_name: "ChipAway",
        description: "Simple golf score tracking that stays focused on your round.",
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
