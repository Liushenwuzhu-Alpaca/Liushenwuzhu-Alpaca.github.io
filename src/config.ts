import type { ThemeConfig } from '@/types'

export const themeConfig: ThemeConfig = {
  // SITE INFORMATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  site: {
    // site title
    title: 'Liushenwuzhu-Alpaca 的 Blog',
    subtitle: '计算机学习笔记与生活记录',
    description: 'Liushenwuzhu-Alpaca 的个人博客，记录计算机专业学习、项目实践与日常思考。',
    i18nTitle: false,
    author: 'Liushenwuzhu-Alpaca',
    url: 'https://liushenwuzhu-alpaca.github.io',
    base: '/',
    favicon: '/icons/favicon.svg',
  },
  // SITE INFORMATION >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // COLOR SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  color: {
    // default theme mode
    mode: 'auto',
    light: {
      primary: '#1B1E1C',
      secondary: '#1B1E1C / 0.68',
      background: '#F4F4EF',
      highlight: '#3A5F52 / 0.22',
    },
    dark: {
      primary: '#E5E4DB',
      secondary: '#E5E4DB / 0.68',
      background: '#1A1C1B',
      highlight: '#82A898 / 0.26',
    },
  },
  // COLOR SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // GLOBAL SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  global: {
    // default language
    locale: 'zh',
    moreLocales: [],
    fontStyle: 'serif',
    dateFormat: 'YYYY-MM-DD',
    toc: true,
    katex: true,
    reduceMotion: false,
  },
  // GLOBAL SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // COMMENT SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START
  comment: {
    // enable comment system
    enabled: true,
    giscus: {
      repo: 'Liushenwuzhu-Alpaca/Liushenwuzhu-Alpaca.github.io',
      repoId: 'R_kgDOTbsCfg',
      category: 'General',
      categoryId: 'DIC_kwDOTbsCfs4DBbrr',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
    },
    twikoo: {
      envId: '',
    },
    waline: {
      serverURL: '',
      emoji: [],
      search: false,
      imageUploader: false,
    },
  },
  // COMMENT SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END

  // SEO SETTINGS
  seo: {
    twitterID: '',
    verification: {
      google: '',
      bing: '',
      yandex: '',
      baidu: '',
    },
    googleAnalyticsID: '',
    umamiAnalyticsID: '',
    folo: {
      feedID: '',
      userID: '',
    },
    apiflashKey: '',
  },

  // FOOTER SETTINGS
  footer: {
    links: [
      {
        name: 'RSS',
        url: '/rss.xml',
      },
      {
        name: '装备',
        url: '/uses/',
      },
      {
        name: '书单',
        url: '/books/',
      },
      {
        name: '相册',
        url: '/photos/',
      },
      {
        name: 'GitHub',
        url: 'https://github.com/Liushenwuzhu-Alpaca',
      },
    ],
    startYear: 2026,
  },

  // PRELOAD SETTINGS
  preload: {
    imageHostURL: '',
    customGoogleAnalyticsJS: '',
    customUmamiAnalyticsJS: '',
  },
  // PRELOAD SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END
}

export const base = themeConfig.site.base === '/' ? '' : themeConfig.site.base.replace(/\/$/, '')
export const defaultLocale = themeConfig.global.locale
export const moreLocales = themeConfig.global.moreLocales
export const allLocales = [defaultLocale, ...moreLocales]

// Switchable color palettes. Each palette provides paper/ink/accent/hairline
// tokens for both light and dark modes in src/styles/global.css.
export const themePalettes = [
  { id: 'paper', label: '纸', light: '#F4F4EF', dark: '#1A1C1B' },
  { id: 'silk', label: '绢', light: '#F4EBDB', dark: '#201913' },
  { id: 'indigo', label: '黛', light: '#EDF0F2', dark: '#131A21' },
] as const

// Hidden switchable color palettes. Unlocked via Konami code (↑↑↓↓←→←→BA).
export const secretPalettes = [
  { id: 'cinnabar', label: '砂', light: '#F5E8E0', dark: '#1F1310' },
] as const
