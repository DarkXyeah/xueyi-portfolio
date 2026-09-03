import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MARQUEE_ROWS } from '../data/site'
import FadeIn from './FadeIn'

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // 内容复制三份，位移控制在 ±1/3 内即可无缝循环
  const x1 = useTransform(scrollYProgress, [0, 1], ['-33.3333%', '0%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['0%', '-33.3333%'])
  const xs = [x1, x2]

  return (
    <section
      ref={ref}
      className="relative bg-ink/55 pt-24 backdrop-blur-[2px] sm:pt-32 md:pt-40"
    >
      <div className="shell">
        <FadeIn className="pb-10">
          <h2 className="font-display text-2xl font-medium uppercase leading-tight tracking-tight text-mist sm:text-3xl md:text-[2.6rem]">
            AI 内容创作
          </h2>
        </FadeIn>
      </div>

      <div className="flex flex-col gap-3 pb-10 md:pb-16">
        {MARQUEE_ROWS.map((row, i) => (
          <div key={i} className="edge-fade overflow-hidden">
            {/* 间距做成每个 tile 的右边距而不是父级 gap：
                这样「一份」的宽度严格等于总宽的 1/3，位移 ±33.3333% 才能严丝合缝 */}
            <motion.div
              className="flex w-max"
              style={{ x: xs[i], willChange: 'transform' }}
            >
              {[...row.tiles, ...row.tiles, ...row.tiles].map((src, j) => (
                <img
                  key={`${src}-${j}`}
                  src={src}
                  alt=""
                  loading="lazy"
                  className="mr-3 h-[193px] w-[300px] shrink-0 rounded-2xl border border-mist/10 object-cover shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] md:h-[270px] md:w-[420px]"
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      <div className="shell">
        <div className="rule" />
      </div>
    </section>
  )
}
