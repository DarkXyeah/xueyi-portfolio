import { ArrowUpRight } from 'lucide-react'

type Props = {
  href?: string
  label?: string
}

export default function LiveProjectButton({ href = '#', label = 'Live Project / 查看项目' }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border-2 border-mist px-8 py-3 text-sm font-medium uppercase tracking-widest text-mist transition-colors duration-300 hover:bg-mist/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      <span>{label}</span>
      <ArrowUpRight
        size={16}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  )
}
