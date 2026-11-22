/**
 * Netlify Function für POST /api/contact – leitet an den plattformneutralen Handler weiter.
 * Umgebungsvariablen werden im Netlify-Dashboard gesetzt (Site configuration → Environment variables).
 */
import type { Config } from '@netlify/functions'
import { handleContact } from '../../server/contact-handler'
import { site } from '../../src/config/site'

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
    })
  }
  return handleContact(
    request,
    {
      RESEND_API_KEY: process.env.RESEND_API_KEY?.trim(),
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY?.trim(),
      MAIL_TO: process.env.MAIL_TO?.trim() || site.email,
      MAIL_FROM: process.env.MAIL_FROM?.trim(),
      SEND_CONFIRMATION_EMAIL: process.env.SEND_CONFIRMATION_EMAIL,
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
      allowLocalTurnstileTestKey: process.env.NETLIFY_DEV === 'true',
    },
  )
}

export const config: Config = {
  path: '/api/contact',
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ['ip', 'domain'] },
}
