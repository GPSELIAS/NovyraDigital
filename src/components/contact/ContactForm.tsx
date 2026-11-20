import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import {
  LIMITS,
  SERVICES,
  normalizePayload,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactResponse,
  type ServiceValue,
} from '../../../shared/contact'
import { useServiceSelection } from '../../lib/service-context'
import { site } from '../../config/site'
import SmartLink from '../ui/SmartLink'
import Button from '../ui/Button'
import Turnstile, { type TurnstileHandle } from './Turnstile'

const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || site.turnstileSiteKey || undefined
const SUCCESS_TEXT =
  'Vielen Dank für deine Anfrage! Deine Nachricht wurde erfolgreich übermittelt. Wir melden uns so bald wie möglich bei dir.'

interface Values {
  name: string
  email: string
  company: string
  phone: string
  service: ServiceValue | ''
  message: string
  privacy: boolean
  website: string
}

const empty: Values = { name: '', email: '', company: '', phone: '', service: '', message: '', privacy: false, website: '' }
const FIELD_ORDER: ContactField[] = ['name', 'email', 'company', 'phone', 'service', 'message', 'privacy']

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')
  const [token, setToken] = useState('')
  const submitting = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const turnstileRef = useRef<TurnstileHandle>(null)
  const { selection } = useServiceSelection()

  // Vorauswahl über die Service-CTAs
  useEffect(() => {
    if (selection) {
      setValues((v) => ({ ...v, service: selection.service }))
      setErrors((e) => ({ ...e, service: undefined }))
      if (status === 'success') setStatus('idle')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection?.nonce])

  // Vorauswahl via URL, z. B. /?leistung=automation#kontakt
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('leistung')
    if (p && SERVICES.some((s) => s.value === p)) setValues((v) => ({ ...v, service: p as ServiceValue }))
  }, [])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const fieldErrors = (v: Values) => validateContact(normalizePayload({ ...v, turnstileToken: '' }))

  const update = (field: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value
    const next = { ...values, [field]: val } as Values
    setValues(next)
    if (field !== 'website' && (touched[field as ContactField] || errors[field as ContactField])) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors(next)[field as ContactField] }))
    }
  }

  const blur = (field: ContactField) => () => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: fieldErrors(values)[field] }))
  }

  const focusFirstError = (errs: ContactErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting.current) return // Schutz gegen Doppelklicks

    const errs = fieldErrors(values)
    setErrors(errs)
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])))
    if (Object.keys(errs).length) {
      setServerError('')
      setStatus('idle')
      focusFirstError(errs)
      return
    }
    if (!token) {
      setStatus('error')
      setServerError('Bitte warte einen Moment, bis die Sicherheitsprüfung abgeschlossen ist, und versuche es dann erneut.')
      return
    }

    submitting.current = true
    setStatus('submitting')
    setServerError('')

    const ctrl = new AbortController()
    const timeout = window.setTimeout(() => ctrl.abort(), 20000)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, turnstileToken: token }),
        signal: ctrl.signal,
      })
      let data: ContactResponse | null = null
      try {
        data = (await res.json()) as ContactResponse
      } catch {
        data = null
      }
      if (res.ok && data?.ok === true) {
        setStatus('success')
        setValues(empty)
        setTouched({})
        setErrors({})
      } else {
        if (data && !data.ok && data.fields) {
          setErrors(data.fields)
          focusFirstError(data.fields)
        }
        setStatus('error')
        setServerError(
          (data && !data.ok && data.error) ||
            'Deine Anfrage konnte leider nicht gesendet werden. Bitte versuche es später erneut oder schreibe uns direkt an info@novyradigital.ch.',
        )
      }
    } catch {
      setStatus('error')
      setServerError(
        'Die Verbindung zum Server ist fehlgeschlagen. Bitte prüfe deine Internetverbindung und versuche es erneut – oder schreibe uns direkt an info@novyradigital.ch.',
      )
    } finally {
      window.clearTimeout(timeout)
      // Turnstile-Token sind einmalig gültig → neu anfordern
      setToken('')
      turnstileRef.current?.reset()
      submitting.current = false
    }
  }

  const err = (f: ContactField) => errors[f]
  const errorCount = FIELD_ORDER.filter((f) => errors[f]).length

  if (status === 'success') {
    return (
      <motion.div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-[520px] flex-col items-center justify-center px-6 py-16 text-center outline-none"
      >
        <span className="flex size-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <CheckCircle2 className="size-8 text-emerald-400" aria-hidden />
        </span>
        <h3 className="mt-7 text-2xl font-semibold tracking-tight text-snow">Anfrage gesendet</h3>
        <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-mute-400">{SUCCESS_TEXT}</p>
        <Button variant="secondary" className="mt-8" onClick={() => setStatus('idle')}>
          Weitere Anfrage senden
        </Button>
      </motion.div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-hint" className="space-y-5 p-6 sm:p-9">
      <p id="form-hint" className="text-[13px] text-mute-500">
        Mit <span aria-hidden className="text-accent-soft">*</span>
        <span className="sr-only">Stern</span> markierte Felder sind Pflichtfelder.
      </p>

      <AnimatePresence>
        {errorCount > 0 && status !== 'submitting' && Object.keys(touched).length >= FIELD_ORDER.length && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="overflow-hidden"
          >
            <p className="flex items-center gap-2 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-[14px] text-red-200">
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              Bitte überprüfe {errorCount === 1 ? 'das markierte Feld' : `die ${errorCount} markierten Felder`}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Vorname und Nachname" required error={err('name')}>
          <input
            id="name" name="name" type="text" autoComplete="name" maxLength={LIMITS.name.max} required
            value={values.name} onChange={update('name')} onBlur={blur('name')}
            aria-invalid={!!err('name')} aria-describedby={err('name') ? 'name-error' : undefined}
            className="field" placeholder="Max Muster"
          />
        </Field>
        <Field id="email" label="Geschäftliche E-Mail-Adresse" required error={err('email')}>
          <input
            id="email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email.max} required
            value={values.email} onChange={update('email')} onBlur={blur('email')}
            aria-invalid={!!err('email')} aria-describedby={err('email') ? 'email-error' : undefined}
            className="field" placeholder="name@unternehmen.ch"
          />
        </Field>
        <Field id="company" label="Unternehmen" optional error={err('company')}>
          <input
            id="company" name="company" type="text" autoComplete="organization" maxLength={LIMITS.company.max}
            value={values.company} onChange={update('company')} onBlur={blur('company')}
            aria-invalid={!!err('company')} aria-describedby={err('company') ? 'company-error' : undefined}
            className="field" placeholder="Muster AG"
          />
        </Field>
        <Field id="phone" label="Telefonnummer" optional error={err('phone')}>
          <input
            id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone.max}
            value={values.phone} onChange={update('phone')} onBlur={blur('phone')}
            aria-invalid={!!err('phone')} aria-describedby={err('phone') ? 'phone-error' : undefined}
            className="field" placeholder="+41 79 000 00 00"
          />
        </Field>
      </div>

      <Field id="service" label="Gewünschte Dienstleistung" required error={err('service')}>
        <div className="relative">
          <select
            id="service" name="service" required
            value={values.service} onChange={update('service')} onBlur={blur('service')}
            aria-invalid={!!err('service')} aria-describedby={err('service') ? 'service-error' : undefined}
            className={`field appearance-none pr-10 ${values.service ? '' : 'text-mute-500'}`}
          >
            <option value="" disabled>Bitte auswählen …</option>
            {SERVICES.map((s) => (
              <option key={s.value} value={s.value} className="bg-ink-900 text-snow">{s.label}</option>
            ))}
          </select>
          <svg aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mute-400" viewBox="0 0 16 16" fill="none">
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Field>

      <Field id="message" label="Nachricht / Projektbeschreibung" required error={err('message')}
        hint={`${values.message.length} / ${LIMITS.message.max}`}>
        <textarea
          id="message" name="message" rows={6} required maxLength={LIMITS.message.max}
          value={values.message} onChange={update('message')} onBlur={blur('message')}
          aria-invalid={!!err('message')} aria-describedby={err('message') ? 'message-error' : 'message-hint'}
          className="field min-h-[150px] resize-y leading-relaxed"
          placeholder="Erzähl uns kurz von deinem Vorhaben, deinen Zielen und dem gewünschten Zeitrahmen."
        />
      </Field>

      {/* Honeypot – für Menschen unsichtbar, für Screenreader ausgeblendet */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website (bitte leer lassen)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
      </div>

      <div>
        <label htmlFor="privacy" className="group flex cursor-pointer items-start gap-3">
          <span className="relative mt-0.5 flex">
            <input
              id="privacy" name="privacy" type="checkbox" required
              checked={values.privacy} onChange={update('privacy')} onBlur={blur('privacy')}
              aria-invalid={!!err('privacy')} aria-describedby={err('privacy') ? 'privacy-error' : undefined}
              className="peer size-5 shrink-0 cursor-pointer appearance-none rounded-md border border-white/20 bg-ink-950 transition-colors checked:border-accent checked:bg-accent hover:border-white/35 aria-[invalid=true]:border-red-400/70"
            />
            <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100">
              <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[14px] leading-relaxed text-mute-300">
            Ich habe die{' '}
            <SmartLink href="/datenschutz" className="text-snow underline decoration-accent/60 underline-offset-4 hover:decoration-accent">
              Datenschutzerklärung
            </SmartLink>{' '}
            zur Kenntnis genommen und bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
            <span aria-hidden className="text-accent-soft"> *</span>
          </span>
        </label>
        <FieldError id="privacy" error={err('privacy')} />
      </div>

      {SITE_KEY ? (
        <Turnstile ref={turnstileRef} siteKey={SITE_KEY} onToken={setToken} onExpire={() => setToken('')} />
      ) : (
        <p className="rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-[13px] text-amber-200" role="note">
          Das Kontaktformular ist noch nicht vollständig eingerichtet. Bitte schreibe uns in der Zwischenzeit direkt an{' '}
          <a href="mailto:info@novyradigital.ch" className="underline">info@novyradigital.ch</a>.
        </p>
      )}

      <AnimatePresence>
        {status === 'error' && serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="flex gap-3 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-[14px] leading-relaxed text-red-200"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{serverError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col-reverse gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12.5px] leading-relaxed text-mute-500">Geschützt durch Cloudflare Turnstile.</p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-disabled={status === 'submitting'}
          className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-7 text-[15px] font-medium text-white shadow-[0_0_0_1px_rgb(79_124_255/0.5),0_8px_30px_-8px_rgb(79_124_255/0.6),inset_0_1px_0_rgb(255_255_255/0.2)] transition-[background-color,transform] duration-300 hover:bg-accent-strong active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Wird gesendet …
            </>
          ) : (
            <>
              Anfrage senden
              <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </>
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{status === 'submitting' ? 'Anfrage wird gesendet.' : ''}</p>
    </form>
  )
}

function Field({
  id, label, required, optional, error, hint, children,
}: { id: string; label: string; required?: boolean; optional?: boolean; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13.5px] font-medium text-mute-300">
          {label}
          {required && <span aria-hidden className="text-accent-soft"> *</span>}
          {optional && <span className="font-normal text-mute-500"> (optional)</span>}
        </label>
        {hint && <span id={`${id}-hint`} className="font-mono text-[11px] text-mute-500">{hint}</span>}
      </div>
      {children}
      <FieldError id={id} error={error} />
    </div>
  )
}

function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <span className="flex items-center gap-1.5 pt-2 text-[13px] text-red-300">
            <AlertCircle className="size-3.5 shrink-0" aria-hidden />
            {error}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  )
}
