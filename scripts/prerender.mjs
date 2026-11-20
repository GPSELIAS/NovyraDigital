/**
 * Post-Build: erzeugt pro Route eine eigene HTML-Datei mit passenden Meta-Tags
 * (Title, Description, Canonical, OG), damit Suchmaschinen und Social-Media-Vorschauen
 * auch ohne JavaScript korrekte Angaben erhalten. Prüft zudem offene Pflichtangaben.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://novyradigital.ch'

const routes = [
  {
    file: 'impressum.html',
    path: '/impressum',
    title: 'Impressum – Novyra Digital',
    description: 'Impressum und Anbieterkennzeichnung von Novyra Digital, Digitalagentur aus der Schweiz.',
  },
  {
    file: 'datenschutz.html',
    path: '/datenschutz',
    title: 'Datenschutzerklärung – Novyra Digital',
    description:
      'Datenschutzerklärung von Novyra Digital gemäss Schweizer Datenschutzgesetz (DSG): welche Daten wir bearbeiten, wozu und welche Rechte du hast.',
  },
  {
    file: '404.html',
    path: '/404',
    title: 'Seite nicht gefunden – Novyra Digital',
    description: 'Die angeforderte Seite existiert nicht.',
    noindex: true,
  },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const block = (r) => `<!--seo:start-->
    <title>${esc(r.title)}</title>
    <meta name="description" content="${esc(r.description)}" />
    ${r.noindex ? '' : `<link rel="canonical" href="${SITE}${r.path}" />`}
    <meta property="og:title" content="${esc(r.title)}" />
    <meta property="og:description" content="${esc(r.description)}" />
    <meta property="og:url" content="${SITE}${r.path}" />
    <meta name="robots" content="${r.noindex ? 'noindex, follow' : 'index, follow'}" />
    <!--seo:end-->`

const html = await readFile(join(dist, 'index.html'), 'utf8')
if (!html.includes('<!--seo:start-->')) throw new Error('SEO-Marker in dist/index.html nicht gefunden')

for (const r of routes) {
  let page = html.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, block(r))
  if (r.noindex) page = page.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
  await writeFile(join(dist, r.file), page)
  console.log(`✓ prerender ${r.path} → dist/${r.file}`)
}

// ── Warnungen vor dem Livegang ──
const warnings = []
const siteTs = await readFile(join(root, 'src/config/site.ts'), 'utf8')
const legalBlock = siteTs.match(/legal:\s*{([\s\S]*?)\n  },/)?.[1] ?? ''
const optional = ['uid', 'commercialRegister', 'phone', 'legalForm', 'representative']
const missing = [...legalBlock.matchAll(/^\s+(\w+):\s*null/gm)].map((m) => m[1]).filter((k) => !optional.includes(k))
if (missing.length) warnings.push(`Rechtliche Pflichtangaben fehlen in src/config/site.ts: ${missing.join(', ')}`)
// Welcher Turnstile-Site-Key ist tatsächlich im Build gelandet?
const { readdir } = await import('node:fs/promises')
const jsFiles = (await readdir(join(dist, 'assets'))).filter((f) => f.endsWith('.js'))
let bundle = ''
for (const f of jsFiles) bundle += await readFile(join(dist, 'assets', f), 'utf8')
const siteKeyInConfig = /turnstileSiteKey:\s*'[^']+'/.test(siteTs)
if (/[123]x0{20}A{2}/.test(bundle)) {
  warnings.push('Im Build steckt ein Cloudflare-Turnstile-TESTSCHLÜSSEL (z. B. aus .env.local). Für Produktion den echten Site Key verwenden.')
} else if (!siteKeyInConfig && !process.env.VITE_TURNSTILE_SITE_KEY) {
  warnings.push('Kein Turnstile-Site-Key konfiguriert (src/config/site.ts → turnstileSiteKey). Ohne ihn kann das Kontaktformular nicht senden.')
}
if (warnings.length) {
  console.warn('\n\x1b[33m⚠  Vor dem Livegang erledigen:\x1b[0m')
  for (const w of warnings) console.warn(`   • ${w}`)
  console.warn('')
}
