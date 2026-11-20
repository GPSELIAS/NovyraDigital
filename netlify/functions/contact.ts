/**
 * Netlify Function für POST /api/contact – leitet an den plattformneutralen Handler weiter.
 * Umgebungsvariablen werden im Netlify-Dashboard gesetzt (Site configuration → Environment variables).
 */
import type { Config, Context } from '@netlify/functions'
import { handleContact } from '../../server/contact-handler'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } })
  }
  return handleContact(
    request,
    {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
      MAIL_TO: process.env.MAIL_TO ?? 'info@novyradigital.ch',
      MAIL_FROM: process.env.MAIL_FROM ?? 'Novyra Digital <website@mail.novyradigital.ch>',
      SEND_CONFIRMATION_EMAIL: process.env.SEND_CONFIRMATION_EMAIL ?? 'false',
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? 'https://novyradigital.ch,https://www.novyradigital.ch',
    },
    context.ip,
  )
}

export const config: Config = {
  path: '/api/contact',
}
