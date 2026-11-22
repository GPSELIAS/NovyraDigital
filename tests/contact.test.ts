import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isValidEmail, normalizePayload, validateContact } from '../shared/contact'
import contact, { config } from '../netlify/functions/contact'
import { handleContact, escapeHtml, type ContactEnv } from '../server/contact-handler'

const valid = {
  name: 'Anna Beispiel',
  email: 'anna@beispiel.ch',
  company: 'Beispiel GmbH',
  phone: '+41 79 123 45 67',
  service: 'automation',
  message: 'Wir möchten unsere Kundenanfragen automatisch erfassen und ins CRM übertragen.',
  privacy: true,
  website: '',
  turnstileToken: 'mock-turnstile-token',
}

describe('Validierung (shared)', () => {
  it('akzeptiert gültige Daten', () => {
    expect(validateContact(normalizePayload(valid))).toEqual({})
  })

  it('meldet alle Pflichtfelder', () => {
    const e = validateContact(normalizePayload({}))
    expect(Object.keys(e).sort()).toEqual(['email', 'message', 'name', 'privacy', 'service'])
  })

  it('prüft E-Mail-Adressen', () => {
    for (const ok of ['a@b.ch', 'first.last+tag@sub.domain.com', 'x@xn--bcher-kva.ch']) expect(isValidEmail(ok)).toBe(true)
    for (const bad of ['a@b', 'a@b.c', 'a..b@c.ch', '.a@c.ch', 'a@-b.ch', 'a b@c.ch', 'a@b.ch>', '@b.ch']) expect(isValidEmail(bad)).toBe(false)
  })

  it('erzwingt Längenlimits', () => {
    const e = validateContact(normalizePayload({ ...valid, name: 'x'.repeat(101), message: 'y'.repeat(5001), company: 'z'.repeat(121) }))
    expect(e.name).toBeDefined()
    expect(e.message).toBeDefined()
    expect(e.company).toBeDefined()
  })

  it('verwirft unbekannte Dienstleistungen und ungültige Telefonnummern', () => {
    const e = validateContact(normalizePayload({ ...valid, service: 'hack', phone: 'abc<script>' }))
    expect(e.service).toBeDefined()
    expect(e.phone).toBeDefined()
  })

  it('escaped HTML', () => {
    expect(escapeHtml('<img src=x onerror="a">&\'')).toBe('&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;')
  })
})

/* ─────────────── Endpoint /api/contact ─────────────── */

const env: ContactEnv = {
  RESEND_API_KEY: 're_test',
  TURNSTILE_SECRET_KEY: 'secret',
  MAIL_TO: 'info@novyradigital.ch',
  MAIL_FROM: 'Novyra Digital <website@mail.novyradigital.ch>',
  SEND_CONFIRMATION_EMAIL: 'false',
  ALLOWED_ORIGINS: 'https://novyradigital.ch',
}

function makeRequest(body: unknown, opts: { origin?: string | null; contentType?: string; url?: string } = {}) {
  const headers: Record<string, string> = { 'Content-Type': opts.contentType ?? 'application/json' }
  if (opts.origin !== null) headers.Origin = opts.origin ?? 'https://novyradigital.ch'
  return new Request(opts.url ?? 'https://novyradigital.ch/api/contact', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

function call(body: unknown, opts: Parameters<typeof makeRequest>[1] & { env?: ContactEnv } = {}) {
  return handleContact(makeRequest(body, opts), opts.env ?? env)
}

type FetchCall = [string, RequestInit]
let fetchMock: ReturnType<typeof vi.fn>

function mockServices({ turnstile = true, resend = 200, hostname = 'novyradigital.ch', action = 'contact', confirmation = 200, errorCodes = [] as string[] } = {}) {
  let mailCount = 0
  fetchMock = vi.fn(async (url: string) => {
    if (url.includes('turnstile')) return Response.json({ success: turnstile, hostname, action, 'error-codes': errorCodes })
    if (url.includes('resend')) {
      const status = mailCount++ === 0 ? resend : confirmation
      return Response.json(status === 200 ? { id: 'abc' } : { message: 'fail' }, { status })
    }
    throw new Error('unerwartete URL ' + url)
  })
  vi.stubGlobal('fetch', fetchMock)
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('POST /api/contact', () => {
  it('sendet bei gültigen Daten an Resend mit Reply-To', async () => {
    mockServices()
    const res = await call(valid)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    const [[verifyUrl, verifyOptions], resendCall] = fetchMock.mock.calls as FetchCall[]
    expect(verifyUrl).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
    expect(Object.fromEntries(verifyOptions.body as URLSearchParams)).toEqual({ secret: env.TURNSTILE_SECRET_KEY, response: valid.turnstileToken })
    const mail = JSON.parse(resendCall[1].body as string)
    expect(mail.to).toEqual(['info@novyradigital.ch'])
    expect(mail.reply_to).toBe('anna@beispiel.ch')
    expect(mail.from).toBe('Novyra Digital <website@mail.novyradigital.ch>')
    expect(mail.subject).toContain('KI & Automatisierung')
    expect(mail.html).toContain('Beispiel GmbH')
    expect((resendCall[1].headers as Record<string, string>)['Idempotency-Key']).toMatch(/^[a-f0-9]{64}$/)
  })

  it('meldet KEINEN Erfolg, wenn Resend fehlschlägt', async () => {
    mockServices({ resend: 500 })
    const res = await call(valid)
    expect(res.status).toBe(502)
    expect(((await res.json()) as any).ok).toBe(false)
  })

  it('lehnt fehlgeschlagene Turnstile-Prüfung ab, ohne zu senden', async () => {
    mockServices({ turnstile: false })
    const res = await call(valid)
    expect(res.status).toBe(400)
    expect((fetchMock.mock.calls as FetchCall[]).some(([u]) => u.includes('resend'))).toBe(false)
  })

  it('meldet falschen Turnstile-Secret als Konfigurationsfehler (503), ohne zu senden', async () => {
    mockServices({ turnstile: false, errorCodes: ['invalid-input-secret'] })
    const res = await call(valid)
    expect(res.status).toBe(503)
    expect(((await res.json()) as any).ok).toBe(false)
    expect((fetchMock.mock.calls as FetchCall[]).some(([u]) => u.includes('resend'))).toBe(false)
  })

  it('lehnt abweichenden Hostname ab', async () => {
    mockServices({ hostname: 'fremde-seite.example' })
    const res = await call(valid)
    expect(res.status).toBe(400)
    expect((fetchMock.mock.calls as FetchCall[]).some(([u]) => u.includes('resend'))).toBe(false)
  })

  it('lehnt fehlenden Turnstile-Token ab', async () => {
    mockServices()
    const res = await call({ ...valid, turnstileToken: '' })
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('validiert serverseitig und gibt Feldfehler zurück', async () => {
    mockServices()
    const res = await call({ ...valid, email: 'kaputt', privacy: false })
    expect(res.status).toBe(422)
    const body = (await res.json()) as any
    expect(body.fields.email).toBeDefined()
    expect(body.fields.privacy).toBeDefined()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('Honeypot: kein Versand und keine Erfolgsmeldung', async () => {
    mockServices()
    const res = await call({ ...valid, website: 'http://spam.example' })
    expect(res.status).toBe(400)
    expect((await res.json()).ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('blockiert fremde Origins und fehlenden Origin', async () => {
    mockServices()
    expect((await call(valid, { origin: 'https://evil.example' })).status).toBe(403)
    expect((await call(valid, { origin: null })).status).toBe(403)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('lehnt falschen Content-Type, ungültiges JSON und zu grosse Anfragen ab', async () => {
    mockServices()
    expect((await call('a=b', { contentType: 'application/x-www-form-urlencoded' })).status).toBe(415)
    expect((await call('{kaputt')).status).toBe(400)
    expect((await call({ ...valid, message: 'x'.repeat(25000) })).status).toBe(413)
  })

  it('sendet nichts und meldet Fehler, wenn Konfiguration fehlt', async () => {
    mockServices()
    const res = await call(valid, { env: { ...env, RESEND_API_KEY: undefined } })
    expect(res.status).toBe(503)
    expect(((await res.json()) as any).ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sendet optionale Eingangsbestätigung nur nach erfolgreichem Versand', async () => {
    mockServices()
    await call(valid, { env: { ...env, SEND_CONFIRMATION_EMAIL: 'true' } })
    const resendCalls = (fetchMock.mock.calls as FetchCall[]).filter(([u]) => u.includes('resend'))
    expect(resendCalls).toHaveLength(2)
    expect(JSON.parse(resendCalls[1][1].body as string).to).toEqual(['anna@beispiel.ch'])

    mockServices({ resend: 500 })
    await call(valid, { env: { ...env, SEND_CONFIRMATION_EMAIL: 'true' } })
    expect((fetchMock.mock.calls as FetchCall[]).filter(([u]) => u.includes('resend'))).toHaveLength(1)
  })

  it.each([
    { hostname: 'andere-domain.example' },
    { action: 'andere-aktion' },
  ])('versendet bei abweichenden Siteverify-Daten keine E-Mail (%o)', async (challenge) => {
    mockServices(challenge)
    expect((await call(valid)).status).toBe(400)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('erlaubt den offiziellen Testschlüssel nur in Netlify Dev auf Loopback', async () => {
    const testEnv = { ...env, TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' }
    mockServices({ hostname: 'example.com', action: '' })
    expect((await call(valid, { env: { ...testEnv, allowLocalTurnstileTestKey: true } })).status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()

    const local = { origin: 'http://localhost:8888', url: 'http://localhost:8888/api/contact' }
    expect((await call(valid, { ...local, env: testEnv })).status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()
    expect((await call(valid, { ...local, env: { ...testEnv, allowLocalTurnstileTestKey: true } })).status).toBe(200)
  })

  it('belässt den Erfolg der Anfrage bei fehlgeschlagener Eingangsbestätigung', async () => {
    mockServices({ confirmation: 500 })
    const res = await call(valid, { env: { ...env, SEND_CONFIRMATION_EMAIL: 'true' } })
    expect(await res.json()).toEqual({ ok: true })
  })

  it('liest die Servervariablen im Netlify-Einstiegspunkt und akzeptiert nur POST', async () => {
    mockServices()
    for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value)
    expect(config.path).toBe('/api/contact')

    const get = await contact(new Request('https://novyradigital.ch/api/contact'))
    expect(get.status).toBe(405)
    expect(get.headers.get('Allow')).toBe('POST')
    expect(fetchMock).not.toHaveBeenCalled()

    expect((await contact(makeRequest(valid))).status).toBe(200)
  })
})
