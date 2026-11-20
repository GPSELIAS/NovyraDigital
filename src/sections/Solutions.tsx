import type { ComponentType } from 'react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import { AutomationMockup, DashboardMockup, WebsiteMockup } from '../components/visuals/Mockups'

interface Scenario {
  title: string
  area: string
  text: string
  points: string[]
  Visual: ComponentType
}

const scenarios: Scenario[] = [
  {
    title: 'Digitale Unternehmenswebsite',
    area: 'Webdesign & Entwicklung',
    text: 'Ein moderner Webauftritt, der dein Angebot klar präsentiert, auf allen Geräten überzeugt und Interessierte gezielt zur Kontaktaufnahme führt.',
    points: ['Individuelles Design', 'Schnelle Ladezeiten', 'Anfrageformular mit Spam-Schutz'],
    Visual: WebsiteMockup,
  },
  {
    title: 'Automatisierte Kundenanfragen',
    area: 'KI & Automatisierung',
    text: 'Eingehende Anfragen werden automatisch erfasst, vorsortiert und an die richtige Stelle weitergeleitet – inklusive Bestätigung an die anfragende Person.',
    points: ['Automatische Lead-Erfassung', 'KI-gestützte Vorsortierung', 'Anbindung an bestehende Tools'],
    Visual: AutomationMockup,
  },
  {
    title: 'Individuelles Business-Dashboard',
    area: 'Individuelle Software',
    text: 'Alle relevanten Kennzahlen und Abläufe an einem Ort: Ein Dashboard, das Daten aus verschiedenen Quellen zusammenführt und Entscheidungen erleichtert.',
    points: ['Zentrale Datenübersicht', 'Rollen & Zugriffsrechte', 'Schnittstellen zu bestehender Software'],
    Visual: DashboardMockup,
  },
]

export default function Solutions() {
  return (
    <section id="loesungen" aria-labelledby="loesungen-title" className="relative border-t border-white/[0.06] bg-ink-900/40 py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="loesungen-title"
            eyebrow="Anwendungsbeispiele"
            title="Lösungen, die wir realisieren."
            description="Drei typische Szenarien, wie digitale Lösungen im Unternehmensalltag aussehen können. Die Darstellungen sind illustrative Beispiele und keine Kundenprojekte."
          />
        </div>

        <div className="mt-16 space-y-5">
          {scenarios.map((s, i) => (
            <Reveal key={s.title}>
              <article
                aria-labelledby={`sc-${i}`}
                className="card group grid overflow-hidden transition-colors duration-500 hover:border-white/[0.13] md:grid-cols-2"
              >
                <div className={`flex flex-col justify-center p-7 sm:p-10 lg:p-14 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-accent-soft">
                      Beispiel {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] text-mute-500">{s.area}</span>
                  </div>
                  <h3 id={`sc-${i}`} className="mt-6 text-[1.75rem] font-semibold leading-tight tracking-[-0.025em] text-snow sm:text-[2rem]">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-mute-400">{s.text}</p>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[13px] text-mute-300">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`relative min-h-[300px] border-t border-white/[0.06] bg-ink-950/60 md:min-h-[380px] md:border-t-0 ${i % 2 === 1 ? 'md:border-r' : 'md:border-l'} md:border-white/[0.06]`}>
                  <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                  <div className="relative h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]">
                    <s.Visual />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
