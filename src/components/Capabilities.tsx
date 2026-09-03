import { Compass, Cpu, Film, Layers, MonitorSmartphone, Sparkles } from 'lucide-react'
import { CAPABILITIES } from '../data/site'
import FadeIn from './FadeIn'

const ICONS = [Sparkles, Cpu, MonitorSmartphone, Film, Layers, Compass]

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative z-20 -mt-10 rounded-t-[40px] bg-bone px-5 pb-20 pt-24 text-ink sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-28 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-32 md:pt-32"
    >
      <div className="shell">
        <div className="flex flex-col items-center text-center">
          <FadeIn y={40}>
            <span className="label label-ink">Capabilities / 能力</span>
            <h2
              className="mt-4 font-display font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
            >
              我的优势
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} y={20}>
            <p className="mt-6 max-w-[560px] font-ui text-sm leading-relaxed text-ink/55 md:text-base">
              不是一份软件清单，而是六个能独立完成、也能咬合出完整短视频方案的能力模块。
            </p>
          </FadeIn>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 md:mt-24">
          {CAPABILITIES.map((c, i) => {
            const Icon = ICONS[i] ?? Sparkles
            return (
              <FadeIn key={c.num} delay={i * 0.08} y={30}>
                <article className="group relative h-full overflow-hidden rounded-[28px] border border-ink/10 bg-transparent p-7 transition-colors duration-500 ease-soft hover:border-ink hover:bg-ink md:p-8">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-[3.4rem] font-black leading-none tracking-tight text-ink/10 transition-colors duration-500 group-hover:text-bone/25">
                      {c.num}
                    </span>
                    <Icon
                      size={20}
                      className="mt-1 text-ember transition-transform duration-500 ease-soft group-hover:scale-110"
                    />
                  </div>

                  <h3 className="mt-8 font-display text-xl font-medium tracking-wide text-ink transition-colors duration-500 group-hover:text-bone md:text-2xl">
                    {c.key}
                  </h3>

                  <p className="mt-5 font-ui text-sm leading-relaxed text-ink/60 transition-colors duration-500 group-hover:text-bone/55">
                    {c.desc}
                  </p>

                  <ul className="mt-7 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45 transition-colors duration-500 group-hover:border-bone/20 group-hover:text-bone/60"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
