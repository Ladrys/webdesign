# Prague Pulse Fest — dokumentace

## Identita a návaznost

Aktuální název je **Prague Pulse Fest**, 1. ročník, 1.–3. srpna 2027. Základem je uživatelem dodaný `final_project.zip`, původně Prague Pulse Fest. Zůstávají tři dny, tři scény, 60 interpretů a 60 programových položek. Areál Vltava Park je fiktivní festivalové uspořádání u reálné lokality Výstaviště Praha; navigační adresa je Výstaviště 67, 170 00 Praha 7. Modelový e-mail na doméně `.cz` a telefon jsou ilustrativní a nejsou ověřeným kontaktem pořadatele.

Poslední požadavky uživatele navázaly na obnovení názvu, asymetrii, CZ/EN a navigaci inspirovanou festivalem Rock for People. Aktuálně přidávají tmavou hlavičku přes celou šířku, úvodní statický obraz místo videa, logo bez zvukových sloupců, skutečné interprety, články novinek, rychlý nákup množství, promo kódy a výběr zkušební platební metody. Uživatel poskytl HTML úvodní stránky Rock for People; bylo prohlédnuto jako reference struktury hlavičky, zaoblených ovládacích prvků a patičky. Cizí skripty se nespouštěly. Z referenčního Rock for People se nepřebírá značka ani obrazový/video obsah. Skutečné fotografie z Wikimedia Commons se používají s konkrétní licencí a uvedením autorství. Vlastní logo má originální kompozici a používá licencované Barlow Condensed. Referenční struktura byla posuzována nad HTML dodaným uživatelem; není tvrzen kompletní audit provozu referenčního festivalu.

Uživatel po upřesnění výslovně zvolil pouze školní verzi bez serveru. Web proto nepoužívá Node.js, databázi, backend ani povinný build. Skutečný serverový účet, hromadná rezervace, platební brána ani automatické odeslání e-mailu nejsou součástí této verze.

## Změny mezi verzemi a důvody

| Oblast | Změna | Důvod a ověření |
| --- | --- | --- |
| Identita a termín | Obnoven původní Prague Pulse Fest, termín 1.–3. srpna 2027, vlastní SVG loga | Výslovná oprava názvu a volba nového ročníku uživatelem; konzistence XML/JSON/webu/prezentací |
| Úvod a navigace | Tmavá hlavička přes celou šířku, typografické logo bez zvukových sloupců, skutečná fotografie Výstaviště z roku 2018, kompaktní navigace a CZ/EN | Nejnovější požadavek na vzhled; video z předchozí verze se již na úvodu nepřehrává |
| Odpočet | Data z festivalových dnů, časová zóna Europe/Prague, stavy před festivalem / probíhá / skončil | Festival byl přesunut na budoucí ročník; odpočet nesmí být záporný ani odvozovat rok z hodin návštěvníka |
| Texty | Odstraněny souřadnice a fráze „Tři dny. Žádná vata.“; běžné formuláře mají věcné názvy | Konkrétní uživatelská připomínka, kontrola obsahu |
| Jazyky | Česká a anglická verze včetně dynamických stavů a PDF | Potřeba zahraničních návštěvníků; přepínání nesmí změnit hodnoty filtrů |
| Data | 60 skutečných interpretů a jejich medailonky v XML, stabilní ID a vazby; šest tarifů | Nejnovější výslovná volba uživatele; line-up je návrh a účast není potvrzená |
| Obrazy | 41 licencovaných fotografií interpretů, 19 typografických náhrad a historická fotografie Výstaviště | Po uživatelově úpravě síťového přístupu byly fotografie skutečně získány, s uvedením zdroje, autora, licence a úprav |
| Vstupenky | Konečné ceny VIP/Regular/stání na úvodu, množství 1–8 a výběr dne nebo tří dnů | Zkrácení cesty k nákupu při zachování kontroly míst všech dnů |
| Košík | Jméno, příjmení, e-mail, telefon, dva promo kódy a sedm simulovaných platebních metod | Přehledný součet a skutečně aplikovaná sleva; žádné reálné platební rozhraní |
| Novinky | Tři články a jejich přehled na úvodu | Funkční odkaz vede na celý článek a uchovává zvolený jazyk |
| Účet a objednávka | Sedmidenní přihlášení, historie a stažení PDF; odstraněna tlačítka tisku a zálohy | Požadavek na jednodušší běžný tok; perzistence zůstává v místním úložišti |
| Soukromí a mapa | Panel s nezbytným ukládáním a volbou externích map, automatické vložení mapy po povolení | Skutečná volba uživatele; odvolání mapu odstraní, bez analytiky |
| Info/footer | Doprava, parking, ubytování, příběh prvního ročníku, kontakt, soukromí, podmínky a sociální platformy | Požadovaná informační architektura a věcný rozsah festivalu |
| Odevzdání | Složky 02–06, PPTX/PDF/poznámky, samostatný interaktivní prototyp a finální struktura | Přesné členění podle dodaného zadání |

Změny jsou dodatečnou implementací uživatelských požadavků a interní validace. Nejsou označovány jako výsledek skutečného cross-review ani konzultace, které nebyly dodány. Obnovení původního názvu nemění původní identitu. Větší redesign, přechod na skutečné interprety a posun termínu však vyžadují doložit návaznost na schválené výstupy 1–2 a potvrdit rozsah změn s vyučujícím.

## Informační architektura a tři scénáře

Hlavní části tvoří úvod, Novinky, Program, Účinkující, Scény, Info, Vyhledávání, Vstupenky, Košík a Účet. Footer doplňuje kotvy dopravy, parkování, ubytování, přístupnosti, historie, kontaktů, soukromí a podmínek. Detail interpreta navazuje na související program; detail akce na scénu a vstupenky daného dne. Podrobný účel, cílové skupiny a scénáře jsou v `project-specification.md`.

- **S1 – osobní program:** mobilní návštěvník zvolí den/scénu, uloží koncert a zobrazí pouze uložené; po obnově výběr zůstane.
- **S2 – konkrétní interpret:** fanoušek vyhledá část názvu, otevře detail a přejde na související vystoupení.
- **S3 – vstupenka:** host nebo přihlášený návštěvník porovná balíčky, vybere místo, zkontroluje objednávku a stáhne PDF. Alternativy ověřují zamítnutou platbu, změněný košík a obsazené místo.

## Datová základna

`data/festival.xml` je kanonické XML; kořenové `data.xml` je jeho identická kopie pro odevzdání. XML obsahuje festival, adresu, dny, scény, interprety, program, šest tarifů, odkazy a kontakty. ID a reference se validují proti XSD a podkladům. Původní `API/` uchovává XSLT, JSON schémata a datové příklady, nikoli běžící API.

Po aktualizaci XML byly jeho existující transformace znovu spuštěny do JSON. Volitelný `tools/generate_data.py` připravuje přibalený `web/js/data.js`; při běhu webu se nic netransformuje ani nestahuje pomocí fetch. Všech 60 interpretů se bere z XML, aby se nepřevzala jen stránkovaná JSON ukázka. Obsah interpretů a jejich vazby na program zůstávají odvoditelné z odevzdané datové základny. Skutečná jména a biografické medailonky (např. David Guetta, Katy Perry, Skrillex a DARKZY) se změnily přímo v XML i odvozených JSON; identifikátory i1–i60 zůstaly zachované. Účast není potvrzená. Noisia ukončila společné působení v roce 2022 a datová položka a20 je archivní poslechový blok, nikoli oznámení živého koncertu nebo návratu. Každé vystoupení a každý festivalový den mají rok 2027.

Ceny jsou nyní přímo ve zdroji: třídenní Regular 990 Kč, VIP 1 590 Kč, stání 490 Kč; jednodenní Regular 390 Kč, VIP 590 Kč, stání 190 Kč. Popisy tarifů zahrnují konkrétní rozsah, například stejnou pozici na tři dny a modelové VIP parkování. Skript nákupu ceny nevede v nesouvisející druhé databázi.

## CZ/EN a vyhledávání

`web/js/i18n.js` uchovává volbu jazyka a překládá obsah, formuláře, popisky, dynamické stavy, dialogy a metadata. Nový úvod a navigace mají přímo obě varianty. Překlad nesmí změnit interní ID ani hodnoty `<option>`; jména, e-maily a identifikátory se nepřekládají. PDF používá stejný překladový slovník. Vyhledávání obsahujícího řetězce normalizuje velikost písmen a diakritiku a zahrnuje původní i lokalizované texty datových objektů. Prázdný a neúspěšný výsledek mají samostatné stavy.

Překladové kontroly zahrnují obsahové stránky, filtry, dokončení objednávky a PDF. Přesný rozsah a výsledek pro aktuální verzi zaznamenává `validation_report.md`. Výsledek jednotlivého průchodu není garance jazykové kvality všech možných uživatelských vstupů; vlastní jména se záměrně zachovávají.

## Místa, balíčky a objednávka

Model má 48 sedadel a 40 míst ke stání na den. Nový prohlížeč začíná bez obsazených míst. Jednodenní položka blokuje svou pozici jen v daném dni; třídenní všechny tři. Třídenní nabídka je dostupná jen při volné pozici ve všech dnech. Košík nevytváří rezervaci; kontrola se opakuje při dokončení. Objednávky jsou místní a nejsou synchronizované mezi návštěvníky nebo zařízeními.

Košík je oddělený podle účtu/hosta, registrace převezme výběr bez duplicit. Odebrání položky zachová zadané údaje. Pokud jiná karta změní košík, potvrzení nejprve zobrazí nový obsah/součet a vyžaduje další kontrolu. Ceny objednávky se odvozují z typu, nikoli libovolného uživatelského vstupu. Zamítnutí zkušební platby ponechá výběr. Souhlas odkazuje na podmínky a soukromí místo opakovaného technického banneru.

Rychlý nákup nabízí 1–8 vstupenek podle kategorie a rozsahu dne nebo tří dnů; volné pozice vybírá ze stejné mapy jako ruční výběr. Pokud požadovaný počet není dostupný, nesmí vzniknout částečně přidaná objednávka. Ceny již zahrnují poplatky a rozpis ukazuje poplatek za objednávku 0 Kč.

Dokončení má samostatné jméno, příjmení, e-mail a telefon. Telefon se ověřuje jako 9–15 číslic a běžné oddělovače; formulářové limity a escapování chrání vykreslování. `PULSE10` snižuje součet o 10 % se zaokrouhlením na koruny, `PRAHA200` o 200 Kč, nejvýše však do výše součtu. Používá se vždy jeden kód. Neznámý kód se odmítne, změněný kód je nutné znovu potvrdit. Při dokončení se částky přepočítají z platných tarifů, nikoli z upraveného HTML nebo uložené ceny v košíku. Nová objednávka uchová `subtotal`, `discount`, `total`, `promoCode` a `paymentMethod`; historie a PDF ponechávají rozpis. Starší objednávky bez slevy zůstávají čitelné.

Nabízené metody jsou platební karta, bankovní převod, hotovost na pokladně, Apple Pay, Google Pay, Benefit Plus a faktura. Všech sedm je výslovně simulovaných, bez spojení s poskytovatelem. Platba nestrhává peníze; formulář si nežádá údaje karty. Označení této skutečnosti je soustředěné do dokončení objednávky a podmínek. Fikce festivalu zůstává uvedená ve footeru a dokumentaci, běžný obsah ji zbytečně neopakuje.

## Uložení účtu a soukromí

`localStorage` uchovává účty, objednávky, košíky a oblíbené. Přihlášení má v `pulse:auth` expiraci sedm dnů a odhlášení jej odstraní. Registrace zůstává uložená po zavření webu; není to pouze životnost aktuální karty. Pro `file://` používá aplikace jednu vstupní stránku s parametrem, protože oddělování localStorage mezi soubory není jednotné napříč prohlížeči.

Heslo má 10–128 znaků a ukládá se jako PBKDF2-SHA256 hash se 120 000 iteracemi a náhodnou 16bajtovou solí. Otevřený text hesla se neukládá. Nejde o produkční ověření identity: uživatel má úplnou kontrolu nad místním úložištěm. Účet a objednávky zůstávají po zavření prohlížeče, pokud uživatel nesmaže jeho data. Automatický zápis do souboru JSON ani přenos mezi zařízeními se nepředstírá. Funkce ruční zálohy/importu byla podle požadavku uživatele odstraněna.

Nové objednávky nesou `edition: 2027`. Historické záznamy bez tohoto pole se vyhodnotí jako ročník 2026: zachovávají původní datum v historii i PDF a neblokují místa roku 2027. Změna katalogu tedy nepřepíše staré vstupenky a nenaruší volnou mapu nového ročníku.

`web/js/privacy.js` uchovává volbu `pulse:privacy` se schématem `{version: 1, necessary: true, externalMaps, savedAt}` na 180 dnů. Nezbytné místní ukládání slouží účtům, košíku a programu. Volitelná externí mapa je oddělená; analytika a reklamní sledování nejsou nasazené. První návštěva zobrazí volby povolit externí mapy, ponechat jen nezbytné nebo nastavení. Odkaz v patičce otevře nastavení znovu. Změna volby se projeví i v otevřených kartách; odvolání odstraní vložený Google iframe. Pokud prohlížeč úložiště odmítne, rozhraní oznámí omezení a volba platí pouze do zavření.

Vstupy se escapují, délky a e-mail kontrolují formuláře; hledaný text není spustitelný regex. V aplikaci neexistuje SQL. Chybný formát účtů nezpůsobí prázdnou stránku, selhání zápisu zobrazí stav. Podrobnosti úložiště jsou soustředěné na stránku soukromí a do dokumentace.

## PDF, obrazové podklady a mapa

PDF je skutečný vícestránkový dokument vytvořený jsPDF přímo v prohlížeči. Knihovny a licencované fonty jsou lokální a načtou se až na vyžádání. Každá vstupenka má vlastní A5 stránku, český/anglický text, kategorii, konkrétní místo, datum nebo celý rozsah tří dnů, cenu a ID objednávky. QR obsahuje pouze identifikátor, ne osobní údaje. Nemá serverové ověření platnosti. PDF výslovně neprokazuje platbu ani nárok na skutečnou akci. E-mail se automaticky neodesílá.

Aktuální úvod používá **skutečnou fotografii Průmyslového paláce na Výstavišti Praha z 8. října 2018**, autor Bengt Nyman, licence CC BY 2.0. Byla oříznuta na 16:9, zmenšena na 1600 × 900 px a převedena do WebP bez retuše obsahu. Viditelný popisek uvádí historické datum. Fotografie nedokládá aktuální stav rekonstrukce, podobu festivalu ani dostupnost prostor v roce 2027.

Karty interpretů používají **41 skutečných licencovaných fotografií** (včetně všech tří hlavních jmen David Guetta, Katy Perry a Skrillex) a **19 vlastních typografických náhrad**. Vše je přibalené pro provoz offline. Fotografie jsou převzaté z konkrétních souborů Wikimedia Commons; autor, licence, odkaz na zdroj a úpravy se uchovávají v `web/images/photo-credits.json` a `web/images/PHOTO-CREDITS.md`. Stránka informací má dostupnou sekci kreditů s fotografií areálu a rozbalovacím seznamem 41 autorství; odkazy na zdroj a licenci fungují samostatně. Typografické náhrady nepředstírají fotografie ani AI podoby celebrit.

Původní síťová blokace byla po uživatelově změně konfigurace vyřešena a veřejné zdroje se skutečně načetly. Mezikrok s AI ilustrací Výstaviště byl nahrazen autentickou fotografií; tato ilustrace není aktuálním obrázkem úvodu ani součástí výsledných obrazových souborů. Dřívější AI portrétní mřížky a koncertní video mohou zůstat pouze jako historické soubory s původní evidencí, ale aktuální úvod a karty je nepoužívají. Obrazové podklady se nepřebíraly z referenčního festivalu.

Google Maps se na stránce informací vloží automaticky, pokud návštěvník povolil externí mapy. Další tlačítko pro načtení mapy není nutné. Bez souhlasu zůstane informace o lokalitě, vysvětlení a odkaz na nastavení soukromí; obsah Googlu se nenačítá. Uživatel má i běžný odkaz na skutečnou lokalitu. Browserové testy ověřují podmíněné vložení, odvolání a URL s lokálním testovacím obsahem; neověřují síťovou dostupnost skutečné mapy v každém prostředí. Sociální odkazy mají SVG ikony a vedou na veřejné platformy, nikoli vymyšlené ověřené festivalové účty.

## UX, responzivita, sémantika a SEO/AEO

Flexbox slouží navigaci, akcím a formulářovým řádkům; Grid programu, přehledům a mapě. Pružné hodnoty a breakpointy reagují na prostor, nikoli model telefonu. Testovaly se šířky 320, 375, 430, 768, 1024, 1440 a 1920 px včetně vyplněného košíku. Jednořádková hlavička se navíc kontroluje česky i anglicky při šířkách 1024, 1280 a 1366 px. Zvýšení systémového textu, jiné enginy a fyzické telefony nejsou tímto testem plně pokryté.

Používají se header/nav/main/section/article/aside/footer, popisky formulářů, time a address podle významu. Odkaz přeskočení navigace, viditelný focus, nativní dialog, stavové oblasti a textové popisy obsazenosti doplňují klávesové ovládání. Výběr sedadla a oblíbené akce zachová focus. Nadpisy seznamů udržují návaznost h1–h2–h3. Nejde o certifikaci WCAG AA ani plnou HTML validaci.

Samostatná novinková stránka a tři články jsou definované v `web/js/news.js`; přehled na úvodu a celé články vycházejí ze stejného zdroje v CZ/EN. Odkazy podporují přímé otevření konkrétního článku. Zpřístupnění článků se nezaměňuje za tři požadované interaktivní funkce: ty nadále tvoří filtry, hledání a osobní program.

Každá stránka má konkrétní title, description, jazyk, viewport a Open Graph text. Přepnutí jazyka aktualizuje prezentaci a metadata. JSON-LD Festival odpovídá skutečně viditelnému názvu, termínu a lokaci; neobsahuje vymyšlená hodnocení. FAQ jsou věcné a obsahové entity propojené. Bez reálné produkční domény se nevymýšlí canonical a sitemap. Skriptované vykreslení může být omezením pro jednodušší crawlery; pro veřejný provoz by pomohl statický obsahový export.

Dne **18. října 2026** byly přímo načteny a přečteny tyto tři primární podklady:

- Google Search Central, [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): konkrétní a jedinečné titulky, výstižný popis stránky, užitečný původní obsah, odstavce a nadpisy. Web podle toho používá samostatné titulky/description, věcné články a propojené obsahové entity.
- Google Search Central, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): pro AI funkce nejsou další zvláštní požadavky, speciální schéma ani zvláštní textový soubor. Implementace proto upřednostňuje vnitřní odkazy, dostupný text a JSON-LD odpovídající viditelnému obsahu. Nevymýšlí potvrzenou účast ani hodnocení.
- W3C WAI, [Page Structure Tutorial](https://www.w3.org/WAI/tutorials/page-structure/): významové oblasti a logická hierarchie nadpisů. V kódu tomu odpovídají landmarky header/nav/main/footer, nadpisy sekcí, popisky formulářů a odkaz pro přeskočení navigace.

Jde o konkrétní průběžnou rešerši tří zdrojů a kontrolovatelné změny v implementaci. Jejich načtení uspělo po úpravě síťové konfigurace; dřívější odmítnuté požadavky již nejsou aktuálním omezením přístupu k těmto zdrojům. Nejde o externí SEO/AEO audit. Indexace, pořadí výsledků ani doporučení generativním vyhledávačem nejsou garantované. Před případným veřejným nasazením je stále nutné ověřit výslednou produkční adresu a dostupnost obsahu crawlerům.

## Odevzdání, prezentace a cross-review

`odevzdani/` má složky pro cvičení 02–06 a finální `projekt/` v přesné struktuře zadání. PPTX mají editovatelné texty a poznámky, PDF zachovávají vzhled; samostatné poznámky počítají přibližně se čtyřmi minutami. Prototyp cvičení 03 je nově sestavený samostatný wireframe s reálnými filtry, oblíbenými, hledáním a detailem.

Materiály jsou **dodatečně sestavené ukázky milníků**, ne falešné doklady dřívějšího odevzdání. Cvičení 04 a 05 používají stejnou současnou implementaci, protože historické verze nebyly dodány. Cvičení 06 obsahuje metodu a tabulku pro doplnění skutečného cizího projektu; není vydáváno za dokončený posudek.

Skutečné přijaté cross-review chybí. `review/received-review.md` to výslovně uvádí. Vlastní ověřené nálezy a úpravy jsou odděleně v `review/internal-review.md` (heuristická kontrola a kognitivní průchod). Tým musí doplnit jména, spolupráci, časovou osu, skutečný přidělený projekt a jeho hodnocení, přijatý posudek a schválení rozsahu změn. Tyto údaje nejsou nahrazené smyšlenými tvrzeními.

## Použití AI a ověření výstupů

Codex byl použit pro rozbor zadání, implementaci, české/anglické texty, SVG identitu, PDF, prezentace a testy. OpenAI Image Generation v meziverzi vytvořil ilustraci Výstaviště a v dřívější verzi koncertní scénu a čtyři sady fiktivních hudebníků. Mezikrok s ilustrací areálu byl z výsledku odstraněn. Dřívější video připravil FFmpeg; aktuální rozhraní používá skutečné licencované fotografie a 19 typografických náhrad. Skutečné umělce AI nevytvořila: texty jsou jejich biografické medailonky, nikoli smyšlené životopisy nebo potvrzení účasti. Vlastní výtvarný obsah se nepřebíral z referenčního festivalu. Reprezentativní zadání: „asymetrický festivalový web“, „CZ/EN“, „3 dny VIP/Regular/stání“, „typografické plakáty skutečných interpretů s iniciálami“, „prezentace podle výstupů cvičení“.

Výstupy se kontrolovaly XML/XSD a transformacemi, browserovými průchody, porovnáním cen/vazeb, dekódováním QR, rozborem PDF, měřením layoutu, vizuální prohlídkou a kontrolou PPTX/poznámek. Byly opraveny chyby inicializace třídenního košíku, escapování fotografií, focusu, zalamování formuláře a ztracených vstupů. Kopie cizího loga a backend odporující zadání byly odmítnuty. Pozdější výslovný požadavek uživatele na skutečné interprety a fotografie dostal přednost před přiloženým požadavkem na výhradně AI obsah; dokumentace tuto změnu nezamlčuje. Devatenáct umělců bez použité fotografie má typografický plakát, nikoli smyšlenou podobiznu. Limity AI zahrnují možné obrazové nepřesnosti a nutnost lidské kontroly překladu; přínosem je rychlé vytvoření rozsahu, nikoli automatický důkaz správnosti.

Přesné aktuální výsledky jsou v `validation_report.md`, prototypové a prezentační kontroly také v podkladech cvičení 03. Otevření `file://` v tomto spravovaném prohlížeči blokuje politika; nebylo obcházeno a neoznačuje se za úspěšně provedený test. Historii AI práce před dodáním původního projektu doplní tým.
