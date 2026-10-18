# Prague Pulse Fest

[![Kontroly projektu](https://github.com/Ladrys/webdesign/actions/workflows/validate.yml/badge.svg)](https://github.com/Ladrys/webdesign/actions/workflows/validate.yml)
[![Verze 1.0.0](https://img.shields.io/badge/verze-1.0.0-ff8155)](CHANGELOG.md)
![HTML · CSS · JavaScript](https://img.shields.io/badge/web-HTML%20%C2%B7%20CSS%20%C2%B7%20JavaScript-222222)

Responzivní web fiktivního hudebního festivalu **1.–3. srpna 2027 na Výstavišti Praha**. Česká i anglická verze, program, osobní výběr koncertů a objednávka vstupenek s PDF.

**Autoři:** Michal Ladra · Matěj Mlejnek · Jan Martínek

[Spuštění](#spuštění) · [Soubory k odevzdání](docs/ODEVZDANI.md) · [Jak projekt funguje](docs/PROJECT-GUIDE.md) · [Dokumentace](documentation.md)

![Úvodní stránka Prague Pulse Fest](preview/home.png)

## Spuštění

1. [Stáhni ZIP projektu](https://github.com/Ladrys/webdesign/archive/refs/heads/main.zip) nebo použij **Code → Download ZIP**.
2. **Rozbal celý archiv.**
3. Otevři **`web/index.html`** v prohlížeči.

Python, Node.js ani instalace balíčků nejsou pro web potřeba. Povol JavaScript a místní úložiště. Fotografie, fonty i PDF knihovny jsou přibalené; externí Google mapa vyžaduje připojení a souhlas.

## Funkce

- Program 60 vystoupení na třech scénách, filtry podle dne a scény, oblíbené koncerty.
- Vyhledávání v datech festivalu, detaily interpretů a přepínání CZ/EN.
- Výběr vstupenek na 1/2/3 dny, sedadla nebo stání, promo kódy a volitelný kemp.
- Místní účet, profil, historie objednávek a stažení PDF vstupenek i kempovacího poukazu.
- Praktické informace, offline plánek a volitelná Google mapa.

Jde o klientský školní projekt: účty a objednávky zůstávají v daném prohlížeči, platby jsou zkušební a e-mail se neodesílá. Současná vstupenka platí pro všechny scény ve vybraných dnech.

## Orientace v repozitáři

| Umístění | Účel |
| --- | --- |
| [`web/`](web/) | Hotový web; začni souborem `index.html`. |
| [`data/festival.xml`](data/festival.xml) | Zdrojová data; kořenový `data.xml` je kopie pro odevzdání. |
| [`API/`](API/) | XML schémata, XSLT, JSON příklady a OpenAPI z datové části; nejde o běžící server. |
| [`prototype/`](prototype/) | Jednoduchý interaktivní wireframe pro ověření scénářů. |
| [`course-source/`](course-source/) | Upravitelné podklady prezentací a průběžných zpráv. |
| [`odevzdani/`](odevzdani/README.md) | Připravené složky pro cvičení 2–6 a finální projekt. |
| [`tests/`](tests/README.md) · [`tools/`](tools/README.md) | Volitelné vývojové kontroly a generátory podkladů. |
| [`docs/`](docs/PROJECT-GUIDE.md) · [`review/`](review/) | Průvodce soubory, dokumentace a záznamy hodnocení. |

Podrobný [průvodce vysvětluje jednotlivé soubory, funkce, ukládání dat i rozdíl mezi XML, JSON a JSON-LD](docs/PROJECT-GUIDE.md). [Vývojový návod](docs/DEVELOPMENT.md) popisuje instalaci Pythonu a spuštění testů. Výsledky ověření jsou v [`validation_report.md`](validation_report.md); historie verzí v [`CHANGELOG.md`](CHANGELOG.md).

## Podklady do školy

[Seznam požadovaných souborů a obsahu prezentací pro každé cvičení](docs/ODEVZDANI.md) · [Projektová specifikace](project-specification.md) · [Dokumentace Word](docs/documentation.docx)

Prezentace jsou připravené jako PPTX i PDF s poznámkami pro 3–5 minut. Cvičení 6 je šablona, dokud tým nedoplní skutečné hodnocení přiděleného projektu. Údaje o historických odevzdáních ani externím review se nedoplňují odhadem.

## Zdroje

[Autoři a licence fotografií](web/images/PHOTO-CREDITS.md) · [Knihovny PDF a QR](web/vendor/README.md). Dvě fotografie CC BY-NC-SA omezují aktuální sadu na nekomerční školní použití. Účast uvedených skutečných interpretů na fiktivním festivalu není potvrzená.
