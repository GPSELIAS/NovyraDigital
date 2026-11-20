import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isValidEmail, normalizePayload, validateContact } from '../shared/contact'
import { onRequestPost, escapeHtml, type Env } from '../functions/api/contact'

const valid = {
  name: 'Anna Beispiel',
  email: 'anna@beispiel.ch',
  company: 'Beispiel GmbH',
  phone: '+41 79 123 45 67',
  service: 'automation',
  message: 'Wir möchten unsere Kundenanfragen automatisch erfassen und ins CRM übertragen.',
  privacy: true,
  website: '',
  turnstileToken: 'XXXX.DUMMY.TOKEN',
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

const env: Env = {
  RESEND_API_KEY: 're_test',
  TURNSTILE_SECRET_KEY: 'secret',
  MAIL_TO: 'info@novyradigital.ch',
  MAIL_FROM: 'Novyra Digital <website@mail.novyradigital.ch>',
  SEND_CONFIRMATION_EMAIL: 'false',
  ALLOWED_ORIGINS: 'https://novyradigital.ch',
}

function call(body: unknown, opts: { origin?: string | null; env?: Env; contentType?: string } = {}) {
  const headers: Record<string, string> = { 'Content-Type': opts.contentType ?? 'application/json', 'CF-Connecting-IP': '203.0.113.7' }
  if (opts.origin !== null) headers.Origin = opts.origin ?? 'https://novyradigital.ch'
  const request = new Request('https://novyradigital.ch/api/contact', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (onRequestPost as any)({ request, env: opts.env ?? env }) as Promise<Response>
}

type FetchCall = [string, RequestInit]
let fetchMock: ReturnType<typeof vi.fn>

function mockServices({ turnstile = true, resend = 200 }: { turnstile?: boolean; resend?: number } = {}) {
  fetchMock = vi.fn(async (url: string) => {
    if (url.includes('turnstile')) return new Response(JSON.stringify({ success: turnstile }), { status: 200 })
    if (url.includes('resend')) return new Response(JSON.stringify(resend === 200 ? { id: 'abc' } : { message: 'fail' }), { status: resend })
    throw new Error('unerwartete URL ' + url)
  })
  vi.stubGlobal('fetch', fetchMock)
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('POST /api/contact', () => {
  it('sendet bei gültigen Daten an Resend mit Reply-To', async () => {
    mockServices()
    const res = await call(valid)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    const resendCall = (fetchMock.mock.calls as FetchCall[]).find(([u]) => u.includes('resend'))!
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

  it('Honeypot: neutrale Antwort, kein Versand', async () => {
    mockServices()
    const res = await call({ ...valid, website: 'http://spam.example' })
    expect(res.status).toBe(200)
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

  it('Rate-Limiting über KV greift nach 5 Anfragen', async () => {
    mockServices()
    const store = new Map<string, string>()
    const kv = {
      get: async (k: string) => store.get(k) ?? null,
      put: async (k: string, v: string) => void store.set(k, v),
    } as unknown as KVNamespace
    const e = { ...env, RATE_LIMIT: kv }
    for (let i = 0; i < 5; i++) expect((await call(valid, { env: e })).status).toBe(200)
    const res = await call(valid, { env: e })
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('600')
  })
})
