# Cvičení 04 — poznámky k prezentaci

První funkční implementace

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Text upravte podle skutečné práce a jmen členů týmu. Nevydávejte podklady za historický záznam.

## 1. Festival má vlastní tvář.

Na wireframe navazuje kompletní současná implementace. Obsahuje výraznější vlastní identitu, tmavou celoplošnou hlavičku a skutečnou historickou fotografii Výstaviště. Identitu doplňuje typografické logo bez zvukových sloupců Prague Pulse Fest. Inspirací je obecný festivalový vizuální styl, nikoli převzetí loga nebo grafiky jiné akce. Materiály byly připraveny ze současné verze, protože skutečný historický export ze cvičení nebyl poskytnut. Při prezentaci ukážeme mobilní a desktopové zobrazení a dvě nejdůležitější cesty. Není třeba instalovat runtime nebo spouštět build. Název vracíme na Prague Pulse Fest a termín na výslovnou volbu zadavatele posouváme na 1.–3. srpna 2027. Hlavička má na notebooku hledání a navigaci v jednom řádku; odpočet pracuje s pražskou časovou zónou.

## 2. Hlavní části jsou propojené.

Implementace pokrývá třináct HTML vstupů a všechny povinné části. Program rozlišuje hlavní mezinárodní jména, českou scénu a klubovou elektroniku. Detaily mají biografii, konkrétní subžánr a hudební odkazy; ověřený profil se odlišuje od vyhledávání. Návštěvník si vybere jeden, dva libovolné nebo tři dny. VIP a Regular si ručně označí v mapě, stání vybírá počtem. Kemp se přidává v košíku. Soukromí, Podmínky a Kredity mají vlastní stránky, praktické Info se soustředí na návštěvu.

## 3. Flexbox i Grid mají své místo.

Ano, Flexbox se pro tento web hodí, zejména pro navigaci a řady ovládacích prvků. Pro více řad karet je vhodnější Grid. Pružné velikosti a clamp přizpůsobují typografii prostoru, místo pevného navrhování pro konkrétní telefon. Responzivitu však nedokazuje jediný screenshot prázdného úvodu. Kontrolujeme i dlouhé názvy, otevřené menu, formuláře, dialogy a neprázdný košík. Při prezentaci vedle sebe ukážeme úzký a široký viewport stejného scénáře, aby bylo vidět, že zůstává stejná logika.

## 4. Dva scénáře předvést, ne popsat.

Zopakujeme S1 a S2 ve finálním rozhraní. Nejprve filtrujeme program a ověříme uložení osobního výběru. Potom hledáme DARKZY a přejdeme z detailu k jeho koncertu. Při ukázce sledujeme názvy, datum a scénu; efektní animace nesmí nahradit správný obsah. Krátce ukážeme klávesnici a zavření dialogu. Přístupnost není pouze kontrast: důležité je správné pořadí, popisky, zachování focusu a srozumitelná změna stavu. Plnou shodu s WCAG bez odpovídajícího auditu netvrdíme.

## 5. Zdroj dat zůstává jeden.

Ceny a model daně vycházejí z XML. Dva dny stojí součet dvou jednodenních tarifů, tři dny mají zvýhodněný balíček. Příklad: dvě dvoudenní VIP jsou 2360 korun, PULSE10 odečte 236 a stan pro dvě osoby přidá 650. Výsledek je 2774 korun; kemp se nezlevňuje. V ceně je modelová dvanáctiprocentní DPH, nikoli příplatek. Výpočet je školní model, ne právní potvrzení sazby roku 2027. PDF vypíše skutečné vybrané dny a pro kemp přidá samostatný voucher.

## 6. Kontrola má konkrétní výstup.

AI pomohla s rozvržením, texty, originální grafikou, implementací a testovacími skripty. Testy ale musí běžet proti skutečné výsledné verzi. Přiložený validační záznam uvádí konkrétní výsledek, rozsah a přeskočené kontroly. Datové minimum a reference kontrolujeme odděleně od prohlížeče. PDF posuzujeme jako soubor a ne pouze potvrzení na obrazovce. Historické odevzdání, testy s reálnými návštěvníky ani externí cross-review nejsou doloženy. Tým musí umět vysvětlit, co přijal a které limity zůstávají. Dne 18. října 2026 jsme přímo přečetli Google SEO Starter Guide, Google AI features and your website a WAI Page Structure Tutorial. Používáme konkrétní titulky, vnitřní odkazy, viditelný text, pravdivé JSON-LD a logické landmarky a nadpisy. Zvláštní AI schéma ani speciální textový soubor nejsou vyžadované. Nové fotografie jsou částečně CC BY-NC-SA: dva snímky lze použít v tomto nekomerčním školním rozsahu, nikoli automaticky pro komerční festival.
