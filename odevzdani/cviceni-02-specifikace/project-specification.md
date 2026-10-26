# Prague Pulse Fest

## Projektová specifikace

**Webdesign · 2026/2027**

Michal Ladra · Matěj Mlejnek · Jan Martínek

## 1. Identita festivalu

| Vlastnost          | Hodnota                                                                     |
| :---               | :---                                                                        |
| Název              | Prague Pulse Fest                                                           |
| Ročník             | 1. ročník · 2027                                                            |
| Lokalita           | Vltava Park u Výstaviště Praha                                              |
| Adresa pro navigaci | Výstaviště 67, 170 00 Praha 7                                               |
| Termín             | 1.–3. srpna 2027                                                            |
| Charakter          | Třídenní městský hudební festival                                           |
| Hlavní žánry       | Rock, pop, český rap, drum and bass, UK garage, bass house, techno          |

Jde o fiktivní festival se třemi scénami: mezinárodní Main Hall,
česká River Stage a elektronická Club Stage.

## 2. Účel a cíle webu

Návštěvník má zjistit **kdo, kdy a kde vystupuje**, naplánovat si návštěvu
a vybrat vstupenku na odpovídající scény a dny. Nemá kupovat širší vstup,
pokud chce navštívit jen jednu scénu.

Web má umožnit:

- najít interpreta a jeho konkrétní vystoupení;
- filtrovat program a uložit si vlastní výběr koncertů;
- vidět cenu a zbývající kapacitu vybrané scény pro daný den;
- upravit rozsah vstupu, projít objednávku a stáhnout PDF;
- zjistit dopravu, zázemí a orientaci v areálu.

## 3. Cílové skupiny

### Fanoušek konkrétního interpreta

Zná jméno, potřebuje zjistit datum a scénu. Očekává vyhledávání, přehledný
detail a přímý přechod na odpovídající jednodenní vstupenku.

### Návštěvník více koncertů

Vybírá podle dne, scény nebo žánru. Potřebuje filtry, osobní program,
upozornění na časové kolize a vstup na jednu či více scén.

### Návštěvník celého festivalu

Chce všechny tři dny, přehled kategorií a výhod společného vstupu.
Očekává jednoznačnou platnost, cenu a dostupnost na všech scénách.

### Přijíždějící a zahraniční návštěvník

Potřebuje dopravu, parkování, pobyt a plánek. Očekává použitelné mobilní
rozhraní a možnost přepnout celý web do angličtiny.

### Vracející se návštěvník

Chce znovu otevřít objednávku a vstupenky. Potřebuje profil a historii;
registrace přitom není podmínkou nákupu.

## 4. Informační architektura

```text
Úvod
├── Program → detail vystoupení → interpret / scéna / vstupenka
├── Účinkující → seznam a filtry → detail → vystoupení / vstupenka
├── Scény → kapacita a zázemí → program / vstupenka
├── Info → doprava, plánek, parkování, kemp, FAQ a kontakt
├── Vyhledávání → výsledky → příslušný detail
├── Vstupenky → výběr → košík → objednávka → PDF
├── Účet → přihlášení / registrace → profil a historie
└── Novinky · Soukromí · Podmínky · Kredity
```

**Hlavní navigace:** Program, Účinkující, Scény, Info, Účet, Košík a Vstupenky.
Logo vrací na úvod. Vyhledávání a přepínač CZ/EN jsou společné celému webu.
Novinky jsou dostupné z úvodu a patičky.

Obsahové detaily jsou propojené přes ID: interpret vede ke svému vystoupení,
vystoupení ke scéně a nákup převezme správný den a scénu.

## 5. Klíčové uživatelské scénáře

### S1 · Sestavit osobní program

- **Uživatel:** návštěvník na telefonu.
- **Cíl:** najít koncerty na zvolený den a scénu a uchovat svůj výběr.
- **Výchozí situace:** zná den návštěvy, nezná jednotlivá vystoupení.
- **Postup:** Program → den a scéna → uložit koncerty → osobní program.
- **Výsledek:** seznam odpovídá filtrům, výběr zůstane po obnovení stránky
  a případné časové kolize jsou označené.

### S2 · Najít interpreta a odpovídající vstup

- **Uživatel:** fanoušek DARKZY.
- **Cíl:** zjistit čas koncertu a vybrat vstup pouze na potřebnou scénu a den.
- **Výchozí situace:** zná jméno, nezná datum ani scénu.
- **Postup:** hledání → detail interpreta → jeho vystoupení → vstupenka.
- **Výsledek:** nákup předvolí Club Stage a den koncertu; návštěvník vidí
  dostupnost a cenu, může výběr změnit a přidat ho do košíku.

### S3 · Koupit vstup na dva vybrané dny

- **Uživatel:** host bez účtu, který přijde 1. a 3. srpna.
- **Cíl:** vybrat dva dny a dvě VIP sedadla bez nákupu prostředního dne.
- **Výchozí situace:** na nabídce vstupenek si zvolí požadovaný rozsah scén.
- **Postup:** dvoudenní vstup → oba dny → sedadla → košík → kontakty → PDF.
- **Výsledek:** jsou povinné dva různé dny, počet osob odpovídá sedadlům,
  změny okamžitě přepočítají cenu a PDF obsahuje stejné dny, scénu a místa.

S1–S3 jsou základem implementace a ověřování. Wireframe v `prototype/`
pokrývá S1 a S2 včetně předvolby jednodenního stání a vložení do košíku.
Dvoudenní nákup S3 a dokončení objednávky ověřuje hotový web.

## 6. Datová základna a její využití

**Rozsah:** 3 dny · 3 scény · 60 účinkujících · 60 vystoupení.

Zdrojová data jsou v `data/festival.xml`. Soubor `data.xml` je stejná
odevzdávací kopie. XSD kontroluje strukturu, datové typy a reference.

- **Festival** obsahuje identitu, termín, místo, kontakty a tarify.
- **Den** má ID, datum a otevírací dobu.
- **Scéna** má ID, název, popis, kapacitu a nabídku kategorií.
- **Interpret** má ID, jméno, žánr, medailonek a hudební odkazy.
- **Vystoupení** má ID, čas a odkazy na existující den, scénu a interpreta.

Stejné objekty se používají v seznamu, detailu, filtrech i předvolbě nákupu.
Dny a scény se filtrují podle ID; jméno, žánr a popis podle textové shody.
Výsledky programu se řadí chronologicky.

```text
XML + XSD → generátor → JSON exporty a přibalená data webu
                                      ↓
                  program · hledání · detaily · ceny a kapacity
```

JSON je přehledný export pro kontrolu a další použití dat. Hotový web má
stejný obsah připravený v `web/js/data.js`, takže se otevře bez serveru.
Účty a objednávky jsou oddělený stav prohlížeče; zdrojové XML nemění.

## 7. Interaktivní funkce

1. **Kombinované filtry:** den, scéna a další volby zúží program podle návštěvy.
2. **Vyhledávání:** hledá část zadaného textu napříč daty, bez rozlišení
   velikosti písmen a diakritiky; výsledky vedou na odpovídající detail.
3. **Osobní program:** ukládá ID koncertů a označuje překryvy časů.
4. **Kontextový nákup:** přebírá den a scénu z vystoupení, ukazuje dostupnost
   a průběžně přepočítává výběr i košík.
5. **Účet a historie:** uchovají kontakt, datum registrace a vlastní objednávky.

## 8. Model vstupenek a kapacity

Vstup platí na **jednu scénu nebo všechny scény** a na **jeden, dva vybrané
nebo všechny tři dny**. Detail interpreta předvolí jednodenní vstup na scénu
jeho vystoupení; tento rozsah lze upravit.

- **Main Hall:** 5 000 osob — 16 VIP a 32 Regular sedadel, 4 952 míst ke stání.
- **River Stage:** 3 000 míst ke stání.
- **Club Stage:** 1 500 míst ke stání.

Kapacity představují návrh uspořádání festivalu. Společný vstup započítává
jednu osobu do každé scény a dne své platnosti; samostatný jen do vybrané
scény. VIP a Regular znamenají sedadlo v Main Hall, na ostatních scénách stání.

Zobrazené údaje rozlišují celkovou kapacitu, prodané a zbývající vstupy.
Košík sám místo neprodává. Před dokončením se znovu ověří cena, sedadla
a všechny dotčené kapacity. Dvoudenní vstup vyžaduje dvě různé zvolené
hodnoty; u sedadel se počet osob odvozuje přímo z jejich výběru.

Běžné sety různých scén se mohou překrývat. Každý večer navazují závěrečné
koncerty River → Club → Main Hall s 30 minutami na přesun.

## 9. Technické řešení a ověření

Web používá HTML, CSS a JavaScript s mobile-first rozložením, českou
a anglickou verzí. Funguje bez instalace, buildu a vlastního backendu.
Účty a objednávky uchovává prohlížeč; platba je zkušební a e-mailová
služba není připojená. Podrobnosti ukládání popisuje `documentation.md`.

AI pomáhá s návrhem, texty a implementací. Přijaty jsou vazby přes ID;
upraveny byly scénáře a rozsah nákupu. Ověření porovnává XML, exporty,
filtrované výsledky, výběr vstupu, košík a obsah PDF. Konkrétní výsledky
jsou v `validation_report.md`.
