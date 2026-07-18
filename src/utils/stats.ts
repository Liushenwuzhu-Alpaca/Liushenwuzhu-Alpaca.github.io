import { getCollection } from 'astro:content'

export interface WritingStats {
  totalChars: number
  daysSinceLaunch: number
}

/**
 * Count written characters across all published posts.
 * Each CJK ideograph counts as one character; each latin/digit run counts as one word.
 * Code blocks, URLs and markdown syntax are stripped before counting.
 */
export async function getWritingStats(): Promise<WritingStats> {
  const posts = await getCollection('posts', ({ data }) => !data.draft)

  let totalChars = 0
  let earliest = new Date()

  for (const post of posts) {
    if (post.data.published < earliest) {
      earliest = post.data.published
    }

    const text = (post.body ?? '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[#>*[\]!()-]/g, ' ')

    const cjk = text.match(/[\u3400-\u4DBF\u4E00-\u9FFF]/g)?.length ?? 0
    const latin = text.match(/[a-z0-9]+/gi)?.length ?? 0
    totalChars += cjk + latin
  }

  const daysSinceLaunch = Math.max(1, Math.ceil((Date.now() - earliest.getTime()) / 86_400_000))
  return { totalChars, daysSinceLaunch }
}
