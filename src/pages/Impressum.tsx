import LegalLayout, { legal } from './LegalLayout'
import SmartLink from '../components/ui/SmartLink'
import { site } from '../config/site'
import { useSeo } from '../lib/seo'

export default function Impressum() {
  useSeo({
    title: `Impressum – ${site.name}`,
    description: `Impressum und Anbieterkennzeichnung von ${site.name}, Digitalagentur aus der Schweiz.`,
    path: '/impressum',
  })
  const l = site.legal
  return (
    <LegalLayout eyebrow="Rechtliches" title="Impressum">
      <h2>Anbieter</h2>
      <p>
        <strong className="text-snow">{site.name}</strong>
        <br />
        Inhaber: {legal('owner', 'Inhaber')}
        {l.legalForm && (
          <>
            <br />
            Rechtsform: {l.legalForm}
          </>
        )}
        <br />
        {legal('street', 'Strasse und Hausnummer')}
        <br />
        {legal('city', 'PLZ und Ort')}
        <br />
        {site.country}
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
        {l.phone && (
          <>
            <br />
            Telefon: {l.phone}
          </>
        )}
        <br />
        Website: <a href={site.url}>{site.url.replace('https://', '')}</a>
      </p>

      {(l.representative || l.uid || l.commercialRegister) && <h2>Unternehmensangaben</h2>}
      {l.representative && <p>Vertretungsberechtigte Person(en): {l.representative}</p>}
      {l.uid && <p>UID: {l.uid}</p>}
      {l.commercialRegister && <p>Handelsregister: {l.commercialRegister}</p>}

      <h2>Haftungsausschluss</h2>
      <p>
        Wir prüfen die Inhalte dieser Website mit grösster Sorgfalt. Für die Richtigkeit, Genauigkeit, Aktualität,
        Zuverlässigkeit und Vollständigkeit der Informationen können wir jedoch keine Gewähr übernehmen.
        Haftungsansprüche wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff auf oder der Nutzung bzw.
        Nichtnutzung der veröffentlichten Informationen entstanden sind, werden – soweit gesetzlich zulässig –
        ausgeschlossen.
      </p>
      <p>
        Die auf dieser Website dargestellten Anwendungsbeispiele und Visualisierungen dienen der Veranschaulichung
        unserer Leistungen. Es handelt sich nicht um Kundenprojekte oder reale Daten. Ausgenommen sind ausdrücklich als
        «Referenz» gekennzeichnete Projekte; deren Darstellung ist stilisiert und kein Abbild der jeweiligen Website.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Verweise und Links auf Websites Dritter liegen ausserhalb unseres Verantwortungsbereichs. Für deren Inhalte sind
        ausschliesslich die jeweiligen Betreiber verantwortlich. Der Zugriff und die Nutzung solcher Websites erfolgen auf
        eigene Gefahr.
      </p>

      <h2>Urheberrechte</h2>
      <p>
        Die Urheber- und alle weiteren Rechte an Inhalten, Texten, Grafiken und Dateien auf dieser Website gehören
        ausschliesslich {site.name} oder den speziell genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente
        ist die schriftliche Zustimmung der Rechteinhaber im Voraus einzuholen.
      </p>

      <h2>Datenschutz</h2>
      <p>
        Informationen zur Bearbeitung von Personendaten findest du in unserer <SmartLink href="/datenschutz">Datenschutzerklärung</SmartLink>.
      </p>
    </LegalLayout>
  )
}
