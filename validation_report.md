# Výsledky ověření aktuálního redesignu

## Výsledek

**136 kontrol prošlo**, včetně skutečného stažení a rozboru PDF. Přímé otevření `file://` je v tomto spravovaném Chromium blokované politikou, proto je tato kontrola výslovně přeskočená. Nejde o chybu aplikace ani úspěšné ověření otevření z disku. Pro automatizované testy byl použit dočasný statický server, který není součástí aplikace.

- 9 stránek při 320, 375, 430, 768, 1024, 1440 a 1920 px: bez horizontálního přetékání. Samostatně ověřen neprázdný košík a účet v těchto šířkách.
- Mobilní menu, skutečné načtení lokálních fontů/grafiky, program a všech 60 interpretů.
- Hledání obsahujícího řetězce napříč daty, bezpečné zacházení s HTML v dotazu, kontextový dialog.
- Oblíbené a jejich persistence; zachování klávesového focusu při změně oblíbené akce i sedadla.
- Ceny VIP/Regular/stání, deaktivovaná obsazená místa, ukládání košíku a odebírání položek.
- Odebrání položky zachová vyplněné jméno, e-mail, souhlas i volbu výsledku platby.
- Změna košíku z jiné karty vyžaduje novou kontrolu výběru a součtu před dokončením. Místo nově obsazené v jiném lokálním záznamu nelze objednat.
- Úspěšná i zamítnutá simulace platby, host i lokální účet, převzetí košíku při registraci, odhlášení, nesprávné heslo a historie vlastního účtu.
- Heslo je uložené jako solený PBKDF2 hash; neplatný základní formát úložiště účtů nezpůsobí pád stránky.
- PDF má skutečnou hlavičku `%PDF-`, samostatnou stránku pro každou vstupenku, české jméno Žofie Černá, ID objednávky, správnou kategorii/místo a označení školní neplatné vstupenky.
- Vektorové QR kódy byly skutečně dekódovány a odpovídají identifikátorům jednotlivých vstupenek. Neobsahují osobní údaje.
- V celém průchodu žádné JavaScriptové runtime chyby a žádné požadavky na externí zdroje.
- Samostatně ověřena tvorba 264stránkového PDF (maximum 3 × 88 míst), bez backendu; přibližná velikost 802 kB, doba kolem 0,8 sekundy v testovacím Chromium. Jde o orientační údaj pro toto prostředí.
- Původní XML/XSD, minimální datové počty, 7 XSLT transformací, 7 JSON schémat, OpenAPI, aktuální webové soubory a reprodukovatelnost dat prošly `python validate_project.py`.
- Syntaktické kontroly `app.js`, `design.js` a `ticket-pdf.js` prošly.
- Vizuálně prohlédnut desktop, mobil, jednotlivé karty po odrolování a vykreslená stránka PDF. Náhledy jsou v `preview/`.

## Reprodukce

```sh
python validate_project.py
node --check web/js/app.js
node --check web/js/design.js
node --check web/js/ticket-pdf.js
python tests/browser_smoke.py
```

Browser test si dočasný statický HTTP server vytvoří a po doběhnutí zastaví sám. Používá vývojové nástroje Playwright, Chromium a PyMuPDF. Volitelný `zxing-cpp` + NumPy přidávají 4 kontroly skutečného dekódování QR (v této relaci byly dostupné v `/tmp/pulse-qr-check`). Bez decoderu projde ostatních 132 kontrol a dostupnost decoderu je uvedena jako přeskočená doplňková kontrola. Tyto závislosti nejsou potřeba pro běh webu.

## Limity

Otevření z disku mimo spravovanou politiku prohlížeče není v této relaci přímo ověřené. Aplikace má pouze relativní lokální zdroje, bez `fetch`, modulových importů nebo backendového rozhraní; při `file://` navíc používá jednu vstupní stránku kvůli místnímu úložišti. Je vhodné ručně ověřit rozbalený ZIP v cílovém prohlížeči.

Neproběhl plný audit WCAG AA se čtečkou, validátor HTML Living Standard, fyzický telefon, Safari/Firefox ani externí SEO/AEO audit. Testy nezakládají tvrzení o produkční autentizaci, skutečném prodeji nebo doručení e-mailu; tyto funkce nejsou v rozsahu uživatelem zvolené školní verze.

## Záznam browserových kontrol

```text
PASS Homepage initializes
PASS Homepage avoids the error fallback
PASS No horizontal overflow at 320px: index.html
PASS No horizontal overflow at 320px: program.html
PASS No horizontal overflow at 320px: performers.html
PASS No horizontal overflow at 320px: venues.html
PASS No horizontal overflow at 320px: info.html
PASS No horizontal overflow at 320px: search.html?q=Neon
PASS No horizontal overflow at 320px: tickets.html
PASS No horizontal overflow at 320px: cart.html
PASS No horizontal overflow at 320px: account.html
PASS No horizontal overflow at 375px: index.html
PASS No horizontal overflow at 375px: program.html
PASS No horizontal overflow at 375px: performers.html
PASS No horizontal overflow at 375px: venues.html
PASS No horizontal overflow at 375px: info.html
PASS No horizontal overflow at 375px: search.html?q=Neon
PASS No horizontal overflow at 375px: tickets.html
PASS No horizontal overflow at 375px: cart.html
PASS No horizontal overflow at 375px: account.html
PASS No horizontal overflow at 430px: index.html
PASS No horizontal overflow at 430px: program.html
PASS No horizontal overflow at 430px: performers.html
PASS No horizontal overflow at 430px: venues.html
PASS No horizontal overflow at 430px: info.html
PASS No horizontal overflow at 430px: search.html?q=Neon
PASS No horizontal overflow at 430px: tickets.html
PASS No horizontal overflow at 430px: cart.html
PASS No horizontal overflow at 430px: account.html
PASS No horizontal overflow at 768px: index.html
PASS No horizontal overflow at 768px: program.html
PASS No horizontal overflow at 768px: performers.html
PASS No horizontal overflow at 768px: venues.html
PASS No horizontal overflow at 768px: info.html
PASS No horizontal overflow at 768px: search.html?q=Neon
PASS No horizontal overflow at 768px: tickets.html
PASS No horizontal overflow at 768px: cart.html
PASS No horizontal overflow at 768px: account.html
PASS No horizontal overflow at 1024px: index.html
PASS No horizontal overflow at 1024px: program.html
PASS No horizontal overflow at 1024px: performers.html
PASS No horizontal overflow at 1024px: venues.html
PASS No horizontal overflow at 1024px: info.html
PASS No horizontal overflow at 1024px: search.html?q=Neon
PASS No horizontal overflow at 1024px: tickets.html
PASS No horizontal overflow at 1024px: cart.html
PASS No horizontal overflow at 1024px: account.html
PASS No horizontal overflow at 1440px: index.html
PASS No horizontal overflow at 1440px: program.html
PASS No horizontal overflow at 1440px: performers.html
PASS No horizontal overflow at 1440px: venues.html
PASS No horizontal overflow at 1440px: info.html
PASS No horizontal overflow at 1440px: search.html?q=Neon
PASS No horizontal overflow at 1440px: tickets.html
PASS No horizontal overflow at 1440px: cart.html
PASS No horizontal overflow at 1440px: account.html
PASS No horizontal overflow at 1920px: index.html
PASS No horizontal overflow at 1920px: program.html
PASS No horizontal overflow at 1920px: performers.html
PASS No horizontal overflow at 1920px: venues.html
PASS No horizontal overflow at 1920px: info.html
PASS No horizontal overflow at 1920px: search.html?q=Neon
PASS No horizontal overflow at 1920px: tickets.html
PASS No horizontal overflow at 1920px: cart.html
PASS No horizontal overflow at 1920px: account.html
PASS Contains search covers 12 artists plus 13 events
PASS Search treats markup as text
PASS Search includes practical information
PASS Search ignores Czech diacritics
PASS All 60 performers load
PASS The last performer is searchable
PASS Artist detail opens
PASS Artist detail closes with Escape
PASS All 60 events load
PASS Favorite toggle retains keyboard focus
PASS Favorites filter works
PASS Favorites survive reload
PASS Occupied seats are disabled
PASS Space selects a focused seat
PASS Seat selection retains keyboard focus
PASS Space deselects a focused seat
PASS VIP, Regular and standing total 1170 Kč
PASS Cart counter updates
PASS Filled checkout fits 320px
PASS Filled checkout fits 768px
PASS Filled checkout fits 1920px
PASS Cart survives navigation
PASS Removing a ticket rerenders the cart
PASS Removing a ticket preserves the entered buyer details
PASS Removing a ticket preserves consent and simulated payment choice
PASS Declined simulated payment preserves the cart
PASS Guest checkout creates two tickets
PASS Guest email is retained
PASS Ticket download uses the PDF extension
PASS Download is a genuine PDF document
PASS PDF has one page per ticket
PASS PDF page 1 includes the order ID
PASS PDF page 1 preserves the Czech buyer name
PASS PDF page 1 includes the correct place
PASS PDF page 1 includes the category
PASS PDF page 1 clearly identifies the school ticket
PASS PDF page 1 uses a landscape layout
PASS PDF page 1 contains typography
PASS PDF page 1 contains vector QR modules
PASS PDF page 1 contains one readable QR code
PASS PDF page 1 QR contains the correct ticket identifier
PASS PDF page 2 includes the order ID
PASS PDF page 2 preserves the Czech buyer name
PASS PDF page 2 includes the correct place
PASS PDF page 2 includes the category
PASS PDF page 2 clearly identifies the school ticket
PASS PDF page 2 uses a landscape layout
PASS PDF page 2 contains typography
PASS PDF page 2 contains vector QR modules
PASS PDF page 2 contains one readable QR code
PASS PDF page 2 QR contains the correct ticket identifier
PASS Purchased seats become occupied locally
PASS Guest cart transfers after registration
PASS Account email is prefilled
PASS Registered checkout succeeds
PASS Account history shows only that account's orders
PASS Populated account history fits 320px
PASS Populated account history fits 768px
PASS Populated account history fits 1920px
PASS Wrong password is rejected
PASS Local login restores order history
PASS School account stores a salted PBKDF2 hash rather than the password
PASS Mobile menu opens
PASS Mobile menu exposes its expanded state
PASS Mobile navigation reaches the program
PASS A changed local cart requires review before checkout
PASS Cart review rerenders the new selection and preserves form state
PASS Checkout rechecks local seat availability
PASS No JavaScript runtime errors: []
PASS Website assets and PDF generation need no external network requests
PASS Malformed local account storage does not break the homepage
SKIP file:// blocked by browser policy ERR_BLOCKED_BY_ADMINISTRATOR; static HTTP checks passed

136 checks passed. Artifacts: /tmp/prague-pulse-checks
```
