# Nástroje pro údržbu

Hotový web se spouští otevřením `web/index.html`. Tyto Python skripty používá autor při změně zdrojů; návštěvník je nespouští.

| Soubor | Vstup → výstup |
| --- | --- |
| `generate_data.py` | XML interpretů a odvozené `API/json/` → přibalené `web/js/data.js`. |
| `build_course_submissions.py` | `course-source/`, data a hotový web → složky cvičení, PPTX/PDF, poznámky a finální balíček v `odevzdani/`. |
| `build_documentation.py` | `documentation.md` → souhrnná dokumentace ve Wordu a PDF v `docs/`. |
| `fonts/` | Přibalené fonty a licence pro přenosný export PDF. |

Upravujte zdroje, potom obnovte výstupy. Export školních balíčků přepisuje jejich generované kopie; bez `--include-web` nepřibalí současný web.

[Instalace závislostí a přesné příkazy](../docs/DEVELOPMENT.md) · [Datový tok a role jednotlivých souborů](../docs/PROJECT-GUIDE.md)
