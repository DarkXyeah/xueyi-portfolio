import { Fragment, useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

type Props = {
  text: string
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedText({ text, className = '', style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = Array.from(text)
  const total = chars.length

  // 按「单词」分组后再逐字点亮：
  // 单词整体不断行，避免英文在窄栏里被从中间截断
  const words: { text: string; index: number }[][] = []
  let cursor = 0
  for (const raw of text.split(' ')) {
    const word = Array.from(raw).map((ch) => ({ text: ch, index: cursor++ }))
    words.push(word)
    cursor += 1 // 空格也占一个进度单位
  }

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.map((c) => (
              <Char
                key={c.index}
                progress={scrollYProgress}
                range={[c.index / total, (c.index + 1) / total]}
              >
                {c.text}
              </Char>
            ))}
          </span>
          {/* 空格放在 inline-block 之外，浏览器才可能在这里换行 */}
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </p>
  )
}

function Char({
  children,
  progress,
  range,
}: {
  children: React.ReactNode
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span className="relative inline-block">
      {/* 这一层负责撑开布局，也是读屏软件实际读到的文本 */}
      <span className="opacity-0">{children}</span>
      <motion.span aria-hidden className="absolute inset-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  )
}
