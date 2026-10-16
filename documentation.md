# Prague Rocks Festival — dokumentace

## Identita a návaznost

Aktuální název je **Prague Rocks Festival**, 1. ročník, 1.–3. srpna 2026. Základem je uživatelem dodaný `final_project.zip`, původně Prague Pulse Fest. Zůstávají tři dny, tři scény, 60 interpretů a 60 vystoupení. Areál Vltava Park je fiktivní festivalové uspořádání u reálné lokality Výstaviště Praha; navigační adresa je Výstaviště 67, 170 00 Praha 7. Modelový e-mail na doméně `.cz` a telefon jsou ilustrativní a nejsou ověřeným kontaktem pořadatele.

Poslední požadavky uživatele zahrnovaly přejmenování, asymetrii, CZ/EN, úvodní video, podobný typ navigace jako festival Rock for People, třídenní balíčky, Google mapu, jednotlivé portréty, méně technických upozornění v běžném toku a materiály pro jednotlivá cvičení. Převzata není žádná cizí značka ani obrazový/video obsah. Vlastní logo má originální kompozici a používá licencované Barlow Condensed. Přímý přístup na referenční web v tomto prostředí odmítal síťový proxy; návrh vychází z popisu uživatele a vlastní festivalové grafiky, nikoli tvrzeného auditu současného Rock for People.

Uživatel po upřesnění výslovně zvolil pouze školní verzi bez serveru. Web proto nepoužívá Node.js, databázi, backend ani povinný build. Skutečný serverový účet, hromadná rezervace, platební brána ani automatické odeslání e-mailu nejsou součástí této verze.

## Změny mezi verzemi a důvody

| Oblast | Změna | Důvod a ověření |
| --- | --- | --- |
| Identita | Prague Pulse Fest → Prague Rocks Festival, vlastní SVG loga a nové datumové bloky | Přímé zadání uživatele, konzistence XML/JSON/webu/prezentací |
| Úvod a navigace | Asymetrická sazba, nakloněný videoblok, plovoucí CTA, datum vedle loga, zaoblené hledání | Požadovaný festivalový charakter; měření sedmi šířek a vizuální kontrola |
| Texty | Odstraněny souřadnice a fráze „Tři dny. Žádná vata.“; běžné formuláře mají věcné názvy | Konkrétní uživatelská připomínka, kontrola obsahu |
| Jazyky | Česká a anglická verze včetně dynamických stavů a PDF | Potřeba zahraničních návštěvníků; přepínání nesmí změnit hodnoty filtrů |
| Data | 60 interpretů z XML místo první JSON stránky s 20 položkami; šest tarifů v XML | Konzistence datové základny a všech viditelných cen |
| Obrazy | 60 odlišných AI portrétů, stabilní mapování ID, zachované iniciály | Snazší rozlišení interpretů; kontrola 60 unikátních dvojic soubor/pozice |
| Vstupenky | Jednodenní i třídenní VIP/Regular/stání a popis obsahu balíčku | Třídenní produkt vyžaduje stejné místo volné ve všech dnech |
| Účet | Sedmidenní přihlášení, export/import JSON zálohy | Data se zachovají po zavření a lze je přenést bez serveru |
| Info/footer | Doprava, parking, ubytování, příběh prvního ročníku, kontakt, soukromí, podmínky a sociální platformy | Požadovaná informační architektura a věcný rozsah festivalu |
| Odevzdání | Složky 02–06, PPTX/PDF/poznámky, samostatný interaktivní prototyp a finální struktura | Přesné členění podle dodaného zadání |

Změny jsou dodatečnou implementací uživatelských požadavků a interní validace. Nejsou označovány jako výsledek skutečného cross-review ani konzultace, které nebyly dodány. Větší redesign a přejmenování přesahují drobné úpravy; tým musí doložit návaznost na schválené výstupy 1–2 a potvrdit rozsah změn s vyučujícím.

## Informační architektura a tři scénáře

Hlavní části tvoří úvod, Program, Účinkující, Scény, Info, Vyhledávání, Vstupenky, Košík a Účet. Footer doplňuje kotvy dopravy, parkování, ubytování, přístupnosti, historie, kontaktů, soukromí a podmínek. Detail interpreta navazuje na související program; detail akce na scénu a vstupenky daného dne. Podrobný účel, cílové skupiny a scénáře jsou v `project-specification.md`.

- **S1 – osobní program:** mobilní návštěvník zvolí den/scénu, uloží koncert a zobrazí pouze uložené; po obnově výběr zůstane.
- **S2 – konkrétní interpret:** fanoušek vyhledá část názvu, otevře detail a přejde na související vystoupení.
- **S3 – vstupenka:** host nebo přihlášený návštěvník porovná balíčky, vybere místo, zkontroluje objednávku a stáhne PDF. Alternativy ověřují zamítnutou platbu, změněný košík a obsazené místo.

## Datová základna

`data/festival.xml` je kanonické XML; kořenové `data.xml` je jeho identická kopie pro odevzdání. XML obsahuje festival, adresu, dny, scény, interprety, program, šest tarifů, odkazy a kontakty. ID a reference se validují proti XSD a podkladům. Původní `API/` uchovává XSLT, JSON schémata a datové příklady, nikoli běžící API.

Po aktualizaci XML byly jeho existující transformace znovu spuštěny do JSON. Volitelný `tools/generate_data.py` připravuje přibalený `web/js/data.js`; při běhu webu se nic netransformuje ani nestahuje pomocí fetch. Všech 60 interpretů se bere z XML, aby se nepřevzala jen stránkovaná JSON ukázka. Obsah interpretů a jejich vazby na program zůstávají odvoditelné z odevzdané datové základny.

Ceny jsou nyní přímo ve zdroji: třídenní Regular 990 Kč, VIP 1 590 Kč, stání 490 Kč; jednodenní Regular 390 Kč, VIP 590 Kč, stání 190 Kč. Popisy tarifů zahrnují konkrétní rozsah, například stejnou pozici na tři dny a modelové VIP parkování. Skript nákupu ceny nevede v nesouvisející druhé databázi.

## CZ/EN a vyhledávání

`web/js/i18n.js` uchovává volbu jazyka a překládá obsah, formuláře, popisky, dynamické stavy, dialogy a metadata. Nový úvod a navigace mají přímo obě varianty. Překlad nesmí změnit interní ID ani hodnoty `<option>`; jména, e-maily a identifikátory se nepřekládají. PDF používá stejný překladový slovník. Vyhledávání obsahujícího řetězce normalizuje velikost písmen a diakritiku a zahrnuje původní i lokalizované texty datových objektů. Prázdný a neúspěšný výsledek mají samostatné stavy.

Angličtina byla ověřena na všech devíti stránkách, po opětovném načtení, s filtrováním žánru a v samostatném průchodu anglického nákupu a PDF. V tomto průchodu audit nezjistil chybějící překlad. To není garance jazykové kvality všech možných uživatelských vstupů; vlastní jména se záměrně zachovávají.

## Místa, balíčky a objednávka

Model má 48 sedadel a 40 míst ke stání na den. Nový prohlížeč začíná bez obsazených míst. Jednodenní položka blokuje svou pozici jen v daném dni; třídenní všechny tři. Třídenní nabídka je dostupná jen při volné pozici ve všech dnech. Košík nevytváří rezervaci; kontrola se opakuje při dokončení. Objednávky jsou místní a nejsou synchronizované mezi návštěvníky nebo zařízeními.

Košík je oddělený podle účtu/hosta, registrace převezme výběr bez duplicit. Odebrání položky zachová zadané údaje. Pokud jiná karta změní košík, potvrzení nejprve zobrazí nový obsah/součet a vyžaduje další kontrolu. Ceny objednávky se odvozují z typu, nikoli libovolného uživatelského vstupu. Zamítnutí zkušební platby ponechá výběr. Souhlas odkazuje na podmínky a soukromí místo opakovaného technického banneru.

Platba nestrhává peníze; formulář si nežádá údaje karty. Označení této skutečnosti je soustředěné do dokončení objednávky a podmínek. Fikce festivalu zůstává uvedená ve footeru a dokumentaci, běžný obsah ji zbytečně neopakuje.

## Uložení účtu a JSON

`localStorage` uchovává účty, objednávky, košíky a oblíbené. Přihlášení má v `pulse:auth` expiraci sedm dnů a odhlášení jej odstraní. Registrace zůstává uložená po zavření webu; není to pouze životnost aktuální karty. Pro `file://` používá aplikace jednu vstupní stránku s parametrem, protože oddělování localStorage mezi soubory není jednotné napříč prohlížeči.

Heslo má 10–128 znaků a ukládá se jako PBKDF2-SHA256 hash se 120 000 iteracemi a náhodnou 16bajtovou solí. Otevřený text hesla se neukládá. Nejde o produkční ověření identity: uživatel má úplnou kontrolu nad místním úložištěm. JSON záloha obsahuje profily s hashi a objednávky, nikoli přihlášení. Uživatel ji stáhne a může obnovit ve stejném či jiném prohlížeči; validuje se formát, ceny a základní reference. Import je slučovací, duplicitní záznamy nepřidává, konfliktní účty neignoruje. Neplatná záloha nesmí přepsat existující data.

**JSON soubor se na disku automaticky nepřepisuje.** Bez backendu nebo výslovně povoleného přístupu prohlížeče k souboru to nelze slibovat. Tato verze používá skutečný ruční export/import. Neobsahuje skrytý server ani předstíraný souborový účet.

Vstupy se escapují, délky a e-mail kontrolují formuláře; hledaný text není spustitelný regex. V aplikaci neexistuje SQL. Chybný formát účtů nezpůsobí prázdnou stránku, selhání zápisu zobrazí stav. Podrobnosti úložiště jsou soustředěné na stránku soukromí a do dokumentace.

## PDF, video, fotografie a mapa

PDF je skutečný vícestránkový dokument vytvořený jsPDF přímo v prohlížeči. Knihovny a licencované fonty jsou lokální a načtou se až na vyžádání. Každá vstupenka má vlastní A5 stránku, český/anglický text, kategorii, konkrétní místo, datum nebo celý rozsah tří dnů, cenu a ID objednávky. QR obsahuje pouze identifikátor, ne osobní údaje. Nemá serverové ověření platnosti. PDF výslovně neprokazuje platbu ani nárok na skutečnou akci. E-mail se automaticky neodesílá.

Krátké tiché video má lokální WebM a MP4 variantu. Jde o desetisekundovou animaci vlastního AI koncertního obrázku, nikoli převzatý koncertní film. Má poster a ovládání pauzy, nespustí se při preferenci omezeného pohybu a pozastaví se po skrytí karty. Původ je v `web/images/ROCKS-ASSETS.md`.

Šedesát různých portrétů vzniklo AI jako čtyři mřížky po šestnácti snímcích. Používá se 60 polí, každé stabilně podle XML ID; CSS výřez při filtrování nemění identitu. WebP soubory mají dohromady přibližně 1,1 MB. Iniciály jsou zachované jako překryv. Původ, reprezentativní prompt a limity jsou v `web/images/performers/README.md`.

Google Maps se do stránky vloží teprve po stisku tlačítka. Uživatel má i běžný odkaz na skutečnou lokalitu. Testy ověřily odložené vložení a správnou URL s lokálním testovacím obsahem; neověřují síťovou dostupnost skutečných Google map v každém prostředí. Sociální odkazy vedou na veřejné platformy, nikoli vymyšlené ověřené festivalové účty.

## UX, responzivita, sémantika a SEO/AEO

Flexbox slouží navigaci, akcím a formulářovým řádkům; Grid programu, přehledům a mapě. Pružné hodnoty a breakpointy reagují na prostor, nikoli model telefonu. Testovaly se šířky 320, 375, 430, 768, 1024, 1440 a 1920 px včetně vyplněného košíku. Zvýšení systémového textu, jiné enginy a fyzické telefony nejsou tímto testem plně pokryté.

Používají se header/nav/main/section/article/aside/footer, popisky formulářů, time a address podle významu. Odkaz přeskočení navigace, viditelný focus, nativní dialog, stavové oblasti a textové popisy obsazenosti doplňují klávesové ovládání. Výběr sedadla a oblíbené akce zachová focus. Nadpisy seznamů udržují návaznost h1–h2–h3. Nejde o certifikaci WCAG AA ani plnou HTML validaci.

Každá stránka má konkrétní title, description, jazyk, viewport a Open Graph text. Přepnutí jazyka aktualizuje prezentaci a metadata. JSON-LD Festival odpovídá skutečně viditelnému názvu, termínu a lokaci; neobsahuje vymyšlená hodnocení. FAQ jsou věcné a obsahové entity propojené. Bez reálné produkční domény se nevymýšlí canonical a sitemap. Skriptované vykreslení může být omezením pro jednodušší crawlery; pro veřejný provoz by pomohl statický obsahový export.

Primární podklady pro další ověření aktuálních doporučení:

- Google Search Central, [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): konkrétní titulky, srozumitelná struktura, odkazy a užitečný obsah.
- Google Search Central, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): neexistuje zde tvrzený zvláštní „AI SEO“ trik; prioritou je dostupný relevantní obsah a pravdivá strukturovaná data.
- W3C WAI, [Page Structure Tutorial](https://www.w3.org/WAI/tutorials/page-structure/): struktura, nadpisy a landmarky.

Konkrétní zásady výše jsou implementované a ověřitelné v kódu. Přímé načtení těchto webů síť v této relaci odmítla, proto není tvrzena nová kompletní online rešerše trendů ani externí SEO/AEO audit. Tým má zdroje před odevzdáním otevřít a doplnit vlastní aktuální zjištění. Není garantována indexace ani doporučení generativními vyhledávači.

## Odevzdání, prezentace a cross-review

`odevzdani/` má složky pro cvičení 02–06 a finální `projekt/` v přesné struktuře zadání. PPTX mají editovatelné texty a poznámky, PDF zachovávají vzhled; samostatné poznámky počítají přibližně se čtyřmi minutami. Prototyp cvičení 03 je nově sestavený samostatný wireframe s reálnými filtry, oblíbenými, hledáním a detailem.

Materiály jsou **dodatečně sestavené ukázky milníků**, ne falešné doklady dřívějšího odevzdání. Cvičení 04 a 05 používají stejnou současnou implementaci, protože historické verze nebyly dodány. Cvičení 06 obsahuje metodu a tabulku pro doplnění skutečného cizího projektu; není vydáváno za dokončený posudek.

Skutečné přijaté cross-review chybí. `review/received-review.md` to výslovně uvádí. Vlastní ověřené nálezy a úpravy jsou odděleně v `review/internal-review.md` (heuristická kontrola a kognitivní průchod). Tým musí doplnit jména, spolupráci, časovou osu, skutečný přidělený projekt a jeho hodnocení, přijatý posudek a schválení rozsahu změn. Tyto údaje nejsou nahrazené smyšlenými tvrzeními.

## Použití AI a ověření výstupů

Codex byl použit pro rozbor zadání, implementaci, české/anglické texty, SVG identitu, PDF, prezentace a testy. OpenAI Image Generation vytvořil koncertní scénu a čtyři sady fiktivních hudebníků. FFmpeg připravil animovaný vizuál a optimalizované obrázky; vlastní výtvarný obsah se nepřebíral z referenčního festivalu. Reprezentativní zadání: „asymetrický festivalový web“, „CZ/EN“, „3 dny VIP/Regular/stání“, „60 různých interpretů s iniciálami“, „prezentace podle výstupů cvičení“.

Výstupy se kontrolovaly XML/XSD a transformacemi, browserovými průchody, porovnáním cen/vazeb, dekódováním QR, rozborem PDF, měřením layoutu, vizuální prohlídkou a kontrolou PPTX/poznámek. Byly opraveny chyby inicializace třídenního košíku, escapování fotografií, focusu, zalamování formuláře a ztracených vstupů. Kopie cizího loga a backend odporující zadání byly odmítnuty. Limity AI zahrnují možné obrazové nepřesnosti a nutnost lidské kontroly překladu; přínosem je rychlé vytvoření rozsahu, nikoli automatický důkaz správnosti.

Přesné aktuální výsledky jsou v `validation_report.md`, prototypové a prezentační kontroly také v podkladech cvičení 03. Otevření `file://` v tomto spravovaném prohlížeči blokuje politika; nebylo obcházeno a neoznačuje se za úspěšně provedený test. Historii AI práce před dodáním původního projektu doplní tým.
