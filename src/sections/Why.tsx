import { HeartHandshake, MessagesSquare, ShieldCheck, MapPin } from 'lucide-react'
import Reveal from '../components/ui/Reveal'

const values = [
  { icon: HeartHandshake, title: 'Persönlich', text: 'Eine Ansprechperson vom ersten Gespräch bis zum Launch.' },
  { icon: MessagesSquare, title: 'Verständlich', text: 'Klare Worte statt Fachbegriffe und eine Offerte, die du verstehst.' },
  { icon: ShieldCheck, title: 'Ehrlich', text: 'Ich rate auch ab, wenn etwas für dich keinen Sinn ergibt.' },
  { icon: MapPin, title: 'Lokal', text: 'Aus Biel, schweizweit und vollständig digital erreichbar.' },
]

/** «Über mich» – Haltung und Arbeitsweise, basierend auf Mission und Positionierung (keine erfundenen Angaben). */
export default function Why() {
  return (
    <section id="ueber-mich" aria-labelledby="ueber-mich-title" className="relative overflow-hidden bg-sand py-24 text-sand-ink md:py-32">
      <div aria-hidden className="bg-grid-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow !text-sand-mute">
            <span aria-hidden className="inline-block h-px w-6 bg-accent" />
            Über mich
          </p>
          <h2 id="ueber-mich-title" className="sr-only">
            Über mich
          </h2>
          <blockquote className="mt-6 text-[1.9rem] font-semibold leading-[1.2] tracking-[-0.025em] text-balance sm:text-[2.5rem]">
            «Ich will, dass meine Kundinnen und Kunden verstehen, was ich baue, und dass es ihnen im Alltag wirklich
            etwas bringt.»
          </blockquote>
          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-sand-mute">
            Mit Novyra Digital möchte ich professionelle Digitalisierung für kleine und mittelständische Unternehmen
            zugänglich machen: unkompliziert, effizient und individuell. Dabei verbinde ich modernes Design mit
            technischer Kompetenz und persönlicher Zusammenarbeit.
          </p>
          <p className="mt-6 font-semibold">Elias Golam, Gründer von Novyra Digital</p>
        </Reveal>

        <div className="grid content-center gap-3.5 sm:grid-cols-2 lg:col-span-5">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07} className="h-full">
              <article className="group h-full rounded-2xl bg-white p-6 shadow-[0_1px_0_rgb(28_26_23/0.06)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-sand-ink text-sand transition-colors duration-500 group-hover:bg-accent">
                  <v.icon className="size-[18px]" aria-hidden />
                </span>
                <h3 className="mt-5 text-[17px] font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-sand-mute">{v.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
