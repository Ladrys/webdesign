# Ověření Prague Pulse Fest — ročník 2027

## Výsledek

**256 browserových kontrol prošlo**, dále **74 kontrol prezentací a interaktivního prototypu**. Samostatný anglický průchod ověřil všech devět stránek a objednávku s PDF; audit chybějících překladů byl prázdný. XML/XSD, sedm XSLT/JSON výstupů, JSON schémata, datová konzistence a syntax JavaScriptu prošly.

## Ověřený web

- Devět stránek bez horizontálního přetékání v šířkách 320–1920 px, také vyplněný košík a historie. Hlavička drží logo, navigaci, hledání i CZ/EN v jednom řádku při 1024/1280/1366 px v obou jazycích; tlačítko vstupenek je kompaktní.
- Původní Prague Pulse Fest, XML i odvozená data mají termín 1.–3. srpna 2027. Všech 60 interpretů má unikátní nové jméno při zachovaných ID a vazbách. Portréty mají 60 různých výřezů.
- Odpočet rozkládá zbývající čas, přesně rozlišuje začátek/konec, probíhající a skončený festival a neplatný vstup; neukazuje záporné hodnoty. Video WebM se v Chromium dekóduje, lze je zastavit a respektuje omezený pohyb; MP4 alternativa je přibalená.
- Contains hledání v datech, diakritika, bezpečné zacházení s HTML dotazem, filtry, detaily a trvalé oblíbené fungují. CZ/EN zachovává interní hodnoty filtrů a vlastní jména.
- Nový prohlížeč má volná všechna místa. Jednodenní rezervace blokuje vybraný den; třídenní sedadlo i stání všechny tři. Kontrola probíhá také při dokončení a při změně košíku v jiné kartě. Ceny a součty souhlasí s XML: třídenní VIP 1590 / Regular 990 / stání 490 Kč, jednodenní 590 / 390 / 190 Kč.
- Košík zachovává ikonu a počet položek, rozpracovaný formulář a odmítnutou platbu. Nákup hosta i účtu, převzetí košíku registrací, historie, nesprávné heslo, odhlášení a sedmidenní přihlášení včetně nového otevření a expirace prošly. Heslo je uložené jako solený PBKDF2 hash.
- Nové objednávky mají ročník 2027. Historická objednávka bez pole edition má v historii i PDF rok 2026 a neobsazuje stejnou pozici v roce 2027.
- Skutečně stažené PDF má stránku pro každou vstupenku, české osobní jméno, ID, správnou kategorii/místo/cenu/termín a čitelný QR identifikátor. QR byly dekódovány pomocí zxing-cpp. Anglické PDF samostatně zachovává jméno a ročník 2027.
- V účtu ani dokončené objednávce nejsou ovládací prvky tisku, zálohy nebo importu. Patička obsahuje pět přístupně pojmenovaných SVG sociálních ikon.
- První návštěva nabízí přijmout vše / pouze nezbytné / nastavení. Nezbytné ukládání zůstává zapnuté. Odmítnutí brání požadavkům na Google Maps; přijetí vkládá mapu automaticky i při dalších návštěvách, odvolání iframe odstraní. Nastavení se uchová a je přeložené. Žádná analytika není nasazená.
- Žádné JavaScriptové runtime chyby. Obsah, nákup i PDF fungují bez externích požadavků. Vložení mapy a správná URL jsou ověřené lokální testovací odpovědí, nikoli skutečným načtením Googlu.

## Prezentace a prototyp

Pět prezentací 02–06 má po šesti stránkách PDF a šesti editovatelných snímcích PPTX, poznámky řečníka a samostatný text poznámek. Kontrola znovu otevřela PPTX a PDF, ověřila text, identitu Pulse/2027, fonty, rozměry textových boxů a integritu ZIP. Prototyp má reálné filtry dne/scény, uložený program, 60 interpretů, detail a vazbu na koncert; prošel ve 320/768/1440 px bez runtime chyb. Podrobný záznam je v `course-source/prototype-validation.md`.

Podklady jsou dodatečné rekonstrukce milníků, nikoli důkaz minulých odevzdání. Cvičení 06 zůstává výslovně označenou metodickou šablonou, protože přidělený cizí projekt nebyl dodán. Nálezy ani přijaté cross-review nejsou vymyšlené.

## Omezení

Přímé `file://` otevření blokuje spravovaná politika Chromium (`ERR_BLOCKED_BY_ADMINISTRATOR`); test je **přeskočený**, nikoli úspěšný. Web je dodán bez povinného serveru a browserové průchody byly provedené přes dočasný statický server. Neproběhl kompletní WCAG AA audit se čtečkou, plná HTML Living Standard validace, fyzický telefon/Safari/Firefox ani externí SEO audit. PPTX zde nebyl ručně otevřen v desktopovém PowerPointu/LibreOffice.

Dodané HTML Rock for People bylo prohlédnuté jako strukturální reference; živý web ani jeho skripty nebyly spouštěné. Síť dříve odmítla externí referenční a SEO/WAI stránky, proto netvrdíme novou kompletní online rešerši.

Tato klientská verze nemá skutečnou serverovou autentizaci, sdílenou rezervaci, platbu ani automatický e-mail. Úložiště patří danému prohlížeči; aplikace nezapisuje automaticky do souboru JSON. Tým musí doplnit skutečné review, jména/spolupráci, časovou osu a návaznost redesignu na schválené první výstupy.

## Reprodukce

```sh
python validate_project.py
node --check web/js/app.js
node --check web/js/i18n.js
node --check web/js/design.js
node --check web/js/site-shell.js
node --check web/js/privacy.js
node --check web/js/ticket-pdf.js
python tests/browser_smoke.py
python tests/course_materials.py --folder odevzdani
```

Testy spouštějí a ukončují vlastní dočasný statický server. Vývojové knihovny nejsou potřeba pro spuštění webu. Volitelné zxing-cpp a NumPy pro dekódování QR byly v této relaci instalované mimo projekt v `/tmp/prague-pulse-test-deps`; pro jejich zapojení byl použit `PYTHONPATH=/tmp/prague-pulse-test-deps python tests/browser_smoke.py`.

## Záznam 256 browserových kontrol

```text
PASS Homepage initializes
PASS Homepage avoids the error fallback
PASS A first visit shows the cookie and storage banner
PASS The privacy banner offers accept, necessary-only and settings actions
PASS Necessary storage is explicitly always enabled
PASS External Google Maps starts disabled
PASS Necessary-only consent is saved and dismisses the banner
PASS Page metadata uses the original Prague Pulse Fest name
PASS All 60 performer names are unique
PASS Header search uses a vector icon
PASS Countdown decomposes time remaining into days, hours, minutes and seconds
PASS Countdown treats the full festival interval as live
PASS Countdown shows an ended state after the festival instead of negative numbers
PASS Countdown handles invalid dates without NaN or negative values
PASS Homepage renders a visible countdown or current festival status
PASS Hero references the local WebM film
PASS Hero includes an MP4 fallback source
PASS Hero video decodes in Chromium
PASS Hero video can be paused
PASS Hero video can resume
PASS Brand, navigation, search and language switch share one row at 1024px in en
PASS Header ticket button stays compact at 1024px in en
PASS Laptop header fits 1024px in en
PASS Brand, navigation, search and language switch share one row at 1024px in cs
PASS Header ticket button stays compact at 1024px in cs
PASS Laptop header fits 1024px in cs
PASS Brand, navigation, search and language switch share one row at 1280px in en
PASS Header ticket button stays compact at 1280px in en
PASS Laptop header fits 1280px in en
PASS Brand, navigation, search and language switch share one row at 1280px in cs
PASS Header ticket button stays compact at 1280px in cs
PASS Laptop header fits 1280px in cs
PASS Brand, navigation, search and language switch share one row at 1366px in en
PASS Header ticket button stays compact at 1366px in en
PASS Laptop header fits 1366px in en
PASS Brand, navigation, search and language switch share one row at 1366px in cs
PASS Header ticket button stays compact at 1366px in cs
PASS Laptop header fits 1366px in cs
PASS Footer includes five recognizable vector social icons
PASS Social icon links expose accessible platform names
PASS No horizontal overflow at 320px: index.html
PASS No horizontal overflow at 320px: program.html
PASS No horizontal overflow at 320px: performers.html
PASS No horizontal overflow at 320px: venues.html
PASS No horizontal overflow at 320px: info.html
PASS No horizontal overflow at 320px: search.html?q=Ada%20Morrow
PASS No horizontal overflow at 320px: tickets.html
PASS No horizontal overflow at 320px: cart.html
PASS No horizontal overflow at 320px: account.html
PASS No horizontal overflow at 375px: index.html
PASS No horizontal overflow at 375px: program.html
PASS No horizontal overflow at 375px: performers.html
PASS No horizontal overflow at 375px: venues.html
PASS No horizontal overflow at 375px: info.html
PASS No horizontal overflow at 375px: search.html?q=Ada%20Morrow
PASS No horizontal overflow at 375px: tickets.html
PASS No horizontal overflow at 375px: cart.html
PASS No horizontal overflow at 375px: account.html
PASS No horizontal overflow at 430px: index.html
PASS No horizontal overflow at 430px: program.html
PASS No horizontal overflow at 430px: performers.html
PASS No horizontal overflow at 430px: venues.html
PASS No horizontal overflow at 430px: info.html
PASS No horizontal overflow at 430px: search.html?q=Ada%20Morrow
PASS No horizontal overflow at 430px: tickets.html
PASS No horizontal overflow at 430px: cart.html
PASS No horizontal overflow at 430px: account.html
PASS No horizontal overflow at 768px: index.html
PASS No horizontal overflow at 768px: program.html
PASS No horizontal overflow at 768px: performers.html
PASS No horizontal overflow at 768px: venues.html
PASS No horizontal overflow at 768px: info.html
PASS No horizontal overflow at 768px: search.html?q=Ada%20Morrow
PASS No horizontal overflow at 768px: tickets.html
PASS No horizontal overflow at 768px: cart.html
PASS No horizontal overflow at 768px: account.html
PASS No horizontal overflow at 1024px: index.html
PASS No horizontal overflow at 1024px: program.html
PASS No horizontal overflow at 1024px: performers.html
PASS No horizontal overflow at 1024px: venues.html
PASS No horizontal overflow at 1024px: info.html
PASS No horizontal overflow at 1024px: search.html?q=Ada%20Morrow
PASS No horizontal overflow at 1024px: tickets.html
PASS No horizontal overflow at 1024px: cart.html
PASS No horizontal overflow at 1024px: account.html
PASS No horizontal overflow at 1440px: index.html
PASS No horizontal overflow at 1440px: program.html
PASS No horizontal overflow at 1440px: performers.html
PASS No horizontal overflow at 1440px: venues.html
PASS No horizontal overflow at 1440px: info.html
PASS No horizontal overflow at 1440px: search.html?q=Ada%20Morrow
PASS No horizontal overflow at 1440px: tickets.html
PASS No horizontal overflow at 1440px: cart.html
PASS No horizontal overflow at 1440px: account.html
PASS No horizontal overflow at 1920px: index.html
PASS No horizontal overflow at 1920px: program.html
PASS No horizontal overflow at 1920px: performers.html
PASS No horizontal overflow at 1920px: venues.html
PASS No horizontal overflow at 1920px: info.html
PASS No horizontal overflow at 1920px: search.html?q=Ada%20Morrow
PASS No horizontal overflow at 1920px: tickets.html
PASS No horizontal overflow at 1920px: cart.html
PASS No horizontal overflow at 1920px: account.html
PASS English translation preserves genre filter values
PASS Genre filtering works after language switching
PASS English preference persists: index.html
PASS English navigation is translated: index.html
PASS English metadata retains the identity: index.html
PASS English preference persists: program.html
PASS English navigation is translated: program.html
PASS English metadata retains the identity: program.html
PASS English preference persists: performers.html
PASS English navigation is translated: performers.html
PASS English metadata retains the identity: performers.html
PASS English preference persists: venues.html
PASS English navigation is translated: venues.html
PASS English metadata retains the identity: venues.html
PASS English preference persists: info.html
PASS English navigation is translated: info.html
PASS English metadata retains the identity: info.html
PASS English preference persists: search.html?q=Ada%20Morrow
PASS English navigation is translated: search.html?q=Ada%20Morrow
PASS English metadata retains the identity: search.html?q=Ada%20Morrow
PASS English preference persists: tickets.html
PASS English navigation is translated: tickets.html
PASS English metadata retains the identity: tickets.html
PASS English preference persists: cart.html
PASS English navigation is translated: cart.html
PASS English metadata retains the identity: cart.html
PASS English preference persists: account.html
PASS English navigation is translated: account.html
PASS English metadata retains the identity: account.html
PASS Practical information has English content
PASS Artist detail is translated into English
PASS Switching back to Czech retains original genre values
PASS Contains search matches an artist name substring regardless of case
PASS Contains search includes the selected artist's programme entries
PASS Search treats markup as text
PASS Search includes practical information
PASS Search ignores Czech diacritics
PASS All 60 performers load
PASS All 60 performer cards have distinct portrait selections
PASS The last performer is searchable
PASS Artist detail opens
PASS Artist detail closes with Escape
PASS All 60 events load
PASS Favorite toggle retains keyboard focus
PASS Favorites filter works
PASS Favorites survive reload
PASS The ticket selector links to the cart with a recognizable vector cart icon
PASS All 48 seats start available
PASS Seat map exposes all 48 seats
PASS All 40 standing places start available
PASS A new browser starts with every seat and standing place available on d2
PASS A new browser starts with every seat and standing place available on d3
PASS Space selects a focused seat
PASS Seat selection retains keyboard focus
PASS Space deselects a focused seat
PASS Three-day VIP, Regular and standing total 3070 Kč
PASS Cart counter updates
PASS Updating the cart counter preserves its navigation icon
PASS Filled checkout fits 320px
PASS Filled checkout fits 768px
PASS Filled checkout fits 1920px
PASS Cart survives navigation
PASS Removing a ticket rerenders the cart
PASS Removing a ticket preserves the entered buyer details
PASS Removing a ticket preserves consent and payment choice
PASS Declined simulated payment preserves the cart
PASS Guest checkout creates two tickets
PASS Guest email is retained
PASS New orders explicitly record the current festival edition
PASS A three-day purchase stores validity for all three dates
PASS Ticket download uses the PDF extension
PASS Download is a genuine PDF document
PASS PDF has one page per ticket
PASS PDF page 1 includes the order ID
PASS PDF page 1 preserves the Czech buyer name
PASS PDF page 1 includes the correct place
PASS PDF page 1 includes the category
PASS PDF page 1 uses the Prague Pulse Fest identity
PASS PDF page 1 includes the three-day validity
PASS PDF page 1 uses a landscape layout
PASS PDF page 1 contains typography
PASS PDF page 1 contains vector QR modules
PASS PDF page 1 contains one readable QR code
PASS PDF page 1 QR contains the correct ticket identifier
PASS PDF page 2 includes the order ID
PASS PDF page 2 preserves the Czech buyer name
PASS PDF page 2 includes the correct place
PASS PDF page 2 includes the category
PASS PDF page 2 uses the Prague Pulse Fest identity
PASS PDF page 2 includes the three-day validity
PASS PDF page 2 uses a landscape layout
PASS PDF page 2 contains typography
PASS PDF page 2 contains vector QR modules
PASS PDF page 2 contains one readable QR code
PASS PDF page 2 QR contains the correct ticket identifier
PASS Completed order offers PDF download without a print action
PASS Three-day purchase reserves the same seat on d1
PASS Unpurchased seats stay available on d1
PASS Three-day purchase also reserves its standing place on d1
PASS Three-day purchase reserves the same seat on d2
PASS Unpurchased seats stay available on d2
PASS Three-day purchase also reserves its standing place on d2
PASS Three-day purchase reserves the same seat on d3
PASS Unpurchased seats stay available on d3
PASS Three-day purchase also reserves its standing place on d3
PASS Guest cart transfers after registration
PASS Account email is prefilled
PASS Registered checkout succeeds
PASS A single-day booking blocks an overlapping full pass
PASS A single-day booking leaves other days available
PASS A single-day booking reserves its selected day
PASS Account history shows only that account's orders
PASS Account history has no JSON backup, import or print controls
PASS A legacy order without an edition remains visible in account history
PASS A legacy order PDF keeps its original 2026 validity
PASS A legacy 2026 order does not reserve the same seat for the current edition on d1
PASS A legacy 2026 order does not reserve the same seat for the current edition on d2
PASS A legacy 2026 order does not reserve the same seat for the current edition on d3
PASS Populated account history fits 320px
PASS Populated account history fits 768px
PASS Populated account history fits 1920px
PASS Login persists for seven days
PASS Login survives opening a new browser tab
PASS Login survives closing and reopening the browser context
PASS An expired seven-day login requires authentication
PASS Logout removes the persistent login
PASS Wrong password is rejected
PASS Login restores order history
PASS Account stores a salted PBKDF2 hash rather than the password
PASS Signing in again does not restore removed backup or print controls
PASS Mobile menu opens
PASS Mobile menu exposes its expanded state
PASS Mobile navigation reaches the program
PASS A changed local cart requires review before checkout
PASS Cart review rerenders the new selection and preserves form state
PASS Checkout rechecks local seat availability
PASS No JavaScript runtime errors: []
PASS All assets, purchases and PDF generation work without external network requests
PASS Rejecting optional storage keeps Google Maps unembedded
PASS Map has no extra manual loading step
PASS Rejecting external maps prevents all third-party map requests
PASS The saved privacy decision survives navigation
PASS A fresh information-page visit waits for a privacy decision before contacting Google
PASS Accepting all immediately loads the Google Maps iframe
PASS Accepted maps load automatically on later visits without another loading button
PASS Privacy settings reflect the saved map consent
PASS Revoking external-map consent unloads the iframe immediately
PASS Revoked consent prevents map requests on subsequent visits
PASS Privacy settings and map permission are translated into English
PASS Privacy settings, consent and map updates produce no JavaScript errors
PASS The banner necessary-only action rejects external maps directly
PASS Reduced motion disables automatic video playback
PASS Malformed local account storage does not break the homepage
SKIP file:// blocked by browser policy ERR_BLOCKED_BY_ADMINISTRATOR; static HTTP checks passed
```
