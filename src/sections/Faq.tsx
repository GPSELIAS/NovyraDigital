import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import SmartLink from '../components/ui/SmartLink'

export const faqs = [
  {
    q: 'Was kostet eine professionelle Website?',
    a: (
      <>
        Unter{' '}
        <SmartLink href="/#angebote" className="text-snow underline decoration-accent/60 underline-offset-4 hover:decoration-accent">
          Angebote
        </SmartLink>{' '}
        findest du die Preise und den Umfang von Website Start und Website Plus. Für grössere Vorhaben erstelle ich dir nach einem ersten Gespräch eine individuelle Offerte.
      </>
    ),
  },
  {
    q: 'Wie lange dauert die Entwicklung?',
    a: 'Die Projektdauer richtet sich nach Umfang und Komplexität. Einfache Websites lassen sich in der Regel schneller realisieren als umfangreiche Softwarelösungen.',
  },
  {
    q: 'Könnt ihr bestehende Geschäftsprozesse automatisieren?',
    a: 'Ja. Ich analysiere bestehende Abläufe und prüfe, welche Prozesse sich durch Automatisierung und KI sinnvoll vereinfachen lassen.',
  },
  {
    q: 'Bietet ihr auch Unterstützung nach dem Launch?',
    a: 'Auf Wunsch unterstütze ich dich auch nach der Veröffentlichung bei Anpassungen, Wartung und Weiterentwicklung.',
  },
  {
    q: 'Arbeitet ihr mit Unternehmen in der ganzen Schweiz?',
    a: 'Ja. Die Zusammenarbeit ist schweizweit und vollständig digital möglich.',
  },
  {
    q: 'Ist das erste Gespräch unverbindlich?',
    a: 'Ja. In einem ersten Gespräch klären wir gemeinsam dein Anliegen und besprechen mögliche Lösungsansätze – unverbindlich.',
  },
]

function Item({ q, a, open, onToggle }: { q: string; a: ReactNode; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <div className="border-b border-white/[0.07]">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className={`text-[17px] font-medium tracking-[-0.01em] transition-colors sm:text-lg ${open ? 'text-snow' : 'text-mute-300 group-hover:text-snow'}`}>
            {q}
          </span>
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open ? 'rotate-45 border-accent bg-accent text-white' : 'border-white/12 text-mute-400 group-hover:border-white/25'
            }`}
          >
            <Plus className="size-4" aria-hidden />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 pr-12 text-[15.5px] leading-relaxed text-mute-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-24 md:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Häufige Fragen." description="Antworten auf die Fragen, die mir am häufigsten gestellt werden." />
            <Reveal delay={0.15}>
              <p className="mt-8 text-[15px] text-mute-400">
                Deine Frage ist nicht dabei?{' '}
                <SmartLink href="/#kontakt" className="text-snow underline decoration-accent/60 underline-offset-4 transition-colors hover:decoration-accent">
                  Schreib mir
                </SmartLink>
                .
              </p>
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.1} className="border-t border-white/[0.07] lg:col-span-7">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
