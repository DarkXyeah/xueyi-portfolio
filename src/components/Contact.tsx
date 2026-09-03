import { ArrowUp, CalendarCheck, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { CONTACTS, profile } from '../data/site'
import FadeIn from './FadeIn'

const ICONS = [Mail, MessageCircle, Phone, MapPin]

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative z-30 -mt-10 flex min-h-screen flex-col rounded-t-[40px] bg-ink/95 px-5 pb-8 pt-24 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-28 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <div className="shell flex flex-1 flex-col">
        {/* 标题区 */}
        <FadeIn y={40}>
          <h2
            className="hero-heading font-display font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 170px)' }}
          >
            CONTACT
          </h2>
        </FadeIn>

        <div className="mt-auto pt-16 md:pt-24">
          {/* 联系方式 */}
          <div className="grid grid-cols-1 gap-10 border-b border-mist/10 py-12 md:grid-cols-2 md:gap-8 md:py-16">
            <FadeIn delay={0.15} y={20}>
              <span className="label">联系方式</span>
              <ul className="mt-5 flex flex-col">
                {CONTACTS.map((c, i) => {
                  const Icon = ICONS[i] ?? Mail
                  return (
                    <li key={c.label} className="flex items-center gap-4 border-b border-mist/10 py-3.5 last:border-b-0">
                      <Icon size={15} className="shrink-0 text-mist/35" />
                      <span className="label w-16 shrink-0">{c.label}</span>
                      <a
                        href={c.href}
                        className="link-line truncate font-ui text-sm text-mist/90 transition-colors duration-300 hover:text-ember"
                      >
                        {c.value}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </FadeIn>

            <FadeIn delay={0.25} y={20}>
              <span className="label">状态</span>
              <p className="mt-5 flex items-center gap-3 font-ui text-sm text-mist/70">
                <CalendarCheck size={15} className="shrink-0 text-ember" />
                {profile.available}
              </p>
            </FadeIn>
          </div>

          {/* 页脚 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <span className="label">© 2026 XUEYI · {profile.location}</span>
            <a
              href="#top"
              className="group flex items-center gap-2 font-medium uppercase tracking-widest text-mist/70 transition-colors duration-300 hover:text-ember"
            >
              <span className="text-xs">返回顶部</span>
              <ArrowUp
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
