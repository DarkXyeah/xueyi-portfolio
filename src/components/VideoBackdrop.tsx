import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * 全站统一的视频背景层。
 * - fixed 铺满视口、常驻最底层（z-0，内容层 z-10 起），滚动时不重绘、不重复解码；
 * - 全站只此一个 video 元素，避免多处播放抢占解码资源；
 * - 上面叠三层遮罩：整体压暗 → 径向暗角 → 底部渐隐，保证文字永远可读；
 * - 视频不可用时自动回落到纯色 + 网格，不至于开天窗。
 */
export default function VideoBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ok, setOk] = useState(true)

  // 滚动视差：视频随页面缓慢推近并轻微下移，让固定背景也有纵深
  const { scrollYProgress } = useScroll()
  const reduceMotion = useReducedMotion()
  // 起始就留 5% 放大余量，保证任何滚动位置都不会露出边缘
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '7%'])
  const parallax = reduceMotion ? undefined : { scale, y }

  // 部分浏览器/省电模式会拦截 autoplay，这里兜底再触发一次
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => {
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
    tryPlay()
    // 回到前台时恢复播放（切标签页会被暂停/节流）
    const onVisible = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      {ok ? (
        <motion.video
          ref={videoRef}
          src="./media/hero.mp4"
          poster="./media/hero-poster.webp"
          className="h-full w-full object-cover"
          style={parallax}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onError={() => setOk(false)}
        />
      ) : (
        // 回落：暗底 + 极淡网格，保留科技感
        <div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, #14171a 0%, #0C0C0C 60%), repeating-linear-gradient(90deg, rgba(215,226,234,0.03) 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, rgba(215,226,234,0.03) 0 1px, transparent 1px 64px)',
          }}
        />
      )}

      {/* 1) 整体压暗：把视频亮度压到不抢内容 */}
      <div className="absolute inset-0 bg-ink/75" />

      {/* 2) 径向暗角：中心略亮，四周沉下去，形成「聚焦」的高级感 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(115% 85% at 50% 40%, rgba(12,12,12,0) 0%, rgba(12,12,12,0.45) 55%, rgba(12,12,12,0.88) 100%)',
        }}
      />

      {/* 3) 顶部/底部渐隐：让首屏标题和页脚文字始终踩在实底上 */}
      <div className="absolute inset-x-0 top-0 h-[22vh] bg-gradient-to-b from-ink/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-ink to-transparent" />

      {/* 4) 极淡的 ember 辉光，和点缀色呼应，避免背景纯灰发闷 */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(60% 45% at 78% 12%, rgba(255,122,51,0.10) 0%, transparent 70%)',
        }}
      />

      {/* 5) 极淡网格：给视频底子加一层「工程感」肌理，不干扰内容 */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(215,226,234,0.85) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(215,226,234,0.85) 0 1px, transparent 1px 72px)',
        }}
      />
    </div>
  )
}
