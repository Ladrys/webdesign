# Prague Pulse Fest — projektová specifikace

**Předmět:** Webdesign · **Akademický rok:** 2026/2027
**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

## 1. Identita festivalu

| Vlastnost | Hodnota |
| --- | --- |
| Název | Prague Pulse Fest |
| Ročník | 1. ročník, 2027 |
| Lokalita | Vltava Park — fiktivní uspořádání u Výstaviště Praha |
| Navigační adresa | Výstaviště 67, 170 00 Praha 7 |
| Termín | 1.–3. srpna 2027 |
| Charakter | Třídenní městský hudební festival |
| Hlavní žánry | Rock, pop, český rap, drum and bass, UK garage, bass house, techno |
| Rozsah dat | 3 dny, 3 scény, 60 účinkujících, 60 vystoupení |

Festival je fiktivní. Výstaviště Praha a uvedení interpreti jsou skuteční;
jejich účast, partnerství ani rezervace areálu se tím nepotvrzuje.
Main Hall představuje mezinárodní jména, River Stage českou scénu a Club Stage
klubovou elektroniku. Každá scéna má 20 programových položek.

## 2. Účel webu

Návštěvník má rychle zjistit **kdo, kdy a kde vystupuje**, sestavit si vlastní
program a najít praktické informace. Vedlejší scénář umožňuje vybrat vstupenky,
projít objednávku a stáhnout PDF.

Hlavní cíle:

- zpřístupnit program v telefonu i na počítači;
- propojit účinkující, jejich vystoupení a scény;
- umožnit hledání napříč festivalovými daty;
- srozumitelně ukázat cenu a rozsah vstupenky před dokončením objednávky.

## 3. Cílové skupiny

| Skupina | Potřeba a očekávání | Obsah nebo funkce |
| --- | --- | --- |
| Návštěvník na telefonu | Rychle najít koncert a pohodlně ovládat web | Responzivní program, filtry, osobní program |
| Fanoušek interpreta | Najít konkrétní jméno a jeho vystoupení | Vyhledávání, profil interpreta, hudební odkazy |
| Návštěvník mimo Prahu | Naplánovat cestu a pobyt | Doprava, parkování, plánek a kemp |
| Zahraniční návštěvník | Rozumět programu i objednávce | Čeština a angličtina |
| Vracející se návštěvník | Zachovat výběr a najít zakoupené vstupenky | Místní účet, profil, historie a PDF |

## 4. Informační architektura

```text
Úvod
├── Program → detail vystoupení → interpret / scéna
├── Účinkující → detail → související vystoupení
├── Scény → program konkrétní scény
├── Info → doprava, plánek, parkování, pobyt, FAQ, kontakt
├── Novinky → článek
├── Vyhledávání → výsledky → příslušný obsah
├── Vstupenky → výběr → košík → dokončení → PDF
├── Účet → registrace / přihlášení → profil / historie
└── Soukromí, Podmínky a Kredity
```

Hlavní navigace zpřístupňuje Program, Účinkující, Scény, Info, Účet, Košík
a Vstupenky. Logo vrací na úvod; vyhledávání a přepínač CZ/EN jsou společné
pro celý web. Novinky jsou dostupné z úvodu a patičky. Drobečková navigace
a odkazy v detailech pomáhají vrátit se ke kontextu.

## 5. Klíčové uživatelské scénáře

| ID | Uživatel a cíl | Výchozí situace | Očekávaný výsledek |
| --- | --- | --- | --- |
| S1 | Návštěvník na telefonu chce vlastní program | Na úvodu zná den a scénu, nezná jednotlivé koncerty | V Programu zvolí první den a River Stage, uloží koncert a po obnovení ho znovu najde |
| S2 | Fanoušek chce najít DARKZY a jeho set | Zná jméno, nikoli čas vystoupení | Vyhledá interpreta, otevře profil, hudební odkazy a vystoupení v Club Stage |
| S3 | Host chce dvě nesousedící data a vlastní sedadlo | Chce VIP na 1. a 3. srpna bez registrace | Zvolí oba dny a volné sedadlo, zkontroluje cenu, vyplní kontakt a po zkušebním dokončení stáhne PDF pro přesně tyto dny |
| S4 | Vracející se návštěvník chce změnit kontakt | Má účet ve stejném prohlížeči | Upraví profil, najde historii; původní údaje staré objednávky zůstanou zachované |
| S5 | Zahraniční návštěvník chce naplánovat příjezd | Nerozumí česky a nepovolil externí mapu | Přepne do EN a najde dopravu i místní plánek bez Google Maps |

S1–S3 jsou klíčové scénáře pro implementaci a ověřování. Samostatný wireframe
v `prototype/` umožňuje projít S1 a S2; objednávku nepředstírá jako dokončenou.

## 6. Datová základna

Autoritativní zdroj je `data/festival.xml`. Kořenový `data.xml` je jeho
identická odevzdávací kopie. Základ obsahuje festival, dny, scény, účinkující,
programové položky, kontakty, tarify a kemp.

- `den/@id`, `hala/@id`, `interpret/@id` a `akce/@id` jsou jedinečné klíče.
- Vystoupení odkazuje na den přes `den_ref`, scénu přes `hala_ref`
  a účinkujícího přes `interpreti/interpret_ref`.
- Data používají ISO datum `YYYY-MM-DD` a čas `HH:MM:SS`.
- XSD kontroluje typy, povolené hodnoty a existenci referencí.
- Program nemá časové kolize na stejné scéně; různé scény mohou hrát souběžně.
- `web/js/data.js` je přibalený export týchž dat pro běh bez serveru.

JSON soubory v `API/json/` a OpenAPI popis zůstávají jako datové podklady
původního projektu. Nejde o běžící službu ani podmínku spuštění webu.

## 7. Interaktivní funkce

| Funkce | Potřeba uživatele |
| --- | --- |
| Kombinovaný filtr programu podle dne a scény | Zúžit program na vlastní návštěvu |
| Vyhledávání typu contains bez rozlišení velikosti písmen a diakritiky | Najít jméno, popis i praktickou informaci |
| Oblíbená vystoupení a osobní program | Uložit si koncerty i po obnovení stránky |
| Detaily propojující koncert, interpreta a scénu | Získat souvislosti bez nového hledání |
| Výběr dnů, míst, košík, promo a PDF | Dokončit objednávkový scénář |
| Účet, profil a historie | Znovu otevřít vlastní objednávku |

## 8. Vstupenky a technické hranice

Současné vstupenky platí na **všechny scény**, podle zvoleného počtu dnů.
VIP a Regular používají ruční výběr sedadla; stání množství osob.

| Kategorie | 1 den | 2 libovolné dny | 3 dny |
| --- | --- | --- | --- |
| VIP | 590 Kč | 1 180 Kč | 1 590 Kč |
| Regular | 390 Kč | 780 Kč | 990 Kč |
| Stání | 190 Kč | 380 Kč | 490 Kč |

Kemp je volitelný doplněk na 1.–4. srpna: stan 350 Kč nebo karavan 850 Kč
a 150 Kč za osobu. PULSE10 snižuje pouze vstupenky o 10 %; PRAHA200
o nejvýše 200 Kč. Katalogové ceny již zahrnují modelovou 12% DPH.
Podrobné výpočty a omezení popisuje `documentation.md`.

Web běží jako HTML, CSS a JavaScript bez instalace, buildu, Node.js,
databáze a vlastního backendu. Účty, košík a objednávky ukládá do
`localStorage` stejného prohlížeče, nikoli do měněného souboru v repozitáři.
Heslo se neukládá v otevřeném tvaru. Platba je simulovaná, e-mail se
automaticky neposílá a obsazenost není sdílená mezi zařízeními.

## 9. Návrhová rozhodnutí, AI a ověření

Návrh vychází z mobile-first rozložení, tmavé festivalové identity a vlastní
typografické značky. Inspirace strukturou festivalových webů neznamená převzetí
cizího loga nebo zdrojového kódu. Texty a implementaci pomáhal připravit
Codex; přijaté výsledky ověřují datové validace a průchody scénáři
v prohlížeči. Konkrétní výsledky jsou v `validation_report.md`.

Skutečné fotografie mají autora a licenci na stránce Kredity. Jejich použití
podle výslovného přání zadavatele se liší od věty školního zadání požadující
výhradně AI vizuály; před odevzdáním je třeba tuto odchylku vyřešit.
Přijaté či odmítnuté návrhy AI podrobně uvádí dokumentace.

Původní projekt měl rok 2026 a širší žánrový záběr. Aktuální termín, skuteční
interpreti a vzhled vycházejí z upřesnění zadavatele. Tato specifikace popisuje
současný stav; nepředstírá původně odevzdaný dokument. Návaznost na schválené
první dva výstupy a rozsah změn musí doložit tým.
