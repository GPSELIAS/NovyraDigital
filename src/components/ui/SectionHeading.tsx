import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface Props {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  id?: string
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
}

export default function SectionHeading({ eyebrow, title, description, id, align = 'left', tone = 'dark' }: Props) {
  const center = align === 'center'
  return (
    <Reveal className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className={`eyebrow ${tone === 'light' ? '!text-mute-500' : ''}`}>
        <span aria-hidden className="inline-block h-px w-6 bg-accent" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`display mt-5 text-[2.35rem] sm:text-5xl lg:text-[3.6rem] ${tone === 'light' ? 'text-ink-950' : 'text-snow'}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`lead mt-6 ${center ? 'mx-auto' : ''} max-w-2xl ${tone === 'light' ? '!text-mute-500' : ''}`}>
          {description}
        </p>
      )}
    </Reveal>
  )
}
