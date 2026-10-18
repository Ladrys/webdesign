# Cvičení 02 — poznámky k prezentaci

Projektová specifikace a data

**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Milníky jsou připravené podklady, nikoli archiv dřívějších odevzdání. Popis spolupráce a dřívější rozhodnutí upravte podle skutečného průběhu.

## 1. Projektová specifikace

[30 s] Představujeme Prague Pulse Fest, fiktivní třídenní hudební festival na pražském Výstavišti. První výstup tvoří specifikace a XML datová základna. Web má návštěvníkovi usnadnit výběr koncertů, dohledání interpreta a přípravu návštěvy. Na tomto snímku uvedeme všechny tři autory. Poznámka k původu materiálů: nynější balíčky jsou připravené podklady podle zadání, ne archiv historických odevzdání. Skutečné interprety používáme jako návrh line-upu, jejich účast netvrdíme.

## 2. Účel webu a cílové skupiny

[35 s] Cílové skupiny rozlišujeme podle úkolu. Na místě potřebuje člověk rychlou orientaci v programu, fanoušek hledá konkrétní jméno a návštěvník Prahy cestu do areálu. Proto navrhujeme kombinované filtry, hledání, osobní program a praktické informace. Angličtina pomáhá zahraničním návštěvníkům. Výběr vstupenky je další cesta, ale účet nesmí být podmínkou jejího dokončení. Hlavním cílem úvodu je ukázat název, datum a srozumitelné odkazy k těmto úkolům.

## 3. Datová základna v XML

[35 s] Datovým zdrojem je festival.xml, pro odevzdání také data.xml. Festival obsahuje tři dny a tři scény: Main Hall, River Stage a Club Stage. Vystoupení nese datum, čas a odkazy na interpreta i scénu. ID jsou stabilní, názvy nejsou spojovacím klíčem. Generátor připravuje data pro prohlížeč; nemáme ručně udržovanou druhou verzi programu. Datové a browserové kontroly ověřují počty, unikátnost ID, reference a časové kolize uvnitř jedné scény.

## 4. Struktura a propojení obsahu

[35 s] Hlavní navigace propojuje úvod, program, účinkující, scény a praktické informace. Hledání má vlastní stránku výsledků. Detail interpreta vede na jeho koncert a detail scény na příslušný program; uživatel se nemusí vracet na začátek. Vedlejší cesta vede přes vstupenky a košík k PDF. Soukromí, podmínky a obrazové kredity patří do patičky. Struktura vychází z cílů návštěvníka, nikoli z názvů JavaScriptových souborů.

## 5. Dva klíčové uživatelské scénáře

[45 s] S1: návštěvník na telefonu zná den a scénu, ale nemá vybrané koncerty. Zvolí první srpen a River Stage, uloží akci a otevře osobní program. Očekáváme správně zúžený seznam a zachování výběru po obnovení. S2: fanoušek zná jméno DARKZY, nezná termín koncertu. Vyhledá ho, otevře detail a zjistí datum, čas i scénu. Specifikace obsahuje také S3: host vybere vstupenku a dokončí lokální objednávku s PDF. Dva první scénáře použijeme již v prototypu.

## 6. Použití AI a ověření dat

[40 s] AI pomohla připravit strukturu specifikace, obsah a datový model. Přijali jsme jednoznačná ID a upravili obsah podle potřeb návštěvníků. Odmítli jsme návrh skutečného serverového přihlašování a e-mailů, protože finální zadání vyžaduje klientské řešení. Kontrolu provádí konkrétní validátor a porovnání exportu s XML; věta „ověřila AI“ by nestačila. Limit: automatická datová kontrola neověří srozumitelnost textů ani skutečnou účast interpretů. Původ fotografií a odchylku od požadavku na AI obrázky uvádíme v dokumentaci. Zaznamenaná datová kontrola prošla: export souhlasí s XML a program má platné reference.
