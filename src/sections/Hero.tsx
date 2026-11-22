import { motion } from 'motion/react'
import { Mail, MapPin } from 'lucide-react'
import Button from '../components/ui/Button'
import { site } from '../config/site'

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 md:pb-28">
      {/* Hintergrund: feines Raster + warmes, langsam driftendes Licht */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_55%_at_70%_35%,black,transparent)]" />
        <div className="absolute right-[-15%] top-[-20%] h-[760px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgb(245_185_113/0.16),rgb(79_124_255/0.10)_55%,transparent_80%)] blur-2xl animate-drift will-change-transform" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-warm"
          >
            <MapPin className="size-4" aria-hidden />
            Digitalagentur aus Biel
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="display mt-6 text-[2.75rem] sm:text-6xl lg:text-[4.6rem]"
          >
            Digitale Lösungen,
            <br />
            persönlich gemacht.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="lead mt-7 max-w-xl"
          >
            Ich bin Elias und helfe kleinen und mittleren Unternehmen mit Websites, Automationen und Software, die
            sich gut anfühlen und einfach funktionieren.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease }}
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Button href="/#kontakt" size="lg" arrow>
              Erzähl mir von deinem Projekt
            </Button>
            <Button href="/#leistungen" size="lg" variant="secondary">
              Leistungen ansehen
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-mute-400"
          >
            {['Unverbindliches Erstgespräch', 'Eine feste Ansprechperson', 'Schweizweit & digital'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className="size-1 rounded-full bg-warm" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Visitenkarte mit Porträt */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease }}
          className="mx-auto w-full max-w-[420px] lg:col-span-5 lg:max-w-none"
        >
          <figure className="relative rounded-[28px] border border-white/[0.08] bg-ink-900/90 p-4 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] sm:p-5">
            <div className="overflow-hidden rounded-[20px] bg-ink-850">
              <img
                src="/images/elias-golam-800.webp"
                srcSet="/images/elias-golam-480.webp 480w, /images/elias-golam-800.webp 800w"
                sizes="(min-width: 1024px) 440px, 90vw"
                width={800}
                height={889}
                alt="Porträt von Elias Golam, Gründer von Novyra Digital"
                fetchPriority="high"
                decoding="async"
                className="aspect-[800/889] h-auto w-full object-cover"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-4 px-2 pt-5 pb-1">
              <div>
                <p className="text-lg font-semibold tracking-tight text-snow">Elias Golam</p>
                <p className="mt-0.5 text-sm text-mute-400">Gründer · deine Ansprechperson</p>
              </div>
              <a
                href={`mailto:${site.email}`}
                aria-label="E-Mail an Elias schreiben"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-snow text-ink-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Mail className="size-5" aria-hidden />
              </a>
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  )
}
