# Progress 04 — podklad pro cross-review

## Co hodnotit

Otevřete `web/index.html`. Není potřeba instalace ani sestavení. `project-specification.md`
popisuje identitu, cílové skupiny, strukturu a scénáře. Tento review-ready balíček
je vytvořen z aktuální verze, nikoli vydáván za doložené dřívější odevzdání.

K dispozici jsou úvod, tři články novinek, program, 60 skutečných účinkujících s detaily, 3 scény, praktické
informace, hledání s výsledky, tarify na 1/2/3 dny, výběr míst, lokální účet,
košík a skutečně generovaný PDF soubor. Česká a anglická verze slouží různým
cílovým skupinám. Datová základna obsahuje 60 programových položek během 3 dnů. Line-up je návrh,
účast interpretů není potvrzená. Scény se dělí na mezinárodní hlavní jména, českou scénu a klubovou elektroniku.

## Scénáře k nezávislému průchodu

1. **S1 — program:** Zvolte první den a River Stage. Uložte vybranou akci.
   Přepněte osobní program a obnovte stránku. Zkontrolujte datum, scénu a zachování výběru.
2. **S2 — hledání:** Hledejte „DARKZY“, otevřete DARKZY a najděte navazující
   vystoupení. Ověřte vazbu na konkrétní datum a scénu, vyzkoušejte prázdný výsledek.
3. **S3 — vlastní dny a kemp:** Vyberte první a třetí srpen, dvě VIP vstupenky
   a ručně označte sedadla. Přidejte stan pro dvě osoby a potvrďte PULSE10.
   Zkontrolujte 2 360 − 236 + 650 = 2 774 Kč včetně modelové DPH.
   Projděte simulované dokončení jako host se smyšlenými kontakty. PDF má
   obě přesná data a samostatný campingový voucher; druhý srpen zůstává
   pro tato sedadla volný, pokud je neobsadila jiná lokální objednávka.
   Zkontrolujte rozpis slevy, kempu, daně, jméno a ID objednávky.

## Aktuální testování

`validation_report.md` obsahuje skutečný výsledek testů hotové verze. Je nutné
rozlišovat datovou kontrolu, automatizovaný průchod a expertní hodnocení.
Automatická kontrola šířek například potvrzuje nepřetékání v daných viewports,
ale neprokazuje dobrou srozumitelnost pro každého uživatele. PDF se posuzuje
jako soubor, ne pouze jako screenshot potvrzení objednávky.

## Známé limity předávané reviewerům

- Účty a obsazenost jsou lokální pro prohlížeč; neexistuje sdílená databáze ani skutečná platba.
- E-mail se automaticky neodesílá; objednávka poskytuje stažení PDF.
- Externí mapa se načte automaticky až po povolení v panelu soukromí a vyžaduje spojení se službou Google; zbývající obsah má zůstat čitelný bez ní.
- Fiktivní festivalová identita a kontakty nejsou ověřený reálný pořadatel; skuteční interpreti nemají potvrzenou účast.
- Úvodní fotografie areálu pochází z roku 2018 a nedokládá stav pro rok 2027; 42 karet má skutečné fotografie s kredity, 18 vlastní typografii.
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

## Změny podle nejnovější audiozpětné vazby

Tato zpětná vazba je od zadavatele, nikoli od přiděleného jiného týmu.
Program nově rozděluje 20/20/20 interpretů mezi hlavní mezinárodní jména,
českou scénu a klubovou elektroniku. Medailonky a konkrétní subžánry jsou v XML.
Nákup sjednocuje jeden, dva libovolné nebo tři dny; VIP a Regular vyžadují ruční
sedadla, stání množství. Objednávka přidá stan 350 Kč nebo karavan 850 Kč
plus 150 Kč za osobu na 3 noci. PULSE10/PRAHA200 se vztahují jen na vstupenky.
Rozpis ukazuje modelovou 12% DPH zahrnutou v cenách, nikoli další poplatek.
Registrace má příjmení, telefon a potvrzení hesla, profil lze upravit.

Offline plánek, podrobnější návštěvnické FAQ a skutečné fotografie novinek
pomáhají při cestě; soukromí, podmínky a obrazové kredity mají vlastní stránky.
Dva snímky (Hedex, AC Slater) mají CC BY-NC-SA 2.0 a patří pouze do nekomerčního
školního rozsahu. Zdroje a úpravy jsou v PHOTO-CREDITS.md a na stránce Kredity.
