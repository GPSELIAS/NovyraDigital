import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Bot, CheckCircle2, Globe, LayoutDashboard, Mail, Sparkles, Zap } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

/** Dekorative Systemvisualisierung im Hero (rein illustrativ, für Screenreader ausgeblendet). */
export default function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[1080px] select-none">
      {/* Lichtschein unter dem Fenster */}
      <div className="absolute -inset-x-10 -bottom-10 top-10 rounded-[40px] bg-accent/20 blur-[90px]" />

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease }}
        style={{ transformPerspective: 1400 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/90 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl"
      >
        {/* Fensterleiste */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <div className="mx-auto flex items-center gap-2 rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[10.5px] text-mute-500">
            <span className="size-1.5 rounded-full bg-emerald-400/80" />
            workspace / digitale-prozesse
          </div>
          <span className="w-12" />
        </div>

        <div className="grid gap-px bg-white/[0.05] md:grid-cols-[1.05fr_1.25fr_1fr]">
          {/* Spalte 1: Website */}
          <div className="bg-ink-900 p-5">
            <PanelTitle icon={<Globe className="size-3.5" />} label="Website" status="Live" />
            <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.06] bg-ink-950">
              <div className="flex items-center justify-between border-b border-white/[0.05] px-3 py-2">
                <div className="h-1.5 w-10 rounded-full bg-white/25" />
                <div className="flex gap-1.5">
                  <div className="h-1.5 w-5 rounded-full bg-white/10" />
                  <div className="h-1.5 w-5 rounded-full bg-white/10" />
                  <div className="h-1.5 w-7 rounded-full bg-accent/70" />
                </div>
              </div>
              <div className="space-y-2 px-3 pt-4 pb-3">
                <div className="h-2.5 w-4/5 rounded bg-white/70" />
                <div className="h-2.5 w-3/5 rounded bg-white/35" />
                <div className="h-1.5 w-full rounded bg-white/10" />
                <div className="h-1.5 w-11/12 rounded bg-white/10" />
                <div className="flex gap-1.5 pt-1.5">
                  <div className="h-4 w-14 rounded-full bg-accent" />
                  <div className="h-4 w-12 rounded-full border border-white/15" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 px-3 pb-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-10 rounded-md border border-white/[0.06] bg-white/[0.03]" />
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px]">
              <Metric label="Mobil" value="100%" />
              <Metric label="HTTPS" value="aktiv" />
              <Metric label="SEO" value="bereit" />
            </div>
          </div>

          {/* Spalte 2: Workflow */}
          <div className="hidden bg-ink-900 p-5 sm:block">
            <PanelTitle icon={<Zap className="size-3.5" />} label="Automation" status="Aktiv" />
            <div className="relative mt-4 space-y-2.5">
              <svg className="absolute left-[19px] top-6 h-[calc(100%-48px)] w-px overflow-visible" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="0" y2="100%" stroke="rgb(79 124 255 / 0.5)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-dash" />
              </svg>
              {[
                { icon: <Mail className="size-3.5" />, t: 'Neue Anfrage eingegangen', s: 'Kontaktformular' },
                { icon: <Bot className="size-3.5" />, t: 'Anliegen klassifiziert', s: 'KI-Analyse' },
                { icon: <LayoutDashboard className="size-3.5" />, t: 'Lead im CRM angelegt', s: 'Integration' },
                { icon: <CheckCircle2 className="size-3.5" />, t: 'Bestätigung versendet', s: 'E-Mail' },
              ].map((step, i) => (
                <motion.div
                  key={step.t}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.18, duration: 0.6, ease }}
                  className="relative flex items-center gap-3 rounded-lg border border-white/[0.06] bg-ink-950/70 px-2.5 py-2"
                >
                  <span className="relative z-10 flex size-[30px] shrink-0 items-center justify-center rounded-md border border-accent/30 bg-ink-900 text-accent-soft">
                    {step.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] text-snow">{step.t}</span>
                    <span className="block font-mono text-[10px] text-mute-500">{step.s}</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400/80">✓</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Spalte 3: Dashboard */}
          <div className="hidden bg-ink-900 p-5 md:block">
            <PanelTitle icon={<Sparkles className="size-3.5" />} label="Dashboard" status="Sync" />
            <div className="mt-4 rounded-lg border border-white/[0.06] bg-ink-950/70 p-3">
              <p className="font-mono text-[10px] text-mute-500">Bearbeitete Anfragen</p>
              <p className="mt-1 text-xl font-semibold tracking-tight text-snow">Übersicht</p>
              <div className="mt-3 flex h-24 items-end gap-1.5">
                {[38, 52, 44, 66, 58, 74, 70, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1.2 + i * 0.06, duration: 0.8, ease }}
                    className={`flex-1 rounded-t-sm ${i === 7 ? 'bg-accent' : 'bg-white/15'}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {['Webanfragen', 'Termine', 'Offerten'].map((l, i) => (
                <div key={l} className="flex items-center gap-2.5">
                  <span className="w-20 font-mono text-[10px] text-mute-500">{l}</span>
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: `${[72, 48, 61][i]}%` }}
                      transition={{ delay: 1.4 + i * 0.1, duration: 1, ease }}
                      className="block h-full rounded-full bg-accent/70"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PanelTitle({ icon, label, status }: { icon: ReactNode; label: string; status: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-[12px] font-medium text-mute-300">
        <span className="text-accent-soft">{icon}</span>
        {label}
      </span>
      <span className="flex items-center gap-1.5 rounded-full border border-white/[0.07] px-2 py-0.5 font-mono text-[9.5px] text-mute-400">
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
        {status}
      </span>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
      <div className="text-mute-500">{label}</div>
      <div className="mt-0.5 text-snow">{value}</div>
    </div>
  )
}
