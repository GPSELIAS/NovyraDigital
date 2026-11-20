/**
 * Zentrale Unternehmens- und Rechtskonfiguration.
 *
 * ⚠️ VOR DEM LIVEGANG AUSFÜLLEN:
 * Alle Felder mit `null` sind Pflichtangaben, die noch fehlen. Sie werden auf
 * /impressum und /datenschutz deutlich als «ausstehend» markiert, und der
 * Produktionsbuild gibt eine Warnung aus, solange sie leer sind.
 * Keine erfundenen Angaben eintragen.
 */
export const site = {
  name: 'Novyra Digital',
  url: 'https://novyradigital.ch',
  email: 'info@novyradigital.ch',
  country: 'Schweiz',
  tagline: 'Digitale Lösungen. Einfach. Intelligent. Wirkungsvoll.',
  footerClaim: 'Digitale Lösungen für Unternehmen, die mehr erreichen möchten.',

  legal: {
    /** Rechtlicher Inhaber bzw. Firmenname gemäss Handelsregister, z. B. «Max Muster» oder «Novyra Digital GmbH» */
    owner: null as string | null,
    /** Rechtsform, z. B. «Einzelunternehmen» oder «GmbH» */
    legalForm: null as string | null,
    /** Strasse und Hausnummer */
    street: null as string | null,
    /** PLZ und Ort, z. B. «8000 Zürich» */
    city: null as string | null,
    /** UID-Nummer (falls vorhanden), z. B. «CHE-123.456.789» */
    uid: null as string | null,
    /** Handelsregistereintrag (falls vorhanden) */
    commercialRegister: null as string | null,
    /** Vertretungsberechtigte Person(en) */
    representative: null as string | null,
    /** Optional: Telefonnummer für das Impressum */
    phone: null as string | null,
    /** Anbieter des Postfachs info@novyradigital.ch inkl. Sitz, z. B. «Infomaniak Network SA, Genf, Schweiz» */
    mailProvider: null as string | null,
  },

  /** Optionale Felder – erzeugen keine «ausstehend»-Warnung, wenn leer */
  optionalLegal: ['uid', 'commercialRegister', 'phone', 'legalForm', 'representative'] as const,

  /**
   * Öffentlicher Cloudflare-Turnstile-Site-Key (kein Geheimnis – darf im Frontend stehen).
   * Kann per Build-Variable VITE_TURNSTILE_SITE_KEY überschrieben werden (z. B. lokal mit Testschlüssel).
   */
  turnstileSiteKey: null as string | null,

  /** Stand der Rechtstexte */
  legalUpdated: '20. November 2026',
}

export type LegalKey = keyof typeof site.legal

export const nav = [
  { label: 'Startseite', href: '/' },
  { label: 'Leistungen', href: '/#leistungen' },
  { label: 'Über uns', href: '/#ueber-uns' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Kontakt', href: '/#kontakt' },
] as const
