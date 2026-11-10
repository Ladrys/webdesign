# Automatické ověřování

Testy jsou volitelné autorské nástroje. Hotový web žádné testovací závislosti nepotřebuje.

- `node tests/run.cjs`: spustí oddělený Chrome a statický server, audit stránek a scénáře, následně je ukončí.
- `audit.cjs`: 14 stránek v CZ/EN, metadata, h1, duplicitní ID, překlady a pět šířek.
- `scenarios.cjs`: skutečné akce v programu, hledání, profil, vstupenky, platba, kemp, promo, PDF, kapacity, účet a file://.
- `node tests/catalogue.cjs`: shoda JSON/data.js, časové vazby a lokální odkazy HTML.
- `powershell -File tests/validate-data.ps1`: Windows XML/XSD, kořenové kopie, reference a základní pole XML proti JSON.
- `python validate_project.py`: alternativní podrobnější validátor s lxml.

[Postup a požadavky](../docs/DEVELOPMENT.md) · [Skutečné výsledky](../validation_report.md). Kontroly nezastupují externí cross-review a úplný audit přístupnosti.
