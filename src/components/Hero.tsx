import { profile } from '../data/site'
import FadeIn from './FadeIn'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative h-screen min-h-[680px] w-full overflow-hidden"
    >
      {/* 背景由全站 VideoBackdrop 统一提供，这里只补一层底部渐隐，让标题与信息条踩实 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-x-0 bottom-0 h-[42vh] bg-gradient-to-t from-ink via-ink/75 to-transparent" />
        {/* 极淡的水平扫描线，强化科技感但不抢内容 */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(215,226,234,0.9) 0 1px, transparent 1px 3px)',
          }}
        />
      </div>

      {/* 内容层：标题(z-0) < 底部信息条(z-20) */}
      <div className="shell relative flex h-full flex-col pt-[18vh] md:pt-[16vh]">
        <FadeIn
          delay={0.05}
          y={-14}
          className="relative z-20 flex items-start justify-between"
        >
          <span className="label">{profile.taglineCn}</span>
          <span className="label hidden md:block">{profile.location}</span>
        </FadeIn>

        <div className="relative z-0 mt-6 w-full overflow-hidden sm:mt-4 md:-mt-5">
          <FadeIn as="h1" delay={0.15} y={40} duration={0.9}>
            <span className="hero-heading block w-full whitespace-nowrap font-display text-[14vw] font-black uppercase leading-none tracking-tight sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
              Hi, i&rsquo;m {profile.name}
            </span>
          </FadeIn>
        </div>

        <div className="relative z-20 mt-auto flex items-end justify-between gap-8 pb-7 sm:pb-8 md:pb-10">
          <FadeIn delay={0.35} y={20}>
            <p
              className="max-w-[170px] font-light uppercase leading-snug tracking-wide text-mist sm:max-w-[230px] md:max-w-[280px]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              {profile.heroLead}
            </p>
            <p className="mt-4 max-w-[220px] font-ui text-xs leading-relaxed text-mist/45 sm:max-w-[280px] md:text-sm">
              {profile.taglineCn}，用系统化的视觉语言解决品牌与产品的表达问题。
            </p>
          </FadeIn>

        </div>
      </div>


      {/* 滚动提示 */}
      <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 hidden -translate-x-1/2 md:block">
        <span className="block h-10 w-px bg-gradient-to-b from-transparent to-mist/40" />
      </div>
    </section>
  )
}
