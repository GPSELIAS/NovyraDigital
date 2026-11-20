import LegalLayout, { legal } from './LegalLayout'
import { site } from '../config/site'
import { useSeo } from '../lib/seo'

/**
 * Datenschutzerklärung nach dem Schweizer Datenschutzgesetz (DSG, in Kraft seit 1.9.2023).
 * Beschreibt ausschliesslich die tatsächlich eingesetzten Dienste dieser Website.
 * ⚠️ Vor Veröffentlichung anhand der realen Konfiguration und Firmendaten prüfen.
 */
export default function Datenschutz() {
  useSeo({
    title: 'Datenschutzerklärung – Novyra Digital',
    description: 'Datenschutzerklärung von Novyra Digital gemäss Schweizer Datenschutzgesetz (DSG): welche Daten wir bearbeiten, wozu und welche Rechte du hast.',
    path: '/datenschutz',
  })
  return (
    <LegalLayout eyebrow="Rechtliches" title="Datenschutzerklärung">
      <p>
        Mit dieser Datenschutzerklärung informieren wir darüber, welche Personendaten wir im Zusammenhang mit dieser
        Website ({site.url.replace('https://', '')}) bearbeiten, zu welchen Zwecken dies geschieht und welche Rechte dir
        zustehen. Massgebend ist das Schweizer Bundesgesetz über den Datenschutz (DSG). Wir bearbeiten Personendaten nur
        in dem Umfang, der für die genannten Zwecke erforderlich ist.
      </p>

      <h2>1. Verantwortliche Stelle</h2>
      <p>
        Verantwortlich für die Datenbearbeitung ist:
        <br />
        <strong className="text-snow">{site.name}</strong>
        <br />
        {legal('owner', 'Rechtlicher Inhaber / Firmenname')}
        <br />
        {legal('street', 'Strasse und Hausnummer')}
        <br />
        {legal('city', 'PLZ und Ort')}, {site.country}
        <br />
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <p>Für Anliegen zum Datenschutz kannst du uns jederzeit unter dieser E-Mail-Adresse kontaktieren.</p>

      <h2>2. Aufruf der Website und Hosting</h2>
      <p>
        Diese Website wird über <strong className="text-snow">Cloudflare Pages</strong> der Cloudflare, Inc., 101 Townsend
        St., San Francisco, CA 94107, USA, bereitgestellt. Beim Aufruf der Website werden technisch notwendige Daten
        bearbeitet, damit die Seite ausgeliefert, vor Angriffen geschützt und stabil betrieben werden kann. Dazu gehören
        insbesondere:
      </p>
      <ul>
        <li>IP-Adresse des anfragenden Geräts</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>aufgerufene Seite bzw. Datei und übertragene Datenmenge</li>
        <li>Browsertyp, Betriebssystem und Referrer-URL (zuvor besuchte Seite)</li>
      </ul>
      <p>
        Cloudflare betreibt ein weltweites Netzwerk von Rechenzentren. Die Daten können daher auch ausserhalb der Schweiz,
        insbesondere in den USA, bearbeitet werden (siehe Ziffer 7). Weitere Informationen findest du in der{' '}
        <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
          Datenschutzerklärung von Cloudflare
        </a>
        .
      </p>
      <p>
        Die Schriftarten dieser Website werden direkt von unserem Hosting ausgeliefert. Es werden keine Schriftarten von
        externen Anbietern wie Google Fonts nachgeladen.
      </p>

      <h2>3. Kontaktaufnahme und Kontaktformular</h2>
      <p>
        Wenn du uns über das Kontaktformular oder per E-Mail kontaktierst, bearbeiten wir die von dir übermittelten
        Angaben, um deine Anfrage zu beantworten und allfällige Folgefragen zu klären. Beim Kontaktformular sind dies:
      </p>
      <ul>
        <li>Vor- und Nachname, E-Mail-Adresse und gewünschte Dienstleistung (Pflichtangaben)</li>
        <li>Unternehmen und Telefonnummer (freiwillig)</li>
        <li>der Inhalt deiner Nachricht</li>
        <li>die Bestätigung, dass du diese Datenschutzerklärung zur Kenntnis genommen hast</li>
      </ul>
      <p>
        Die Formulardaten werden über eine serverseitige Funktion (Cloudflare Pages Functions) verarbeitet und per E-Mail
        an unser Postfach {site.email} weitergeleitet. Eine Speicherung der Formulardaten in einer separaten Datenbank
        auf der Website findet nicht statt.
      </p>
      <p>
        Zum Schutz vor Missbrauch kann die Anzahl der Anfragen pro IP-Adresse kurzfristig begrenzt werden. Dafür wird
        ausschliesslich ein nicht umkehrbarer Hashwert der IP-Adresse für höchstens zehn Minuten gespeichert.
      </p>

      <h3>E-Mail-Versand über Resend</h3>
      <p>
        Für den technischen Versand der Formular-E-Mails nutzen wir den Dienst <strong className="text-snow">Resend</strong>{' '}
        der Resend, Inc., USA. Dabei werden die Formularinhalte sowie die E-Mail-Adressen von Absender und Empfänger
        an Resend übermittelt und dort zum Zweck der Zustellung bearbeitet. Falls aktiviert, versenden wir über Resend
        zudem eine automatische Eingangsbestätigung an die von dir angegebene E-Mail-Adresse. Weitere Informationen:{' '}
        <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
          Datenschutzerklärung von Resend
        </a>
        .
      </p>

      <h3>E-Mail-Postfach</h3>
      <p>
        Unser Postfach {site.email} wird bereitgestellt von: {legal('mailProvider', 'E-Mail-Anbieter inkl. Sitz')}. Eingehende
        Anfragen werden dort gespeichert.
      </p>

      <h2>4. Spam-Schutz mit Cloudflare Turnstile</h2>
      <p>
        Um das Kontaktformular vor automatisierten Anfragen (Spam, Bots) zu schützen, setzen wir{' '}
        <strong className="text-snow">Cloudflare Turnstile</strong> der Cloudflare, Inc., USA, ein. Turnstile prüft
        anhand technischer Merkmale deines Browsers und deines Geräts (z. B. IP-Adresse, Browserinformationen und
        Interaktionssignale), ob die Anfrage von einem Menschen stammt. Das Turnstile-Skript wird erst geladen, wenn du
        zum Kontaktbereich scrollst. Laut Cloudflare werden die Daten ausschliesslich zur Bot-Erkennung verwendet und
        nicht für Werbezwecke ausgewertet. Weitere Informationen findest du in den{' '}
        <a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer">
          Datenschutzhinweisen zu Turnstile
        </a>
        .
      </p>

      <h2>5. Cookies und Tracking</h2>
      <p>
        Wir verwenden auf dieser Website keine Analyse-, Marketing- oder Tracking-Cookies und keine Tracking-Dienste.
        Es werden keine Nutzerprofile erstellt. Technisch erforderliche Daten, die Cloudflare zum sicheren Betrieb der
        Website bzw. zur Bot-Erkennung (Turnstile) bearbeitet, sind in den Ziffern 2 und 4 beschrieben.
      </p>

      <h2>6. Aufbewahrungsdauer</h2>
      <p>
        Wir bewahren Personendaten nur so lange auf, wie es für den jeweiligen Zweck erforderlich ist. Anfragen und die
        damit verbundene Korrespondenz bewahren wir auf, solange dies zur Bearbeitung deines Anliegens und einer
        allfälligen Geschäftsbeziehung nötig ist. Entsteht daraus ein Vertragsverhältnis, gelten die gesetzlichen
        Aufbewahrungspflichten (z. B. bis zu zehn Jahre für geschäftsrelevante Unterlagen nach Art. 958f OR). Anfragen,
        aus denen keine Geschäftsbeziehung entsteht, löschen wir, sobald sie für die genannten Zwecke nicht mehr benötigt
        werden. Technische Zugriffsdaten werden durch Cloudflare gemäss deren Richtlinien in der Regel nur kurzfristig
        gespeichert.
      </p>

      <h2>7. Bekanntgabe ins Ausland</h2>
      <p>
        Die unter den Ziffern 2 bis 4 genannten Dienstleister Cloudflare und Resend haben ihren Sitz in den USA und
        können Personendaten auch in anderen Ländern bearbeiten. Die USA gelten gemäss Bundesrat für Unternehmen, die
        unter dem Swiss-U.S. Data Privacy Framework zertifiziert sind, als Staat mit angemessenem Datenschutz. Soweit ein
        Dienstleister nicht zertifiziert ist oder Daten in andere Staaten ohne angemessenes Datenschutzniveau übermittelt
        werden, erfolgt die Bekanntgabe auf Grundlage geeigneter Garantien, insbesondere der vom Eidgenössischen
        Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) anerkannten Standardvertragsklauseln.
      </p>

      <h2>8. Deine Rechte</h2>
      <p>Im Rahmen des Schweizer Datenschutzrechts hast du insbesondere folgende Rechte:</p>
      <ul>
        <li>Auskunft darüber, ob und welche Personendaten wir über dich bearbeiten (Art. 25 DSG)</li>
        <li>Berichtigung unrichtiger Personendaten (Art. 32 DSG)</li>
        <li>Löschung bzw. Vernichtung deiner Personendaten, soweit keine gesetzlichen Pflichten entgegenstehen</li>
        <li>Widerspruch gegen bestimmte Datenbearbeitungen</li>
        <li>Herausgabe bzw. Übertragung deiner Personendaten in einem gängigen elektronischen Format (Art. 28 DSG)</li>
        <li>Widerruf einer allfällig erteilten Einwilligung mit Wirkung für die Zukunft</li>
      </ul>
      <p>
        Für die Ausübung deiner Rechte genügt eine Nachricht an <a href={`mailto:${site.email}`}>{site.email}</a>. Wir
        können zur Prüfung deiner Identität einen geeigneten Nachweis verlangen. Zudem hast du das Recht, dich beim{' '}
        <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer">
          Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB)
        </a>{' '}
        zu beschweren.
      </p>

      <h2>9. Datensicherheit</h2>
      <p>
        Wir treffen angemessene technische und organisatorische Massnahmen, um deine Daten vor unbefugtem Zugriff,
        Verlust und Missbrauch zu schützen. Die Übertragung zwischen deinem Browser und unserer Website erfolgt
        verschlüsselt über HTTPS.
      </p>

      <h2>10. Änderungen</h2>
      <p>
        Wir können diese Datenschutzerklärung anpassen, wenn sich die Website, die eingesetzten Dienste oder die
        rechtlichen Vorgaben ändern. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.
      </p>
    </LegalLayout>
  )
}
