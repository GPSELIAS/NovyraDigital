import type { MouseEvent, ReactNode } from 'react'
import { Check, Code2, Workflow, AppWindow } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { useServiceSelection } from '../lib/service-context'
import type { ServiceValue } from '../../shared/contact'

interface Service {
  id: ServiceValue
  index: string
  category: string
  title: string
  text: string
  items: string[]
  cta: string
  icon: ReactNode
}

const services: Service[] = [
  {
    id: 'webdesign',
    index: '01',
    category: 'Webdesign & Entwicklung',
    title: 'Websites, die mehr können als gut aussehen.',
    text: 'Wir entwickeln individuelle Websites, die durch modernes Design, schnelle Ladezeiten und eine überzeugende Nutzererfahrung begeistern. Optimiert für sämtliche Geräte und darauf ausgerichtet, aus Besuchern neue Kunden zu gewinnen.',
    items: ['Unternehmenswebsites', 'Landingpages', 'Responsive Webdesign', 'SEO-Grundoptimierung', 'Performance-Optimierung', 'Kontakt- und Anfrageformulare'],
    cta: 'Website anfragen',
    icon: <AppWindow className="size-5" aria-hidden />,
  },
  {
    id: 'automation',
    index: '02',
    category: 'KI & Automatisierung',
    title: 'Weniger Routine. Mehr Zeit fürs Wesentliche.',
    text: 'Wir automatisieren wiederkehrende Geschäftsprozesse und verbinden bestehende Tools zu intelligenten Workflows. So entstehen effizientere Abläufe und mehr Freiraum für die wichtigen Aufgaben.',
    items: ['Automatische Lead-Erfassung', 'E-Mail- und Anfrageautomationen', 'Termin-Workflows', 'KI-gestützte Prozesse', 'CRM-Integrationen', 'n8n-Automationen'],
    cta: 'Automation anfragen',
    icon: <Workflow className="size-5" aria-hidden />,
  },
  {
    id: 'software',
    index: '03',
    category: 'Individuelle Software',
    title: 'Software, die sich deinem Unternehmen anpasst.',
    text: 'Wir entwickeln digitale Anwendungen und interne Tools, die genau dort ansetzen, wo Standardlösungen an ihre Grenzen stossen.',
    items: ['Webanwendungen', 'Kundenportale', 'Dashboards', 'Individuelle Verwaltungssysteme', 'API-Schnittstellen', 'Softwareintegrationen'],
    cta: 'Softwareprojekt anfragen',
    icon: <Code2 className="size-5" aria-hidden />,
  },
]

function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Services() {
  const { selectService } = useServiceSelection()

  return (
    <section id="leistungen" aria-labelledby="leistungen-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="leistungen-title"
          eyebrow="Leistungen"
          title="Was wir für dich möglich machen."
          description="Von der ersten Idee bis zur fertigen Lösung: Wir entwickeln digitale Produkte und automatisierte Prozesse, die zu deinem Unternehmen passen."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08} className="h-full">
              <article
                onMouseMove={trackSpotlight}
                aria-labelledby={`svc-${s.id}`}
                className="card spotlight group flex h-full flex-col p-7 transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-white/[0.14] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] text-accent-soft transition-colors duration-500 group-hover:border-accent/40 group-hover:text-snow">
                    {s.icon}
                  </span>
                  <span className="font-mono text-xs text-mute-500">{s.index}</span>
                </div>

                <p className="mt-8 text-[13px] font-medium text-accent-soft">{s.category}</p>
                <h3 id={`svc-${s.id}`} className="mt-2 text-[1.45rem] font-semibold leading-tight tracking-[-0.02em] text-snow">
                  {s.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-mute-400">{s.text}</p>

                <div className="hairline my-7" />

                <ul className="space-y-2.5" aria-label={`Leistungen ${s.category}`}>
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[14.5px] text-mute-300">
                      <Check className="size-4 shrink-0 text-accent" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-9">
                  <Button
                    href="/#kontakt"
                    variant="secondary"
                    arrow
                    className="w-full"
                    onClick={() => selectService(s.id)}
                  >
                    {s.cta}
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
