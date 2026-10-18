# Prague Pulse Fest — projektová specifikace

Aktuální specifikace fiktivního festivalu. Historie skutečných odevzdání a
schválení změn vyučujícím musí být doložena původním týmem.

## Identita festivalu

| Vlastnost | Hodnota |
| --- | --- |
| Název | Prague Pulse Fest |
| Ročník | 1. ročník, 2027 |
| Lokalita | Vltava Park (fiktivní areál), Výstaviště Praha, Výstaviště 67, 170 00 Praha 7 |
| Termín | 1.–3. srpna 2027 |
| Charakter | Fiktivní třídenní městský hudební festival |
| Žánry | Rock, pop, český rap, drum and bass, UK garage, bass house a techno |
| Rozsah dat | 3 dny, 3 scény, 60 účinkujících, 60 programových položek |

Identita, adresa a přesné názvy scén jsou ve finálním exportu odvozeny ze
souboru `data.xml`. Lokalita Výstaviště Praha je reálná; festivalové uspořádání a označení Vltava Park jsou fiktivní. Kontaktní údaje jsou součástí fiktivní festivalové identity,
nikoli ověřené kontakty skutečného pořadatele. Návštěvníci nesmějí být vedeni
k tomu, že jde o existující prodávanou akci. Line-up používá skutečné hudební
interprety jako autorský návrh; neprohlašuje jejich potvrzenou účast. Aktuální program rozděluje po 20 interpretech mezi Main Hall (hlavní
mezinárodní jména), River Stage (česká scéna) a Club Stage (klubová elektronika).

## Účel webu

Web umožňuje zjistit místo a termín, objevit účinkující, naplánovat návštěvu,
vyhledat konkrétní informaci a projít školním objednávkovým tokem vstupenky.
Primární akce jsou otevřít program, filtrovat vystoupení a uložit osobní program.
Sekundární akce jsou porovnat konečné ceny tarifů, vybrat jeden, dva libovolné
nebo tři dny a konkrétní sedadla či množství stání, přidat kemp, zadat promo
kód, projít zkušební platbu a stáhnout PDF vstupenku i voucher kempu.

## Cílové skupiny

| Skupina | Potřeba a očekávání | Odpověď rozhraní |
| --- | --- | --- |
| Návštěvník na telefonu | Rychle najít čas a scénu, pohodlně ovládat jednou rukou | Mobile-first program, filtry a přehledné karty |
| Fanoušek konkrétní kapely | Najít interpreta a jeho koncert | Vyhledávání, detail a vazba na program |
| Návštěvník mimo Prahu | Zjistit dopravu, parkování a pobyt | Praktické informace, scény a mapa lokality |
| Zahraniční návštěvník | Rozumět orientaci i nákupu | Přepínání češtiny a angličtiny |
| Vracející se návštěvník | Zachovat vlastní program a objednávku | Místní úložiště a historie lokálního účtu |

## Informační architektura

```text
Úvod
├── Novinky → samostatný článek
├── Program → detail položky → účinkující / scéna
├── Účinkující → detail → příslušná vystoupení
├── Scény → program scény / doprava
├── Praktické informace → doprava, offline plánek, kemp, pravidla, kontakt
├── Vyhledávání → výsledky → konkrétní objekt
├── Vstupenky → balíček nebo místa → košík → dokončení → PDF
├── Účet → registrace / přihlášení → profil / historie objednávek
└── Soukromí / Podmínky / Kredity → samostatné informační stránky
```

Hlavní navigace odkazuje na Program, Účinkující, Info a Vstupenky. Další
obsahové části zpřístupňuje navigace Info a patička. Úvod určuje identitu,
datum a hlavní akci. Vyhledávání není oddělené od obsahu: výsledky odkazují na
odpovídající koncert, interpreta, scénu nebo praktickou informaci. Detaily mají
kontext návratu. Program a osobní program používají stejná datová ID.

## Klíčové uživatelské scénáře

| ID | Typ uživatele | Cíl | Výchozí situace | Očekávaný výsledek |
| --- | --- | --- | --- | --- |
| S1 | Návštěvník na telefonu | Naplánovat první den na River Stage | Je na úvodu, zná den a scénu, nezná kapely | Filtry ukážou jen odpovídající akce; vybraná akce zůstane v osobním programu i po obnovení |
| S2 | Fanoušek interpreta | Najít DARKZY a čas jeho setu | Zadá dotaz „DARKZY“ | Otevře detail, konkrétní subžánr a hudební odkazy, najde datum a čas Club Stage |
| S3 | Návštěvník bez účtu | Koupit vlastní VIP sedadlo na 1. a 3. srpna a přidat kemp | Zná dva požadované dny a porovnává kategorie | Ručně zvolí volné sedadlo, vidí VIP 1 180 Kč, přidá stan a osoby, uplatní promo pouze na vstupenku a po simulaci stáhne PDF s přesnými dny, voucherem a zahrnutou DPH; obsadí se jen zvolené dny |
| S4 | Vracející se návštěvník | Upravit kontakty a najít objednávku | Má lokální účet ve stejném prohlížeči | Upraví profilové údaje, přihlášení přetrvá, historie a opětovné PDF zachovají původní údaje objednávky |
| S5 | Zahraniční návštěvník | Najít dopravu a přespání anglicky | Nerozumí češtině a nemá povolenou externí mapu | Přepne jazyk, najde offline plánek, textovou dopravu a modelové ceny kempu bez nutnosti načíst Google |

Scénáře S1–S3 jsou základ návrhu, prototypu i ověřování. S4–S5 rozšiřují
aktuální rozhraní. Wireframe z cvičení 03 řeší S1 a S2; není vydáván za hotový nákup.

## Datová základna a její vazby

Autoritativním souborem je `data.xml`. Obsahuje `festival`, `dny/den`,
`haly/hala`, `interpreti/interpret` a `sumakce/akce`. Každé vystoupení odkazuje
přes `den_ref`, `hala_ref` a `interpret_ref` na existující jedinečné ID.
Časy mají formát HH:MM:SS a data ISO YYYY-MM-DD. Webový `web/js/data.js`
je přibalený export stejné základny; jeho regenerace je vývojová činnost,
nikoli podmínka spuštění webu. Vstupenky a obohacené texty respektují výsledný XML export.

| Tarif | 1 den | 2 libovolné dny | 3 dny |
| --- | --- | --- | --- |
| VIP | 590 Kč | 1 180 Kč | 1 590 Kč |
| Regular | 390 Kč | 780 Kč | 990 Kč |
| Stání | 190 Kč | 380 Kč | 490 Kč |

Ceny a výhody se čtou z XML odvozených dat. Dvoudenní cena je součet dvou
jednodenních tarifů; může jít i o 1. a 3. srpna. VIP a Regular vyžadují ruční
výběr sedadla volného ve všech zvolených dnech. Stání se vybírá množstvím.
Obsazenost se aktualizuje jen ve zvolených dnech, košík není skutečná rezervace.

Kemp je doplněk objednávky s alespoň jednou vstupenkou: jeden stan 350 Kč
(max. 4 osoby, 40 míst) nebo karavan 850 Kč (max. 6 osob, 12 míst), k tomu
150 Kč za osobu. Cena pokrývá 3 noci 1.–4. srpna 2027. Model není potvrzením
reálného kempu v areálu. Kapacita se kontroluje před dokončením.

PULSE10 snižuje pouze vstupenky o 10 %, PRAHA200 o 200 Kč nejvýše do jejich
ceny; slevy se nesčítají a kemp se nezlevňuje. Ceny obsahují modelovou 12% DPH,
košík a PDF ukazují daň i základ. Poplatek objednávky je 0 Kč. Částky se znovu
počítají při dokončení. Tento školní výpočet nepotvrzuje právní sazbu v roce 2027.

Kontrola dat ověřuje počty, unikátní ID, existenci referencí, návaznost dat
a shodu přibaleného exportu. `data.xml` i JavaScript jsou součástí odevzdání.
Samotné přehrání prezentace nebo vizuální prohlídka datovou konzistenci neprokazují.

## Interaktivní funkce

1. Kombinovaný filtr programu podle dne a scény — zkrátí hledání koncertu.
2. Vyhledávání obsahujícího řetězce bez závislosti na velikosti písmen a diakritice.
3. Oblíbená vystoupení a osobní program přetrvávající po obnovení.
4. Kontextové detaily propojující účinkující, vystoupení a scény.
5. Sjednocený výběr 1/2/3 dnů, sedadla nebo stání, kemp, promo a košík s PDF.
6. Rozšířená registrace, úprava profilu a lokální historie objednávek.
7. Přehled novinek s odkazy na tři vlastní články.

## Technické hranice

Výsledný web je HTML, CSS a JavaScript se všemi potřebnými zdroji přibalenými.
Nevyžaduje Node.js, balíčkovací nástroj, build, backend ani databázi. Údaje účtů,
osobního programu a objednávek přetrvávají ve stejném prohlížeči v místním
úložišti `localStorage`, nikoli v průběžně přepisovaném souboru na disku.
Neukládá se otevřený text hesla; lokální heslový hash není produkční autentizace.
Skutečné platby a automatické odesílání e-mailu nejsou součástí klientské verze.
Přihlášení vyprší za sedm dnů. Google mapa se automaticky vloží až po povolení
externích map v panelu soukromí; tuto volbu lze odvolat. Analytika ani reklamní
sledování nejsou použité. Historické objednávky si zachovávají původní ročník
a neblokují místa aktuálního ročníku.

## Původ podkladů a změny

Zachovává se původní název Prague Pulse Fest. Po upřesnění uživatele byl
obnoven po pracovní verzi s názvem Prague Rocks Festival. Termín se na jeho
výslovnou volbu posunul z 1.–3. srpna 2026 na 1.–3. srpna 2027;
programové vazby, počet dnů, scén a interpretů zůstaly zachované. Po dalším
požadavku uživatele fiktivní jména nahradilo 60 skutečných interpretů s
biografickými medailonky. Aktuální rozhraní obsahuje 42 skutečných doložených
fotografií interpretů a 18 typografických náhrad; dva snímky (Hedex, AC Slater) mají CC BY-NC-SA 2.0 a jsou určeny jen pro nekomerční školní použití. Dřívější AI portréty
fiktivních hudebníků se skutečným umělcům nepřiřazují. Úvodní fotografie
Průmyslového paláce je z roku 2018 a není vydávána za stav areálu roku 2027.
Výraznější grafický směr vznikl z požadavků uživatele. Není doloženo schválení
rozsahu změn vyučujícím v limitu přibližně 15 %.
Tým má před odevzdáním potvrdit návaznost na skutečně schválený první výstup.
Nevymýšlíme historické konzultace ani review.

## AI a ověření

Codex pomohl s rozborem zadání, návrhem struktury, texty, implementací,
generováním podkladů a automatizovanými kontrolami. Vizuály mají původ uvedený
v přibaleném `web/images/PHOTO-CREDITS.md`. Přijat byl mobile-first přístup,
propojená data a originální festivalová identita. Odmítnuty byly backendové
požadavky odporující zadání a kopie cizího loga. Pozdější výslovný požadavek
uživatele na skutečné interprety a fotografie byl upřednostněn před větou
přiloženého zadání o generování veškerého obsahu AI. Biografické medailonky
jsou AI zpracované texty o skutečných umělcích, nikoli životopisy nových
fiktivních hudebníků. Skutečné fotografie mají uvedeného
autora, zdroj a licenci v `web/images/PHOTO-CREDITS.md`, metadatech JSON
a dostupné stránce kreditů. Historická fotografie areálu má viditelné datum. Konkrétní aktuální výsledky
jsou v `validation_report.md`, je-li přiložen; plán testu není vydáván za jeho výsledek.

Nejnovější změny vycházejí z audiozpětné vazby zadavatele; ta není cross-review
přiděleného jiného týmu. Skutečné review, spolupráci a schválení rozsahu musí tým doložit.
