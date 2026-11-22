/**
 * Gemeinsame Validierungslogik für das Kontaktformular.
 * Wird sowohl im Frontend (React) als auch serverseitig (Netlify Function) verwendet,
 * damit beide Seiten exakt dieselben Regeln anwenden.
 */

export const CONTACT_TURNSTILE_ACTION = 'contact'

export function isTurnstileTestKey(key: string): boolean {
  return /^[123]x0+[ABF]{2}$/.test(key)
}

export const SERVICES = [
  { value: 'webdesign', label: 'Webdesign & Entwicklung' },
  { value: 'automation', label: 'KI & Automatisierung' },
  { value: 'software', label: 'Individuelle Software' },
  { value: 'sonstiges', label: 'Sonstige Anfrage' },
] as const

export type ServiceValue = (typeof SERVICES)[number]['value']

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 120 },
  phone: { max: 30 },
  message: { min: 20, max: 5000 },
} as const

export interface ContactPayload {
  name: string
  email: string
  company: string
  phone: string
  service: ServiceValue | ''
  message: string
  privacy: boolean
  /** Honeypot – muss leer bleiben */
  website: string
  turnstileToken: string
}

export type ContactField = 'name' | 'email' | 'company' | 'phone' | 'service' | 'message' | 'privacy'
export type ContactErrors = Partial<Record<ContactField, string>>

// Pragmatische, robuste E-Mail-Prüfung (RFC-konform genug für Formulare, ohne Catastrophic Backtracking)
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/
const PHONE_RE = /^[+()\d\s./-]{5,30}$/

export function isValidEmail(value: string): boolean {
  if (value.length > LIMITS.email.max) return false
  if (!EMAIL_RE.test(value)) return false
  const [local, domain] = value.split('@')
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  const tld = domain.split('.').pop() ?? ''
  return (tld.length >= 2 && /^[A-Za-z]+$/.test(tld)) || /^xn--[a-z0-9-]+$/i.test(tld)
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')

/** Bereinigt Rohdaten (unbekannte Struktur) zu einem typisierten Payload. */
export function normalizePayload(raw: unknown): ContactPayload {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const service = str(r.service).trim()
  return {
    name: str(r.name).trim().replace(/\s+/g, ' '),
    email: str(r.email).trim().toLowerCase(),
    company: str(r.company).trim().replace(/\s+/g, ' '),
    phone: str(r.phone).trim(),
    service: (SERVICES.some((s) => s.value === service) ? service : '') as ServiceValue | '',
    message: str(r.message).replace(/\r\n/g, '\n').trim(),
    privacy: r.privacy === true || r.privacy === 'true' || r.privacy === 'on',
    website: str(r.website),
    turnstileToken: str(r.turnstileToken),
  }
}

export function validateContact(p: ContactPayload): ContactErrors {
  const e: ContactErrors = {}

  if (!p.name) e.name = 'Bitte gib deinen Vor- und Nachnamen an.'
  else if (p.name.length < LIMITS.name.min) e.name = 'Der Name ist zu kurz.'
  else if (p.name.length > LIMITS.name.max) e.name = `Maximal ${LIMITS.name.max} Zeichen.`

  if (!p.email) e.email = 'Bitte gib deine E-Mail-Adresse an.'
  else if (!isValidEmail(p.email)) e.email = 'Bitte gib eine gültige E-Mail-Adresse an.'

  if (p.company.length > LIMITS.company.max) e.company = `Maximal ${LIMITS.company.max} Zeichen.`

  if (p.phone && !PHONE_RE.test(p.phone)) e.phone = 'Bitte gib eine gültige Telefonnummer an.'

  if (!p.service) e.service = 'Bitte wähle die gewünschte Dienstleistung.'

  if (!p.message) e.message = 'Bitte beschreibe kurz dein Vorhaben.'
  else if (p.message.length < LIMITS.message.min)
    e.message = `Bitte beschreibe dein Vorhaben etwas genauer (mind. ${LIMITS.message.min} Zeichen).`
  else if (p.message.length > LIMITS.message.max) e.message = `Maximal ${LIMITS.message.max} Zeichen.`

  if (!p.privacy) e.privacy = 'Bitte bestätige, dass du die Datenschutzerklärung zur Kenntnis genommen hast.'

  return e
}

export function serviceLabel(value: string): string {
  return SERVICES.find((s) => s.value === value)?.label ?? 'Unbekannt'
}

/** Antwortformat des Endpoints */
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fields?: ContactErrors }
