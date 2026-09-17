import { getAllEntries } from "@/lib/journal";

const SITE_URL = "https://chipawaygolf.com";

function escapeXml(value: string) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
    const entries = getAllEntries();

    const items = entries
        .map(
            ({ slug, meta }) => `
                <item>
                    <title>${escapeXml(meta.title)}</title>
                    <link>${SITE_URL}/journal/${slug}</link>
                    <guid isPermaLink="true">${SITE_URL}/journal/${slug}</guid>
                    <description>${escapeXml(meta.description)}</description>
                    <pubDate>${new Date(meta.date).toUTCString()}</pubDate>
                    <dc:creator>${escapeXml(meta.author)}</dc:creator>
                    ${meta.tags.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join("")}
                </item>
            `,
        )
        .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
        <title>Chip Away Golf Journal</title>
        <link>${SITE_URL}/journal</link>
        <description>Golf is hard. Enjoy it anyway.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

        ${items}
    </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        },
    });
}
