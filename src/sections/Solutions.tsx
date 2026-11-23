import type { ComponentType } from 'react'
import { ArrowUpRight } from 'lucide-react'
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

/** Echte Kundenreferenz (vom Inhaber freigegeben). Visual ist eine stilisierte Darstellung, kein Screenshot. */
function Reference() {
  return (
    <article
      aria-labelledby="ref-atelier-b"
      className="group grid overflow-hidden rounded-2xl border border-warm/25 bg-ink-900/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition-colors duration-500 hover:border-warm/45 md:grid-cols-2"
    >
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-warm/35 bg-warm/10 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-warm">
            Referenz
          </span>
          <span className="text-[13px] text-mute-400">Webdesign &amp; Entwicklung</span>
        </div>
        <h3 id="ref-atelier-b" className="mt-6 text-[1.75rem] font-semibold leading-tight tracking-[-0.025em] text-snow sm:text-[2rem]">
          Atelier B Pilates
        </h3>
        <p className="mt-2 text-[15px] text-mute-300">Boutique-Studio für Reformer Pilates in Interlaken</p>
        <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-mute-400">
          Website für ein Pilates-Studio im Berner Oberland, die Angebot, Kursformat und Terminbuchung klar und
          einladend präsentiert.
        </p>
        <div className="mt-8">
          <a
            href="https://atelierbpilates.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-snow transition-colors hover:border-white/25 hover:bg-white/[0.07]"
          >
            atelierbpilates.ch ansehen
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            <span className="sr-only">(öffnet in neuem Tab)</span>
          </a>
        </div>
      </div>

      {/* Stilisierte Darstellung der Website im Browserrahmen */}
      <div aria-hidden className="relative min-h-[300px] border-t border-white/[0.06] bg-ink-950/60 p-6 sm:p-8 md:min-h-[380px] md:border-t-0 md:border-l">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgb(245_185_113/0.14),transparent)]" />
        <div className="relative mx-auto flex h-full max-w-md flex-col overflow-hidden rounded-xl border border-white/10 bg-sand shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]">
          <div className="flex items-center gap-1.5 border-b border-sand-ink/10 bg-white/70 px-3 py-2.5">
            <span className="size-2 rounded-full bg-sand-ink/15" />
            <span className="size-2 rounded-full bg-sand-ink/15" />
            <span className="size-2 rounded-full bg-sand-ink/15" />
            <span className="ml-3 h-4 flex-1 rounded bg-sand-ink/[0.06] px-2 font-mono text-[9px] leading-4 text-sand-mute">atelierbpilates.ch</span>
          </div>
          <div className="flex flex-1 flex-col justify-center px-7 py-8 text-sand-ink">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-sand-mute">Atelier B Pilates</p>
            <p className="mt-3 text-[1.6rem] font-semibold leading-[1.1] tracking-tight">Reformer Pilates in Interlaken</p>
            <p className="mt-3 text-[12px] leading-relaxed text-sand-mute">50-minütige Kurse in Kleingruppen mit max. 6 Personen.</p>
            <span className="mt-5 inline-flex w-fit rounded-full bg-sand-ink px-4 py-2 text-[11px] font-medium text-sand">Termin buchen</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Solutions() {
  return (
    <section id="loesungen" aria-labelledby="loesungen-title" className="relative border-t border-white/[0.06] bg-ink-900/40 py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="loesungen-title"
            eyebrow="Projekte"
            title="Lösungen, die ich realisiere."
            description="Ein Projekt aus der Praxis und drei typische Szenarien, wie digitale Lösungen im Unternehmensalltag aussehen können."
          />
        </div>

        <Reveal className="mt-16">
          <Reference />
        </Reveal>

        <p className="mt-16 text-[13px] text-mute-400">
          Anwendungsbeispiele: Die folgenden Darstellungen sind illustrativ und keine Kundenprojekte.
        </p>

        <div className="mt-5 space-y-5">
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
