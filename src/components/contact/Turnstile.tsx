import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { CONTACT_TURNSTILE_ACTION } from '../../../shared/contact'
import { site } from '../../config/site'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
    __novyraTurnstileLoading?: Promise<void>
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** Lädt das Turnstile-Skript genau einmal. */
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (window.__novyraTurnstileLoading) return window.__novyraTurnstileLoading
  const promise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    const fail = () => {
      window.clearTimeout(timeout)
      s.remove()
      window.__novyraTurnstileLoading = undefined
      reject(new Error('Turnstile konnte nicht geladen werden'))
    }
    const timeout = window.setTimeout(fail, 10_000)
    s.onload = () => {
      window.clearTimeout(timeout)
      if (window.turnstile) resolve()
      else fail()
    }
    s.onerror = fail
    document.head.appendChild(s)
  })
  window.__novyraTurnstileLoading = promise
  return promise
}

export interface TurnstileHandle {
  reset: () => void
}

interface Props {
  siteKey: string
  onToken: (token: string) => void
  onExpire: () => void
}

/**
 * Cloudflare-Turnstile-Widget. Das Skript wird erst geladen, wenn das Formular
 * in die Nähe des sichtbaren Bereichs kommt (Performance & Datensparsamkeit).
 */
const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile({ siteKey, onToken, onExpire }, ref) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [attempt, setAttempt] = useState(0)
  const cbs = useRef({ onToken, onExpire })
  cbs.current = { onToken, onExpire }

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current)
    },
  }))

  useEffect(() => {
    const el = container.current
    if (!el) return
    let cancelled = false

    const mount = async () => {
      setState('loading')
      try {
        await loadTurnstile()
        if (cancelled || !window.turnstile || widgetId.current) return
        setState('ready')
        widgetId.current = window.turnstile.render(el, {
          sitekey: siteKey,
          theme: 'dark',
          language: 'de',
          size: el.clientWidth < 300 ? 'compact' : 'flexible',
          action: CONTACT_TURNSTILE_ACTION,
          retry: 'never',
          callback: (t: string) => {
            setState('ready')
            cbs.current.onToken(t)
          },
          'expired-callback': () => cbs.current.onExpire(),
          'timeout-callback': () => {
            cbs.current.onExpire()
            setState('error')
          },
          'error-callback': () => {
            cbs.current.onExpire()
            setState('error')
            return true
          },
        })
      } catch {
        if (!cancelled) setState('error')
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          void mount()
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)

    return () => {
      cancelled = true
      io.disconnect()
      if (window.turnstile && widgetId.current) {
        window.turnstile.remove(widgetId.current)
        widgetId.current = null
      }
    }
  }, [siteKey, attempt])

  return (
    <div>
      <div ref={container} className="min-h-[65px]" />
      {state === 'loading' && <p role="status" className="text-[13px] text-mute-400">Sicherheitsprüfung wird geladen …</p>}
      {state === 'error' && (
        <div className="mt-2 space-y-2 text-[13px] text-red-300">
          <p role="alert">
            Die Sicherheitsprüfung konnte nicht abgeschlossen werden. Du erreichst uns auch unter{' '}
            <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
          </p>
          <button type="button" className="text-snow underline" onClick={() => {
            setState('loading')
            setAttempt((previous) => previous + 1)
          }}>
            Sicherheitsprüfung erneut starten
          </button>
        </div>
      )}
    </div>
  )
})

export default Turnstile
