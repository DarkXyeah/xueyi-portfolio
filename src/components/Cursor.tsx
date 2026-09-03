import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * 跟随光标的极简指示点：默认是一个 5px 的小点，
 * 悬停在带 data-cursor 的元素上时会撑开成一个圆环并显示标签。
 */
export default function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.35 })
  const [label, setLabel] = useState('')
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as HTMLElement | null)?.closest?.('[data-cursor]')
      setLabel(target ? (target.getAttribute('data-cursor') ?? '') : '')
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  if (!enabled) return null

  const active = label.length > 0

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-ember bg-ember/10 backdrop-blur-[1px]"
        animate={{
          width: active ? 84 : 8,
          height: active ? 84 : 8,
          x: active ? -42 : -4,
          y: active ? -42 : -4,
          backgroundColor: active ? 'rgba(255,77,28,0.14)' : 'rgba(255,77,28,1)',
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.span
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember"
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
