# Prague Pulse Fest

Responzivní festivalový web v češtině i angličtině. **Bez instalace, serveru, Node.js a buildu.**

## Spuštění a stažení

Na GitHubu zvolte **Code → Download ZIP**, celý archiv rozbalte a otevřete **`web/index.html`**. Při otevření z disku používá navigace stejný soubor s parametrem `page`, aby se účty a košík uchovávaly pod stejnou adresou. JavaScript a místní úložiště musejí být povolené.

Celou složku `web/` můžete sdílet samostatně. Fonty, fotografie, typografické plakáty a PDF knihovny jsou přibalené. Google mapa se po souhlasu s externími mapami načítá automaticky; web bez ní funguje offline.

## Co je nové

- Prague Pulse Fest, **1.–3. srpna 2027**: vlastní typografické logo, tmavá hlavička přes celou šířku, odpočet, kompaktní navigace a kulaté hledání v jednom řádku na notebooku, CZ/EN a vícesloupcový footer s ikonami sociálních sítí.
- Přepnutí jazyka překládá obsahové stránky, filtry, formuláře, detaily, stavy i PDF a zachovává se po znovuotevření.
- Skutečná fotografie Průmyslového paláce z roku 2018 (Bengt Nyman, CC BY 2.0) s viditelným datem; aktuální úvod nepřehrává video a fotografie nepředstírá stav areálu pro rok 2027.
- Navržený line-up 60 skutečných interpretů (např. David Guetta, Katy Perry, Skrillex a DARKZY), 41 skutečných licencovaných fotografií, 19 typografických náhrad a biografické medailonky z XML. Účast není potvrzená; Noisia je zastoupena archivním poslechovým blokem, nikoli živým koncertem.
- 3 dny, 3 scény a 60 programových položek, filtry programu, oblíbené, detaily a contains hledání.
- Třídenní VIP **1 590 Kč**, Regular **990 Kč**, stání **490 Kč**. Jednodenní VIP **590 Kč**, Regular **390 Kč**, stání **190 Kč**. Konečné ceny včetně poplatků a popisy jsou ve zdrojovém XML.
- Všechny pozice jsou na nové instalaci volné. Třídenní balíček vyžaduje stejné místo volné ve všech dnech; objednávka je obsadí pro celou dobu.
- Rychlý nákup 1–8 vstupenek podle kategorie a dne či celého festivalu, interaktivní místa, košík, objednávka hosta i účtu a historie.
- Dokončení má jméno, příjmení, e-mail a telefon, promo kódy `PULSE10` (10 %) a `PRAHA200` (200 Kč) a sedm zkušebních platebních metod. PDF zachovává rozpis ceny a slevy.
- Tři novinky mají vlastní články a přehled na úvodní stránce.
- Účty a objednávky přetrvávají po zavření webu ve stejném prohlížeči; přihlášení platí sedm dnů. Historie zachová ročník starší objednávky, která neobsadí místa pro rok 2027.
- Praktické informace, reálná lokalita Výstaviště Praha, automatická mapa po souhlasu, doprava, parking, ubytování, soukromí a podmínky.
- Panel soukromí: nezbytné místní ukládání a samostatná volba externích map; bez analytiky a reklamního sledování.

## Moodle a prezentace

Hotové složky najdete v **[`odevzdani/`](odevzdani/README.md)**:

| Cvičení | Co je přiloženo |
| --- | --- |
| 02 | `project-specification.md`, `data.xml`, PPTX, PDF, poznámky k prezentaci |
| 03 | Samostatný spustitelný interaktivní prototyp, `progress-02.md`, PPTX/PDF/poznámky |
| 04 | Web, `progress-03.md`, dokumentace, PPTX/PDF/poznámky |
| 05 | Review-ready web, specifikace, data, `progress-04.md`, PPTX/PDF/poznámky |
| 06 | Metodická šablona `review.md` a prezentace; skutečný přidělený cizí projekt je nutné doplnit |
| Finální projekt | Povinná struktura `projekt/` včetně webu, prototypu, XML, dokumentace a review |

Prezentace 02–05 mají šest snímků pro přibližně čtyři minuty, editovatelný text a poznámky řečníka. Prezentace 06 je jasně označená příprava metodiky. Podklady jsou dodatečně sestavené podle požadavků, nejsou dokladem minulého odevzdání. Jména týmu, skutečné přijaté review, časovou osu a schválení rozsahu změn doplňuje tým.

## Hranice klientské verze

Jde o fiktivní festival s navrženým line-upem skutečných interpretů; jejich účast není potvrzená. **Platba je zkušební, e-mail se automaticky neodesílá a PDF není skutečnou vstupenkou.** Účty, objednávky a dostupnost jsou uložené v tomto prohlížeči, nikoli sdílené mezi návštěvníky. Heslo se ukládá jako solený PBKDF2 hash. Lokální účet není bezpečná serverová autentizace. Kontaktní doména a telefon jsou pouze ilustrativní, nejsou ověřeným kontaktem pořadatele.

Web automaticky nepřepisuje soubory na disku. Data ukládá do `localStorage`; odstranění dat prohlížeče smaže i místní účty a objednávky. Souhlas s externí mapou lze kdykoli změnit odkazem v patičce. Volba soukromí má platnost 180 dnů; nemění nezbytné ukládání účtu nebo košíku.

## Vývojové ověření a obnova podkladů

```sh
python validate_project.py
node --check web/js/app.js
node --check web/js/i18n.js
node --check web/js/privacy.js
node --check web/js/design.js
node --check web/js/site-shell.js
node --check web/js/news.js
node --check web/js/ticket-pdf.js
python tests/browser_smoke.py
python tests/course_materials.py --folder odevzdani
```

Browserové testy si spouštějí a ukončují vlastní dočasný statický server. Tyto vývojové nástroje (Python Playwright, Chromium, PyMuPDF; pro datový validátor lxml/PyYAML/jsonschema; pro kontrolu prezentací python-pptx) nejsou potřeba pro otevření webu. Ve spravovaném testovacím prohlížeči blokuje politika přímé `file://`; tato kontrola se výslovně označuje jako přeskočená.

Volitelný `python tools/generate_data.py` obnoví přibalená webová data po změně XML/JSON zdrojů. `python tools/build_course_submissions.py --include-web` znovu sestaví složky odevzdání a PPTX/PDF z `course-source/` (vývojově potřebuje python-pptx a ReportLab). Tyto skripty se při běžném spuštění nespouštějí. Původní složka `API/` obsahuje datové transformace a schémata, nikoli běžící rozhraní.

Podrobnosti a limity: `documentation.md`, výsledky: `validation_report.md`. Zdroje, autoři a licence aktuálních fotografií i původ typografických plakátů: `web/images/PHOTO-CREDITS.md`. Starší nepoužívané AI video a portréty dokumentují `web/images/ROCKS-ASSETS.md` a `web/images/performers/README.md`. Náhledy jsou v `preview/`.
