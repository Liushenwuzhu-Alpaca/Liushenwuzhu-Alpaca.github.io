/**
 * 星盘代码高亮：自定义 Shiki 主题 + 代码块增强 transformer。
 *
 * 主题的 token 颜色全部写成 var(--sh-*)，Shiki 的 normalizeTheme 会把非 hex 颜色
 * 换成占位色再通过 colorReplacements 还原，最终 span 上输出 style="color:var(--sh-…)"。
 * --sh-* 在 src/styles/markdown.css 中映射到全局令牌，换配色、切明暗时代码颜色跟着变。
 *
 * transformer 支持三种写法：
 * - 文件名：```ts title="src/foo.ts"   -> <pre data-title="src/foo.ts">
 * - 行高亮：```ts {1,3-5}               -> 对应 span.line 加 .highlighted
 * - diff：行末 // [!code ++] / // [!code --]（也支持 #、--、<!-- -->、/* *\/）
 *         -> 删除注释文本，span.line 加 .diff.add / .diff.remove
 */

/** @param {string} name */
const v = name => `var(--sh-${name})`

/** @type {Exclude<NonNullable<import('astro').ShikiConfig['theme']>, string>} */
export const astrolabeTheme = {
  name: 'astrolabe',
  type: 'light',
  colors: {
    'editor.foreground': v('fg'),
    'editor.background': v('bg'),
  },
  tokenColors: [
    {
      scope: [
        'keyword.operator.accessor',
        'meta.group.braces.round.function.arguments',
        'meta.template.expression',
        'markup.fenced_code meta.embedded.block',
      ],
      settings: { foreground: v('fg') },
    },
    { scope: 'emphasis', settings: { fontStyle: 'italic' } },
    { scope: ['strong', 'markup.heading.markdown', 'markup.bold.markdown'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic.markdown'], settings: { fontStyle: 'italic' } },
    {
      scope: 'meta.link.inline.markdown',
      settings: { fontStyle: 'underline', foreground: v('keyword') },
    },
    {
      // 引号等字符串定界符跟随字符串色，避免被下方 punctuation 通配吃掉
      scope: ['string', 'punctuation.definition.string', 'markup.fenced_code', 'markup.inline'],
      settings: { foreground: v('string') },
    },
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.quoted.docstring.multi'],
      settings: { foreground: v('comment'), fontStyle: 'italic' },
    },
    {
      scope: [
        'constant.numeric',
        'constant.language',
        'constant.character.escape',
        'constant.other.placeholder',
        'constant.character.format.placeholder',
        'variable.language.this',
        'variable.other.constant',
        'support.constant',
      ],
      settings: { foreground: v('constant') },
    },
    {
      scope: [
        'variable.other.object',
        'variable.other.class',
        'meta.property-name',
        'meta.property-value',
        'support',
      ],
      settings: { foreground: v('function') },
    },
    {
      scope: [
        'keyword',
        'keyword.operator.new',
        'keyword.operator.expression',
        'storage.modifier',
        'storage.type',
        'storage.control.clojure',
        'entity.name.function.clojure',
        'entity.name.tag',
        'entity.name.tag.yaml',
        'support.function.node',
        'support.type.property-name.json',
        'punctuation.definition.template-expression',
      ],
      settings: { foreground: v('keyword') },
    },
    { scope: 'variable.parameter', settings: { foreground: v('parameter'), fontStyle: 'italic' } },
    {
      scope: [
        'support.function',
        'entity.name.type',
        'entity.other.inherited-class',
        'meta.function-call',
        'meta.instance.constructor',
        'entity.other.attribute-name',
        'entity.name.function',
        'constant.keyword.clojure',
      ],
      settings: { foreground: v('function') },
    },
    {
      scope: [
        'string.quoted',
        'string.regexp',
        'string.interpolated',
        'string.template',
        'string.unquoted.plain.out.yaml',
        'keyword.other.template',
      ],
      settings: { foreground: v('string') },
    },
    {
      scope: [
        'punctuation',
        'meta.brace',
        'keyword.operator',
        'meta.function-call.arguments',
      ],
      settings: { foreground: v('punctuation') },
    },
    {
      scope: ['markup.underline.link', 'punctuation.definition.metadata.markdown'],
      settings: { foreground: v('keyword') },
    },
    {
      scope: [
        'markup.inserted',
        'meta.diff.header.to-file',
        'punctuation.definition.inserted',
      ],
      settings: { foreground: v('inserted') },
    },
    {
      scope: [
        'markup.deleted',
        'meta.diff.header.from-file',
        'punctuation.definition.deleted',
      ],
      settings: { foreground: v('deleted') },
    },
    {
      scope: ['markup.changed', 'punctuation.definition.changed'],
      settings: { foreground: v('keyword') },
    },
  ],
}

// 行末 diff 标注：注释符 + [!code ++|--] + 可选的块注释收尾；匹配前先去掉行尾空白，删除后再去掉残留空白
const DIFF_MARK = /(?:\/\/|#|--|<!--|\/\*)\s*\[!code (\+\+|--)\]\s*(?:-->|\*\/)?$/
const TITLE_META = /\btitle=(?:"([^"]*)"|'([^']*)')/
const RANGE_META = /\{([\d\s,-]+)\}/

/**
 * 解析 {1,3-5} 为行号集合（1 起始）
 * @param {string} raw
 */
function parseRanges(raw) {
  const lines = new Set()
  for (const part of raw.split(',')) {
    const [start, end = start] = part.trim().split('-').map(n => Number.parseInt(n, 10))
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      continue
    }
    for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
      lines.add(i)
    }
  }
  return lines
}

/** @type {NonNullable<import('astro').ShikiConfig['transformers']>} */
export const astrolabeTransformers = [
  {
    name: 'astrolabe:code-meta',
    preprocess(code) {
      // Astro 把 ``` 后的 meta 原文放在 options.meta.__raw
      const raw = this.options.meta?.__raw ?? ''
      const title = raw.match(TITLE_META)
      // 去掉 title 再找行范围，避免文件名里的花括号被误判
      const range = raw.replace(TITLE_META, '').match(RANGE_META)

      /** @type {Map<number, 'add' | 'remove'>} */
      const diff = new Map()
      const stripped = code.split('\n').map((text, idx) => {
        const mark = text.trimEnd().match(DIFF_MARK)
        if (!mark) {
          return text
        }
        diff.set(idx + 1, mark[1] === '++' ? 'add' : 'remove')
        return text.slice(0, mark.index).trimEnd()
      })

      this.meta.astrolabe = {
        title: title ? (title[1] ?? title[2]) : '',
        highlighted: range ? parseRanges(range[1]) : new Set(),
        diff,
      }
      return diff.size ? stripped.join('\n') : code
    },
    pre(node) {
      const { title, highlighted, diff } = this.meta.astrolabe ?? {}
      if (title) {
        node.properties.dataTitle = title
      }
      if (highlighted?.size) {
        this.addClassToHast(node, 'has-highlighted')
      }
      if (diff?.size) {
        this.addClassToHast(node, 'has-diff')
      }
    },
    line(node, line) {
      const { highlighted, diff } = this.meta.astrolabe ?? {}
      if (highlighted?.has(line)) {
        this.addClassToHast(node, 'highlighted')
      }
      const type = diff?.get(line)
      if (type) {
        this.addClassToHast(node, ['diff', type])
      }
    },
  },
]
