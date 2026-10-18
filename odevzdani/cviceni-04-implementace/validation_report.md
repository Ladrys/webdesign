# Ověření Prague Pulse Fest — tmavá revize / srpen 2027

## Výsledek

**339 browserových kontrol prošlo** a **74 kontrol prezentací a interaktivního prototypu prošlo**. Samostatný anglický průchod ověřil deset stránek, všechny tři články a nákup s promo kódem i PDF. Audit chybějících překladů byl prázdný. Datové validace a syntax všech dotčených skriptů prošly.

## Web a nákup

- Tmavé rozhraní a všechny obsahové stránky v šířkách 320–1920 px, včetně vyplněného košíku, účtu a článku bez horizontálního přetékání. Hlavička má plnou šířku a drží logo, navigaci, hledání i CZ/EN v jednom řádku při 1024/1280/1366 px v obou jazycích. Logo a úvod neobsahují zvukové sloupce ani video.
- Původní Prague Pulse Fest, 1.–3. srpna 2027. XML, JSON a přibalená data mají 3 dny, 3 scény, 60 skutečných interpretů a 60 konzistentních programových položek. Headline jsou David Guetta, Katy Perry a Skrillex; jde o navržený line-up fiktivního festivalu bez potvrzené účasti. Noisia je označený archivní poslechový blok.
- Skutečný místní úvodní obrázek Výstaviště má 1600 × 900 px. Fotografie Bengta Nymana pochází z roku 2018, CC BY 2.0; není vydávaná za stav po rekonstrukci 2026. U 41 interpretů jsou licencované skutečné fotografie, zbývajících 19 má vlastní typografické plakáty. Ověřené metadata zdrojů, autorů, licencí a úprav jsou v `PHOTO-CREDITS.md`, `photo-credits.json` a viditelné části Info → Vizuály. Browser ověřil lokální načtení hlavní trojice a přístupnost autorství/zdroje/licence; všechny obrazové soubory prošly samostatnou kontrolou dekódování a rozměrů.
- Odpočet „Festival startuje za“ správně rozkládá čas a rozlišuje začátek/konec, průběh a neplatný vstup bez záporných hodnot. Na úvodu jsou tři ceny a popisy balíčků s funkčními odkazy do nákupu. Tři novinky mají vlastní články, lokalizaci, bezpečný neznámý identifikátor a propojení s obsahem.
- Contains hledání v datech i novinkách, normalizace diakritiky a velikosti písmen, bezpečné zacházení s HTML dotazem, filtry, detaily a trvalé oblíbené. Program je chronologicky seřazený podle dne a času a seskupený po dnech. CZ/EN zachovává interní hodnoty filtrů, názvy umělců i osobní údaje.
- Na nové instalaci jsou všechna místa volná. Jednodenní objednávka blokuje místo v daném dni, třídenní sedadlo i stání všechny tři. Rychlý nákup 1–8 osob přiděluje jen volná místa, respektuje košík i obsazenost a při nedostatečné kapacitě nevytvoří částečný výběr. Kontrola dostupnosti a případných duplicit se opakuje při dokončení.
- Ceny vycházejí z XML: třídenní VIP 1590 / Regular 990 / stání 490 Kč, jednodenní 590 / 390 / 190 Kč. Konečná cena obsahuje poplatky objednávky, které jsou 0 Kč. Proma PULSE10 odečítají 10 %, PRAHA200 odečítají 200 Kč nejvýše do výše součtu. Testy ověřily normalizaci kódu, chybný/nepotvrzený kód, změnu položek, obnovení stránky, opětovný výpočet a manipulaci s uloženou slevou. Součet nikdy není záporný.
- Checkout má jméno, příjmení, e-mail a telefon s kontrolou vstupů. Karta, převod, hotovost, Apple Pay, Google Pay, Benefit Plus a faktura jsou označené simulace, bez údajů skutečné karty nebo napojení na poskytovatele. Formulář, metoda, souhlas a promo přežijí odebrání položky; změněný košík v jiné kartě vyžaduje novou kontrolu. Zkušební zamítnutí zachová výběr.
- Guest i account nákup, převzetí košíku a promo při přihlášení, historie, nesprávné heslo, odhlášení a sedmidenní přihlášení včetně nového otevření a expirace prošly. Heslo je solený PBKDF2 hash. Starší objednávky bez edition zachovávají rok 2026 v historii i PDF a neblokují místa 2027.
- PDF je skutečný dokument se stránkou pro každou vstupenku, českým osobním jménem, ID, kategorií, místem, hrubou cenou vstupenky, ročníkem a rozpisem součtu/slevy/celku objednávky. QR byly skutečně dekódované pomocí zxing-cpp. V anglickém průchodu 2 VIP mají 3180 Kč před slevou, PULSE10 odečte 318 Kč a celek je 2862 Kč; anglické PDF zachová osobní jméno a správné popisky.
- V účtu ani dokončené objednávce nejsou tisk, zálohy ani import. Sociální odkazy mají pět přístupně pojmenovaných SVG ikon.
- Soukromí nabízí přijmout vše / pouze nezbytné / nastavení. Odmítnutí brání požadavkům na Google Maps, přijetí mapu automaticky vloží i při dalších návštěvách a odvolání iframe odstraní. Souhlas přetrvá a je přeložený. Žádná analytika není nasazená.
- Žádné JavaScriptové runtime chyby. Obsah, objednávka, fotografie a tvorba PDF fungují bez externích požadavků. Podmíněné vložení mapy se správnou URL bylo ověřené lokální testovací odpovědí; test netvrdí síťovou dostupnost Googlu v každém prohlížeči.

## Data a podklady

XML je validní proti XSD, všech sedm XSLT transformací souhlasí s JSON výstupy i schématy. `data.xml` a `data/festival.xml` jsou stejné, `web/js/data.js` je reprodukovatelný. Kontrola zahrnuje všech deset HTML stránek, metadata, strukturu dokumentu, unikátní ID a místní závislosti.

Pět prezentací 02–06 má po šesti PDF stránkách a editovatelných PPTX snímcích s poznámkami řečníka. Ověřena integrita PPTX, texty a identita Pulse/2027. Prototyp má filtry dne/scény, uložený program, 60 interpretů, detail a vazbu na koncert; prošel ve 320/768/1440 px bez runtime chyb. Záznam 74 kontrol je v `course-source/prototype-validation.md`.

Podklady jsou dodatečné rekonstrukce milníků, nikoli důkaz minulých odevzdání. Cvičení 06 zůstává metodickou šablonou, protože přidělený cizí projekt nebyl dodán. Přijaté review ani cizí nálezy nejsou vymyšlené.

## Online zdroje a omezení

Dne 18. 10. 2026 byly skutečně načtené a přečtené Google Search Central SEO Starter Guide, AI features and your website a W3C WAI Page Structure Tutorial. Konkrétní použití titulků, popisů, interních odkazů, textového obsahu, pravdivých strukturovaných dat a logické struktury je v dokumentaci. Nejde o externí SEO audit ani záruku indexace či doporučení AI vyhledávači. Dodané HTML Rock for People sloužilo jako strukturální reference; jeho skripty se nespouštěly a cizí značka/obrazové podklady se nepřebíraly.

Po původní proxy blokaci se přístup k veřejným obrazovým zdrojům podařilo obnovit; fotografie byly získané z doložených zdrojů a licencí. Google obrázky sloužily k dohledání, nikoli jako licence. Limit API 429 byl respektovaný. U nedoložených fotografií jsou originální plakáty místo neověřených snímků.

Přímé `file://` otevření blokuje spravovaná politika Chromium (`ERR_BLOCKED_BY_ADMINISTRATOR`); test je **přeskočený**, nikoli úspěšný. Web nevyžaduje runtime server. Funkční testy používají pouze dočasný statický server. Neproběhl kompletní WCAG AA audit se čtečkou, úplná HTML Living Standard validace, fyzický telefon/Safari/Firefox ani ruční kontrola v desktopovém PowerPointu/LibreOffice.

Klientská verze nemá serverovou autentizaci, sdílené rezervace, skutečné platby ani automatický e-mail. Úložiště patří danému prohlížeči; aplikace nepřepisuje automaticky soubor JSON. Tým musí doplnit skutečné review, spolupráci a návaznost redesignu na schválené výstupy.

## Reprodukce

```sh
python validate_project.py
node --check web/js/app.js
node --check web/js/i18n.js
node --check web/js/design.js
node --check web/js/site-shell.js
node --check web/js/performer-art.js
node --check web/js/artist-copy.js
node --check web/js/news.js
node --check web/js/privacy.js
node --check web/js/ticket-pdf.js
python tests/browser_smoke.py
python tests/course_materials.py --folder odevzdani
```

Testy spouštějí a ukončují vlastní statický server. Vývojové knihovny nejsou potřeba pro otevření webu. Volitelné zxing-cpp a NumPy pro QR byly v této relaci dostupné přes `PYTHONPATH=/tmp/pulse-dark-test-deps`.

## Záznam 339 browserových kontrol

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
PASS The homepage hero uses a loaded landscape venue image with sufficient resolution
PASS The venue hero is stored locally and has descriptive alternative text
PASS The homepage has no video controls or decorative sound bars
PASS The countdown clearly says when the festival starts
PASS The homepage highlights its three selected headliners
PASS The homepage removes the generic slogans requested by the user
PASS The homepage presents all three full-festival ticket categories
PASS Homepage three-day prices are clearly visible and match the data catalogue
PASS Each homepage ticket action preserves its category and three-day validity
PASS The larger all-artists action does not acquire a second underline on hover
PASS The homepage presents three current-news cards
PASS Every news card links to its own article
PASS The page background remains dark below the hero
PASS Brand, navigation, search and language switch share one row at 1024px in en
PASS The header spans the device width at 1024px in en
PASS Header ticket button stays compact at 1024px in en
PASS Laptop header fits 1024px in en
PASS Brand, navigation, search and language switch share one row at 1024px in cs
PASS The header spans the device width at 1024px in cs
PASS Header ticket button stays compact at 1024px in cs
PASS Laptop header fits 1024px in cs
PASS Brand, navigation, search and language switch share one row at 1280px in en
PASS The header spans the device width at 1280px in en
PASS Header ticket button stays compact at 1280px in en
PASS Laptop header fits 1280px in en
PASS Brand, navigation, search and language switch share one row at 1280px in cs
PASS The header spans the device width at 1280px in cs
PASS Header ticket button stays compact at 1280px in cs
PASS Laptop header fits 1280px in cs
PASS Brand, navigation, search and language switch share one row at 1366px in en
PASS The header spans the device width at 1366px in en
PASS Header ticket button stays compact at 1366px in en
PASS Laptop header fits 1366px in en
PASS Brand, navigation, search and language switch share one row at 1366px in cs
PASS The header spans the device width at 1366px in cs
PASS Header ticket button stays compact at 1366px in cs
PASS Laptop header fits 1366px in cs
PASS Footer includes five recognizable vector social icons
PASS Social icon links expose accessible platform names
PASS No horizontal overflow at 320px: index.html
PASS No horizontal overflow at 320px: program.html
PASS No horizontal overflow at 320px: performers.html
PASS No horizontal overflow at 320px: venues.html
PASS No horizontal overflow at 320px: info.html
PASS No horizontal overflow at 320px: search.html?q=David%20Guetta
PASS No horizontal overflow at 320px: tickets.html
PASS No horizontal overflow at 320px: cart.html
PASS No horizontal overflow at 320px: account.html
PASS No horizontal overflow at 320px: news.html?id=vystaviste-tri-sceny
PASS No horizontal overflow at 375px: index.html
PASS No horizontal overflow at 375px: program.html
PASS No horizontal overflow at 375px: performers.html
PASS No horizontal overflow at 375px: venues.html
PASS No horizontal overflow at 375px: info.html
PASS No horizontal overflow at 375px: search.html?q=David%20Guetta
PASS No horizontal overflow at 375px: tickets.html
PASS No horizontal overflow at 375px: cart.html
PASS No horizontal overflow at 375px: account.html
PASS No horizontal overflow at 375px: news.html?id=vystaviste-tri-sceny
PASS No horizontal overflow at 430px: index.html
PASS No horizontal overflow at 430px: program.html
PASS No horizontal overflow at 430px: performers.html
PASS No horizontal overflow at 430px: venues.html
PASS No horizontal overflow at 430px: info.html
PASS No horizontal overflow at 430px: search.html?q=David%20Guetta
PASS No horizontal overflow at 430px: tickets.html
PASS No horizontal overflow at 430px: cart.html
PASS No horizontal overflow at 430px: account.html
PASS No horizontal overflow at 430px: news.html?id=vystaviste-tri-sceny
PASS No horizontal overflow at 768px: index.html
PASS No horizontal overflow at 768px: program.html
PASS No horizontal overflow at 768px: performers.html
PASS No horizontal overflow at 768px: venues.html
PASS No horizontal overflow at 768px: info.html
PASS No horizontal overflow at 768px: search.html?q=David%20Guetta
PASS No horizontal overflow at 768px: tickets.html
PASS No horizontal overflow at 768px: cart.html
PASS No horizontal overflow at 768px: account.html
PASS No horizontal overflow at 768px: news.html?id=vystaviste-tri-sceny
PASS No horizontal overflow at 1024px: index.html
PASS No horizontal overflow at 1024px: program.html
PASS No horizontal overflow at 1024px: performers.html
PASS No horizontal overflow at 1024px: venues.html
PASS No horizontal overflow at 1024px: info.html
PASS No horizontal overflow at 1024px: search.html?q=David%20Guetta
PASS No horizontal overflow at 1024px: tickets.html
PASS No horizontal overflow at 1024px: cart.html
PASS No horizontal overflow at 1024px: account.html
PASS No horizontal overflow at 1024px: news.html?id=vystaviste-tri-sceny
PASS No horizontal overflow at 1440px: index.html
PASS No horizontal overflow at 1440px: program.html
PASS No horizontal overflow at 1440px: performers.html
PASS No horizontal overflow at 1440px: venues.html
PASS No horizontal overflow at 1440px: info.html
PASS No horizontal overflow at 1440px: search.html?q=David%20Guetta
PASS No horizontal overflow at 1440px: tickets.html
PASS No horizontal overflow at 1440px: cart.html
PASS No horizontal overflow at 1440px: account.html
PASS No horizontal overflow at 1440px: news.html?id=vystaviste-tri-sceny
PASS No horizontal overflow at 1920px: index.html
PASS No horizontal overflow at 1920px: program.html
PASS No horizontal overflow at 1920px: performers.html
PASS No horizontal overflow at 1920px: venues.html
PASS No horizontal overflow at 1920px: info.html
PASS No horizontal overflow at 1920px: search.html?q=David%20Guetta
PASS No horizontal overflow at 1920px: tickets.html
PASS No horizontal overflow at 1920px: cart.html
PASS No horizontal overflow at 1920px: account.html
PASS No horizontal overflow at 1920px: news.html?id=vystaviste-tri-sceny
PASS News article loads its own title and full content: news.html?id=vystaviste-tri-sceny
PASS News article loads its own title and full content: news.html?id=tri-dny-jedna-vstupenka
PASS News article loads its own title and full content: news.html?id=do-holesovic-bez-auta
PASS The three news links open distinct articles
PASS An unknown or malicious news ID renders a safe fallback without injecting markup
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
PASS English preference persists: search.html?q=David%20Guetta
PASS English navigation is translated: search.html?q=David%20Guetta
PASS English metadata retains the identity: search.html?q=David%20Guetta
PASS English preference persists: tickets.html
PASS English navigation is translated: tickets.html
PASS English metadata retains the identity: tickets.html
PASS English preference persists: cart.html
PASS English navigation is translated: cart.html
PASS English metadata retains the identity: cart.html
PASS English preference persists: account.html
PASS English navigation is translated: account.html
PASS English metadata retains the identity: account.html
PASS English preference persists: news.html?id=vystaviste-tri-sceny
PASS English navigation is translated: news.html?id=vystaviste-tri-sceny
PASS English metadata retains the identity: news.html?id=vystaviste-tri-sceny
PASS Practical information has English content
PASS Artist detail is translated into English
PASS Switching back to Czech retains original genre values
PASS Contains search matches an artist name substring regardless of case
PASS Contains search includes the selected artist's programme entries
PASS Search treats markup as text
PASS Search includes practical information
PASS Search ignores Czech diacritics
PASS All 60 performers load
PASS All 60 performer cards have distinct local artwork
PASS Headliner i1 uses a decoded, sufficiently sized local artist photograph
PASS Headliner i2 uses a decoded, sufficiently sized local artist photograph
PASS Headliner i3 uses a decoded, sufficiently sized local artist photograph
PASS The last performer is searchable
PASS Artist detail opens
PASS Artist detail closes with Escape
PASS All 60 events load
PASS The full programme is ordered chronologically across all three days
PASS Day filtering preserves chronological programme order
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
PASS PDF page 1 includes the ticket base price
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
PASS PDF page 2 includes the ticket base price
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
PASS A homepage VIP purchase preselects the full-festival category in the order flow
PASS The group selector rejects quantities above eight without adding partial tickets
PASS Quick purchase assigns distinct free VIP places for both people on all three days
PASS Checkout initially totals both catalogue prices without additional fees
PASS Invalid promo input leaves the total unchanged: NOTVALID
PASS Invalid promo input leaves the total unchanged: __proto__
PASS Invalid promo input leaves the total unchanged: <img src=x onerror=alert(1)>
PASS Promo input cannot inject executable markup
PASS An invalid promo code cannot be submitted as a discounted order
PASS A typed known promotion must be applied before the order can be completed
PASS The percentage promotion normalizes case and whitespace and applies exactly ten percent
PASS Removing a ticket recalculates the applied promotion and preserves contact details
PASS An applied known promotion survives reload and is recalculated from the cart
PASS Tampered stored promotion amounts cannot override the catalogue calculation
PASS A stale or unknown stored promotion is ignored instead of restoring a fabricated discount
PASS The fixed promotion subtracts exactly 200 Kč
PASS Checkout offers all seven requested simulated payment methods
PASS A malformed phone number cannot complete or consume the selected ticket
PASS The payment action displays the selected method and final discounted amount
PASS The completed order records the full contact details and simulated payment method
PASS The order records gross ticket prices separately from the discount and final total
PASS Download is a genuine PDF document
PASS PDF has one page per ticket
PASS PDF page 1 includes the order ID
PASS PDF page 1 preserves the Czech buyer name
PASS PDF page 1 includes the correct place
PASS PDF page 1 includes the category
PASS PDF page 1 uses the Prague Pulse Fest identity
PASS PDF page 1 includes the three-day validity
PASS PDF page 1 includes the ticket base price
PASS PDF page 1 includes the order subtotal, discount and final total
PASS PDF page 1 uses a landscape layout
PASS PDF page 1 contains typography
PASS PDF page 1 contains vector QR modules
PASS PDF page 1 contains one readable QR code
PASS PDF page 1 QR contains the correct ticket identifier
PASS Group purchase excludes a seat occupied by an earlier full-festival order
PASS A second group purchase avoids seats already present in the same cart
PASS One-day purchase links preselect the requested category and festival day
PASS The maximum group size allocates eight distinct standing places for the selected day
PASS Insufficient group capacity adds no partial selection or duplicate seats
PASS A fixed promotion is capped at the cart subtotal and never creates a negative charge
PASS Promotions, contact validation and group purchases produce no runtime errors
PASS The venue photograph exposes its author, source and licence links in practical information
PASS Photo attribution for David Guetta exposes both a source and a licence link
PASS Photo attribution for Katy Perry exposes both a source and a licence link
PASS Photo attribution for Skrillex exposes both a source and a licence link
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
PASS Reduced-motion visitors receive the same static venue hero without autoplay
PASS Malformed local account storage does not break the homepage
SKIP file:// blocked by browser policy ERR_BLOCKED_BY_ADMINISTRATOR; static HTTP checks passed
```
