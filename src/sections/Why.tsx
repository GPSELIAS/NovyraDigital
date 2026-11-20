import { Fingerprint, MessagesSquare, Gauge, Route } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'

const benefits = [
  {
    icon: Fingerprint,
    title: 'Individuell statt von der Stange',
    text: 'Jedes Unternehmen ist anders. Deshalb entwickeln wir Lösungen, die zu deinen Anforderungen passen.',
  },
  {
    icon: MessagesSquare,
    title: 'Klare Kommunikation',
    text: 'Wir erklären technische Möglichkeiten verständlich und begleiten dich transparent durch dein Projekt.',
  },
  {
    icon: Gauge,
    title: 'Effizienz im Fokus',
    text: 'Unser Ziel sind digitale Lösungen, die Abläufe vereinfachen und langfristig einen Mehrwert schaffen.',
  },
  {
    icon: Route,
    title: 'Von der Idee bis zur Umsetzung',
    text: 'Wir unterstützen dich von der ersten Planung über die Entwicklung bis zur Veröffentlichung.',
  },
]

/** «Über uns» – Haltung und Arbeitsweise, ohne erfundene Team- oder Firmenangaben. */
export default function Why() {
  return (
    <section id="ueber-uns" aria-labelledby="ueber-uns-title" className="relative overflow-hidden bg-snow py-24 text-ink-950 md:py-36">
      <div aria-hidden className="bg-grid-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              id="ueber-uns-title"
              tone="light"
              eyebrow="Warum Novyra Digital"
              title="Technologie ist nur dann wertvoll, wenn sie etwas verbessert."
            />
          </div>
          <Reveal delay={0.1} className="lg:col-span-5 lg:pt-14">
            <p className="text-[17px] leading-relaxed text-ink-700">
              Novyra Digital ist eine Schweizer Digitalagentur für Webentwicklung, KI-Automationen und individuelle
              Softwarelösungen.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-mute-500">
              Unsere Mission: professionelle Digitalisierung für kleine und mittelständische Unternehmen zugänglich
              machen – unkompliziert, effizient und individuell. Wir verbinden modernes Design mit technischer Kompetenz
              und persönlicher Zusammenarbeit.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-ink-950/[0.08] bg-ink-950/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.07} className="h-full">
              <article className="group relative flex h-full flex-col bg-white p-7 transition-colors duration-500 hover:bg-[#fcfcfd] sm:p-8">
                <span className="flex size-11 items-center justify-center rounded-xl bg-ink-950 text-snow transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:bg-accent">
                  <b.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-10 text-lg font-semibold tracking-[-0.015em] text-ink-950">{b.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mute-500">{b.text}</p>
                <span aria-hidden className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
