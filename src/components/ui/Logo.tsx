interface Props {
  className?: string
  showWordmark?: boolean
}

/** Novyra-Monogramm: ein geometrisches «N» aus zwei Balken und einer Diagonale. */
export function Monogram({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#FAFAFA" />
      <path d="M9.5 23V9h2.6l7.8 10.1V9h2.6v14h-2.6L12.1 12.9V23H9.5Z" fill="#09090B" />
      <circle cx="22.5" cy="23" r="1.6" fill="#4F7CFF" />
    </svg>
  )
}

export default function Logo({ className = '', showWordmark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Monogram />
      {showWordmark && (
        <span className="whitespace-nowrap text-[13px] font-semibold tracking-[0.2em] text-snow">
          NOVYRA <span className="text-mute-400">DIGITAL</span>
        </span>
      )}
    </span>
  )
}
