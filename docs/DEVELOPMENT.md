# Vývoj a ověřování

Běžný provoz: otevřete `web/index.html`. Nic z této stránky není potřeba instalovat pro spuštění webu.

## Změna dat

Upravujte `data/festival.xml`, zachovejte ID a validujte proti `data/festival.xsd`. Volitelný generátor používá standardní knihovnu Pythonu:

```powershell
py tools/generate_data.py
```

Obnoví čtyři JSON soubory, `web/js/data.js` a kořenové kopie XML/XSD. Pro podrobnější datový validátor je potřeba Python s knihovnou lxml (`py -m pip install lxml`):

```powershell
py validate_project.py
```

## Nové browserové kontroly bez npm

Pro autorské testy je potřeba Node.js 22+ a nainstalovaný Chrome. Testy nemění soubory webu ani nepotřebují npm balíčky. Používají oddělený testovací profil a lokální statický server.

```powershell
node tests/run.cjs
```

Na jiném umístění prohlížeče nastavte `CHROMIUM_PATH` na jeho spustitelný soubor. Výsledky vznikají v ignorované složce `test-artifacts/`. `tests/audit.cjs` kontroluje stránky a šířky, `tests/scenarios.cjs` provádí návštěvnické akce a PDF. Cesta `file://` se odvozuje od umístění projektu.

Po změně obsahu lze volitelně obnovit statické HTML snapshoty a snímky. Spusťte nejdříve `node tools/test-server.cjs`, v druhém terminálu příslušný nástroj a server pak ukončete Ctrl+C:

```powershell
node tools/prepare-static.cjs
node tools/capture-preview.cjs
```

Výchozí statický obsah je již přibalený; nejde o požadovaný build při spuštění webu.

## Podklady a odevzdání

`documentation.md` je hlavní zdroj dokumentace. `progress-03.md` a `progress-04.md` patří k aktuálnímu webu. Prezentace v `docs/` navazují na dodané předlohy.

Balíčky vytváří `tools/package-submissions.ps1`. Výstupy v `odevzdani/` jsou místní generované kopie a ZIP soubory, které se do GitHubu znovu neukládají. Povinnou složku review a prototyp nelze vyřadit z finálního projektu. Přijaté hodnocení se doplní až po skutečném obdržení.

## Hosting

Web lze publikovat na libovolném statickém hostingu. GitHub Pages používá obsah repozitáře a nepotřebuje vlastní backend; kořenový `index.html` odkazuje na `web/index.html`. Veřejné a lokální umístění mají samostatná úložiště. Přepnutí hostingu proto samo nepřenese lokální objednávky.
