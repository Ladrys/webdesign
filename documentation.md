# Prague Pulse Fest – dokumentace finální úpravy

## Rozsah a návaznost na původní projekt

Základem je uživatelem dodaný `final_project.zip`. Připojený repozitář byl při zahájení prázdný (bez prvního commitu). Zachována je identita festivalu, termín 1.–3. srpna 2026, Praha, tři scény, 60 interpretů a 60 vystoupení. Zdrojová XML data, schéma, XSLT a původní API podklady zůstávají dostupné. `dokumentace.docx` je původní dodaný dokument, nikoliv aktualizovaná dokumentace této verze.

Tato úprava vznikla na přímé zadání uživatele: mobile-first redesign, globální vyhledávání namísto stránky API ověření, účty a ukázkový nákup vstupenek. Jde o větší vizuální a funkční změnu. Nebyla dodána původní schválená verze z cvičení 1–2 ani konzultace, která by potvrzovala přijatelný rozsah změn. Soulad s limitem změn cca 15 % proto musí tým vyřešit s vyučujícím; nelze jej tvrdit za ověřený.

## Implementované změny

| Původní stav | Výsledek a důvod |
| --- | --- |
| API ověření v navigaci | Samostatné vyhledávání napříč daty a praktickými informacemi podle zadání uživatele. |
| Fetch XML/JSON a náhodné vzdálené obrázky | Hotový lokální `js/data.js`, SVG a CSS ilustrace; žádné síťové závislosti při běhu. |
| JSON interpretů obsahuje jen první stránku (20 z 60) | Všech 60 se generuje z XML; lze dohledat i posledního interpreta. |
| Jednoduchá původní prezentace | Tmavé mobile-first rozhraní s limetkovými akcenty, abstraktními zvukovými vlnami a jednotnými kartami. |
| Základní filtry | Filtrování dne/scény/textu, osobní program, kontextové detaily a navazující nákup. |
| Bez účtů a objednávek | Lokální ukázka účtu, košíku, mapy, simulované platby a historie. |

Historická původní HTML jsou v `prototype/`. Ta nejsou novou finální implementací ani nově vytvořeným původním UX prototypem. Přidané stránky: scény, vyhledávání, vstupenky, košík a účet. Původní validátor byl upraven: místo odstraněné stránky API a svévolného limitu délky CSS ověřuje současné stránky, metadata, lokální soubory a reprodukovatelnost dat. XML/JSON/XSLT/OpenAPI kontroly zůstaly zachovány.

## Tři klíčové scénáře

1. **Návštěvník sestavuje program:** otevře Program, vybere den a scénu, uloží vystoupení a zapne „Jen můj program“. Detail odkazuje na interprety a vstupenky daného dne. Oblíbené zůstávají v prohlížeči i po obnovení.
2. **Host nakupuje:** otevře Vstupenky, vybere den, VIP/Regular/stání, přidá místa do košíku, zadá jméno a e-mail, potvrdí ukázkový režim a simuluje platbu. Obdrží zobrazenou vstupenku a možnost stažení či tisku; automatický e-mail se neodesílá.
3. **Registrovaný uživatel nakupuje a vrací se:** vytvoří demo účet, košík hosta se sloučí s jeho košíkem, objedná a najde objednávku v historii. Po odhlášení je historie skrytá; po přihlášení se znovu zobrazí. Objednávky hosta nejsou automaticky přiřazeny podle neověřeného e-mailu.

## Data a vyhledávání

`data/festival.xml` zůstává zdrojovou datovou základnou. Kořenové `data.xml` je identická kopie pro strukturu odevzdání. V `API/` zůstávají původní transformace a datové příklady, nikoli backend. Volitelný nástroj `tools/generate_data.py` připraví lokální JavaScript z XML a původních JSON souborů. Hotový soubor je součástí odevzdání, takže nevyžaduje build.

Vyhledávání normalizuje písmena, odstraní diakritiku a použije `includes` nad textovou reprezentací každého objektu. Zahrnuje všechna pole položek, interprety, program, scény, dny, informace festivalu, původní datové tarify, odkazy i FAQ. Výsledky se zobrazují jako HTML karty s odkazy na příslušný objekt. Prázdný dotaz zobrazí nápovědu, neúspěšné hledání srozumitelný prázdný stav.

**Rozšíření vstupenek:** původní tarify Standard/VIP/Day Pass ve zdrojovém XML zůstávají historickými daty. Nový ukázkový objednávkový model nabízí jednodenní VIP 590 Kč, Regular 390 Kč a stání 190 Kč. Tyto tarify jsou v `ticketTypes` v `web/js/app.js` a vyhledávání rozlišuje původní datové tarify od aktuálního nákupu. Jde o zdokumentované rozšíření, nikoliv změnu původních cen ve zdrojových datech.

## Klientské účty, platba a úložiště

- Web nemá backend, databázi ani běžící API. Registrace je pouze lokální demonstrace, nikoli bezpečnostní hranice.
- Účty se ukládají do `localStorage` pod prefixem `pulse:`. Hesla jsou odvozena pomocí PBKDF2-SHA256, 120 000 iterací a náhodné 16bajtové soli; hesla v otevřeném textu se neukládají. Bez Web Crypto registrace selže s vysvětlením, nepoužívá se slabší náhrada.
- `sessionStorage` obsahuje identifikátor přihlášeného účtu pro danou kartu. Odhlášení jej odstraní. Žádné analytické cookies, sledování ani cookie banner.
- Košík je oddělen podle účtu nebo hosta, oblíbené jsou společné pro prohlížeč. Přihlášení převezme košík hosta bez duplicit.
- Místa jsou rozlišena podle dne. Mapa má 48 sedadel a 40 míst ke stání na den; několik míst je ukázkově obsazených. Neodpovídá celé skutečné kapacitě scén. Výběr ani košík nedrží rezervaci. Dokončené lokální objednávky označí místa jako obsazená. Dostupnost se znovu kontroluje před dokončením objednávky.
- Úspěch i zamítnutí platby jsou simulované. Web nevyžaduje platební kartu ani neodesílá peníze.
- Vstupenky jsou textové soubory nebo tisk stránky; kód je lokální identifikátor, nikoli kryptograficky podepsaný či skenovatelný QR kód.
- E-mail je uložen na objednávce. `mailto:` otevře koncept v uživatelově klientu; automatické odesílání se neděje. Skutečné doručení, společná obsazenost, obnova hesla a bezpečné přihlášení vyžadují backend nebo službu, což by změnilo požadavek čistě client-side řešení.
- Uživatel může ve vývojářských nástrojích libovolně změnit lokální data. Neexistuje transakční zámek mezi současně objednávajícími kartami ani zařízeními. Tuto ukázku nelze použít pro skutečný prodej.

## Vstupy a ošetření chyb

Délky vstupů jsou omezené; jméno i e-mail se ořezávají, e-mail kontroluje HTML validace a doplňkový regulární výraz. Použitý regex není důkazem existence adresy. Heslo má 10–128 znaků. Uživatelské hodnoty vložené do HTML se escapují; stavy formulářů a hledání používají `textContent`. Dotaz je běžný text, nikoliv spustitelný regex. SQL se nikde nevytváří, protože není databáze; ochranu před SQL injection zde není co implementovat. Pro případný budoucí backend jsou nutné parametrizované dotazy a serverová validace.

Obsazená místa jsou deaktivovaná, ceny se při dokončení odvozují z modelu a objednávka znovu ověří dostupnost. Zamítnutá platba košík zachová. Selhání zápisu úložiště zobrazí hlášení. Chybné přihlášení neodhaluje, zda existuje účet. Citlivé skutečné údaje do dema nepatří.

## Mobile-first, přístupnost a SEO/AEO

Výchozí CSS je jednosloupcové, rozšiřuje se od 650 a 1050 px. Rozložení používá pružné mřížky a `clamp`. Navigace na mobilu má tlačítko s `aria-expanded`; košík i formuláře se vejdou do 320 px. Mapa má pevný počet sloupců, ale šířku přizpůsobuje kontejneru. Dlouhé identifikátory a jména se zalamují. Klávesnice ovládá tlačítka i nativní dialog, Escape dialog zavře. Stav míst není vyjádřen jen barvou: mají text, stav `aria-pressed` a popisky. Ovládací prvky mají viditelný focus, formuláře popisky, výsledky stavové oblasti. Použit je odkaz pro přeskočení navigace a preference omezeného pohybu. Tiskové CSS skryje ovládání. Neproběhl plný audit WCAG AA ani zkouška se čtečkou; nelze tvrdit certifikovaný soulad.

Každá stránka má konkrétní title, description, jazyk, viewport a Open Graph text. Domovská stránka vkládá JSON-LD Festival se skutečně zobrazenými údaji, nikoliv hodnocením či vymyšlenými recenzemi. FAQ jsou napsána jako konkrétní otázky a odpovědi, obsah je rozdělen na srozumitelné entity a provázaný odkazy. Záměrně není vymyšlena produkční doména pro canonical nebo sitemap. Hlavní obsah vykresluje JavaScript, což může omezit indexaci jednoduchými roboty; pro ostré publikování by se hodil statický export HTML. Aktuální externí rešerše SEO trendů ani online SEO audit v této úpravě neproběhly; tým je musí doplnit, pokud je vyučující požaduje. Nelze tvrdit, že byly ověřeny aktuální trendy vyhledávačů nebo garance viditelnosti v AI odpovědích.

## Cross-review a historie semestru

Nebyl dodán skutečný záznam cross-review ani výstupy všech průběžných cvičení. V `review/received-review.md` je tato skutečnost výslovně zaznamenána. Není vymyšlen seznam připomínek ani tvrzeno, že úpravy vznikly po cvičení 6. Tým musí doplnit skutečné připomínky, rozhodnutí a časovou osu, spolupráci členů a případnou schválenou změnu rozsahu.

## Použití AI a ověření

V této úpravě byl použit Codex k analýze dodaných souborů, návrhu vzhledu, tvorbě HTML/CSS/JS, abstraktní SVG ilustraci, textům a automatizovaným kontrolám. Zadání: „responzivní a mobile first“, „search bar … contains“, VIP/Regular/stání, košík, účty a ukázková platba. Výstupy se ověřovaly původními datovými schématy, konzistencí generovaných dat, reálnými průchody v Chromium, kontrolami šesti šířek a vizuálním náhledem screenshotu.

Při ověřování byl opraven problém inicializace cen při návratu s neprázdným košíkem a zastínění funkce při odebírání položky. Původní odhad počtu výsledků „Neon“ byl nahrazen skutečným počtem 25 podle dat (12 interpretů + 13 akcí). Návrh skutečné e-mailové brány a backendových účtů byl omezen na transparentní klientskou simulaci kvůli požadavku zadání. Výsledky testů jsou v `validation_report.md`; limitem jsou testy v jednom browser enginu a blokované `file://` ve spravovaném prostředí. Použité texty a ilustrace nejsou fotografiemi skutečné akce. Původ a AI použití před touto úpravou musí doplnit autorský tým.
