# Progress 04 — verze připravená pro cross-review

**Projekt:** Prague Pulse Fest, 1.–3. srpna 2027, Výstaviště Praha.
**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek.

## Předávaný stav

Hodnotícímu týmu předejte `web/` a `project-specification.md`. Web otevřete
přes `web/index.html`; instalace ani sestavení nejsou potřebné. Obsahuje
všechny hlavní části, 60 interpretů a 60 vystoupení během tří dnů na třech
scénách.

Propojené jsou program, detaily, hledání, osobní výběr a praktické informace.
Doplňková cesta nabízí vstupenku na všechny scény nebo vybranou scénu,
košík, místní účet a stažení PDF. Main Hall má sedadla i stání, River a Club
jen stání; každá scéna má vlastní kapacitu. Hlavní
rozhodnutí zůstávají: klientské řešení, jednotný datový zdroj a objednávka
i bez registrace.

## Scénáře k nezávislému průchodu

| Scénář | Postup | Očekávaný výsledek |
| --- | --- | --- |
| S1 — osobní program | Program → 1. srpna → River Stage → uložit koncert → osobní program → obnovit | Správný den i scéna a zachovaný výběr |
| S2 — interpret a vstup | Hledat „DARKZY“ → detail → vstupenka → košík | Správný den, Club Stage, dostupnost a cena |
| S3 — objednávka hosta | 1. a 3. srpna → 2× VIP, ruční sedadla → stan pro 2 → PULSE10 → dokončení → PDF | Cena 2 360 − 236 + 650 = 2 774 Kč; dvě vybraná data a campingový voucher |

Použijte smyšlené kontakty. Vyzkoušejte mobil i desktop, klávesnici, kombinaci
filtrů, upozornění na překryvy uložených koncertů a prázdný výsledek. Vyhledávání prochází také biografie; shoda vlastního
jména v popisu interpreta je záměrná.

## Co bylo testováno

Datový validátor ověřuje XML, reference a export. Browserové testy procházejí
scénáře, formuláře, účty, ceny, dostupnost jednotlivých scén i společného
vstupu a rozlišení obrazovek; PDF se
kontroluje jako soubor. Konkrétní výsledky jsou ve `validation_report.md`.
Automatizace není externí review ani uživatelský výzkum.

## Známé limity

- Účty a obsazenost jsou místní pro prohlížeč, nesdílejí se mezi zařízeními.
- Platba je simulovaná a e-mail se automaticky neodesílá; výsledkem je PDF.
- Google mapa vyžaduje povolení externích map a připojení; k dispozici je
  také přibalený orientační plánek.
- Fiktivní kontakty a plánek nejsou skutečný pořadatel ani oficiální areál.
  Ne každý interpret má fotografii; náhradní typografie je přiznaná v Kreditech.
- Nebyl proveden úplný audit WCAG ani test všech zařízení a prohlížečů.

## AI a zadání hodnotitelům

AI pomohla s obsahem, rozhraním, kódem a testy. Přijali jsme datové vazby,
upravili mobilní stavy a součty, odmítli backend mimo zadání. Výstupy jsme
porovnávali s daty a ověřovali konkrétními kroky a výsledným PDF.

Použijte alespoň dvě formalizované metody, například Nielsenovy heuristiky
a kognitivní průchod. U nálezu uveďte stránku, kroky, očekávání, skutečný stav,
důkaz, závažnost s důvodem a návrh řešení. Odlište chybu od grafické preference.

Tento podklad vychází ze stejného současného webu jako cvičení 04. Historické
snapshoty ani přijaté externí review nebyly dodány; jejich výsledky netvrdíme.
