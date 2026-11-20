import Hero from '../sections/Hero'
import Services from '../sections/Services'
import Why from '../sections/Why'
import Process from '../sections/Process'
import Solutions from '../sections/Solutions'
import Faq from '../sections/Faq'
import Contact from '../sections/Contact'
import { useSeo } from '../lib/seo'

export default function Home() {
  useSeo({
    title: 'Novyra Digital – Webdesign, KI-Automatisierung & Software aus der Schweiz',
    description:
      'Novyra Digital ist eine Schweizer Digitalagentur für moderne Websites, KI-Automatisierung und individuelle Softwarelösungen für KMU, Selbstständige und Dienstleister.',
    path: '/',
  })
  return (
    <>
      <Hero />
      <Services />
      <Why />
      <Process />
      <Solutions />
      <Faq />
      <Contact />
    </>
  )
}
