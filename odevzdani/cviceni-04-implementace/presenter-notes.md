# Cvičení 04 — poznámky k prezentaci

První funkční implementace

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Text upravte podle skutečné práce a jmen členů týmu. Nevydávejte podklady za historický záznam.

## 1. Festival má vlastní tvář.

Na wireframe navazuje kompletní současná implementace. Obsahuje výraznější vlastní identitu, asymetrickou kompozici a originální logo Prague Rocks Festival. Inspirací je obecný festivalový vizuální styl, nikoli převzetí loga nebo grafiky jiné akce. Materiály byly připraveny ze současné verze, protože skutečný historický export ze cvičení nebyl poskytnut. Při prezentaci ukážeme mobilní a desktopové zobrazení a dvě nejdůležitější cesty. Není třeba instalovat runtime nebo spouštět build.

## 2. Hlavní části jsou propojené.

Implementace pokrývá všechny povinné obsahové části. Účinkující mají detail a vazbu na vystoupení. Program a scény jsou propojené, vyhledávání vede k odpovídajícímu objektu. Přepínač češtiny a angličtiny pomáhá zahraničním návštěvníkům. Třídenní tarify vysvětlují, co je zahrnuto; druhou cestou je výběr konkrétních míst. Účet je dobrovolný a historie je lokální. Na úvodu nemají technické podrobnosti překrývat obsah, ale omezení objednávky musí být srozumitelné tam, kde na nich záleží.

## 3. Flexbox i Grid mají své místo.

Ano, Flexbox se pro tento web hodí, zejména pro navigaci a řady ovládacích prvků. Pro více řad karet je vhodnější Grid. Pružné velikosti a clamp přizpůsobují typografii prostoru, místo pevného navrhování pro konkrétní telefon. Responzivitu však nedokazuje jediný screenshot prázdného úvodu. Kontrolujeme i dlouhé názvy, otevřené menu, formuláře, dialogy a neprázdný košík. Při prezentaci vedle sebe ukážeme úzký a široký viewport stejného scénáře, aby bylo vidět, že zůstává stejná logika.

## 4. Dva scénáře předvést, ne popsat.

Zopakujeme S1 a S2 ve finálním rozhraní. Nejprve filtrujeme program a ověříme uložení osobního výběru. Potom hledáme Neon Wave a přejdeme z detailu k jeho koncertu. Při ukázce sledujeme názvy, datum a scénu; efektní animace nesmí nahradit správný obsah. Krátce ukážeme klávesnici a zavření dialogu. Přístupnost není pouze kontrast: důležité je správné pořadí, popisky, zachování focusu a srozumitelná změna stavu. Plnou shodu s WCAG bez odpovídajícího auditu netvrdíme.

## 5. Zdroj dat zůstává jeden.

Datová základna v XML je autoritativní. Přibalený JavaScriptový export umožňuje zobrazit program bez síťového načítání, což je důležité pro přímé otevření z disku. Generátor je pouze vývojová pomůcka. Ceny tarifů i hlavní údaje musí odpovídat XML. Objednávkový tok vytváří skutečný PDF soubor s identifikací objednávky, ale neposílá e-mail a neprovádí skutečnou platbu. Hesla, objednávky a obsazenost nemají serverové zázemí; místní účet není bezpečné sdílené přihlašování.

## 6. Kontrola má konkrétní výstup.

AI pomohla s rozvržením, texty, originální grafikou, implementací a testovacími skripty. Testy ale musí běžet proti skutečné výsledné verzi. Přiložený validační záznam uvádí konkrétní výsledek, rozsah a přeskočené kontroly. Datové minimum a reference kontrolujeme odděleně od prohlížeče. PDF posuzujeme jako soubor a ne pouze potvrzení na obrazovce. Historické odevzdání, testy s reálnými návštěvníky ani externí cross-review nejsou doloženy. Tým musí umět vysvětlit, co přijal a které limity zůstávají.
