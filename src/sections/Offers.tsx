import { AppWindow, PanelsTopLeft, Workflow, Bot, LayoutDashboard, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import SmartLink from '../components/ui/SmartLink'
import OfferArtwork from '../components/visuals/OfferArtwork'
import { useServiceSelection } from '../lib/service-context'
import type { ServiceValue } from '../../shared/contact'

const packages = [
  {
    service: 'website-start',
    title: 'Website Start',
    description: 'Ein kompakter Auftritt für dein Angebot.',
    currency: 'CHF',
    price: '590',
    priceNote: 'Festpreis',
    scope: ['Eine Seite mit bis zu 5 Abschnitten', 'Für Smartphone & Desktop optimiert', 'Kontaktformular', 'Basis-SEO'],
    icon: AppWindow,
  },
  {
    service: 'website-plus',
    title: 'Website Plus',
    description: 'Mehr Raum für Leistungen und Referenzen.',
    currency: 'ab CHF',
    price: '1’290',
    priceNote: 'je nach Umfang',
    scope: ['Bis zu 5 individuell gestaltete Seiten', 'Für Smartphone & Desktop optimiert', 'Kontaktformular', 'SEO je Seite'],
    icon: PanelsTopLeft,
  },
] satisfies { service: ServiceValue; title: string; description: string; currency: string; price: string; priceNote: string; scope: string[]; icon: typeof AppWindow }[]

const projects = [
  {
    service: 'automation',
    title: 'Automationen',
    description: 'Anfragen, Termine und CRM automatisch miteinander verbinden.',
    action: 'Automation anfragen',
    icon: Workflow,
  },
  {
    service: 'ki-bot',
    title: 'KI-Bots',
    description: 'Häufige Fragen direkt beantworten und Anfragen aufnehmen.',
    action: 'KI-Bot anfragen',
    icon: Bot,
  },
  {
    service: 'webapp',
    title: 'Webapps',
    description: 'Kundenportale, Dashboards und interne Tools nach Mass.',
    action: 'Webapp anfragen',
    icon: LayoutDashboard,
  },
] satisfies { service: ServiceValue; title: string; description: string; action: string; icon: typeof AppWindow }[]

const kicker = 'flex items-center gap-2.5 text-sm font-medium tracking-wide text-warm before:h-px before:w-5 before:bg-current'

export default function Offers() {
  const { selectService } = useServiceSelection()

  return (
    <section id="angebote" aria-labelledby="angebote-title" className="border-y border-white/[0.06] bg-ink-900/15 py-14 md:py-16">
      <div className="container-x">
        <div className="grid items-center gap-6 md:grid-cols-[1.3fr_1fr] lg:gap-9">
          <div>
            <p className={kicker}>Webdesign &amp; Entwicklung</p>
            <h2 id="angebote-title" className="display mt-4 text-[clamp(2.5rem,5.5vw,4rem)] tracking-[-0.055em]">
              Die Website, die<br className="hidden md:block" /> zu dir passt.
            </h2>
            <p className="mt-4 max-w-[30rem] text-[17px] leading-relaxed text-mute-400">
              Zwei Pakete für Selbstständige und KMU, vom kompakten Onepager bis zur mehrseitigen Firmenwebsite.
            </p>
          </div>
          <OfferArtwork />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {packages.map((offer) => {
            const plus = offer.service === 'website-plus'
            return (
              <article
                key={offer.service}
                aria-labelledby={`offer-${offer.service}`}
                className={`card flex min-w-0 flex-col rounded-[21px] p-5 sm:p-6 lg:p-7 ${plus
                  ? 'border-accent-soft/35 bg-[#131925] bg-[radial-gradient(ellipse_at_94%_0%,#20315b,transparent_82%)]'
                  : 'bg-ink-900 bg-[radial-gradient(ellipse_at_100%_0%,#1c1c21,transparent_65%)]'}`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent-soft/25 bg-accent-soft/10 text-accent-soft">
                    <offer.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 id={`offer-${offer.service}`} className="text-[1.375rem] leading-tight font-semibold tracking-tight">{offer.title}</h3>
                    <p className={`mt-1 leading-relaxed ${plus ? 'text-[#bdc9e1]' : 'text-mute-400'}`}>{offer.description}</p>
                  </div>
                </div>

                <div className="mt-5 mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-[clamp(2.25rem,4vw,3rem)] leading-none font-semibold tracking-[-0.06em] tabular-nums">
                    <span className={`text-base font-medium tracking-normal whitespace-nowrap ${plus ? 'text-accent-soft' : 'text-mute-400'}`}>{offer.currency}</span>{' '}
                    {offer.price}
                  </p>
                  <p className={`text-sm ${plus ? 'text-[#bdc9e1]' : 'text-mute-400'}`}>{offer.priceNote}</p>
                </div>

                <ul className="space-y-2 border-t border-white/10 pt-4">
                  {offer.scope.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-mute-300">
                      <Check className="mt-1 size-4 shrink-0 text-accent-soft" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  <Button
                    href="/#kontakt"
                    variant="secondary"
                    size="lg"
                    className={`w-full ${plus
                      ? 'border-accent-soft/45! bg-accent-soft/10! hover:border-accent-soft/70! hover:bg-accent-soft/20!'
                      : 'border-transparent! bg-[#a5bbff]! font-semibold! text-[#0e1731]! hover:bg-[#c1cfff]!'}`}
                    onClick={() => selectService(offer.service)}
                  >
                    {offer.title} anfragen
                  </Button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-5 rounded-[21px] border border-warm/25 bg-[#151210] bg-[radial-gradient(ellipse_at_100%_0%,#302116,transparent_76%)] p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
            <div>
              <p className={kicker}>Individuelle Projekte</p>
              <h3 className="mt-2 text-[clamp(1.75rem,3.5vw,2.4rem)] leading-tight font-semibold tracking-[-0.045em]">Was soll einfacher werden?</h3>
              <p className="mt-1.5 leading-relaxed text-[#c4b8ae]">Ich entwickle die passende Lösung für deine Abläufe und deine Kundschaft.</p>
            </div>
            <p className="shrink-0 rounded-full border border-warm/35 bg-warm/10 px-3.5 py-1.5 text-sm font-medium text-[#ffd5a1]">Preis auf Anfrage</p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.service} aria-labelledby={`offer-${project.service}`} className="flex min-w-0 flex-col items-start rounded-xl border border-warm/15 bg-black/15 p-4">
                <span className="mb-2.5 flex size-9 items-center justify-center rounded-lg border border-warm/25 bg-warm/10 text-warm">
                  <project.icon className="size-[18px]" aria-hidden />
                </span>
                <h4 id={`offer-${project.service}`} className="text-[17px] font-semibold">{project.title}</h4>
                <p className="mt-1 leading-relaxed text-[#c4b8ae]">{project.description}</p>
                <SmartLink
                  href="/#kontakt"
                  onClick={() => selectService(project.service)}
                  className="mt-auto inline-flex min-h-11 items-center pt-2.5 text-[15px] font-semibold text-warm underline-offset-4 hover:underline"
                >
                  {project.action}
                </SmartLink>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
