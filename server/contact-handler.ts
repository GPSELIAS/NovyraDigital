/**
 * Plattformneutraler Handler für POST /api/contact: validiert Anfragen, prüft Spam-Schutz
 * (Turnstile + Honeypot) und versendet die Nachricht via Resend. Wird von der Netlify Function aufgerufen.
 */
import {
  CONTACT_TURNSTILE_ACTION,
  isTurnstileTestKey,
  normalizePayload,
  validateContact,
  serviceLabel,
  type ContactPayload,
  type ContactResponse,
} from '../shared/contact'
import { site } from '../src/config/site'

export interface ContactEnv {
  RESEND_API_KEY?: string
  TURNSTILE_SECRET_KEY?: string
  MAIL_TO?: string
  MAIL_FROM?: string
  SEND_CONFIRMATION_EMAIL?: string
  ALLOWED_ORIGINS?: string
  allowLocalTurnstileTestKey?: boolean
}

const MAX_BODY_BYTES = 20_000

const json = (body: ContactResponse, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })

const GENERIC_ERROR = 'Deine Anfrage konnte leider nicht gesendet werden. Bitte versuche es später erneut.'
const CONFIRMATION_SUBJECT = `Deine Anfrage bei ${site.name}`
const SITE_HOST = new URL(site.url).hostname

export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
  try {
    const origin = request.headers.get('Origin')
    if (!origin || !isAllowedOrigin(request, env, origin)) {
      return json({ ok: false, error: 'Unzulässige Herkunft der Anfrage.' }, 403)
    }

    const contentType = request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase()
    if (contentType !== 'application/json') {
      return json({ ok: false, error: 'Ungültiges Anfrageformat.' }, 415)
    }
    const raw = await request.text()
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json({ ok: false, error: 'Die Anfrage ist zu gross.' }, 413)
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return json({ ok: false, error: 'Ungültiges Anfrageformat.' }, 400)
    }

    const data = normalizePayload(parsed)

    if (data.website.trim() !== '') {
      return json({ ok: false, error: GENERIC_ERROR }, 400)
    }

    const fields = validateContact(data)
    if (Object.keys(fields).length > 0) {
      return json({ ok: false, error: 'Bitte überprüfe die markierten Felder.', fields }, 422)
    }

    const hostname = new URL(origin).hostname
    const secret = env.TURNSTILE_SECRET_KEY
    const testSecret = secret ? isTurnstileTestKey(secret) : false
    const isLocalTest = env.allowLocalTurnstileTestKey === true && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(hostname)
    if (!env.RESEND_API_KEY || !secret || !env.MAIL_FROM || !env.MAIL_TO || (testSecret && !isLocalTest)) {
      console.error('[contact] Fehlende oder ungültige Versandkonfiguration')
      return json({ ok: false, error: 'Das Kontaktformular ist vorübergehend nicht verfügbar.' }, 503)
    }

    if (!data.turnstileToken || data.turnstileToken.length > 2048) {
      return json({ ok: false, error: 'Die Sicherheitsprüfung fehlt. Bitte führe die Prüfung erneut durch.' }, 400)
    }
    const human = await verifyTurnstile(secret, data.turnstileToken, hostname, testSecret)
    if (!human) {
      return json({ ok: false, error: 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte versuche es erneut.' }, 400)
    }

    const idempotencyKey = await sha256(`${data.email}|${data.message}|${data.turnstileToken}`)
    const sent = await sendMail(env.RESEND_API_KEY, {
      from: env.MAIL_FROM,
      to: [env.MAIL_TO],
      reply_to: data.email,
      subject: `Neue Anfrage: ${serviceLabel(data.service)} – ${data.name}`.slice(0, 200),
      html: internalHtml(data),
      text: internalText(data),
    }, idempotencyKey)

    if (!sent) {
      return json({ ok: false, error: GENERIC_ERROR }, 502)
    }

    // Eine fehlgeschlagene Bestätigung ändert den Erfolg der eigentlichen Anfrage nicht.
    if (env.SEND_CONFIRMATION_EMAIL === 'true') {
      await sendMail(env.RESEND_API_KEY, {
        from: env.MAIL_FROM,
        to: [data.email],
        reply_to: env.MAIL_TO,
        subject: CONFIRMATION_SUBJECT,
        html: confirmationHtml(data),
        text: confirmationText(data),
      }, `${idempotencyKey}-confirm`)
    }

    return json({ ok: true })
  } catch {
    console.error('[contact] Unerwarteter Fehler')
    return json({ ok: false, error: GENERIC_ERROR }, 500)
  }
}

/* ───────────────────────── Hilfsfunktionen ───────────────────────── */

function isAllowedOrigin(request: Request, env: ContactEnv, origin: string): boolean {
  const self = new URL(request.url).origin
  if (origin === self) return true // gleiche Herkunft (inkl. Netlify-Deploy-Previews)
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  return allowed.includes(origin)
}

async function verifyTurnstile(secret: string, token: string, hostname: string, localTest: boolean): Promise<boolean> {
  const body = new URLSearchParams({ secret, response: token })
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5_000),
    })
    if (!res.ok) return false
    const out = (await res.json()) as { success?: boolean; hostname?: string; action?: string }
    return out.success === true && (localTest
      ? out.hostname === 'example.com'
      : out.hostname === hostname && out.action === CONTACT_TURNSTILE_ACTION)
  } catch {
    console.error('[contact] Turnstile-Prüfung fehlgeschlagen')
    return false
  }
}

interface MailInput {
  from: string
  to: string[]
  reply_to: string
  subject: string
  html: string
  text: string
}

async function sendMail(apiKey: string, mail: MailInput, idempotencyKey: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey.slice(0, 256),
      },
      body: JSON.stringify(mail),
      signal: AbortSignal.timeout(6_000),
    })
    if (!res.ok) {
      console.error(`[contact] Resend-Fehler ${res.status}`)
      return false
    }
    return true
  } catch {
    console.error('[contact] Resend nicht erreichbar')
    return false
  }
}

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const nl2br = (s: string) => escapeHtml(s).replace(/\n/g, '<br>')

function rows(d: ContactPayload): Array<[string, string]> {
  return [
    ['Name', d.name],
    ['E-Mail', d.email],
    ['Unternehmen', d.company || '–'],
    ['Telefon', d.phone || '–'],
    ['Dienstleistung', serviceLabel(d.service)],
  ]
}

function shell(title: string, inner: string): string {
  return `<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#18181b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e4e7">
<tr><td style="background:#09090b;padding:22px 28px;color:#fafafa;font-weight:600;letter-spacing:.18em;font-size:13px">${escapeHtml(site.name.toUpperCase())}</td></tr>
<tr><td style="padding:28px">${inner}</td></tr>
</table></td></tr></table></body></html>`
}

function internalHtml(d: ContactPayload): string {
  const table = rows(d)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#71717a;font-size:14px;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 0;font-size:14px">${
          k === 'E-Mail' ? `<a href="mailto:${encodeURIComponent(v).replace('%40', '@')}" style="color:#4f7cff">${escapeHtml(v)}</a>` : escapeHtml(v)
        }</td></tr>`,
    )
    .join('')
  return shell(
    'Neue Anfrage',
    `<h1 style="margin:0 0 6px;font-size:20px">Neue Anfrage über ${SITE_HOST}</h1>
<p style="margin:0 0 20px;color:#71717a;font-size:14px">Antworten auf diese E-Mail gehen direkt an die anfragende Person.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e4e4e7;border-bottom:1px solid #e4e4e7;margin-bottom:20px">${table}</table>
<h2 style="margin:0 0 8px;font-size:15px">Nachricht</h2>
<div style="font-size:14px;line-height:1.6;background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;padding:16px">${nl2br(d.message)}</div>
<p style="margin:20px 0 0;color:#a1a1aa;font-size:12px">Datenschutzerklärung zur Kenntnis genommen: Ja</p>`,
  )
}

function internalText(d: ContactPayload): string {
  return [
    `Neue Anfrage über ${SITE_HOST}`,
    '',
    ...rows(d).map(([k, v]) => `${k}: ${v}`),
    '',
    'Nachricht:',
    d.message,
    '',
    'Datenschutzerklärung zur Kenntnis genommen: Ja',
  ].join('\n')
}

function confirmationHtml(d: ContactPayload): string {
  const firstName = d.name.split(' ')[0] ?? d.name
  return shell(
    CONFIRMATION_SUBJECT,
    `<h1 style="margin:0 0 14px;font-size:20px">Hallo ${escapeHtml(firstName)}</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 14px">Vielen Dank für deine Anfrage zum Thema <strong>${escapeHtml(serviceLabel(d.service))}</strong>. Wir haben deine Nachricht erhalten und melden uns so bald wie möglich bei dir.</p>
<p style="font-size:15px;line-height:1.6;margin:0 0 20px">Falls du noch etwas ergänzen möchtest, antworte einfach auf diese E-Mail.</p>
<p style="font-size:15px;margin:0">Freundliche Grüsse<br>${escapeHtml(site.name)}</p>
<p style="margin:24px 0 0;color:#a1a1aa;font-size:12px">Diese E-Mail wurde automatisch versendet, weil über ${SITE_HOST} eine Anfrage mit dieser Adresse eingereicht wurde.</p>`,
  )
}

function confirmationText(d: ContactPayload): string {
  const firstName = d.name.split(' ')[0] ?? d.name
  return `Hallo ${firstName}

Vielen Dank für deine Anfrage zum Thema «${serviceLabel(d.service)}». Wir haben deine Nachricht erhalten und melden uns so bald wie möglich bei dir.

Falls du noch etwas ergänzen möchtest, antworte einfach auf diese E-Mail.

Freundliche Grüsse
${site.name}`
}

