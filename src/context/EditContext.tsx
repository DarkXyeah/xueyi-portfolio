import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PROJECTS } from '../data/site'
import type { VideoItem } from '../components/VideoModal'

type ProjectDraft = {
  num: string
  name: string
  images?: string[]
  href?: string
  videos?: VideoItem[]
}

type DraftPatch = {
  num: string
  name?: string
  images?: string[]
  href?: string
  videos?: VideoItem[]
}

interface EditContextValue {
  editMode: boolean
  setEditMode: (v: boolean) => void
  projects: ProjectDraft[]
  updateProjectName: (num: string, name: string) => void
  updateVideoField: (
    num: string,
    videoIndex: number,
    field: keyof VideoItem,
    value: string
  ) => void
  exportJson: () => string
  hasChanges: boolean
}

const STORAGE_KEY = 'portfolio-projects-draft'

const EditContext = createContext<EditContextValue | null>(null)

function loadDraft(): Partial<Record<string, DraftPatch>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveDraft(map: Partial<Record<string, DraftPatch>>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

export function EditProvider({ children }: { children: React.ReactNode }) {
  const isProd = import.meta.env.PROD
  const [editMode, setEditMode] = useState(false)
  const [draftMap, setDraftMap] = useState<Partial<Record<string, DraftPatch>>>(
    isProd ? {} : loadDraft
  )

  const projects: ProjectDraft[] = useMemo(() => {
    // 生产环境直接返回原始数据，不应用任何本地草稿
    if (isProd) return PROJECTS as ProjectDraft[]
    return PROJECTS.map((p) => {
      const draft = draftMap[p.num]
      if (!draft) return p as ProjectDraft
      return {
        ...p,
        ...draft,
        videos:
          'videos' in p && p.videos
            ? p.videos.map((v, i) => ({
                ...v,
                ...(draft.videos?.[i] ?? {}),
              }))
            : undefined,
      } as ProjectDraft
    })
  }, [draftMap, isProd])

  const hasChanges = useMemo(() => !isProd && Object.keys(draftMap).length > 0, [draftMap, isProd])

  const updateProjectName = (num: string, name: string) => {
    if (isProd) return
    setDraftMap((prev) => {
      const patch: DraftPatch = { ...(prev[num] ?? { num }), name }
      const next = { ...prev, [num]: patch }
      saveDraft(next)
      return next
    })
  }

  const updateVideoField = (
    num: string,
    videoIndex: number,
    field: keyof VideoItem,
    value: string
  ) => {
    if (isProd) return
    setDraftMap((prev) => {
      const patch = prev[num] ?? { num }
      const videos: VideoItem[] = patch.videos ? [...patch.videos] : []
      videos[videoIndex] = { ...(videos[videoIndex] ?? {}), [field]: value } as VideoItem
      const next: Partial<Record<string, DraftPatch>> = { ...prev, [num]: { ...patch, videos } }
      saveDraft(next)
      return next
    })
  }

  const exportJson = () => {
    return JSON.stringify(projects, null, 2)
  }

  useEffect(() => {
    // 生产环境完全禁用 F8 编辑快捷键
    if (isProd) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F8') {
        e.preventDefault()
        setEditMode((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isProd])

  return (
    <EditContext.Provider
      value={{
        editMode: isProd ? false : editMode,
        setEditMode: isProd ? () => {} : setEditMode,
        projects,
        updateProjectName,
        updateVideoField,
        exportJson,
        hasChanges,
      }}
    >
      {children}
    </EditContext.Provider>
  )
}

export function useEdit() {
  const ctx = useContext(EditContext)
  if (!ctx) throw new Error('useEdit must be used within EditProvider')
  return ctx
}
