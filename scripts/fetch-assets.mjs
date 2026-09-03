/**
 * 一次性素材抓取脚本（不参与打包，仅在需要更新素材时手动执行）
 *   node scripts/fetch-assets.mjs
 *
 * 作用：把参考站上的远程素材抓到本地并压缩，避免运行时直接引用 6.8MB/张 的原图。
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

// sharp 装在隔离工作区里（不污染项目依赖），用 CJS require 按绝对路径载入，
// 因为 ESM 的解析规则不看 NODE_PATH。
const require = createRequire(import.meta.url)
const SHARP_HOME =
  process.env.SHARP_HOME ||
  'C:/Users/Dark1227/.workbuddy/binaries/node/workspace/node_modules/sharp'
const sharp = require(SHARP_HOME)

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public', 'media')
const RAW = path.join(ROOT, '.tmp-raw')

const GIFS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

const PORTRAIT =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png'

const FLOATERS = [
  ['moon', 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png'],
  ['object', 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png'],
  ['lego', 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png'],
  ['group', 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png'],
]

const H = 'https://images.higgs.ai/?default=1&output=webp&url='
const CF = 'https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2F'
const PROJECT_IMGS = [
  ['p1-1', 'hf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png'],
  ['p1-2', 'hf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png'],
  ['p1-3', 'hf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png'],
  ['p2-1', 'hf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png'],
  ['p2-2', 'hf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png'],
  ['p2-3', 'hf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png'],
  ['p3-1', 'hf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png'],
  ['p3-2', 'hf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png'],
  ['p3-3', 'hf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png'],
].map(([n, f]) => [n, `${H}${CF}${f}&w=1600&q=86`])

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(90000) })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      return Buffer.from(await r.arrayBuffer())
    } catch (e) {
      if (i === tries - 1) throw e
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)))
    }
  }
}

async function pool(items, limit, fn) {
  const out = []
  for (let i = 0; i < items.length; i += limit) {
    const slice = items.slice(i, i + limit)
    out.push(...(await Promise.allSettled(slice.map(fn))))
  }
  return out
}

async function main() {
  await mkdir(OUT, { recursive: true })
  await mkdir(RAW, { recursive: true })
  const log = []
  const kb = (b) => (b.length / 1024).toFixed(0) + 'KB'

  // 1. 跑马灯动图 -> 压到 460x296
  await pool(
    GIFS.map((u, i) => [u, i]),
    5,
    async ([url, i]) => {
      const name = String(i + 1).padStart(2, '0')
      const rawPath = path.join(RAW, name + '.gif')
      let buf
      if (existsSync(rawPath)) buf = await import('node:fs/promises').then((m) => m.readFile(rawPath))
      else {
        buf = await get(url)
        await writeFile(rawPath, buf)
      }
      // 注意：sharp 的 GIF 编码器对这种帧数（80~120 帧）压缩率极差，
      // 甚至会越压越大；动画 WebP 才是正解，同画质下体积约为原来的 1/30。
      const out = await sharp(buf, { animated: true })
        .resize(360, 232, { fit: 'cover' })
        .webp({ quality: 24, effort: 4 })
        .toBuffer()
      await writeFile(path.join(OUT, `marquee-${name}.webp`), out)
      log.push(`marquee-${name}.webp  ${kb(buf)} -> ${kb(out)}`)

      // Hero 背景「动态墙」：更小、更狠的压缩，控制在 ~100KB/张
      if (i < 8) {
        const wall = await sharp(buf, { animated: true })
          .resize(260, 168, { fit: 'cover' })
          .modulate({ saturation: 0.5 })
          .webp({ quality: 12, effort: 4 })
          .toBuffer()
        await writeFile(path.join(OUT, `wall-${name}.webp`), wall)
        log.push(`wall-${name}.webp    ${kb(buf)} -> ${kb(wall)}`)
      }
    }
  )

  // 2. 人像 / 悬浮装饰
  const statics = [
    ['portrait.webp', PORTRAIT, async (b) => sharp(b).resize(1200).webp({ quality: 88 })],
    ...FLOATERS.map(([n, u]) => [
      `float-${n}.webp`,
      u,
      async (b) => sharp(b).resize({ width: 520 }).webp({ lossless: true }),
    ]),
    ...PROJECT_IMGS.map(([n, u]) => [
      `${n}.webp`,
      u,
      async (b) => sharp(b).resize({ width: 1600 }).webp({ quality: 86 }),
    ]),
  ]
  await pool(statics, 6, async ([name, url, pipe]) => {
    const buf = await get(url)
    const out = await (await pipe(buf)).toBuffer()
    await writeFile(path.join(OUT, name), out)
    log.push(`${name}  ${kb(buf)} -> ${kb(out)}`)
  })

  const fails = log.length
  console.log(log.sort().join('\n'))
  console.log(`\n完成 ${fails} 个文件 -> public/media`)
}

main().catch((e) => {
  console.error('FAILED:', e.message)
  process.exit(1)
})
