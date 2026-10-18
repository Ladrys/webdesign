# Cvičení 04 — poznámky k prezentaci

První funkční implementace

**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Milníky jsou připravené podklady, nikoli archiv dřívějších odevzdání. Popis spolupráce a dřívější rozhodnutí upravte podle skutečného průběhu.

## 1. První funkční implementace

[30 s] Oproti wireframu ukazujeme současný hotový web s vlastní vizuální identitou, češtinou a angličtinou a rozšířenými funkcemi. Základem zůstává HTML, CSS a JavaScript bez backendu a instalačního kroku. Balíček obsahuje dnešní verzi webu, nikoli nedoložený historický stav ze cvičení. Při prezentaci se zaměříme na mobilní i desktopové zobrazení, funkční navigaci a dva stejné scénáře jako v prototypu.

## 2. Co přibylo proti prototypu

[35 s] Povinné obsahové části již neexistují jako oddělené ukázky. Z interpreta lze přejít ke koncertu a ze scény do filtrovaného programu. Hledání pokrývá všechna data včetně popisů. K jádru přibyly vstupenky na jeden, dva nebo tři dny, košík, kemp a PDF. Registrace i historie jsou lokální pro prohlížeč, účet není povinný. Nákup nyní nepředěláváme na vstupenky pro jednotlivé scény; toto rozhodnutí je ponechané k další samostatné úpravě.

## 3. Mobilní a desktopové zobrazení

[40 s včetně ukázky] Ukážeme stejnou stránku v úzké a široké podobě. Flexbox se hodí na navigaci a ovládací řádky, Grid na více řad obsahových karet. Pružná typografie a sloupce využívají dostupný prostor. Zkoušíme přetékání, čitelnost, formuláře a dosah na hlavní akce. Prázdný úvod nestačí: rozhraní musí fungovat i s dlouhými názvy, chybovým stavem, otevřeným dialogem nebo naplněným košíkem. Automatické ověření šířek doplňuje vizuální kontrola těchto stavů.

## 4. Dva scénáře ve finálním rozhraní

[50 s včetně ukázky] Nejprve předvedeme filtr prvního dne a River Stage a uložíme koncert do osobního programu. Potom přes globální hledání najdeme DARKZY, otevřeme detail a přejdeme ke koncertu. Sledujeme správnost údajů a srozumitelnost cesty, ne pouze animace. Krátce ukážeme focus klávesnice, zavření dialogu a návrat k obsahu. Stejné ID propojuje seznam i detail, takže nevznikají rozdílné ručně napsané časy. Tyto scénáře budou moci zopakovat hodnotitelé v dalším milníku.

## 5. Konkrétní principy UX, přístupnosti a SEO

[35 s] Přístupnost řešíme konkrétními prvky: sémantikou, popisky, focusy a chybovými zprávami. Technické SEO stojí na obsahu, jedinečných titulcích a srozumitelném propojení. JSON-LD je strojově čitelný popis festivalu vložený do stránky, nenahrazuje XML zdroj dat. Pro generativní vyhledávání nevytváříme smyšlená hodnocení ani údajně povinný speciální AI soubor. Dokumentace uvádí konkrétní zdroje Google Search Central a WAI a jejich uplatnění. Plnou shodu s WCAG bez auditu netvrdíme.

## 6. AI a kontrola implementace

[40 s] AI pomáhala s grafickým směrem, texty, kódem a testovacími skripty. Přijali jsme vlastní typografickou identitu, ale upravili navigaci a konkrétní obsah podle zpětné vazby. Nepřevzali jsme cizí logo ani serverové řešení. Validátor porovnává XML s přibalenými daty a browserové testy ověřují hledání, účty, ceny i obsazenost. PDF kontrolujeme jako skutečný soubor. Výsledky a limity uvádí validation_report.md. Skutečné fotografie mají kredity; oproti požadavku na AI obrázky jde o výslovně popsanou odchylku, nikoli AI generované portréty. Zaznamenané datové a browserové kontroly prošly; přesný rozsah je v reportu, ne v odhadu AI.
