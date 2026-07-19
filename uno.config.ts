import {
  defineConfig,
  presetAttributify,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// Semantic colors resolve to CSS variables defined in src/styles/global.css.
// This replaces unocss-preset-theme: its generated variables were incompatible
// with presetWind3's oklch(var(...)) color output, which silently dropped every
// theme color declaration.
const semanticColors: Record<string, { v: string, alpha?: string }> = {
  primary: { v: '--ink' },
  secondary: { v: '--ink-soft' },
  background: { v: '--paper' },
  highlight: { v: '--accent', alpha: 'var(--hl-alpha)' },
  note: { v: '--note' },
  tip: { v: '--tip' },
  important: { v: '--important' },
  warning: { v: '--warning' },
  caution: { v: '--caution' },
}

function semanticColor(property: 'color' | 'background-color' | 'border-color' | 'text-decoration-color') {
  return (match: RegExpMatchArray) => {
    const [, name, alpha] = match
    const entry = semanticColors[name]
    if (!entry) {
      return undefined
    }
    const percent = alpha ? `${alpha}%` : entry.alpha ?? '100%'
    return { [property]: `color-mix(in oklab, var(${entry.v}) ${percent}, transparent)` }
  }
}

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
  ],
  rules: [
    [/^c-(\w+)(?:\/(\d+))?$/, semanticColor('color')],
    [/^bg-(\w+)(?:\/(\d+))?$/, semanticColor('background-color')],
    [/^border-(\w+)(?:\/(\d+))?$/, semanticColor('border-color')],
    [/^decoration-(\w+)(?:\/(\d+))?$/, semanticColor('text-decoration-color')],
    ['scrollbar-hidden', {
      'scrollbar-width': 'none',
      '-ms-overflow-style': 'none',
    }],
  ],
  shortcuts: {
    'uno-round-border': 'border border-secondary/15 border-solid',
  },
  variants: [
    (matcher) => {
      if (!matcher.startsWith('cjk:')) {
        return matcher
      }
      return {
        matcher: matcher.slice(4),
        selector: s => `${s}:is(:lang(zh), :lang(ja), :lang(ko))`,
      }
    },
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
