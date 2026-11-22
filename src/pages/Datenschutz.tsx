import LegalLayout, { legal } from './LegalLayout'
import { site } from '../config/site'
import { useSeo } from '../lib/seo'

export default function Datenschutz() {
  const { hosting, outboundMail, spamProtection } = site.services

  useSeo({
    title: `Datenschutzerklärung – ${site.name}`,
    description: `Datenschutzerklärung von ${site.name} gemäss Schweizer Datenschutzgesetz (DSG).`,
    path: '/datenschutz',
  })

  return (
    <LegalLayout eyebrow="Rechtliches" title="Datenschutzerklärung">
      <p>
        Hier erfährst du, wie wir auf {new URL(site.url).hostname} und bei der Bearbeitung von Anfragen Personendaten
        verarbeiten. Für diese Bearbeitung gilt das Schweizer Datenschutzgesetz (DSG).
      </p>

      <h2>Verantwortlicher</h2>
      <p>
        <strong className="text-snow">{site.name}</strong>
        <br />
        {legal('owner', 'Inhaber')}
        <br />
        {legal('street', 'Strasse und Hausnummer')}
        <br />
        {legal('city', 'PLZ und Ort')}
        <br />
        {site.country}
        <br />
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>Hosting über {hosting}</h2>
      <p>
        {hosting} liefert die Website aus und betreibt die serverseitige Funktion für das Kontaktformular. Bei einem
        Aufruf fallen technisch erforderliche Daten an, etwa IP-Adresse, Zeitpunkt, aufgerufene URL, HTTP-Status
        sowie vom Browser übermittelte Angaben wie Browserkennung und gegebenenfalls die Herkunftsseite. Diese
        Daten können in Zugriffs- und Betriebsprotokollen verarbeitet werden, um die Website bereitzustellen,
        Fehler zu untersuchen und ihren Betrieb zu schützen.
      </p>
      <p>
        Die Kontaktfunktion protokolliert technische Fehler ohne Formularinhalte. {hosting} kann Anfragen an die
        Funktion pro IP-Adresse und Domain begrenzen, um Missbrauch zu reduzieren.
      </p>

      <h2>Kontaktformular und E-Mail</h2>
      <p>
        Wir bearbeiten deine Angaben, um deine Anfrage zu beantworten, Rückfragen zu klären und bei Bedarf ein
        Angebot vorzubereiten. Bei aktiviertem Kontaktformular übermittelst du folgende Angaben an die Funktion
        auf {hosting}:
      </p>
      <ul>
        <li>Vor- und Nachname, E-Mail-Adresse, gewünschte Dienstleistung und Nachricht als Pflichtfelder</li>
        <li>Unternehmen und Telefonnummer, wenn du sie angibst</li>
        <li>Bestätigung der Kenntnisnahme dieser Datenschutzerklärung</li>
        <li>Prüftoken für {spamProtection} und ein verborgenes, leer zu lassendes Feld zum Spamschutz</li>
      </ul>

      <h3>Versand über {outboundMail}</h3>
      <p>
        Nach der Prüfung übergibt die Funktion deine Kontaktangaben, die gewählte Dienstleistung, deine Nachricht
        und die Bestätigung der Kenntnisnahme an {outboundMail}. Der Dienst stellt die Anfrage unserem Postfach zu
        und verarbeitet dafür auch die Versand- und Empfängeradresse sowie deine E-Mail-Adresse als Antwortadresse.
        Die technischen Spamschutzfelder werden nicht in die Nachricht übernommen. Falls die automatische
        Eingangsbestätigung aktiviert ist, erhältst du nach Annahme der internen E-Mail durch {outboundMail} eine
        Bestätigung mit deinem Vornamen und dem gewählten Thema an deine E-Mail-Adresse.
      </p>
      <p>
        Laut {outboundMail} werden Nachrichteninhalte und Zustellprotokolle in den USA gespeichert. Die für die
        Absenderdomain gewählte Versandregion betrifft die Zustellung.
        {' '}<a href="https://resend.com/security/gdpr">Datenbearbeitung bei {outboundMail}</a>
      </p>

      <h3>Postfach bei {site.legal.mailProvider}</h3>
      <p>
        {site.legal.mailProvider} betreibt unser geschäftliches Postfach {site.email}. Direkt gesendete E-Mails und
        zugestellte Formularanfragen werden dort mit ihren Inhalten und Zustellinformationen verarbeitet und
        gespeichert. Dazu gehören bei direkten E-Mails auch mitgeschickte Anhänge. Wir nutzen das Postfach, um
        Anfragen und die dazugehörige Korrespondenz zu bearbeiten.
      </p>

      <h2>Spam- und Missbrauchsschutz mit {spamProtection}</h2>
      <p>
        Bei aktiviertem Formular lädt der Browser das Skript und den Prüfrahmen von Cloudflare, sobald sich das
        Prüffeld nahe am sichtbaren Bereich befindet. Cloudflare kann dabei technische Angaben wie IP-Adresse,
        Browser- und Gerätemerkmale sowie Interaktionssignale verarbeiten, um automatisierte Anfragen zu erkennen.
        Beim Absenden übermittelt die Kontaktfunktion das Prüftoken an Cloudflare und prüft das Ergebnis. Die
        Formularinhalte werden Cloudflare für diese Prüfung nicht übermittelt.
        {' '}<a href="https://www.cloudflare.com/turnstile-privacy-policy/">Datenschutzhinweise zu {spamProtection}</a>
      </p>

      <h2>Cookies, Analyse und eingebettete Inhalte</h2>
      <p>
        Die Website selbst setzt keine Cookies und verwendet keine Analyse- oder Tracking-Skripte. Die Schriftart
        Geist und die übrigen Website-Dateien werden über das eigene Hosting ausgeliefert. {spamProtection} ist
        die einzige vorgesehene externe Einbindung. Bei aktivem Widget kann Cloudflare zur Sicherheitsprüfung
        technisch erforderliche Speichermechanismen einsetzen. Die Einrichtung sieht vor, die optionale
        Vorabfreigabe («Pre-clearance») auszuschalten.
      </p>

      <h2>Aufbewahrung</h2>
      <p>
        Die Website führt keine separate Datenbank für Kontaktanfragen. Wir bewahren Anfragen und Korrespondenz
        im Postfach auf, solange wir sie für die Bearbeitung, eine daraus entstehende Geschäftsbeziehung oder
        anwendbare gesetzliche Aufbewahrungspflichten benötigen. Bei den beteiligten Diensten können zusätzlich
        technische Protokolle und Zustelldaten anfallen. Die konkreten Aufbewahrungs- und Löschfristen der
        eingesetzten Dienste werden noch geprüft.
      </p>

      <h2>Bearbeitung im Ausland</h2>
      <p>
        Bei der Bereitstellung der Website, der Missbrauchsprüfung und dem Versand können Personendaten auch im
        Ausland, insbesondere in den USA, bearbeitet werden. Für {outboundMail} ist die Speicherung in den USA in
        den Anbieterinformationen ausgewiesen. Die vollständigen Bearbeitungsländer, allfällige Unterauftragnehmer
        sowie die im konkreten Vertragsverhältnis geltenden Garantien für Auslandbekanntgaben werden vor
        Inbetriebnahme geprüft und hier ergänzt.
      </p>

      <h2>Deine Rechte</h2>
      <p>
        Nach den gesetzlichen Voraussetzungen kannst du Auskunft über deine Personendaten, deren Berichtigung
        oder Löschung sowie die Herausgabe oder Übertragung verlangen. Wende dich dazu an
        {' '}<a href={`mailto:${site.email}`}>{site.email}</a>. Du kannst dich auch an den
        {' '}<a href="https://www.edoeb.admin.ch/">Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB)</a>
        {' '}wenden.
      </p>
    </LegalLayout>
  )
}
