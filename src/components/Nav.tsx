import { useEffect, useState } from 'react'
import { NAV_LINKS, profile } from '../data/site'
import ContactButton from './ContactButton'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-soft ${
        scrolled
          ? 'border-b border-mist/10 bg-ink/70 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex items-center justify-between gap-6 py-5 md:py-6">
        <a href="#top" className="group flex shrink-0 items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-mist/25 font-display text-[13px] font-medium text-mist transition-colors duration-300 group-hover:border-ember group-hover:text-ember md:h-10 md:w-10">
            {profile.name.charAt(0)}
          </span>
          <span className="hidden flex-col leading-tight lg:flex">
            <span className="font-display text-sm font-medium tracking-wide text-mist">
              {profile.nameCn}
            </span>
            <span className="label mt-1">{profile.taglineCn}</span>
          </span>
        </a>

        <nav className="hidden flex-1 items-center justify-between md:flex md:max-w-[560px] lg:max-w-[720px]">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-baseline gap-2 text-sm font-medium uppercase tracking-wider text-mist transition-opacity duration-200 hover:opacity-70 md:text-base lg:text-[1.05rem]"
            >
              <span className="font-mono text-[10px] text-mist/35 transition-colors duration-200 group-hover:text-ember">
                0{i + 1}
              </span>
              <span className="link-line">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="shrink-0">
          <ContactButton size="sm" className="hidden sm:inline-flex" />
          <a
            href="#contact"
            className="inline-flex text-xs font-medium uppercase tracking-widest text-mist sm:hidden"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  )
}
