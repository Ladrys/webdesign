# Ověření Prague Rocks Festival — aktuální revize

## Výsledek

**203 browserových kontrol prošlo**, dále **74 kontrol prezentací a interaktivního prototypu** a samostatný anglický průchod objednávkou a PDF. Datové validace a syntaktické kontroly prošly. Přímý `file://` přístup blokuje spravovaná politika Chromium; je zaznamenán jako přeskočený, nikoli úspěšný.

## Web

- Devět stránek, sedm šířek 320–1920 px; samostatně vyplněný košík i účet bez horizontálního přetékání.
- Video je skutečný přibalený WebM, dekóduje se, lze jej pozastavit/přehrát a omezený pohyb zastaví automatické přehrání. MP4 alternativa je přibalená pro ostatní podporované přehrávače, ale test prokázal přímo WebM v Chromium.
- Všechny stránky mají CZ/EN, preference přetrvává, žánrový filtr po překladu zachová interní hodnoty; detail je také přeložený.
- Globální contains hledání, bezpečné zacházení s HTML dotazem, ignorování diakritiky, všech60interpretů a60programových položek.
- 60 odlišných kombinací portrétu/pozice; při hledání se zachová totožnost interpreta.
- Na nové instalaci je všech48sedadel a40míst ke stání volných. Třídenní balíček obsadí stejnou pozici ve všech dnech, jednodenní a třídenní výběr si nemohou rezervovat stejnou pozici v překrývajících se dnech.
- Ceny třídenní VIP1590/Regular990/stání490 a součet3070Kč; jednodenní VIP590/Regular390/stání190 odvozené ze stejného modelu.
- Objednávka hosta i účtu, zamítnutá platba, zachování formuláře při odebrání, převzetí košíku při registraci, historie, nesprávné heslo a odhlášení.
- Sedmidenní přihlášení přežije nové otevření, vypršení přihlášení je ověřené. Heslo je uložené jako solený PBKDF2 hash.
- Skutečný JSON export neobsahuje otevřené heslo. Import v novém prohlížeči obnoví účty/objednávky/obsazenost; původním heslem se lze přihlásit. Opakovaný import neduplikuje a neplatná záloha nenahradí data.
- Skutečné PDF má správný počet stran, česká jména, ID, kategorii, místo, třídenní rozsah a čitelné QR identifikátory. Samostatně ověřena anglická objednávka a anglické PDF, audit chybějících překladů v tomto průchodu byl prázdný.
- Žádné JavaScriptové runtime chyby a žádná externí síťová závislost při obsahu, objednávce nebo tvorbě PDF.
- Google Maps se nevkládá před kliknutím. Vložení správné URL po souhlasu bylo ověřeno s lokální odpovědí testovacího serveru, nikoli skutečný síťový přístup do Google.

## Prezentace a prototyp

Pět prezentací02–06 má po šesti stránkách v PDF a šesti editovatelných snímcích v PPTX, skutečné poznámky řečníka a samostatný text poznámek. Ověřena čitelnost PDF, integrita ZIP struktury PPTX, vložené fonty a programová kontrola rozměrů textových boxů. Titulní i obsahový snímek byly vizuálně prohlédnuté.

Prototyp cvičení03 má skutečně funkční filtry dne/scény, uložený program s persistencí, všech60interpretů, dialog s vazbou na program a textové hledání. Ověřen ve320/768/1440px, bez runtime chyb. Jde o samostatný nově sestavený wireframe, ne tvrzení o doložené historii.

## Rozsah a omezení

Neproběhl kompletní audit WCAG AA se čtečkou, validátor HTML Living Standard, test fyzického telefonu/Safari/Firefox ani externí SEO audit. Síť neumožnila načíst referenční Rock for People a primární SEO/WAI stránky; tyto návštěvy nejsou vydávány za úspěšnou online rešerši. PPTX je validně vytvořen a znovu otevřen knihovnou python-pptx; nebyl zde ručně otevřen v desktopovém PowerPointu/LibreOffice.

Testy neprokazují produkční autentizaci, skutečné platby ani odeslání e-mailu, protože takové funkce nejsou součástí zvolené klientské verze. Obsazenost je lokální. JSON soubor uživatel ručně exportuje/importuje, aplikace na disk automaticky nezapisuje.

Skutečné přijaté review, posudek přiděleného cizího projektu, jména týmu a schválený rozsah změn nebyly dodány. Prezentace06 a review.md jsou označené šablony pro doplnění; není to dokončené hodnocení cizího projektu.

## Reprodukce

```sh
python validate_project.py
python tests/browser_smoke.py
python tests/course_materials.py --folder odevzdani
```

Vývojové nástroje jsou popsané v README. Browser test vytváří a zastavuje vlastní dočasný statický server. Volitelné dekódování QR používá zxing-cpp a NumPy, v této relaci pod `/tmp/prague-rocks-test-deps`; jinak se doplňkové QR dekódovací kontroly výslovně vynechají. Pro otevření webu není žádná z těchto závislostí nutná.

## Záznam webových kontrol

```text
PASS Homepage initializes
PASS Homepage avoids the error fallback
PASS Page metadata uses the new festival name
PASS Header search uses a vector icon
PASS Hero references the local WebM film
PASS Hero includes an MP4 fallback source
PASS Hero video decodes in Chromium
PASS Hero video can be paused
PASS Hero video can resume
PASS No horizontal overflow at 320px: index.html
PASS No horizontal overflow at 320px: program.html
PASS No horizontal overflow at 320px: performers.html
PASS No horizontal overflow at 320px: venues.html
PASS No horizontal overflow at 320px: info.html
PASS No horizontal overflow at 320px: search.html?q=Neon
PASS No horizontal overflow at 320px: tickets.html
PASS No horizontal overflow at 320px: cart.html
PASS No horizontal overflow at 320px: account.html
PASS No horizontal overflow at 375px: index.html
PASS No horizontal overflow at 375px: program.html
PASS No horizontal overflow at 375px: performers.html
PASS No horizontal overflow at 375px: venues.html
PASS No horizontal overflow at 375px: info.html
PASS No horizontal overflow at 375px: search.html?q=Neon
PASS No horizontal overflow at 375px: tickets.html
PASS No horizontal overflow at 375px: cart.html
PASS No horizontal overflow at 375px: account.html
PASS No horizontal overflow at 430px: index.html
PASS No horizontal overflow at 430px: program.html
PASS No horizontal overflow at 430px: performers.html
PASS No horizontal overflow at 430px: venues.html
PASS No horizontal overflow at 430px: info.html
PASS No horizontal overflow at 430px: search.html?q=Neon
PASS No horizontal overflow at 430px: tickets.html
PASS No horizontal overflow at 430px: cart.html
PASS No horizontal overflow at 430px: account.html
PASS No horizontal overflow at 768px: index.html
PASS No horizontal overflow at 768px: program.html
PASS No horizontal overflow at 768px: performers.html
PASS No horizontal overflow at 768px: venues.html
PASS No horizontal overflow at 768px: info.html
PASS No horizontal overflow at 768px: search.html?q=Neon
PASS No horizontal overflow at 768px: tickets.html
PASS No horizontal overflow at 768px: cart.html
PASS No horizontal overflow at 768px: account.html
PASS No horizontal overflow at 1024px: index.html
PASS No horizontal overflow at 1024px: program.html
PASS No horizontal overflow at 1024px: performers.html
PASS No horizontal overflow at 1024px: venues.html
PASS No horizontal overflow at 1024px: info.html
PASS No horizontal overflow at 1024px: search.html?q=Neon
PASS No horizontal overflow at 1024px: tickets.html
PASS No horizontal overflow at 1024px: cart.html
PASS No horizontal overflow at 1024px: account.html
PASS No horizontal overflow at 1440px: index.html
PASS No horizontal overflow at 1440px: program.html
PASS No horizontal overflow at 1440px: performers.html
PASS No horizontal overflow at 1440px: venues.html
PASS No horizontal overflow at 1440px: info.html
PASS No horizontal overflow at 1440px: search.html?q=Neon
PASS No horizontal overflow at 1440px: tickets.html
PASS No horizontal overflow at 1440px: cart.html
PASS No horizontal overflow at 1440px: account.html
PASS No horizontal overflow at 1920px: index.html
PASS No horizontal overflow at 1920px: program.html
PASS No horizontal overflow at 1920px: performers.html
PASS No horizontal overflow at 1920px: venues.html
PASS No horizontal overflow at 1920px: info.html
PASS No horizontal overflow at 1920px: search.html?q=Neon
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
PASS English preference persists: search.html?q=Neon
PASS English navigation is translated: search.html?q=Neon
PASS English metadata retains the identity: search.html?q=Neon
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
PASS Contains search covers 12 artists plus 13 events
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
PASS All 48 seats start available
PASS Seat map exposes all 48 seats
PASS All 40 standing places start available
PASS Space selects a focused seat
PASS Seat selection retains keyboard focus
PASS Space deselects a focused seat
PASS Three-day VIP, Regular and standing total 3070 Kč
PASS Cart counter updates
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
PASS A three-day purchase stores validity for all three dates
PASS Ticket download uses the PDF extension
PASS Download is a genuine PDF document
PASS PDF has one page per ticket
PASS PDF page 1 includes the order ID
PASS PDF page 1 preserves the Czech buyer name
PASS PDF page 1 includes the correct place
PASS PDF page 1 includes the category
PASS PDF page 1 uses the festival identity
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
PASS PDF page 2 uses the festival identity
PASS PDF page 2 includes the three-day validity
PASS PDF page 2 uses a landscape layout
PASS PDF page 2 contains typography
PASS PDF page 2 contains vector QR modules
PASS PDF page 2 contains one readable QR code
PASS PDF page 2 QR contains the correct ticket identifier
PASS Three-day purchase reserves the same seat on d1
PASS Unpurchased seats stay available on d1
PASS Three-day purchase reserves the same seat on d2
PASS Unpurchased seats stay available on d2
PASS Three-day purchase reserves the same seat on d3
PASS Unpurchased seats stay available on d3
PASS Guest cart transfers after registration
PASS Account email is prefilled
PASS Registered checkout succeeds
PASS A single-day booking blocks an overlapping full pass
PASS A single-day booking leaves other days available
PASS A single-day booking reserves its selected day
PASS Account history shows only that account's orders
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
PASS JSON export contains hashed account data and no plaintext password
PASS JSON import restores account and guest orders in a fresh browser
PASS The imported account can log in with its original password
PASS JSON import restores three-day seat occupancy
PASS Importing the same backup does not duplicate orders
PASS Invalid backup cannot replace existing orders
PASS Mobile menu opens
PASS Mobile menu exposes its expanded state
PASS Mobile navigation reaches the program
PASS A changed local cart requires review before checkout
PASS Cart review rerenders the new selection and preserves form state
PASS Checkout rechecks local seat availability
PASS No JavaScript runtime errors: []
PASS All assets, purchases and PDF generation work without external network requests
PASS Google Maps is not embedded before explicit loading
PASS Google Maps loads after the map button is activated
PASS Reduced motion disables automatic video playback
PASS Malformed local account storage does not break the homepage
SKIP file:// blocked by browser policy ERR_BLOCKED_BY_ADMINISTRATOR; static HTTP checks passed

203 checks passed. Artifacts: /tmp/prague-rocks-checks

```

## Samostatný anglický průchod

```text
Untranslated text audit: []
PASS English checkout, PDF labels, three-day validity and personal name
PDF missing phrase audit: []
```

## Záznam prezentačních a prototypových kontrol

```text
PASS cviceni-02-specifikace: six PDF pages and editable PPTX slides
PASS cviceni-02-specifikace: slide1 text and presenter notes
PASS cviceni-02-specifikace: slide2 text and presenter notes
PASS cviceni-02-specifikace: slide3 text and presenter notes
PASS cviceni-02-specifikace: slide4 text and presenter notes
PASS cviceni-02-specifikace: slide5 text and presenter notes
PASS cviceni-02-specifikace: slide6 text and presenter notes
PASS cviceni-02-specifikace: festival identity
PASS cviceni-02-specifikace: separate presenter notes
PASS cviceni-02-specifikace: PowerPoint archive integrity
PASS cviceni-03-prototyp: six PDF pages and editable PPTX slides
PASS cviceni-03-prototyp: slide1 text and presenter notes
PASS cviceni-03-prototyp: slide2 text and presenter notes
PASS cviceni-03-prototyp: slide3 text and presenter notes
PASS cviceni-03-prototyp: slide4 text and presenter notes
PASS cviceni-03-prototyp: slide5 text and presenter notes
PASS cviceni-03-prototyp: slide6 text and presenter notes
PASS cviceni-03-prototyp: festival identity
PASS cviceni-03-prototyp: separate presenter notes
PASS cviceni-03-prototyp: PowerPoint archive integrity
PASS cviceni-04-implementace: six PDF pages and editable PPTX slides
PASS cviceni-04-implementace: slide1 text and presenter notes
PASS cviceni-04-implementace: slide2 text and presenter notes
PASS cviceni-04-implementace: slide3 text and presenter notes
PASS cviceni-04-implementace: slide4 text and presenter notes
PASS cviceni-04-implementace: slide5 text and presenter notes
PASS cviceni-04-implementace: slide6 text and presenter notes
PASS cviceni-04-implementace: festival identity
PASS cviceni-04-implementace: separate presenter notes
PASS cviceni-04-implementace: PowerPoint archive integrity
PASS cviceni-05-review-ready: six PDF pages and editable PPTX slides
PASS cviceni-05-review-ready: slide1 text and presenter notes
PASS cviceni-05-review-ready: slide2 text and presenter notes
PASS cviceni-05-review-ready: slide3 text and presenter notes
PASS cviceni-05-review-ready: slide4 text and presenter notes
PASS cviceni-05-review-ready: slide5 text and presenter notes
PASS cviceni-05-review-ready: slide6 text and presenter notes
PASS cviceni-05-review-ready: festival identity
PASS cviceni-05-review-ready: separate presenter notes
PASS cviceni-05-review-ready: PowerPoint archive integrity
PASS cviceni-06-cross-review: six PDF pages and editable PPTX slides
PASS cviceni-06-cross-review: slide1 text and presenter notes
PASS cviceni-06-cross-review: slide2 text and presenter notes
PASS cviceni-06-cross-review: slide3 text and presenter notes
PASS cviceni-06-cross-review: slide4 text and presenter notes
PASS cviceni-06-cross-review: slide5 text and presenter notes
PASS cviceni-06-cross-review: slide6 text and presenter notes
PASS cviceni-06-cross-review: festival identity
PASS cviceni-06-cross-review: separate presenter notes
PASS cviceni-06-cross-review: PowerPoint archive integrity
PASS Prototype fits320px/home
PASS Prototype fits320px/program
PASS Prototype fits320px/performers
PASS Prototype fits320px/venues
PASS Prototype fits320px/info
PASS Prototype fits768px/home
PASS Prototype fits768px/program
PASS Prototype fits768px/performers
PASS Prototype fits768px/venues
PASS Prototype fits768px/info
PASS Prototype fits1440px/home
PASS Prototype fits1440px/program
PASS Prototype fits1440px/performers
PASS Prototype fits1440px/venues
PASS Prototype fits1440px/info
PASS Prototype loads60program items
PASS Prototype combines day and stage filters
PASS Prototype scenarioS1 saved program
PASS Prototype favorites persist after reload
PASS Prototype loads60artists
PASS Prototype scenarioS2 artist detail opens
PASS Prototype artist links to related shows
PASS Prototype search treats markup as text
PASS Prototype has no runtime errors
74 course/prototype checks passed.
```
