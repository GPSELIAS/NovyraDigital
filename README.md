# Novyra Digital – Website

Produktionsreife Website für **Novyra Digital** (novyradigital.ch): React + TypeScript + Vite + Tailwind CSS + Motion, gehostet auf **Cloudflare Pages** mit einer **Pages Function** für das Kontaktformular (Versand via **Resend**, Spam-Schutz via **Cloudflare Turnstile**).

---

## Inhalt

1. [Überblick & Struktur](#1-überblick--struktur)
2. [Lokale Entwicklung](#2-lokale-entwicklung)
3. [Checkliste vor dem Livegang](#3-checkliste-vor-dem-livegang)
4. [Resend einrichten (E-Mail-Versand)](#4-resend-einrichten-e-mail-versand)
5. [Cloudflare Turnstile einrichten](#5-cloudflare-turnstile-einrichten)
6. [Deployment auf Cloudflare Pages via GitHub](#6-deployment-auf-cloudflare-pages-via-github)
7. [Domain & DNS (Infomaniak → Cloudflare)](#7-domain--dns-infomaniak--cloudflare)
8. [HTTPS & www-Weiterleitung](#8-https--www-weiterleitung)
9. [Rate-Limiting (optional, empfohlen)](#9-rate-limiting-optional-empfohlen)
10. [Kontaktformular live testen](#10-kontaktformular-live-testen)
11. [Umgebungsvariablen – Referenz](#11-umgebungsvariablen--referenz)
12. [Fehlerbehebung](#12-fehlerbehebung)

---

## 1. Überblick & Struktur

```
├─ functions/api/contact.ts   POST /api/contact (Validierung, Turnstile, Rate-Limit, Resend)
├─ shared/contact.ts          Gemeinsame Validierungsregeln (Frontend + Server)
├─ src/
│  ├─ config/site.ts          ⚠️ Firmen-/Rechtsangaben + Turnstile-Site-Key (zentral)
│  ├─ components/             Layout (Header, Footer), UI (Button, Reveal …), Formular, Visuals
│  ├─ sections/               Hero, Leistungen, Über uns, Prozess, Lösungen, FAQ, Kontakt
│  ├─ pages/                  Home, Impressum, Datenschutz, 404
│  └─ lib/                    SEO-Hook, Scroll-Helfer, Service-Vorauswahl
├─ public/                    Favicons, OG-Bild, robots.txt, sitemap.xml, _headers (Security/CSP)
├─ scripts/prerender.mjs      Erzeugt /impressum, /datenschutz, 404 mit eigenen Meta-Tags + Livegang-Warnungen
├─ scripts/generate-assets.mjs Erzeugt Favicons & OG-Bild neu (npm run assets)
├─ tests/contact.test.ts      17 Tests für Validierung und Endpoint
└─ wrangler.toml              Cloudflare-Pages-Konfiguration (nicht-geheime Variablen)
```

**Funktionen im Überblick**

- Sticky Header mit Glas-Effekt, aktiver Sektionsmarkierung und barrierearmem Mobile-Menü (Fokusführung, Escape, Scroll-Lock)
- Hero mit animierter Systemvisualisierung, Leistungen (3 Cards mit Service-Vorauswahl im Formular), Über uns / Vorteile, Prozess mit Scroll-Fortschrittslinie, Anwendungsbeispiele (klar als Beispiele gekennzeichnet), FAQ-Accordion, Kontakt
- Kontaktformular: Frontend- und Server-Validierung (gleiche Regeln), Turnstile, Honeypot, optionales Rate-Limiting, Origin-Prüfung, Grössenlimit, Idempotency-Key, Ladezustand, Doppelklick-Schutz, barrierefreie Fehlermeldungen, Erfolg nur bei tatsächlichem Versand
- Impressum & Datenschutz (revDSG) mit zentral konfigurierbaren, deutlich markierten **ausstehenden** Pflichtangaben
- SEO: Title/Description/Canonical/OG pro Route (auch ohne JavaScript dank Prerender), JSON-LD (Organization, ProfessionalService, WebSite), robots.txt, sitemap.xml, echte 404-Statuscodes
- Performance & Datenschutz: Schrift selbst gehostet (kein Google Fonts), Turnstile wird erst nahe dem Formular geladen, keine Tracking-Cookies → **kein Cookie-Banner nötig**
- `prefers-reduced-motion` wird überall respektiert

---

## 2. Lokale Entwicklung

Voraussetzung: Node.js ≥ 20.

```bash
npm install
cp .env.example .env.local        # enthält den Turnstile-Testschlüssel fürs Frontend
cp .dev.vars.example .dev.vars    # Server-Variablen für wrangler (Testschlüssel)
```

| Befehl | Zweck |
|---|---|
| `npm run dev` | Vite-Dev-Server (http://localhost:5173), schnelles UI-Arbeiten |
| `npm run dev:full` | Build + `wrangler pages dev` (http://localhost:8788) – inkl. `/api/contact` |
| `npm run typecheck` | TypeScript-Prüfung (App, Functions, Tests) |
| `npm test` | Unit- und Endpoint-Tests |
| `npm run build` | Produktionsbuild nach `dist/` + Prerender + Livegang-Warnungen |
| `npm run assets` | Favicons und OG-Bild neu erzeugen |

> Hinweis: Mit leerem `RESEND_API_KEY` in `.dev.vars` antwortet `/api/contact` mit einem Fehler – es wird bewusst **keine** Erfolgsmeldung angezeigt. Für einen echten lokalen Versand den echten Key in `.dev.vars` eintragen (Datei ist in `.gitignore`).

---

## 3. Checkliste vor dem Livegang

Der Build gibt Warnungen aus, solange diese Punkte offen sind:

- [ ] **`src/config/site.ts` → `legal`**: `owner`, `street`, `city`, `mailProvider` eintragen (optional: `legalForm`, `uid`, `commercialRegister`, `representative`, `phone`). Keine erfundenen Angaben!
- [ ] **`src/config/site.ts` → `turnstileSiteKey`**: echten Turnstile-Site-Key eintragen (öffentlich, kein Geheimnis)
- [ ] Resend-Domain `mail.novyradigital.ch` verifiziert (Abschnitt 4)
- [ ] Secrets in Cloudflare Pages hinterlegt: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` (Abschnitt 6)
- [ ] Rechtstexte gegen die tatsächliche Konfiguration geprüft (z. B. ob die Eingangsbestätigung aktiviert ist, ob KV-Rate-Limiting aktiv ist, welcher Mailanbieter genutzt wird). Im Zweifel juristisch prüfen lassen.
- [ ] Kontaktformular live getestet (Abschnitt 10)

---

## 4. Resend einrichten (E-Mail-Versand)

Ziel: Versand über eine **eigene Subdomain** `mail.novyradigital.ch`, damit die DNS-Einträge des Postfachs `info@novyradigital.ch` (MX/SPF der Hauptdomain) **nicht verändert** werden.

1. Konto auf [resend.com](https://resend.com) erstellen.
2. **Domains → Add Domain** → `mail.novyradigital.ch` eingeben, Region **EU (Ireland, eu-west-1)** wählen.
3. Resend zeigt die benötigten DNS-Einträge. Typischerweise (Werte **exakt aus dem Resend-Dashboard** übernehmen):

   | Typ | Name (Host) | Wert | Priorität |
   |---|---|---|---|
   | TXT | `resend._domainkey.mail` | `p=MIGfMA0G…` (DKIM-Schlüssel aus Resend) | – |
   | MX | `send.mail` | `feedback-smtp.eu-west-1.amazonses.com` | 10 |
   | TXT | `send.mail` | `v=spf1 include:amazonses.com ~all` | – |

   Diese Einträge betreffen nur `*.mail.novyradigital.ch` und kollidieren nicht mit dem MX/SPF der Hauptdomain.
4. Einträge im DNS anlegen (bei Cloudflare: **Proxy-Status „DNS only“ / graue Wolke**), dann in Resend **Verify** klicken. Erst wenn der Status **Verified** ist, kann versendet werden.
5. **API Keys → Create API Key** → Berechtigung „Sending access“, Domain `mail.novyradigital.ch`. Key sicher notieren – er wird nur einmal angezeigt.
6. Absender in `wrangler.toml` (bereits gesetzt): `MAIL_FROM = "Novyra Digital <website@mail.novyradigital.ch>"`. Die Adresse `website@…` muss kein echtes Postfach sein – Antworten gehen dank **Reply-To** direkt an die anfragende Person.

**Optional – DMARC:** Falls noch kein DMARC-Eintrag für die Hauptdomain existiert, empfiehlt sich zunächst ein beobachtender Eintrag: `TXT _dmarc` → `v=DMARC1; p=none; rua=mailto:info@novyradigital.ch`. Dieser gilt für die ganze Domain inkl. Postfach – vorher mit dem Mailanbieter abstimmen.

---

## 5. Cloudflare Turnstile einrichten

1. Cloudflare-Dashboard → **Turnstile → Add widget**.
2. Name: „Novyra Kontaktformular“, Hostnames: `novyradigital.ch`, `www.novyradigital.ch` (optional zusätzlich `novyra-digital.pages.dev` für Preview-Tests), Widget-Modus: **Managed**.
3. **Site Key** → in `src/config/site.ts` bei `turnstileSiteKey` eintragen (öffentlich).
4. **Secret Key** → als Secret `TURNSTILE_SECRET_KEY` in Cloudflare Pages (Abschnitt 6). **Niemals** ins Repository.

Testschlüssel für lokale Entwicklung (von Cloudflare dokumentiert): Site Key `1x00000000000000000000AA`, Secret `1x0000000000000000000000000000000AA` (besteht immer).

---

## 6. Deployment auf Cloudflare Pages via GitHub

1. **Repository anlegen** (privat empfohlen) und Code pushen:
   ```bash
   git add -A
   git commit -m "Initiale Version der Novyra-Digital-Website"
   git branch -M main
   git remote add origin https://github.com/<DEIN-ACCOUNT>/novyra-digital.git
   git push -u origin main
   ```
2. Cloudflare-Dashboard → **Workers & Pages → Create → Pages → Connect to Git** → Repository wählen.
3. Build-Einstellungen:
   | Einstellung | Wert |
   |---|---|
   | Projektname | `novyra-digital` (muss zu `name` in `wrangler.toml` passen) |
   | Production branch | `main` |
   | Framework preset | None / Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   Die Node-Version wird über `.nvmrc` (22) gesetzt.
4. **Secrets hinterlegen**: Projekt → **Settings → Variables and Secrets → Add** → Typ **Secret**:
   - `RESEND_API_KEY` = Resend-API-Key
   - `TURNSTILE_SECRET_KEY` = Turnstile-Secret

   Alternativ per CLI: `npx wrangler pages secret put RESEND_API_KEY --project-name novyra-digital`

   Nicht-geheime Variablen (`MAIL_TO`, `MAIL_FROM`, `SEND_CONFIRMATION_EMAIL`, `ALLOWED_ORIGINS`) stehen in `wrangler.toml` – diese Datei ist für Pages die massgebliche Konfiguration.
5. **Save and Deploy**. Nach dem ersten Deployment ist die Seite unter `https://novyra-digital.pages.dev` erreichbar. Jeder Push auf `main` deployt automatisch, andere Branches erzeugen Preview-Deployments.
6. Nach Änderungen an Secrets: **neu deployen** (Deployments → … → Retry deployment), damit sie aktiv werden.

---

## 7. Domain & DNS (Infomaniak → Cloudflare)

Cloudflare Pages kann die **Hauptdomain** `novyradigital.ch` (ohne www) nur bedienen, wenn die DNS-Zone bei Cloudflare liegt. Daher wird empfohlen, die **Nameserver** bei Infomaniak auf Cloudflare umzustellen. Die Domain bleibt dabei bei Infomaniak registriert, und das Postfach bleibt beim bisherigen Mailanbieter – nur die DNS-Verwaltung zieht zu Cloudflare.

### Schritt für Schritt (Variante A – empfohlen)

1. Cloudflare → **Add a domain** → `novyradigital.ch` → Plan **Free**.
2. Cloudflare importiert die bestehenden DNS-Einträge. **Vor** dem Nameserver-Wechsel prüfen, dass **alle E-Mail-Einträge vollständig übernommen** wurden – mit der Liste bei Infomaniak (Domain → DNS-Zone) abgleichen:
   - **MX** der Hauptdomain (Postfach-Empfang)
   - **TXT SPF** der Hauptdomain (z. B. `v=spf1 include:… -all`)
   - **DKIM** des Mailanbieters (TXT oder CNAME)
   - **DMARC** (`_dmarc`), falls vorhanden
   - **Autodiscover/Autoconfig**-CNAMEs, `mail`/`imap`/`smtp`-Einträge, falls vorhanden

   ⚠️ Alle E-Mail-bezogenen Einträge müssen auf **„DNS only“ (graue Wolke)** stehen – niemals proxied.
3. Falls bei Infomaniak **DNSSEC** aktiv ist: zuerst dort deaktivieren.
4. Bei Infomaniak → Domain → **Nameserver ändern** → die zwei von Cloudflare angezeigten Nameserver eintragen. Propagation: wenige Minuten bis 24 h. Cloudflare meldet „Active“ per E-Mail.
5. Cloudflare Pages → Projekt → **Custom domains → Set up a custom domain** → `novyradigital.ch`, danach zusätzlich `www.novyradigital.ch`. Cloudflare legt die Einträge automatisch an.
6. Optional: DNSSEC danach in Cloudflare aktivieren und den DS-Record bei Infomaniak hinterlegen.

### Benötigte DNS-Einträge – Website

| Typ | Name | Wert | Proxy |
|---|---|---|---|
| CNAME | `@` (novyradigital.ch) | `novyra-digital.pages.dev` | Proxied (orange) – wird automatisch angelegt |
| CNAME | `www` | `novyra-digital.pages.dev` | Proxied (orange) – wird automatisch angelegt |

(Cloudflare löst den CNAME auf der Hauptdomain per „CNAME Flattening“ auf – das ist normal.)

### Benötigte DNS-Einträge – E-Mail-Empfang (info@novyradigital.ch)

Die exakten Werte stammen vom Mailanbieter. **Beispiel für Infomaniak Mail** – bitte mit den Angaben im Infomaniak-Manager abgleichen:

| Typ | Name | Wert (Beispiel) | Proxy |
|---|---|---|---|
| MX | `@` | Mailserver des Anbieters (z. B. `mta-gw.infomaniak.ch`) mit der vom Anbieter vorgegebenen Priorität | DNS only |
| TXT | `@` | SPF des Anbieters (z. B. `v=spf1 include:spf.infomaniak.ch -all`) | DNS only |
| TXT/CNAME | DKIM-Selector des Anbieters | DKIM-Wert des Anbieters | DNS only |
| TXT | `_dmarc` | z. B. `v=DMARC1; p=none; rua=mailto:info@novyradigital.ch` (optional) | DNS only |

> Wichtig: **Den SPF-Eintrag der Hauptdomain nicht um Resend erweitern.** Resend versendet über `mail.novyradigital.ch` und hat dort einen eigenen SPF-Eintrag.

### Benötigte DNS-Einträge – E-Mail-Versand (Resend)

Siehe Abschnitt 4 (`resend._domainkey.mail`, `send.mail` MX + TXT) – alle **DNS only**.

### Variante B – DNS bleibt bei Infomaniak (nicht empfohlen)

Ohne Cloudflare-Nameserver kann nur `www.novyradigital.ch` per CNAME auf `novyra-digital.pages.dev` zeigen; die Hauptdomain müsste bei Infomaniak per Weiterleitung auf `www` umgeleitet werden. Dann müssten `site.url`, alle Canonical-URLs (index.html, `scripts/prerender.mjs`, `public/sitemap.xml`, `public/robots.txt`) auf `https://www.novyradigital.ch` umgestellt werden.

---

## 8. HTTPS & www-Weiterleitung

- **Zertifikate** stellt Cloudflare Pages automatisch aus (Status in *Custom domains* → „Active“).
- Cloudflare → Domain → **SSL/TLS → Overview**: Modus **Full (strict)**. Unter **Edge Certificates**: „Always Use HTTPS“ **an**, „Minimum TLS Version“ 1.2.
- HSTS wird bereits über `public/_headers` gesendet.
- **www → Hauptdomain**: Cloudflare → Domain → **Rules → Redirect Rules → Create rule → Template „Redirect from WWW to root“** (301, Query-String beibehalten).
- Empfehlung: **Rocket Loader** deaktiviert lassen (Speed → Optimization), da er Skripte umschreibt.

---

## 9. Rate-Limiting (optional, empfohlen)

Turnstile + Honeypot schützen bereits wirksam. Zusätzlich gibt es zwei Möglichkeiten:

**a) WAF-Regel (empfohlen, ohne Code):** Cloudflare → Domain → **Security → WAF → Rate limiting rules → Create**: *URI Path equals `/api/contact`* und *Request Method equals `POST`*, z. B. 3 Anfragen pro 10 Sekunden pro IP → Block für 10 Minuten. (Der Free-Plan enthält eine Rate-Limiting-Regel.)

**b) KV-basiert im Code (5 Anfragen / 10 Min. pro IP):**
1. Workers & Pages → **KV → Create namespace** (z. B. `novyra-rate-limit`).
2. In `wrangler.toml` den `[[kv_namespaces]]`-Block einkommentieren und die Namespace-ID eintragen.
3. Commit + Push. Gespeichert wird nur ein SHA-256-Hash der IP für max. 10 Minuten (in der Datenschutzerklärung bereits beschrieben).

---

## 10. Kontaktformular live testen

Erst wenn dieser Test erfolgreich war, ist der E-Mail-Versand bestätigt.

1. Voraussetzungen: Resend-Domain *Verified*, Secrets gesetzt, neu deployt, echter Turnstile-Site-Key in `site.ts`.
2. `https://novyradigital.ch/#kontakt` öffnen (idealerweise in einem privaten Fenster).
3. Formular mit einer **eigenen, erreichbaren E-Mail-Adresse** ausfüllen, Dienstleistung wählen, Datenschutz bestätigen, **Anfrage senden**.
4. Erwartet: Button zeigt „Wird gesendet …“, danach die Meldung *„Vielen Dank für deine Anfrage! …“*.
5. Prüfen:
   - Posteingang **info@novyradigital.ch**: E-Mail „Neue Anfrage: … – Name“ mit allen Feldern (auch Spam-Ordner prüfen).
   - **Antworten** auf diese E-Mail → Empfänger muss die im Formular angegebene Adresse sein (Reply-To).
   - Resend-Dashboard → **Emails**: Status „Delivered“.
   - Falls `SEND_CONFIRMATION_EMAIL = "true"`: Eingangsbestätigung bei der eigenen Adresse.
6. Fehlerfall prüfen (optional): In Pages vorübergehend einen ungültigen `RESEND_API_KEY` setzen und neu deployen → das Formular muss eine **Fehlermeldung** zeigen, keine Erfolgsmeldung. Danach den echten Key wiederherstellen.
7. Logs bei Problemen: Pages-Projekt → Deployment → **Functions → Real-time Logs** (Einträge mit `[contact]`).

---

## 11. Umgebungsvariablen – Referenz

| Variable | Wo | Geheim | Beschreibung |
|---|---|---|---|
| `RESEND_API_KEY` | Pages → Secret / `.dev.vars` | **ja** | Resend-API-Key |
| `TURNSTILE_SECRET_KEY` | Pages → Secret / `.dev.vars` | **ja** | Turnstile-Secret |
| `MAIL_TO` | `wrangler.toml` | nein | Empfänger (info@novyradigital.ch) |
| `MAIL_FROM` | `wrangler.toml` | nein | Absender, Domain muss in Resend verifiziert sein |
| `SEND_CONFIRMATION_EMAIL` | `wrangler.toml` | nein | `"true"` = Eingangsbestätigung an Anfragende (Standard: `"false"`) |
| `ALLOWED_ORIGINS` | `wrangler.toml` | nein | Erlaubte Origins (gleiche Herkunft inkl. `*.pages.dev`-Previews ist automatisch erlaubt) |
| `RATE_LIMIT` | `wrangler.toml` (KV-Binding) | – | Optional, siehe Abschnitt 9 |
| `turnstileSiteKey` | `src/config/site.ts` | nein | Öffentlicher Turnstile-Site-Key |
| `VITE_TURNSTILE_SITE_KEY` | `.env.local` | nein | Überschreibt den Site Key lokal (Testschlüssel) |

---

## 12. Fehlerbehebung

| Symptom | Ursache / Lösung |
|---|---|
| Formular: „Das Kontaktformular ist noch nicht vollständig eingerichtet“ | `turnstileSiteKey` in `site.ts` fehlt |
| „Die Sicherheitsprüfung ist fehlgeschlagen“ | Site Key und Secret gehören nicht zum selben Widget, oder Hostname fehlt im Turnstile-Widget |
| „Deine Anfrage konnte leider nicht gesendet werden“ | Secrets fehlen (Status 503) oder Resend lehnt ab (502) → Functions-Logs prüfen, Domain verifiziert? `MAIL_FROM`-Domain = verifizierte Domain? |
| „Unzulässige Herkunft der Anfrage“ (403) | Aufruf von fremder Domain → `ALLOWED_ORIGINS` ergänzen |
| Turnstile-Widget erscheint nicht | Inhaltsblocker, oder CSP in `public/_headers` verändert |
| Lokaler Start: „requires compatibility date …“ | `compatibility_date` in `wrangler.toml` auf ein von der installierten Wrangler-Version unterstütztes Datum setzen oder Wrangler aktualisieren |
