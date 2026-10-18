# Progress 03 — funkční implementace

## Aktuální stav

Složka `web/` obsahuje aktuální kompletní implementaci HTML/CSS/JavaScript.
Je přiložena přímo, bez instalačního kroku. Úvod, Program, Účinkující, Scény,
Info, Vyhledávání, Vstupenky, Košík a Účet tvoří navzájem propojené části.
Tento balíček byl připraven dodatečně ze současné verze; neprokazuje dřívější stav cvičení 04.

## Proti wireframu

| Wireframe | Implementace | Důvod |
| --- | --- | --- |
| Jednoduché bloky a karty | Asymetrická festivalová kompozice, vlastní logo, pohyb v úvodu | Výslovný požadavek na silnější identitu |
| Jednojazyčný obsah | Přepínač češtiny a angličtiny | Orientace zahraničních návštěvníků |
| Textové přehledy | Originální obrázky interpretů, detailní kontext | Snazší rozlišení účinkujících |
| S1 a S2 | Navíc tarify, mapa míst, košík, účet a PDF | Rozšíření scénáře S3 |
| Jednoduché zobrazení scén | Praktické informace a automatická mapa po povolení externích map | Snazší plánování cesty s možností odvolat souhlas |
| Jednoduchá hlavička | Jednořádková navigace na notebooku a odpočet do 1. srpna 2027 | Oprava zalamování a návaznost na aktuální termín |

Změny nejsou doloženým výsledkem cross-review. Vycházejí z požadavků uživatele
a technické validace. Větší vizuální změny, nová jména interpretů a posun termínu vyžadují ověřit návaznost
na schválené první dva výstupy předmětu.

## Mobile-first a současné postupy

Flexbox používáme pro navigaci, tlačítka a řádky formulářů; Grid pro karty,
výsledky a rozložení programu. Pružné šířky, `minmax` a `clamp` přizpůsobují
obsah dostupnému prostoru. Formuláře mají popisky a textové chybové stavy,
klávesnice viditelný focus a mapy míst textový popis stavu. Omezení pohybu
se promítá do animací. Konkrétní normativní zdroje a omezení ověření jsou
uvedeny v `documentation.md`; neprohlašujeme plný audit WCAG AA.

Viditelný obsah, konkrétní titulky, metadata a propojení programových entit
mají přednost před domnělými „AI SEO“ triky. Strukturovaná data mají odpovídat
viditelnému festivalu; nevymýšlíme hodnocení ani ověřeného pořadatele.

## Ověření

Přiložený `validation_report.md` zaznamenává aktuální skutečné kontroly a jejich
limity. Datový validátor kontroluje XML a webový export. Browserové průchody
ověřují načtení, hledání, filtry, stav košíku, účty, rozlišení obrazovek a PDF.
Vývojové testovací nástroje se nespouštějí při běžném otevření webu.

Bez prokázaného testu netvrdíme ověření na fyzických zařízeních, ve všech
prohlížečích, se čtečkou ani certifikaci WCAG. Pro cvičení lze ukázat S1 a S2
v obou šířkách a S3 jako doplňkový scénář.

## AI

Codex pomohl s kódem, texty, návrhem a kontrolními skripty; AI vizuály mají
evidenci v `web/images/ASSETS.md`. Příklady promptů: „asymetrická festivalová
identita s vlastním názvem“, „mobile-first program s filtrem scény“, „ověř
shodu XML a přibalených dat“. Přijaty byly originální grafika a lokální datový
export; odmítnuty kopie cizího loga a serverová integrace v klientském zadání.
AI návrh sám není důkaz správnosti: ověřujeme skutečné chování a výsledný PDF soubor.
