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

Kontroly se vztahují k této implementaci. Nepotvrzují kompletní WCAG AA audit, skutečný prodej ani právní soulad dokumentu GDPR.
