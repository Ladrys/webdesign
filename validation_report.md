# Výsledky validace – 14. října 2026

## Aktuální verze

- Datový validátor: úspěšně dokončen (XML/XSD, minimální počty, 7 transformací, 7 JSON schémat, OpenAPI a aktuální webová struktura).
- `node --check web/js/app.js`: úspěch.
- Browser test v systémovém Chromium: **85 kontrol prošlo, 1 kontrola přeskočena**.
- Devět stránek při 320, 375, 430, 768, 1024 a 1440 px bez horizontálního přetékání. Ověřen i neprázdný košík při 320 px a mobilní menu.
- 60 interpretů a 60 akcí; poslední interpret dohledatelný; dialog detailu; osobní program a persistence.
- Globální `contains`: „Neon“ vrací 25 výsledků (12 interpretů a 13 programových položek). Značky HTML v dotazu se nespustí. Praktické informace se prohledávají také.
- VIP/Regular/stání: testované ceny a součet, obsazená místa neaktivní, košík přežije navigaci, položku lze odebrat.
- Úspěšná i zamítnutá platba, host i účet, stažení textové vstupenky, opětovná kontrola dostupnosti před objednáním.
- Registrace převezme košík hosta; přihlášení odmítne nesprávné heslo; historie ukazuje pouze objednávku daného demo účtu, nikoli předchozího hosta.
- Zápis hesla používá sůl a PBKDF2 hash. Bez JavaScriptových runtime chyb v celém průchodu.
- Vizuálně prohlédnut screenshot domovské stránky. Nejde o plný vizuální audit všech kombinací.

## Omezení ověření

Přímou navigaci `file://` Chromium v tomto spravovaném prostředí odmítá s `ERR_BLOCKED_BY_ADMINISTRATOR`. Test je výslovně přeskočený, nikoli úspěšný. Web byl ověřen přes lokální statický HTTP server. Aplikace sama používá jen relativní lokální skripty a styly a žádný `fetch`, API či modulový import; je připravena pro otevření `web/index.html`, ale skutečný průchod z disku je třeba ověřit mimo tuto politiku. Nebyla měněna spravovaná politika prohlížeče.

Neproběhly testy na fyzickém telefonu, Safari/Firefox, úplná validace HTML Living Standard, audit WCAG AA se čtečkou ani externí SEO/AEO audit. Simulace nepředstavuje ověření skutečné platby či e-mailového doručení. Cross-review týmu není dodané.

## Reprodukce

Z kořene projektu spusťte `python -m http.server 8000 --bind 127.0.0.1`. V dalším terminálu `python validate_project.py`, `node --check web/js/app.js`, `python tests/browser_smoke.py`. Tyto vývojové kontroly potřebují nástroje popsané v README; samotný web žádnou instalaci nepotřebuje.

## Záznam browser testu

```text
PASS Home initialized
PASS No horizontal overflow 320px index.html
PASS No horizontal overflow 320px program.html
PASS No horizontal overflow 320px performers.html
PASS No horizontal overflow 320px venues.html
PASS No horizontal overflow 320px info.html
PASS No horizontal overflow 320px search.html?q=Neon
PASS No horizontal overflow 320px tickets.html
PASS No horizontal overflow 320px cart.html
PASS No horizontal overflow 320px account.html
PASS No horizontal overflow 375px index.html
PASS No horizontal overflow 375px program.html
PASS No horizontal overflow 375px performers.html
PASS No horizontal overflow 375px venues.html
PASS No horizontal overflow 375px info.html
PASS No horizontal overflow 375px search.html?q=Neon
PASS No horizontal overflow 375px tickets.html
PASS No horizontal overflow 375px cart.html
PASS No horizontal overflow 375px account.html
PASS No horizontal overflow 430px index.html
PASS No horizontal overflow 430px program.html
PASS No horizontal overflow 430px performers.html
PASS No horizontal overflow 430px venues.html
PASS No horizontal overflow 430px info.html
PASS No horizontal overflow 430px search.html?q=Neon
PASS No horizontal overflow 430px tickets.html
PASS No horizontal overflow 430px cart.html
PASS No horizontal overflow 430px account.html
PASS No horizontal overflow 768px index.html
PASS No horizontal overflow 768px program.html
PASS No horizontal overflow 768px performers.html
PASS No horizontal overflow 768px venues.html
PASS No horizontal overflow 768px info.html
PASS No horizontal overflow 768px search.html?q=Neon
PASS No horizontal overflow 768px tickets.html
PASS No horizontal overflow 768px cart.html
PASS No horizontal overflow 768px account.html
PASS No horizontal overflow 1024px index.html
PASS No horizontal overflow 1024px program.html
PASS No horizontal overflow 1024px performers.html
PASS No horizontal overflow 1024px venues.html
PASS No horizontal overflow 1024px info.html
PASS No horizontal overflow 1024px search.html?q=Neon
PASS No horizontal overflow 1024px tickets.html
PASS No horizontal overflow 1024px cart.html
PASS No horizontal overflow 1024px account.html
PASS No horizontal overflow 1440px index.html
PASS No horizontal overflow 1440px program.html
PASS No horizontal overflow 1440px performers.html
PASS No horizontal overflow 1440px venues.html
PASS No horizontal overflow 1440px info.html
PASS No horizontal overflow 1440px search.html?q=Neon
PASS No horizontal overflow 1440px tickets.html
PASS No horizontal overflow 1440px cart.html
PASS No horizontal overflow 1440px account.html
PASS Contains search covers 12 artists plus 13 events
PASS Search handles markup as text
PASS Search includes practical information
PASS All 60 performers loaded
PASS Last performer searchable
PASS Artist detail opens
PASS All 60 events loaded
PASS Favorites filter
PASS Favorites persist
PASS Occupied seat disabled
PASS VIP Regular standing prices total 1170
PASS Cart counter updates
PASS Filled checkout fits 320px
PASS Cart persists navigation
PASS Cart removal rerenders
PASS Declined payment preserves cart
PASS Guest checkout creates two tickets
PASS Guest email retained
PASS Ticket download available
PASS Purchased seat becomes occupied
PASS Guest cart transfers after registration
PASS Account email prefilled
PASS Registered checkout succeeds
PASS Account sees only its own order
PASS Wrong password rejected
PASS Login restores order history
PASS Password stored as salted PBKDF2 hash
PASS Mobile menu opens
PASS Checkout rechecks availability
PASS No JavaScript runtime errors: []
SKIP file:// browser policy ERR_BLOCKED_BY_ADMINISTRATOR; static HTTP checks passed
```
