# Cvičení 04 — poznámky k prezentaci

První funkční implementace

**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Poznámky jsou příprava k mluvenému projevu; na Moodle se neodevzdávají.

## 1. První funkční implementace

[30 s] Oproti wireframu ukazujeme současný hotový web s vlastní vizuální identitou, češtinou a angličtinou a rozšířenými funkcemi. Základem zůstává HTML, CSS a JavaScript bez backendu a instalačního kroku.  Při prezentaci se zaměříme na mobilní i desktopové zobrazení, funkční navigaci a dva stejné scénáře jako v prototypu.

## 2. Co přibylo proti prototypu

[40 s] Proti wireframu máme propojený nákup. Detail interpreta používá jeho skutečné vystoupení a předvyplní den a scénu. Návštěvník může přepnout na jiné dny či společný vstup. U sedadel počet osob vychází z počtu označených míst, u stání ho zadává. Dvoudenní vstup vyžaduje dvě různé zvolené hodnoty. Změna výběru i odebrání z košíku okamžitě přepočítají cenu. Kapacita vychází z platných objednávek a před dokončením se znovu kontroluje. Stejná objednávka je zdrojem historie a PDF, včetně použitého kódu a slevy.

## 3. Mobilní a desktopové zobrazení

[40 s včetně ukázky] Ukážeme stejnou stránku v úzké a široké podobě. Flexbox se hodí na navigaci a ovládací řádky, Grid na více řad obsahových karet. Pružná typografie a sloupce využívají dostupný prostor. Zkoušíme přetékání, čitelnost, formuláře a dosah na hlavní akce. Prázdný úvod nestačí: rozhraní musí fungovat i s dlouhými názvy, chybovým stavem, otevřeným dialogem nebo naplněným košíkem. Automatické ověření šířek doplňuje vizuální kontrola těchto stavů.

## 4. Dva scénáře ve finálním rozhraní

[45 s včetně ukázky] V prvním průchodu vybereme první srpen a River Stage a uložíme koncert. Otevřeme osobní program a po obnovení ověříme zachování výběru. Potom vyhledáme DARKZY a z jeho detailu přejdeme na vstup pro jeho koncert. Ukážeme předvolenou scénu a den, zbývající kapacitu a cenu. Přidáme vstup do košíku a po odebrání zkontrolujeme nový součet. Důležité funkce nejsou pevné odkazy na náhodnou nabídku: hodnoty se odvozují z propojených objektů. Stejné kroky lze zopakovat na telefonu a klávesnicí.

## 5. Konkrétní principy UX, přístupnosti a SEO

[35 s] Přístupnost řešíme konkrétními prvky: sémantikou, popisky, focusy a chybovými zprávami. Technické SEO stojí na obsahu, jedinečných titulcích a srozumitelném propojení. JSON-LD je strojově čitelný popis festivalu vložený do stránky, nenahrazuje XML zdroj dat. Pro generativní vyhledávání nevytváříme smyšlená hodnocení ani údajně povinný speciální AI soubor. Dokumentace uvádí konkrétní zdroje Google Search Central a WAI a jejich uplatnění. Plnou shodu s WCAG bez auditu netvrdíme.

## 6. AI a kontrola implementace

[40 s] AI pomáhala s grafickým směrem, texty, kódem a testovacími skripty. Přijali jsme vlastní typografickou identitu, ale upravili navigaci a konkrétní obsah podle zpětné vazby. Nepřevzali jsme cizí logo ani serverové řešení. Validátor porovnává XML s přibalenými daty a browserové testy ověřují hledání, účty, ceny i obsazenost. PDF kontrolujeme jako skutečný soubor. Výsledky a limity uvádí validation_report.md. Skutečné fotografie mají kredity; oproti požadavku na AI obrázky jde o výslovně popsanou odchylku, nikoli AI generované portréty. Zaznamenané datové a browserové kontroly prošly; přesný rozsah je v reportu, ne v odhadu AI.
