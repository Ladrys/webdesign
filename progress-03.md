# Progress 03 — první funkční implementace

Prague Pulse Fest · Webdesign 2026/2027 · 10. listopadu 2026  
Michal Ladra · Matěj Mlejnek · Jan Martínek

## Implementovaný stav

`web/` je samostatné client-side řešení v HTML, CSS a JavaScriptu. Otevře se přímo přes `web/index.html`, bez instalace, serveru a buildu. Obsahuje 14 propojených stránek: úvod, program, účinkující a samostatný detail, scény, informace, hledání, vstupenky, košík, účet, novinky, soukromí, podmínky a grafické kredity.

Fungují filtry dne, scény, žánru a textu, osobní program s upozorněním na časové kolize, skutečné hledání a nákupní scénář hosta. Objednávka počítá cenu a kapacitu pro zvolené dny a scény a vytváří PDF. Obsah i ovládání mají českou a anglickou verzi. Zdrojová XML data obsahují 60 interpretů a 60 koncertů ve třech dnech na třech scénách.

## UX, design a aktuální doporučení

| Postup | Použití v projektu |
| --- | --- |
| Mobile-first a pružné rozložení | Grid, Flexbox, clamp a minmax; mobilní menu a viditelné hledání |
| Kontextová navigace | Interpret má vlastní URL a odkaz na koncert i správný vstup |
| Prevence chyb | Výslovná volba dvou dnů, jasná celková cena, dostupnost před dokončením |
| Menší informační zatížení | Kapacita se neopakuje u každé řádky programu |
| Přístupnost | Sémantické oblasti, popisky, focus, skip link a omezení pohybu |
| Obsah pro vyhledávače a AI | Skutečné odkazy, konkrétní metadata, statický výchozí obsah a pravdivé JSON-LD |

Rešerše 10. listopadu 2026 vychází z [WAI Page Structure](https://www.w3.org/WAI/tutorials/page-structure/), [WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/), [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) a [Google AI features](https://developers.google.com/search/docs/appearance/ai-features). Konkrétní implementaci a její limity popisují kapitoly 11 a 12 dokumentace.

## Změny proti prototypu a konzultaci

Zůstala identita festivalu, datové entity a scénáře. Přibylo úplné propojení objednávky, účet, kapacity a PDF. Na připomínku učitele se detail interpreta přesunul z pop-upu na samostatnou stránku. Hledání je v hlavičce a vede na vlastní stránku výsledků. Reálné fotografie byly podle úplného zadání nahrazeny AI ilustracemi. Nový filtr žánru používá stávající údaje, nemění program ani rozsah specifikace.

## Provedené kontroly

V reálném Chrome proběhl průchod osobním programem, hledáním DARKZY, samostatným profilem a předvoleným vstupem. Dále nákup dvou lístků, promo, kemp, zamítnutá a úspěšná simulace platby, PDF, kapacity po dnech, lokální účet a přímé spuštění z disku. Všech 14 stránek bylo kontrolováno v CZ/EN a při šířkách 320, 375, 768, 1024 a 1440 px. XML bylo validováno proti XSD. Přesný aktuální rozsah uvádí `validation_report.md`; nejde o kompletní audit WCAG.

## AI a ověření výstupů

Claude pomohl s dodanými prezentacemi, Codex s revizí kódu, textů a testů, OpenAI Image Generation s novou grafikou. Přijaty byly až ověřené opravy. Upraveny byly překlady a odkazy, odmítnuto vydávání obecných portrétů za reálné interprety a opisování historického počtu testů bez důkazu. Obrázky byly prohlédnuty a komprimovány; nákupní výpočty kontrolují konkrétní objednávky. Reprezentativní prompty jsou v dokumentaci a `web/images/ASSETS.md`.
