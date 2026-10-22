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
    umamiAnalyticsID: '73ba0587-7fd8-4ba8-9079-c9bc121d8e00',
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

// 可切换配色：light/dark 为 <meta name="theme-color"> 用的纸色，swatch 为配色菜单色块。
// 各配色的亮暗令牌定义在 src/styles/global.css。
export const themePalettes = [
  { id: 'brass', label: '铜', light: '#F2ECE0', dark: '#0C1018', swatch: '#B08D57' },
  { id: 'silver', label: '银', light: '#F2F4F7', dark: '#0F1420', swatch: '#6F98A0' },
  { id: 'verdigris', label: '青', light: '#EEF0E8', dark: '#0D1512', swatch: '#6E9A86' },
  { id: 'ink', label: '墨', light: '#F4F3EF', dark: '#111111', swatch: '#8A877F' },
] as const

// 隐藏配色：Konami 码（↑↑↓↓←→←→BA）解锁。
export const secretPalettes = [
  { id: 'violet', label: '檀', light: '#F4F0F5', dark: '#14101B', swatch: '#9A7FB0' },
] as const
