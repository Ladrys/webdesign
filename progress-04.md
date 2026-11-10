# Progress 04 — verze k nezávislému hodnocení

Prague Pulse Fest · Webdesign 2026/2027 · 10. listopadu 2026  
Michal Ladra · Matěj Mlejnek · Jan Martínek

## Aktuální stav

Hodnotiteli předejte celé `web/` společně s `project-specification.md` a tímto souborem. Otevře `web/index.html`; nic neinstaluje. Hlavní části, data a interaktivita jsou dokončené. Úvod, program, 60 účinkujících a jejich samostatné profily, scény, plánek a informace tvoří propojené rozhraní v češtině a angličtině.

## Scénáře pro hodnotitele

1. V programu vyberte 1. srpna a River Stage, uložte koncert a zapněte „Jen můj program“. Obnovte stránku a ověřte zachování výběru. Vyzkoušejte také filtr žánru a prázdný výsledek.
2. V hlavním hledání zadejte `DARK`, otevřete DARKZY. Profil musí být samostatná stránka. Pokračujte na vstupenku a porovnejte předvolený den a scénu s koncertem.
3. Zvolte dvě VIP sedadla na všechny scény pro 1. a 3. srpna. V košíku přidejte stan pro dvě osoby a `PULSE10`. Výsledná cena je 2 774 Kč. Dokončete simulaci a stáhněte PDF. Druhý den se těmito lístky nesmí obsadit.

## Známé nedostatky a omezení

Kapacity, účet i objednávky jsou lokální pro prohlížeč, nesdílejí se mezi zařízeními. Nákup neprovádí platbu ani neposílá e-mail, QR nemá serverové ověření. Externí Google Maps potřebují souhlas a internet; vlastní plánek funguje offline. Některý obsah závisí na JavaScriptu. Jazykové verze nemají samostatné URL. Nebyl proveden úplný audit s asistivní technologií ani test všech fyzických zařízení.

Skutečné cross-review zatím neproběhlo. Žádná známá chyba nyní neblokuje ověřené klíčové scénáře. Hodnotitel nemá zadávat skutečné heslo používané jinde.

## Testování

Provedeny byly skutečné interakce v Chrome: S1, S2, nákup hosta, promo, kemp, odmítnutí platby, PDF a synchronizace kapacit s plánkem. Ověřeny byly samostatné a společné vstupy, sdílená fyzická sedadla, účet a přímý běh přes `file://`. Rozložení bylo kontrolováno v pěti šířkách pro 14 stránek a oba jazyky. XML/XSD a shoda exportů mají samostatnou kontrolu. Výsledky a hranice tvrzení jsou v `validation_report.md`.

## AI a vlastní kontrola

Použity byly Claude u předaných prezentací, Codex při revizi a testech a OpenAI Image Generation pro ilustrace. Opravy byly přijaty po reprodukovatelném testu, texty a grafika po obsahové a vizuální kontrole. Odstraněny byly nedoložené historické údaje o testech a fotografie neodpovídající zadání. Nálezy jiného týmu budou zapsané až po jejich skutečném obdržení.
