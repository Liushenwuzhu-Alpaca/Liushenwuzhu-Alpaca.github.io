import type { CollectionEntry } from 'astro:content'
import type CanvasKitInitFn from 'canvaskit-wasm'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { OGImageRoute } from 'astro-og-canvas'
import { getCollection } from 'astro:content'
import { getPostDescription } from '@/utils/description'

// 分享卡片固定使用 brass 亮色配色，不随访客所选配色变化
const INK: [number, number, number] = [31, 28, 24] // #1F1C18 标题
const INK_SOFT: [number, number, number] = [74, 67, 56] // #4A4338 描述
const PAPER: [number, number, number] = [242, 236, 224] // #F2ECE0 纸色
const GLYPH = '#5A4120' // 塔语字形色

// 卡片版式：文字区左上留白 PAD；右侧 ASIDE 宽度让给星盘水印
const PAD = 80
const ASIDE = 300

// 背景图：纸色底、右侧半透明星盘水印、底部站名与细线（1200x630，不透明）
const BG_PATH = './src/assets/og/og-bg.png'
const HYMMNOS_FONT = './public/fonts/Hymmnos.woff2'
const CHANT_DIR = './node_modules/.astro-og-canvas/hymmnos'

// eslint-disable-next-line antfu/no-top-level-await
const posts = await getCollection('posts')

// astro-og-canvas 只排 title 与 description 两段文字，且 logo 与标题间距至少一个 padding；
// 塔语副标题改为画进每篇文章自己的背景图：在通用背景上、标题正上方的留白里排咏唱名
async function renderChantBackgrounds(chants: string[]): Promise<Map<string, string>> {
  const backgrounds = new Map<string, string>()
  if (chants.length === 0)
    return backgrounds

  // 运行时 require，避免 Vite 打包 emscripten 产物；wasm 文件从仓库根目录解析
  const require = createRequire(path.join(process.cwd(), 'package.json'))
  const CanvasKitInit: typeof CanvasKitInitFn = require('canvaskit-wasm/full')
  const ck = await CanvasKitInit({
    locateFile: (file: string) => require.resolve(`canvaskit-wasm/bin/full/${file}`),
  })
  const fontData = await fs.readFile(HYMMNOS_FONT)
  const fontMgr = ck.FontMgr.FromData(fontData.buffer.slice(fontData.byteOffset, fontData.byteOffset + fontData.byteLength))
  if (!fontMgr)
    throw new Error(`[og] 无法加载塔语字体 ${HYMMNOS_FONT}`)
  const bgData = await fs.readFile(BG_PATH)
  const bgImage = ck.MakeImageFromEncoded(bgData)
  if (!bgImage)
    throw new Error(`[og] 无法解码背景图 ${BG_PATH}`)
  await fs.mkdir(CHANT_DIR, { recursive: true })

  for (const chant of new Set(chants)) {
    const builder = ck.ParagraphBuilder.Make(new ck.ParagraphStyle({
      textStyle: {
        color: ck.parseColorString(GLYPH),
        fontFamilies: ['Hymmnos'],
        fontSize: 30,
      },
    }), fontMgr)
    builder.addText(chant)
    const paragraph = builder.build()
    paragraph.layout(1200 - PAD * 2 - ASIDE)

    const surface = ck.MakeSurface(bgImage.width(), bgImage.height())
    if (!surface)
      throw new Error(`[og] 无法创建塔语画布：${chant}`)
    const canvas = surface.getCanvas()
    canvas.drawImage(bgImage, 0, 0)
    // 咏唱名底边贴近标题首行上沿
    canvas.drawParagraph(paragraph, PAD, PAD - 8 - paragraph.getHeight())
    const bytes = surface.makeImageSnapshot().encodeToBytes()
    paragraph.delete()
    builder.delete()
    surface.dispose()
    if (!bytes)
      throw new Error(`[og] 塔语背景编码失败：${chant}`)

    const file = path.join(CHANT_DIR, `${createHash('sha1').update(chant).digest('hex').slice(0, 12)}.png`)
    await fs.writeFile(file, bytes)
    backgrounds.set(chant, file)
  }
  bgImage.delete()
  fontMgr.delete()
  return backgrounds
}

// eslint-disable-next-line antfu/no-top-level-await
const chantBackgrounds = await renderChantBackgrounds(
  posts.flatMap((post: CollectionEntry<'posts'>) => post.data.hymmnos ? [post.data.hymmnos] : []),
)

// 文章 id 到卡片内容的映射
const pages = Object.fromEntries(
  posts.map((post: CollectionEntry<'posts'>) => [
    post.id,
    {
      title: post.data.title,
      description: getPostDescription(post, 'og'),
      bgPath: (post.data.hymmnos && chantBackgrounds.get(post.data.hymmnos)) || BG_PATH,
    },
  ]),
)

// eslint-disable-next-line antfu/no-top-level-await
export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'image',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [PAPER],
    bgImage: {
      path: page.bgPath,
      fit: 'none',
      position: 'start',
    },
    // 背景图在边框之后绘制并整幅覆盖，这里的边框只用来把文字区从右侧星盘水印处让开，不会显示
    border: {
      color: PAPER,
      width: ASIDE,
      side: 'inline-end',
    },
    padding: PAD,
    font: {
      title: {
        families: ['Noto Sans SC'],
        weight: 'Bold',
        size: 54,
        color: INK,
        lineHeight: 1.35,
      },
      description: {
        families: ['Noto Sans SC'],
        size: 24,
        color: INK_SOFT,
        lineHeight: 1.6,
      },
    },
    fonts: [
      './public/fonts/NotoSansSC-Bold.otf',
      './public/fonts/NotoSansSC-Regular.otf',
    ],
  }),
})
