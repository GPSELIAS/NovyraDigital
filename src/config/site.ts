/**
 * Zentrale Unternehmens- und Rechtskonfiguration.
 *
 * Fehlende Pflichtangaben werden auf
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
    /** Bestätigter Inhaber */
    owner: 'Elias Golam',
    /** Rechtsform, falls bestätigt */
    legalForm: null as string | null,
    /** Strasse und Hausnummer */
    street: 'Bözingenstrasse 12',
    /** PLZ und Ort */
    city: '2502 Biel',
    /** UID-Nummer (falls vorhanden) */
    uid: null as string | null,
    /** Handelsregistereintrag (falls vorhanden) */
    commercialRegister: null as string | null,
    /** Vertretungsberechtigte Person(en) */
    representative: null as string | null,
    /** Optional: Telefonnummer für das Impressum */
    phone: null as string | null,
    /** Anbieter des geschäftlichen Postfachs */
    mailProvider: 'Infomaniak',
  },

  /** Optionale Felder – erzeugen keine «ausstehend»-Warnung, wenn leer */
  optionalLegal: ['uid', 'commercialRegister', 'phone', 'legalForm', 'representative'] as const,

  services: {
    hosting: 'Netlify',
    outboundMail: 'Resend',
    spamProtection: 'Cloudflare Turnstile',
  },

  /** Stand der Rechtstexte */
  legalUpdated: '20. November 2026',
}

export type LegalKey = keyof typeof site.legal

export const nav = [
  { label: 'Startseite', href: '/' },
  { label: 'Angebote', href: '/#angebote' },
  { label: 'Leistungen', href: '/#leistungen' },
  { label: 'Über mich', href: '/#ueber-mich' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Kontakt', href: '/#kontakt' },
] as const
