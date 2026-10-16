# Prague Rocks Festival — projektová specifikace

Aktuální specifikace fiktivního festivalu. Historie skutečných odevzdání a
schválení změn vyučujícím musí být doložena původním týmem.

## Identita festivalu

| Vlastnost | Hodnota |
| --- | --- |
| Název | Prague Rocks Festival |
| Ročník | 1. ročník, 2026 |
| Lokalita | Vltava Park (fiktivní areál), Výstaviště Praha, Výstaviště 67, 170 00 Praha 7 |
| Termín | 1.–3. srpna 2026 |
| Charakter | Fiktivní třídenní městský hudební festival |
| Žánry | Rock, indie, pop, elektronika, hip-hop, jazz a folk |
| Rozsah dat | 3 dny, 3 scény, 60 účinkujících, 60 vystoupení |

Identita, adresa a přesné názvy scén jsou ve finálním exportu odvozeny ze
souboru `data.xml`. Lokalita Výstaviště Praha je reálná; festivalové uspořádání a označení Vltava Park jsou fiktivní. Kontaktní údaje jsou součástí fiktivní festivalové identity,
nikoli ověřené kontakty skutečného pořadatele. Návštěvníci nesmějí být vedeni
k tomu, že jde o existující prodávanou akci.

## Účel webu

Web umožňuje zjistit místo a termín, objevit účinkující, naplánovat návštěvu,
vyhledat konkrétní informaci a projít školním objednávkovým tokem vstupenky.
Primární akce jsou otevřít program, filtrovat vystoupení a uložit osobní program.
Sekundární akce jsou porovnat tarify, vybrat místo a stáhnout PDF vstupenku.

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
├── Program → detail vystoupení → účinkující / scéna
├── Účinkující → detail → příslušná vystoupení
├── Scény → program scény / doprava
├── Praktické informace → doprava, pobyt, pravidla, kontakt
├── Vyhledávání → výsledky → konkrétní objekt
├── Vstupenky → balíček nebo místa → košík → dokončení → PDF
└── Účet → registrace / přihlášení → historie objednávek
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
| S2 | Fanoušek kapely | Najít Neon Wave a čas koncertu | Zadá část názvu „Neon“ | Dostane odpovídající výsledky, otevře detail a přejde k datu a scéně vystoupení |
| S3 | Návštěvník bez účtu | Získat třídenní vstupenku nebo konkrétní místa | Porovnává VIP, Regular a stání | Zná obsah a cenu, projde košík, po zkušebním dokončení stáhne PDF s ID objednávky; lokální obsazenost se aktualizuje |
| S4 | Vracející se návštěvník | Najít dřívější objednávku | Má lokální účet ve stejném prohlížeči | Přihlásí se, zobrazí svou historii a znovu stáhne PDF |
| S5 | Zahraniční návštěvník | Najít dopravu anglicky | Nerozumí češtině a přichází na úvod | Přepne jazyk, otevře informace a najde mapu lokality |

Scénáře S1–S3 jsou základ návrhu, prototypu i ověřování. S4–S5 rozšiřují
aktuální rozhraní. Wireframe z cvičení 03 řeší S1 a S2; není vydáván za hotový nákup.

## Datová základna a její vazby

Autoritativním souborem je `data.xml`. Obsahuje `festival`, `dny/den`,
`haly/hala`, `interpreti/interpret` a `sumakce/akce`. Každé vystoupení odkazuje
přes `den_ref`, `hala_ref` a `interpret_ref` na existující jedinečné ID.
Časy mají formát HH:MM:SS a data ISO YYYY-MM-DD. Webový `web/js/data.js`
je přibalený export stejné základny; jeho regenerace je vývojová činnost,
nikoli podmínka spuštění webu. Vstupenky a obohacené texty respektují výsledný XML export.

| Tarif | Třídenní cena | Jednodenní cena |
| --- | --- | --- |
| VIP | 1 590 Kč | 590 Kč |
| Regular | 990 Kč | 390 Kč |
| Stání | 490 Kč | 190 Kč |

Ceny a obsah tarifů se čtou z XML odvozených dat. Výběr konkrétních míst
a třídenní balíčky jsou dvě cesty v téže klientské objednávce.

Kontrola dat ověřuje počty, unikátní ID, existenci referencí, návaznost dat
a shodu přibaleného exportu. `data.xml` i JavaScript jsou součástí odevzdání.
Samotné přehrání prezentace nebo vizuální prohlídka datovou konzistenci neprokazují.

## Interaktivní funkce

1. Kombinovaný filtr programu podle dne a scény — zkrátí hledání koncertu.
2. Vyhledávání obsahujícího řetězce bez závislosti na velikosti písmen a diakritice.
3. Oblíbená vystoupení a osobní program přetrvávající po obnovení.
4. Kontextové detaily propojující účinkující, vystoupení a scény.
5. Výběr vstupenek, košík a lokální historie s exportem PDF.

## Technické hranice

Výsledný web je HTML, CSS a JavaScript se všemi potřebnými zdroji přibalenými.
Nevyžaduje Node.js, balíčkovací nástroj, build, backend ani databázi. Údaje účtů,
osobního programu a objednávek přetrvávají ve stejném prohlížeči v místním
úložišti. Export JSON je uživatelsky stažená záloha, nikoli automatický zápis na disk.
Neukládá se otevřený text hesla; lokální heslový hash není produkční autentizace.
Skutečné platby a automatické odesílání e-mailu nejsou součástí klientské verze.

## Původ podkladů a změny

Původní dodaný projekt nesl jméno Prague Pulse Fest. Přejmenování na Prague
Rocks Festival a současný výraznější grafický směr vznikly z výslovného zadání
uživatele. Není doloženo schválení změny vyučujícím v limitu přibližně 15 %.
Tým má před odevzdáním potvrdit návaznost na skutečně schválený první výstup.
Nevymýšlíme historické konzultace ani review.

## AI a ověření

Codex pomohl s rozborem zadání, návrhem struktury, texty, implementací,
generováním podkladů a automatizovanými kontrolami. Vizuály mají původ uvedený
v přibaleném `web/images/ASSETS.md`. Přijat byl mobile-first přístup,
propojená data a originální festivalová identita. Odmítnuty byly backendové
požadavky odporující zadání a kopie cizího loga. Konkrétní aktuální výsledky
jsou v `validation_report.md`, je-li přiložen; plán testu není vydáván za jeho výsledek.
