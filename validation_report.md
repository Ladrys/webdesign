# Ověření aktuální verze

Datum: 10. listopadu 2026. Ověřována byla současná pracovní kopie, nikoli historický počet kontrol ze starých prezentací. Strojově čitelný záznam: [technical-validation.json](review/technical-validation.json).

| Oblast | Provedený rozsah a výsledek |
| --- | --- |
| Stránky a jazyky | 14 stránek × čeština/angličtina = 28 průchodů; jeden h1, metadata, bez duplicitních ID, bez zaznamenaných chybějících překladů |
| Responzivita | 14 stránek × 2 jazyky × 5 šířek (320, 375, 768, 1024, 1440 px) = 140 kontrol bez vodorovného přetékání |
| Návštěvnické scénáře | 25 konkrétních kontrol v Chrome: filtry, uložení, DARKZY, samostatný profil, vstupenka, objednávka, promo, kemp, odmítnutí platby, účet a offline režim |
| Kapacity | Nákup River d1 se promítne do plánku d1, ne d2; třídenní společný vstup obsadí všechny scény a dny; fyzické sedadlo se sdílí mezi variantami |
| PDF | Skutečně vytvořené PDF, hlavička %PDF a tři stránky: dva lístky a kemp. Další export pro VIP scénář. Bez nezávislého dekódování QR v této revizi |
| Prezentační S3 | Dvě VIP sedadla na d1 a d3, PULSE10, stan pro dvě osoby: skutečný součet 2 774 Kč a vytvořené PDF |
| XML/XSD | Validace schématem, shoda kořenových kopií, 3 dny, 3 scény, 60 interpretů, 60 koncertů, reference a základní textová a číselná pole proti JSON |
| Odvozená data | Úplná rovnost čtyř JSON exportů s objektem z data.js; alespoň 30 minut na přestavbu jedné scény; místní závislosti HTML existují |
| Běh z disku | Skutečně otevřeno file:// index.html i samostatný profil prostřednictvím offline směrování |
| JavaScript | Syntax všech skriptů kontrolována node --check; ve scénářích žádná neošetřená výjimka |
| Vizuální kontrola | Aktuální desktop, mobil, AI hero a hudební mřížka; aktualizované slidy porovnány v náhledu OOXML, nikoli v nativním PowerPointu |

## Reprodukce

Podrobnosti a příkazy jsou v [DEVELOPMENT.md](docs/DEVELOPMENT.md). Hlavní příkaz je `node tests/run.cjs`; Windows datová kontrola je `powershell -File tests/validate-data.ps1`. Vývojové nástroje nejsou podmínkou spuštění webu.

## Co tento výsledek nepotvrzuje

Nejde o úplný audit WCAG AA ani certifikaci validního HTML Living Standard. Nebyla nezávisle dekódována QR data, měřena indexace vyhledávači ani testována všechna zařízení. Skutečné přijaté cross-review a jeho vypořádání zůstávají k doplnění po cvičení 6. Lokální rezervace není sdílená s jinými zařízeními a platba je simulovaná. Veřejné nasazení se potvrzuje samostatně až po jeho skutečném dokončení.
