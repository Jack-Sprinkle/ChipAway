import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const journalDir = path.join(process.cwd(), 'content/journal')

export function getAllEntries() {
  return fs.readdirSync(journalDir).map((file) => {
    const raw = fs.readFileSync(path.join(journalDir, file), 'utf8')
    const { data } = matter(raw)
    return { slug: file.replace(/\.mdx?$/, ''), meta: data }
  })
}

export function getEntry(slug: string) {
  const raw = fs.readFileSync(path.join(journalDir, `${slug}.mdx`), 'utf8')
  const { data, content } = matter(raw)
  return { meta: data, content }
}