# Knihovny pro PDF

Lokální knihovny se načítají až při stažení vstupenek. Web za běhu nepotřebuje npm, CDN, API ani připojení k internetu. Fonty jsou vložené jako Base64 v `ticket-fonts.js`, takže k vytvoření PDF není potřeba `fetch` a soubory lze načíst i z rozbalené složky.

- **jsPDF 4.2.1**: `jspdf.umd.min.js`, licence MIT v `JSPDF-LICENSE.txt`. Zdroj: balíček `jspdf`, soubor `dist/jspdf.umd.min.js`. Odstraněn pouze odkaz na nepřibalenou vývojářskou source mapu.
- **qrcode-generator 2.0.4**: `qrcode.js`, licence MIT v `QRCODE-LICENSE.txt`. Zdroj: balíček `qrcode-generator`, soubor `dist/qrcode.js`.
- **DejaVu Sans / DejaVu Sans Bold**: původní nezměněné TTF fonty v podobě Base64 v `ticket-fonts.js`. Licence, copyright a původ v `FONT-LICENSE.txt`. Zdroj: systémový balíček `fonts-dejavu-core`, soubory `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf` a `DejaVuSans-Bold.ttf`.

Výstup má skutečný formát PDF, jednu stránku A5 na vstupenku a vložené fonty s českou diakritikou. QR kód obsahuje jen lokální identifikátor vstupenky. Každá stránka je označená jako školní ukázka a neplatná vstupenka.
