# Novyra Digital

Website für [novyradigital.ch](https://novyradigital.ch) mit React, TypeScript und Vite. Netlify liefert die Website aus und betreibt `POST /api/contact`. Cloudflare Turnstile prüft das Formular, Resend versendet die Anfrage und Infomaniak empfängt sie im Postfach `info@novyradigital.ch`.

## 1. Lokal entwickeln und prüfen

Benötigt wird Node.js 22 ab Version 22.13. Im Projektordner ausführen:

```bash
npm ci
npm run dev
npm run build
npm run typecheck
npm test
```

- `npm run dev` öffnet die Website über Vite unter `http://localhost:5173`.
- `npm run dev:full` startet die Netlify CLI und stellt Website und Function gemeinsam unter `http://localhost:8888` bereit. Beim ersten Start lädt `npx` die CLI. Für einen lokalen Start ist kein produktiver Deploy nötig. Weil Netlify Dev die produktiven Sicherheitsheader anwendet, sind Änderungen am Frontend dort nach dem Neuladen sichtbar.
- `npm run build` erzeugt `dist/` mit separaten HTML-Einstiegen für Impressum, Datenschutz und die 404-Seite.
- `npx --yes netlify-cli build --offline` prüft den Netlify-Build und bündelt die Function lokal. Der Befehl veröffentlicht keinen Deploy.
- `npm test` prüft unter anderem Eingabevalidierung, Turnstile, Resend und den Netlify-Einstiegspunkt mit simulierten Antworten.

Für lokale Formularversuche `.env.example` nach `.env` kopieren. In PowerShell geht das mit `Copy-Item .env.example .env`. Ohne Schlüssel bleibt der E-Mail-Link verfügbar. Für einen lokalen Browser-Test des Widgets können die [offiziellen öffentlichen Turnstile-Testwerte](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) verwendet werden:

```dotenv
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Testschlüssel greifen ausschliesslich in lokaler Entwicklung. Für einen echten lokalen Versand sind ein gültiger Resend-Schlüssel, ein verifizierter Absender und ein kontrollierter Testempfänger nötig. Für die normale Entwicklung und die automatisierten Tests bleiben die Versanddaten leer. Beim Wechsel vom alten Wrangler-Setup können veraltete lokale `.env.local`-Einträge die Werte aus `.env` übersteuern. Die alte `.dev.vars` wird für Netlify nicht benötigt.

## 2. Netlify mit GitHub verbinden

1. In Netlify **Add new project → Import an existing project → GitHub** wählen und das Repository **NovyraDigital** freigeben und auswählen.
2. Den gewünschten Produktionsbranch auswählen (im Repository derzeit `main`). Die Einstellungen kommen aus `netlify.toml`. Erwartet werden `npm run build`, `dist`, `netlify/functions`, Node 22 und esbuild.
3. Den von Netlify angezeigten Hostnamen unter `netlify.app` notieren. Er ist auch der Testhost für das Turnstile-Widget. Der erste Build funktioniert mit deaktiviertem Formular.
4. Beim Formular registriert die Function selbst den Pfad `/api/contact` und akzeptiert POST. Die rechtlichen Routen werden direkt aus dem Build ausgeliefert. Unbekannte Pfade erhalten die 404-Seite. Die Header für statische Dateien kommen aus `public/_headers`.
5. Deploy Previews können für UI-Prüfungen ohne Formularschlüssel verwendet werden. Wenn ein Preview echten Versand testen soll, seinen tatsächlichen Hostnamen in einem separaten Turnstile-Widget freigeben und nur die Preview-Variablen mit Testempfänger setzen. Produktionsschlüssel und das produktive Postfach für diesen Kontext freilassen.

[Netlify-Dokumentation zu Git-basierten Deploys](https://docs.netlify.com/deploy/create-deploys/)

## 3. `novyradigital.ch` anschliessen und Infomaniak-Postfach erhalten

1. In Netlify unter **Domain management → Production domains** `novyradigital.ch` hinzufügen und als primäre Domain festlegen. Die angezeigte Weiterleitung für `www.novyradigital.ch` prüfen.
2. Bei der Stelle, die die DNS-Zone verwaltet, die von Netlify unter **Pending DNS verification** konkret angegebenen Web-Einträge für die Hauptdomain und gegebenenfalls `www` setzen. Wenn die DNS-Zone bei Infomaniak liegt, ist das der Infomaniak Manager unter **Domain → DNS-Zone**. Der bestehende DNS-Anbieter kann weiter genutzt werden.
3. Die bestehenden Einträge für den E-Mail-Empfang und Mailauthentifizierung bei Infomaniak beibehalten. Das betrifft insbesondere MX der Hauptdomain sowie dortige SPF-, DKIM- und DMARC-Einträge. Vor und nach dem Web-DNS-Wechsel den Empfang im Infomaniak-Postfach mit einer kontrollierten Testmail prüfen.
4. In Netlify DNS-Verifizierung und HTTPS prüfen. Die Hauptdomain und `www` im Browser aufrufen und die Ziel-URL kontrollieren.

[Netlify-Vorgaben für externes DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/)

## 4. Kostenloses Cloudflare-Turnstile-Widget anlegen

1. Im Cloudflare-Dashboard **Turnstile → Add widget** wählen und dem Widget einen Namen geben, etwa «Novyra Kontaktformular».
2. `novyradigital.ch` und den tatsächlichen, in Netlify angezeigten Testhost hinzufügen. Hostnamen ohne Schema, Pfad oder Platzhalter eingeben. `www.novyradigital.ch` hinzufügen, falls die Seite dort eigenständig ausgeliefert wird.
3. Als Modus **Managed** wählen. **Pre-clearance** ausgeschaltet lassen. Das Widget erfordert keine Umstellung des DNS zu Cloudflare.
4. Den öffentlichen Site Key und den Secret Key unter den unten genannten Variablennamen in Netlify hinterlegen.
5. Nach dem neuen Build das Widget auf beiden freigegebenen Hostnamen prüfen. Das Formular erneuert ein bereits verwendetes Token. Bei einem Lade- oder Widgetfehler kann die Prüfung neu gestartet werden.

[Cloudflare-Anleitung zum Widget](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/)

## 5. Resend-Absenderdomain verifizieren

1. In Resend unter **Domains → Add Domain** die Versand-Subdomain `mail.novyradigital.ch` anlegen. Die im Dashboard gewählte Region bestimmt den Versandweg. Resend weist die Speicherung von Nachrichteninhalten und Zustellprotokollen in den USA separat aus.
2. Die für diese Domain generierten DNS-Einträge aus Resend in die zuständige DNS-Zone übertragen. Für den Versand zeigt das Dashboard DKIM sowie SPF und je nach Konfiguration einen MX-Eintrag für die Return-Path-Subdomain an. Für jeden Eintrag Typ, vollständigen Namen, Wert und bei MX die Priorität genau übernehmen. DNS-Oberflächen können den Zonennamen automatisch anhängen.
3. Die konkreten Werte sind erst nach Anlegen der Domain in Resend bekannt. Einträge für Resend gehören zu den von Resend angegebenen Namen unterhalb der Versand-Subdomain. Die MX-Einträge und der SPF-Eintrag der Hauptdomain bleiben für Infomaniak reserviert. Die Resend-Funktion für eingehende E-Mails ist für dieses Projekt nicht erforderlich.
4. In Resend **Verify DNS Records** wählen und auf **Verified** warten. Erst dann den vorgeschlagenen Absender `Novyra Digital <website@mail.novyradigital.ch>` produktiv setzen.
5. Unter **API Keys → Create API Key** einen Schlüssel mit **Sending access** für die verifizierte Domain erstellen und direkt als geheimen Wert in Netlify hinterlegen. In den Domain-Einstellungen die Tracking-Optionen für Öffnungen und Klicks ausgeschaltet lassen.

[Resend-Dokumentation zur Domainverifizierung](https://resend.com/docs/dashboard/domains/introduction) · [Datenbearbeitung bei Resend](https://resend.com/security/gdpr)

## 6. Umgebungsvariablen in Netlify setzen

In **Project configuration → Environment variables** jede Variable für den vorgesehenen Deploy-Kontext hinterlegen. Für den produktiven Build die folgenden Werte im Kontext **Production** setzen. Falls der Netlify-Tarif keine getrennten Scopes anbietet, die Zugriffsmöglichkeiten im Projekt prüfen und die Serverwerte weiterhin nur über die dort angegebenen Namen verwenden.

| Variable | Scope | Wert |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Builds | Öffentlicher Site Key vom Cloudflare-Widget |
| `TURNSTILE_SECRET_KEY` | Functions | Privater Secret Key vom selben Widget, als geheim markieren |
| `RESEND_API_KEY` | Functions | Privater Schlüssel mit Sending access, als geheim markieren |
| `MAIL_TO` | Functions | `info@novyradigital.ch` |
| `MAIL_FROM` | Functions | `Novyra Digital <website@mail.novyradigital.ch>` nach Verifizierung, im Dashboard ohne Anführungszeichen |
| `SEND_CONFIRMATION_EMAIL` | Functions | `true` aktiviert die Bestätigung, `false` oder leer lässt sie aus |

Nach dem Hinterlegen einen neuen Build in Netlify auslösen. Der öffentliche Site Key wird beim Build eingebunden. Die Function liest ihre Variablen zur Laufzeit. `.env.example` enthält keine Zugangsdaten. Lokale `.env`-Dateien gehören nicht ins Repository.

[Netlify-Variablen für Builds und Functions](https://docs.netlify.com/build/environment-variables/overview/)

## 7. Formular nach dem Deployment prüfen

1. Die Netlify-Testdomain und nach dem DNS-Wechsel `https://novyradigital.ch/#kontakt` im Browser öffnen. Eine mobile Ansicht prüfen. Über den Footer Impressum und Datenschutz aufrufen und den E-Mail-Link kontrollieren.
2. Ohne Site Key muss das Formular deaktiviert sein und die Kontaktadresse anzeigen. Mit Schlüssel muss das Widget beim Erreichen des Kontaktbereichs laden. Ein Ladefehler muss einen erneuten Start ermöglichen.
3. Eine leere oder ungültige Anfrage prüfen. Mit gültigen Feldern und abgeschlossener Sicherheitsprüfung eine synthetische Testanfrage mit eigener E-Mail-Adresse abschicken. Die Website darf nach erfolgreicher Annahme durch Resend «Anfrage gesendet» anzeigen.
4. Im Postfach bei Infomaniak die Anfrage mit allen angegebenen Feldern prüfen. **Antworten** muss die Adresse aus dem Formular verwenden. In Resend den Zustellstatus der Nachricht kontrollieren. Bei `SEND_CONFIRMATION_EMAIL=true` auch die Bestätigung im Testpostfach prüfen.
5. In einem separaten Testkontext prüfen, dass ein fehlender oder ungültiger Turnstile-Schlüssel und ein fehlgeschlagener Resend-Versand keine erfolgreiche Übermittlung anzeigen. In den Netlify-Logs stehen technische Fehler ohne Formularinhalte. Die konfigurierte Netlify-Ratenbegrenzung gilt für `/api/contact` je IP und Domain. Ihr Verhalten auf dem realen Projekt lässt sich erst nach einem Deploy prüfen.

## 8. Offene rechtliche und betriebliche Prüfpunkte

- **Impressum:** Rechtsform, UID, Handelsregistereintrag, MWST-Registrierung sowie gegebenenfalls abweichende Vertretungsangaben und eine geschäftliche Telefonnummer sind unbestätigt. Klären, welche Angaben im konkreten Fall veröffentlicht werden müssen. Prüfen, ob der tatsächliche Vertriebsablauf als elektronischer Geschäftsverkehr nach Art. 3 Abs. 1 lit. s UWG gilt und dadurch neben der Anbieterkennzeichnung weitere Pflichten auslöst. Der vorhandene Kontaktbereich erfasst Anfragen. [SECO zum Onlinehandel](https://www.seco.admin.ch/de/onlinehandel)
- **Datenschutz:** Für Netlify, Cloudflare, Resend und Infomaniak die tatsächlichen Bearbeitungsländer, Unterauftragnehmer, Log- und Löschfristen sowie Vertragsbedingungen und Transfergarantien im jeweiligen Konto klären. Die Länder und gegebenenfalls die Garantien vor Inbetriebnahme in der Datenschutzerklärung konkretisieren. Interne Aufbewahrung und Löschung von Anfragen im Infomaniak-Postfach festlegen. [EDÖB zu Auslandbekanntgaben](https://www.edoeb.admin.ch/de/bekanntgabe-von-personendaten-ins-ausland)
- **Betriebseinstellungen:** Im veröffentlichten Projekt tatsächliche Netzwerkzugriffe und Cookies prüfen, insbesondere Turnstile mit ausgeschalteter Pre-clearance. In Netlify prüfen, dass keine zusätzlichen Analyse-, Besucherzugriffs- oder Skripteinstellungen die Aussagen der Datenschutzerklärung verändern. In Resend die Tracking-Einstellungen und Löschoptionen prüfen.
- **DSGVO:** Den tatsächlichen EU-/EWR-Bezug prüfen, insbesondere Niederlassung, gezieltes Anbieten von Leistungen an Personen in der EU oder Beobachtung ihres Verhaltens. Bei Anwendbarkeit die zusätzlichen Angaben zu Rechtsgrundlagen, Rechten, Aufsicht und gegebenenfalls Vertretung ergänzen. [EDÖB zur DSGVO und zur Schweiz](https://www.edoeb.admin.ch/de/faq-datenschutz)

Der Abhängigkeits-Audit meldet Befunde in der vorhandenen Vitest-Testumgebung. Das empfohlene Major-Upgrade der Testwerkzeuge steht separat aus.

Firmendaten werden zentral in `src/config/site.ts` gepflegt. Eine abschliessende juristische Prüfung steht aus.
