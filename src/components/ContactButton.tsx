import { ArrowUpRight } from 'lucide-react'
import Magnet from './Magnet'

type Props = {
  label?: string
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'px-6 py-2.5 text-[11px] gap-2',
  md: 'px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm gap-2.5',
  lg: 'px-10 py-4 sm:px-12 sm:py-4 md:px-14 md:py-5 text-sm md:text-base gap-3',
}

export default function ContactButton({
  label = 'Contact Me / 联系我',
  href = '#contact',
  className = '',
  size = 'md',
}: Props) {
  return (
    <Magnet padding={90} strength={7}>
      <a
        href={href}
        className={`group relative inline-flex items-center justify-center rounded-full border border-mist/25 bg-mist/[0.06]
          font-medium uppercase tracking-widest text-mist backdrop-blur-sm
          transition-[background-color,color,border-color,transform] duration-500 ease-soft
          hover:border-ember hover:bg-ember hover:text-ink
          ${SIZES[size]} ${className}`}
      >
        <span>{label}</span>
        <ArrowUpRight
          className="transition-transform duration-500 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          size={size === 'sm' ? 13 : size === 'lg' ? 18 : 15}
        />
      </a>
    </Magnet>
  )
}
