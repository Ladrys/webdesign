# Review — metodická šablona, dosud neprovedené hodnocení cizího projektu

**Stav: není připraveno k vydávání za dokončené cross-review.** Přidělený web
jiného týmu, jeho specifikace ani klíčové scénáře nebyly poskytnuty. Není možné
poctivě uvést 3–5 skutečných nálezů cizího webu. Po obdržení podkladů nahraďte
níže uvedené položky skutečnými výsledky a upravte prezentaci 06.

## Identifikace hodnocení — doplnit při provedení

| Údaj | Skutečná hodnota |
| --- | --- |
| Hodnocený projekt / tým | Doplnit podle přidělení |
| URL nebo název a verze balíčku | Doplnit |
| Datum a hodnotitelé | Doplnit skutečné provedení |
| Zařízení, prohlížeč a viewport | Doplnit použité podmínky |
| Dva scénáře z cizí specifikace | Doplnit přesné cíle a výchozí situace |

## Metoda 1 — heuristická evaluace podle Nielsena

Každý hodnotitel samostatně projde informační architekturu, navigaci,
obsahové seznamy, vyhledávání a formuláře. Zjištění přiřadí ke konkrétní
heuristice: viditelnost stavu systému; shoda s reálným světem; kontrola uživatele;
konzistence; prevence chyb; rozpoznání místo vybavování; efektivita; přiměřený
minimalismus; srozumitelná pomoc při chybě; nápověda. Potom tým sjednotí
duplicitní zjištění. Pouhé tvrzení „nelíbí se mi barva“ není heuristický nález.

Zdroj metody: Nielsen Norman Group, *10 Usability Heuristics for User
Interface Design*, https://www.nngroup.com/articles/ten-usability-heuristics/ .
Metoda je zde podkladem postupu, nikoli tvrzením o provedené externí rešerši cizího webu.

## Metoda 2 — kognitivní průchod

Pro každý ze dvou skutečných scénářů sepíšeme jednotlivé kroky. U každého kroku
odpovíme: bude uživatel vědět, co chce udělat; všimne si správného ovládání;
spojí si ho se svým cílem; po provedení pozná, že postoupil správně?
Zaznamenáme první překážku i případnou cestu k nápravě. Scénář opakujeme
na telefonu nebo úzkém viewportu a s klávesnicí. Takový průchod je expertní
odhad, nikoli experiment s reprezentativním vzorkem návštěvníků.

## Doplňkové kontroly

- Navigace: aktivní stránka, návrat z detailu, propojení obsahových částí.
- Mobil: 320 a 390 px, čitelnost, přetékání, velikost ovládání, menu a formuláře.
- Přístupnost: klávesnice, viditelný focus, popisky, nadpisy, alternativy obrázků.
- Konzistence: pojmenování stejných akcí a podobné ovládání stejných komponent.
- Interaktivita: prázdné výsledky, kombinace filtrů, návrat a persistence.

## Stupnice závažnosti

| Závažnost | Kritérium |
| --- | --- |
| Kritický | Brání dokončení klíčového scénáře bez rozumné náhradní cesty |
| Významný | Způsobuje opakované chyby nebo zásadní nejistotu, cesta existuje |
| Drobný | Lokální problém čitelnosti či konzistence, cíl je stále dosažitelný |

## Záznam skutečných nálezů — vyplnit

| ID | Stránka / kroky / důkaz | Metoda a pravidlo | Skutečný problém a jeho dopad | Závažnost a důvod | Doporučená úprava |
| --- | --- | --- | --- | --- | --- |
| R01 | Zatím bez cizího projektu | Doplnit | Nehodnoceno | Neurčeno | Doplnit po ověření |

Ke každému nálezu přiložte screenshot s kontextem nebo jiný reprodukovatelný
důkaz. Srovnejte očekávaný a skutečný stav. Nezadávejte citlivé údaje.

## Příklady vlastního ověření Prague Pulse Fest — nejsou peer review

Tyto příklady pomáhají použít metodu; nejsou nálezy přiděleného cizího projektu.

| Příklad | Pozorování / způsob ověření | Dopad a rozhodnutí |
| --- | --- | --- |
| Datový rozsah | Builder spočítá 3 dny, 3 scény, 60 interpretů a 60 akcí, projde reference | Dokládá obsahové minimum; nehodnotí srozumitelnost rozhraní |
| Klientská persistence | Architektura ukládá stav do localStorage, nikoli do sdíleného souboru | Údaje nejsou přenosné mezi zařízeními; jde o hranici zadání, ne závadu cizího webu |
| Skutečný cross-review chybí | V předaných podkladech není cizí projekt ani přijaté review | Nelze tvrdit zapracování připomínek; tým je doplní po skutečném hodnocení |

## Použití AI

Codex pomohl navrhnout tuto metodiku a strukturu evidence. Nenahrazuje
pozorování skutečného webu. Až bude review provedeno, uveďte které návrhy AI
byly ověřeny a přijaty, které odmítnuty a proč; každý nález musí umět tým
reprodukovat. Nevytvářejte fiktivní výpovědi testerů nebo výsledky měření.

## Osnova prezentace 06 po doplnění

1. Hodnocený projekt, 2 cíle, podmínky.
2. Dvě metody a stupnice závažnosti.
3. Nejzávažnější reálný nález s kroky a důkazem.
4. Druhý a třetí nález s dopadem.
5. Další nález a doporučená řešení podle priority.
6. AI, způsob ověření a konkrétní doporučení hodnocenému týmu.

Do doplnění je přiložená prezentace metodická příprava, nikoli hotové splnění cvičení 06.
