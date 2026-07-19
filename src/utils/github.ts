export interface RepoInfo {
  name: string
  description: string | null
  url: string
  stars: number
  language: string | null
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
}

function parseStarCount(text: string): number {
  const normalized = text.trim().replace(/,/g, '')
  const value = Number.parseFloat(normalized)
  if (Number.isNaN(value)) {
    return 0
  }
  return /k$/i.test(normalized) ? Math.round(value * 1000) : Math.round(value)
}

/**
 * Fetch a user's profile-pinned repos at build time by scraping the public
 * profile page HTML. The GraphQL pinnedItems API needs a token; the profile
 * page renders pinned items server-side, so no auth is required.
 * Returns null on any failure so callers can fall back to static data.
 */
export async function getPinnedRepos(user: string): Promise<RepoInfo[] | null> {
  try {
    const res = await fetch(`https://github.com/${user}`, {
      headers: { 'User-Agent': 'astro-build' },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok)
      return null

    const html = await res.text()
    const blocks = html.match(/<li\s+class="[^"]*pinned-item-list-item[^"]*"[\s\S]*?<\/li>/g)
    if (!blocks || blocks.length === 0)
      return null

    const repos: RepoInfo[] = []
    for (const block of blocks.slice(0, 6)) {
      // The first owner/repo link inside a pinned card is the repo itself.
      const link = block.match(/<a [^>]*href="(\/[^/"]+\/[^/"]+)"/)
      if (!link)
        continue

      const desc = block.match(/<p class="pinned-item-desc[^"]*"[^>]*>([\s\S]*?)<\/p>/)
      const language = block.match(/itemprop="programmingLanguage"[^>]*>([^<]+)</)
      const stars = block.match(/href="[^"]*\/stargazers"[\s\S]*?<\/a>/)

      repos.push({
        name: link[1].split('/').pop()!,
        description: desc ? decodeEntities(desc[1].replace(/<[^>]*>/g, '')).trim() || null : null,
        url: `https://github.com${link[1]}`,
        stars: stars ? parseStarCount(stars[0].replace(/<[^>]*>/g, '')) : 0,
        language: language ? language[1].trim() : null,
      })
    }

    return repos.length > 0 ? repos : null
  }
  catch {
    return null
  }
}

/**
 * Fetch a user's public repos at build time via the unauthenticated
 * GitHub REST API (rate limit: 60 req/hour per IP - fine for CI builds).
 * Returns null on any failure so callers can fall back to static data.
 */
export async function getPublicRepos(user: string): Promise<RepoInfo[] | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&direction=desc`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'astro-build',
        },
        // Abort a hanging connection so builds degrade to the static fallback.
        signal: AbortSignal.timeout(8_000),
      },
    )
    if (!res.ok)
      return null

    const repos = (await res.json()) as Array<{
      fork: boolean
      name: string
      description: string | null
      html_url: string
      stargazers_count: number
      language: string | null
    }>

    return repos
      .filter(repo => !repo.fork)
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
      }))
  }
  catch {
    return null
  }
}
