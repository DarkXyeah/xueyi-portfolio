import { MEDIA, STATS, TIMELINE, profile } from '../data/site'
import ContactButton from './ContactButton'
import FadeIn from './FadeIn'

const FLOATERS = [
  { src: MEDIA.floaters.moon, cls: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]', delay: 0.1, x: -80 },
  { src: MEDIA.floaters.object, cls: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]', delay: 0.25, x: -80 },
  { src: MEDIA.floaters.lego, cls: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]', delay: 0.15, x: 80 },
  { src: MEDIA.floaters.group, cls: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]', delay: 0.3, x: 80 },
]

export default function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden bg-ink/40 px-5 py-24 sm:px-8 md:px-10 md:py-32"
    >
      {/* 四角悬浮装饰 */}
      {FLOATERS.map((f, i) => (
        <FadeIn
          key={i}
          delay={f.delay}
          x={f.x}
          y={0}
          duration={0.9}
          className={`pointer-events-none absolute z-0 hidden select-none sm:block ${f.cls}`}
        >
          <img src={f.src} alt="" className="w-full opacity-70" loading="lazy" />
        </FadeIn>
      ))}

      {/* 标题 + 逐字点亮的自述 */}
      <div className="relative z-10 flex flex-col items-center gap-10 text-center sm:gap-14 md:gap-16">
        <FadeIn y={40}>
          <h2
            className="hero-heading font-display font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            ABOUT
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <FadeIn delay={0.1} y={16} className="max-w-[620px] px-2">
            <p
              className="leading-relaxed text-mist/90"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
            >
              {profile.aboutCn}
            </p>
          </FadeIn>
          <FadeIn delay={0.15} y={16}>
            <ContactButton label="联系我" />
          </FadeIn>
        </div>
      </div>

      {/* 经历 / 联系 / 数据 */}
      <div className="shell relative z-10 mt-24 md:mt-32">
        <div className="rule mb-10 md:mb-14" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* 人像 + 联系方式 */}
          <div className="lg:col-span-4">
            <FadeIn className="overflow-hidden rounded-[28px] border border-mist/10">
              <img
                src={MEDIA.portrait}
                alt={`${profile.nameCn} 肖像`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover grayscale transition duration-700 ease-soft hover:grayscale-0"
              />
            </FadeIn>

          </div>

          {/* 经历时间线 */}
          <div className="lg:col-span-5">
            <span className="label">经历</span>
            <ul className="mt-6">
              {TIMELINE.map((t, i) => (
                <li key={t.year}>
                  <FadeIn
                    delay={i * 0.08}
                    y={20}
                    className="group grid grid-cols-1 gap-2 border-b border-mist/10 py-6 first:pt-0 sm:grid-cols-[9.5rem_1fr] sm:gap-6"
                  >
                    <span className="font-mono text-xs tracking-wider text-ember/80">
                      {t.year}
                    </span>
                    <div>
                      <p className="font-display text-lg font-medium tracking-wide text-mist md:text-xl">
                        {t.role}
                      </p>
                      <p className="mt-1 font-ui text-sm text-mist/50">{t.org}</p>
                      <p className="mt-2.5 max-w-[420px] font-ui text-sm leading-relaxed text-mist/35">
                        {t.note}
                      </p>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>

          {/* 项目数据 */}
          <div className="lg:col-span-3">
            <span className="label">数据</span>
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-1 lg:gap-y-8">
              {STATS.map((s, i) => (
                <FadeIn key={s.label} delay={i * 0.08} y={20}>
                  <div className="border-t border-mist/15 pt-5">
                    <p className="flex items-baseline font-display text-[3.2rem] font-black leading-none tracking-tight text-mist md:text-[4rem]">
                      {s.value}
                      <span className="text-ember">{s.suffix}</span>
                    </p>
                    <p className="mt-3 font-ui text-sm text-mist/55">{s.cn}</p>
                    <p className="label mt-1">{s.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
