import { ArrowUpRight, Mail } from 'lucide-react'
import Logo from '../ui/Logo'
import SmartLink from '../ui/SmartLink'
import { site } from '../../config/site'

const footerNav = [
  { label: 'Startseite', href: '/' },
  { label: 'Leistungen', href: '/#leistungen' },
  { label: 'Über uns', href: '/#ueber-uns' },
  { label: 'Kontakt', href: '/#kontakt' },
]
const legalNav = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SmartLink href="/" aria-label={`${site.name} – zur Startseite`} className="inline-block rounded-md">
              <Logo />
            </SmartLink>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-mute-400">{site.footerClaim}</p>
            <a
              href={`mailto:${site.email}`}
              className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2 text-sm text-snow transition-colors hover:border-white/25 hover:bg-white/[0.04]"
            >
              <Mail className="size-4 text-accent" aria-hidden />
              {site.email}
              <ArrowUpRight className="size-3.5 text-mute-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>

          <nav aria-label="Footer-Navigation" className="md:col-span-3 md:col-start-7">
            <h2 className="eyebrow">Navigation</h2>
            <ul className="mt-5 space-y-3">
              {footerNav.map((l) => (
                <li key={l.href}>
                  <SmartLink href={l.href} className="text-[15px] text-mute-300 transition-colors hover:text-snow">
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Rechtliches" className="md:col-span-3">
            <h2 className="eyebrow">Rechtliches</h2>
            <ul className="mt-5 space-y-3">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <SmartLink href={l.href} className="text-[15px] text-mute-300 transition-colors hover:text-snow">
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hairline mt-16" />
        <div className="mt-8 flex flex-col gap-3 text-[13px] text-mute-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-accent animate-pulse-soft" />
            Digitalagentur aus der Schweiz
          </p>
        </div>
      </div>
    </footer>
  )
}
