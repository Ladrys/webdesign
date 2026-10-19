# Cvičení 05 — poznámky k prezentaci

Verze připravená pro review

**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Poznámky jsou příprava k mluvenému projevu; na Moodle se neodevzdávají.

## 1. Web připravený pro review

[30 s] Předáváme web, specifikaci a popis scénářů tak, aby jiný tým mohl samostatně provést hodnocení. Oproti návrhu už jsou dostupné všechny hlavní části, obě jazykové varianty a lokální objednávka s PDF.  Nyní ukážeme obsah balíčku, dva hlavní průchody a přesně vymezené limity.

## 2. Co je připravené pro review

[35 s] Hodnotitel nepotřebuje náš vývojový počítač. Rozbalí web a otevře index.html; data i knihovny jsou přibalené. Ve specifikaci najde cílové skupiny a očekávané výsledky scénářů. Důležitá rozhodnutí zůstávají stejná: klientské řešení, jednotný datový zdroj a účet jako volitelná cesta. Pro každý nález potřebujeme přesnou stránku a kroky, aby šel nezávisle zopakovat. Prohlídka screenshotů sama nestačí k ověření funkčního hledání, uloženého programu nebo objednávky.

## 3. S1: filtr a osobní program

[45 s včetně ukázky] Hodnotitel postupuje podle tohoto krátkého scénáře. Nejprve ověří, že oba filtry působí společně a ukazují jen očekávané akce. Po uložení koncertu zobrazí osobní program a obnoví stránku. Výběr se má zachovat. Stejný průchod doporučujeme na mobilní šířce i desktopu a alespoň jednou klávesnicí. Když něco nefunguje, má záznam obsahovat původní stav, kroky, očekávání, skutečný výsledek a důkaz. Pouhý obecný dojem není reprodukovatelný nález.

## 4. S2: interpret a odpovídající vstup

[45 s včetně ukázky] Druhý scénář končí odpovídající vstupenkou. Známe jméno DARKZY, v hledání otevřeme interpreta a jeho vstup. Porovnáme předvolený den a Club Stage s vystoupením v XML. Zkontrolujeme kapacitu pro tento den, vložíme vstup do košíku a ověříme cenu i rozsah. Rozsah lze změnit podle dalších plánovaných koncertů. Po odstranění položky musí celková cena odpovídat tomu, co skutečně zůstalo v košíku. Na stejné principy navazuje scénář S3 s dvěma dny, kde bez obou vybraných dat nelze pokračovat.

## 5. Testy a známé limity

[40 s] Aktuální provedené kontroly jsou v validation_report.md. Rozlišujeme datovou správnost, automatizovaný průchod a uživatelskou srozumitelnost. Lokální stav není sdílená databáze a není přenosný mezi zařízeními. Přímé file otevření blokuje politika zdejšího testovacího prostředí; zdejší testy proto používají vývojový statický server. To není runtime požadavek odevzdaného webu. Skutečnou účast interpretů ani oficiální areál netvrdíme. Nebyl proveden úplný audit WCAG, test všech prohlížečů ani výzkum s návštěvníky. Ověřují se také společné a samostatné vstupy: místo v Main Hall nelze prodat dvakrát a vyprodaný Club omezuje společný vstup, nikoli volnou River Stage.

## 6. AI, odpovědnost a zadání review

[40 s] AI výstupy neodevzdáváme bez kontroly. Přijali jsme strukturu dat a propojené scénáře, upravili součty a mobilní stavy a odmítli vytvoření vlastního backendu. Konkrétní ověření tvoří porovnání dat, browserové akce a čtení výsledného PDF. Jiný tým má použít alespoň dvě formalizované metody, například Nielsenovy heuristiky a kognitivní průchod. U každého nálezu chceme závažnost, způsob objevení, zdůvodnění a návrh úpravy. Přijaté externí review nebylo dodáno; technické testy za ně nevydáváme. Předaný validační report uvádí úspěšné technické průchody a samostatně jejich omezení.
