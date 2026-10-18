# Progress 02 — UX návrh a prototyp

**Projekt:** Prague Pulse Fest, 1.–3. srpna 2027, Výstaviště Praha.
**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek.

## Výstup a hlavní rozhodnutí

Oproti specifikaci je připravený spustitelný HTML wireframe. Otevřete
`prototype/index.html` bez instalace. Obsahuje úvod, program, účinkující,
scény, praktické informace a hledání. Přibalená data vycházejí z XML.

Mobile-first základ tvoří jeden sloupec a hlavní úkol před doplňujícím obsahem.
Na desktopu přibývají sloupce, význam ovládání se nemění. Jednoduchá grafika
umožňuje posoudit strukturu a navigaci před dopracováním vzhledu.

## Funkce a potřeby uživatelů

| Funkce | Potřeba |
| --- | --- |
| Společný filtr dne a scény | Najít relevantní část programu |
| Uložení a zobrazení osobního programu | Zachovat vlastní výběr i po obnovení |
| Hledání podle části názvu nebo popisu | Najít známého interpreta |
| Detail interpreta s odkazem na koncert | Zjistit datum, čas a scénu v souvislostech |

## Dva průchody

1. **S1 — vlastní program:** Program → 1. srpna → River Stage → uložit koncert
   → Jen uložené → obnovit stránku. Očekávání: seznam odpovídá oběma filtrům
   a uložená akce zůstane dostupná.
2. **S2 — konkrétní interpret:** Hledání „DARKZY“ → detail DARKZY → Program
   interpreta. Očekávání: správná vazba mezi jménem, datem, časem a scénou.

## Ověření a použití AI

Datová kontrola ověřuje počty, ID a reference. Browserový test prochází
filtry, uložení, obnovení, detail, bezpečné zobrazení hledaného textu a šířky
320, 768 a 1440 px. Skutečný výstup je v `prototype-validation.md`.

AI pomohla s návrhem rozložení, texty a kódem. Přijali jsme propojené filtry
a detail, upravili pořadí obsahu pro mobil a odmítli slideshow jako náhradu
smysluplné interaktivity. Výsledek ověřují uvedené akce a porovnání s daty,
nikoli samotné hodnocení AI.

Prototyp nepokrývá nákup, PDF a jazykové mutace. Nebyl doložen výzkum
s návštěvníky ani test na fyzických telefonech. Jde o nyní připravený návrhový
milník, nikoli archiv dřívějšího odevzdání.
