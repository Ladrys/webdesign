# Prague Pulse Fest — dokumentace

## Identita a rozsah

**Prague Pulse Fest**, 1. ročník, 1.–3. srpna 2027, je fiktivní třídenní festival. Základem je uživatelem dodaný final_project.zip. Zůstávají tři dny, tři scény, 60 interpretů a 60 programových položek. Vltava Park označuje modelové festivalové uspořádání u reálného Výstaviště Praha; navigační adresa je Výstaviště 67, 170 00 Praha 7. Line-up používá skutečné interprety, ale jejich účast není potvrzená. Kontaktní doména .cz a telefon nejsou ověřené kontakty skutečného pořadatele.

Uživatel výslovně zvolil školní řešení bez serveru. Web proto tvoří HTML, CSS a JavaScript, bez Node.js, databáze, instalace nebo povinného buildu. Neprovádí skutečné platby, sdílené rezervace ani automatické odesílání e-mailu. Údaje přetrvávají ve stejném prohlížeči; automatický zápis do souboru JSON se nepředstírá.

## Vývoj a změny

| Verze / podnět | Co se změnilo | Proč / jak se kontroluje |
| --- | --- | --- |
| Dodaný základ | XML, XSD, transformace a obsahové stránky Prague Pulse Fest | Zachovaná datová základna, entity a jednoznačné vazby |
| První klientská úprava | Hledání místo uživatelské stránky ověřování API, program, lokální účty, košík a PDF | Požadované scénáře a školní omezení bez backendu |
| Vizuální meziverze | Výraznější identita, dočasný Prague Rocks Festival a AI obrazové podklady | Přímý požadavek uživatele; nešlo o potvrzenou změnu školního prvního výstupu |
| Následující upřesnění | Obnoven Prague Pulse Fest, termín přesunut na 1.–3. srpna 2027, tmavá hlavička a statická fotografie | Oprava identity a budoucího ročníku podle zadavatele; jednotné XML/JSON/web/prezentace |
| Audiozpětná vazba zadavatele | Viditelnější odpočet, vyvážené tarify, fotografie bez nevhodného ořezu, hudební odkazy a podrobnější program | Konkrétní připomínky k aktuálnímu webu, ověřované v rozhraní a datech |
| Stejná audiozpráva — nákup | Jednotná volba 1/2/3 dnů, libovolná dvojice dnů, vlastní VIP/Regular sedadla, množství stání, kemp, DPH a sleva jen na vstupenky | Návštěvník musí rozumět rozsahu, místu i konečné ceně před košíkem |
| Stejná audiozpráva — obsah a účet | Rozdělení scén podle hudby, nová sestava 60 interpretů, profil s více údaji, offline plánek, samostatné Soukromí/Podmínky/Kredity | Konkrétní návštěvnické potřeby a přesun technických odboček z běžného Info |
| Školní podklady | Složky 02–06, PPTX/PDF/poznámky a samostatný funkční wireframe | Členění podle skutečně dodaného zadání, bez falšování minulých odevzdání |

Audiozpětná vazba pochází od zadavatele. **Není to cross-review přiděleného jiného týmu.** Dodaná data neobsahují skutečné schválené první dva výstupy, konzultaci limitu změn přibližně 15 % ani přijatý cizí posudek. Větší redesign, skuteční interpreti a posun termínu proto vyžadují doložit návaznost před odevzdáním. Netvrdíme, že byly změny schváleny nebo provedeny „po cvičení 6“.

## Informační architektura a scénáře

Web má 13 HTML vstupů: Úvod, Program, Účinkující, Scény, Info, Novinky, Vyhledávání, Vstupenky, Košík, Účet, Soukromí, Podmínky a Kredity. Novinky obsluhují tři samostatné články. Detail interpreta vede na související koncert a detail scény na její program. Informace o ukládání a právech k fotografiím mají vlastní stránky, aby nepřerušovaly praktické návštěvnické Info.

- **S1 — osobní program:** na mobilu vybrat první den a River Stage, uložit koncert, zobrazit uložené a obnovit stránku. Očekává se správný den/scéna a zachovaný výběr.
- **S2 — konkrétní interpret:** vyhledat DARKZY, otevřít detail, zkontrolovat medailonek, hudební odkazy a čas koncertu v Club Stage. Výsledek musí odpovídat XML.
- **S3 — vlastní vstupenka:** zvolit například 1. a 3. srpna, VIP, označit konkrétní sedadlo, zkontrolovat košík, případně přidat kemp a promo. Po zkušebním dokončení stáhnout PDF s přesnými dny, místem a součtem.
- **S4 — vracející se návštěvník:** registrovat jméno, příjmení, telefon, e-mail a potvrzené heslo, upravit profil a po opětovném otevření najít vlastní historii.
- **S5 — cesta a pobyt:** v CZ/EN najít dopravu, offline plánek, pravidla kempu a volitelnou mapu Google.

Typ uživatele, cíl, výchozí situaci a očekávaný výsledek obsahuje project-specification.md.

## Datová základna a program

data/festival.xml je autoritativní zdroj; kořenové data.xml je identická kopie pro odevzdání. Obsahuje festival, adresu, tři dny, tři scény, 60 skutečných interpretů, 60 vystoupení, šest vstupenkových tarifů, kemp, modelovou sazbu daně, odkazy a kontakty. Identifikátory i1–i60 a a1–a60 zůstávají stabilní. Každý interpret má jedno vystoupení; program je chronologický a scény nemají časové kolize.

Main Hall patří hlavním mezinárodním jménům a rock/pop/elektronickým headlinerům, River Stage české scéně a Club Stage klubové elektronice: drum and bass, bass house, UK garage a dalším konkrétním subžánrům. Každá skupina má 20 interpretů. Headline zůstávají David Guetta, Katy Perry a Skrillex. Nová sestava zahrnuje Skepsis a HOLY PRIEST; předchozí archivní položka Noisia není současným oznámením koncertu.

Podrobnější medailonky a subžánry jsou v XML. Hudební odkazy rozlišují doložený profil od vyhledávání: 21 profilů Spotify a 21 YouTube je doloženo přes Wikidata, zbývající odkazy jsou označeny jako hledání. Obecný výsledek není označen za oficiální profil. Nejde o potvrzení účasti.

Sedm XSLT transformací vytváří JSON výstupy v API/; schémata a XSD zůstávají kontrolovatelné. tools/generate_data.py připraví přibalený web/js/data.js. Při běhu není potřeba transformace, fetch ani API. Všech 60 interpretů pochází z úplného XML, nikoli jen ze stránkované ukázky.

## Délka návštěvy, místa a dostupnost

Nákup postupuje od počtu dnů přes konkrétní dny a kategorii k místům nebo množství. Jednodenní vstupenka platí pro zvolený den, dvoudenní pro libovolné dva ze tří, třídenní pro celý festival. Dvoudenní cena je dvojnásobek jednodenní; třídenní používá vlastní zvýhodněný tarif.

| Kategorie | 1 den | 2 zvolené dny | 3 dny |
| --- | --- | --- | --- |
| VIP | 590 Kč | 1 180 Kč | 1 590 Kč |
| Regular | 390 Kč | 780 Kč | 990 Kč |
| Stání | 190 Kč | 380 Kč | 490 Kč |

VIP a Regular vyžadují vlastní označení sedadla na mapě, nikoli skryté automatické přidělení. Stání používá počet návštěvníků a může přejít rovnou do košíku. Kapacita modelu je 48 sedadel a 40 míst ke stání na den. Nový prohlížeč začíná s volnými místy. Sedadlo musí být volné ve všech zvolených dnech a nákup je obsadí právě tehdy. Nákup 1. a 3. dne tedy sám neblokuje 2. den.

Košík není rezervace. Dostupnost, překryv dnů, kapacita a ceny se znovu kontrolují při dokončení. Změna v jiné kartě vyžaduje opětovnou kontrolu výběru a součtu. Účty a host mají oddělené košíky; přihlášení přebírá výběr bez duplicit. Zamítnutá simulace zachová údaje i obsah. Stav je pouze místní, nikoli sdílený mezi zařízeními.

## Kemp, slevy a modelová DPH

Kemp je volitelný doplněk objednávky s alespoň jednou vstupenkou, jedno místo na objednávku. Stan stojí 350 Kč, karavan 850 Kč; navíc 150 Kč za každou osobu. Cena pokrývá tři noci 1.–4. srpna 2027 bez ohledu na délku hudební vstupenky. Stan pojme nejvýše 4 osoby, karavan 6; modelová kapacita je 40 stanových a 12 karavanových míst. Dostupnost se kontroluje znovu při dokončení. Návštěvnický obsah ani plánek neoznamují reálný provoz kempu Výstaviště.

PULSE10 snižuje cenu vstupenek o 10 % se zaokrouhlením na koruny. PRAHA200 odečte 200 Kč, nejvýše do výše ceny vstupenek. Kódy se nesčítají a **nevztahují se na kemp**. Změněný kód se musí znovu potvrdit. Při dokončení se částky počítají z katalogu; klientem změněná uložená cena nebo sleva není autoritativní.

Všechny katalogové částky již obsahují **modelovou 12% DPH**, poplatek objednávky je 0 Kč. Košík, historie a PDF ukazují celkem, zahrnutou DPH a základ. Základ = celkem / 1,12, daň = celkem − základ; rozpis se zaokrouhluje na haléře.

Zdroj pro model: [Informace GFŘ ke změnám sazeb DPH od 1. 1. 2024](https://financnisprava.gov.cz/assets/cs/prilohy/d-seznam-dani/Informace_GFR_ke_zmenam_sazeb_DPH_od_1_1_2024.pdf), strana 1 a příloha 2 na straně 9: ubytovací služby a oprávnění ke vstupu na kulturní akce. Tento podklad popisuje úpravu od roku 2024. **Výukový model nepotvrzuje právní sazbu pro skutečného pořadatele v roce 2027.**

Příklad: dvě dvoudenní VIP vstupenky 2 × 1 180 = 2 360 Kč, PULSE10 −236 Kč, stan pro 2 osoby 350 + 2 × 150 = 650 Kč. Celkem **2 774 Kč**; kemp se nezlevňuje. Základ 2 476,79 Kč, zahrnutá DPH 297,21 Kč.

## Objednávka, PDF a platba

Dokončení má jméno, příjmení, e-mail a telefon. Telefon dovoluje běžné oddělovače a vyžaduje 9–15 číslic. Zkušební metody: karta, převod, hotovost, Apple Pay, Google Pay, Benefit Plus a faktura. Žádná se nespojuje s poskytovatelem ani nevyžaduje údaje skutečné karty. Simulace je označena při dokončení a v podmínkách, nikoli v každém návštěvnickém odstavci.

PDF je skutečný dokument vytvořený místním jsPDF. Každá vstupenka má vlastní A5 stránku s názvem, CZ/EN textem, přesnými dny, kategorií, místem, cenou a ID objednávky. U dvou nesousedících dnů nesmí datum vytvořit falešný souvislý rozsah. Kemp přidává samostatný voucher s typem místa, počtem osob, třemi nocemi a cenou. Dokument zachovává slevu na vstupenky, kemp i daňový rozpis. QR obsahuje identifikátor bez osobních údajů; nemá serverové ověření a neopravňuje ke skutečné akci. E-mail se automaticky neposílá.

## Účet a soukromí

Registrace má jméno, příjmení, e-mail, telefon, heslo a potvrzení hesla. Profil zobrazí údaje a čas vytvoření a dovoluje upravit jméno, příjmení, telefon a e-mail při kontrole duplicity. Změna profilu nepřepisuje starší objednávky. Heslo má 10–128 znaků, ukládá se jako PBKDF2-SHA256 hash se 120 000 iteracemi a náhodnou 16bajtovou solí. Otevřené heslo se neukládá, vlastnictví e-mailu se neověřuje.

localStorage uchovává účty, objednávky, košíky, kemp a oblíbené. pulse:auth má sedmidenní expiraci; odhlášení ji odstraní. Uživatel má nad místními daty kontrolu, nejde o bezpečnou serverovou autentizaci. Při file:// navigace používá jediný vstupní soubor s parametrem page. Smazání dat prohlížeče smaže účet i objednávky. Automatické přepisování disku, synchronizace a obnovení z e-mailu nejsou implementované.

Nové objednávky nesou edition: 2027. Starší záznamy bez něj zachovávají ročník 2026 v historii i PDF a neblokují místa roku 2027. Starší účty zůstávají čitelné a mohou doplnit profil. Objednávkám bez uloženého daňového rozpisu se zpětně nevymýšlí historická DPH.

Panel soukromí ukládá pulse:privacy na 180 dnů a rozlišuje nezbytný místní stav a externí mapy. Odmítnutí nepovolí požadavky na Google; souhlas mapu vloží, odvolání iframe odstraní. Volbu lze změnit v patičce a stránce Soukromí. Bez souhlasu jsou stále dostupné adresa a lokální plánek. Analytika ani reklamní sledování nejsou nasazené. Vstupy se escapují, hledání nepoužívá text jako spustitelný regex. V aplikaci není SQL.

## Fotografie, plánek a licence

Úvod používá skutečnou fotografii Průmyslového paláce od Bengta Nymana z 8. října 2018, CC BY 2.0, upravenou do WebP 1600 × 900 px. Popisek ji nezaměňuje za stav roku 2027. Novinka o rekonstrukci vychází z [oficiálního sdělení Výstaviště](https://pronajem.navystavisti.cz/otevirame-prumyslovy-palac/), aktualizace 12. října 2026: rekonstrukce a dostavba leden 2022 až září 2026 a den otevřených dveří 17.–18. října 2026. Zmínka nepotvrzuje rezervaci areálu pro fiktivní festival.

**42 interpretů má skutečnou doloženou fotografii, 18 vlastní typografický plakát.** Nové fotografie hlavní trojice ukazují živé vystoupení/DJ práci. Zvětšený detail je upraven pro zachování obsahu fotografie. Rekonstrukci ilustruje skutečná fotografie Aktrona z 2. června 2026, CC BY-SA 4.0. Dopravní snímek Leifa Jørgensena zachycuje výstavní smyčku v roce 2016, CC BY-SA 4.0. Snímek náramku Richarda Erikssona z 15. července 2006, CC BY 2.0, je ilustrace jiného festivalu, nikoli vydaná vstupenka Prague Pulse Fest.

Autor, zdroj, licence, datum a úpravy jsou v web/images/photo-credits.json, web/images/PHOTO-CREDITS.md a na samostatné stránce Kredity. **Hedex (i15) a AC Slater (i20) používají CC BY-NC-SA 2.0**, vhodnou pro aktuální nekomerční školní rozsah; fotografie nejsou přenosné do komerčního webu bez dalšího oprávnění nebo výměny. Ostatní fotografie mají konkrétní BY/SA/CC0/PD podmínky uvedené jednotlivě. Hudební Spotify/YouTube odkaz nenahrazuje povinný kredit fotografie. Nedoložené fotografie nejsou použité; náhradou jsou vlastní typografické plakáty.

Offline plánek názorně ukazuje scény, Vltavu, přístup, MHD a modelové zóny. Není geodetickou mapou, oficiálním provozním plánem nebo schválením skutečného kempu. Dřívější AI portréty a video zůstávají historickými podklady, nejsou aktuálními podobiznami skutečných umělců.

Z Rock for People se nepřebírá logo, fotografie, video ani zdrojový kód. Dodané HTML sloužilo jako strukturální reference; jeho skripty se nespouštěly. Google Maps se načte jen po souhlasu, web má i normální odkaz na lokalitu. Test podmíněného vložení mapy není důkaz síťové dostupnosti Googlu všude.

## UX, responzivita, sémantika a SEO/AEO

Flexbox řeší navigaci a řady ovládání, Grid karty, program a sedadla. Pružné hodnoty, clamp a minmax přizpůsobují obsah prostoru. Tarify nemají vnuceného favorita; zvýraznění odpovídá interakci. Varianty 1/2/3 dnů sdílejí průvodce a viditelný součet. Detaily mají vhodný obrazový poměr a hudební odkazy. FAQ řeší praktické otázky; právní a obrazové zdroje mají vlastní stránky.

Používají se header/nav/main/section/article/aside/footer, time, address a popisky formulářů. Přeskočení navigace, viditelný focus, nativní dialog, stavové oblasti a textová obsazenost doplňují klávesnici. Výběr místa a oblíbené akce zachovává focus. Konkrétní aktuální šířky a výsledky jsou ve validation_report.md; nelze z nich odvodit certifikaci WCAG AA nebo použití na všech přístrojích.

Každá relevantní stránka má title, description, jazyk, viewport a Open Graph metadata. CZ/EN zachovává interní ID, filtry a osobní údaje. XML-derived medailonky i novinky mají obě varianty. JSON-LD odpovídá viditelnému názvu, termínu a místu bez vymyšlených hodnocení. Bez produkční domény se nevymýšlí canonical či sitemap; skriptovaný obsah může omezit jednodušší crawlery.

Dne 18. října 2026 byly v předchozí revizi přímo přečteny primární zdroje:

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): jedinečné titulky, výstižné popisy, užitečný text a interní odkazy. Zde se promítají do stránek, medailonků a propojení programu.
- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): nejsou další zvláštní požadavky, speciální schéma či AI textový soubor. Upřednostňujeme dostupný obsah a pravdivé JSON-LD.
- [W3C WAI Page Structure Tutorial](https://www.w3.org/WAI/tutorials/page-structure/): logické oblasti a hierarchie nadpisů. V kódu odpovídají landmarky, nadpisy a přeskočení navigace.

Jde o omezenou rešerši konkrétních podkladů, nikoli externí SEO/AEO audit, záruku indexace nebo doporučení AI. Veřejnou adresu a crawling by bylo nutné ověřit při skutečném nasazení.

## Odevzdání, cross-review a tým

odevzdani/ obsahuje cvičení 02–06, editovatelné PPTX, PDF, poznámky a finální projekt/ v povinné struktuře. Jsou to **dodatečně připravené rekonstrukce milníků**, nikoli archiv minulých odevzdání. Cvičení 03 má nově vytvořený funkční wireframe; cvičení 04 a 05 stejný současný web. Nevymýšlíme historii různých semestrálních verzí.

| Přijatá připomínka | Závažnost | Rozhodnutí | Změna / důvod |
| --- | --- | --- | --- |
| Skutečné review od přiděleného týmu nebylo poskytnuto | Nehodnoceno | Doplnit po obdržení | Nelze tvrdit zapracování cizích nálezů |

review/received-review.md tento stav uvádí. review/internal-review.md má vlastní technické poznatky a není cizím cross-review. Cvičení 06 obsahuje šablonu Nielsenovy evaluace a kognitivního průchodu; bez cizího projektu není hotovým splněním posudku. Audiozpráva zadavatele je samostatný zdroj požadavků.

Jména čtyř členů, skutečnou spolupráci, konzultace, schválené první výstupy, reálné review a časovou osu musí doplnit původní tým. Nejsou dostupné v předaných podkladech a nelze je odvodit z commitů této úpravy.

## Použití AI a ověření

Codex pomohl s analýzou, navigací, CZ/EN texty, implementací, SVG identitou, plánkem, PDF, prezentacemi a testy. Dřívější AI generátor vytvořil ilustrace a fiktivní portréty; skutečné fotografie nejsou vydávány za AI výstupy. Medailonky jsou AI zpracované texty o skutečných lidech. Pozdější výslovný požadavek zadavatele na skutečné interprety a fotografie má přednost před větou školního dokumentu o výhradně AI obsahu; tým má rozdíl při obhajobě vysvětlit.

Příklady promptů: „asymetrický festivalový web v CZ/EN“, „sjednotit jeden, dva a tři dny“, „VIP a Regular s ručním výběrem sedadla“, „kemp jako místo plus počet osob“, „promo pouze na vstupenky“ a „podklady podle cvičení“. Přijata byla vlastní identita, konzistentní ID a klientská architektura. Odmítnuty byly kopie cizího loga, backend odporující výslovné volbě, fiktivní cross-review a přiřazení AI tváří skutečným umělcům.

Výsledky kontrolujeme datovým validátorem, porovnáním exportu, průchody Chromium, rozborem a QR dekódováním PDF, kontrolou obrazových zdrojů a prezentačních souborů. Aktuální výsledky a přeskočené kontroly jsou ve validation_report.md; počty starší revize se nepřenášejí bez opakování. Přímý file:// test zde blokuje spravovaná politika a není označen za úspěšný. Plný audit se čtečkou, všechna fyzická zařízení a testy s návštěvníky nejsou doloženy.

Přínosem AI je rychlé připravení rozsahu a opakovatelných kontrol. Limitem je nutnost prověřit jména, fotografie, licence, překlady, kalkulaci a vazby. Odpovědnost za odevzdání zůstává týmu; dokumentace nemůže potvrdit neproběhlé konzultace nebo chybějící uživatelský výzkum.
