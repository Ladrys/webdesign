# Interní kontrola návrhu a scénářů

Tento záznam je vlastní technická a UX kontrola současného webu, nikoli přijaté cross-review od jiného týmu a nikoli posudek přiděleného cizího projektu.

## Metody

1. **Heuristická kontrola podle Nielsena:** viditelnost stavu, soulad očekávání a chování, kontrola uživatelem, konzistence, prevence a zotavení z chyb.
2. **Kognitivní průchod:** konkrétní kroky S1 (vyhledat a uložit koncert), S2 (interpret → detail → program) a S3 (1. a 3. den → vlastní sedadlo → košík a kemp → PDF), včetně alternativ zamítnutí platby a změny košíku.

| Nález | Závažnost | Jak byl zjištěn / proč vadí | Provedená úprava |
| --- | --- | --- | --- |
| Změna košíku v jiné kartě mohla vytvořit objednávku s neodsouhlaseným obsahem | Významný | Dvě lokální karty; zobrazený součet se lišil od nejnovějšího košíku | Porovnání výběru při potvrzení, přehled nové verze a opětovné odsouhlasení |
| Odebrání položky zahazovalo vyplněný formulář | Významný | Vyplnění jména/e-mailu a odebrání vstupenky | Zachování formulářového stavu při překreslení |
| Třídenní položka vyvolala chybu inicializace při návratu do košíku | Kritický | Reálná navigace s uloženým třídenním výběrem | Odstraněna nevyužitá proměnná vyhodnocující košík před definicí pravidel dne |
| Portréty se nezobrazovaly kvůli neescapované uvozovce v CSS atributu | Významný | Kontrola skutečného stylu karet a 60 unikátních pozic | Escapování hodnoty HTML atributu, znovu ověřené načtení WebP |
| Formulářový souhlas přetékal při 320 px | Významný | Browserové měření hranic; odkazy byly samostatné flex položky | Text a odkazy zabaleny do pružného bloku s korektním zalamováním |
| Výběr sedadla a oblíbené akce ztrácel focus | Významný | Ovládání Space/Tab | Focus se obnovuje podle stabilního ID; ověřeno regresní kontrolou |
| Odpočet přetékal na nejmenší šířce | Významný | Měření hranic při 320 px | Menší pružné buňky odpočtu; opakované průchody bez přetékání |
| Aktualizace počtu položek mazala ikonu košíku | Drobný | Kontrola DOM po vložení místa | Mění se pouze text počítadla, ikona a popisek zůstávají |
| Nový ročník mohl převzít obsazenost starých objednávek | Významný | Regresní scénář s objednávkou bez edition | Nová objednávka má ročník 2027; stará si zachovává 2026 v historii/PDF a neblokuje novou mapu |
| Ilustrace novinky svou přirozenou šířkou přetékala na mobilu | Významný | Měření dokumentu při 320 px a průchod článkem | Obrázky mají omezenou šířku a články pružný rozměr; kontrolováno na sedmi šířkách |
| Pravidlo pro flex přebíjelo skrytí řádku slevy | Drobný | Průchod košíkem bez promo kódu a po jeho použití | Zachována priorita atributu hidden a ověřená změna stavu |
| Neověřené fotografie by neměly doložené autorství a licenci | Významný | Kontrola zdroje všech nových obrazových podkladů | Použité pouze doložené fotografie, 18 originálních plakátů pro zbývající osoby, viditelný seznam zdrojů a licencí |


| Neúplná uložená data kempu mohla zabrat kapacitu a vytvořit chybný poukaz | Významný | Vložení poškozené objednávky do místního úložiště: chybějící počet osob/cena/datum vedly k nepravdivému doplňku | Normalizace volitelných údajů zachová koncertní vstupenky a obsazenost; neplatný kemp nevytvoří poukaz ani blokaci kempu; čitelná poznámka místo NaN |
| Neplatná uložená daňová metadata mohla vytvořit chybný rozpis | Významný | Načtení ručně poškozených částek a ověření historie i PDF | Kontrola konečných čísel a součtu; neplatný rozpis se nezobrazuje, objednávka a vstupenky zůstávají |
| Popisky plánku se protínaly s ulicí a značkou parkování | Drobný | Vizuální kontrola skutečného SVG v CZ i EN | Popis Main Hall přesunut vlevo, popisek tramvaje pod značku; nové snímky bez kolizí |
| Titulky a metadata nových právních stránek zůstaly v angličtině částečně česky | Drobný | Anglický průchod 13 stránkami a diagnostika překladů | Doplněný slovník; zopakovaný průchod má prázdný seznam chybějících překladů |

Kontroly se vztahují k této implementaci. Nepotvrzují kompletní WCAG AA audit, skutečný prodej ani právní soulad dokumentu GDPR.

## Doplnění k samostatným scénám — 19. října 2026

| Nález | Závažnost | Jak byl zjištěn / proč vadí | Provedená úprava |
| --- | --- | --- | --- |
| Společný inventář nerozlišoval kapacity scén uvedené v XML | Významný | Porovnání modelu vstupenek s daty a požadavkem na návštěvu jedné scény | Ceny a zóny scén v XML; samostatný vstup ovlivní vybranou scénu, společný pas každou zahrnutou scénu |
| Zbývající společná kapacita mohla zbytečně omezit výběr na první volná sedadla | Významný | Model s posledním místem v Club Stage a fyzicky volným sedadlem A8 v Main Hall | Oddělený počet dostupných vstupů a seznam volných sedadel; libovolné volné sedadlo lze vybrat do zbývající kapacity |
| Osobní výběr neupozorňoval na souběžné koncerty | Významný | Uložení dvou časově se překrývajících vystoupení na různých scénách | Upozornění a značky kolizí; tři závěrečné koncerty denně navazují s půlhodinou na přesun |
| Diagram v prezentaci mohl zaměnit sousední sekce za vztah rodič–potomek | Drobný | Vizuální kontrola exportované informační architektury | Každá z šesti sekcí má vlastní větev od úvodu |
| Vícedenní stání mohlo hlásit vyprodáno navzdory volné denní kapacitě | Významný | V každém ze dvou dnů zbývala jedna vstupenka, ale s různým interním číslem | Stání používá počty za každý den; čísla položek nejsou fyzicky rezervované pozice |
| Převzetí košíku mohlo sloučit dvě vstupenky na stání do jedné | Významný | Přihlášení s jednou vstupenkou S1 v košíku hosta i účtu | Druhá položka dostane nové interní číslo; počet osob a cena zůstanou zachované |

Tato doplnění vycházejí z aktuální uživatelské zpětné vazby a interního ověření. Nejde o nálezy přijatého externího cross-review.
