import { ArrowUpRight, Mail, MessageCircle, ShieldCheck, Clock } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import ContactForm from '../components/contact/ContactForm'
import { site } from '../config/site'

const notes = [
  { icon: MessageCircle, text: 'Unverbindliches Erstgespräch zu deinem Anliegen' },
  { icon: Clock, text: 'Ich melde mich persönlich und so bald wie möglich bei dir' },
  { icon: ShieldCheck, text: 'Deine Angaben werden nur zur Bearbeitung der Anfrage verwendet' },
]

export default function Contact() {
  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(245_185_113/0.14),transparent)] blur-2xl" />
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_50%_60%_at_20%_30%,black,transparent)]" />
      </div>

      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="kontakt-title"
            eyebrow="Kontakt"
            title="Lass uns einfach mal reden."
            description="Du hast eine Idee, möchtest deine Website modernisieren oder wiederkehrende Prozesse automatisieren? Erzähl mir von deinem Vorhaben. Kein Verkaufsgespräch, sondern ein ehrlicher Austausch darüber, was dir weiterhilft."
          />

          <Reveal delay={0.1}>
            <a
              href={`mailto:${site.email}`}
              className="card group mt-10 flex items-center gap-4 p-5 transition-colors duration-300 hover:border-white/15"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-soft">
                <Mail className="size-5" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block text-[12px] text-mute-500">E-Mail</span>
                <span className="block text-[16px] font-medium text-snow">{site.email}</span>
              </span>
              <ArrowUpRight className="size-5 text-mute-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-snow" aria-hidden />
            </a>

            <ul className="mt-8 space-y-4">
              {notes.map((n) => (
                <li key={n.text} className="flex items-start gap-3 text-[15px] text-mute-400">
                  <n.icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  {n.text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="lg:col-span-7">
          <div className="card relative overflow-hidden">
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
