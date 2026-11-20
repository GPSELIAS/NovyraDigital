import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { scrollToId } from '../../lib/scroll'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string }

/**
 * Link, der interne Routen, Anker auf der Startseite («/#kontakt») sowie
 * externe Links / mailto korrekt behandelt.
 */
const SmartLink = forwardRef<HTMLAnchorElement, Props>(function SmartLink({ href, onClick, ...rest }, ref) {
  const location = useLocation()
  const navigate = useNavigate()

  const isExternal = /^(https?:|mailto:|tel:)/.test(href)
  if (isExternal) {
    const newTab = href.startsWith('http')
    return (
      <a ref={ref} href={href} onClick={onClick} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest} />
    )
  }

  const [path, hash] = href.split('#')
  const targetPath = path || '/'

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    if (location.pathname === targetPath) {
      e.preventDefault()
      if (hash) {
        if (scrollToId(hash)) window.history.replaceState(null, '', `${targetPath}#${hash}`)
      } else {
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
        window.history.replaceState(null, '', targetPath)
      }
    } else if (hash) {
      e.preventDefault()
      navigate(`${targetPath}#${hash}`)
    }
  }

  return <Link ref={ref} to={href} onClick={handleClick} {...rest} />
})

export default SmartLink
