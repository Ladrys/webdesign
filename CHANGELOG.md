# Verze projektu

## 1.2.1 — 26. 10. 2026

- Cvičení 3 má vlastní minimální ZIP: `progress-02.md` a čtyři soubory prototypu. Volitelné prezentace a poznámky jsou mimo odevzdávací složku.
- Prototyp navazuje tmavým vzhledem a stejnými daty na hotový web. Program je chronologický a odkazy scén správně předvolí filtr.
- Scénář hledání interpreta pokračuje předvoleným jednodenním vstupem a košíkem. Cena a dostupnost se odvozují z vybrané scény a dne.

## 1.2.0 — 19. 10. 2026

- Nákup z detailu interpreta předvolí jeho scénu a den. Výběr sedadel automaticky určuje počet osob a cenu; dvoudenní vstup vyžaduje přesně dva vybrané dny.
- Přehled prodaných a zbývajících vstupů je společný pro program, detaily, scény, nákup a plánek. Košík průběžně přepočítává slevu, DPH i celkovou cenu.
- Účet zobrazuje datum registrace, umožňuje změnu hesla a obnovu pomocí náhodného kódu.
- Nové PDF uvádí údaje konkrétní vstupenky, datum nákupu a její část slevy; kemp má vlastní voucher.
- Podrobný plánek nabízí vrstvy, dotykové ovládání, přiblížení až 8× a kapacitu pro zvolený den.
- XML přímo vytváří čtyři aktuální JSON exporty a data webu. Historické API ukázky jsou odstraněné.
- Zjednodušená specifikace, prezentace a README. Složka pro cvičení 2 obsahuje pouze čtyři soubory k odevzdání; poznámky a náhled jsou samostatně.

## 1.1.0 — 19. 10. 2026

- Samostatné vstupenky a kapacity scén: Main Hall se sedadly a stáním, River Stage a Club Stage pouze se stáním. Společný pas zahrnuje všechny tři scény.
- Ceny jednotlivých scén jsou součástí XML a odvozených dat. Košík i PDF uvádějí rozsah vstupu; starší objednávky zůstávají čitelné.
- Plné koncertní sety a tři postupné večerní vrcholy denně s časem na přesun. Osobní program upozorňuje na překrývající se koncerty.
- Přehlednější festivalová prezentace, sjednocená specifikace a vysvětlení úložiště, soukromí a relace prohlížeče.

## 1.0.2 — 18. 10. 2026

- Opravené zachytávání HTTPS požadavků v testech; mapy nahrazuje místní odpověď i v současném Playwrightu. Kontrola souhlasu čeká na tuto odpověď před počítáním požadavků.

## 1.0.1 — 18. 10. 2026

- Opravené cesty ke skutečným requirements souborům v GitHub Actions cache.
- Automatické kontroly používají konkrétní Ubuntu 24.04.
- Upřesněné cesty příkazů pro PowerShell ve vývojovém návodu.

## 1.0.0 — 18. 10. 2026

První pojmenovaná verze repozitáře Prague Pulse Fest pro Webdesign.

- Klientský festivalový web s českým a anglickým rozhraním, programem, účty a PDF vstupenkami.
- Zjednodušené prezentace pro cvičení 2–6 s konkrétními scénáři, rozhodnutími, použitím AI a ověřením.
- Sjednocené autorství: Michal Ladra, Matěj Mlejnek a Jan Martínek.
- Přehledný návod k otevření webu, vysvětlení souborů a datových formátů, samostatný vývojový postup.
- Přenositelné vývojové nástroje, automatické kontroly na GitHubu a oddělení generovaných exportů v jazykových statistikách.
- Favicon používá stejnou festivalovou značku jako navigace; dlouhý technický odstavec u platby je odstraněn.

Rezervace podle jednotlivých scén se do této verze nemění. Přehled předchozí práce je dostupný v historii Git commitů.
