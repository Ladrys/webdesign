# Ověření Prague Pulse Fest — 18. října 2026

Tento záznam se vztahuje k revizi podle hlasové zpětné vazby zadavatele: původní název Prague Pulse Fest, 1.–3. srpna 2027, čistě klientský web. Není přijatým cross-review jiného týmu ani úplným auditem WCAG.

| Ověření | Výsledek |
| --- | --- |
| `python validate_project.py` | Prošlo: XML/XSD, minimum 3 dnů / 3 scén / 60 interpretů / 60 akcí, 7 transformací a JSON schémat, OpenAPI, 13 HTML stránek a reprodukovatelnost `data.js` |
| `python tests/browser_smoke.py` | 486 kontrol prošlo; skutečné akce v Chromium, vytváření a čtení PDF včetně dekódování QR |
| `python tests/course_materials.py --folder odevzdani` | 74 kontrol prošlo; 5 prezentací, 30 snímků, jejich PDF a interaktivní scénáře prototypu |
| Samostatná kontrola rozložení | 182 kombinací: 13 stránek × 7 šířek × CZ/EN; bez horizontálního přetékání a chyb JavaScriptu |
| Samostatná anglická kontrola | 13 stránek, 3 články a detail interpreta; seznam chybějících překladů prázdný |
| Syntax všech `web/js/*.js` a `git diff --check` | Prošlo |
| Obrazové podklady | 46 fotografických souborů dekódováno; 42 fotografií interpretů, 3 fotografie novinek a historický úvod. U zbývajících 18 interpretů správně pojmenované typografické plakáty |
| Přímé otevření `file://` v řízeném Chromium | **Přeskočeno:** politika tohoto cloudového prohlížeče přístup blokuje; neoznačeno jako úspěšný test |

Podrobný seznam browserových kontrol je v `review/browser-validation-2026-10-18.json`. Výsledky se nepřenášejí automaticky na budoucí změny.

## Co se skutečně ověřovalo

- **Rozhraní:** šířky 320, 375, 430, 768, 1024, 1440 a 1920 px. Kompaktní hlavička navíc při 1024, 1280 a 1366 px v obou jazycích. Vyplněný košík se stáním i kempováním při 320 px. Stav odpočtu před festivalem, během něj, po skončení i při neplatném datu.
- **Obsah a fotografie:** původní název a datum, skutečná místní fotografie Výstaviště z roku 2018, nové koncertní fotografie Guetty, Katy Perry a Skrillexe se zachovaným obsahem bez ořezu. Dostupné autorství, licence a zdroje na samostatné stránce. Novinky používají skutečné fotografie a vysvětlují historický snímek náramku i stav rekonstrukce.
- **Program:** všech 60 jedinečných jmen a 60 akcí, 20 akcí na každé scéně, žádná časová kolize na stejné scéně. Chronologické pořadí, denní a scénové filtry, oblíbené a jejich trvalost. Hlavní mezinárodní jména v Main Hall, česká scéna na River Stage a klubová hudba v Club Stage; Holy Priest a Skepsis na klubové scéně.
- **Vyhledávání:** skutečné hledání typu contains v datech včetně medailonků a návštěvnických informací, české i anglické texty, normalizace diakritiky, poslední interpret v seznamu. Dotaz David může najít i STEIN27 díky jménu David Stencel. Detail interpreta, odkazy na poslech a přechod k jeho vystoupení.
- **Plánek:** dostupný bez internetové mapy, ovládání přiblížení, reset, klávesnice a odkazy scén do programu. Popisky byly vizuálně zkontrolovány v CZ/EN. Jde o výslovně fiktivní orientační uspořádání, nikoli oficiální plán Výstaviště.
- **Výběr vstupenek:** všechny ceny pro 1/2/3 dny; VIP a Regular vyžadují konkrétní označená sedadla a správný počet osob. Stání přejde do košíku podle množství. Změna kategorie zruší neplatný výběr. Dva dny musí být přesně dvě různá platná data.
- **Dva nesousedící dny:** nákup na 1. a 3. srpna zachová přesná data v objednávce i PDF, obsadí sedadlo v obou zvolených dnech a sám nezablokuje 2. srpen. Neplatné dvoudenní položky se odmítnou.
- **Košík a platba:** zachování kontaktních údajů po odebrání položky, host i účet, sedm zřetelně simulovaných metod, odmítnutá platba, změna košíku a obsazení místa v jiné kartě. Dokončení znovu ověřuje aktuální ceny a dostupnost.
- **Promo a DPH:** PULSE10 a PRAHA200 včetně ořezu slevy na cenu vstupenek, změny a neplatného kódu. Sleva nezlevňuje kemp. Modelová 12% DPH je již v ceně; základ a daň se zaokrouhlují na haléře a dohromady dávají konečnou cenu.
- **Kemp:** stan 350 Kč nebo karavan 850 Kč plus 150 Kč za každou osobu na celý pobyt 1.–4. srpna. Limity osob, trvalost výběru, samostatný součet, kapacita a její opětovná kontrola. Staré objednávky ročníku 2026 nesnižují kapacitu ročníku 2027.
- **Poškozená uložená data:** neúplný kemp, nesprávný počet osob, datum, cena a počet parcel nevytvoří falešný poukaz ani neblokují kemp. Zakoupené koncertní vstupenky a jejich obsazenost zůstanou zachované. Neplatná daňová metadata nevytvoří nepravdivý rozpis ani NaN; platný kemp může zůstat zachovaný samostatně.
- **Účty:** jméno, příjmení, telefon, e-mail a potvrzení hesla; kontroly chybných vstupů. Solený PBKDF2 hash místo otevřeného hesla, přihlášení/odhlášení, sedmidenní expirace, editace profilu, převzetí košíku/proma/kempu hosta a předvyplnění objednávky. Zachované starší účty a historie 2026.
- **PDF:** skutečně stažené dokumenty, přesné dny, jméno, ID, kategorie, sedadlo, slevy a částky. Každá vstupenka má vlastní stránku; platný kemp přidává poukaz s počtem osob a pobytem. QR se dekóduje a porovnává s očekávaným identifikátorem. Starší PDF zachová ročník 2026.
- **Soukromí:** nabídka při první návštěvě, nezbytné úložiště, přijetí/odmítnutí externích map a opětovné otevření nastavení. Google iframe vznikne až po souhlasu, při jeho odvolání se odstraní. Offline plánek souhlas nevyžaduje.
- **Moodle:** pět PPTX se šesti editovatelnými snímky a poznámkami, shodné PDF, samostatné poznámky přednášejícího a funkční scénáře prototypu. Tři kopie současného webu mají všech 13 HTML stránek; soubory kontroluje SHA-256 manifest. Cvičení 06 zůstává jasně označenou šablonou.

## Ručně zkontrolované výstupy

`preview/web-desktop.png` a `preview/web-mobile.png` zachycují skutečně spuštěný web. `preview/vstupenky-ukazka.pdf` obsahuje dvě dvoudenní VIP vstupenky a kempovací poukaz se smyšlenými kontakty:

**2 × 1 180 − 236 (PULSE10) + 350 + 2 × 150 = 2 774 Kč.** Základ bez DPH 2 476,79 Kč a zahrnutá DPH 297,21 Kč. Zkontrolována byla koncertní stránka i poukaz, rozložení textu a čitelnost kódu.

Prezentace byly rovněž vizuálně zkontrolovány při exportu. Provedené opravy jsou popsané v `review/internal-review.md`; uživatelská zpětná vazba v `review/audio-requirements-2026-10-18.md`.

## Rozsah a limity

Testy běžely nad skutečným výsledným klientským webem přes dočasný vývojový statický server. Ten není součástí běhových požadavků odevzdání. Přímé otevření souboru je zamýšlený způsob spuštění; jeho kontrolu v tomto konkrétním řízeném Chromium blokuje politika, která nebyla obcházena.

Neproběhl úplný externí audit WCAG AA, test na fyzických telefonech, ve všech prohlížečích ani s reálnými návštěvníky. Uvedených 486 kontrol představuje konkrétní assertions, nikoli 486 nezávislých uživatelských studií. Externí Google služba a budoucí jízdní řády nejsou garantovány. Skutečné cross-review a údaje o spolupráci týmu musí dodat tým.

Účty a rezervace jsou místní, platby simulované a e-mail se neodesílá. Při budoucí změně katalogových cen je nutné zvlášť ověřit čtení historických objednávek; současné tarify se v této revizi nezměnily. Modelová DPH vychází z doloženého zdroje GFŘ pro rok 2024 a nepředstavuje právní potvrzení sazby v roce 2027.

Fotografie mají uvedené zdroje a licence. Dvě fotografie CC BY-NC-SA omezují aktuální obrazovou sadu na nekomerční školní použití. Historický úvod ani návrh scén nedokládají rezervaci prostor, partnerství Výstaviště nebo potvrzenou účast skutečných interpretů.
