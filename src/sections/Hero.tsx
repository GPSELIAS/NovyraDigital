import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import HeroVisual from '../components/visuals/HeroVisual'

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 md:pb-28">
      {/* Hintergrund: Raster + dezente, langsam driftende Lichtquelle */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,black,transparent)]" />
        <div className="absolute left-1/2 top-[-12%] h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(79_124_255/0.30),transparent)] blur-2xl animate-drift will-change-transform" />
        <svg className="absolute left-1/2 top-24 h-[760px] w-[760px] -translate-x-1/2 opacity-[0.35]" viewBox="0 0 760 760" fill="none">
          <circle cx="380" cy="380" r="379" stroke="url(#ring)" />
          <circle cx="380" cy="380" r="280" stroke="url(#ring)" strokeDasharray="2 6" />
          <defs>
            <linearGradient id="ring" x1="380" y1="0" x2="380" y2="760" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity=".35" />
              <stop offset=".6" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-x relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-2 pr-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-mute-300 backdrop-blur"
          >
            <span className="relative flex size-4 items-center justify-center rounded-full bg-accent/15">
              <span className="size-1.5 rounded-full bg-accent" />
            </span>
            Digitalagentur aus der Schweiz
          </motion.p>

          <h1 id="hero-title" className="display mt-8 text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.4rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.1, ease }}
            >
              Digitale Lösungen.
            </motion.span>
            <motion.span
              className="block bg-gradient-to-b from-snow via-mute-300 to-mute-500 bg-clip-text pb-2 text-transparent"
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.22, ease }}
            >
              Die wirklich etwas bewegen.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease }}
            className="lead mx-auto mt-7 max-w-2xl"
          >
            Wir entwickeln moderne Websites, intelligente Automationen und individuelle Softwarelösungen, die dein
            Unternehmen digital voranbringen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            <Button href="/#kontakt" size="lg" arrow>
              Projekt besprechen
            </Button>
            <Button href="/#leistungen" size="lg" variant="secondary">
              Leistungen entdecken
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-mute-500"
          >
            {['Unverbindliches Erstgespräch', 'Schweizweit & digital', 'Individuell statt Vorlage'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className="size-1 rounded-full bg-mute-500" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="mt-16 md:mt-20">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
