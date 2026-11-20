import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo'
import SmartLink from '../ui/SmartLink'
import Button from '../ui/Button'
import { nav } from '../../config/site'

const SECTION_IDS = ['leistungen', 'ueber-uns', 'faq', 'kontakt']

/** Ermittelt die aktuell sichtbare Sektion für die aktive Navigationsmarkierung. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>('')
  useEffect(() => {
    if (!enabled) {
      setActive('')
      return
    }
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35
      let current = ''
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])
  return active
}

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(isHome)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menü bei Routenwechsel schliessen
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  // Scroll-Lock, Escape und Fokusführung im mobilen Menü
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>('a, button')
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('a')?.focus(), 50)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open])

  const isActive = (href: string) => {
    if (!isHome) return false
    const hash = href.split('#')[1]
    return hash ? active === hash : active === ''
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? 'border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[72px]">
          <SmartLink href="/" aria-label="Novyra Digital – zur Startseite" className="rounded-md">
            <Logo />
          </SmartLink>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <SmartLink
                    href={item.href}
                    aria-current={isActive(item.href) ? 'true' : undefined}
                    className={`relative block rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${
                      isActive(item.href) ? 'text-snow' : 'text-mute-400 hover:text-snow'
                    }`}
                  >
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.08]"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Button href="/#kontakt" size="md">
                Projekt anfragen
              </Button>
            </span>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Menü schliessen' : 'Menü öffnen'}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-snow transition-colors hover:bg-white/[0.08] lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-ink-950/97 backdrop-blur-xl md:top-[72px] lg:hidden"
          >
            <nav aria-label="Mobile Navigation" className="container-x flex min-h-full flex-col pt-8 pb-10">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-white/[0.06]"
                  >
                    <SmartLink
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5 text-[1.7rem] font-medium tracking-tight text-snow"
                    >
                      {item.label}
                      <span className="font-mono text-xs text-mute-500">0{i + 1}</span>
                    </SmartLink>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <Button href="/#kontakt" size="lg" arrow className="w-full" onClick={() => setOpen(false)}>
                  Projekt anfragen
                </Button>
                <p className="mt-6 text-center text-sm text-mute-500">
                  <a href="mailto:info@novyradigital.ch" className="hover:text-snow">info@novyradigital.ch</a>
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
