import Button from '../components/ui/Button'
import { useSeo } from '../lib/seo'

export default function NotFound() {
  useSeo({
    title: 'Seite nicht gefunden – Novyra Digital',
    description: 'Die angeforderte Seite existiert nicht.',
    path: '/404',
    noindex: true,
  })
  return (
    <section className="relative flex min-h-[80vh] items-center pt-32 pb-24">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_45%,black,transparent)]" />
      <div className="container-x relative text-center">
        <p className="font-mono text-sm text-accent-soft">404</p>
        <h1 className="display mt-4 text-5xl sm:text-6xl">Diese Seite gibt es nicht.</h1>
        <p className="lead mx-auto mt-5 max-w-md">Möglicherweise wurde sie verschoben oder die Adresse ist fehlerhaft.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg" arrow>
            Zur Startseite
          </Button>
          <Button href="/#kontakt" size="lg" variant="secondary">
            Kontakt aufnehmen
          </Button>
        </div>
      </div>
    </section>
  )
}
