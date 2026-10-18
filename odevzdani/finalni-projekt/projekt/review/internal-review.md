# Interní kontrola návrhu a scénářů

Tento záznam je vlastní technická a UX kontrola současného webu, nikoli přijaté cross-review od jiného týmu a nikoli posudek přiděleného cizího projektu.

## Metody

1. **Heuristická kontrola podle Nielsena:** viditelnost stavu, soulad očekávání a chování, kontrola uživatelem, konzistence, prevence a zotavení z chyb.
2. **Kognitivní průchod:** konkrétní kroky S1 (vyhledat a uložit koncert), S2 (interpret → detail → program) a S3 (třídenní balíček → místo → košík → PDF), včetně alternativ zamítnutí platby a změny košíku.

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
| Neověřené fotografie by neměly doložené autorství a licenci | Významný | Kontrola zdroje všech nových obrazových podkladů | Použité pouze doložené fotografie, 19 originálních plakátů pro zbývající osoby, viditelný seznam zdrojů a licencí |

Kontroly se vztahují k této implementaci. Nepotvrzují kompletní WCAG AA audit, skutečný prodej ani právní soulad dokumentu GDPR.
