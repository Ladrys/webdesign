# Cvičení 02 — poznámky k prezentaci

Projektová specifikace a data

**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Poznámky jsou příprava k mluvenému projevu; na Moodle se neodevzdávají.

## 1. Festival podle návštěvníka

[35 s] Prague Pulse Fest je fiktivní třídenní hudební festival. Navrhujeme web, který návštěvníka provede od otázky kdo hraje až k odpovídající vstupence. Někdo přijde na jednoho interpreta, jiný na celou scénu a další na všechny tři dny. Web má těmto lidem nabídnout správný rozsah vstupu a srozumitelnou cenu. Prvním výstupem je specifikace s cílovými skupinami, strukturou a scénáři a datová základna v XML. Autory projektu jsou Michal Ladra, Matěj Mlejnek a Jan Martínek.

## 2. Každý chce jiný rozsah návštěvy

[40 s] Cílové skupiny rozlišujeme podle cíle návštěvy. Fanoušek jednoho interpreta potřebuje najít jeho koncert a přejít na vstup pro daný den a scénu. Návštěvník více koncertů kombinuje filtry a osobní program a vybere si například první a třetí den. Návštěvník celého festivalu potřebuje jasně vidět, co společná vstupenka obsahuje a kde ještě zbývá kapacita. Všichni mají mít možnost zvolit jiný rozsah, vidět aktuální cenu a nakoupit bez povinného účtu. Mobilní ovládání a čeština s angličtinou podporují všechny tyto skupiny.

## 3. Stejná data pro program i nákup

[45 s] Základ obsahuje tři dny, tři scény, šedesát interpretů a šedesát vystoupení. Vystoupení odkazuje na interpreta, den a scénu pomocí ID, nikoli podle podobnosti názvu. Proto stejný objekt používá seznam, detail i nákup. Filtr dne a scény porovná ID, textové hledání porovná část názvu či popisu bez diakritiky a velikosti písmen. Kapacita scény pochází z dat; prodané vstupy se odvodí z objednávek pro daný den. XML je hlavní zdroj. Nástroj autora z něj připraví čtyři JSON exporty a stejná data přibalí do JavaScriptu. Při otevření webu už není potřebný server.

## 4. Jasná cesta mezi obsahem a nákupem

[35 s] Hlavní navigace propojuje program, účinkující, scény a praktické informace. Hledání má vlastní stránku s výsledky. Detail interpreta vede ke konkrétnímu koncertu a vstupence; scéna vede do svého programu a ukazuje dostupnost. Návštěvník tak navazuje na svůj výběr, nemusí stále začínat od úvodu. V nákupu upraví dny, scénu a kategorii a přejde do košíku. Po dokončení stáhne PDF. Účet nabídne profil a historii, ale objednávka funguje i pro hosta. Novinky, podmínky, soukromí a zdroje doplňují hlavní strukturu.

## 5. Dva konkrétní průchody webem

[45 s] S1 začíná v programu. Návštěvník vybere den a River Stage, uloží si koncerty a otevře osobní výběr. Očekáváme správné výsledky obou filtrů, zachování výběru po obnovení a upozornění na časové kolize. V S2 fanoušek vyhledá DARKZY, otevře jeho detail a přejde k odpovídajícímu vstupu. Předvolí se skutečný den koncertu a Club Stage, nikoli obecný třídenní vstup na všechny scény. Výběr může upravit. Třetí scénář ověřuje dva výslovně vybrané dny, automatický počet osob podle sedadel a shodnou cenu ve výběru, košíku i PDF.

## 6. Návrh od AI ověřujeme na datech

[40 s] Codex a ChatGPT pomohly rozebrat zadání, navrhnout strukturu webu, texty a práci s daty. Přijali jsme stabilní ID a propojení seznamu s detaily. Upravili jsme příliš obecné scénáře a nákup tak, aby vycházel z konkrétního dne a scény. Rozhodli jsme se pro klientský web a jednu datovou základnu. Ověření začíná XML proti XSD, počty a referencemi. Dále porovnáváme filtrované výsledky s daty a projdeme interpreta až ke vstupence a ceně v košíku. Chybu nelze omluvit tím, že ji vytvořila AI; tým musí umět postup vysvětlit a výsledek zkontrolovat.
