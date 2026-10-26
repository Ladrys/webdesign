# Progress 02 — UX návrh a interaktivní prototyp

**Prague Pulse Fest · 1.–3. srpna 2027 · Výstaviště Praha**
**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

Spustitelný HTML prototyp bez instalace. Otevření: `prototype/index.html`.
Používá stejná data odvozená z XML a klíčové sekce hotového webu: úvod, program,
účinkující, scény, praktické informace a hledání. Mobilní základ tvoří jeden
sloupec; na desktopu se karty rozšíří do více sloupců.

## Funkce a potřeby návštěvníků

| Funkce | Co návštěvníkovi umožní |
| --- | --- |
| Kombinovaný filtr dne a scény | Najít koncerty pro vlastní návštěvu |
| Osobní program | Uložit vystoupení a vrátit se k výběru po obnovení |
| Hledání části názvu, žánru nebo popisu | Najít interpreta bez přesného zápisu |
| Detail interpreta a související program | Zjistit datum, čas a scénu vystoupení |
| Výběr jednodenní vstupenky a košík | Převzít správnou scénu a den, upravit počet osob a vidět cenu |

## Dva klíčové scénáře

1. **S1 — vlastní program:** Program → 1. srpna → River Stage → uložit koncert
   → Jen uložené → obnovit stránku. Výběr zůstane zachovaný.
2. **S2 — známý interpret:** hledání „DARKZY“ → detail → vstupenka → košík.
   Návštěvník zjistí čas 1. srpna v 17:00 na Club Stage. Výběr převezme
   tento den a scénu; počet osob lze upravit a cenu zkontrolovat v košíku.

## Ověření

- **Shoda dat:** porovnání s datovou základnou — 3 dny, 3 scény, 60 interpretů
  a 60 vystoupení; detail a program používají stejná ID.
- **Filtry:** první den a River Stage odpovídají sedmi položkám v datech.
- **Průchody:** hledání → detail → koncert; uložení → obnovení stránky.
- **Výběr vstupu:** den, scéna a cena odpovídají datům; košík přepočítá
  cenu při změně počtu a odebrání položky.
- **Rozložení:** kontrola navigace a přetékání při 320, 768 a 1440 px.

## Použití AI

Codex / ChatGPT pomohl s rozložením, texty a JavaScriptem. Přijali jsme vazby
přes ID a společné filtry; upravili obsah podle scénářů a mobilního zobrazení.
Po kontrole jsme opravili chronologické řazení a odkazy scén do programu.
Výstupy jsme ověřili porovnáním s daty a automatizovanými průchody S1 a S2
v prohlížeči Chromium.
