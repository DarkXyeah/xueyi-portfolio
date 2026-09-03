import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SETTINGS_DIR = path.join(__dirname, 'public', 'media', 'ai-settings')
const MANIFEST_PATH = path.join(SETTINGS_DIR, 'manifest.json')
const MAX_BODY = 35 * 1024 * 1024

function ensureDir(d: string) {
  fs.mkdirSync(d, { recursive: true })
}

function readManifest(): Record<string, { name: string; type: string; src: string }[]> {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

function writeManifest(manifest: Record<string, { name: string; type: string; src: string }[]>) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
}

function settingsUploadPlugin(): Plugin {
  return {
    name: 'settings-upload',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        if (url !== '/api/settings-upload') return next()

        // DELETE：删除设定集文件并更新清单
        if (req.method === 'DELETE') {
          let body = ''
          let aborted = false
          req.on('data', (chunk: Buffer) => {
            if (aborted) return
            body += chunk.toString('utf8')
            if (body.length > MAX_BODY) {
              aborted = true
              res.statusCode = 413
              res.end(JSON.stringify({ error: '请求过大' }))
              req.destroy()
            }
          })
          req.on('end', () => {
            if (aborted) return
            try {
              const parsed = JSON.parse(body) as { videoId?: string; src?: string }
              const videoId = parsed.videoId ? path.basename(String(parsed.videoId)) : ''
              const src = String(parsed.src || '')
              if (!videoId || !src) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: '参数缺失' }))
                return
              }
              const fileName = path.basename(decodeURIComponent(src))
              const filePath = path.join(SETTINGS_DIR, videoId, fileName)
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
              }
              const manifest = readManifest()
              const list = Array.isArray(manifest[videoId]) ? manifest[videoId] : []
              manifest[videoId] = list.filter((it) => it.src !== src)
              writeManifest(manifest)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true }))
            } catch (e) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'server error' }))
            }
          })
          req.on('error', () => {
            /* ignore */
          })
          return
        }

        // POST：上传新文件
        if (req.method !== 'POST') return next()
        let body = ''
        let aborted = false
        req.on('data', (chunk: Buffer) => {
          if (aborted) return
          body += chunk.toString('utf8')
          if (body.length > MAX_BODY) {
            aborted = true
            res.statusCode = 413
            res.end(JSON.stringify({ error: '文件过大（单个视频设定集上限 35MB）' }))
            req.destroy()
          }
        })
        req.on('end', () => {
          if (aborted) return
          try {
            const parsed = JSON.parse(body) as {
              videoId?: string
              files?: { name: string; type: string; dataUrl: string }[]
            }
            const videoId = parsed.videoId ? path.basename(String(parsed.videoId)) : ''
            const files = Array.isArray(parsed.files) ? parsed.files : []
            if (!videoId || !files.length) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: '参数缺失' }))
              return
            }
            const dir = path.join(SETTINGS_DIR, videoId)
            ensureDir(dir)
            ensureDir(SETTINGS_DIR)
            const manifest = readManifest()
            const list = Array.isArray(manifest[videoId]) ? manifest[videoId] : []
            const added: { name: string; type: string; src: string }[] = []
            for (const f of files) {
              if (!f || !f.name || !f.dataUrl) continue
              const safeName = path.basename(String(f.name))
              const type = ['image', 'text', 'doc'].includes(f.type) ? f.type : 'doc'
              const comma = f.dataUrl.indexOf(',')
              const b64 = comma >= 0 ? f.dataUrl.slice(comma + 1) : f.dataUrl
              const buf = Buffer.from(b64, 'base64')
              fs.writeFileSync(path.join(dir, safeName), buf)
              const item = {
                name: safeName,
                type,
                src: `/media/ai-settings/${videoId}/${encodeURIComponent(safeName)}`,
              }
              list.push(item)
              added.push(item)
            }
            manifest[videoId] = list
            writeManifest(manifest)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, items: added }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'server error' }))
          }
        })
        req.on('error', () => {
          /* ignore */
        })
      })
    },
  }
}

export default defineConfig({
  // 相对 base，使构建产物在 GitHub Pages 任意子路径下都能正确加载资源
  base: './',
  plugins: [react(), settingsUploadPlugin()],
  server: { host: true, port: 5173 },
})
