import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

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
  window.__novyraTurnstileLoading = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => {
      window.__novyraTurnstileLoading = undefined
      reject(new Error('Turnstile konnte nicht geladen werden'))
    }
    document.head.appendChild(s)
  })
  return window.__novyraTurnstileLoading
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
        widgetId.current = window.turnstile.render(el, {
          sitekey: siteKey,
          theme: 'dark',
          language: 'de',
          size: 'flexible',
          callback: (t: string) => cbs.current.onToken(t),
          'expired-callback': () => cbs.current.onExpire(),
          'timeout-callback': () => cbs.current.onExpire(),
          'error-callback': () => {
            cbs.current.onExpire()
            return false
          },
        })
        setState('ready')
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
  }, [siteKey])

  return (
    <div>
      <div ref={container} className="min-h-[65px]" />
      {state === 'error' && (
        <p className="mt-2 text-[13px] text-red-300" role="alert">
          Die Sicherheitsprüfung konnte nicht geladen werden. Bitte prüfe deine Verbindung oder deaktiviere
          Inhaltsblocker für diese Seite. Alternativ erreichst du uns unter info@novyradigital.ch.
        </p>
      )}
    </div>
  )
})

export default Turnstile
