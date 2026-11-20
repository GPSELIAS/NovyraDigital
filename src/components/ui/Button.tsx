import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import SmartLink from './SmartLink'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'
type Size = 'md' | 'lg'

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[0_0_0_1px_rgb(79_124_255/0.5),0_8px_30px_-8px_rgb(79_124_255/0.6),inset_0_1px_0_rgb(255_255_255/0.2)] hover:bg-accent-strong hover:shadow-[0_0_0_1px_rgb(79_124_255/0.7),0_12px_40px_-8px_rgb(79_124_255/0.75),inset_0_1px_0_rgb(255_255_255/0.25)]',
  secondary:
    'border border-white/12 bg-white/[0.03] text-snow backdrop-blur hover:border-white/25 hover:bg-white/[0.07]',
  ghost: 'text-mute-300 hover:text-snow',
  light: 'bg-ink-950 text-snow hover:bg-ink-800',
}

const sizes: Record<Size, string> = {
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

interface Common {
  variant?: Variant
  size?: Size
  arrow?: boolean
  className?: string
  children: ReactNode
}

type LinkProps = Common & { href: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void }
type BtnProps = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }

export default function Button(props: LinkProps | BtnProps) {
  const { variant = 'primary', size = 'md', arrow, className = '', children } = props
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  const inner = (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      )}
      <span className="relative">{children}</span>
      {arrow && (
        <ArrowRight aria-hidden className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </>
  )

  if (props.href !== undefined) {
    return (
      <SmartLink href={props.href} onClick={props.onClick} className={cls}>
        {inner}
      </SmartLink>
    )
  }
  const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, href: _h, ...rest } = props as BtnProps
  return (
    <button {...rest} className={cls}>
      {inner}
    </button>
  )
}
