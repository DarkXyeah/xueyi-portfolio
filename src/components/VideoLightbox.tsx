import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface VideoLightboxProps {
  src: string
  title: string
  showTitle?: boolean
  onClose: () => void
}

export default function VideoLightbox({ src, title, showTitle = true, onClose }: VideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }, [src])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // 打开时锁定背景滚动 + 滚轮
  useEffect(() => {
    const oBody = document.body.style.overflow
    const oTouch = document.body.style.touchAction
    const oHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.documentElement.style.overflow = 'hidden'

    const prevent = (e: WheelEvent | TouchEvent) => e.preventDefault()
    window.addEventListener('wheel', prevent, { passive: false })
    window.addEventListener('touchmove', prevent, { passive: false })

    return () => {
      document.body.style.overflow = oBody
      document.body.style.touchAction = oTouch
      document.documentElement.style.overflow = oHtml
      window.removeEventListener('wheel', prevent)
      window.removeEventListener('touchmove', prevent)
    }
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-[100dvh] w-screen items-center justify-center overflow-y-auto bg-ink/95 p-4 backdrop-blur-2xl sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full border border-mist/20 bg-ink/60 text-mist backdrop-blur-md transition-colors hover:border-ember hover:text-ember sm:right-6 sm:top-6 md:h-11 md:w-11"
        aria-label="关闭"
      >
        <X size={20} />
      </button>

      <div
        className="flex max-h-[calc(100dvh-3rem)] w-full max-w-[min(1100px,95vw)] flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {showTitle && (
          <span className="font-display text-sm font-medium uppercase tracking-wide text-mist/70">
            {title}
          </span>
        )}
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          className="max-h-[calc(100dvh-7rem)] w-auto max-w-full rounded-2xl bg-black object-contain shadow-2xl"
        />
      </div>
    </div>,
    document.getElementById('modal-root')!,
  )
}
