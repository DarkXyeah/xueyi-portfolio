import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** 光标进入元素外扩多少像素后开始吸附 */
  padding?: number
  /** 除数，越大位移越弱 */
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let active = false

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const withinX = e.clientX >= r.left - padding && e.clientX <= r.right + padding
      const withinY = e.clientY >= r.top - padding && e.clientY <= r.bottom + padding

      if (withinX && withinY) {
        active = true
        el.style.transition = activeTransition
        el.style.transform = `translate3d(${(e.clientX - cx) / strength}px, ${
          (e.clientY - cy) / strength
        }px, 0)`
      } else if (active) {
        active = false
        el.style.transition = inactiveTransition
        el.style.transform = 'translate3d(0,0,0)'
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [padding, strength, activeTransition, inactiveTransition])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}
