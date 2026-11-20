import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { ServiceValue } from '../../shared/contact'

interface Ctx {
  /** Vorausgewählte Dienstleistung + Zähler, damit dieselbe Auswahl erneut greift */
  selection: { service: ServiceValue; nonce: number } | null
  selectService: (service: ServiceValue) => void
}

const ServiceContext = createContext<Ctx | null>(null)

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Ctx['selection']>(null)
  const selectService = useCallback((service: ServiceValue) => {
    setSelection((prev) => ({ service, nonce: (prev?.nonce ?? 0) + 1 }))
  }, [])
  return <ServiceContext.Provider value={{ selection, selectService }}>{children}</ServiceContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useServiceSelection() {
  const ctx = useContext(ServiceContext)
  if (!ctx) throw new Error('useServiceSelection ausserhalb des ServiceProvider')
  return ctx
}
