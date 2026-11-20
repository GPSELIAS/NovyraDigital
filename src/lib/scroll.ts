/** Scrollt sanft (bzw. sofort bei reduzierter Bewegung) zu einem Element per ID. */
export function scrollToId(id: string): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  return true
}
