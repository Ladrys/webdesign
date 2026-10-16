# Progress 04 — podklad pro cross-review

## Co hodnotit

Otevřete `web/index.html`. Není potřeba instalace ani sestavení. `project-specification.md`
popisuje identitu, cílové skupiny, strukturu a scénáře. Tento review-ready balíček
je vytvořen z aktuální verze, nikoli vydáván za doložené dřívější odevzdání.

K dispozici jsou úvod, program, 60 účinkujících s detaily, 3 scény, praktické
informace, hledání s výsledky, třídenní tarify, výběr míst, lokální účet,
košík a skutečně generovaný PDF soubor. Česká a anglická verze slouží různým
cílovým skupinám. Datová základna obsahuje 60 vystoupení během 3 dnů.

## Scénáře k nezávislému průchodu

1. **S1 — program:** Zvolte první den a River Stage. Uložte vybranou akci.
   Přepněte osobní program a obnovte stránku. Zkontrolujte datum, scénu a zachování výběru.
2. **S2 — hledání:** Hledejte „Neon“, otevřete Neon Wave a najděte navazující
   vystoupení. Ověřte vazbu na konkrétní datum a scénu, vyzkoušejte prázdný výsledek.
3. **S3 — vstupenka:** Porovnejte třídenní tarify, vyberte vstupenku nebo místa,
   zkontrolujte košík a projděte zkušební dokončení jako host se smyšlenými údaji.
   Stáhněte PDF a zkontrolujte cenu, ID a jméno. Zkuste návrat na výběr míst.

## Aktuální testování

`validation_report.md` obsahuje skutečný výsledek testů hotové verze. Je nutné
rozlišovat datovou kontrolu, automatizovaný průchod a expertní hodnocení.
Automatická kontrola šířek například potvrzuje nepřetékání v daných viewports,
ale neprokazuje dobrou srozumitelnost pro každého uživatele. PDF se posuzuje
jako soubor, ne pouze jako screenshot potvrzení objednávky.

## Známé limity předávané reviewerům

- Účty a obsazenost jsou lokální pro prohlížeč; neexistuje sdílená databáze ani skutečná platba.
- E-mail se automaticky neodesílá; objednávka poskytuje stažení PDF.
- Externí mapa vyžaduje spojení se službou Google; zbývající obsah má zůstat čitelný bez ní.
- Fiktivní festivalová identita a kontakty nejsou ověřený reálný pořadatel.
- Neproběhl plný audit WCAG AA, fyzické telefony ani všechny prohlížeče.
- Skutečné přijaté cross-review zatím nebylo dodáno. Technické testy nejsou jeho náhradou.

## Prosba pro hodnotící tým

U nálezu uveďte stránku, přesné kroky, očekávaný a skutečný stav, metodu,
závažnost, důvod a návrh řešení. Doporučené metody: Nielsenovy heuristiky
a kognitivní průchod dvou scénářů; doplňte klávesnici a mobilní šířku.
Oddělte problém použitelnosti od vlastní preference grafického stylu.

## AI a odpovědnost

AI pomohla připravit obsah, kód, původní grafiku a automatizované testy.
Přijaté a odmítnuté návrhy i limity popisuje dokumentace. Každý výsledek
cross-review musí hodnotitel ověřit sám. Zde nepředkládáme smyšlené nálezy
cizího týmu ani nedoložená uživatelská měření.
