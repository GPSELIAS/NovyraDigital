/**
 * Erzeugt Favicons, Apple-Touch-Icon und die Social-Sharing-Grafik (og-image.png)
 * aus SVG-Vorlagen. Ausführen mit: npm run assets
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const N_PATH = 'M9.5 23V9h2.6l7.8 10.1V9h2.6v14h-2.6L12.1 12.9V23H9.5Z'

const icon = (size, radius = 8) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${radius}" fill="#09090B"/>
  <path d="${N_PATH}" fill="#FAFAFA"/>
  <circle cx="22.5" cy="23" r="1.6" fill="#4F7CFF"/>
</svg>`

const font = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="78%" cy="18%" r="60%">
      <stop offset="0" stop-color="#4F7CFF" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#4F7CFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fade" cx="50%" cy="40%" r="75%">
      <stop offset="0.4" stop-color="#09090B" stop-opacity="0"/>
      <stop offset="1" stop-color="#09090B" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="line2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D4D4D8"/>
      <stop offset="1" stop-color="#71717A"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#09090B"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <circle cx="960" cy="120" r="300" fill="none" stroke="#ffffff" stroke-opacity="0.07"/>
  <circle cx="960" cy="120" r="210" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-dasharray="2 7"/>

  <g transform="translate(80 80) scale(1.75)">
    <rect width="32" height="32" rx="8" fill="#FAFAFA"/>
    <path d="${N_PATH}" fill="#09090B"/>
    <circle cx="22.5" cy="23" r="1.6" fill="#4F7CFF"/>
  </g>
  <text x="152" y="118" font-family="${font}" font-size="22" font-weight="600" letter-spacing="4.5" fill="#FAFAFA">NOVYRA <tspan fill="#A1A1AA">DIGITAL</tspan></text>

  <text x="80" y="330" font-family="${font}" font-size="76" font-weight="700" letter-spacing="-2.5" fill="#FAFAFA">Digitale Lösungen.</text>
  <text x="80" y="418" font-family="${font}" font-size="76" font-weight="700" letter-spacing="-2.5" fill="url(#line2)">Die wirklich etwas bewegen.</text>

  <text x="80" y="540" font-family="${font}" font-size="24" fill="#A1A1AA">Webdesign · KI &amp; Automatisierung · Individuelle Software</text>
  <circle cx="968" cy="532" r="5" fill="#4F7CFF"/>
  <text x="984" y="540" font-family="${font}" font-size="24" fill="#FAFAFA">novyradigital.ch</text>
</svg>`

const out = [
  ['favicon-32.png', sharp(Buffer.from(icon(32))).png()],
  ['apple-touch-icon.png', sharp(Buffer.from(icon(180, 0))).png()],
  ['icon-192.png', sharp(Buffer.from(icon(192, 0))).png()],
  ['icon-512.png', sharp(Buffer.from(icon(512, 0))).png()],
  ['og-image.png', sharp(Buffer.from(og)).png({ compressionLevel: 9 })],
]

for (const [name, img] of out) {
  await writeFile(join(pub, name), await img.toBuffer())
  console.log('✓', name)
}
