# Prague Pulse Fest — dokumentace projektu

**Předmět:** Webdesign · **Akademický rok:** 2026/2027
**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek
**Stav dokumentace:** 19. října 2026

## 1. Popis a rozsah projektu

Prague Pulse Fest je fiktivní městský hudební festival pro 1.–3. srpna 2027.
Web propojuje program, účinkující, scény, vyhledávání a praktické informace.
Navazuje na původní projekt Značkovací jazyky a jeho XML datový základ.
Výstup pro Webdesign tvoří čistě klientský web a podklady ke cvičením.

| Oblast | Současné řešení |
| --- | --- |
| Festival | První ročník, 3 dny, modelový areál Vltava Park u Výstaviště Praha |
| Data | 3 scény, 60 účinkujících, 60 vystoupení |
| Obsah webu | 13 HTML vstupů, detaily interpretů a vystoupení, 3 články |
| Jazyky | Čeština a angličtina |
| Běh aplikace | HTML, CSS a JavaScript přímo v prohlížeči |
| Ukládání | Místní `localStorage` stejného prohlížeče |
| Objednávka | Všechny scény / jedna scéna, 1/2/3 dny, sedadla nebo stání, kemp, promo, PDF |

Výstaviště a uvedení interpreti existují, festival a jejich účast jsou návrhem.
Kontakty nejsou ověřenými kontakty reálného pořadatele. Web neprovádí skutečnou
platbu, automatické odesílání e-mailu ani sdílenou rezervaci.

![Úvodní stránka spuštěného webu — navigace a hlavní informace.](preview/home.png)

## 2. Požadavky a místo řešení

| Požadavek Webdesignu | Místo řešení | Způsob kontroly |
| --- | --- | --- |
| Identita, cílové skupiny, architektura, nejméně 3 scénáře | `project-specification.md` | Porovnání se zadáním a obsahem webu |
| Nejméně 3 dny, 2 scény, 60 účinkujících a 60 položek | `data.xml`, `data/festival.xml` | Počty, jedinečná ID a XML/XSD validace |
| Mobilní a desktopový návrh, průchod 2 scénáři | `prototype/` | Funkční S1 a S2, kontrola šířek |
| Úvod, program, účinkující a detail, scény, praktické informace | `web/*.html`, `web/js/app.js` | Prokliky a shoda zobrazení s daty |
| Nejméně 3 smysluplné interakce | Filtry, hledání, osobní program a další | Skutečné akce v Chromium |
| Client-side běh bez instalace a serverového runtime | Celá složka `web/` | Přibalené skripty, data, písma a PDF knihovny |
| Sémantika, formuláře, klávesnice, responzivita | HTML, CSS a vykreslené rozhraní | Struktura, focus, popisky, rozložení a browserové kontroly |
| Metadata a pravdivá strukturovaná data | HTML `<head>` a JSON-LD na úvodu | Kontrola názvu, data, místa a parsování JSON |
| Progress soubory a prezentace podle cvičení | `course-source/`, `odevzdani/` | Kontrola obsahu a PPTX/PDF výstupů |
| Cross-review jiného projektu | Šablona `review/` pro cvičení 06 | Vyžaduje skutečný přidělený projekt a nálezy týmu |
| Dokumentace, změny, AI a ověření | Tento soubor a `validation_report.md` | Odkazy na konkrétní podklady a výsledky |

Automatizované kontroly nedokládají úplný soulad s WCAG AA ani všechny
náležitosti HTML Living Standard. Chybějící lidské posouzení nepovažujeme
za splněnou externí validaci.

## 3. Struktura a datový slovník

### 3.1 Jak data procházejí projektem

```text
data/festival.xml + festival.xsd
          ↓ XSLT transformace a ověření
       API/json/*.json
          ↓ tools/generate_data.py
       web/js/data.js
          ↓ JavaScript v prohlížeči
     program, profily, scény, tarify
```

`data/festival.xml` je hlavní datový zdroj. `data.xml` je identická kopie
pro předepsanou strukturu odevzdání. XSD ověřuje strukturu, typy a reference.
Sedm XSLT transformací vytváří JSON ukázky; JSON Schema a OpenAPI popisují
jejich strukturu. Složka `API/` obsahuje soubory, **nikoli běžící backend**.

`web/js/data.js` při otevření stránky nastaví `window.FESTIVAL_DATA`.
Je to obyčejný JavaScript s vloženými daty, připravený z úplného XML
a JSON exportů. Web proto nemusí při spuštění načítat XML přes `fetch`
ani provozovat API. Všech 60 interpretů je přítomno i tehdy, když ukázkový
JSON endpoint předvádí stránkování.

### 3.2 Hlavní entity XML

| Element nebo atribut | Obsah a pravidlo | Použití na webu |
| --- | --- | --- |
| `festival/@id`, `nazev`, `popis_festivalu` | Identita a popis | Úvod a společná identita |
| `mistokonani` | Ulice, město, PSČ | Praktické informace a strukturovaná data |
| `dny/den/@id` | Klíč dne, název, datum a časy | Filtr programu a platnost vstupenek |
| `haly/hala/@id` | Klíč scény, název, lokace, kapacita, popis a ceník scény | Scény, program a dostupnost vstupů |
| `interpreti/interpret/@id` | Klíč, jméno, typ, žánr a medailonek | Seznam a profil interpreta |
| `interpret/odkazy/odkaz` | Platforma, URL, druh odkazu a zdroj | Doložený hudební profil nebo označené hledání |
| `sumakce/akce/@id` | Klíč vystoupení, téma, popis a čas | Program a detail vystoupení |
| `den_ref`, `hala_ref`, `interpret_ref` | Odkaz na existující ID příslušné entity | Jednoznačné propojení programu |
| `vstupenky/vstupenka` | Šest záznamů: 3 kategorie × denní/celofestivalový tarif pro všechny scény | Ceník společného vstupu a varianty na dva dny |
| `hala/vstupenky_sceny` | Kapacita stání, řady sedadel a ceny jednotlivé scény | Samostatný vstup a společná fyzická kapacita |
| `akce/hlavni_vystoupeni` | Závěrečný koncert; v JSON a `data.js` jako `highlight` | Devět navazujících večerních koncertů |
| `kempovani`, `sazba_dph` | Typy míst, ceny, kapacity, pobyt a modelová daň | Košík, poukaz a daňový rozpis |
| `kontakt`, `odkazy` | Festivalové kontakty a odkazy | Info a patička |

Program je řazen podle dne a začátku. Dvě vystoupení na stejné scéně se
nepřekrývají; přestavba trvá nejméně 30 minut. **Různé scény mohou hrát
souběžně.** Každá má 20 vystoupení, celkem je 20 setů za den. Běžný set má
60 minut a hlavní koncert v Main Hall 90 minut.

Tři závěrečné koncerty každý den navazují: River 18:30–19:30, Club 20:00–21:00
a Main Hall 21:30–23:00. Mezi nimi zbývá 30 minut na přesun. Těchto devět
položek označuje příznak `highlight`. Společná třídenní vstupenka umožňuje
vidět všechny tyto koncerty; netvrdíme, že lze stihnout všech 60 celých setů.
Osobní program upozorní na časové překryvy uložených vystoupení.

### 3.3 JSON není totéž co JSON-LD

JSON soubory skutečně existují v `API/json/`; procenta jazyků na GitHubu
nejsou inventář dat ani známka kvality. JavaScript zahrnuje také přibalená
data a knihovny, Python pomocné nástroje a testy. Jejich velikost nevypovídá
o tom, co je nutné k otevření webu.

JSON-LD je zde vložený blok `<script type="application/ld+json">` na úvodu.
Popisuje entitu `Festival`, její viditelný název, datum a místo pro vyhledávače.
Neslouží jako úložiště uživatelů a nenahrazuje festivalová data. Neuvádí
vymyšlená hodnocení ani potvrzené nabídky skutečného prodeje.

## 4. Návrh a fungování webu

### 4.1 Navigace a uživatelské scénáře

Hlavní navigace propojuje Program, Účinkující, Scény, Info, Účet, Košík
a Vstupenky. Společná hlavička obsahuje hledání a přepínač CZ/EN. Detail
interpreta navazuje na jeho koncert, detail scény na její program.
Soukromí, podmínky a fotografické kredity mají samostatné stránky.

- **S1 — osobní program:** vybrat první den a River Stage, uložit koncert,
  zapnout vlastní program a obnovit stránku. Zůstane uložený koncert.
- **S2 — interpret:** vyhledat DARKZY, otevřít medailonek a odkaz do programu.
  Výsledek a čas musí odpovídat stejné entitě v XML.
- **S3 — objednávka hosta:** zvolit 1. a 3. srpna, vlastní VIP sedadlo,
  vyplnit kontakt a po dokončení stáhnout PDF pro přesně oba zvolené dny.

Úplná definice uživatele, cíle, výchozí situace a očekávaného výsledku je
ve specifikaci. `prototype/` je samostatný jednodušší wireframe pro S1 a S2;
hotový web jej při spuštění nepoužívá.

### 4.2 Rozhraní a přístupnost

Mobile-first CSS používá Flexbox pro navigaci a ovládání a Grid pro seznamy,
karty a sedadla. Pružné šířky, `clamp()` a `minmax()` přizpůsobují obsah
prostoru. Tmavá identita kombinuje vlastní typografické logo a oranžové akce.
Inspirace festivalovými weby nepřebírá cizí logo, fotografie ani kód.

Používají se významové oblasti `header`, `nav`, `main`, `section`, `article`,
`aside` a `footer`, dále `time`, `address` a popisky formulářů. Navigaci lze
přeskočit, focus je viditelný, detaily používají dialog a výsledky hledání
stavové oblasti. Obsazenost nespoléhá pouze na barvu. Hledání normalizuje
diakritiku a velikost písmen a porovnává podřetězec i v medailoncích.

### 4.3 Objednávka a místní stav

Vstupenka rozlišuje všechny scény nebo jednu konkrétní scénu a jeden, dva
libovolné či tři dny. Main Hall nabízí VIP a Regular sedadla i stání; River
a Club pouze stání. U společného VIP/Regular vstupu je sedadlo v Main Hall,
na ostatních scénách se stojí.

| Scéna | Kapacita na den | Zóny |
| --- | --- | --- |
| Main Hall | 5 000 | 16 VIP, 32 Regular, 4 952 stání |
| River Stage | 3 000 | Stání |
| Club Stage | 1 500 | Stání |

Kapacity jsou návrhové pro fiktivní festival. Nejde o oficiální povolené
kapacity Výstaviště. Společná vstupenka započítá jednu osobu na každé scéně
v každém zvoleném dni, proto její dostupnost omezuje i nejmenší Club Stage.
Samostatný vstup zabírá jen příslušnou scénu. Stejné fyzické sedadlo v Main
Hall nelze prodat zároveň v samostatné a společné variantě. Stání má konečnou
kapacitu, ale nevyžaduje kreslení tisíců tlačítek sedadel. Jeho interní číslo
není rezervovaná pozice: při vícedenním vstupu rozhoduje volná kapacita
každého dne, nikoli shodné číslo stání v různých dnech.

Výběr dovoluje nejvýše osm osob najednou, celá objednávka nejvýše 264
vstupenek. Vyšší počet se odmítne před přidáním i při dokončení objednávky,
aby každou přijatou objednávku bylo možné stáhnout jako PDF.

| Rozsah | Kategorie | 1 den | 2 libovolné dny | 3 dny |
| --- | --- | --- | --- | --- |
| Všechny scény | VIP | 590 Kč | 1 180 Kč | 1 590 Kč |
| Všechny scény | Regular | 390 Kč | 780 Kč | 990 Kč |
| Všechny scény | Stání | 190 Kč | 380 Kč | 490 Kč |
| Main Hall | VIP | 490 Kč | 980 Kč | 1 290 Kč |
| Main Hall | Regular | 290 Kč | 580 Kč | 790 Kč |
| Main Hall | Stání | 150 Kč | 300 Kč | 390 Kč |
| River Stage | Stání | 110 Kč | 220 Kč | 290 Kč |
| Club Stage | Stání | 90 Kč | 180 Kč | 240 Kč |

Košík místo ještě nerezervuje. Dostupnost pro další výběr zohlední prodané
vstupy i obsah košíku; před dokončením se znovu kontroluje cena, překryv dnů,
fyzická místa, dotčené kapacity scén a kemp. Nákup 1. a 3. dne sám neobsadí
2. den. Jde o kapacitu na den, nikoli aktuální počet lidí u pódia. Místní
data nejsou sdílená mezi zařízeními. Objednávky staršího ročníku zůstávají
v historii, ale neblokují aktuální ročník. U záznamů bez `venueId` se zachová
původní význam všech scén; `scope` nadále označuje délku, ne scénu.

Kemp je jedno místo na objednávku s alespoň jednou vstupenkou: stan 350 Kč
(nejvýše 4 osoby, 40 míst) nebo karavan 850 Kč (6 osob, 12 míst) plus 150 Kč
za osobu. Cena zahrnuje tři noci 1.–4. srpna 2027.

PULSE10 odečte 10 % z ceny vstupenek, PRAHA200 nejvýše 200 Kč. Kódy se
nesčítají a nezlevňují kemp. Ceny již obsahují modelovou 12% DPH; znovu
se nepřičítá. Poplatek objednávky je 0 Kč.

Příklad: dvě dvoudenní VIP vstupenky, PULSE10 a stan pro dvě osoby:
**2 × 1 180 − 236 + 350 + 2 × 150 = 2 774 Kč.**
Základ je 2 476,79 Kč a zahrnutá daň 297,21 Kč. Základ se vypočítá
z konečné ceny dělením 1,12; rozdíl tvoří daň, částky jsou na haléře.

Sedm platebních metod představuje průchod formulářem bez platební služby.
PDF vzniká lokálně přes jsPDF: každá vstupenka má vlastní stránku, přesná
data, místo, číslo objednávky a QR identifikátor. Kemp přidává poukaz.
QR nemá serverové ověření. Skutečné karetní údaje se nevyplňují a e-mail
se automaticky neposílá.

### 4.4 Účet a soukromí

Registrace má jméno, příjmení, e-mail, telefon, heslo a jeho potvrzení.
Profil dovoluje upravit kontakt bez změny údajů historické objednávky.
Heslo se ukládá jako PBKDF2-SHA256 hash se 120 000 iteracemi a náhodnou
solí; nejde o produkční autentizaci ani ověření vlastnictví e-mailu.
Přihlášení vyprší za sedm dnů; toto vypršení kontroluje klientská aplikace.

`localStorage` uchovává účet, košík, objednávky, osobní program a nastavení.
Nevzniká automaticky měněný soubor JSON v adresáři projektu. Smazání místních
dat smaže také zdejší účet a historii. Vstupy se escapují; dotaz není spouštěný
regex a aplikace nepoužívá SQL.

Web sám nenastavuje HTTP cookies a nemá serverovou session. `sessionStorage`
drží identifikátor relace aktuální karty a poslední objednávku hosta; obnovení
stránky ho zachová, nová nezávislá relace data nesdílí. `localStorage` zůstává
i po zavření prohlížeče, dokud jej uživatel nebo prohlížeč nevymaže.

Volba soukromí v `localStorage` platí 180 dnů. Lišta tedy nepředstavuje databázi
cookies, ale ovládání místního ukládání a externího obsahu. Google Maps se vloží až po souhlasu s externími
mapami; po odvolání se odstraní. Vlastní SVG plánek a textová doprava fungují
bez tohoto souhlasu. Analytika a reklamní sledování se nepoužívají.

## 5. Metodika, nástroje a ověření

Postup přípravy má čtyři navazující části:

1. **Požadavky a data:** vymezit identitu, skupiny a scénáře; ověřit XML,
   počty a reference před tvorbou odvozených dat.
2. **UX návrh:** připravit mobilní i desktopový wireframe a projít S1 a S2.
3. **Implementace:** propojit stejná ID v obsahu, hledání, osobním programu
   a detailech; doplnit objednávkový scénář a CZ/EN.
4. **Kontrola a předání:** spustit validace, projít konkrétní scénáře,
   prohlédnout rozložení a exportovat podklady pro Moodle.

| Nástroj nebo technologie | Účel |
| --- | --- |
| HTML, CSS, JavaScript, Web Crypto | Obsah, rozložení, interakce a místní zpracování hesla |
| XML, XSD, XSLT, JSON Schema, OpenAPI 3.1 | Konzistentní datové podklady |
| jsPDF a QR knihovna | PDF dokument v prohlížeči, přibalené licence |
| Python, lxml, jsonschema, PyYAML | Volitelné vývojové validace a export dat |
| Playwright a Chromium | Automatizované prokliky skutečného rozhraní |
| python-pptx, ReportLab, python-docx | Editovatelné prezentace a doprovodné dokumenty |
| Git a GitHub | Verze zdrojů, kontrola změn a stažení projektu |
| Codex / ChatGPT | Návrh, texty, implementace a podpora kontrol |

Python a uvedené balíčky nejsou součástí běhových požadavků webu.
Připravené PPTX, PDF a DOCX lze otevřít bez spuštění generátorů.
Pokyny k instalaci volitelných kontrol obsahuje README a průvodce soubory.

| Kontrola | Co prokazuje |
| --- | --- |
| `python validate_project.py` | XML/XSD, počty, reference, transformace, schémata a shodu exportu |
| `python tests/browser_smoke.py` | Filtry, hledání, oblíbené, účty, objednávky, součty a vytvořené PDF |
| `python tests/course_materials.py --folder odevzdani` | Otevření prezentací, poznámky a funkční scénáře prototypu |
| Vizuální kontrola | Čitelnost, fotografie, součty, přetékání a rozložení |

Konkrétní výsledky, datum a rozsah jsou v `validation_report.md`.
Testy probíhají přes pomocný statický server. Přímé otevření souboru
`file://` v řízeném cloudovém Chromium blokuje jeho politika, takže tato
kontrola není vydávána za úspěšnou. Testy nenahrazují čtečku obrazovky,
kontrolu všech prohlížečů a fyzických zařízení ani testování s návštěvníky.

Obrazové ukázky skutečně spuštěného webu a PDF jsou ve složce `preview/`.
Přehled rolí jednotlivých souborů je v `docs/PROJECT-GUIDE.md`.

## 6. SEO, AEO a obrazové podklady

Rešerše z 18. října 2026 pracovala s primárními podklady:

| Zdroj | Konkrétní použití v projektu |
| --- | --- |
| [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) | Jedinečné titulky, výstižné popisy a interní odkazy mezi interprety a programem |
| [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) | Dostupný obsah a pravdivé JSON-LD; bez vymyšleného speciálního AI schématu |
| [W3C WAI Page Structure](https://www.w3.org/WAI/tutorials/page-structure/) | Významové oblasti, hierarchie nadpisů a přeskočení navigace |

Stránky mají title, description, jazyk, viewport a Open Graph. JSON-LD
odpovídá viditelným informacím. Bez produkční domény se nevymýšlí canonical
nebo sitemap. Skriptovaný obsah má limity pro jednodušší crawlery;
indexace a doporučování AI nebyly ověřené na veřejném nasazení.

Fotografie mají autora, zdroj, licenci a případné úpravy v
`web/images/photo-credits.json`, `PHOTO-CREDITS.md` a na stránce Kredity.
42 interpretů má doložený skutečný snímek, 18 vlastní typografickou náhradu.
Historický úvod zachycuje Průmyslový palác v roce 2018. Plánek je vlastní
orientační schéma, nikoli oficiální plán nebo potvrzení provozu kempu.
Dvě fotografie, Hedex a AC Slater, mají licenci CC BY-NC-SA 2.0 a omezují
současnou sadu na nekomerční použití podle licenčních podmínek.

Novinka o paláci vychází z [oficiálního sdělení Výstaviště](https://pronajem.navystavisti.cz/otevirame-prumyslovy-palac/),
modelová daň z [informace GFŘ ke změnám od roku 2024](https://financnisprava.gov.cz/assets/cs/prilohy/d-seznam-dani/Informace_GFR_ke_zmenam_sazeb_DPH_od_1_1_2024.pdf).
Podklad GFŘ nepotvrzuje právní sazbu konkrétní akce v roce 2027.

## 7. Vývoj, změny a cross-review

| Fáze nebo podnět | Rozhodnutí a změna | Důvod a kontrola |
| --- | --- | --- |
| Původní Značkovací jazyky | Zachovat XML, scény, interprety a programové vazby | Navázání na existující datový projekt; validace exportů |
| Návrh Webdesignu | Doplnit propojené hledání, osobní program, mobile-first a CZ/EN | Scénáře návštěvníků; průchod S1 a S2 |
| Upřesnění zadavatele | Zachovat Prague Pulse Fest, přesunout termín na srpen 2027, vlastní tmavá identita | Oprava názvu a budoucího ročníku; shoda dat a rozhraní |
| Zpětná vazba k rozhraní | Skuteční interpreti, podrobnější medailonky, vhodné fotografie, doprava a offline plánek | Konkrétní obsahové připomínky; kontrola vazeb a licencí |
| Zpětná vazba k objednávce | Sjednotit 1/2/3 dny, ruční sedadla, kemp a daňový rozpis | Srozumitelný rozsah a cena; kontrola PDF a nesousedících dnů |
| Požadavek na samostatné scény a přehledný program | Rozdílné kapacity, levnější vstup jedné scény, postupné večerní koncerty a upozornění na kolize | Srozumitelný rozsah vstupu bez zkrácení plných setů; ověření cen, kapacit a časů |
| Aktuální požadavek na podklady | Zjednodušit prezentace a dokumentaci, doplnit autory a návod | Obsah jednotlivých cvičení porovnaný se zadáním |

Podklady v `odevzdani/` jsou dodatečně připravené milníky, nikoli důkaz
historických odevzdání. Cvičení 04 a 05 obsahují současný web.
Před odevzdáním musí tým doložit návaznost na skutečně schválené první dva
výstupy a zdůvodnění větších změn v rámci školního limitu přibližně 15 %.

### Přijaté připomínky jiného týmu

| Připomínka | Závažnost | Rozhodnutí | Provedená změna / zdůvodnění odmítnutí |
| --- | --- | --- | --- |
| Doplnit skutečné review po jeho obdržení | Neurčena | Čeká na podklad týmu | Cizí posudek nebyl dodán; zapracování se netvrdí |

`review/received-review.md` je místo pro přijatý posudek.
`review/internal-review.md` uvádí vlastní kontroly. Zpětná vazba zadavatele
není cross-review jiného týmu. Cvičení 06 obsahuje šablonu Nielsenovy
heuristické evaluace a kognitivního průchodu; skutečné nálezy nelze doplnit
bez přiděleného projektu. **Změny po cvičení 06 zatím nejsou doloženy.**

### Spolupráce týmu

Autoři jsou Michal Ladra, Matěj Mlejnek a Jan Martínek. Konkrétní rozdělení
práce nebylo v podkladech uvedeno, proto se nedovozuje z AI úprav ani commitů.

| Co doplní tým před odevzdáním | Záznam |
| --- | --- |
| Odpovědnost za data, implementaci, obsah, kontrolu a prezentaci | Doplnit skutečné rozdělení práce mezi autory |
| Společné konzultace a ověření scénářů | Doplnit datum, účastníky a výsledek |
| Složení skupiny | Zadání uvádí 4 členy; uvedeni jsou 3 zadaní autoři — ověřit s vyučujícím |

## 8. Použití AI a kritické zhodnocení

Codex / ChatGPT pomáhaly s rozborem zadání, návrhem rozhraní, CZ/EN texty,
implementací, podklady a kontrolami. Předchozí AI ilustrace se nepoužívají
jako portréty skutečných interpretů. Současné fotografie jsou skutečné
licencované podklady; textové medailonky prošly AI zpracováním.

| Použití a reprezentativní zadání | Co jsme přijali, upravili či odmítli | Jak se výsledek kontroloval |
| --- | --- | --- |
| „Navrhni mobilní festivalový web a propojený program.“ | Přijata navigace a scénáře; zjednodušeny obecné reklamní texty | Průchody S1 a S2 na mobilní a desktopové šířce |
| „Zachovej XML jako zdroj dat webu.“ | Přijaty stabilní identifikátory; upraveny nesoulady exportů | XML/XSD, skutečné XSLT transformace a porovnání JSON/data.js |
| „Sjednoť nákup na jeden, dva nebo tři dny.“ | Přijata společná volba; opraveno vyjádření nesousedících dnů | Nákup 1. a 3. srpna, obsazenost a text staženého PDF |
| „Kemp je místo plus počet osob, promo jen na vstupenky.“ | Přijat oddělený výpočet; daň se nepřičítá znovu | Přepočet příkladu 2 774 Kč, hranice slevy a kapacit |
| „Použij skutečné interprety a fotografie.“ | Odmítnuty nedoložené snímky a AI tváře přiřazené reálným lidem | Záznam jména, autora, licence a zdroje; vlastní náhrada při chybějící fotografii |
| „Navrhni kapacity scén a program, který dává smysl.“ | Přijaty různé kapacity; odmítnuto neomezené stání a slib stihnout všech 60 plných setů | Kapacity z katalogu, společné a samostatné vstupy, stejné sedadlo a návaznost večerních koncertů |
| „Připrav podklady podle cvičení.“ | Přijato členění; odmítnut vymyšlený cizí posudek a historie týmu | Porovnání se zadáním, otevření PPTX/PDF a kontrola poznámek |

Limity AI se projevily hlavně v příliš obecných textech, záměně festivalového
názvu, podobných fiktivních jménech a v riziku nesprávných zdrojů fotografií.
Proto nestačí prohlásit „ověřeno AI“: data se porovnávají, funkce se skutečně
spouštějí a neověřená tvrzení se odstraňují.

Zadání požaduje generované texty a obrázky, zatímco zadavatel následně zvolil
skutečné fotografie. Tento rozdíl je nutné při odevzdání vyřešit s vyučujícím;
dokumentace ho nevydává za schválenou výjimku. AI zrychlila přípravu, ale
odpovědnost za porozumění, ověření a odevzdání zůstává uvedeným autorům.
