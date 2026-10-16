# Cvičení 03 — poznámky k prezentaci

UX návrh a interaktivní prototyp

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Text upravte podle skutečné práce a jmen členů týmu. Nevydávejte podklady za historický záznam.

## 1. Nejdřív cesta. Potom grafika.

Připravili jsme interaktivní wireframe, který lze otevřít přímo v prohlížeči. Záměrně je jednodušší než finální vizuální návrh, abychom mohli hodnotit navigaci a práci s programem. Nejde o skutečně archivovanou dřívější verzi, ale o nově sestavený reprezentativní milník. Oproti specifikaci jsou nyní přímo průchozí dva scénáře: sestavení programu a vyhledání interpreta. Používáme stejná obsahová data, takže prototyp není jen několik vymyšlených karet.

## 2. Interaktivita řeší potřebu.

Navržené funkce navazují přímo na potřeby ze specifikace. Kombinace dne a scény zkracuje program na relevantní část. Oblíbené umožní vrátit se k rozhodnutí a jsou uchované v prohlížeči. Hledání funguje podle části názvu bez ohledu na velikost písmen a diakritiku. Kontextový detail přidává další smysluplnou interakci: z interpreta vede ke koncertu. Samotnou navigaci ani dekorativní pohyb nepočítáme jako jednu ze tří požadovaných funkcí.

## 3. Malý displej je výchozí.

Pro mobil nezačínáme zmenšeným desktopem. Základ tvoří jeden sloupec, krátká navigace a jasné pořadí: identita, hledání, obsah. Filtry i tlačítka se mají zalamovat bez horizontálního posouvání celé stránky. Desktop používá tentýž obsah, jen nabízí více karet vedle sebe. Grid řeší obsahové seznamy a Flexbox navigaci. Už ve wireframu mají formuláře popisky a ovládání viditelný focus. To je levnější ověřit před dopracováním grafiky.

## 4. S1 / Od přehledu k výběru.

V první krátké ukázce otevřeme Program, vybereme první srpen a River Stage. Na výsledku ověříme datum a scénu, ne pouze počet karet. Jeden koncert uložíme a zapneme filtr Jen uložené. Po obnovení je uložený výběr znovu k dispozici. Projdeme také stav bez výsledků, aby bylo jasné, jak filtr změnit. Konkrétní průchod a jeho výsledek popisuje přiložený prototypový validační záznam; test ve vývojovém prohlížeči neznamená test na všech zařízeních.

## 5. S2 / Od části názvu ke koncertu.

Ve druhé ukázce zadáme Neon do globálního hledání. Výsledky oddělují účinkující od souvisejících vystoupení. U Neon Wave otevřeme dialog s žánrem, popisem a programem. Odkaz do programu zachová kontext interpreta. Kontrolujeme, že údaje pocházejí ze stejné základny a dialog lze zavřít klávesou Escape. Hledaný text se nevkládá jako spustitelné HTML. Návštěvník dostane srozumitelnou zprávu i tehdy, když hledání nic nenajde.

## 6. Co prototyp ověřuje?

Prototyp ověřuje informační architekturu a dva klíčové průchody. Jeho datové minimum kontroluje builder a browserový test prochází filtry, hledání, uložení i dialog. AI pomohla s návrhem a kódem, ale nepovažujeme její návrh za důkaz použitelnosti. Přijali jsme jednoduché bloky, propojení dat a funkční stavy. Odmítli jsme předstírat nákup v nehotovém wireframu. Skutečné rozhovory s návštěvníky ani testování na fyzickém telefonu nebyly dodány. Další milník ukazuje finální vzhled a širší funkce.
