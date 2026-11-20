import { useEffect } from 'react'
import { site } from '../config/site'

interface Seo {
  title: string
  description: string
  path: string
  noindex?: boolean
}

function setAttr(selector: string, attr: 'content' | 'href', value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

/** Aktualisiert Titel, Description, Canonical und OG-Tags bei clientseitiger Navigation. */
export function useSeo({ title, description, path, noindex }: Seo) {
  useEffect(() => {
    const url = `${site.url}${path}`
    document.title = title
    setAttr('meta[name="description"]', 'content', description)
    setAttr('link[rel="canonical"]', 'href', url)
    setAttr('meta[property="og:title"]', 'content', title)
    setAttr('meta[property="og:description"]', 'content', description)
    setAttr('meta[property="og:url"]', 'content', url)
    setAttr('meta[name="robots"]', 'content', noindex ? 'noindex, follow' : 'index, follow')
  }, [title, description, path, noindex])
}
