// Imports
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Get dir path to journal entries
const journalDir = path.join(process.cwd(), "content/journal");

export function getAllEntries() {
    return (
        fs
            // Get file names in array
            .readdirSync(journalDir)
            .map((file) => {
                // Get the raw file data
                const raw = fs.readFileSync(path.join(journalDir, file), "utf8");
                // Get the front matter
                const { data } = matter(raw);
                // Return the file name w/out file type as slug, and provide metadata for entry
                return { slug: file.replace(/\.mdx?$/, ""), meta: data };
            })
            // Need to sort by date, ya know, to be like an actual blog
            .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
    );
}

export function getEntry(slug: string) {
    // Get the specific entry
    const raw = fs.readFileSync(path.join(journalDir, `${slug}.mdx`), "utf8");
    // Get the front matter
    const { data, content } = matter(raw);
    return { meta: data, content };
}
