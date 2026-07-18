export interface RepoInfo {
  name: string
  description: string | null
  url: string
  stars: number
  language: string | null
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
