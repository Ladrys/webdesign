# Progress 03 — první funkční implementace

**Projekt:** Prague Pulse Fest, 1.–3. srpna 2027, Výstaviště Praha.
**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek.

## Co je implementováno

Složka `web/` obsahuje klientský web v HTML, CSS a JavaScriptu. Otevře se bez
instalace a buildu. Propojuje úvod, program, účinkující s detaily, scény,
praktické info, novinky a hledání. Podporuje češtinu a angličtinu.

Fungují filtry, osobní program a objednávka hosta i přihlášeného uživatele.
Vstupenky lze vybrat na všechny scény nebo jednu scénu a jeden, dva či tři
dny; doplňkem je kemp, promo kód
a PDF. Účty, výběr i objednávky zůstávají v prohlížeči. Platba a e-mail nejsou
napojené na skutečnou službu.

## Změny proti prototypu

| Změna | Důvod |
| --- | --- |
| Vlastní tmavá identita, typografické logo, fotografie | Požadavek zadavatele na výraznější festivalový vzhled |
| Čeština a angličtina | Orientace zahraničních návštěvníků |
| Rozšířené detaily a hudební odkazy | Snazší rozhodování o programu |
| Košík, účet, kemp a PDF | Doplnění objednávkového scénáře S3 |
| Rozdílné kapacity a vstup jen na jednu scénu | Přesný rozsah nákupu a levnější alternativa společného vstupu |
| Samostatné soukromí, podmínky a kredity | Přehlednější návštěvnické informace |

Základ S1 a S2 zůstává stejný. Osobní program navíc označuje překryvy
uložených setů. Tři závěrečné koncerty denně navazují s 30 minutami na přesun.
Samostatné vstupenky scén sdílejí skutečná místa modelu se společným vstupem;
River a Club mají pouze stání, Main Hall také sedadla.

## Použité postupy a trendy

- **Responzivita:** mobile-first, Flexbox pro ovládání, Grid pro obsah,
  pružná typografie a sloupce místo pevných rozměrů zařízení.
- **Přístupnost:** sémantická struktura, nadpisy, popisky, viditelný focus,
  textové chyby a podpora omezeného pohybu.
- **SEO a AEO/GEO:** konkrétní titulky, popisy, vnitřní odkazy a JSON-LD
  odpovídající festivalu. Žádná smyšlená hodnocení ani zvláštní „AI SEO“ data.

Konkrétní použití doporučení Google Search Central a WAI i jejich zdroje
popisuje `documentation.md`. Plnou shodu s WCAG bez auditu netvrdíme.

## Testování a kontrola AI

Datový validátor porovnává XML a webový export. Browserové scénáře ověřují
hledání, filtry, uložení, navigaci, formuláře, účty, ceny a obsazenost.
Kontrola PDF čte výsledný soubor. Výsledky a podmínky jsou ve
`validation_report.md`; testování různých šířek nezastupuje všechny fyzické
telefony a prohlížeče.

AI pomohla s obsahem, rozhraním, kódem a testy. Přijata byla vlastní grafika
a export z XML, upraveny mobilní stavy, biografie a výpočty; odmítnuty kopie
cizí značky a backend mimo zadání. Fotografie mají skutečné zdroje a licence
v Kreditech. Jejich použití na přání zadavatele je odchylkou od požadavku na
AI obrázky; nevydáváme je za generované.

Balíček zachycuje současnou implementaci. Historický stav cvičení, externí
review a souhlasy s většími změnami nebyly doloženy a nejsou domýšlené.
