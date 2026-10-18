# Progress 02 — interaktivní prototyp

## Co je připraveno

`prototype/index.html` je nově sestavený spustitelný wireframe. Otevře se přímo
v prohlížeči bez instalace. Obsahuje úvod, program, účinkující, scény, informace
a vyhledávání. Datový soubor `prototype/data.js` je přiložený export aktuálního
XML. Prototyp ukazuje informační hierarchii; nepředstavuje historicky odevzdanou verzi.

## Funkce a potřeby

| Funkce | Uživatelská potřeba | Scénář |
| --- | --- | --- |
| Filtr dne a scény | Najít relevantní koncerty místo celého programu | S1 |
| Osobní program | Uchovat vybraná vystoupení po obnovení | S1 |
| Vyhledávání názvu a textu | Najít konkrétní kapelu i podle části názvu | S2 |
| Detail účinkujícího a jeho vystoupení | Zjistit čas a scénu v souvislostech | S2 |

## Průchod dvěma klíčovými scénáři

S1: Úvod → Program → den 1. 8. → River Stage → přidat akci → zapnout „Jen
uložené“ → obnovit stránku. Očekáváme zachovaný výběr a správný filtr.

S2: Do hledání napsat „DARKZY“ → otevřít interpreta DARKZY → jeho detail →
zobrazit související program. Očekáváme jméno, žánr a programové vazby ze stejné datové základny.

## Mobilní a desktopová varianta

Výchozí rozložení je jeden sloupec. Navigace a filtry se zalamují, seznam karet
se při dostatku místa rozšiřuje pomocí CSS Grid. Formulářová pole mají popisky,
ovládání viditelný focus, dialog funguje z klávesnice. Nejde jen o menu nebo slideshow:
funkce přímo mění výběr dat a uchovávají uživatelské rozhodnutí.

## Co bylo ověřeno a jak

Builder kontroluje přítomnost 3 dnů, 3 scén, 60 interpretů, 60 akcí a platné
vazby dat. Samostatný prototypový smoke test prochází filtry, uložení programu,
hledání a dialog; jeho výsledek je v `prototype-validation.md`. Teprve záznam
provedeného testu lze uvádět jako důkaz. Vizuální návrh nenahrazuje test
s reálnými uživateli. Rozhovory ani testování na fyzickém telefonu nebyly doloženy.

## Rozhodnutí a odlišnosti

Wireframe úmyslně používá jednoduché bloky a typografii, aby šly ověřit cesty
S1 a S2 před finální grafikou. Nákup, jazykové mutace a PDF jsou součástí
aktuální implementace ve složkách cvičení 04/05, nikoli této redukované ukázky.

## AI a kritická kontrola

AI navrhla rozvržení, datové karty a scénáře. Přijali jsme popsanou navigaci,
ale nepřijali jsme pouhou dekorativní slideshow jako požadovanou interaktivitu.
Výsledné filtry porovnáváme s daty, perzistenci s obnovením prohlížeče a
bezpečné vykreslení se zadáním textu obsahujícího HTML. Historii práce členů týmu
a skutečné připomínky z cvičení musí doplnit původní tým.
