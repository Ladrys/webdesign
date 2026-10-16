# Prague Rocks Festival

Responzivní festivalový web v češtině i angličtině. **Bez instalace, serveru, Node.js a buildu.**

## Spuštění a stažení

Na GitHubu zvolte **Code → Download ZIP**, celý archiv rozbalte a otevřete **`web/index.html`**. Při otevření z disku používá navigace stejný soubor s parametrem `page`, aby se účty a košík uchovávaly pod stejnou adresou. JavaScript a místní úložiště musejí být povolené.

Celou složku `web/` můžete sdílet samostatně. Všechny fonty, obrázky, krátké video a PDF knihovny jsou přibalené. Volitelná Google mapa se načte až po kliknutí; web bez ní funguje offline.

## Co je nové

- Prague Rocks Festival: vlastní logo a asymetrická identita, datum vedle loga, výrazná navigace, kulaté vyhledávání, CZ/EN a vícesloupcový footer.
- Přepnutí jazyka překládá obsahové stránky, filtry, formuláře, detaily, stavy i PDF a zachovává se po znovuotevření.
- Lokální tiché video v úvodu s pauzou a respektováním omezeného pohybu; jde o animovaný originální AI vizuál, nikoli převzatý koncertní záznam.
- 60 různých AI portrétů přiřazených stabilně k XML ID interpretů, se zachovanými iniciálami.
- 3 dny, 3 scény a 60 vystoupení, filtry programu, oblíbené, detaily a contains hledání.
- Třídenní VIP **1 590 Kč**, Regular **990 Kč**, stání **490 Kč**. Jednodenní VIP **590 Kč**, Regular **390 Kč**, stání **190 Kč**. Ceny a popisy jsou ve zdrojovém XML.
- Všechny pozice jsou na nové instalaci volné. Třídenní balíček vyžaduje stejné místo volné ve všech dnech; objednávka je obsadí pro celou dobu.
- Košík, objednávka hosta i účtu, historie a skutečně vytvářené PDF s českými znaky a QR identifikátorem.
- Účty přetrvávají po zavření webu, přihlášení platí sedm dnů. JSON zálohu účtů a objednávek lze stáhnout a načíst na jiném zařízení.
- Praktické informace, reálná lokalita Výstaviště Praha, mapa na vyžádání, doprava, parking, ubytování, soukromí a podmínky.

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

Jde o fiktivní festival. **Platba je zkušební, e-mail se automaticky neodesílá a PDF není skutečnou vstupenkou.** Účty, objednávky a dostupnost jsou uložené v tomto prohlížeči, nikoli sdílené mezi návštěvníky. Heslo se ukládá jako solený PBKDF2 hash. Lokální účet není bezpečná serverová autentizace. Kontaktní doména a telefon jsou pouze ilustrativní, nejsou ověřeným kontaktem pořadatele.

JSON export je skutečný soubor, který uživatel stáhne; import obnoví data bez duplicit. Web soubor na disku sám průběžně nepřepisuje. Bez serveru nebo ručního oprávnění prohlížeče k souboru to není možné. Obnovení z exportu nepřenáší aktivní přihlášení — k účtu se přihlásíte znovu.

## Vývojové ověření a obnova podkladů

```sh
python validate_project.py
node --check web/js/app.js
node --check web/js/i18n.js
node --check web/js/backup.js
node --check web/js/ticket-pdf.js
python tests/browser_smoke.py
python tests/course_materials.py --folder odevzdani
```

Browserové testy si spouštějí a ukončují vlastní dočasný statický server. Tyto vývojové nástroje (Python Playwright, Chromium, PyMuPDF; pro datový validátor lxml/PyYAML/jsonschema; pro kontrolu prezentací python-pptx) nejsou potřeba pro otevření webu. Ve spravovaném testovacím prohlížeči blokuje politika přímé `file://`; tato kontrola se výslovně označuje jako přeskočená.

Volitelný `python tools/generate_data.py` obnoví přibalená webová data po změně XML/JSON zdrojů. `python tools/build_course_submissions.py --include-web` znovu sestaví složky odevzdání a PPTX/PDF z `course-source/` (vývojově potřebuje python-pptx a ReportLab). Tyto skripty se při běžném spuštění nespouštějí. Původní složka `API/` obsahuje datové transformace a schémata, nikoli běžící rozhraní.

Podrobnosti a limity: `documentation.md`, výsledky: `validation_report.md`. Původ grafiky: `web/images/ROCKS-ASSETS.md` a `web/images/performers/README.md`. Náhledy jsou v `preview/`.
