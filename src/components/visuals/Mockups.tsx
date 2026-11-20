import { motion } from 'motion/react'
import { ArrowRight, Bot, CalendarCheck, Inbox, Mail, UserPlus } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const
const inView = { once: true, margin: '0px 0px -15% 0px' } as const

/** Beispiel 1: Unternehmenswebsite im Browserrahmen */
export function WebsiteMockup() {
  return (
    <div aria-hidden className="relative h-full w-full p-6 sm:p-8">
      <div className="mx-auto h-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-ink-950 shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2.5">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-3 h-4 flex-1 rounded bg-white/[0.04] px-2 font-mono text-[9px] leading-4 text-mute-500">beispiel-firma.ch</span>
        </div>
        <div className="relative px-5 pt-6 pb-5">
          <div className="absolute right-0 top-0 h-28 w-40 bg-[radial-gradient(closest-side,rgb(79_124_255/0.35),transparent)]" />
          <div className="flex items-center justify-between">
            <div className="h-2 w-12 rounded-full bg-white/60" />
            <div className="flex gap-2">
              <div className="h-1.5 w-6 rounded-full bg-white/15" />
              <div className="h-1.5 w-6 rounded-full bg-white/15" />
              <div className="h-1.5 w-6 rounded-full bg-white/15" />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ duration: 0.8, ease }} className="mt-8 space-y-2">
            <div className="h-3.5 w-4/5 rounded bg-white/80" />
            <div className="h-3.5 w-3/5 rounded bg-white/40" />
            <div className="mt-3 h-1.5 w-11/12 rounded bg-white/10" />
            <div className="h-1.5 w-9/12 rounded bg-white/10" />
          </motion.div>
          <div className="mt-5 flex gap-2">
            <div className="h-6 w-20 rounded-full bg-accent" />
            <div className="h-6 w-16 rounded-full border border-white/15" />
          </div>
          <div className="mt-7 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease }}
                className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5"
              >
                <div className="size-4 rounded bg-accent/30" />
                <div className="mt-3 h-1.5 w-4/5 rounded bg-white/30" />
                <div className="mt-1.5 h-1 w-full rounded bg-white/10" />
                <div className="mt-1 h-1 w-3/4 rounded bg-white/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Beispiel 2: Automatisierte Bearbeitung von Kundenanfragen */
export function AutomationMockup() {
  const nodes = [
    { icon: Inbox, label: 'Anfrage', sub: 'Formular / E-Mail' },
    { icon: Bot, label: 'KI-Analyse', sub: 'Thema & Priorität' },
    { icon: UserPlus, label: 'CRM', sub: 'Lead anlegen' },
  ]
  return (
    <div aria-hidden className="flex h-full w-full flex-col justify-center gap-4 p-6 sm:p-8">
      <div className="flex items-stretch gap-2">
        {nodes.map((n, i) => (
          <div key={n.label} className="flex flex-1 items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={inView}
              transition={{ duration: 0.6, delay: i * 0.15, ease }}
              className="flex-1 rounded-xl border border-white/10 bg-ink-950 p-3"
            >
              <span className="flex size-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent-soft">
                <n.icon className="size-4" />
              </span>
              <p className="mt-3 text-[12px] font-medium text-snow">{n.label}</p>
              <p className="font-mono text-[9.5px] text-mute-500">{n.sub}</p>
            </motion.div>
            {i < nodes.length - 1 && <ArrowRight className="size-3.5 shrink-0 text-mute-500" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: Mail, t: 'Antwort-Entwurf erstellt' },
          { icon: CalendarCheck, t: 'Terminvorschlag gesendet' },
        ].map((r, i) => (
          <motion.div
            key={r.t}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease }}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5"
          >
            <r.icon className="size-4 shrink-0 text-emerald-400/90" />
            <span className="text-[11.5px] text-mute-300">{r.t}</span>
          </motion.div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-ink-950 p-3 font-mono text-[10px] leading-relaxed text-mute-500">
        <span className="text-accent-soft">workflow</span>.trigger(<span className="text-snow">"neue_anfrage"</span>)
        <br />→ klassifizieren → crm.speichern → benachrichtigen
      </div>
    </div>
  )
}

/** Beispiel 3: Individuelles Business-Dashboard */
export function DashboardMockup() {
  const bars = [32, 48, 40, 62, 55, 70, 64, 82, 76, 90]
  return (
    <div aria-hidden className="h-full w-full p-6 sm:p-8">
      <div className="grid h-full grid-cols-[56px_1fr] overflow-hidden rounded-xl border border-white/10 bg-ink-950">
        <div className="space-y-3 border-r border-white/[0.06] p-3">
          <div className="size-6 rounded-md bg-snow" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-6 w-full rounded-md ${i === 0 ? 'bg-accent/25' : 'bg-white/[0.05]'}`} />
          ))}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="h-2 w-20 rounded-full bg-white/60" />
            <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] text-mute-500">Beispieldaten</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['Aufträge', 'Offen', 'Erledigt'].map((k, i) => (
              <div key={k} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2">
                <p className="font-mono text-[9px] text-mute-500">{k}</p>
                <div className={`mt-2 h-2.5 rounded ${['w-10 bg-white/70', 'w-7 bg-white/40', 'w-9 bg-accent'][i]}`} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-28 items-end gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={inView}
                transition={{ duration: 0.9, delay: i * 0.05, ease }}
                className={`flex-1 rounded-t-[3px] ${i === bars.length - 1 ? 'bg-accent' : 'bg-white/[0.14]'}`}
              />
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.02] px-2 py-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400/80" />
                <span className="h-1.5 w-24 rounded-full bg-white/20" />
                <span className="ml-auto h-1.5 w-8 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
