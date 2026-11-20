import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'

const steps = [
  {
    n: '01',
    title: 'Kennenlernen',
    text: 'Wir sprechen über dein Unternehmen, deine Ziele und die Herausforderungen, die du lösen möchtest.',
  },
  {
    n: '02',
    title: 'Konzept',
    text: 'Wir entwickeln einen passenden Lösungsansatz und definieren gemeinsam die nächsten Schritte.',
  },
  {
    n: '03',
    title: 'Entwicklung',
    text: 'Wir setzen die vereinbarte Lösung technisch um und legen Wert auf Design, Funktionalität und Qualität.',
  },
  {
    n: '04',
    title: 'Launch & Weiterentwicklung',
    text: 'Nach erfolgreicher Prüfung geht dein Projekt live. Auf Wunsch begleiten wir dich auch bei der Weiterentwicklung.',
  },
]

export default function Process() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const scaleY = scaleX

  return (
    <section id="prozess" aria-labelledby="prozess-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading id="prozess-title" eyebrow="So arbeiten wir" title="Ein klarer Prozess. Ein überzeugendes Ergebnis." />

        <ol ref={ref} className="relative mt-16 grid gap-10 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {/* Fortschrittslinie: horizontal (Desktop) bzw. vertikal (Mobil) */}
          <div aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-px bg-white/[0.08] lg:block">
            <motion.div style={{ scaleX }} className="h-full origin-left bg-gradient-to-r from-accent to-accent-soft" />
          </div>
          <div aria-hidden className="absolute bottom-2 left-[22px] top-2 w-px bg-white/[0.08] lg:hidden">
            <motion.div style={{ scaleY }} className="h-full w-full origin-top bg-gradient-to-b from-accent to-accent-soft" />
          </div>

          {steps.map((s, i) => (
            <li key={s.n} className="relative pl-16 lg:pl-0">
              <Reveal delay={i * 0.1}>
                <span className="absolute left-0 top-0 flex size-11 items-center justify-center rounded-full border border-white/10 bg-ink-900 font-mono text-[13px] text-snow shadow-[0_0_0_6px_var(--color-ink-950)] lg:relative">
                  {s.n}
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-snow lg:mt-8">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-mute-400">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
