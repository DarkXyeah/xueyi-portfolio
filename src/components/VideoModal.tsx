import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useEdit } from '../context/EditContext'
import EditableText from './EditableText'
import SettingPanel from './SettingPanel'

export interface VideoItem {
  src: string
  title: string
  intro: string
  prompt: string
  projectNum?: string
  videoIndex?: number
  noDetail?: boolean
}

interface VideoModalProps {
  video: VideoItem | null
  onClose: () => void
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const { updateVideoField } = useEdit()
  const videoRef = useRef<HTMLVideoElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.play()
    }
  }, [video])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // 弹窗打开时锁定背景滚动 + 滚轮事件
  useEffect(() => {
    if (!video) return
    const originalOverflow = document.body.style.overflow
    const originalTouchAction = document.body.style.touchAction
    const originalHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.documentElement.style.overflow = 'hidden'

    const preventWheel = (e: WheelEvent) => {
      const target = e.target as Node | null
      // 如果滚轮发生在右侧可滚动区域内，且该区域确实可滚动，则放行
      if (rightRef.current && rightRef.current.contains(target)) {
        const el = rightRef.current
        if (el.scrollHeight > el.clientHeight) return
      }
      e.preventDefault()
    }

    const preventTouch = (e: TouchEvent) => {
      const target = e.target as Node | null
      if (rightRef.current && rightRef.current.contains(target)) return
      e.preventDefault()
    }

    window.addEventListener('wheel', preventWheel, { passive: false })
    window.addEventListener('touchmove', preventTouch, { passive: false })

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.touchAction = originalTouchAction
      document.documentElement.style.overflow = originalHtmlOverflow
      window.removeEventListener('wheel', preventWheel)
      window.removeEventListener('touchmove', preventTouch)
    }
  }, [video])

  if (!video) return null

  const portalRoot = document.getElementById('modal-root')
  if (!portalRoot) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center bg-ink/95 backdrop-blur-2xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${video.title} 详情`}
    >
      <div
        className="relative flex max-h-[calc(100vh-5rem)] w-full max-w-[1440px] flex-col overflow-hidden rounded-[24px] border border-mist/15 bg-ink shadow-2xl sm:rounded-[32px] md:max-h-[calc(100vh-6rem)] md:flex-row md:rounded-[40px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮：始终可见，避开顶部导航 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-mist/20 bg-ink/90 text-mist shadow-lg backdrop-blur-md transition-colors duration-200 hover:border-ember hover:text-ember md:right-5 md:top-5"
          aria-label="关闭"
        >
          <X size={18} />
        </button>

        {/* 左侧：视频播放器，按原始比例完整显示，不被任意放大 */}
        <div className="relative flex min-h-0 w-full flex-[1.2] items-center justify-center bg-black/60 p-3 max-h-[55vh] sm:p-4 md:max-h-none md:flex-[1.4] md:p-5 lg:p-6">
          <video
            ref={videoRef}
            src={video.src}
            controls
            playsInline
            autoPlay
            className="block max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            style={{
              height: 'auto',
              width: 'auto',
              maxHeight: 'min(calc(100vh - 12rem), 80vh)',
              maxWidth: 'min(100%, 720px)',
            }}
            aria-label={video.title}
          />
        </div>

        {/* 右侧：作品介绍与设定集 */}
        <div
          ref={rightRef}
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain border-t border-mist/10 p-5 sm:p-6 md:w-[380px] md:flex-none md:border-t-0 md:border-l md:p-7 lg:w-[420px] lg:p-8"
        >
          <div>
            <span className="label">AI 内容创作</span>
            <EditableText
              value={video.title}
              onChange={(title) =>
                video.projectNum !== undefined &&
                video.videoIndex !== undefined &&
                updateVideoField(video.projectNum, video.videoIndex, 'title', title)
              }
              as="h3"
              className="mt-3 font-display text-2xl font-medium leading-none tracking-tight text-mist md:text-3xl"
            />
          </div>

          <div>
            <h4 className="label mb-2 text-mist/80">作品介绍</h4>
            <EditableText
              value={video.intro}
              onChange={(intro) =>
                video.projectNum !== undefined &&
                video.videoIndex !== undefined &&
                updateVideoField(video.projectNum, video.videoIndex, 'intro', intro)
              }
              as="p"
              multiline
              className="whitespace-pre-wrap font-ui text-sm leading-relaxed text-mist/60 md:text-base"
            />
          </div>

          <SettingPanel
            videoId={
              video.projectNum && video.videoIndex !== undefined
                ? `${video.projectNum}-${video.videoIndex}`
                : ''
            }
            prompt={video.prompt}
          />
        </div>
      </div>
    </div>,
    portalRoot
  )
}
