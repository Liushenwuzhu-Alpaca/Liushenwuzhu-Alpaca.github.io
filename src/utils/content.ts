import type { CollectionEntry } from 'astro:content'
import type { Language } from '@/i18n/config'
import type { Post } from '@/types'
import { getCollection, render } from 'astro:content'
import { defaultLocale } from '@/config'
import { memoize } from '@/utils/cache'

const metaCache = new Map<string, { minutes: number }>()

/**
 * Add metadata including reading time to a post
 *
 * @param post The post to enhance with metadata
 * @returns Enhanced post with reading time information
 */
export async function addMetaToPost(post: CollectionEntry<'posts'>): Promise<Post> {
  const cacheKey = `${post.id}-${post.data.lang || 'universal'}`
  const cachedMeta = metaCache.get(cacheKey)
  if (cachedMeta) {
    return {
      ...post,
      remarkPluginFrontmatter: cachedMeta,
    }
  }

  const { remarkPluginFrontmatter } = await render(post)
  const meta = remarkPluginFrontmatter as { minutes: number }
  metaCache.set(cacheKey, meta)

  return {
    ...post,
    remarkPluginFrontmatter: meta,
  }
}

/**
 * Find duplicate post slugs within the same language
 *
 * @param posts Array of blog posts to check
 * @returns Array of descriptive error messages for duplicate slugs
 */
export async function checkPostSlugDuplication(posts: CollectionEntry<'posts'>[]): Promise<string[]> {
  const slugMap = new Map<string, Set<string>>()
  const duplicates: string[] = []

  posts.forEach((post) => {
    const lang = post.data.lang
    const slug = post.data.abbrlink || post.id.replace(/\.(md|mdx)$/, '')

    let slugSet = slugMap.get(lang)
    if (!slugSet) {
      slugSet = new Set()
      slugMap.set(lang, slugSet)
    }

    if (!slugSet.has(slug)) {
      slugSet.add(slug)
      return
    }

    if (!lang) {
      duplicates.push(`Duplicate slug "${slug}" found in universal post (applies to all languages)`)
    }
    else {
      duplicates.push(`Duplicate slug "${slug}" found in "${lang}" language post`)
    }
  })

  return duplicates
}

/**
 * Get all posts (including pinned ones, excluding drafts in production)
 *
 * @param lang The language code to filter by, defaults to site's default language
 * @returns Posts filtered by language, enhanced with metadata, sorted by date
 */
async function _getPosts(lang?: Language) {
  const currentLang = lang || defaultLocale

  const filteredPosts = await getCollection(
    'posts',
    ({ data }: CollectionEntry<'posts'>) => {
      // Show drafts in dev mode only
      const shouldInclude = import.meta.env.DEV || !data.draft
      return shouldInclude && (data.lang === currentLang || data.lang === '')
    },
  )

  const enhancedPosts = await Promise.all(filteredPosts.map(addMetaToPost))

  return enhancedPosts.sort((a, b) =>
    b.data.published.valueOf() - a.data.published.valueOf(),
  )
}

export const getPosts = memoize(_getPosts)

/**
 * Get all non-pinned posts
 *
 * @param lang The language code to filter by, defaults to site's default language
 * @returns Regular posts (non-pinned), filtered by language
 */
async function _getRegularPosts(lang?: Language) {
  const posts = await getPosts(lang)
  return posts.filter(post => !post.data.pin)
}

export const getRegularPosts = memoize(_getRegularPosts)

/**
 * Get pinned posts sorted by pin priority
 *
 * @param lang The language code to filter by, defaults to site's default language
 * @returns Pinned posts sorted by pin value in descending order
 */
async function _getPinnedPosts(lang?: Language) {
  const posts = await getPosts(lang)
  return posts
    .filter(post => post.data.pin && post.data.pin > 0)
    .sort((a, b) => (b.data.pin ?? 0) - (a.data.pin ?? 0))
}

export const getPinnedPosts = memoize(_getPinnedPosts)

/**
 * Group posts by year and sort within each year
 *
 * @param lang The language code to filter by, defaults to site's default language
 * @returns Map of posts grouped by year (descending), sorted by date within each year
 */
async function _getPostsByYear(lang?: Language): Promise<Map<number, Post[]>> {
  const posts = await getPosts(lang)
  const yearMap = new Map<number, Post[]>()

  posts.forEach((post: Post) => {
    const year = post.data.published.getFullYear()
    let yearPosts = yearMap.get(year)
    if (!yearPosts) {
      yearPosts = []
      yearMap.set(year, yearPosts)
    }
    yearPosts.push(post)
  })

  // Sort posts within each year by date
  yearMap.forEach((yearPosts) => {
    yearPosts.sort((a, b) => {
      const aDate = a.data.published
      const bDate = b.data.published
      return bDate.getMonth() - aDate.getMonth() || bDate.getDate() - aDate.getDate()
    })
  })

  return new Map([...yearMap.entries()].sort((a, b) => b[0] - a[0]))
}

export const getPostsByYear = memoize(_getPostsByYear)

/**
 * Group posts by their tags
 *
 * @param lang The language code to filter by, defaults to site's default language
 * @returns Map where keys are tag names and values are arrays of posts with that tag
 */
async function _getPostsGroupByTags(lang?: Language) {
  const posts = await getPosts(lang)
  const tagMap = new Map<string, Post[]>()

  posts.forEach((post: Post) => {
    post.data.tags?.forEach((tag: string) => {
      let tagPosts = tagMap.get(tag)
      if (!tagPosts) {
        tagPosts = []
        tagMap.set(tag, tagPosts)
      }
      tagPosts.push(post)
    })
  })

  return tagMap
}

export const getPostsGroupByTags = memoize(_getPostsGroupByTags)

/**
 * Get all tags sorted by post count
 *
 * @param lang The language code to filter by, defaults to site's default language
 * @returns Array of tags sorted by popularity (most posts first)
 */
async function _getAllTags(lang?: Language) {
  const tagMap = await getPostsGroupByTags(lang)
  const tagsWithCount = Array.from(tagMap.entries())

  tagsWithCount.sort((a, b) => b[1].length - a[1].length)
  return tagsWithCount.map(([tag]) => tag)
}

export const getAllTags = memoize(_getAllTags)

/**
 * Get all posts that contain a specific tag
 *
 * @param tag The tag name to filter posts by
 * @param lang The language code to filter by, defaults to site's default language
 * @returns Array of posts that contain the specified tag
 */
async function _getPostsByTag(tag: string, lang?: Language) {
  const tagMap = await getPostsGroupByTags(lang)
  return tagMap.get(tag) ?? []
}

export const getPostsByTag = memoize(_getPostsByTag)

/**
 * Check which languages support a specific tag
 *
 * @param tag The tag name to check language support for
 * @returns Array of language codes that support the specified tag
 */
async function _getTagSupportedLangs(tag: string): Promise<Language[]> {
  const posts = await getCollection(
    'posts',
    ({ data }) => !data.draft,
  )
  const { allLocales } = await import('@/config')

  return allLocales.filter(locale =>
    posts.some(post =>
      post.data.tags?.includes(tag)
      && (post.data.lang === locale || post.data.lang === ''),
    ),
  )
}

export const getTagSupportedLangs = memoize(_getTagSupportedLangs)

/**
 * Get adjacent (previous and next) posts relative to a given post.
 *
 * "Previous" is the newer post (closer to today), "next" is the older post (farther from today).
 * Returns null if no adjacent post exists in either direction.
 *
 * @param slug The abbrlink or id of the current post
 * @param lang The language code to filter by
 * @returns An object with `prev` and `next` posts, or null for either
 */
export async function getAdjacentPosts(slug: string, lang?: Language): Promise<{ prev: Post | null, next: Post | null }> {
  const posts = await getPosts(lang)
  const currentIndex = posts.findIndex(post => (post.data.abbrlink || post.id.replace(/\.(md|mdx)$/, '')) === slug)
  if (currentIndex === -1)
    return { prev: null, next: null }

  return {
    prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  }
}

/**
 * Get related posts that share tags with the current post.
 *
 * Results are sorted by the number of shared tags (descending), then by published date (descending).
 * The current post itself is excluded.
 *
 * @param slug The abbrlink or id of the current post
 * @param lang The language code to filter by
 * @param count Maximum number of related posts to return (default 3)
 * @returns An array of related posts
 */
export async function getRelatedPosts(slug: string, lang?: Language, count: number = 3): Promise<Post[]> {
  const posts = await getPosts(lang)
  const currentPost = posts.find(post => (post.data.abbrlink || post.id.replace(/\.(md|mdx)$/, '')) === slug)
  if (!currentPost || !currentPost.data.tags?.length)
    return []

  const currentTags = new Set(currentPost.data.tags)

  return posts
    .filter(post => (post.data.abbrlink || post.id.replace(/\.(md|mdx)$/, '')) !== slug)
    .map(post => ({
      post,
      sharedTagCount: post.data.tags ? post.data.tags.filter(tag => currentTags.has(tag)).length : 0,
    }))
    .filter(entry => entry.sharedTagCount > 0)
    .sort((a, b) => {
      const tagDiff = b.sharedTagCount - a.sharedTagCount
      if (tagDiff !== 0)
        return tagDiff
      return b.post.data.published.valueOf() - a.post.data.published.valueOf()
    })
    .slice(0, count)
    .map(entry => entry.post)
}

/**
 * Get all posts that belong to the same series, sorted by published date.
 * The current post is included with an `isCurrent` flag.
 * Returns null if the post has no series or no other posts share the series.
 *
 * @param slug The abbrlink or id of the current post
 * @param lang The language code to filter by
 * @returns An object with series name and posts array, or null
 */
export async function getSeriesPosts(slug: string, lang?: Language): Promise<{ series: string, posts: Array<Post & { isCurrent: boolean }> } | null> {
  const posts = await getPosts(lang)
  const currentPost = posts.find(post => (post.data.abbrlink || post.id.replace(/\.(md|mdx)$/, '')) === slug)
  if (!currentPost || !currentPost.data.series)
    return null

  const seriesName = currentPost.data.series
  const seriesPosts = posts
    .filter(post => post.data.series === seriesName)
    .sort((a, b) => a.data.published.valueOf() - b.data.published.valueOf())
    .map(post => ({
      ...post,
      isCurrent: (post.data.abbrlink || post.id.replace(/\.(md|mdx)$/, '')) === slug,
    }))

  if (seriesPosts.length < 2)
    return null

  return { series: seriesName, posts: seriesPosts }
}
