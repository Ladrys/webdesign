# Údržba a ověření projektu

Pro **běžné otevření webu** nic neinstalujte: rozbalte ZIP a otevřete [`web/index.html`](../web/index.html). Následující příkazy jsou pouze pro autora, který chce spouštět testy nebo znovu vytvářet data a prezentace. Spouštějí se v hlavní složce repozitáře, kde je `validate_project.py`.

## Volitelné vývojové prostředí

Použijte Python 3.10 nebo novější. Python není soubor, který musí být uvnitř repozitáře; je to samostatný program instalovaný v počítači. Pokud Windows nepozná `py` nebo macOS/Linux nepozná `python3`, nejdříve nainstalujte Python z [python.org](https://www.python.org/downloads/).

Windows, PowerShell nebo příkazový řádek:

```powershell
py -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.venv\Scripts\python.exe -m playwright install chromium
```

macOS / Linux:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
.venv/bin/python -m playwright install chromium
```

Níže používá příklady Windows. Na macOS/Linux nahraďte `.venv\Scripts\python.exe` za `.venv/bin/python`. Aktivace virtuálního prostředí není potřeba. Příkaz `playwright install chromium` stáhne prohlížeč pro automatické testy, nikoli pro samotný web.

| Vývojová závislost | K čemu slouží |
| --- | --- |
| `lxml`, `PyYAML`, `jsonschema` | Validace XML/XSD, JSON schémat, transformací a OpenAPI. |
| `playwright`, Chromium | Ovládání prohlížeče při testech formulářů, překladu a responzivity. |
| `PyMuPDF` | Čtení a kontrola stažených PDF vstupenek a prezentací. |
| `python-pptx`, `reportlab` | Vytvoření a kontrola editovatelných PPTX a odpovídajících PDF. |
| `python-docx` | Vytvoření textové dokumentace ve formátu DOCX. |

Volitelné závislosti z `requirements-qr.txt` (`numpy`, `zxing-cpp`) umožní v browserových testech také dekódovat QR z vygenerovaného PDF. Nainstalujete je příkazem `.venv\Scripts\python.exe -m pip install -r requirements-qr.txt`. Bez nich proběhnou ostatní kontroly a kontrola vektorové kresby QR; nejde o plné ověření čitelnosti kódu.

## Kontroly hotové verze

```powershell
.venv\Scripts\python.exe validate_project.py
.venv\Scripts\python.exe tests/browser_smoke.py
.venv\Scripts\python.exe tests/course_materials.py --folder odevzdani
```

| Skript | Co skutečně ověřuje |
| --- | --- |
| `validate_project.py` → `main()` | XML proti XSD; minimální počty entit; sedm XSLT výstupů proti uloženým JSON; JSON proti schématům; základ OpenAPI; 13 HTML vstupů, jejich metadata a lokální závislosti; reprodukovatelnost `data.js` a shodu kořenového `data.xml`. |
| `tests/browser_smoke.py` | Otevírá skutečný web a prochází hledání, program, jazyky, soukromí, účet, košík, termíny, promo kódy, kemp, obsazenost a PDF. Kontroluje také přetékání v různých šířkách a vybrané chybové stavy. |
| `tests/course_materials.py` | Kontroluje PPTX/PDF a poznámky všech cvičení; otevře wireframe a projde jeho filtry, uložený program, detail interpreta a hledání. |

Browserové testy samy spustí dočasný statický HTTP server na volném místním portu a po testu ho ukončí. Tento server slouží testu, není přidaným backendem projektu. Testy nepoužívají skutečné platební služby a požadavky na externí mapy nahrazují místní testovací odpovědí.

Testy použijí prohlížeč z `CHROMIUM_PATH`, pokud proměnnou nastavíte; jinak existující `/usr/bin/chromium` v cloudovém prostředí, nebo Chromium stažené Playwrightem. `PULSE_TEST_ARTIFACTS` může změnit adresář snímků a PDF browserového testu; výchozí je `prague-pulse-checks` v dočasné složce systému.

Pokud spravované prostředí blokuje `file://`, test přímého otevření je označený jako přeskočený. Neznamená to, že tím byla tato konkrétní cesta ověřena. Automatické kontroly nenahrazují ruční průchod klávesnicí, kontrolu čitelnosti ani skutečné cross-review.

## Jak změnit festivalová data

1. Upravte `data/festival.xml`. Zachovejte jednoznačná ID a platné odkazy mezi dny, scénami, interprety a akcemi.
2. Pokud měníte strukturu, upravte i `data/festival.xsd` a odpovídající transformace či JSON schémata v `API/`.
3. Obnovte sedm `API/json/*.json` pomocí odpovídajících XSLT; neměňte je nezávisle na XML. Následující volitelný příkaz používá existující seznam transformací z validátoru:

```powershell
.venv\Scripts\python.exe -c "from validate_project import XML,API,xslt_pairs; from lxml import etree; x=etree.parse(str(XML)); [(API/'json'/j).write_text(str(etree.XSLT(etree.parse(str(API/'transformation'/s)))(x)),encoding='utf-8') for s,j in xslt_pairs.items()]"
```

4. Zkopírujte aktuální `data/festival.xml` do kořenového `data.xml`; při změně XSD obnovte i kořenové `festival.xsd`. Potom vytvořte webová data a ověřte jejich konzistenci:

```powershell
.venv\Scripts\python.exe -c "from pathlib import Path; import shutil; [shutil.copyfile(Path('data')/a,b) for a,b in [('festival.xml','data.xml'),('festival.xsd','festival.xsd')]]"
.venv\Scripts\python.exe tools/generate_data.py
.venv\Scripts\python.exe validate_project.py
```

`tools/generate_data.py` → `generate()` používá jen standardní knihovnu Pythonu. Interprety čte z XML; festival, scény a program načítá z odvozených JSON. Přepisuje pouze `web/js/data.js`. Po změně českých textů zkontrolujte také jejich anglickou verzi v `web/js/artist-copy.js` či `i18n.js` a odpovídající fotografie v `performer-art.js`.

## Jak obnovit prezentace a balíčky pro Moodle

Upravujte `course-source/presentations.json`, příslušné `course-source/*.md` a zdroje v `course-source/prototype/`. Souhrnná dokumentace a specifikace se kopírují z kořene. Potom spusťte:

```powershell
.venv\Scripts\python.exe tools/build_course_submissions.py --include-web
.venv\Scripts\python.exe tests/course_materials.py --folder odevzdani
```

`build_course_submissions.py` → `build()` vytvoří složky cvičení, prezentace, poznámky, drátěný model, finální balíček a `manifest.json`. `data_checks()` před exportem ověří počty a reference; třída `Deck` vykreslí stejné podklady do PPTX a PDF. Přibalené fonty nástroje jsou v `tools/fonts/`.

Výchozí export přepisuje generované složky v `odevzdani/`; ruční úpravy hotových kopií by se ztratily. Pro kontrolní export do vlastní nové složky použijte například `--output kontrolni-export --include-web`. Bez `--include-web` vzniknou podklady a prezentace, ale nepřibalí se současný web.

Souhrnná dokumentace má zdroj v `documentation.md`. Její verze ve Wordu a PDF obnoví samostatný nástroj:

```powershell
.venv\Scripts\python.exe tools/build_documentation.py
```

Výstupy jsou `docs/documentation.docx` a `docs/documentation.pdf`. Tento krok nevytváří webová data ani prezentace jednotlivých cvičení.

Po dokončení změn spusťte odpovídající kontroly, prohlédněte PDF a zkontrolujte `git diff`. Do Gitu patří zdrojové změny a potřebné hotové podklady; lokální `.venv/`, cache, dočasné logy ani hesla tam nepatří. Pro školní odevzdání používejte obsah hotové příslušné složky v `odevzdani/`, ne celý vývojový repozitář.
