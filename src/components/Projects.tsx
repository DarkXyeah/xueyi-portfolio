import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Maximize2, Play } from 'lucide-react'
import { useEdit } from '../context/EditContext'
import EditableText from './EditableText'
import FadeIn from './FadeIn'
import VideoModal, { type VideoItem } from './VideoModal'
import VideoLightbox from './VideoLightbox'

type Project = ReturnType<typeof useEdit>['projects'][number]

function VideoPlayer({
  video,
  projectNum,
  videoIndex,
  className = '',
  style,
  aspect,
  onOpen,
}: {
  video: VideoItem
  projectNum: string
  videoIndex: number
  className?: string
  style?: React.CSSProperties
  aspect?: number
  onOpen: (v: VideoItem) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [naturalAspect, setNaturalAspect] = useState(16 / 9)
  const posterUrl = video.src
    .replace('./media/', './media/posters/')
    .replace('.mp4', '-poster.webp')

  const resolvedAspect = aspect === undefined ? naturalAspect : aspect

  // 离屏视频不实例化 <video>，只显示 poster，滚动到附近再加载元数据
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '200px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handlePlay = () => {
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
    }
    onOpen({ ...video, projectNum, videoIndex })
  }

  return (
    <div
      ref={containerRef}
      className={`group relative isolate overflow-hidden rounded-[20px] border border-mist/20 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-1.5 shadow-[0_0_0_1px_rgba(255,77,28,0.08),0_16px_48px_-24px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:border-mist/35 hover:shadow-[0_0_0_1px_rgba(255,77,28,0.18),0_24px_60px_-20px_rgba(255,77,28,0.22),inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:rounded-[24px] sm:p-2 md:rounded-[28px] md:p-2.5 ${className}`}
      style={aspect === undefined ? style : { aspectRatio: resolvedAspect, ...style }}
      data-cursor="play"
    >
      {/* 科技感四角标 */}
      <span className="absolute left-2.5 top-2.5 z-20 h-3 w-3 border-l-2 border-t-2 border-ember/60 transition-colors group-hover:border-ember sm:left-3 sm:top-3" />
      <span className="absolute right-2.5 top-2.5 z-20 h-3 w-3 border-r-2 border-t-2 border-ember/60 transition-colors group-hover:border-ember sm:right-3 sm:top-3" />
      <span className="absolute bottom-2.5 left-2.5 z-20 h-3 w-3 border-b-2 border-l-2 border-ember/60 transition-colors group-hover:border-ember sm:bottom-3 sm:left-3" />
      <span className="absolute bottom-2.5 right-2.5 z-20 h-3 w-3 border-b-2 border-r-2 border-ember/60 transition-colors group-hover:border-ember sm:bottom-3 sm:right-3" />

      {/* 扫描线 */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-ember/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative h-full w-full overflow-hidden rounded-[14px] sm:rounded-[18px] md:rounded-[22px]">
        {/* poster 模糊背景：填补黑边，保持科技感 */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('${posterUrl}')`,
            filter: 'blur(16px) brightness(0.35) saturate(1.2)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
        {/* 细网格叠层 */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)',
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        />
        {inView ? (
          <video
            ref={videoRef}
            src={video.src}
            poster={posterUrl}
            preload="metadata"
            muted
            playsInline
            className="relative z-10 h-full w-full object-contain"
            aria-label={video.title}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget
              if (aspect === undefined && v.videoWidth && v.videoHeight) {
                setNaturalAspect(v.videoWidth / v.videoHeight)
              }
            }}
          />
        ) : (
          <img
            src={posterUrl}
            alt={video.title}
            loading="lazy"
            className="relative z-10 h-full w-full object-contain"
          />
        )}

        {/* 播放覆盖层 */}
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 z-10 flex items-center justify-center bg-ink/20 transition-colors duration-300 group-hover:bg-ink/35"
          aria-label={`播放 ${video.title}`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full border border-mist/30 bg-ink/60 text-mist backdrop-blur-md transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 md:h-16 md:w-16">
            <Play size={20} className="ml-1" fill="currentColor" />
          </span>
        </button>

        {/* 放大按钮 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpen({ ...video, projectNum, videoIndex })
          }}
          className="absolute right-2.5 top-2.5 z-20 grid h-8 w-8 place-items-center rounded-full border border-mist/20 bg-ink/60 text-mist opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:border-ember hover:text-ember sm:right-3 sm:top-3 sm:h-9 sm:w-9 md:h-10 md:w-10"
          aria-label="放大观看"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  index,
  total,
  onOpenVideo,
  onUpdateName,
}: {
  project: Project
  index: number
  total: number
  onOpenVideo: (v: VideoItem) => void
  onUpdateName: (name: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // 越靠前的卡片被盖住时缩得越小，形成堆叠纵深
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  const hasVideos = 'videos' in project && project.videos && project.videos.length > 0
  const hasImages = 'images' in project && project.images && project.images.length > 0

  return (
    <div
      ref={ref}
      className="sticky flex h-[85vh] items-start justify-center"
      style={{ top: `calc(6rem + ${index * 28}px)` }}
    >
      <motion.div
        style={{ scale }}
        className="relative h-full w-full origin-top overflow-hidden rounded-[40px] border border-mist/20 bg-ink/95 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_40px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        {/* 顶部 ember 辉光线 */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
        {/* 右上角微弱光晕 */}
        <div className="pointer-events-none absolute -right-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-ember/[0.04] blur-3xl" />
        <div className="flex h-full flex-col gap-4 sm:gap-6">
          {/* 顶部：编号 / 名称 */}
          <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
            <div className="flex items-end gap-4 md:gap-6">
              <span
                className="font-display font-black leading-none tracking-tight text-mist"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {project.num}
              </span>
              <div className="pb-2 md:pb-4">
                <EditableText
                  value={project.name}
                  onChange={onUpdateName}
                  as="h3"
                  className="font-display text-2xl font-medium uppercase leading-none tracking-tight text-mist md:text-[2.4rem]"
                />
              </div>
            </div>
          </div>

          {/* 视频区：按真实比例显示，不拉伸 */}
          {hasVideos &&
            (project.videos!.length === 6 ? (
              <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 place-items-center gap-3 sm:gap-4 md:gap-5">
                {project.videos!.map((v, i) => (
                  <VideoPlayer
                    key={i}
                    video={v}
                    projectNum={project.num}
                    videoIndex={i}
                    onOpen={onOpenVideo}
                    className="h-full max-h-[300px] w-auto"
                    aspect={9 / 16}
                  />
                ))}
              </div>
            ) : project.videos!.length === 4 ? (
              // 01 栏：2×2 网格，视频按真实比例 contain + poster 背景填充
              <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-4 sm:gap-5">
                {project.videos!.map((v, i) => (
                  <VideoPlayer
                    key={i}
                    video={v}
                    projectNum={project.num}
                    videoIndex={i}
                    onOpen={onOpenVideo}
                    className="h-full w-full"
                  />
                ))}
              </div>
            ) : (
              <div className="grid min-h-0 flex-1 grid-cols-3 place-items-center gap-4 sm:gap-5">
                {project.videos!.map((v, i) => (
                  <VideoPlayer
                    key={i}
                    video={v}
                    projectNum={project.num}
                    videoIndex={i}
                    onOpen={onOpenVideo}
                    className="h-[clamp(340px,40vw,560px)] w-auto"
                  />
                ))}
              </div>
            ))}

          {/* 图片区：左 40% 两张，右 60% 一张 */}
          {hasImages && (
            <div className="grid min-h-0 flex-1 grid-cols-5 gap-4 sm:gap-6">
              <div className="col-span-2 flex min-h-0 flex-col gap-4 sm:gap-6">
                <img
                  src={project.images![0]}
                  alt={`${project.name} 视觉一`}
                  loading="lazy"
                  data-cursor="view"
                  className="w-full shrink-0 rounded-[28px] object-cover sm:rounded-[36px] md:rounded-[44px]"
                  style={{ height: 'clamp(130px, 16vw, 230px)' }}
                />
                <img
                  src={project.images![1]}
                  alt={`${project.name} 视觉二`}
                  loading="lazy"
                  data-cursor="view"
                  className="min-h-0 w-full flex-1 rounded-[28px] object-cover sm:rounded-[36px] md:rounded-[44px]"
                  style={{ minHeight: 'clamp(160px, 22vw, 340px)' }}
                />
              </div>
              <div className="col-span-3 min-h-0">
                <img
                  src={project.images![2]}
                  alt={`${project.name} 视觉三`}
                  loading="lazy"
                  data-cursor="view"
                  className="h-full min-h-[260px] w-full rounded-[28px] object-cover sm:rounded-[36px] md:rounded-[44px]"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function Projects() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null)
  const { projects, updateProjectName } = useEdit()

  // 02 等「无详情页」视频走纯灯箱；03 等走带详情的弹窗
  const handleOpenVideo = (v: VideoItem) => {
    if (v.noDetail) setLightbox({ src: v.src, title: v.title })
    else setActiveVideo(v)
  }

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-ink/90 px-5 pb-24 pt-24 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-28 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-32 md:pt-32"
    >
      <div className="shell">
        <FadeIn className="flex items-end justify-between gap-8">
          <h2
            className="hero-heading font-display font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            PROJECTS
          </h2>
        </FadeIn>
      </div>

      <div className="shell mt-14 md:mt-20">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.num}
            project={p}
            index={i}
            total={projects.length}
            onOpenVideo={handleOpenVideo}
            onUpdateName={(name) => updateProjectName(p.num, name)}
          />
        ))}
      </div>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      {lightbox && (
        <VideoLightbox
          src={lightbox.src}
          title={lightbox.title}
          showTitle={false}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}
