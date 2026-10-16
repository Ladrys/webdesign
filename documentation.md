# Prague Pulse Fest – dokumentace

## Základ a rozsah

Základem je uživatelem dodaný `final_project.zip`. Při první úpravě byl připojený repozitář bez commitu. Zůstává Prague Pulse Fest, původní ročník 2026, termín 1.–3. srpna, Vltava Park v Praze, 3 scény, 60 interpretů a 60 vystoupení. Původní XML, XSD, XSLT a JSON podklady se zachovávají. `dokumentace.docx` je původní dodaný dokument; novou verzi popisuje tento Markdown.

Požadavek na skutečné účty a e-mail byl při upřesnění záměrně vypuštěn: uživatel výslovně zvolil „Chci jen školní verzi bez serveru“. Finální web proto zůstává čistě klientský, bez instalace, Node.js, buildu, databáze a backendu. Nepředstírá skutečný prodej nebo odeslaný e-mail. Návrh serveru není součástí odevzdání.

## Vývoj a změny

| Oblast | Původní stav | Aktuální výsledek a důvod |
| --- | --- | --- |
| Identita a vzhled | Jednoduchá prezentace, následně univerzální tmavé karty | Originální festivalový wordmark a grafika, výrazná kondenzovaná typografie, černá/krémová/oranžová s modrým akcentem, plakátová kompozice. Vychází z požadavku uživatele na výraznější festivalový styl. |
| Texty | Opakované marketingové fráze | Přímější nadpisy a popisky, zejména „Přihlášení“, „Košík“, „Program 2026“. Odstraněno „Tvoje místo. Tvůj účet.“ |
| Obrázky a fonty | Vzdálené náhodné fotografie | Lokální originální AI grafika a licencované fonty, bez CDN. |
| Vyhledávání | Uživatelská stránka API ověření | Globální `contains` vyhledávání s kategoriemi výsledků a odkazy na odpovídající objekt. |
| Data interpretů | JSON obsahoval pouze 20 z 60 interpretů | Všech 60 se odvozuje z XML. |
| PDF | Textový soubor vstupenek | Skutečné vícestránkové PDF vytvořené v prohlížeči s českým fontem, QR a vlastním designem. |
| Otevření z disku | Více HTML souborů s chováním localStorage závislým na prohlížeči | Při `file://` navigace používá jeden `index.html?page=...`; údaje tak zůstávají pod stejným souborem. |
| Ovládání | Základní formuláře a filtry | Viditelný focus, zachování focusu po výběru sedadla a oblíbené akce, odolnější čtení poškozeného úložiště. |

Inspirací byla obecná grafická řeč současných hudebních festivalů a uživatelem zmíněný Rock for People. Nejsou převzata jeho loga, obrázky, názvy ani zdrojové kódy. Přístup na jeho web v prostředí vracel síťové odmítnutí; nelze tvrdit, že byl proveden audit aktuální stránky. Návrh je samostatná identita Prague Pulse Fest.

Redesign a přidané funkce jsou větší změnou vůči dodanému základu. Nebyla dodána schválená verze ze cvičení 1–2 ani konzultace potvrzující limit cca 15 %. Schválení rozsahu, týmovou časovou osu a skutečná rozhodnutí ze semestru musí doplnit autorský tým. `prototype/` uchovává dodané původní HTML jako historický podklad, nikoli nově vytvořený prototyp.

## Uživatelské scénáře

1. **Sestavení programu:** návštěvník vybere den a scénu, vyhledá interpreta nebo téma, uloží akci a zapne „Jen můj program“. Detail odkazuje na účinkující a nákup pro daný den. Výběr zůstává po obnovení.
2. **Objednávka hosta:** návštěvník zvolí den a místa v mapě, zkontroluje košík, zadá zkušební jméno a e-mail, simuluje platbu a stáhne skutečný PDF soubor. Každá vstupenka je na vlastní stránce a jasně označená jako školní ukázka.
3. **Návrat registrovaného uživatele:** lokální registrace převezme košík hosta, uživatel dokončí objednávku a najde ji v historii. Odhlášení historii skryje; přihlášení ji znovu zobrazí. Objednávky dřívějšího hosta se automaticky nepřiřazují podle neověřeného e-mailu.

## Data a vyhledávání

`data/festival.xml` je původní datová základna; kořenové `data.xml` je identická kopie pro strukturu odevzdání. `API/` obsahuje původní JSON příklady, schémata a transformace, nikoli běžící server. `tools/generate_data.py` volitelně vytvoří hotový `web/js/data.js`. Soubor je přiložen a nevyžaduje build ani `fetch` při otevření webu.

Vyhledávání sjednocuje velikost písmen, odstraní diakritiku a aplikuje `includes` nad poli každého datového objektu. Zahrnuje interprety, program, scény, dny, festival, datové tarify, odkazy a FAQ. Výsledkem jsou HTML karty s odkazy na odpovídající detail. Prázdný dotaz zobrazí nápovědu; neúspěšné hledání informaci a možnost změnit dotaz.

Původní tarify Standard/VIP/Day Pass zůstávají v XML jako zdrojová data. Nový školní nákup nabízí **jednodenní VIP 590 Kč, Regular 390 Kč, stání 190 Kč**. Model je v `ticketTypes` v `web/js/app.js`; vyhledávání rozlišuje aktuální nákup a původní datové tarify. Je to přiznané rozšíření původní specifikace.

## Účty, košík a ochrana vstupů

Účty, objednávky, košík a oblíbené jsou v `localStorage` s prefixem `pulse:`. `sessionStorage` nese identifikátor přihlášeného uživatele pro danou kartu. Není to serverová autentizace; uživatel má nad daty úplnou kontrolu. Smazání úložiště odstraní i objednávky. Prohlížeč musí povolit místní úložiště. Chybné JSON či neplatné základní typy dat se bezpečně vrací na prázdný stav.

Heslo má 10–128 znaků a ukládá se jako PBKDF2-SHA256 hash se 120 000 iteracemi a náhodnou 16bajtovou solí. Text hesla se neukládá. Bez Web Crypto registrace selže s vysvětlením, nevkládá slabší náhradu. Uživatelé mají zadávat smyšlené údaje a heslo nepoužívané jinde. E-mail kontroluje HTML validace a doplňkový regex, nikoli ověření skutečného vlastnictví adresy.

Uživatelské hodnoty v HTML se escapují; výsledkové stavy používají `textContent`; hledání nezpracovává dotaz jako spustitelný regex. Není zde SQL ani databázový dotaz, proto zde není SQL injection. Pro případný samostatný server by byla nezbytná validace na serveru a parametrizované dotazy. Žádné heslo k SMTP, API klíč nebo skutečné platební údaje nejsou v klientském kódu. Web nepoužívá analytické cookies, měření ani sledovací skripty.

Košík je oddělený podle účtu nebo hosta a přihlášení jej sloučí bez duplicit. Platné hodnoty dne, sedadla, kategorie a ceny se kontrolují před zobrazením. Ceny objednávky se znovu odvozují z modelu. Zamítnutá platba zachová košík. Výběr v mapě ani košík nepředstavují rezervaci; dostupnost se kontroluje při dokončení. Objednávky v lokálním prohlížeči obsadí místo pro daný den. Neexistuje společná ani transakční rezervace napříč zařízeními.

## PDF a e-maily

`web/js/ticket-pdf.js` načte při stažení místní jsPDF, generátor QR a vložené fonty. Není potřeba síťová služba, server ani build. Výsledkem je **skutečný PDF dokument**, nikoli přejmenovaný text nebo automatický tisk do PDF. Obsahuje samostatnou A5 stránku na vstupenku, původní festivalový wordmark, barevný oddělený sektor, české jméno, datum, místo, kategorii, cenu a ID objednávky.

QR obsahuje pouze ukázkový identifikátor, nikoli jméno nebo e-mail. Nepotvrzuje pravost ani právo ke vstupu; každá stránka výslovně říká „ŠKOLNÍ UKÁZKA / NEPLATNÁ VSTUPENKA“. Fonty jsou vložené v PDF kvůli českým znakům. Soubor lze opakovaně stáhnout z historie lokálního účtu, nebo vytisknout z HTML. Starší uložené objednávky bez nového `code` používají odvozený identifikátor.

**Automatické odeslání e-mailu není implementované**, protože uživatel po upřesnění vybral pouze klientské školní řešení a nemá nastavenou e-mailovou službu. Žádný koncept zprávy se nevydává za skutečně odeslanou zprávu. E-mail z formuláře je pouze údaj na objednávce. Skutečné SMTP vyžaduje bezpečně uložené serverové přihlašovací údaje, ne jejich vložení do JavaScriptu. Samostatná služba by byla další integrace mimo aktuální rozsah.

## Responzivita, přístupnost a SEO

Výchozí rozložení je mobilní. Flexbox řeší navigaci, tlačítka a lišty; CSS Grid přehledy interpretů, program a mapu sedadel. Šířky, mezery a typografie používají pružné hodnoty, `minmax` a `clamp`. Rozhraní se přizpůsobuje prostoru místo konkrétních modelů telefonů. Obrázky mají lokální zdroje a rozměry, fonty jsou licencované a přibalené.

Navigace má ovládání `aria-expanded`, formuláře popisky, focus je viditelný a lze přeskočit na obsah. Sedadla mají textové názvy, stav, cenu a `aria-pressed`; obsazenost není vyjádřena pouze barvou. Po výběru sedadla či oblíbené akce se focus zachová. Dialog ovládá klávesnice, Escape jej zavře. Výsledky a chyby používají stavové oblasti; animace respektují omezení pohybu. Tiskové CSS skryje ovládání. Technické testy nenahrazují plný audit WCAG AA se čtečkou nebo na fyzickém zařízení.

Každá stránka má konkrétní title, description, jazyk, viewport a Open Graph text. Domovská stránka obsahuje JSON-LD Festival s viditelnými původními údaji, bez vymyšleného hodnocení. FAQ a provázané obsahové entity pomáhají s porozuměním obsahu. Není vymyšlena produkční doména pro canonical či sitemap. Obsah vykresluje JavaScript, což může omezit jednoduché roboty. Aktuální externí SEO/AEO rešerše ani audit vyhledávači v této revizi neproběhly; tým je má doplnit podle požadavků předmětu. Není tvrzena garance indexace nebo doporučování AI vyhledávači.

## Cross-review

Skutečné cross-review nebylo dodáno. `review/received-review.md` to uvádí výslovně, nevymýšlí autory ani připomínky. Tým musí doplnit reálné nálezy, jejich závažnost, rozhodnutí a změny, spolupráci členů a průběh jednotlivých cvičení. Technická kontrola z této úpravy není vydávána za cross-review od jiného týmu.

## Použití AI a ověření

Codex byl použit pro analýzu zadání, návrh a implementaci rozhraní, originální SVG logo/ilustrace, texty, PDF a testy. AI generátor vytvořil koncertní vizuál; původ a licence fontů jsou v `web/images/ASSETS.md`. Reprezentativní zadání: festivalový styl s vlastním názvem, responzivita, méně obecných frází a graficky zpracované PDF. Nové logo ani grafika nekopírují značku Rock for People.

Ověření zahrnuje původní XML/XSD/JSON/XSLT validátory, konzistenci datového exportu, průchody Chromium, hledání, lokální účty, košík, varianty platby, stahování skutečného PDF, jeho obsah a různé velikosti obrazovky. Konkrétní počty, výstupy a omezení jsou v `validation_report.md`.

Při kontrole byly opraveny ztráty klávesového focusu při překreslení mapy a oblíbených, pád při chybném formátu místního úložiště a neurčité oddělování úložiště mezi různými `file://` soubory. Návrh skutečného backendu byl po odpovědi uživatele vyřazen kvůli školnímu zadání. Testy neprokazují bezpečné produkční přihlášení, skutečnou platbu ani doručení e-mailu a tyto schopnosti web netvrdí. Historii použití AI před touto úpravou musí doplnit původní tým.
