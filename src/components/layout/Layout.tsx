import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/** Scrollt bei Routenwechsel nach oben bzw. zum Anker (z. B. «/#kontakt»). */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      let tries = 0
      // Warten, bis die Sektion nach dem Seitenübergang gerendert ist
      const tick = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
        else if (tries++ < 30) window.setTimeout(tick, 40)
      }
      tick()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Zum Inhalt springen
      </a>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  )
}
