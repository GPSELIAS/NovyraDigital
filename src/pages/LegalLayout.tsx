import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { site, type LegalKey } from '../config/site'

export function Pending({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[12.5px] text-amber-200">
      <AlertTriangle className="size-3.5" aria-hidden />
      AUSSTEHEND: {label}
    </span>
  )
}

/** Gibt den konfigurierten Wert oder eine deutliche «ausstehend»-Markierung zurück. */
export function legal(key: LegalKey, label: string): ReactNode {
  const v = site.legal[key]
  return v ? v : <Pending label={label} />
}

export function missingLegal(): LegalKey[] {
  const optional = site.optionalLegal as readonly string[]
  return (Object.keys(site.legal) as LegalKey[]).filter((k) => !site.legal[k] && !optional.includes(k))
}

export default function LegalLayout({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  const missing = missingLegal()
  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[420px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">
            <span aria-hidden className="inline-block h-px w-6 bg-accent" />
            {eyebrow}
          </p>
          <h1 className="display mt-5 text-5xl sm:text-6xl">{title}</h1>
          <p className="mt-5 text-sm text-mute-500">Stand: {site.legalUpdated}</p>

          {missing.length > 0 && (
            <div role="note" className="mt-10 flex gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-5 text-[14.5px] leading-relaxed text-amber-100">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-300" aria-hidden />
              <p>
                <strong className="font-semibold">Hinweis vor Veröffentlichung:</strong> Einige Pflichtangaben sind noch
                nicht hinterlegt und als «ausstehend» markiert. Sie werden zentral in <code className="font-mono text-[13px]">src/config/site.ts</code>{' '}
                ergänzt. Dieser Hinweis verschwindet automatisch, sobald alle Angaben vorhanden sind.
              </p>
            </div>
          )}

          <div className="prose-legal mt-4">{children}</div>
        </div>
      </div>
    </section>
  )
}
