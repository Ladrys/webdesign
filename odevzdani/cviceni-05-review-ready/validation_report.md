# Ověření Prague Pulse Fest — 19. října 2026

Záznam pro verzi **1.1.0**: samostatné scény, společný vstup, plné koncertní sety a sjednocené školní podklady. Jde o konkrétní místní kontroly, nikoli externí cross-review nebo úplný audit WCAG.

| Ověření | Výsledek |
| --- | --- |
| `python validate_project.py` | Prošlo: XML/XSD, 7 XSLT a JSON schémat, OpenAPI, 13 HTML vstupů, reprodukovatelnost dat, reference, kapacity, ceny a časový plán |
| `python tests/browser_smoke.py` s QR dekodérem | **567 kontrol prošlo**, včetně skutečně stažených PDF a dekódování QR |
| `python tests/course_materials.py --folder odevzdani` | **155 kontrol prošlo**: 5 prezentací × 6 snímků, PPTX/PDF, poznámky, autoři, prototyp, manifest, kopie webu a čtyřsouborový ZIP |
| Responzivní rozložení | **224 kombinací prošlo** bez přetékání a chyb JavaScriptu: 13 stránek × 8 šířek × CZ/EN a dalších 16 pohledů výběru scén |
| Anglické rozhraní | **17 pohledů prošlo**: 13 HTML vstupů, tři samostatné scény a osobní program s kolizí; žádný chybějící překlad ani chyba JavaScriptu |
| Doplňková dokumentace PDF | 12 stran; všechny textové bloky uvnitř stran, vizuálně zkontrolovaný export |
| Syntax `web/js/*.js` a `git diff --check` | Prošlo |
| Přímé otevření `file://` v místním řízeném Chromium | **Přeskočeno:** politika `ERR_BLOCKED_BY_ADMINISTRATOR`; nepočítá se jako úspěšná kontrola |

Browserový průchod běžel s `numpy` a `zxing-cpp`; QR se skutečně načetly z rasterizovaných PDF. Testy používají dočasný vývojový statický server. Ten není součástí požadavků na spuštění hotového webu. GitHub Actions má vlastní výsledek pro konkrétní commit v historii workflow.

## Program a data

- Zachováno 3 dny, 3 scény, 60 jedinečných interpretů a 60 vystoupení; každý interpret právě jednou, 20 vystoupení denně a 20 na scénu.
- Běžné sety trvají 60 minut, závěrečný koncert Main Hall 90 minut. Stejná scéna má nejméně 30 minut na technickou přestavbu.
- Devět závěrečných koncertů je označeno v XML i exportu: každý den River 18:30–19:30, Club 20:00–21:00 a Main Hall 21:30–23:00. Půlhodinové přesuny byly ověřené; ostatní scény mohou hrát souběžně.
- Osobní program označí skutečně se překrývající vybrané sety. Uložení všech devíti závěrečných koncertů kolizi nevyvolá. Koncert končící přesně při začátku dalšího není časový překryv.
- XML, odvozené JSON a přibalené `data.js` souhlasí. Kořenové kopie XML/XSD souhlasí se zdroji v `data/`.

## Vstupenky a dostupnost

- Main Hall má celkovou kapacitu 5 000: 16 VIP a 32 Regular sedadel, 4 952 stání. River má 3 000 stání, Club 1 500 stání. Jsou to návrhové kapacity fiktivního festivalu.
- Samostatné ceny scén i původní společné tarify jsou ověřené pro jeden, dva a tři dny. River a Club nemohou nabídnout sedadlo. Společný VIP/Regular vstup má sedadlo pouze v Main Hall.
- Společný vstup započítá návštěvníka do každé zahrnuté scény v každém platném dni. Samostatný vstup spotřebuje jen svou kapacitu. Zakoupené sedadlo Main Hall je stejné pro oba rozsahy vstupu.
- Poslední volná kapacita Club Stage dovolí zvolit libovolné volné sedadlo Main Hall, například A8, ale nepovolí druhý společný vstup. Vyprodaný Club neblokuje dosud volný samostatný River.
- Stání používá denní počty. Regrese s různými interními čísly v prvním a třetím dni zachová poslední dostupnou dvoudenní vstupenku. Při přihlášení se dva samostatné výběry na stání nesloučí do jedné osoby.
- Závěrečná kontrola pod místním Web Lock znovu čte objednávky, ceny a kapacitu. Prověřené změny v druhé kartě a zastaralý formulář nevedou k přeprodeji. Web Locks zlepšuje souběh karet stejného původu; bez jeho podpory zůstává opakovaná místní kontrola, nikoli serverová garance.
- Ověřený limit 264 vstupenek: přidání 265. je odmítnuto; upravený nadlimitní košík se nesmaže a lze ho opravit odebráním položky.
- Chybná scéna, kategorie, cena, počet dnů a neplatné číslo jsou odmítnuté. Starší záznam bez scény znamená společný vstup, objednávka bez ročníku zachovává 2026 a neblokuje kapacitu 2027.

## Zachované průchody

Plná sada znovu prověřila hledání typu contains, normalizaci diakritiky, detaily a filtry, oblíbené, účet a PBKDF2, profil, sedmidenní expiraci, košík hosta i účtu, promo kódy, zahrnutou 12% modelovou DPH, kemp, chybná uložená data, sedm simulovaných metod a PDF. Souhlas s externí mapou se ukládá na 180 dnů; odmítnutí zabrání vložení Google iframe, odvolání ho odstraní. Aplikace sama HTTP cookies nevytváří.

PDF správně uvádí scénu nebo společný vstup, přesná data, sedadlo u sedících kategorií, cenu a číslo objednávky. `preview/vstupenky-jedna-scena.pdf` má dvě River vstupenky a jednu Club vstupenku na první den, celkem 310 Kč. `preview/vstupenky-ukazka.pdf` ukazuje vstupenku na stání s promem PRAHA200 a stan pro dvě osoby: vstupenka po slevě 0 Kč + kemp 650 Kč. Kontakty jsou smyšlené testovací údaje.

## Podklady a dohledatelnost

- `review/browser-validation-2026-10-19.json`: jednotlivé assertions, čas a SHA-256 stromu webu.
- `review/layout-validation-2026-10-19.json`: naměřené šířky a pohledy.
- `review/language-validation-2026-10-19.json`: výsledek anglických pohledů.
- `odevzdani/manifest.json`: SHA-256 všech exportovaných souborů.
- `odevzdani/cviceni-02-k-odevzdani.zip`: právě specifikace, XML, XSD a jedna PPTX prezentace; žádné samostatné poznámky ani duplicitní PDF.
- `preview/home.png`, `web-desktop.png`, `web-mobile.png`: nové snímky skutečně spuštěného webu. Vizuálně zkontrolované C02 a informační architektura, exportované prezentace mají kontrolované hranice textu a shodu PDF/PPTX.

## Limity odevzdání

Nebylo doplněno vymyšlené cross-review, historie spolupráce ani schválení změn proti prvním milníkům. Tým musí dodat skutečné podklady pro cvičení 6 a finální dokumentaci. Zadání uvádí čtyřčlenný tým, uživatel zadal tři uvedené autory. Požadavek na výhradně AI vizuály se liší od výslovného přání použít skutečné fotografie; rozdíl je zaznamenaný ve specifikaci a dokumentaci.

Neproběhl úplný externí audit WCAG AA, validace všech vykreslených HTML stavů ani testování na fyzických telefonech a ve všech prohlížečích. Licencované fotografie a historický snímek nedokládají rezervaci areálu nebo účast interpretů. Dvě fotografie CC BY-NC-SA omezují obrazovou sadu na nekomerční školní použití.

Účty a obsazenost zůstávají v prohlížeči, platby jsou simulované, e-mail se neodesílá. Změna katalogových cen v budoucnu vyžaduje samostatné ověření historických objednávek. Modelová DPH není právní potvrzení sazby pro rok 2027.
