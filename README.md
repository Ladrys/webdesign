# Prague Pulse Fest

Responzivní školní web fiktivního festivalu. Otevřete **web/index.html** v aktuálním prohlížeči. Není potřeba Node.js, instalace, build, databáze ani backend. Všechny zdroje jsou lokální; web nic nestahuje z CDN.

## Funkce

- 60 interpretů, 60 vystoupení, 3 dny a 3 scény z původních dat.
- Filtry programu, uložený osobní program, detaily interpretů a akcí.
- Globální vyhledávání `contains` v datech i praktických informacích; ignoruje velikost písmen a diakritiku.
- Interaktivní výběr VIP (590 Kč), Regular (390 Kč) a stání (190 Kč), po jednotlivých dnech.
- Košík, nákup hosta i demo účtu, simulace úspěšné/zamítnuté platby.
- Stažení textových vstupenek, tisk a otevření e-mailového konceptu.
- Registrace, přihlášení, odhlášení a vlastní historie objednávek v tomto prohlížeči.

**Jde o klientské demo.** Není to skutečný obchod ani bezpečná autentizace. E-maily se automaticky neposílají, platby se neprovádějí, rezervace se nesdílejí mezi zařízeními. Nepoužívejte osobní údaje ani skutečné heslo. Hesla se ukládají jako PBKDF2-SHA256 hash s náhodnou solí (120 000 iterací), ale uživatel má stále plnou kontrolu nad lokálním úložištěm. Bez backendu nelze zaručit pravost účtu, vstupenky ani souběžnou rezervaci.

## Volitelná vývojová kontrola

Pro automatizované testy slouží lokální statický server (není požadavkem pro spuštění webu):

```sh
cd /workspace/webdesign
python -m http.server 8000 --bind 127.0.0.1
```

V druhém terminálu:

```sh
python validate_project.py
node --check web/js/app.js
python tests/browser_smoke.py
```

Validátor používá `lxml`, `PyYAML`, `jsonschema`; browser test používá Python Playwright a systémový Chromium `/usr/bin/chromium`. Tyto nástroje jsou pouze pro vývoj. Výsledky aktuálního ověření jsou v `validation_report.md`.

`tools/generate_data.py` volitelně aktualizuje hotový `web/js/data.js` po změně zdrojových dat. Při běžném otevření webu se nespouští. Původní soubory API jsou datové a transformační podklady, nikoli běžící API. Odstraněna je pouze uživatelská stránka API ověření.

Struktura, limity, změny a použití AI jsou popsány v `documentation.md`. `prototype/` uchovává původní HTML jako historický podklad. Pro samotné spuštění můžete sdílet jen celou složku `web/`.
