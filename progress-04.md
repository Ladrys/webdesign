# Progress 04 — Prague Pulse Fest
**Cvičení 5 · 24. listopadu 2026**  
Michal Ladra · Matěj Mlejnek · Jan Martínek

## Aktuální stav
Po rozbalení otevřete `web/index.html` v prohlížeči s povoleným JavaScriptem. K prezentaci slouží přímo web. Specifikace je v `project-specification.md`. Katalog obsahuje tři festivalové dny, tři scény, 60 účinkujících a 60 vystoupení. Přehled i samostatné profily účinkujících, hledání, praktické informace, plánek, vstupenky, košík a osobní výběr fungují česky a anglicky.

## Změny po připomínkách vyučujícího
- Odkazy v hlavní navigaci mají písmo 1 rem (při běžném nastavení 16 px). Otevřené mobilní menu začíná dvojicí Program a Můj program. Hledání a přepínač jazyka následují za odkazy.
- Program se otevře na prvním festivalovém dni. Každá scéna má vlastní sloupec a stejnou půlhodinovou osu. Souběžné koncerty začínají ve stejné výšce. Na úzkém displeji lze posunout osu do strany, zvolit jedinou scénu nebo přepnout na seznam.
- Můj program se otevírá přímo z navigace i ze stránky účtu. Ukáže uložené koncerty za všechny dny včetně časových kolizí. Výběr se ukládá do prohlížeče již hostovi a přetrvá po registraci, přihlášení i odhlášení.

## Dva průchody pro hodnotitele
1. **Naplánovat návštěvu.** Otevřete Program a na 1. srpna porovnejte koncerty ve 12:30. Uložte dvě souběžná vystoupení. Přes navigaci otevřete Můj program. Očekávejte oba koncerty a upozornění na kolizi. Obnovte stránku, jeden koncert odeberte a ověřte, že druhý zůstává a upozornění zmizelo.
2. **Najít interpreta a vstup.** Do hlavního hledání napište DARK. Z výsledků otevřete DARKZY, z jeho profilu pokračujte na vstupenky a porovnejte předvolený den a scénu s koncertem. Přidejte vstup do košíku. Pro dokončení ukázky použijte smyšlené údaje. Po potvrzení vznikne PDF a v plánku se změní kapacita odpovídající scény a dne.

## Testování
- Automatizované průchody v Chrome kontrolovaly umístění tří souběžných koncertů, shodu počtu položek osy a seznamu, filtrování, uložení a zachování výběru po přihlášení. Druhý průchod ověřil profil DARKZY a přenos přesného dne a scény do objednávky.
- Nákupní scénář ověřil dvě vstupenky, promo PULSE10, stan a konečnou cenu 848 Kč, odmítnutou platbu, úspěšnou objednávku, tři stránky PDF a změny kapacit podle dne. Otestovaly se také sdílená sedadla, lokální účet a otevření webu z disku.
- Na 14 stránkách v obou jazycích byly zkontrolovány nadpis H1, duplicitní identifikátory, diagnostika překladu a vodorovné přetékání při šířkách 320, 375, 768, 1024 a 1440 px.
- Při kontrole vstupů jsme prověřili vykreslení vyhledávacího dotazu a uložených údajů objednávky. Test s textem obsahujícím závorky HTML ověřil, že hledání nevytvoří nový HTML prvek. Neplatný ročník uložené objednávky se při načtení převede na výchozí číselný rok.

## Známá omezení
Účty, oblíbené koncerty, objednávky i obsazenost patří jednomu prohlížeči. Po vymazání místních dat se ztratí. Platba je simulace a QR kód nemá serverové ověření. Vlastní plánek funguje offline, externí mapa vyžaduje internet a souhlas. Testy využily Chrome a simulované šířky displeje. Úplná shoda s WCAG AA, fyzický iPhone a hlasová čtečka zůstávají neověřené. V uvedených průchodech jsme nezjistili blokující chybu.

## Použití AI a ověření
Codex pomohl s časovou osou, navigací, překladem a automatizací kontrol. Změnu osy jsme ověřili porovnáním vykreslených pozic tří skutečných položek katalogu. Oddělení účtu a oblíbených koncertů jsme ověřili registrací, odhlášením a návratem k původnímu výběru. Projekt používá festivalové ilustrace z OpenAI Image Generation. Dřívější návrhy prezentací připravil Claude. Připomínky výše pocházejí od vyučujícího. Hodnocení přiděleného cizího webu vznikne po jeho předání pro cvičení 6.
