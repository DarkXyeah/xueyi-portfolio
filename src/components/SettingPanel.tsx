import { useEffect, useRef, useState } from 'react'
import { Upload, FileText, Image as ImageIcon, File as FileIcon, X, ExternalLink, ChevronDown, Trash2, Download } from 'lucide-react'
import { useEdit } from '../context/EditContext'

export type SettingItem = { name: string; type: 'image' | 'text' | 'doc'; src: string }

const MANIFEST_URL = '/media/ai-settings/manifest.json'

function inferType(file: File): SettingItem['type'] {
  const t = file.type
  const n = file.name.toLowerCase()
  if (t.startsWith('image/')) return 'image'
  if (t === 'text/plain' || n.endsWith('.txt') || n.endsWith('.md')) return 'text'
  return 'doc'
}

function isPdf(s: string) {
  return (s.split('.').pop()?.toLowerCase() ?? '') === 'pdf'
}

function isWord(s: string) {
  const ext = s.split('.').pop()?.toLowerCase() ?? ''
  return ext === 'doc' || ext === 'docx'
}

export default function SettingPanel({ videoId, prompt }: { videoId: string; prompt?: string }) {
  const { editMode } = useEdit()
  const [items, setItems] = useState<SettingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [textCache, setTextCache] = useState<Record<string, string>>({})
  const [openText, setOpenText] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${MANIFEST_URL}?t=${Date.now()}`)
      if (!res.ok) throw new Error()
      const manifest: Record<string, SettingItem[]> = await res.json()
      setItems(manifest[videoId] ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (videoId) load()
    else {
      setItems([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length) return
    setUploading(true)
    try {
      const payload = { videoId, files: [] as { name: string; type: SettingItem['type']; dataUrl: string }[] }
      for (const f of Array.from(files)) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.onerror = reject
          r.readAsDataURL(f)
        })
        payload.files.push({ name: f.name, type: inferType(f), dataUrl })
      }
      const res = await fetch('/api/settings-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.ok) {
        await load()
      } else {
        alert('上传失败：' + (data.error || '未知错误'))
      }
    } catch {
      alert('上传失败：网络错误')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onDelete = async (item: SettingItem) => {
    if (!confirm(`确定删除「${item.name}」？`)) return
    setDeleting(item.src)
    try {
      const res = await fetch('/api/settings-upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, src: item.src }),
      })
      const data = await res.json()
      if (data.ok) {
        if (openText === item.src) setOpenText(null)
        if (lightbox === item.src) setLightbox(null)
        await load()
      } else {
        alert('删除失败：' + (data.error || '未知错误'))
      }
    } catch {
      alert('删除失败：网络错误')
    } finally {
      setDeleting(null)
    }
  }

  const toggleText = async (item: SettingItem) => {
    if (openText === item.src) {
      setOpenText(null)
      return
    }
    if (!textCache[item.src]) {
      try {
        const res = await fetch(item.src)
        const txt = await res.text()
        setTextCache((p) => ({ ...p, [item.src]: txt }))
      } catch {
        return
      }
    }
    setOpenText(item.src)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="label text-mist/80">设定集</h4>
        {items.length > 0 && <span className="label text-mist/40">{items.length} 项</span>}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-mist/10 bg-mist/5 p-4 text-xs text-mist/40">读取中…</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-mist/10 bg-mist/5 p-4">
          {prompt ? (
            <>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-mist/40">创作备注 · Prompt</p>
              <p className="font-mono text-xs leading-relaxed text-mist/50">{prompt}</p>
            </>
          ) : (
            <p className="text-xs text-mist/40">暂无设定集。开启编辑模式后可上传图片、TXT、Word 等资料供访客查看。</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((it) => (
            <div key={it.src} className={`transition-opacity ${deleting === it.src ? 'opacity-50' : ''}`}>
              {it.type === 'image' && (
                <div className="group flex w-full items-center gap-3 rounded-2xl border border-mist/10 bg-mist/5 p-2 transition-colors hover:border-ember/40">
                  <button
                    type="button"
                    onClick={() => setLightbox(it.src)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/40">
                      <img src={it.src} alt={it.name} className="h-full w-full object-cover" loading="lazy" />
                    </span>
                    <span className="flex-1 truncate text-sm text-mist/70">{it.name}</span>
                  </button>
                  <div className="flex items-center gap-1 pr-2">
                    <ImageIcon size={14} className="text-mist/30" />
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => onDelete(it)}
                        className="ml-1 grid h-8 w-8 place-items-center rounded-full text-mist/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label="删除"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {it.type === 'text' && (
                <div className="overflow-hidden rounded-2xl border border-mist/10 bg-mist/5">
                  <button
                    type="button"
                    onClick={() => toggleText(it)}
                    className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-mist/5"
                  >
                    <FileText size={16} className="shrink-0 text-ember/70" />
                    <span className="flex-1 truncate text-sm text-mist/70">{it.name}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-mist/40 transition-transform duration-200 ${
                        openText === it.src ? 'rotate-180' : ''
                      }`}
                    />
                    {editMode && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(it)
                        }}
                        className="ml-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-mist/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="删除此文件"
                        role="button"
                        aria-label="删除"
                      >
                        <Trash2 size={14} />
                      </span>
                    )}
                  </button>
                  {openText === it.src && textCache[it.src] && (
                    <div className="border-t border-mist/10">
                      <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-relaxed text-mist/60">
                        {textCache[it.src]}
                      </pre>
                      <div className="flex items-center justify-between gap-3 border-t border-mist/10 bg-mist/[0.03] p-3">
                        <button
                          type="button"
                          onClick={() => setOpenText(null)}
                          className="text-xs text-mist/50 transition-colors hover:text-mist"
                        >
                          收起
                        </button>
                        {editMode && (
                          <button
                            type="button"
                            onClick={() => onDelete(it)}
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                            删除
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {it.type === 'doc' && (
                <div className="flex w-full items-center gap-3 rounded-2xl border border-mist/10 bg-mist/5 p-3">
                  <FileIcon size={16} className="shrink-0 text-ember/70" />
                  <span className="flex-1 truncate text-sm text-mist/70">{it.name}</span>
                  {isWord(it.name) ? (
                    <a
                      href={it.src}
                      download={it.name}
                      className="flex items-center gap-1 rounded-full border border-mist/20 px-3 py-1 text-xs text-mist transition-colors hover:border-ember hover:text-ember"
                    >
                      下载 <Download size={12} />
                    </a>
                  ) : (
                    <a
                      href={it.src}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-full border border-mist/20 px-3 py-1 text-xs text-mist transition-colors hover:border-ember hover:text-ember"
                    >
                      查看 <ExternalLink size={12} />
                    </a>
                  )}
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => onDelete(it)}
                      className="grid h-8 w-8 place-items-center rounded-full text-mist/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      aria-label="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PDF 内嵌预览 */}
      {items
        .filter((i) => i.type === 'doc' && isPdf(i.src))
        .map((it) => (
          <iframe
            key={'pdf-' + it.src}
            src={it.src}
            title={it.name}
            className="mt-3 h-72 w-full rounded-2xl border border-mist/10"
          />
        ))}

      {editMode && (
        <div className="mt-3">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,.txt,.md,.doc,.docx,.pdf"
            onChange={onPick}
            className="hidden"
            id={`upload-${videoId}`}
          />
          <label
            htmlFor={`upload-${videoId}`}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-mist/25 px-4 py-3 text-xs text-mist/60 transition-colors hover:border-ember hover:text-ember ${
              uploading ? 'opacity-60' : ''
            }`}
          >
            <Upload size={14} />
            {uploading ? '上传中…' : '上传设定集（图片 / TXT / Word / PDF）'}
          </label>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute right-5 top-5 text-mist/70 transition-colors hover:text-white" aria-label="关闭">
            <X size={24} />
          </button>
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  )
}
