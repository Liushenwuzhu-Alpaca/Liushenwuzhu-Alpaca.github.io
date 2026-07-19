import { execSync } from 'node:child_process'

/**
 * Determine a post's growth stage based on its publication and update dates.
 *
 * - <30 days since published → 种子 (Seed — freshly planted)
 * - Updated within 90 days (falls back to published date if no explicit updated date) → 生长中 (Growing — recently tended)
 * - Otherwise → 常青 (Evergreen — mature content)
 */
export function getGrowthStage(post: { published: Date, updated?: Date }): { stage: 'seed' | 'growing' | 'evergreen', label: string } {
  const now = Date.now()
  const DAY_MS = 86400_000

  const publishedAge = now - post.published.getTime()
  if (publishedAge < 30 * DAY_MS) {
    return { stage: 'seed', label: '种子' }
  }

  const lastUpdate = post.updated ?? post.published
  const updateAge = now - lastUpdate.getTime()
  if (updateAge <= 90 * DAY_MS) {
    return { stage: 'growing', label: '生长中' }
  }

  return { stage: 'evergreen', label: '常青' }
}

/**
 * Count the number of revisions (commits) affecting a given content file.
 *
 * Runs `git log --follow --format=%H -- "<contentPath>"` and returns the
 * number of commits. Requires the full git history — CI must use `fetch-depth: 0`.
 * Returns `null` on any error (no git history, file not tracked, etc.).
 */
export function getRevisionCount(contentPath: string): number | null {
  try {
    const stdout = execSync(`git log --follow --format=%H -- "${contentPath}"`, {
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: 10_000,
    })
    const lines = stdout.trim()
    return lines ? lines.split('\n').length : null
  }
  catch {
    return null
  }
}
